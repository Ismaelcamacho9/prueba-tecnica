import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRoute,
  createRouter,
  createRoute,
  RouterProvider,
} from '@tanstack/react-router'

import { CartProvider } from '@/context/cart-provider'
import Layout from '@/pages/Layout'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
})

const createLayoutRouter = (childContent = 'Page content') => {
  const rootRoute = createRootRoute({ component: Layout })
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div>{childContent}</div>,
  })
  return createRouter({ routeTree: rootRoute.addChildren([indexRoute]) })
}

const renderLayout = (childContent?: string) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  const router = createLayoutRouter(childContent)

  return render(
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </QueryClientProvider>,
  )
}

describe('Layout', () => {
  it('renderiza el header con el logo MobileShop', async () => {
    renderLayout()

    await waitFor(() => {
      expect(screen.getByText('MobileShop')).toBeInTheDocument()
    })
  })

  it('renderiza el botón del carrito', async () => {
    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })
  })

  it('renderiza el breadcrumb con "Inicio"', async () => {
    renderLayout()

    await waitFor(() => {
      expect(screen.getByText('Inicio')).toBeInTheDocument()
    })
  })

  it('renderiza el contenido de la ruta hija (Outlet)', async () => {
    renderLayout('Child page works')

    await waitFor(() => {
      expect(screen.getByText('Child page works')).toBeInTheDocument()
    })
  })

  it('abre el panel del carrito al hacer clic', async () => {
    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Carrito de compras' })).toBeInTheDocument()
    })
  })

  it('muestra "Tu carrito está vacío" cuando no hay items', async () => {
    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
    })
  })

  it('cierra el panel del carrito con el botón cerrar', async () => {
    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByLabelText('Cerrar carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Cerrar carrito'))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('cierra el panel del carrito con Escape', async () => {
    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('muestra el badge del carrito cuando hay items', async () => {
    localStorage.setItem('cartItems', JSON.stringify([
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 2 },
    ]))
    localStorage.setItem('cartCount', '2')

    renderLayout()

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  it('muestra items del carrito en el panel', async () => {
    localStorage.setItem('cartItems', JSON.stringify([
      { id: '1', brand: 'Apple', model: 'iPhone 15', price: '999', imgUrl: 'http://img.jpg', colorName: 'Black', storageName: '128GB', quantity: 1 },
    ]))
    localStorage.setItem('cartCount', '1')

    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByText('iPhone 15')).toBeInTheDocument()
      expect(screen.getByText('Black · 128GB')).toBeInTheDocument()
      expect(screen.getByText('999 €')).toBeInTheDocument()
    })
  })

  it('muestra el botón de Finalizar compra cuando hay items', async () => {
    localStorage.setItem('cartItems', JSON.stringify([
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 1 },
    ]))
    localStorage.setItem('cartCount', '1')

    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByText('Finalizar compra')).toBeInTheDocument()
    })
  })

  it('muestra confirmación de compra al finalizar', async () => {
    localStorage.setItem('cartItems', JSON.stringify([
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 1 },
    ]))
    localStorage.setItem('cartCount', '1')

    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByText('Finalizar compra')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Finalizar compra'))

    await waitFor(() => {
      expect(screen.getByText('¡Compra realizada!')).toBeInTheDocument()
    })
  })

  it('muestra diálogo de confirmación al eliminar con cantidad 1', async () => {
    localStorage.setItem('cartItems', JSON.stringify([
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 1 },
    ]))
    localStorage.setItem('cartCount', '1')

    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByLabelText('Reducir cantidad')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Reducir cantidad'))

    await waitFor(() => {
      expect(screen.getByText('Eliminar producto')).toBeInTheDocument()
      expect(screen.getByText('Cancelar')).toBeInTheDocument()
    })
  })

  it('permite cancelar la eliminación', async () => {
    localStorage.setItem('cartItems', JSON.stringify([
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 1 },
    ]))
    localStorage.setItem('cartCount', '1')

    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByLabelText('Reducir cantidad')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Reducir cantidad'))

    await waitFor(() => {
      expect(screen.getByText('Cancelar')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Cancelar'))

    await waitFor(() => {
      expect(screen.queryByText('Eliminar producto')).not.toBeInTheDocument()
    })
  })

  it('permite confirmar la eliminación', async () => {
    localStorage.setItem('cartItems', JSON.stringify([
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 1 },
    ]))
    localStorage.setItem('cartCount', '1')

    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByLabelText('Eliminar Apple iPhone')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Eliminar Apple iPhone'))

    await waitFor(() => {
      expect(screen.getByText('Eliminar producto')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    await waitFor(() => {
      expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
    })
  })

  it('incrementa la cantidad de un item', async () => {
    localStorage.setItem('cartItems', JSON.stringify([
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 1 },
    ]))
    localStorage.setItem('cartCount', '1')

    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByLabelText('Aumentar cantidad')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Aumentar cantidad'))

    await waitFor(() => {
      const quantitySpan = document.querySelector('.w-9.text-center')
      expect(quantitySpan).toHaveTextContent('2')
    })
  })

  it('muestra "Sin precio" para items sin precio en el carrito', async () => {
    localStorage.setItem('cartItems', JSON.stringify([
      { id: '1', brand: 'Apple', model: 'iPhone', price: 'sin precio', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 1 },
    ]))
    localStorage.setItem('cartCount', '1')

    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByText('Sin precio')).toBeInTheDocument()
    })
  })

  it('decrementa la cantidad de un item con quantity > 1', async () => {
    localStorage.setItem('cartItems', JSON.stringify([
      { id: '1', brand: 'Apple', model: 'iPhone', price: '999', imgUrl: 'http://img', colorName: 'Black', storageName: '128GB', quantity: 3 },
    ]))
    localStorage.setItem('cartCount', '3')

    renderLayout()

    await waitFor(() => {
      expect(screen.getByLabelText('Abrir carrito')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Abrir carrito'))

    await waitFor(() => {
      expect(screen.getByLabelText('Reducir cantidad')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Reducir cantidad'))

    await waitFor(() => {
      expect(screen.getByText('Carrito (2)')).toBeInTheDocument()
    })
  })
})
