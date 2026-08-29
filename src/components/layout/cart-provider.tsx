'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/components/layout/auth-provider'
import { PRINTING_SURCHARGE } from '@/constants'

interface CartItem {
  id: string
  quantity: number
  printingEnabled: boolean
  printingName: string
  printingNumber: string
  unitPrice: number | string
  variant: {
    id: string
    size: string
    priceOverride: number | string | null
    product: {
      club: string
      kitType: string
      slug: string
      basePrice: number | string
      images: { url: string; altText?: string }[]
    }
  }
}

interface CartContextValue {
  items: CartItem[]
  cartCount: number
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  togglePrinting: (itemId: string, enabled: boolean, name?: string, number?: string) => Promise<void>
  updatePrinting: (itemId: string, name: string, number: string) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  loading: boolean
  updating: Set<string>
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<Set<string>>(new Set())
  const itemsRef = useRef<CartItem[]>([])
  useAuth()

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        const cartItems = data.cart?.items ?? data.items
        setItems(Array.isArray(cartItems) ? cartItems : [])
      } else {
        setItems([])
      }
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCart()
  }, [fetchCart])

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId, quantity }),
    })
    if (!res.ok) throw new Error('Failed')
    await fetchCart()
  }, [fetchCart])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    const prevItem = itemsRef.current.find((i) => i.id === itemId)
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)))
    setUpdating((prev) => new Set(prev).add(itemId))
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      if (!res.ok) throw new Error('Failed')
    } catch {
      if (prevItem) setItems((curr) => curr.map((i) => (i.id === itemId ? prevItem : i)))
    } finally {
      setUpdating((prev) => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }, [])

  const togglePrinting = useCallback(
    async (itemId: string, enabled: boolean, name?: string, number?: string) => {
      const prevItem = itemsRef.current.find((i) => i.id === itemId)
      setItems((prev) =>
        prev.map((i) => {
          if (i.id !== itemId) return i
          const base = Number(i.variant.product.basePrice)
          const unitPrice = enabled ? base + PRINTING_SURCHARGE : base
          return {
            ...i,
            printingEnabled: enabled,
            printingName: name ?? '',
            printingNumber: number ?? '',
            unitPrice,
          }
        })
      )
      setUpdating((prev) => new Set(prev).add(itemId))
      try {
        const res = await fetch(`/api/cart/${itemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            printingEnabled: enabled,
            printingName: name,
            printingNumber: number,
          }),
        })
        if (!res.ok) throw new Error('Failed')
      } catch {
        if (prevItem) setItems((curr) => curr.map((i) => (i.id === itemId ? prevItem : i)))
      } finally {
        setUpdating((prev) => {
          const next = new Set(prev)
          next.delete(itemId)
          return next
        })
      }
    },
    []
  )

  const removeItem = useCallback(async (itemId: string) => {
    const idx = itemsRef.current.findIndex((i) => i.id === itemId)
    const prevItem = itemsRef.current[idx]
    setItems((prev) => prev.filter((i) => i.id !== itemId))
    setUpdating((prev) => new Set(prev).add(itemId))
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
    } catch {
      if (prevItem)
        setItems((curr) => {
          const next = [...curr]
          next.splice(Math.min(idx, next.length), 0, prevItem)
          return next
        })
    } finally {
      setUpdating((prev) => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }, [])

  const updatePrinting = useCallback(
    async (itemId: string, name: string, number: string) => {
      const prevItem = itemsRef.current.find((i) => i.id === itemId)
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, printingName: name, printingNumber: number } : i
        )
      )
      try {
        const res = await fetch(`/api/cart/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            printingEnabled: prevItem?.printingEnabled ?? false,
            printingName: name,
            printingNumber: number,
          }),
        })
        if (!res.ok) throw new Error("Failed")
      } catch {
        if (prevItem)
          setItems((curr) => curr.map((i) => (i.id === itemId ? prevItem : i)))
      }
    },
    []
  )

  const clearCart = useCallback(async () => {
    const prev = itemsRef.current
    setItems([])
    try {
      const res = await fetch('/api/cart', { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
    } catch {
      setItems(prev)
    }
  }, [])

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        addItem,
        updateQuantity,
        togglePrinting,
        updatePrinting,
        removeItem,
        clearCart,
        loading,
        updating,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
