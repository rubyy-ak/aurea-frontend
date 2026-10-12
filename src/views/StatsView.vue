<script setup>
import { ref, onMounted, computed } from 'vue'
import { perfumeApi } from '../api'
import { formatEuro } from '../labels'
import StatTile from '../components/StatTile.vue'
import FamilyChart from '../components/FamilyChart.vue'
import EmptyState from '../components/EmptyState.vue'
import FamilyBadge from '../components/FamilyBadge.vue'

const stats = ref(null)
const error = ref('')

const hasFamilies = computed(() => stats.value && Object.keys(stats.value.familyCounts).length > 0)

onMounted(async () => {
  try {
    stats.value = await perfumeApi.stats()
  } catch (e) {
    error.value = e.message
  }
})
</script>

<template>
  <div class="page container">
    <header class="page-header">
      <div>
        <span class="eyebrow">Dein Duftprofil</span>
        <h1>Statistik</h1>
      </div>
    </header>

    <p v-if="error" class="alert">{{ error }}</p>
    <p v-else-if="!stats" class="loading">Einen Moment …</p>

    <template v-else>
      <section class="tiles">
        <StatTile label="Wert der Sammlung" :value="formatEuro(stats.collectionValueEur)" :hint="`${stats.ownedCount} Flakons`" />
        <StatTile label="Wunschliste" :value="formatEuro(stats.wishlistValueEur)" :hint="`${stats.wishlistCount} Wünsche`" />
        <StatTile label="Volumen" :value="`${stats.totalMl} ml`" />
        <StatTile label="Ø Bewertung" :value="stats.averageRating !== null ? `${stats.averageRating.toLocaleString('de-DE')} ★` : '–'" />
      </section>

      <div class="panels">
        <section class="card panel">
          <h2>Duftfamilien</h2>
          <p class="muted sub">Wie sich deine Sammlung verteilt</p>
          <FamilyChart v-if="hasFamilies" :counts="stats.familyCounts" />
          <EmptyState v-else title="Noch keine Daten" text="Füge Parfüms zu deiner Sammlung hinzu." />
        </section>

        <section class="card panel signature">
          <h2>Dein Signaturduft</h2>
          <p class="muted sub">Am häufigsten getragen</p>
          <template v-if="stats.mostWorn">
            <RouterLink :to="`/perfumes/${stats.mostWorn.id}`" class="name">{{ stats.mostWorn.name }}</RouterLink>
            <p class="eyebrow">{{ stats.mostWorn.brand }}</p>
            <FamilyBadge :family="stats.mostWorn.family" />
            <p class="worn">{{ stats.mostWorn.wearCount }}× getragen · insgesamt {{ stats.totalWears }} Trage-Tage</p>
          </template>
          <p v-else class="muted">Markiere auf einer Karte „Heute getragen“, um deinen Signaturduft zu entdecken.</p>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
.panels { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; }
.panel { padding: 32px; }
.sub { margin: 4px 0 28px; font-size: 0.9rem; }
.panel :deep(.empty) { box-shadow: none; border: 0; padding: 24px 0; }
.signature .name { display: block; font-family: var(--font-display); font-style: italic; font-size: 2.4rem; line-height: 1.1; margin-bottom: 6px; }
.signature .name:hover { color: var(--gold-deep); }
.signature .eyebrow { margin-bottom: 14px; }
.worn { margin-top: 20px; color: var(--muted); font-size: 0.9rem; }
@media (max-width: 860px) {
  .tiles { grid-template-columns: repeat(2, 1fr); }
  .panels { grid-template-columns: 1fr; }
}
</style>
