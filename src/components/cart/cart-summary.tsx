'use client'

import { formatPrice } from '@/lib/utils'

interface CartSummaryItem {
  quantity: number
  unitPrice: number | string
}

interface CartSummaryProps {
  items: CartSummaryItem[]
}

export function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0)

  return (
    <div className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]/60 p-6 animate-fade-in-up">
      <h2 className="mb-4 text-lg font-semibold text-white font-[var(--font-display)]">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Delivery</span>
          <span>Calculated after checkout</span>
        </div>
        <div className="border-t border-[var(--color-border-default)] pt-3 flex justify-between font-bold text-white">
          <span>Total</span>
          <span className="text-red-500">{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  )
}
