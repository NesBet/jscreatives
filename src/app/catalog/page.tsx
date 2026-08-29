import { Suspense } from 'react'
import { CatalogContent } from '@/components/catalog/catalog-content'

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-slate-800 rounded" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-slate-800/50">
                  <div className="aspect-square bg-slate-700 rounded-t-xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-1/2" />
                    <div className="h-3 bg-slate-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  )
}
