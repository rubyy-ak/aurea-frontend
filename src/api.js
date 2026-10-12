import { session, clearSession } from './auth'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(status, message, fieldErrors = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

/** Wird aufgerufen, wenn das Backend 401 meldet (z. B. abgelaufene Sitzung). */
let onUnauthorized = () => {}
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

export async function request(path, { method = 'GET', body, params } = {}) {
  const url = new URL(API_URL + path)
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value)
  })

  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (session.token) headers.Authorization = `Bearer ${session.token}`

  let response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Der Server ist gerade nicht erreichbar. Bitte versuche es gleich noch einmal.')
  }

  if (response.status === 204) return null
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && session.token) {
      clearSession()
      onUnauthorized()
    }
    throw new ApiError(response.status, data?.message ?? 'Etwas ist schiefgelaufen.', data?.fieldErrors ?? {})
  }
  return data
}

export const authApi = {
  register: (username, password) => request('/api/auth/register', { method: 'POST', body: { username, password } }),
  login: (username, password) => request('/api/auth/login', { method: 'POST', body: { username, password } }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
}

export const perfumeApi = {
  list: (params) => request('/api/perfumes', { params }),
  get: (id) => request(`/api/perfumes/${id}`),
  create: (perfume) => request('/api/perfumes', { method: 'POST', body: perfume }),
  update: (id, perfume) => request(`/api/perfumes/${id}`, { method: 'PUT', body: perfume }),
  remove: (id) => request(`/api/perfumes/${id}`, { method: 'DELETE' }),
  toggleFavorite: (id) => request(`/api/perfumes/${id}/favorite`, { method: 'POST' }),
  wear: (id) => request(`/api/perfumes/${id}/wear`, { method: 'POST' }),
  purchase: (id) => request(`/api/perfumes/${id}/purchase`, { method: 'POST' }),
  suggestion: () => request('/api/perfumes/suggestion'),
  stats: () => request('/api/stats'),
}
