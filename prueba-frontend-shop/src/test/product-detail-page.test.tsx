import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRoute,
  createRouter,
  createRoute,
  RouterProvider,
} from '@tanstack/react-router'
import type { RouterHistory } from '@tanstack/react-router'

import { CartProvider } from '@/context/cart-provider'
import ProductDetailPage from '@/pages/ProductDetailPage'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
})

const mockProductDetail = {
  id: 'abc123',
  brand: 'Apple',
  model: 'iPhone 15',
  price: '999',
  imgUrl: 'https://example.com/img.jpg',
  networkTechnology: 'GSM / HSPA / LTE',
  networkSpeed: 'LTE Cat4 150 Mbps',
  gprs: 'Yes',
  edge: 'Yes',
  announced: '2023',
  status: 'Available',
  dimentions: '147.6 x 71.6 x 7.8 mm',
  weight: '171',
  sim: 'Nano-SIM',
  displayType: 'OLED',
  displayResolution: '6.1 inches',
  displaySize: '1179 x 2556 pixels',
  os: 'iOS 17',
  cpu: 'A16 Bionic',
  chipset: 'Apple A16',
  gpu: 'Apple GPU',
  externalMemory: 'No',
  internalMemory: ['128 GB', '256 GB'],
  ram: '6 GB',
  primaryCamera: ['48 MP', 'autofocus'],
  secondaryCmera: ['12 MP'],
  speaker: 'Yes',
  audioJack: 'No',
  wlan: ['Wi-Fi 6'],
  bluetooth: ['5.3'],
  gps: 'Yes',
  nfc: 'Yes',
  radio: 'No',
  usb: 'Lightning',
  sensors: ['Face ID', 'accelerometer'],
  battery: '3877 mAh',
  colors: ['Black', 'Blue'],
  options: {
    colors: [
      { code: 1000, name: 'Black' },
      { code: 1001, name: 'Blue' },
    ],
    storages: [
      { code: 2000, name: '128 GB' },
      { code: 2001, name: '256 GB' },
    ],
  },
}

const createDetailRouter = () => {
  const rootRoute = createRootRoute()
  const productRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/product/$id',
    component: ProductDetailPage,
  })
  return createRouter({
    routeTree: rootRoute.addChildren([productRoute]),
    history: {
      location: { pathname: '/product/abc123', search: '', searchStr: '', hash: '', href: '/product/abc123', state: {} },
      subscribe: () => () => {},
      push: () => {},
      replace: () => {},
      go: () => {},
      back: () => {},
      forward: () => {},
      createHref: (to: string) => to,
      destroy: () => {},
      notify: () => {},
      flush: () => {},
    } as unknown as RouterHistory,
  })
}

const renderDetailPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  const router = createDetailRouter()

  return render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </QueryClientProvider>,
  )
}

describe('ProductDetailPage', () => {
  it('muestra skeletons mientras carga', async () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))

    renderDetailPage()

    await waitFor(() => {
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  it('muestra el detalle del producto cuando la carga es exitosa', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProductDetail,
    } as Response)

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText('iPhone 15')).toBeInTheDocument()
      expect(screen.getByText('999 €')).toBeInTheDocument()
    })
  })

  it('muestra las especificaciones del producto', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProductDetail,
    } as Response)

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText('A16 Bionic')).toBeInTheDocument()
      expect(screen.getByText('6 GB')).toBeInTheDocument()
      expect(screen.getByText('iOS 17')).toBeInTheDocument()
    })
  })

  it('muestra las opciones de color y almacenamiento', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProductDetail,
    } as Response)

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText('Black')).toBeInTheDocument()
      expect(screen.getByText('Blue')).toBeInTheDocument()
      expect(screen.getByText('128 GB')).toBeInTheDocument()
      expect(screen.getByText('256 GB')).toBeInTheDocument()
    })
  })

  it('muestra el botón de añadir al carrito', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProductDetail,
    } as Response)

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText('Añadir al carrito')).toBeInTheDocument()
    })
  })

  it('muestra NotFoundState cuando la API devuelve 404', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
    } as Response)

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText('Producto no encontrado')).toBeInTheDocument()
    })
  })

  it('muestra NotFoundState cuando la API devuelve 500', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText('Producto no encontrado')).toBeInTheDocument()
    })
  })

  it('muestra "Sin precio" cuando el precio es "sin precio"', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockProductDetail, price: 'sin precio' }),
    } as Response)

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText('Sin precio')).toBeInTheDocument()
    })
  })

  it('muestra el enlace para volver al catálogo', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProductDetail,
    } as Response)

    renderDetailPage()

    await waitFor(() => {
      expect(screen.getByText('Volver al catálogo')).toBeInTheDocument()
    })
  })
})
