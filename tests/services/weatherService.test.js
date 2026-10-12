import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchWeather } from '@/services/weatherService'
import { perfumeApi } from '@/services/perfumeService'
import { API_URL } from '@/services/apiClient'

const okResponse = (body) => ({ ok: true, status: 200, json: () => Promise.resolve(body) })

describe('fetchWeather', () => {
  beforeEach(() => vi.unstubAllGlobals())

  it('liest Temperatur und Wettercode von Open-Meteo', async () => {
    const fetch = vi.fn().mockResolvedValue(okResponse({ current: { temperature_2m: 12.3, weather_code: 3 } }))
    vi.stubGlobal('fetch', fetch)
    expect(await fetchWeather()).toEqual({ temperature: 12.3, weatherCode: 3 })
    expect(fetch.mock.calls[0][0]).toContain('api.open-meteo.com')
  })

  it('liefert null, wenn der Dienst nicht erreichbar ist', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    expect(await fetchWeather()).toBeNull()
  })

  it('liefert null bei Fehlerantwort oder unerwarteten Daten', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429, json: () => Promise.resolve({}) }))
    expect(await fetchWeather()).toBeNull()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse({ current: {} })))
    expect(await fetchWeather()).toBeNull()
  })
})

describe('perfumeApi.suggestion', () => {
  beforeEach(() => vi.unstubAllGlobals())

  it('gibt das Wetter aus dem Browser ans Backend weiter', async () => {
    const fetch = vi.fn().mockResolvedValue(okResponse({}))
    vi.stubGlobal('fetch', fetch)
    await perfumeApi.suggestion({ temperature: 12.3, weatherCode: 3 })
    expect(fetch.mock.calls[0][0].toString()).toBe(
      `${API_URL}/api/perfumes/suggestion?temperature=12.3&weatherCode=3`,
    )
  })

  it('fragt ohne Wetter-Parameter, wenn der Browser kein Wetter hat', async () => {
    const fetch = vi.fn().mockResolvedValue(okResponse({}))
    vi.stubGlobal('fetch', fetch)
    await perfumeApi.suggestion(null)
    expect(fetch.mock.calls[0][0].toString()).toBe(`${API_URL}/api/perfumes/suggestion`)
  })
})
