import { Link } from '@tanstack/react-router'

import { useProducts } from '@/hooks/useProducts'

const ProductListPage = () => {
  const { data, isPending, isError, error } = useProducts()

  if (isPending) return <p>Cargando productos...</p>
  if (isError) {
    return <p>Error cargando productos: {error instanceof Error ? error.message : 'Error desconocido'}</p>
  }

  return (
    <section>
      <h1>Productos</h1>
      <ul>
        {data.map((product) => (
          <li key={product.id}>
            <Link to="/product/$id" params={{ id: product.id }}>
              {product.brand} {product.model} - {product.price === 'N/A' ? 'Sin precio' : product.price}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProductListPage
