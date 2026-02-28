import { useEffect, useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { ArrowLeft, ShoppingCart, Cpu, MemoryStick, Monitor, Battery, Camera, Ruler, Smartphone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useProduct } from '@/hooks/useProduct'

const ProductDetailPage = () => {
  const { id } = useParams({ from: '/product/$id' })
  const { data, isPending, isError, error } = useProduct(id)
  const addToCart = useAddToCart()
  const [selectedColorCode, setSelectedColorCode] = useState<number | null>(null)
  const [selectedStorageCode, setSelectedStorageCode] = useState<number | null>(null)

  useEffect(() => {
    if (data) {
      setSelectedColorCode(data.options.colors[0]?.code ?? null)
      setSelectedStorageCode(data.options.storages[0]?.code ?? null)
    }
  }, [data])

  if (isPending) {
    return (
      <section className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-7 w-1/4" />
          <Skeleton className="mt-6 h-px w-full" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
          <Skeleton className="mt-4 h-12 w-48 rounded-lg" />
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-destructive/25 bg-destructive/5 p-6 text-sm text-destructive">
        Error cargando detalle: {error instanceof Error ? error.message : 'Error desconocido'}
      </section>
    )
  }
  if (!data) {
    return (
      <section className="rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
        Producto no encontrado.
      </section>
    )
  }

  const selectedColor = data.options.colors.find((c) => c.code === selectedColorCode)
  const selectedStorage = data.options.storages.find((s) => s.code === selectedStorageCode)
  const canAdd = !!selectedColor && !!selectedStorage

  const specs = [
    { icon: Cpu, label: 'CPU', value: data.cpu },
    { icon: MemoryStick, label: 'RAM', value: data.ram },
    { icon: Smartphone, label: 'SO', value: data.os },
    { icon: Monitor, label: 'Pantalla', value: data.displayResolution },
    { icon: Battery, label: 'Batería', value: data.battery },
    { icon: Ruler, label: 'Dimensiones', value: data.dimentions },
  ]

  return (
    <section className="animate-fade-in space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Imagen */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="aspect-square bg-gradient-to-br from-secondary/60 to-secondary/30">
              <img
                src={data.imgUrl}
                alt={`${data.brand} ${data.model}`}
                className="h-full w-full object-contain p-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{data.brand}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{data.model}</h1>
            <p className="mt-3 text-2xl font-bold">
              {data.price === 'sin precio'
                ? <span className="text-muted-foreground">Sin precio</span>
                : `${data.price} €`}
            </p>
          </div>

          <hr className="border-border" />

          {/* Especificaciones */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Especificaciones</h2>
            <div className="grid grid-cols-2 gap-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 rounded-lg border bg-secondary/30 p-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                    <p className="truncate text-sm font-medium">{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cámaras */}
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cámaras</h2>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-lg border bg-secondary/30 px-3 py-2">
                <Camera className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{data.primaryCamera.join(' / ')}</span>
              </div>
              {data.secondaryCmera.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg border bg-secondary/30 px-3 py-2">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Frontal: {data.secondaryCmera.join(' / ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Opciones */}
          {(data.options.colors.length > 0 || data.options.storages.length > 0) && (
            <div className="flex flex-wrap gap-6">
              {data.options.colors.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {data.options.colors.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setSelectedColorCode(c.code)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedColorCode === c.code
                            ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                            : 'bg-secondary/50 text-foreground hover:border-foreground/30'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {data.options.storages.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Almacenamiento</p>
                  <div className="flex flex-wrap gap-2">
                    {data.options.storages.map((s) => (
                      <button
                        key={s.code}
                        type="button"
                        onClick={() => setSelectedStorageCode(s.code)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedStorageCode === s.code
                            ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                            : 'bg-secondary/50 text-foreground hover:border-foreground/30'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <hr className="border-border" />

          {/* Acción */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              size="lg"
              disabled={!canAdd || addToCart.isPending}
              className="gap-2 rounded-xl px-8 shadow-sm transition-all hover:shadow-md"
              onClick={() => {
                if (!canAdd || !selectedColor || !selectedStorage) return
                addToCart.mutate({
                  id: data.id,
                  colorCode: selectedColor.code,
                  storageCode: selectedStorage.code,
                  product: {
                    brand: data.brand,
                    model: data.model,
                    price: data.price,
                    imgUrl: data.imgUrl,
                    colorName: selectedColor.name,
                    storageName: selectedStorage.name,
                  },
                })
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              {addToCart.isPending ? 'Añadiendo…' : 'Añadir al carrito'}
            </Button>
            {addToCart.isError && (
              <p className="text-sm font-medium text-destructive">Error al añadir al carrito</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailPage
