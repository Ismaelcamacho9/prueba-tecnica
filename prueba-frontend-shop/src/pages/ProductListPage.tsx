import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Search, PackageSearch } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useProducts } from '@/hooks/useProducts'

const ProductListPage = () => {
  const { data, isPending, isError, error } = useProducts()
  const [search, setSearch] = useState('')

  const filteredProducts = useMemo(() => {
    if (!data) return []

    const normalizedQuery = search.trim().toLowerCase()
    if (!normalizedQuery) return data

    return data.filter((product) => {
      const name = `${product.brand} ${product.model}`.toLowerCase()
      return name.includes(normalizedQuery)
    })
  }, [data, search])

  if (isPending) {
    return (
      <section className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-10 w-full sm:w-80" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="overflow-hidden">
              <CardContent className="space-y-4 p-0">
                <Skeleton className="aspect-square w-full rounded-b-none" />
                <div className="space-y-2 px-4 pb-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-destructive/25 bg-destructive/5 p-6 text-sm text-destructive">
        Error cargando productos: {error instanceof Error ? error.message : 'Error desconocido'}
      </section>
    )
  }

  return (
    <section className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Catálogo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data?.length ?? 0} productos disponibles
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por marca o modelo…"
            className="rounded-full bg-secondary/50 pl-9 shadow-sm transition-shadow focus:shadow-md"
            aria-label="Buscar productos"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent className="flex flex-col items-center gap-3 p-6">
            <PackageSearch className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No hay productos que coincidan con &ldquo;{search.trim()}&rdquo;.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <Link
                to="/product/$id"
                params={{ id: product.id }}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="h-full overflow-hidden border shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-secondary/60 to-secondary/30">
                      <img
                        src={product.imgUrl}
                        alt={`${product.brand} ${product.model}`}
                        className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-2 p-4">
                      <CardHeader className="space-y-0.5 p-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {product.brand}
                        </p>
                        <CardTitle className="line-clamp-1 text-sm font-semibold">
                          {product.model}
                        </CardTitle>
                      </CardHeader>
                      <p className="text-base font-bold text-foreground">
                        {product.price === 'sin precio'
                          ? <span className="text-muted-foreground">Sin precio</span>
                          : `${product.price} €`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ProductListPage