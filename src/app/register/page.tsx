import { Suspense } from 'react'
import { PhoneAuthForm } from '@/components/auth/phone-auth-form'
import { AuthShell } from '@/components/auth/auth-shell'

export default function RegisterPage() {
  return (
    <AuthShell>
      <Suspense
        fallback={
          <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="w-full max-w-md animate-pulse">
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-8">
                <div className="mx-auto h-8 w-1/2 rounded bg-slate-700" />
                <div className="mt-6 space-y-4">
                  <div className="h-10 rounded bg-slate-700" />
                  <div className="h-10 rounded bg-slate-700" />
                  <div className="h-12 rounded bg-slate-700" />
                </div>
              </div>
            </div>
          </div>
        }
      >
        <PhoneAuthForm initialStep="signup" />
      </Suspense>
    </AuthShell>
  )
}
