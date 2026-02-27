import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

type CartContextType = { count: number; setCount: (n: number) => void }

export const CartContext = createContext<CartContextType>({
  count: 0,
  setCount: () => {},
})

type CartProviderProps = {
  children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [count, setCount] = useState(() =>
    Number(localStorage.getItem('cartCount') ?? 0),
  )

  const handleSetCount = (n: number) => {
    const nextCount = Math.max(0, n)
    setCount(nextCount)
    localStorage.setItem('cartCount', String(nextCount))
  }

  return (
    <CartContext.Provider value={{ count, setCount: handleSetCount }}>
      {children}
    </CartContext.Provider>
  )
}
