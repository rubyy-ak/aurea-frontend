// Berlin – dieselben Koordinaten wie im Backend.
const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.405&current=temperature_2m,weather_code'

/**
 * Holt das aktuelle Wetter direkt im Browser bei Open-Meteo.
 * Liefert { temperature, weatherCode } oder null – die App funktioniert auch ohne Wetter.
 */
export async function fetchWeather({ timeoutMs = 4000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(WEATHER_URL, { signal: controller.signal })
    if (!response.ok) return null
    const data = await response.json()
    const temperature = data?.current?.temperature_2m
    const weatherCode = data?.current?.weather_code
    if (typeof temperature !== 'number' || typeof weatherCode !== 'number') return null
    return { temperature, weatherCode }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
