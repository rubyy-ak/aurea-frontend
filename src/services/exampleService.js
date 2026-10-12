import { request } from './apiClient'

/** Öffentliche Beispiel-Parfüms, ohne Login abrufbar. */
export const exampleApi = {
  list: () => request('/api/examples'),
}
