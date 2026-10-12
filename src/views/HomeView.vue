<script setup>
import { onMounted, ref, computed } from 'vue'
import { perfumeApi } from '@/services/perfumeService'
import { session } from '@/stores/session'
import { fetchWeather } from '@/services/weatherService'
import SuggestionCard from '@/components/home/SuggestionCard.vue'
import PerfumeList from '@/components/perfume/PerfumeList.vue'

const suggestion = ref(null)
const recent = ref([])
const loading = ref(true)
const error = ref('')

const greeting = computed(() => {
  const hour = new Date().getHours()
  return hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'
})

onMounted(async () => {
  try {
    // Wetter holt der Browser selbst – klappt das nicht, fragt das Backend nach.
    const loadSuggestion = fetchWeather().then((weather) => perfumeApi.suggestion(weather))
    const [s, list] = await Promise.all([loadSuggestion, perfumeApi.list({ status: 'OWNED' })])
    suggestion.value = s
    recent.value = list.slice(0, 4)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
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
      <SuggestionCard v-if="suggestion" :suggestion="suggestion" />

      <section v-if="recent.length" class="recent">
        <div class="section-head">
          <h2>Zuletzt hinzugefügt</h2>
          <RouterLink to="/collection" class="more">Ganze Sammlung →</RouterLink>
        </div>
        <PerfumeList :perfumes="recent" />
      </section>
    </template>
  </div>
</template>

<style scoped>
h1 em { font-style: italic; color: var(--gold-deep); }
.recent { margin-top: 64px; }
.section-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; gap: 12px; }
.more { font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold-deep); }
</style>
