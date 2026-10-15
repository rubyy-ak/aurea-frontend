<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { perfumeApi } from '@/services/perfumeService'
import { usePerfumeActions } from '@/composables/usePerfumeActions'
import PerfumeList from '@/components/perfume/PerfumeList.vue'
import PerfumeFilters from '@/components/perfume/PerfumeFilters.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Toast from '@/components/common/Toast.vue'

import ExpenseSummary from '@/components/perfume/ExpenseSummary.vue'

/** Gemeinsame Ansicht für Sammlung (OWNED) und Wunschliste (WISHLIST). */
const props = defineProps({ status: { type: String, required: true } })

const perfumes = ref([])
const loading = ref(true)
const error = ref('')
const filters = ref({ q: '', family: '', sort: '', favorite: false })

const isWishlist = computed(() => props.status === 'WISHLIST')
const hasFilters = computed(() => filters.value.q || filters.value.family || filters.value.favorite)

const { notice, purchase } = usePerfumeActions(perfumes, { removeOnPurchase: true })

async function load() {
  error.value = ''
  try {
    perfumes.value = await perfumeApi.list({
      status: props.status,
      q: filters.value.q,
      family: filters.value.family,
      sort: filters.value.sort,
      favorite: filters.value.favorite || undefined,
    })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// Suche leicht verzögert, damit nicht bei jedem Tastendruck angefragt wird.
let debounce
watch(filters, () => {
  clearTimeout(debounce)
  debounce = setTimeout(load, 250)
})

onMounted(load)
</script>

<template>
  <div class="page container">
    <header class="page-header">
      <div>
        <span class="eyebrow">{{ isWishlist ? 'Für später' : 'Mein Regal' }}</span>
        <h1>{{ isWishlist ? 'Wunschliste' : 'Sammlung' }}</h1>
        <p class="muted count">{{ perfumes.length }} {{ perfumes.length === 1 ? 'Duft' : 'Düfte' }}</p>
      </div>
      <RouterLink :to="{ path: '/perfumes/new', query: isWishlist ? { status: 'WISHLIST' } : {} }" class="btn">
        {{ isWishlist ? '+ Wunsch hinzufügen' : '+ Parfüm hinzufügen' }}
      </RouterLink>
    </header>
        <ExpenseSummary v-if="!isWishlist" />
    <PerfumeFilters v-model="filters" />

    <p v-if="loading" class="loading">Einen Moment …</p>
    <p v-else-if="error" class="alert">{{ error }}</p>
    <EmptyState
      v-else-if="!perfumes.length && hasFilters"
      title="Nichts gefunden"
      text="Kein Duft passt zu deiner Suche. Versuch es mit anderen Filtern."
    />
    <EmptyState
      v-else-if="!perfumes.length"
      :title="isWishlist ? 'Deine Wunschliste ist leer' : 'Dein Regal ist noch leer'"
      :text="isWishlist ? 'Notiere Düfte, die du entdecken oder kaufen möchtest.' : 'Füge deinen ersten Flakon hinzu.'"
    >
      <RouterLink :to="{ path: '/perfumes/new', query: isWishlist ? { status: 'WISHLIST' } : {} }" class="btn">
        Jetzt hinzufügen
      </RouterLink>
    </EmptyState>
    <PerfumeList v-else :perfumes="perfumes" @purchase="purchase" />

    <Toast :message="notice" />
  </div>
</template>

<style scoped>
.count { margin-top: 6px; }
</style>
