import { useMutation } from '@tanstack/react-query'
import { addToCart } from '@/api/cart'
import { useCart } from '@/hooks/useCart'

type AddToCartWithProduct = {
  id: string
  colorCode: number
  storageCode: number
  product: {
    brand: string
    model: string
    price: string
    imgUrl: string
    colorName: string
    storageName: string
  }
}

export const useAddToCart = () => {
  const { addItem, setCount } = useCart()

  return useMutation({
    mutationFn: ({ id, colorCode, storageCode }: AddToCartWithProduct) =>
      addToCart({ id, colorCode, storageCode }),
    onSuccess: (data, variables) => {
      addItem({
        id: variables.id,
        brand: variables.product.brand,
        model: variables.product.model,
        price: variables.product.price,
        imgUrl: variables.product.imgUrl,
        colorName: variables.product.colorName,
        storageName: variables.product.storageName,
      })
      setCount(data.count)
    },
  })
}
