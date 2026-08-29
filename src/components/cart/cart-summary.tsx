'use client'

import { formatPrice } from '@/lib/utils'
import { PRINTING_SURCHARGE } from '@/constants'

interface CartSummaryItem {
  quantity: number
  printingEnabled: boolean
  unitPrice: number | string
}

interface CartSummaryProps {
  items: CartSummaryItem[]
}

export function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0)
  const printingTotal = items.reduce(
    (sum, i) => sum + (i.printingEnabled ? PRINTING_SURCHARGE * i.quantity : 0),
    0
  )
  const grandTotal = subtotal + printingTotal

  return (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6 animate-fade-in-up">
      <h2 className="mb-4 text-lg font-semibold text-white">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {printingTotal > 0 && (
          <div className="flex justify-between text-slate-300 animate-fade-in-down">
            <span>Printing</span>
            <span>{formatPrice(printingTotal)}</span>
          </div>
        )}
        <div className="border-t border-slate-700 pt-3 flex justify-between font-bold text-white">
          <span>Total</span>
          <span className="text-red-500">{formatPrice(grandTotal)}</span>
        </div>
      </div>
    </div>
  )
}
