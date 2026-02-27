import { useQuery } from '@tanstack/react-query'

import { fetchProducts } from '@/api/products'

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 60,
  })
