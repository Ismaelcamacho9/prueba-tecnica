import { useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'

import { CartContext } from '@/context/cart-context'
import type { CartItem } from '@/context/cart-context'

type CartProviderProps = {
  children: ReactNode
}

const STORAGE_KEY_ITEMS = 'cartItems'
const STORAGE_KEY_COUNT = 'cartCount'

const loadItems = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    return parsed.map((item) => ({ ...item, quantity: item.quantity ?? 1 }))
  } catch {
    return []
  }
}

const loadCount = (): number => {
  const stored = localStorage.getItem(STORAGE_KEY_COUNT)
  if (stored !== null) return Math.max(0, parseInt(stored, 10) || 0)
  return loadItems().reduce((sum, item) => sum + item.quantity, 0)
}

const persistItems = (items: CartItem[]) => {
  localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items))
}

const persistCount = (count: number) => {
  localStorage.setItem(STORAGE_KEY_COUNT, String(count))
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>(loadItems)
  const [count, setCountState] = useState<number>(loadCount)

  const setCount = useCallback((n: number) => {
    const next = Math.max(0, n)
    setCountState(next)
    persistCount(next)
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    persistItems([])
    setCountState(0)
    persistCount(0)
  }, [])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && i.colorName === item.colorName && i.storageName === item.storageName,
      )
      let next: CartItem[]
      if (existingIndex >= 0) {
        next = prev.map((i, idx) =>
          idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i,
        )
      } else {
        next = [...prev, { ...item, quantity: 1 }]
      }
      persistItems(next)
      const nextCount = next.reduce((sum, i) => sum + i.quantity, 0)
      setCountState(nextCount)
      persistCount(nextCount)
      return next
    })
  }, [])

  const removeItem = useCallback((index: number) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index)
      persistItems(next)
      const nextCount = next.reduce((sum, i) => sum + i.quantity, 0)
      setCountState(nextCount)
      persistCount(nextCount)
      return next
    })
  }, [])

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setItems((prev) => {
      let next: CartItem[]
      if (quantity <= 0) {
        next = prev.filter((_, i) => i !== index)
      } else {
        next = prev.map((item, i) =>
          i === index ? { ...item, quantity } : item,
        )
      }
      persistItems(next)
      const nextCount = next.reduce((sum, i) => sum + i.quantity, 0)
      setCountState(nextCount)
      persistCount(nextCount)
      return next
    })
  }, [])

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => {
        const parsed = parseFloat(item.price)
        if (Number.isNaN(parsed)) return sum
        return sum + parsed * item.quantity
      }, 0),
    [items],
  )

  const value = useMemo(
    () => ({ count, items, totalPrice, setCount, clearCart, addItem, removeItem, updateQuantity }),
    [count, items, totalPrice, setCount, clearCart, addItem, removeItem, updateQuantity],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
