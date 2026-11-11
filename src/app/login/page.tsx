import { Suspense } from 'react'
import { PhoneAuthForm } from '@/components/auth/phone-auth-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex flex-1 flex-col">
        <Suspense
          fallback={
            <div className="flex min-h-[70vh] items-center justify-center px-4">
              <div className="w-full max-w-md animate-pulse">
                <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-8">
                  <div className="h-8 bg-slate-700 rounded w-1/2 mx-auto" />
                  <div className="mt-6 space-y-4">
                    <div className="h-10 bg-slate-700 rounded" />
                    <div className="h-12 bg-slate-700 rounded" />
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <PhoneAuthForm initialStep="phone" />
        </Suspense>
      </div>

      <footer className="border-t border-line bg-paper px-4 py-6">
        <p className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] font-medium tracking-[0.14em] text-stone">
          <span className="font-semibold text-ink">JSCREATIVES</span>
          <span className="text-gold" aria-hidden="true">•</span>
          <span>Design</span>
          <span className="text-gold" aria-hidden="true">•</span>
          <span>Print</span>
          <span className="text-gold" aria-hidden="true">•</span>
          <span>Brand</span>
          <span className="text-stone-light" aria-hidden="true">•</span>
          <span>&copy; All rights Reserved 2026</span>
        </p>
      </footer>
    </div>
  )
}
