import { useMemo, useCallback } from 'react'

const ELLIPSIS = '…' as const

export interface UsePaginationOptions<T> {
  items: T[]
  page: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export interface UsePaginationReturn<T> {
  paginatedItems: T[]
  currentPage: number
  totalPages: number
  totalItems: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  goToPreviousPage: () => void
  
  goToNextPage: () => void
  
  goToPage: (page: number) => void
  
  pageRange: (number | typeof ELLIPSIS)[]
}


const buildPageRange = (currentPage: number, totalPages: number): (number | typeof ELLIPSIS)[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | typeof ELLIPSIS)[] = [1]

  if (currentPage > 3) pages.push(ELLIPSIS)

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (currentPage < totalPages - 2) pages.push(ELLIPSIS)

  pages.push(totalPages)

  return pages
}

export const usePagination = <T>({
  items,
  page,
  itemsPerPage,
  onPageChange,
}: UsePaginationOptions<T>): UsePaginationReturn<T> => {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

  const currentPage = Math.min(Math.max(1, page), totalPages)

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return items.slice(start, start + itemsPerPage)
  }, [items, currentPage, itemsPerPage])

  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  const goToPage = useCallback(
    (target: number) => {
      const clamped = Math.min(Math.max(1, target), totalPages)
      onPageChange(clamped)
    },
    [totalPages, onPageChange],
  )

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) goToPage(currentPage - 1)
  }, [hasPreviousPage, currentPage, goToPage])

  const goToNextPage = useCallback(() => {
    if (hasNextPage) goToPage(currentPage + 1)
  }, [hasNextPage, currentPage, goToPage])

  const pageRange = useMemo(() => buildPageRange(currentPage, totalPages), [currentPage, totalPages])

  return {
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    hasPreviousPage,
    hasNextPage,
    goToPreviousPage,
    goToNextPage,
    goToPage,
    pageRange,
  }
}
