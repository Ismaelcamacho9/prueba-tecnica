import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useProducts } from '@/hooks/useProducts'
import { useProduct } from '@/hooks/useProduct'
import { useCart } from '@/hooks/useCart'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })

const createWrapper = () => {
  const queryClient = createTestQueryClient()
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

const mockProducts = [
  {
    id: 'ZmGrkLRPXOTpxsU4jjAcv',
    brand: 'Acer',
    model: 'Iconia Talk S',
    price: '170',
    imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
  },
]

const mockProductDetail = {
  ...mockProducts[0],
  networkTechnology: 'GSM / HSPA / LTE',
  networkSpeed: 'HSPA 42.2/11.5 Mbps',
  gprs: 'Yes',
  edge: 'Yes',
  announced: '2016 August',
  status: 'Available',
  dimentions: '191.7 x 101 x 9.4 mm',
  weight: '260',
  sim: 'Dual SIM',
  displayType: 'IPS LCD',
  displayResolution: '7.0 inches',
  displaySize: '720 x 1280 pixels',
  os: 'Android 6.0',
  cpu: 'Quad-core 1.3 GHz',
  chipset: 'Mediatek MT8735',
  gpu: 'Mali-T720MP2',
  externalMemory: 'microSD up to 128 GB',
  internalMemory: ['16 GB'],
  ram: '2 GB RAM',
  primaryCamera: ['13 MP'],
  secondaryCmera: ['2 MP'],
  speaker: 'Yes',
  audioJack: 'Yes',
  wlan: ['Wi-Fi 802.11 a/b/g/n'],
  bluetooth: ['4.0'],
  gps: 'Yes',
  nfc: 'N/A',
  radio: 'FM radio',
  usb: 'microUSB 2.0',
  sensors: ['Accelerometer'],
  battery: '3400 mAh',
  colors: ['Black'],
  options: {
    colors: [{ code: 1000, name: 'Black' }],
    storages: [{ code: 2000, name: '16 GB' }],
  },
}

describe('useProducts', () => {
  it('devuelve los productos cuando el fetch es exitoso', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    } as Response)

    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockProducts)
  })

  it('entra en estado error cuando el fetch falla', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeDefined()
  })
})

describe('useProduct', () => {
  it('devuelve el detalle del producto cuando el fetch es exitoso', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProductDetail,
    } as Response)

    const { result } = renderHook(() => useProduct('ZmGrkLRPXOTpxsU4jjAcv'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockProductDetail)
  })

  it('no ejecuta la query cuando id es vacío', () => {
    const { result } = renderHook(() => useProduct(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('no hace retry en error 404', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
    } as Response)

    const { result } = renderHook(() => useProduct('nonexistent'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('no hace retry en error 500', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    const { result } = renderHook(() => useProduct('some-id'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe('useCart (fuera de provider)', () => {
  it('lanza error cuando se usa fuera de CartProvider', () => {
    expect(() => {
      renderHook(() => useCart())
    }).toThrow('useCart must be used within a CartProvider')
  })
})
