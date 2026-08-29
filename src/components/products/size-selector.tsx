'use client'

import { cn } from '@/lib/utils'

interface SizeVariant {
  size: string
  stock: number
}

interface SizeSelectorProps {
  variants: SizeVariant[]
  selectedSize: string | null
  onSelect: (size: string) => void
}

export function SizeSelector({ variants, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-slate-300">Select Size</h3>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size selection">
        {variants.map((v) => {
          const outOfStock = v.stock === 0
          const lowStock = v.stock > 0 && v.stock <= 5
          const isSelected = selectedSize === v.size

          return (
            <div key={v.size} className="flex flex-col items-center">
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-disabled={outOfStock}
                disabled={outOfStock}
                onClick={() => onSelect(v.size)}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-lg border text-sm font-medium transition-all',
                  outOfStock && 'cursor-not-allowed border-slate-700 bg-slate-800/50 text-slate-600 line-through',
                  isSelected && !outOfStock && 'border-red-600 bg-red-600/10 text-red-500',
                  !isSelected && !outOfStock && 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-400 hover:text-white'
                )}
              >
                {v.size}
              </button>
              <span className="mt-1 text-[10px] text-slate-500">
                {outOfStock
                  ? 'Out'
                  : lowStock
                    ? `${v.stock} left`
                    : 'In stock'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
