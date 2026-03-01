import { describe, expect, it } from 'vitest'

import { cn } from '@/lib/utils'
import { queryClient } from '@/lib/queryClient'

describe('cn (class merge utility)', () => {
  it('combina clases simples', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('resuelve conflictos de tailwind (última gana)', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8')
  })

  it('maneja valores undefined y null', () => {
    expect(cn('px-4', undefined, null, 'py-2')).toBe('px-4 py-2')
  })

  it('maneja valores booleanos y condicionales', () => {
    const isHidden = false
    const isVisible = true
    expect(cn('base', isHidden && 'hidden', isVisible && 'visible')).toBe('base visible')
  })

  it('devuelve string vacío cuando no hay inputs', () => {
    expect(cn()).toBe('')
  })
})

describe('queryClient', () => {
  it('está configurado con retry: 1', () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.queries?.retry).toBe(1)
  })

  it('está configurado con gcTime de 1 hora', () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.queries?.gcTime).toBe(1000 * 60 * 60)
  })

  it('está configurado con staleTime de 1 hora', () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.queries?.staleTime).toBe(1000 * 60 * 60)
  })
})
