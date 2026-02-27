import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import '@/index.css'
import App from '@/App.tsx'
import { queryClient } from '@/lib/queryClient'

const asyncStorage = {
  getItem: async (key: string) => localStorage.getItem(key),
  setItem: async (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: async (key: string) => localStorage.removeItem(key),
}

const persister = createAsyncStoragePersister({ storage: asyncStorage })
persistQueryClient({ queryClient, persister, maxAge: 1000 * 60 * 60 })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
