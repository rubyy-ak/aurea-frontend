import { request } from './apiClient'

export const authApi = {
  register: (username, password) => request('/api/auth/register', { method: 'POST', body: { username, password } }),
  login: (username, password) => request('/api/auth/login', { method: 'POST', body: { username, password } }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
}
