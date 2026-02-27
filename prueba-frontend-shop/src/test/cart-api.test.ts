import { afterEach, describe, expect, it, vi } from 'vitest'

import { addToCart } from '@/api/cart'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('addToCart', () => {
  it('hace POST a /api/cart y devuelve respuesta validada', async () => {
    const body = {
      id: 'ZmGrkLRPXOTpxsU4jjAcv',
      colorCode: 1000,
      storageCode: 2000,
    }

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ count: 1 }),
    } as Response)

    const result = await addToCart(body)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    )
    expect(result).toEqual({ count: 1 })
  })
})
