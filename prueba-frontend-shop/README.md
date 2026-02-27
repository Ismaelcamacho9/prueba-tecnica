# prueba-frontend-shop

Aplicación frontend construida con React + TypeScript + Vite.

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

1. Instalar dependencias:

   npm install

## Ejecución en desarrollo

Iniciar servidor local:

npm run dev

## Scripts disponibles

- `npm run dev`: inicia Vite en modo desarrollo.
- `npm run build`: compila TypeScript y genera build de producción.
- `npm run preview`: sirve localmente el build generado.
- `npm run lint`: ejecuta ESLint sobre el proyecto.

## Testing

La configuración de tests usa Vitest + Testing Library con entorno `jsdom`.

Ejecutar tests:

npx vitest

Modo watch:

npx vitest --watch
