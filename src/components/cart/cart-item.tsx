'use client'

import { memo, useState } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { PRINTING_SURCHARGE } from '@/constants'

interface CartItemData {
  id: string
  quantity: number
  printingEnabled: boolean
  printingName: string | null
  printingNumber: string | null
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

interface CartItemProps {
  item: CartItemData
  onUpdateQuantity: (id: string, quantity: number) => void
  onTogglePrinting: (id: string, enabled: boolean, name?: string, number?: string) => void
  onUpdatePrinting: (id: string, name: string, number: string) => void
  onRemove: (id: string) => void
  updating?: boolean
}

function CartItemBase({ item, onUpdateQuantity, onTogglePrinting, onUpdatePrinting, onRemove, updating }: CartItemProps) {
  const [printingName, setPrintingName] = useState(item.printingName ?? "")
  const [printingNumber, setPrintingNumber] = useState(item.printingNumber ?? "")
  const [removing, setRemoving] = useState(false)
  const [imgError, setImgError] = useState(false)

  const printingIncomplete =
    item.printingEnabled && (!printingName?.trim() || !printingNumber?.trim())

  const image = item.variant.product.images[0]
  const unitPrice = Number(item.unitPrice)
  const lineTotal =
    unitPrice * item.quantity +
    (item.printingEnabled ? PRINTING_SURCHARGE * item.quantity : 0)

  const handleRemove = () => {
    setRemoving(true)
    setTimeout(() => onRemove(item.id), 200)
  }

  return (
    <div
      className={`flex gap-4 rounded-xl bg-slate-800/50 border p-4 transition-all duration-300 ${
        removing ? 'scale-95 translate-x-4 opacity-0' : 'animate-fade-in-up opacity-100'
      } ${item.printingEnabled ? 'border-red-600/30' : 'border-slate-700/50'}`}
    >
      {/* Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-900">
        <Image
          src={imgError ? '/jscreatives.webp' : (image?.url || '/jscreatives.webp')}
          alt={image?.altText || item.variant.product.club}
          fill
          onError={() => setImgError(true)}
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {item.variant.product.club}
              </h3>
              <p className="text-xs text-slate-400">
                {item.variant.product.kitType} &middot; Size {item.variant.size}
              </p>
              {item.printingEnabled && (
                <p className="mt-0.5 text-[11px] text-red-400">
                  Print: {item.printingName || "—"} #{item.printingNumber || "—"}
                </p>
              )}
            </div>
            <button
              onClick={handleRemove}
              disabled={updating}
              className="rounded p-1 text-slate-500 transition-all duration-200 hover:scale-110 hover:text-red-400 active:scale-90 disabled:opacity-40"
              aria-label="Remove item"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Printing toggle */}
          <div className="mt-3 flex items-center gap-2">
            <label className="relative inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={item.printingEnabled}
                disabled={updating}
                onChange={(e) => onTogglePrinting(item.id, e.target.checked, printingName, printingNumber)}
                className="peer sr-only"
                aria-label="Add custom printing"
              />
              <div className="h-5 w-9 rounded-full bg-slate-700 transition-all duration-300 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:duration-300 peer-checked:bg-red-600 peer-checked:after:translate-x-4" />
              <span className={`text-xs transition-colors duration-200 ${item.printingEnabled ? 'text-red-400' : 'text-slate-400'}`}>
                Custom printing (+{formatPrice(PRINTING_SURCHARGE)})
              </span>
            </label>
            {updating && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
            )}
          </div>

          {/* Printing inputs */}
          {item.printingEnabled && (
            <div className="mt-2 flex gap-2 rounded-lg border border-red-600/30 bg-red-600/5 p-2 animate-fade-in-down">
              {printingIncomplete && (
                <p className="mb-1 w-full text-[10px] text-red-400">
                  Enter a name and number to continue checkout
                </p>
              )}
              <div className="flex flex-col">
                <label htmlFor={`name-${item.id}`} className="mb-1 text-[10px] text-slate-500">Name (max 15)</label>
                <input
                  id={`name-${item.id}`}
                  type="text"
                  maxLength={15}
                  value={printingName}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^A-Za-z\s]/g, '')
                    setPrintingName(val)
                    onUpdatePrinting(item.id, val, printingNumber)
                  }}
                  placeholder="Player name"
                  className="h-8 w-32 rounded border border-slate-600 bg-slate-900 px-2 text-xs text-white placeholder:text-slate-600 transition-colors duration-200 focus:border-red-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={`num-${item.id}`} className="mb-1 text-[10px] text-slate-500">Number (max 3)</label>
                <input
                  id={`num-${item.id}`}
                  type="text"
                  maxLength={3}
                  value={printingNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setPrintingNumber(val)
                    onUpdatePrinting(item.id, printingName, val)
                  }}
                  placeholder="00"
                  className="h-8 w-20 rounded border border-slate-600 bg-slate-900 px-2 text-xs text-white placeholder:text-slate-600 transition-colors duration-200 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quantity & total */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-slate-600">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              disabled={updating || item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-slate-300 transition-all duration-150 hover:bg-slate-700 hover:text-white rounded-l-lg active:scale-90 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="flex h-8 w-8 items-center justify-center text-sm text-white border-x border-slate-600">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={updating}
              className="flex h-8 w-8 items-center justify-center text-slate-300 transition-all duration-150 hover:bg-slate-700 hover:text-white rounded-r-lg active:scale-90 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <p className="text-sm font-bold text-white transition-all duration-200">{formatPrice(lineTotal)}</p>
        </div>
      </div>
    </div>
  )
}

export const CartItem = memo(CartItemBase)
