const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '')

export const asset = (path) => `${BASE}${path.startsWith('/') ? path : `/${path}`}`
