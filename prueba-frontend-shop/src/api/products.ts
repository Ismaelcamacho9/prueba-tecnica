import { apiFetch } from '@/api/client'
import {
    ProductDetailSchema,
    ProductListSchema,
    type ProductDetail,
    type ProductListItem,
} from '@/schemas/product'

export const fetchProducts = async (): Promise<ProductListItem[]> => {
    const data = await apiFetch('/api/product')
    return ProductListSchema.parse(data)
}

export const fetchProductById = async (id: string): Promise<ProductDetail> => {
    const data = await apiFetch(`/api/product/${id}`)
    return ProductDetailSchema.parse(data)
}
