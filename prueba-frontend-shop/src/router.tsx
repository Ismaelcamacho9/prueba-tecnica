import { createRoute, createRootRoute, createRouter } from '@tanstack/react-router'

import Layout from '@/pages/Layout'
import NotFoundPage from '@/pages/NotFoundPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import ProductListPage from '@/pages/ProductListPage'

const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: NotFoundPage,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ProductListPage,
})

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  component: ProductDetailPage,
})

const routeTree = rootRoute.addChildren([indexRoute, productRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
