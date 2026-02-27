import { createContext } from 'react'

export type CartContextType = { count: number; setCount: (n: number) => void }

export const CartContext = createContext<CartContextType>({
  count: 0,
  setCount: () => {},
})
