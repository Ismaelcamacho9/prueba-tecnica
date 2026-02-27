const BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!BASE_URL) {
    throw new Error('missing VITE_API_BASE_URL env')
}

export const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, options)
    if (!res.ok) 
    throw new Error(`API error: ${res.status}`)
    return res.json() as Promise<T>
}
