import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useFilteredProducts } from '@/hooks/useFilteredProducts'
import type { ProductListItem } from '@/schemas/product'

const products: ProductListItem[] = [
  { id: '1', brand: 'Apple', model: 'iPhone 15', price: '999', imgUrl: 'https://example.com/1.jpg' },
  { id: '2', brand: 'Samsung', model: 'Galaxy S24', price: '899', imgUrl: 'https://example.com/2.jpg' },
  { id: '3', brand: 'Apple', model: 'iPhone 14', price: '799', imgUrl: 'https://example.com/3.jpg' },
  { id: '4', brand: 'Xiaomi', model: 'Redmi Note 12', price: '299', imgUrl: 'https://example.com/4.jpg' },
]

describe('useFilteredProducts', () => {
  it('devuelve todos los productos cuando la búsqueda está vacía', () => {
    const { result } = renderHook(() => useFilteredProducts(products, ''))
    expect(result.current).toEqual(products)
  })

  it('devuelve todos los productos cuando la búsqueda solo tiene espacios', () => {
    const { result } = renderHook(() => useFilteredProducts(products, '   '))
    expect(result.current).toEqual(products)
  })

  it('devuelve array vacío cuando products es undefined', () => {
    const { result } = renderHook(() => useFilteredProducts(undefined, 'apple'))
    expect(result.current).toEqual([])
  })

  it('filtra por marca (brand)', () => {
    const { result } = renderHook(() => useFilteredProducts(products, 'Apple'))
    expect(result.current).toHaveLength(2)
    expect(result.current.every((p) => p.brand === 'Apple')).toBe(true)
  })

  it('filtra por modelo (model)', () => {
    const { result } = renderHook(() => useFilteredProducts(products, 'Galaxy'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].model).toBe('Galaxy S24')
  })

  it('filtra combinando marca y modelo', () => {
    const { result } = renderHook(() => useFilteredProducts(products, 'Apple iPhone 15'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('1')
  })

  it('es case-insensitive', () => {
    const { result } = renderHook(() => useFilteredProducts(products, 'samsung'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].brand).toBe('Samsung')
  })

  it('devuelve array vacío cuando no hay coincidencias', () => {
    const { result } = renderHook(() => useFilteredProducts(products, 'Nokia'))
    expect(result.current).toEqual([])
  })

  it('ignora espacios al inicio y al final de la búsqueda', () => {
    const { result } = renderHook(() => useFilteredProducts(products, '  Xiaomi  '))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].brand).toBe('Xiaomi')
  })

  it('filtra con coincidencia parcial', () => {
    const { result } = renderHook(() => useFilteredProducts(products, 'iphone'))
    expect(result.current).toHaveLength(2)
    expect(result.current.every((p) => p.model.toLowerCase().includes('iphone'))).toBe(true)
  })

  it('actualiza el resultado cuando cambia la búsqueda', () => {
    const { result, rerender } = renderHook(
      ({ search }) => useFilteredProducts(products, search),
      { initialProps: { search: 'Apple' } },
    )
    expect(result.current).toHaveLength(2)

    rerender({ search: 'Galaxy' })
    expect(result.current).toHaveLength(1)
    expect(result.current[0].brand).toBe('Samsung')
  })

  it('actualiza el resultado cuando cambia la lista de productos', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useFilteredProducts(items, 'Apple'),
      { initialProps: { items: products } },
    )
    expect(result.current).toHaveLength(2)

    const fewerProducts = products.slice(0, 1)
    rerender({ items: fewerProducts })
    expect(result.current).toHaveLength(1)
  })
})
