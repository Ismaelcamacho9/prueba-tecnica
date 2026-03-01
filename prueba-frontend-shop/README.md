# prueba-frontend-shop

Aplicación frontend de una tienda de smartphones construida con **React 19**, **TypeScript** y **Vite**.

---

## Arquitectura del proyecto

```
src/
├── api/              # Capa de acceso a datos (fetch wrapper + endpoints)
│   ├── client.ts     # Cliente HTTP genérico con manejo de errores (ApiError)
│   ├── products.ts   # Endpoints de productos
│   └── cart.ts       # Endpoints del carrito
├── schemas/          # Validación en runtime con Zod
│   ├── product.ts    # Esquema de producto
│   └── cart.ts       # Esquema de carrito
├── hooks/            # Custom hooks (React Query + lógica de negocio)
│   ├── useProducts.ts
│   ├── useProduct.ts
│   ├── useFilteredProducts.ts
│   ├── useCart.ts
│   └── useAddToCart.ts
├── context/          # Estado global del carrito (Context + localStorage)
│   ├── cart-context.ts
│   └── cart-provider.tsx
├── pages/            # Vistas / páginas
│   ├── Layout.tsx          # Shell con header, breadcrumbs y panel de carrito
│   ├── ProductListPage.tsx # Listado con búsqueda y filtrado
│   ├── ProductDetailPage.tsx
│   └── NotFoundPage.tsx
├── components/       # Componentes reutilizables y UI (shadcn/ui)
│   ├── NotFoundState.tsx
│   └── ui/           # Primitivas: Button, Card, Input, Skeleton
├── lib/              # Utilidades y configuración
│   ├── queryClient.ts  # QueryClient con gc/stale time de 1 h
│   └── utils.ts        # Helpers (cn, etc.)
├── router.tsx        # Definición de rutas (TanStack Router)
├── main.tsx          # Entry point con providers y persistencia de caché
└── test/             # Tests unitarios (Vitest + Testing Library)
```

### Decisiones clave

| Aspecto | Decisión |
|---|---|
| **Routing** | TanStack Router — rutas tipo-safe con inferencia de parámetros |
| **Data fetching** | TanStack React Query con persistencia en `localStorage` vía `query-async-storage-persister` |
| **Validación** | Zod para validar las respuestas de la API en runtime |
| **Estado del carrito** | React Context + `localStorage` (sin dependencia de servidor) |
| **Estilos** | Tailwind CSS 3 + componentes shadcn/ui (CVA + tailwind-merge) |
| **Notificaciones** | Sonner (toast ligero) |
| **Iconos** | Lucide React |

---

## Dependencias principales

| Paquete | Versión | Propósito |
|---|---|---|
| `react` / `react-dom` | 19 | Librería de UI |
| `@tanstack/react-query` | 5 | Caché de datos del servidor, refetch y mutaciones |
| `@tanstack/react-query-persist-client` | 5 | Persistencia de la caché en localStorage |
| `@tanstack/react-router` | 1 | Enrutado tipo-safe |
| `zod` | 4 | Validación de esquemas en runtime |
| `tailwindcss` | 3 | Utilidades CSS |
| `class-variance-authority` | 0.7 | Variantes de componentes (shadcn/ui) |
| `sonner` | 2 | Sistema de notificaciones toast |
| `lucide-react` | 0.575 | Iconos SVG |

### Dependencias de desarrollo

| Paquete | Propósito |
|---|---|
| `vite` | Bundler y dev server |
| `vitest` | Test runner (compatible con Vite) |
| `@testing-library/react` + `jsdom` | Testing de componentes |
| `typescript` | Tipado estático |
| `eslint` + `prettier` | Linting y formateo |
| `@vitest/coverage-v8` | Cobertura de tests con V8 |

---

## Requisitos

- Node.js ≥ 20
- npm ≥ 10

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=https://tu-api.com
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run start` | Inicia Vite en modo desarrollo |
| `npm run dev` | Inicia Vite en modo desarrollo |
| `npm run build` | Compila TypeScript y genera build de producción |
| `npm run preview` | Sirve localmente el build generado |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |
| `npm run test` | Ejecuta los tests una vez |
| `npm run test:watch` | Ejecuta los tests en modo watch |
| `npm run test:coverage` | Ejecuta los tests y genera reporte de cobertura |

## Testing

La configuración de tests usa **Vitest** + **Testing Library** con entorno `jsdom`.

```bash
# Ejecutar tests
npm run test

# Modo watch
npm run test:watch

# Cobertura
npm run test:coverage
```

El reporte de cobertura se genera en `./coverage/` en formatos **text** (consola), **HTML** y **LCOV**.

### Cobertura actual

| Métrica | % |
|---|---|
| **Statements** | 94.57 |
| **Branches** | 75.97 |
| **Functions** | 94.73 |
| **Lines** | 94.46 |

### Ficheros de test

| Fichero | Qué cubre |
|---|---|
| `schemas.test.ts` | Validación de schemas de producto y carrito (happy + error paths) |
| `schemas-transforms.test.ts` | Ramas de transformación Zod (strings vacíos, arrays, `N/A`, `sin precio`) |
| `client.test.ts` | `ApiError`, `apiFetch` (respuesta ok, error, paso de opciones) |
| `products-api.test.ts` | `fetchProducts` y `fetchProductById` |
| `cart-api.test.ts` | `addToCart` |
| `hooks.test.tsx` | `useProducts`, `useProduct` (éxito, error, retry, enabled), `useCart` fuera de provider |
| `use-add-to-cart.test.tsx` | `useAddToCart` mutación (éxito + error) |
| `filtered-products.test.ts` | `useFilteredProducts` (filtrado, case-insensitive, parcial, vacío) |
| `cart-context.test.tsx` | `CartProvider` (add, remove, update, clear, persist, setCount) |
| `lib.test.ts` | `cn()` utility y configuración de `queryClient` |
| `components.test.tsx` | Button (variantes + tamaños), Card, Input, Skeleton |
| `not-found.test.tsx` | `NotFoundState` y `NotFoundPage` |
| `product-list-page.test.tsx` | Loading, success, error, búsqueda, precios |
| `product-detail-page.test.tsx` | Loading, success, specs, opciones, 404/500, sin precio |
| `layout.test.tsx` | Header, breadcrumbs, carrito (abrir/cerrar, Escape, incrementar, decrementar, eliminar, compra) |
