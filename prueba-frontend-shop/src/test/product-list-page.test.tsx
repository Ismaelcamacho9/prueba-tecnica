import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRoute,
  createRouter,
  createRoute,
  RouterProvider,
} from '@tanstack/react-router'

import { CartProvider } from '@/context/cart-provider'
import ProductListPage from '@/pages/ProductListPage'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
})

const createPageRouter = (component: () => React.JSX.Element) => {
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component,
  })
  return createRouter({ routeTree: rootRoute.addChildren([indexRoute]) })
}

const renderWithProviders = (component: () => React.JSX.Element) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  const router = createPageRouter(component)

  return render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </QueryClientProvider>,
  )
}

const mockProducts = [
  {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 15',
    price: '999',
    imgUrl: 'https://example.com/1.jpg',
  },
  {
    id: '2',
    brand: 'Samsung',
    model: 'Galaxy S24',
    price: '899',
    imgUrl: 'https://example.com/2.jpg',
  },
]

describe('ProductListPage', () => {
  it('muestra skeletons mientras carga', async () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))

    renderWithProviders(ProductListPage)

    await waitFor(() => {
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  it('muestra los productos cuando la carga es exitosa', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    } as Response)

    renderWithProviders(ProductListPage)

    await waitFor(() => {
      expect(screen.getByText('iPhone 15')).toBeInTheDocument()
      expect(screen.getByText('Galaxy S24')).toBeInTheDocument()
    })
  })

  it('muestra el título "Catálogo"', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    } as Response)

    renderWithProviders(ProductListPage)

    await waitFor(() => {
      expect(screen.getByText('Catálogo')).toBeInTheDocument()
    })
  })

  it('muestra el contador de productos', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    } as Response)

    renderWithProviders(ProductListPage)

    await waitFor(() => {
      expect(screen.getByText('2 productos disponibles')).toBeInTheDocument()
    })
  })

  it('muestra el campo de búsqueda', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    } as Response)

    renderWithProviders(ProductListPage)

    await waitFor(() => {
      expect(screen.getByLabelText('Buscar productos')).toBeInTheDocument()
    })
  })

  it('muestra error cuando el fetch falla', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    renderWithProviders(ProductListPage)

    await waitFor(() => {
      expect(screen.getByText(/Error cargando productos/)).toBeInTheDocument()
    })
  })

  it('muestra precios y "Sin precio" para productos sin precio', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [
        { ...mockProducts[0], price: 'sin precio' },
        mockProducts[1],
      ],
    } as Response)

    renderWithProviders(ProductListPage)

    await waitFor(() => {
      expect(screen.getByText('Sin precio')).toBeInTheDocument()
      expect(screen.getByText('899 €')).toBeInTheDocument()
    })
  })
})
