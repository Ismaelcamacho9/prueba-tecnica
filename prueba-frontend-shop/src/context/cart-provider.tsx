import { useState } from 'react'
import type { ReactNode } from 'react'

import { CartContext } from '@/context/cart-context'

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
