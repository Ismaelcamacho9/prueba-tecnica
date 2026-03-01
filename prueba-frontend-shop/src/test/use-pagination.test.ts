import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { usePagination } from '@/hooks/usePagination'

const generateItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: String(i + 1), name: `Item ${i + 1}` }))

describe('usePagination', () => {
  it('devuelve los items de la primera página', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 1, itemsPerPage: 8, onPageChange }),
    )

    expect(result.current.paginatedItems).toHaveLength(8)
    expect(result.current.paginatedItems[0]).toEqual(items[0])
    expect(result.current.paginatedItems[7]).toEqual(items[7])
  })

  it('devuelve los items de la segunda página', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 2, itemsPerPage: 8, onPageChange }),
    )

    expect(result.current.paginatedItems).toHaveLength(8)
    expect(result.current.paginatedItems[0]).toEqual(items[8])
    expect(result.current.paginatedItems[7]).toEqual(items[15])
  })

  it('devuelve los items restantes en la última página', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 3, itemsPerPage: 8, onPageChange }),
    )

    expect(result.current.paginatedItems).toHaveLength(4)
    expect(result.current.paginatedItems[0]).toEqual(items[16])
  })

  it('calcula correctamente totalPages', () => {
    const onPageChange = vi.fn()

    const { result: r1 } = renderHook(() =>
      usePagination({ items: generateItems(20), page: 1, itemsPerPage: 8, onPageChange }),
    )
    expect(r1.current.totalPages).toBe(3)

    const { result: r2 } = renderHook(() =>
      usePagination({ items: generateItems(16), page: 1, itemsPerPage: 8, onPageChange }),
    )
    expect(r2.current.totalPages).toBe(2)

    const { result: r3 } = renderHook(() =>
      usePagination({ items: generateItems(8), page: 1, itemsPerPage: 8, onPageChange }),
    )
    expect(r3.current.totalPages).toBe(1)
  })

  it('clampea la página a los límites válidos', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()

    const { result: r1 } = renderHook(() =>
      usePagination({ items, page: 0, itemsPerPage: 8, onPageChange }),
    )
    expect(r1.current.currentPage).toBe(1)

    const { result: r2 } = renderHook(() =>
      usePagination({ items, page: 99, itemsPerPage: 8, onPageChange }),
    )
    expect(r2.current.currentPage).toBe(3)
  })

  it('hasPreviousPage y hasNextPage son correctos', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()

    const { result: r1 } = renderHook(() =>
      usePagination({ items, page: 1, itemsPerPage: 8, onPageChange }),
    )
    expect(r1.current.hasPreviousPage).toBe(false)
    expect(r1.current.hasNextPage).toBe(true)

    const { result: r2 } = renderHook(() =>
      usePagination({ items, page: 2, itemsPerPage: 8, onPageChange }),
    )
    expect(r2.current.hasPreviousPage).toBe(true)
    expect(r2.current.hasNextPage).toBe(true)

    const { result: r3 } = renderHook(() =>
      usePagination({ items, page: 3, itemsPerPage: 8, onPageChange }),
    )
    expect(r3.current.hasPreviousPage).toBe(true)
    expect(r3.current.hasNextPage).toBe(false)
  })

  it('goToNextPage llama a onPageChange con la página siguiente', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 1, itemsPerPage: 8, onPageChange }),
    )

    act(() => result.current.goToNextPage())
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('goToPreviousPage llama a onPageChange con la página anterior', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 2, itemsPerPage: 8, onPageChange }),
    )

    act(() => result.current.goToPreviousPage())
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('goToPreviousPage no llama a onPageChange en la primera página', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 1, itemsPerPage: 8, onPageChange }),
    )

    act(() => result.current.goToPreviousPage())
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('goToNextPage no llama a onPageChange en la última página', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 3, itemsPerPage: 8, onPageChange }),
    )

    act(() => result.current.goToNextPage())
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('goToPage navega a una página específica', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 1, itemsPerPage: 8, onPageChange }),
    )

    act(() => result.current.goToPage(3))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('goToPage clampea valores fuera de rango', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 1, itemsPerPage: 8, onPageChange }),
    )

    act(() => result.current.goToPage(99))
    expect(onPageChange).toHaveBeenCalledWith(3)

    act(() => result.current.goToPage(-1))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('pageRange contiene las páginas correctas sin ellipsis cuando hay pocas páginas', () => {
    const items = generateItems(24)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 1, itemsPerPage: 8, onPageChange }),
    )

    expect(result.current.pageRange).toEqual([1, 2, 3])
  })

  it('pageRange contiene ellipsis cuando hay muchas páginas', () => {
    const items = generateItems(80)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 5, itemsPerPage: 8, onPageChange }),
    )

    expect(result.current.pageRange).toContain('…')
    expect(result.current.pageRange[0]).toBe(1)
    expect(result.current.pageRange[result.current.pageRange.length - 1]).toBe(10)
  })

  it('totalItems devuelve la cantidad total de items', () => {
    const items = generateItems(20)
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items, page: 1, itemsPerPage: 8, onPageChange }),
    )

    expect(result.current.totalItems).toBe(20)
  })

  it('maneja una lista vacía correctamente', () => {
    const onPageChange = vi.fn()
    const { result } = renderHook(() =>
      usePagination({ items: [], page: 1, itemsPerPage: 8, onPageChange }),
    )

    expect(result.current.paginatedItems).toEqual([])
    expect(result.current.totalPages).toBe(1)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.hasPreviousPage).toBe(false)
    expect(result.current.hasNextPage).toBe(false)
  })
})
