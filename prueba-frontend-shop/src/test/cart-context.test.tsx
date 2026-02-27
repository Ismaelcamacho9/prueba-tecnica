import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { CartProvider } from '@/context/CartContext'
import { useCart } from '@/hooks/useCart'

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

beforeEach(() => {
  localStorage.clear()
})

describe('CartProvider', () => {
  it('inicializa count desde localStorage', () => {
    localStorage.setItem('cartCount', '3')

    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.count).toBe(3)
  })

  it('actualiza count y persiste en localStorage al llamar setCount', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.setCount(5)
    })

    expect(result.current.count).toBe(5)
    expect(localStorage.getItem('cartCount')).toBe('5')
  })

  it('no permite count negativo y persiste 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.setCount(-2)
    })

    expect(result.current.count).toBe(0)
    expect(localStorage.getItem('cartCount')).toBe('0')
  })
})
