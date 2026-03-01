import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  pageRange: (number | string)[]
  onPageChange: (page: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
  className?: string
}

const Pagination = ({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  pageRange,
  onPageChange,
  onPreviousPage,
  onNextPage,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Paginación" className={cn('flex items-center justify-center gap-1', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageRange.map((page, index) =>
        typeof page === 'string' ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground"
            aria-hidden
          >
            {page}
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'ghost'}
            size="icon"
            onClick={() => onPageChange(page)}
            aria-label={`Ir a página ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onNextPage}
        disabled={!hasNextPage}
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}

export { Pagination }
