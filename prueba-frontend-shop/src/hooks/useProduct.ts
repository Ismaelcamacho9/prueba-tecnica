import { useQuery } from '@tanstack/react-query'

import { fetchProductById } from '@/api/products'

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    staleTime: 1000 * 60 * 60,
    enabled: !!id,
  })
