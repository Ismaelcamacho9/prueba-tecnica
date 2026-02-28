import { createContext } from 'react'

export type CartItem = {
  id: string
  brand: string
  model: string
  price: string
  imgUrl: string
  colorName: string
  storageName: string
  quantity: number
}

export type CartContextType = {
  count: number
  items: CartItem[]
  setCount: (n: number) => void
  clearCart: () => void
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
}

export const CartContext = createContext<CartContextType | null>(null)
