'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface PerPageSelectorProps {
  value: number
  onChange: (value: number) => void
  options?: number[]
}

const DEFAULT_OPTIONS = [12, 24, 36, 48, 60, 72]

export function PerPageSelector({ value, onChange, options = DEFAULT_OPTIONS }: PerPageSelectorProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const width = 144 // w-36
      setCoords({ top: rect.bottom + 6, left: Math.max(8, rect.right - width) })
    }
    setOpen((o) => !o)
  }

  useEffect(() => {
    if (!open) return

    const handlePointer = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-300 transition-all duration-200 hover:border-slate-500 hover:text-white"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-slate-500">Per page</span>
        <span className="font-semibold text-white">{value}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{ top: coords.top, left: coords.left, position: 'fixed' }}
            className="z-[100] w-36 origin-top-right overflow-hidden rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-xl animate-fade-in-down"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={opt === value}
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-slate-800 ${
                  opt === value ? 'text-red-400' : 'text-slate-300'
                }`}
              >
                <span>{opt}</span>
                {opt === value && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  )
}
