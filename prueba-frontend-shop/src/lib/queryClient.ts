import { QueryClient } from '@tanstack/react-query'

const ONE_HOUR = 1000 * 60 * 60

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      gcTime: ONE_HOUR,
      staleTime: ONE_HOUR,
    },
  },
})
