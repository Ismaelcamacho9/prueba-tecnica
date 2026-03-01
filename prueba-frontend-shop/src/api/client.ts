const BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!BASE_URL) {
    throw new Error('missing VITE_API_BASE_URL env')
}

export class ApiError extends Error {
    status: number

    constructor(status: number, message?: string) {
        super(message ?? `API error: ${status}`)
        this.name = 'ApiError'
        this.status = status
    }
}

export const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, options)
    if (!res.ok)
    throw new ApiError(res.status)
    return res.json() as Promise<T>
}
