import { useQuery } from '@tanstack/react-query'

import { ApiError } from '@/api/client'
import { fetchProductById } from '@/api/products'

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.status === 404 || error.status === 500)) {
        return false
      }

      return failureCount < 1
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!id,
  })
