import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { CartProvider } from '@/context/cart-provider'
import { useAddToCart } from '@/hooks/useAddToCart'

vi.mock('@/api/cart', () => ({
  addToCart: vi.fn(),
}))

import { addToCart } from '@/api/cart'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <CartProvider>{children}</CartProvider>
    </QueryClientProvider>
  )
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
})

const product = {
  brand: 'Apple',
  model: 'iPhone 15',
  price: '999',
  imgUrl: 'https://example.com/img.jpg',
  colorName: 'Black',
  storageName: '128 GB',
}

describe('useAddToCart', () => {
  it('ejecuta la mutación y actualiza el carrito al completarse', async () => {
    vi.mocked(addToCart).mockResolvedValue({ count: 1 })

    const { result } = renderHook(() => useAddToCart(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({
        id: 'product-1',
        colorCode: 1000,
        storageCode: 2000,
        product,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(addToCart).toHaveBeenCalledWith({
      id: 'product-1',
      colorCode: 1000,
      storageCode: 2000,
    })
  })

  it('entra en estado error cuando la API falla', async () => {
    vi.mocked(addToCart).mockRejectedValue(new Error('Server error'))

    const { result } = renderHook(() => useAddToCart(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate({
        id: 'product-1',
        colorCode: 1000,
        storageCode: 2000,
        product,
      })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
