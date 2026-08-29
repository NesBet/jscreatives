import { Suspense } from 'react'
import { PhoneAuthForm } from '@/components/auth/phone-auth-form'

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="w-full max-w-md animate-pulse">
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-8">
              <div className="h-8 bg-slate-700 rounded w-1/2 mx-auto" />
              <div className="mt-6 space-y-4">
                <div className="h-10 bg-slate-700 rounded" />
                <div className="h-10 bg-slate-700 rounded" />
                <div className="h-12 bg-slate-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <PhoneAuthForm initialStep="signup" />
    </Suspense>
  )
}
