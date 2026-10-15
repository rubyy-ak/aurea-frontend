<script setup>
import { onMounted, ref } from 'vue'
import { perfumeApi } from '@/services/perfumeService'

const summary = ref(null)
const loading = ref(true)
const error = ref('')

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

async function load() {
  loading.value = true
  error.value = ''
  try {
    summary.value = await perfumeApi.summary()
  } catch (e) {
    error.value = e.message || 'Zusammenfassung konnte nicht geladen werden.'
  } finally {
    loading.value = false
  }
}

defineExpose({ load })
onMounted(load)
</script>

<template>
  <section class="summary" aria-labelledby="summary-title">
    <h2 id="summary-title" class="summary-title">Wert deiner Sammlung</h2>

    <p v-if="loading" class="muted" role="status">Zusammenfassung wird geladen …</p>
    <p v-else-if="error" class="alert" role="alert">{{ error }}</p>

    <dl v-else class="summary-grid">
      <div>
        <dt>Gesamtwert</dt>
        <dd data-testid="total">{{ euro.format(summary.totalValueEur) }}</dd>
      </div>
      <div>
        <dt>Durchschnittspreis</dt>
        <dd data-testid="average">{{ euro.format(summary.averagePriceEur) }}</dd>
      </div>
      <div>
        <dt>In der Sammlung</dt>
        <dd data-testid="owned">{{ summary.ownedCount }}</dd>
      </div>
      <div>
        <dt>Auf der Wunschliste</dt>
        <dd data-testid="wishlist">{{ summary.wishlistCount }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.summary {
  margin-bottom: 24px;
  padding: 16px 20px;
  border: 1px solid rgb(128 128 128 / 0.25);
  border-radius: 12px;
}
.summary-title { font-size: 1rem; margin-bottom: 12px; }
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin: 0;
}
dt { font-size: 0.875rem; opacity: 0.75; }
dd { margin: 0; font-size: 1.25rem; font-weight: 600; }
</style>