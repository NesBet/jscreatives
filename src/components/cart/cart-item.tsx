'use client'

import { memo, useState } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { categoryLabel, printMethodLabel } from '@/constants'

interface CartItemData {
  id: string
  quantity: number
  unitPrice: number | string
  variant: {
    id: string
    option: string
    priceOverride: number | string | null
    product: {
      name: string
      category: string
      printMethod: string
      slug: string
      basePrice: number | string
      images: { url: string; altText?: string }[]
    }
  }
}

interface CartItemProps {
  item: CartItemData
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  updating?: boolean
}

function CartItemBase({ item, onUpdateQuantity, onRemove, updating }: CartItemProps) {
  const [removing, setRemoving] = useState(false)
  const [imgError, setImgError] = useState(false)

  const image = item.variant.product.images[0]
  const unitPrice = Number(item.unitPrice)
  const lineTotal = unitPrice * item.quantity

  const handleRemove = () => {
    setRemoving(true)
    setTimeout(() => onRemove(item.id), 200)
  }

  return (
    <div
      className={`flex gap-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]/60 p-4 transition-all duration-300 ${
        removing ? 'translate-x-4 scale-95 opacity-0' : 'animate-fade-in-up opacity-100'
      }`}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--color-bg-elevated)]">
        <Image
          src={imgError ? '/jscreatives.webp' : (image?.url || '/jscreatives.webp')}
          alt={image?.altText || item.variant.product.name}
          fill
          onError={() => setImgError(true)}
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-500">
                {categoryLabel(item.variant.product.category)}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-white">
                {item.variant.product.name}
              </h3>
              <p className="text-xs text-slate-400">
                {item.variant.option} &middot; {printMethodLabel(item.variant.product.printMethod)}
              </p>
            </div>
            <button
              onClick={handleRemove}
              disabled={updating}
              className="rounded-lg p-1.5 text-slate-500 transition-all duration-200 hover:scale-110 hover:bg-white/5 hover:text-red-400 active:scale-90 disabled:opacity-40"
              aria-label="Remove item"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-[var(--color-border-default)]">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              disabled={updating || item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-l-lg text-slate-300 transition-all duration-150 hover:bg-white/5 hover:text-white active:scale-90 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="flex h-8 w-8 items-center justify-center border-x border-[var(--color-border-default)] text-sm text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={updating}
              className="flex h-8 w-8 items-center justify-center rounded-r-lg text-slate-300 transition-all duration-150 hover:bg-white/5 hover:text-white active:scale-90 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <p className="text-sm font-bold text-white">{formatPrice(lineTotal)}</p>
        </div>
      </div>
    </div>
  )
}

export const CartItem = memo(CartItemBase)
