import { request } from './apiClient'

export const perfumeApi = {
  list: (params) => request('/api/perfumes', { params }),
  get: (id) => request(`/api/perfumes/${id}`),
  create: (perfume) => request('/api/perfumes', { method: 'POST', body: perfume }),
  update: (id, perfume) => request(`/api/perfumes/${id}`, { method: 'PUT', body: perfume }),
  remove: (id) => request(`/api/perfumes/${id}`, { method: 'DELETE' }),
  purchase: (id) => request(`/api/perfumes/${id}/purchase`, { method: 'POST' }),
  suggestion: (weather) => request('/api/perfumes/suggestion', { params: weather ?? {} }),
}
