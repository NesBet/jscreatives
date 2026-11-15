'use client'

import Link from 'next/link'
import { Store } from 'lucide-react'
import { useAuth } from '@/components/layout/auth-provider'
import { LogoutButton } from '@/components/auth/logout-button'

interface AdminHeaderProps {
  title: string
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-700 bg-slate-800/95 px-4 backdrop-blur sm:gap-4 sm:px-6">
      <h1 className="min-w-0 truncate text-lg font-bold text-white sm:text-xl">{title}</h1>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {user && (
          <span className="hidden max-w-48 truncate text-sm text-slate-400 md:block">
            {user.name || user.email}
          </span>
        )}
        <Link
          href="/"
          aria-label="Back to store"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-700 px-2.5 text-xs text-slate-300 transition-colors hover:bg-slate-600 hover:text-white sm:px-3"
        >
          <Store className="h-4 w-4 sm:hidden" strokeWidth={1.8} />
          <span className="hidden sm:inline">Back to Store</span>
        </Link>
        <LogoutButton tone="admin" />
      </div>
    </header>
  )
}
