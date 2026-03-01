import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import {
  createRootRoute,
  createRouter,
  createRoute,
  RouterProvider,
} from '@tanstack/react-router'

import NotFoundState from '@/components/NotFoundState'
import NotFoundPage from '@/pages/NotFoundPage'

afterEach(() => {
  cleanup()
})

const createTestRouter = (component: () => React.JSX.Element) => {
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component,
  })
  const routeTree = rootRoute.addChildren([indexRoute])
  return createRouter({ routeTree })
}

describe('NotFoundState', () => {
  it('renderiza título y descripción', async () => {
    const router = createTestRouter(() => (
      <NotFoundState title="No encontrado" description="El recurso no existe." />
    ))
    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('No encontrado')).toBeInTheDocument()
      expect(screen.getByText('El recurso no existe.')).toBeInTheDocument()
    })
  })

  it('muestra el CTA por defecto "Volver al catálogo"', async () => {
    const router = createTestRouter(() => (
      <NotFoundState title="Error" description="Desc" />
    ))
    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Volver al catálogo')).toBeInTheDocument()
    })
  })

  it('muestra el CTA personalizado', async () => {
    const router = createTestRouter(() => (
      <NotFoundState title="Error" description="Desc" ctaLabel="Ir al inicio" />
    ))
    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Ir al inicio')).toBeInTheDocument()
    })
  })

  it('muestra el indicador 404', async () => {
    const router = createTestRouter(() => (
      <NotFoundState title="Error" description="Desc" />
    ))
    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument()
    })
  })
})

describe('NotFoundPage', () => {
  it('renderiza con título y descripción correctos', async () => {
    const router = createTestRouter(NotFoundPage)
    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText('Página no encontrada')).toBeInTheDocument()
      expect(screen.getByText('La URL no existe o ya no está disponible.')).toBeInTheDocument()
    })
  })
})
