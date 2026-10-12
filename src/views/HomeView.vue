<script setup>
import { onMounted, ref, computed } from 'vue'
import { perfumeApi } from '../api'
import { session } from '../auth'
import { formatEuro } from '../labels'
import { usePerfumeActions } from '../usePerfumeActions'
import SuggestionCard from '../components/SuggestionCard.vue'
import StatTile from '../components/StatTile.vue'
import PerfumeList from '../components/PerfumeList.vue'
import Toast from '../components/Toast.vue'

const suggestion = ref(null)
const stats = ref(null)
const recent = ref([])
const loading = ref(true)
const error = ref('')

const { notice, toggleFavorite, wear } = usePerfumeActions(recent)

const greeting = computed(() => {
  const hour = new Date().getHours()
  return hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'
})

async function load() {
  try {
    const [s, st, list] = await Promise.all([
      perfumeApi.suggestion(),
      perfumeApi.stats(),
      perfumeApi.list({ status: 'OWNED' }),
    ])
    suggestion.value = s
    stats.value = st
    recent.value = list.slice(0, 4)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function wearSuggested(perfume) {
  await wear(perfume)
  const [s, st] = await Promise.all([perfumeApi.suggestion(), perfumeApi.stats()])
  suggestion.value = s
  stats.value = st
}

onMounted(load)
</script>

<template>
  <div class="page container">
    <header class="page-header">
      <div>
        <span class="eyebrow">{{ new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }) }}</span>
        <h1>{{ greeting }}, <em>{{ session.username }}</em></h1>
      </div>
    </header>

    <p v-if="loading" class="loading">Einen Moment …</p>
    <p v-else-if="error" class="alert">{{ error }}</p>

    <template v-else>
      <SuggestionCard v-if="suggestion" :suggestion="suggestion" @wear="wearSuggested" />

      <section v-if="stats" class="tiles">
        <StatTile label="In der Sammlung" :value="stats.ownedCount" :hint="`${stats.totalMl} ml insgesamt`" />
        <StatTile label="Wunschliste" :value="stats.wishlistCount" :hint="formatEuro(stats.wishlistValueEur)" />
        <StatTile label="Favoriten" :value="stats.favoriteCount" />
        <StatTile label="Getragen" :value="`${stats.totalWears}×`" />
      </section>

      <section v-if="recent.length" class="recent">
        <div class="section-head">
          <h2>Zuletzt hinzugefügt</h2>
          <RouterLink to="/collection" class="more">Ganze Sammlung →</RouterLink>
        </div>
        <PerfumeList :perfumes="recent" @toggle-favorite="toggleFavorite" @wear="wear" />
      </section>
    </template>

    <Toast :message="notice" />
  </div>
</template>

<style scoped>
h1 em { font-style: italic; color: var(--gold-deep); }
.tiles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 32px 0 64px;
}
.section-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; gap: 12px; }
.more { font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold-deep); }
@media (max-width: 860px) { .tiles { grid-template-columns: repeat(2, 1fr); } }
</style>
