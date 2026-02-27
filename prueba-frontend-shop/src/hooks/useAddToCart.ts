import { useMutation } from '@tanstack/react-query'
import { addToCart } from '@/api/cart'
import { useCart } from '@/hooks/useCart'

export const useAddToCart = () => {
  const { setCount } = useCart()

  return useMutation({
    mutationFn: addToCart,
    onSuccess: ({ count }) => setCount(count),
  })
}
