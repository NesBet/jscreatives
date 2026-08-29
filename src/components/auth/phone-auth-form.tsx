'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/layout/auth-provider'
import { useToast } from '@/components/ui/toast'
import { OtpInput } from '@/components/auth/otp-input'
import { EAST_AFRICA_COUNTRIES, buildE164 } from '@/constants/countries'

type Step = 'phone' | 'signup' | 'otp'
type Mode = 'login' | 'signup'

interface PhoneAuthFormProps {
  initialStep?: Step
}

/** Staggered entrance animation helper (kept in sync with globals.css keyframes). */
const fade = (delayMs: number): React.CSSProperties => ({
  animation: 'fade-in-up 0.6s var(--ease-out-expo) both',
  animationDelay: `${delayMs}ms`,
})

function CountryPhoneInput({
  id,
  label,
  countryDial,
  onCountryChange,
  phone,
  onPhoneChange,
  disabled,
}: {
  id?: string
  label: string
  countryDial: string
  onCountryChange: (value: string) => void
  phone: string
  onPhoneChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="mt-1 flex items-stretch gap-2">
        <select
          value={countryDial}
          onChange={(e) => onCountryChange(e.target.value)}
          aria-label="Country code"
          disabled={disabled}
          className="h-12 w-auto shrink-0 rounded-lg border border-slate-700 bg-slate-900/60 px-3 text-sm text-white outline-none transition-colors focus:border-red-500 disabled:opacity-50"
        >
          {EAST_AFRICA_COUNTRIES.map((c) => (
            <option key={c.iso} value={c.dial}>
              {c.flag} {c.dial} {c.name}
            </option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          value={phone}
          disabled={disabled}
          onChange={(e) => onPhoneChange(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="780237794"
          className="h-12 min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900/60 px-3 text-white outline-none transition-colors focus:border-red-500 disabled:opacity-50"
          autoComplete="tel-national"
        />
      </div>
    </div>
  )
}

export function PhoneAuthForm({ initialStep = 'phone' }: PhoneAuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const { setUser } = useAuth()
  const { toast } = useToast()

  const [step, setStep] = useState<Step>(initialStep)
  const [mode, setMode] = useState<Mode>(initialStep === 'signup' ? 'signup' : 'login')

  const [countryDial, setCountryDial] = useState('+254')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [otp, setOtp] = useState('')
  const [pendingPhone, setPendingPhone] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCreateAccount, setShowCreateAccount] = useState(false)

  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0)

  const lockTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (locked && lockedUntil) {
      const tick = () => {
        const left = Math.max(0, Math.round((lockedUntil - Date.now()) / 1000))
        setLockSecondsLeft(left)
        if (left <= 0) {
          setLocked(false)
          setLockedUntil(null)
          setAttemptsRemaining(null)
          try {
            localStorage.removeItem('js_otp_lock')
          } catch {}
          if (lockTimer.current) clearInterval(lockTimer.current)
        }
      }
      tick()
      lockTimer.current = setInterval(tick, 1000)
    }
    return () => {
      if (lockTimer.current) clearInterval(lockTimer.current)
    }
  }, [locked, lockedUntil])

  // Restore an active lock on mount so a refresh / new tab keeps the user locked
  // (the server is the source of truth — this just restores the UI immediately, and
  // any subsequent request re-checks the server too).
  useEffect(() => {
    let raf = 0
    try {
      const raw = localStorage.getItem('js_otp_lock')
      if (!raw) return
      const saved = JSON.parse(raw) as { phone?: string; mode?: Mode; lockedUntil?: number }
      const until = Number(saved.lockedUntil)
      if (!until || until <= Date.now()) {
        localStorage.removeItem('js_otp_lock')
        return
      }
      raf = requestAnimationFrame(() => {
        setPendingPhone(saved.phone || '')
        // Repopulate the phone inputs from the restored E.164 number so that a later
        // "Resend code" (which rebuilds from countryDial + phone) still works after a
        // refresh / new tab, even once the lock has expired.
        const match = EAST_AFRICA_COUNTRIES.find((c) => (saved.phone || '').startsWith(c.dial))
        if (match) {
          setCountryDial(match.dial)
          setPhone((saved.phone || '').slice(match.dial.length))
        }
        setMode(saved.mode === 'signup' ? 'signup' : 'login')
        setLocked(true)
        setLockedUntil(until)
        setAttemptsRemaining(0)
        setError('Account locked. Please try again later.')
        setStep('otp')
      })
    } catch {
      /* ignore malformed storage */
    }
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const buildPhone = useCallback(() => buildE164(countryDial, phone), [countryDial, phone])

  const resetMessages = () => {
    setError('')
    setShowCreateAccount(false)
  }

  const goToOtp = (full: string, nextMode: Mode) => {
    setPendingPhone(full)
    setMode(nextMode)
    setOtp('')
    setAttemptsRemaining(null)
    setLocked(false)
    setLockedUntil(null)
    try {
      localStorage.removeItem('js_otp_lock')
    } catch {}
    setStep('otp')
  }

  const requestOtp = useCallback(
    async (nextMode: Mode) => {
      const full = buildPhone()
      if (!phone.replace(/\D/g, '')) {
        setError('Please enter your phone number')
        return
      }
      setLoading(true)
      resetMessages()
      try {
        const res = await fetch('/api/auth/request-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: nextMode,
            phone: full,
            ...(nextMode === 'signup' ? { name, email } : {}),
          }),
        })
        const data = await res.json()

        if (res.ok) {
          if (data.locked) {
            // Server-enforced lock (per phone number, lives in the DB). Surface it and
            // persist so a page refresh / new tab re-shows the lock instead of letting
            // the user request a fresh code.
            const until = data.lockedUntil
              ? Date.parse(String(data.lockedUntil).replace(/^=/, ''))
              : Date.now() + 10 * 60 * 1000
            setPendingPhone(full)
            setMode(nextMode)
            setLocked(true)
            setLockedUntil(until)
            setAttemptsRemaining(0)
            setError(data.message || 'Account locked. Please try again later.')
            try {
              localStorage.setItem(
                'js_otp_lock',
                JSON.stringify({ phone: full, mode: nextMode, lockedUntil: until })
              )
            } catch {}
            setStep('otp')
            setLoading(false)
            return
          }
          if (nextMode === 'login' && data.registered === false) {
            toast('error', "You don't have an account")
            setShowCreateAccount(true)
            setLoading(false)
            return
          }
          if (nextMode === 'signup' && data.whatsapp === false) {
            setError(
              data.error || 'This number is not on WhatsApp. Please enter another number.'
            )
            setLoading(false)
            return
          }
          toast('success', 'Verification code sent to your WhatsApp')
          goToOtp(full, nextMode)
        } else if (res.status === 409) {
          toast('error', data.error || 'An account with this number already exists')
          setMode('login')
          setStep('phone')
        } else {
          setError(data.error || 'Could not send code. Please try again.')
        }
      } catch {
        setError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [buildPhone, phone, name, email, toast]
  )

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    requestOtp('login')
  }

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError('Please enter your full name')
      return
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    requestOtp('signup')
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          phone: pendingPhone,
          code: otp,
          ...(mode === 'signup' ? { name, email } : {}),
        }),
      })
      const data = await res.json()

       if (res.ok && data.success) {
         try {
           localStorage.removeItem('js_otp_lock')
         } catch {}
         setUser(data.user)
        toast('success', mode === 'signup' ? 'Account created successfully!' : 'Welcome back!')
        router.push(redirect)
        return
      }

      if (data.locked) {
        setLocked(true)
        setLockedUntil(data.lockedUntil ? Date.parse(String(data.lockedUntil).replace(/^=/, '')) : Date.now() + 10 * 60 * 1000)
        setError(data.message || 'Too many attempts. Account locked for 10 minutes.')
      } else {
        setAttemptsRemaining(typeof data.attemptsRemaining === 'number' ? data.attemptsRemaining : null)
        setError(data.message || 'Invalid code. Please try again.')
      }
      setOtp('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatLock = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:border-red-500/40"
          style={fade(0)}
        >
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-xl font-black text-white shadow-lg shadow-red-500/30"
            style={{ animation: 'float 6s ease-in-out infinite, glow-pulse 3s ease-in-out infinite' }}
          >
            JS
          </div>

          {step === 'phone' && (
            <>
              <h1 className="text-center text-2xl font-bold text-white" style={fade(60)}>
                Welcome Back
              </h1>
              <p className="mt-2 text-center text-sm text-slate-400" style={fade(120)}>
                Sign in with your WhatsApp number
              </p>

              {error && (
                <div
                  className="mt-4 rounded-lg border border-red-600/20 bg-red-600/10 p-3 text-sm text-red-400"
                  style={fade(0)}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-4">
                <div style={fade(180)}>
                  <CountryPhoneInput
                    id="login-phone"
                    label="Phone number"
                    countryDial={countryDial}
                    onCountryChange={setCountryDial}
                    phone={phone}
                    onPhoneChange={(v) => {
                      setPhone(v)
                      setError('')
                    }}
                  />
                </div>

                <div style={fade(240)}>
                  <Button type="submit" className="w-full" size="lg" loading={loading}>
                    Continue
                  </Button>
                </div>
              </form>

              {showCreateAccount && (
                <div
                  className="mt-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-center"
                  style={fade(0)}
                >
                  <p className="text-sm text-slate-400">No account found with this number.</p>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="mt-3 w-full"
                    onClick={() => {
                      setMode('signup')
                      setStep('signup')
                      resetMessages()
                    }}
                  >
                    Create Account
                  </Button>
                </div>
              )}

              <p className="mt-6 text-center text-sm text-slate-400" style={fade(300)}>
                By continuing you agree to receive a verification code on WhatsApp.
              </p>
            </>
          )}

          {step === 'signup' && (
            <>
              <h1 className="text-center text-2xl font-bold text-white" style={fade(60)}>
                Create Account
              </h1>
              <p className="mt-2 text-center text-sm text-slate-400" style={fade(120)}>
                Join JSCREATIVES today
              </p>

              {error && (
                <div
                  className="mt-4 rounded-lg border border-red-600/20 bg-red-600/10 p-3 text-sm text-red-400"
                  style={fade(0)}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="mt-6 space-y-4">
                <div style={fade(180)}>
                  <Input
                    label="Full Name"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setError('')
                    }}
                    required
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </div>
                <div style={fade(240)}>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div style={fade(300)}>
                  <CountryPhoneInput
                    id="signup-phone"
                    label="WhatsApp number"
                    countryDial={countryDial}
                    onCountryChange={setCountryDial}
                    phone={phone}
                    onPhoneChange={(v) => {
                      setPhone(v)
                      setError('')
                    }}
                  />
                </div>

                <div style={fade(360)}>
                  <Button type="submit" className="w-full" size="lg" loading={loading}>
                    Create Account
                  </Button>
                </div>
              </form>

              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setStep('phone')
                  resetMessages()
                }}
                className="mt-4 w-full text-center text-sm text-slate-400 transition-colors hover:text-white"
                style={fade(420)}
              >
                Already have an account? Sign in
              </button>
            </>
          )}

          {step === 'otp' && (
            <>
              <h1 className="text-center text-2xl font-bold text-white" style={fade(60)}>
                Verify Your Number
              </h1>
              <p className="mt-2 text-center text-sm text-slate-400" style={fade(120)}>
                Enter the 6-digit code sent to <span className="text-white">{pendingPhone}</span>
              </p>

              {error && (
                <div
                  className="mt-4 rounded-lg border border-red-600/20 bg-red-600/10 p-3 text-sm text-red-400"
                  style={fade(0)}
                >
                  {error}
                  {attemptsRemaining !== null && !locked && (
                    <span className="mt-1 block text-red-300/80">
                      {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining
                    </span>
                  )}
                </div>
              )}

              {locked && (
                <div
                  className="mt-4 rounded-lg border border-red-600/30 bg-red-600/15 p-3 text-center text-sm text-red-300"
                  style={fade(0)}
                >
                  Account locked. Try again in {formatLock(lockSecondsLeft)}
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="mt-6 space-y-6">
                <div style={fade(180)}>
                  <OtpInput value={otp} onChange={setOtp} disabled={loading || locked} />
                </div>

                <div style={fade(240)}>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={loading}
                    disabled={locked || otp.length !== 6}
                  >
                    Verify
                  </Button>
                </div>
              </form>

              <div className="mt-4 flex items-center justify-between text-sm" style={fade(300)}>
                <button
                  type="button"
                  onClick={() => {
                    setStep(mode === 'signup' ? 'signup' : 'phone')
                    setOtp('')
                    resetMessages()
                  }}
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => requestOtp(mode)}
                  disabled={loading || locked}
                  className="text-red-500 transition-colors hover:text-red-400 disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </>
          )}

          <p className="mt-6 text-center text-sm text-slate-400" style={fade(360)}>
            <Link href="/" className="transition-colors hover:text-white">
              Back to store
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
