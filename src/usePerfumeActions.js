import { ref } from 'vue'
import { perfumeApi } from './api'

/**
 * Gemeinsame Aktionen für Parfüm-Karten (Favorit, Tragen, Kaufen).
 * Aktualisiert die übergebene Liste direkt, ohne alles neu zu laden.
 */
export function usePerfumeActions(list, { removeOnPurchase = false } = {}) {
  const notice = ref('')
  let timer

  function flash(message) {
    notice.value = message
    clearTimeout(timer)
    timer = setTimeout(() => (notice.value = ''), 3000)
  }

  function replace(updated) {
    const index = list.value.findIndex((p) => p.id === updated.id)
    if (index !== -1) list.value[index] = updated
  }

  async function run(action) {
    try {
      const updated = await action()
      return updated
    } catch (e) {
      flash(e.message)
      return null
    }
  }

  async function toggleFavorite(perfume) {
    const updated = await run(() => perfumeApi.toggleFavorite(perfume.id))
    if (updated) replace(updated)
  }

  async function wear(perfume) {
    const updated = await run(() => perfumeApi.wear(perfume.id))
    if (updated) {
      replace(updated)
      flash(`${updated.name} – viel Freude damit heute ✦`)
    }
  }

  async function purchase(perfume) {
    const updated = await run(() => perfumeApi.purchase(perfume.id))
    if (!updated) return
    if (removeOnPurchase) list.value = list.value.filter((p) => p.id !== updated.id)
    else replace(updated)
    flash(`${updated.name} ist jetzt in deiner Sammlung.`)
  }

  return { notice, toggleFavorite, wear, purchase }
}
