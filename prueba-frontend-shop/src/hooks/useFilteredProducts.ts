import { useMemo } from 'react'

import type { ProductListItem } from '@/schemas/product'

export const useFilteredProducts = (products: ProductListItem[] | undefined, search: string) =>
  useMemo(() => {
    if (!products) return []

    const normalizedQuery = search.trim().toLowerCase()
    if (!normalizedQuery) return products

    return products.filter((product) => {
      const name = `${product.brand} ${product.model}`.toLowerCase()
      return name.includes(normalizedQuery)
    })
  }, [products, search])
