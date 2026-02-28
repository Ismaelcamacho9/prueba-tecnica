import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { CartProvider } from '@/context/cart-provider'
import { useCart } from '@/hooks/useCart'

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

beforeEach(() => {
  localStorage.clear()
})

describe('CartProvider', () => {
  it('inicializa items desde localStorage con quantity', () => {
    const items = [
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 2 },
      { id: '2', brand: 'Samsung', model: 'Galaxy', price: '899', imgUrl: 'http://img', colorName: 'White', storageName: '64GB', quantity: 1 },
    ]
    localStorage.setItem('cartItems', JSON.stringify(items))

    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.count).toBe(3)
    expect(result.current.items).toHaveLength(2)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('añade un item nuevo con quantity 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem({
        id: '1', brand: 'Apple', model: 'iPhone', price: '999',
        imgUrl: 'http://img', colorName: 'Black', storageName: '128GB',
      })
    })

    expect(result.current.count).toBe(1)
    expect(result.current.items[0].quantity).toBe(1)
  })

  it('incrementa quantity si se añade el mismo item (id + color + storage)', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem({
        id: '1', brand: 'Apple', model: 'iPhone', price: '999',
        imgUrl: 'http://img', colorName: 'Black', storageName: '128GB',
      })
    })
    act(() => {
      result.current.addItem({
        id: '1', brand: 'Apple', model: 'iPhone', price: '999',
        imgUrl: 'http://img', colorName: 'Black', storageName: '128GB',
      })
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.count).toBe(2)
  })

  it('updateQuantity cambia la cantidad de un item', () => {
    const items = [
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 1 },
    ]
    localStorage.setItem('cartItems', JSON.stringify(items))

    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.updateQuantity(0, 5)
    })

    expect(result.current.items[0].quantity).toBe(5)
    expect(result.current.count).toBe(5)
  })

  it('updateQuantity elimina el item si quantity llega a 0', () => {
    const items = [
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 1 },
    ]
    localStorage.setItem('cartItems', JSON.stringify(items))

    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.updateQuantity(0, 0)
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.count).toBe(0)
  })

  it('elimina un item por índice', () => {
    const items = [
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 1 },
      { id: '2', brand: 'Samsung', model: 'Galaxy', price: '899', imgUrl: 'http://img', colorName: 'White', storageName: '64GB', quantity: 1 },
    ]
    localStorage.setItem('cartItems', JSON.stringify(items))

    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.removeItem(0)
    })

    expect(result.current.count).toBe(1)
    expect(result.current.items[0].brand).toBe('Samsung')
  })

  it('clearCart vacía el carrito', () => {
    const items = [
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 2 },
    ]
    localStorage.setItem('cartItems', JSON.stringify(items))

    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.count).toBe(0)
    expect(result.current.items).toHaveLength(0)
  })

  it('setCount persiste el count de la API', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.setCount(5)
    })

    expect(result.current.count).toBe(5)
    expect(localStorage.getItem('cartCount')).toBe('5')
  })

  it('setCount no permite valores negativos', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.setCount(-3)
    })

    expect(result.current.count).toBe(0)
  })
})
