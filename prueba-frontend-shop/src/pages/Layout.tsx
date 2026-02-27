import { Link, Outlet } from '@tanstack/react-router'

import { useCart } from '@/hooks/useCart'

const Layout = () => {
  const { count } = useCart()

  return (
    <>
      <header>
        <nav>
          <Link to="/">Productos</Link>
        </nav>
        <p>Carrito: {count}</p>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
