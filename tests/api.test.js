import { describe, it, expect, vi, beforeEach } from 'vitest'
import { request, perfumeApi, ApiError, API_URL } from '../src/api'
import { session, setSession, clearSession } from '../src/auth'

function mockFetch(status, body) {
  const fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  })
  vi.stubGlobal('fetch', fetch)
  return fetch
}

describe('api', () => {
  beforeEach(() => {
    clearSession()
    vi.unstubAllGlobals()
  })

  it('sendet das Token als Bearer-Header', async () => {
    setSession({ token: 'abc', username: 'camille' })
    const fetch = mockFetch(200, [])
    await perfumeApi.list({ status: 'OWNED', q: '' })

    const [url, options] = fetch.mock.calls[0]
    expect(url.toString()).toBe(`${API_URL}/api/perfumes?status=OWNED`)
    expect(options.headers.Authorization).toBe('Bearer abc')
  })

  it('schickt JSON bei POST', async () => {
    const fetch = mockFetch(201, { id: 7 })
    const result = await perfumeApi.create({ name: 'X' })
    expect(result).toEqual({ id: 7 })
    expect(fetch.mock.calls[0][1].method).toBe('POST')
    expect(fetch.mock.calls[0][1].body).toBe('{"name":"X"}')
  })

  it('wirft ApiError mit Feldfehlern', async () => {
    mockFetch(400, { message: 'Bitte prüfen.', fieldErrors: { name: 'Pflicht' } })
    const error = await request('/api/perfumes', { method: 'POST', body: {} }).catch((e) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(400)
    expect(error.fieldErrors).toEqual({ name: 'Pflicht' })
  })

  it('meldet bei 401 ab', async () => {
    setSession({ token: 'abgelaufen', username: 'camille' })
    mockFetch(401, { message: 'Bitte melde dich an.' })
    await request('/api/perfumes').catch(() => {})
    expect(session.loggedIn).toBe(false)
  })

  it('übersetzt Netzwerkfehler in eine verständliche Meldung', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const error = await request('/api/perfumes').catch((e) => e)
    expect(error.status).toBe(0)
    expect(error.message).toContain('nicht erreichbar')
  })
})
