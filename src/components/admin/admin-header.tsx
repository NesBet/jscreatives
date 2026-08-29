import Link from 'next/link'
import { useAuth } from '@/components/layout/auth-provider'

interface AdminHeaderProps {
  title: string
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-700 bg-slate-800/50 px-6">
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-slate-400">{user.name}</span>
        )}
        <Link
          href="/"
          className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
        >
          Back to Store
        </Link>
      </div>
    </header>
  )
}
