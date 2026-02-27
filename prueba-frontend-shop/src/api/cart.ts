import { apiFetch } from '@/api/client'
import {
  AddToCartResponseSchema as CartResponseSchema,
  type AddToCartBody,
} from '@/schemas/cart'

export const addToCart = async (body: AddToCartBody) => {
  const data = await apiFetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return CartResponseSchema.parse(data)
}
