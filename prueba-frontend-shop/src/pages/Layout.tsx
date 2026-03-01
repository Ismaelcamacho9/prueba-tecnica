import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { CheckCircle, ChevronRight, Minus, Plus, ShoppingCart, Smartphone, Trash2, X, ShoppingBag } from 'lucide-react'

import { Toaster } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { useProduct } from '@/hooks/useProduct'


const Breadcrumbs = () => {
  const location = useLocation()
  const productId = location.pathname.match(/^\/product\/([^/]+)$/)?.[1] ?? ''
  const { data: product } = useProduct(productId)

  const crumbs: { label: string; to?: string }[] = [{ label: 'Inicio', to: '/' }]

  if (productId) {
    crumbs.push({ label: 'Detalle de productos' })
    if (product) {
      crumbs.push({ label: `${product.brand} ${product.model}` })
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <li key={crumb.label} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
              {crumb.to && !isLast ? (
                <Link to={crumb.to} className="transition-colors hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{crumb.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}



const CartPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { count, items, removeItem, updateQuantity, clearCart } = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const [confirmRemoveIndex, setConfirmRemoveIndex] = useState<number | null>(null)
  const [purchaseComplete, setPurchaseComplete] = useState(false)

  const handlePurchase = () => {
    clearCart()
    setPurchaseComplete(true)
  }

  const handleClose = useCallback(() => {
    setPurchaseComplete(false)
    onClose()
  }, [onClose])

  const handleDecrease = (index: number, currentQty: number) => {
    if (currentQty <= 1) {
      setConfirmRemoveIndex(index)
    } else {
      updateQuantity(index, currentQty - 1)
    }
  }

  const confirmRemove = () => {
    if (confirmRemoveIndex !== null) {
      removeItem(confirmRemoveIndex)
      setConfirmRemoveIndex(null)
    }
  }

  const cancelRemove = () => {
    setConfirmRemoveIndex(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleClose])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose()
      }
    }
    if (open) {
      setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 0)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, handleClose])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" aria-hidden />

  
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Carrito de compras"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l bg-card shadow-xl animate-fade-in"
      >
 
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold">Carrito ({count})</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

    
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 opacity-40" />
              <p className="text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((item, index) => (
                <li key={`${item.id}-${index}`} className="flex gap-4 px-5 py-5">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                    <img
                      src={item.imgUrl}
                      alt={`${item.brand} ${item.model}`}
                      className="h-full w-full object-contain p-1.5"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.brand}
                    </p>
                    <p className="truncate text-base font-semibold">{item.model}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.colorName} · {item.storageName}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <button
                        onClick={() => handleDecrease(index, item.quantity)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        aria-label="Reducir cantidad"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-9 text-center text-base font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmRemoveIndex(index)}
                        className="ml-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Eliminar ${item.brand} ${item.model}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <p className="text-base font-bold">
                      {item.price === 'sin precio' ? '—' : `${item.price} €`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>


        {items.length > 0 && (
          <div className="border-t px-5 py-4">
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() => handlePurchase()}
            >
              <ShoppingCart className="h-4 w-4" />
              Finalizar compra
            </Button>
          </div>
        )}

        {/* Confirmación de compra realizada */}
        {purchaseComplete && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <div className="mx-6 w-full max-w-xs rounded-2xl border bg-card p-6 shadow-2xl animate-fade-in text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold">¡Compra realizada!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Tu pedido se ha procesado correctamente.
              </p>
              <Button
                className="mt-5 w-full"
                onClick={handleClose}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}

        {/* Diálogo de confirmación de eliminación */}
        {confirmRemoveIndex !== null && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <div className="mx-6 w-full max-w-xs rounded-2xl border bg-card p-6 shadow-2xl animate-fade-in">
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                  <Trash2 className="h-4.5 w-4.5 text-destructive" />
                </div>
                <h3 className="text-base font-bold">Eliminar producto</h3>
              </div>
              <p className="mb-5 text-sm text-muted-foreground">
                ¿Quieres eliminar{' '}
                <span className="font-semibold text-foreground">
                  {items[confirmRemoveIndex]?.brand} {items[confirmRemoveIndex]?.model}
                </span>{' '}
                del carrito?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={cancelRemove}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={confirmRemove}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}


const Layout = () => {
  const { count } = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground transition-colors hover:text-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Smartphone className="h-4 w-4" />
            </div>
            MobileShop
          </Link>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full border bg-secondary/60 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Carrito</span>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground shadow-sm">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </div>
      </header>

      <Breadcrumbs />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t bg-card/80 py-6 text-center text-xs text-muted-foreground shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
      </footer>

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
      <Toaster position="top-right" richColors />
    </div>
  )
}

export default Layout
