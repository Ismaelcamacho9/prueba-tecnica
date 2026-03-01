import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError, apiFetch } from '@/api/client'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ApiError', () => {
  it('crea un error con status y mensaje por defecto', () => {
    const error = new ApiError(404)

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('ApiError')
    expect(error.status).toBe(404)
    expect(error.message).toBe('API error: 404')
  })

  it('crea un error con status y mensaje personalizado', () => {
    const error = new ApiError(500, 'Internal server error')

    expect(error.status).toBe(500)
    expect(error.message).toBe('Internal server error')
  })
})

describe('apiFetch', () => {
  it('devuelve los datos parseados cuando la respuesta es ok', async () => {
    const mockData = { id: '1', name: 'Test' }

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response)

    const result = await apiFetch('/api/test')
    expect(result).toEqual(mockData)
  })

  it('lanza ApiError cuando la respuesta no es ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    } as Response)

    await expect(apiFetch('/api/not-found')).rejects.toThrow(ApiError)
    await expect(apiFetch('/api/not-found')).rejects.toMatchObject({ status: 404 })
  })

  it('pasa las opciones de RequestInit al fetch', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true }),
    }

    await apiFetch('/api/test', options)

    expect(fetchMock).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/api/test`,
      options,
    )
  })
})
