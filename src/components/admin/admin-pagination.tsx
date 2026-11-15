'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PerPageSelector } from '@/components/ui/per-page-selector'
import { cn } from '@/lib/utils'

interface AdminPaginationProps {
  page: number
  totalPages: number
  perPage: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
  perPageOptions?: number[]
  className?: string
}

export function AdminPagination({
  page,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
  perPageOptions,
  className,
}: AdminPaginationProps) {
  const pages = Math.max(totalPages, 1)

  return (
    <nav
      aria-label="Pagination"
      className={cn('mt-5 border-t border-slate-700/60 pt-4', className)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center text-sm text-slate-400 sm:text-left">
          Page <span className="font-semibold text-slate-200">{page}</span> of{' '}
          <span className="font-semibold text-slate-200">{pages}</span>
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" strokeWidth={1.8} />
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto"
              disabled={page >= pages}
              onClick={() => onPageChange(Math.min(pages, page + 1))}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" strokeWidth={1.8} />
            </Button>
          </div>

          <PerPageSelector
            className="w-full sm:w-auto"
            value={perPage}
            onChange={onPerPageChange}
            options={perPageOptions}
          />
        </div>
      </div>
    </nav>
  )
}
