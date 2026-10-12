import { ref } from 'vue'
import { perfumeApi } from '@/services/perfumeService'

/**
 * "Gekauft"-Aktion für Wunschlisten-Parfüms inkl. kurzer Rückmeldung.
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

  async function purchase(perfume) {
    let updated
    try {
      updated = await perfumeApi.purchase(perfume.id)
    } catch (e) {
      flash(e.message)
      return
    }
    if (removeOnPurchase) {
      list.value = list.value.filter((p) => p.id !== updated.id)
    } else {
      const index = list.value.findIndex((p) => p.id === updated.id)
      if (index !== -1) list.value[index] = updated
    }
    flash(`${updated.name} ist jetzt in deiner Sammlung.`)
  }

  return { notice, purchase }
}
