'use client'

import { useRef } from 'react'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  length?: number
}

function onlyDigits(raw: string): string {
  let out = ''
  for (const ch of raw) {
    if (ch >= '0' && ch <= '9') out += ch
  }
  return out
}

export function OtpInput({ value, onChange, disabled, length = 6 }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  const emit = (next: string[]) => {
    onChange(next.join('').slice(0, length))
  }

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice()
    next[index] = digit
    emit(next)
  }

  const handleChange = (index: number, raw: string) => {
    const clean = onlyDigits(raw)
    if (!clean) {
      setDigit(index, '')
      return
    }
    if (clean.length > 1) {
      const next = digits.slice()
      let i = index
      for (const ch of clean) {
        if (i >= length) break
        next[i] = ch
        i++
      }
      emit(next)
      const focusIndex = Math.min(index + clean.length, length - 1)
      refs.current[focusIndex]?.focus()
      return
    }
    setDigit(index, clean)
    if (index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const next = digits.slice()
        next[index - 1] = ''
        emit(next)
        refs.current[index - 1]?.focus()
      } else {
        setDigit(index, '')
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Paste is disabled per requirement; only single-digit manual entry allowed.
    e.preventDefault()
  }

  return (
    <div className="flex gap-2 justify-center sm:gap-3" role="group" aria-label="One time passcode">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="h-14 w-12 rounded-xl border border-slate-700 bg-slate-900/60 text-center text-2xl font-semibold text-white outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/30 disabled:opacity-50 sm:h-16 sm:w-14"
          aria-label={`Digit ${index + 1}`}
          style={{ animation: 'scale-in 0.3s var(--ease-spring) both', animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  )
}
