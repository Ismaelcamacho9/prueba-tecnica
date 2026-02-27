import { useParams } from '@tanstack/react-router'

import { useAddToCart } from '@/hooks/useAddToCart'
import { useProduct } from '@/hooks/useProduct'

const ProductDetailPage = () => {
  const { id } = useParams({ from: '/product/$id' })
  const { data, isPending, isError, error } = useProduct(id)
  const addToCart = useAddToCart()

  if (isPending) return <p>Cargando detalle...</p>
  if (isError) {
    return <p>Error cargando detalle: {error instanceof Error ? error.message : 'Error desconocido'}</p>
  }
  if (!data) return <p>Producto no encontrado</p>

  const firstColor = data.options.colors[0]
  const firstStorage = data.options.storages[0]
  const canAdd = !!firstColor && !!firstStorage

  return (
    <section>
      <h1>{data.brand} {data.model}</h1>
      <p>Marca: {data.brand}</p>
      <p>Modelo: {data.model}</p>
      <p>Precio: {data.price}</p>
      <p>CPU: {data.cpu}</p>
      <p>RAM: {data.ram}</p>
      <p>Sistema Operativo: {data.os}</p>
      <p>Resolución de pantalla: {data.displayResolution}</p>
      <p>Batería: {data.battery}</p>
      <p>
        Cámaras: {data.primaryCamera.join(' / ')}
        {data.secondaryCmera.length > 0 ? ` | Frontal: ${data.secondaryCmera.join(' / ')}` : ''}
      </p>
      <p>Dimensiones: {data.dimentions}</p>
      <button
        type="button"
        disabled={!canAdd || addToCart.isPending}
        onClick={() => {
          if (!canAdd) return

          addToCart.mutate({
            id: data.id,
            colorCode: firstColor.code,
            storageCode: firstStorage.code,
          })
        }}
      >
        {addToCart.isPending ? 'Añadiendo...' : 'Añadir al carrito'}
      </button>
      {addToCart.isError ? <p>Error al añadir al carrito</p> : null}
    </section>
  )
}

export default ProductDetailPage
