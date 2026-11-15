'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface PerPageSelectorProps {
  value: number
  onChange: (value: number) => void
  options?: number[]
  className?: string
}

interface MenuPosition {
  top: number
  left: number
  width: number
  maxHeight: number
}

const DEFAULT_OPTIONS = [12, 24, 36, 48, 60, 72]
const MENU_WIDTH = 144
const MENU_GAP = 6
const VIEWPORT_PADDING = 8
const OPTION_HEIGHT = 36

export function PerPageSelector({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className,
}: PerPageSelectorProps) {
  const listboxId = useId()
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<MenuPosition>({
    top: 0,
    left: 0,
    width: MENU_WIDTH,
    maxHeight: 320,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger || typeof window === 'undefined') return

    const rect = trigger.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const width = Math.min(MENU_WIDTH, viewportWidth - VIEWPORT_PADDING * 2)
    const menuHeight = Math.min(
      options.length * OPTION_HEIGHT + 8,
      viewportHeight - VIEWPORT_PADDING * 2
    )
    const spaceBelow = viewportHeight - rect.bottom - MENU_GAP - VIEWPORT_PADDING
    const spaceAbove = rect.top - MENU_GAP - VIEWPORT_PADDING
    const openAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow
    const availableHeight = Math.max(64, openAbove ? spaceAbove : spaceBelow)
    const maxHeight = Math.min(menuHeight, availableHeight)
    const top = openAbove
      ? Math.max(VIEWPORT_PADDING, rect.top - maxHeight - MENU_GAP)
      : Math.min(rect.bottom + MENU_GAP, viewportHeight - VIEWPORT_PADDING - maxHeight)
    const left = Math.min(
      Math.max(VIEWPORT_PADDING, rect.right - width),
      viewportWidth - width - VIEWPORT_PADDING
    )

    setCoords({ top, left, width, maxHeight })
  }, [options.length])

  useEffect(() => {
    if (!open) return

    updatePosition()
    const selectedIndex = options.findIndex((option) => option === value)
    requestAnimationFrame(() => {
      optionRefs.current[Math.max(selectedIndex, 0)]?.focus()
    })

    const handlePointer = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const handleViewportChange = () => updatePosition()

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [open, options, updatePosition, value])

  const openMenu = () => {
    updatePosition()
    setOpen(true)
  }

  const closeMenu = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  const moveFocus = (direction: 1 | -1) => {
    const items = optionRefs.current.filter((item): item is HTMLButtonElement => Boolean(item))
    if (items.length === 0) return

    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement)
    const nextIndex =
      currentIndex === -1
        ? direction === 1
          ? 0
          : items.length - 1
        : (currentIndex + direction + items.length) % items.length
    items[nextIndex]?.focus()
  }

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (open) closeMenu()
          else openMenu()
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            if (open) moveFocus(event.key === 'ArrowDown' ? 1 : -1)
            else openMenu()
          }
        }}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 text-sm text-slate-300 transition-all duration-200 hover:border-slate-500 hover:text-white focus-visible:border-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40 sm:w-auto sm:justify-start"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={`Items per page: ${value}`}
      >
        <span className="whitespace-nowrap text-slate-500">Per page</span>
        <span className="font-semibold text-white">{value}</span>
        <svg
          className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-label="Items per page"
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
              maxHeight: coords.maxHeight,
              position: 'fixed',
            }}
            className="z-[100] origin-top-right overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-xl animate-fade-in-down"
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                moveFocus(1)
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                moveFocus(-1)
              } else if (event.key === 'Home') {
                event.preventDefault()
                optionRefs.current[0]?.focus()
              } else if (event.key === 'End') {
                event.preventDefault()
                optionRefs.current[options.length - 1]?.focus()
              } else if (event.key === 'Tab') {
                setOpen(false)
              }
            }}
          >
            {options.map((option, index) => (
              <button
                key={option}
                ref={(element) => {
                  optionRefs.current[index] = element
                }}
                type="button"
                role="option"
                aria-selected={option === value}
                onClick={() => {
                  onChange(option)
                  closeMenu(true)
                }}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-slate-800 focus:bg-slate-800 focus:outline-none',
                  option === value ? 'text-gold-soft' : 'text-slate-300'
                )}
              >
                <span>{option}</span>
                {option === value && (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
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
