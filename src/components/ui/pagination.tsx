// components/ui/pagination.tsx
'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pageCount) {
      onPageChange(page)
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {Array.from({ length: pageCount }, (_, i) => (
        <Button
          key={i}
          variant={currentPage === i + 1 ? 'default' : 'outline'}
          size="sm"
          onClick={() => goToPage(i + 1)}
        >
          {i + 1}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === pageCount}
        onClick={() => goToPage(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
