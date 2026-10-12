<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { perfumeApi } from '../api'
import { concentrationLabel, formatEuro } from '../labels'
import { usePerfumeActions } from '../usePerfumeActions'
import FamilyBadge from '../components/FamilyBadge.vue'
import StarRating from '../components/StarRating.vue'
import BottleArt from '../components/BottleArt.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import Toast from '../components/Toast.vue'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()

const list = ref([])
const perfume = computed(() => list.value[0])
const loading = ref(true)
const error = ref('')
const confirmOpen = ref(false)

const { notice, purchase } = usePerfumeActions(list)

const pyramid = computed(() => [
  { label: 'Kopfnote', hint: 'die ersten Minuten', value: perfume.value?.topNotes },
  { label: 'Herznote', hint: 'die ersten Stunden', value: perfume.value?.heartNotes },
  { label: 'Basisnote', hint: 'was bleibt', value: perfume.value?.baseNotes },
])

onMounted(async () => {
  try {
    list.value = [await perfumeApi.get(props.id)]
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

async function remove() {
  confirmOpen.value = false
  try {
    const back = perfume.value.status === 'WISHLIST' ? '/wishlist' : '/collection'
    await perfumeApi.remove(props.id)
    router.push(back)
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="page container">
    <p v-if="loading" class="loading">Einen Moment …</p>
    <div v-else-if="error" class="alert">{{ error }}</div>

    <article v-else-if="perfume" class="detail">
      <div class="visual card">
        <BottleArt :family="perfume.family" :initial="perfume.brand.charAt(0)" />
      </div>

      <div class="info">
        <RouterLink :to="perfume.status === 'WISHLIST' ? '/wishlist' : '/collection'" class="back">
          ← {{ perfume.status === 'WISHLIST' ? 'Wunschliste' : 'Sammlung' }}
        </RouterLink>
        <p class="eyebrow">{{ perfume.brand }}</p>
        <h1>{{ perfume.name }}</h1>
        <p class="concentration">{{ concentrationLabel(perfume.concentration) }}</p>
        <div class="badges">
          <FamilyBadge :family="perfume.family" />
          <StarRating v-if="perfume.rating" :model-value="perfume.rating" readonly />
          <span v-if="perfume.favorite" class="fav-tag">♥ Favorit</span>
          <span v-if="perfume.status === 'WISHLIST'" class="wish-tag">Wunschliste</span>
        </div>

        <hr class="divider" />

        <dl class="facts">
          <div><dt>Größe</dt><dd>{{ perfume.sizeMl ? `${perfume.sizeMl} ml` : '–' }}</dd></div>
          <div><dt>Preis</dt><dd>{{ formatEuro(perfume.priceEur) }}</dd></div>
          <div><dt>Bewertung</dt><dd>{{ perfume.rating ? `${perfume.rating} / 5` : '–' }}</dd></div>
        </dl>

        <section class="pyramid">
          <div v-for="(level, index) in pyramid" :key="level.label" class="level" :style="{ '--i': index }">
            <span class="eyebrow">{{ level.label }}</span>
            <span class="notes">{{ level.value || '—' }}</span>
            <span class="muted small">{{ level.hint }}</span>
          </div>
        </section>

        <div class="actions">
          <button v-if="perfume.status === 'WISHLIST'" class="btn" @click="purchase(perfume)">Gekauft – in die Sammlung</button>
          <RouterLink :to="`/perfumes/${perfume.id}/edit`" class="btn btn-ghost">Bearbeiten</RouterLink>
          <button class="btn btn-danger" @click="confirmOpen = true">Löschen</button>
        </div>
      </div>
    </article>

    <ConfirmDialog
      :open="confirmOpen"
      title="Parfüm löschen?"
      :text="perfume ? `„${perfume.name}“ wird endgültig entfernt.` : ''"
      confirm-label="Löschen"
      @confirm="remove"
      @cancel="confirmOpen = false"
    />
    <Toast :message="notice" />
  </div>
</template>

<style scoped>
.detail { display: grid; grid-template-columns: 1fr 1.2fr; gap: 56px; align-items: start; }
.visual {
  position: sticky;
  top: 104px;
  height: 480px;
  padding: 56px;
  display: flex;
  justify-content: center;
  background: radial-gradient(circle at 50% 35%, #fff 0%, #f1e9dc 75%);
}
.back { display: inline-block; font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 28px; }
.back:hover { color: var(--gold-deep); }
h1 { margin-top: 6px; font-size: clamp(2.6rem, 5vw, 3.8rem); }
.concentration { font-family: var(--font-display); font-style: italic; font-size: 1.3rem; color: var(--muted); margin-top: 4px; }
.badges { display: flex; align-items: center; gap: 18px; margin-top: 16px; flex-wrap: wrap; }
.wish-tag { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; background: var(--gold-soft); color: var(--gold-deep); }
.fav-tag { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; background: #f6e6e6; color: #a5605f; }
.divider { margin: 28px 0; }
.facts { display: grid; grid-template-columns: repeat(3, auto); gap: 24px; margin: 0 0 36px; justify-content: start; }
.facts dt { font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
.facts dd { margin: 4px 0 0; font-family: var(--font-display); font-size: 1.4rem; }
.pyramid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 36px; }
.level {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 16px;
  align-items: baseline;
  padding: 16px 20px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--paper);
  margin-left: calc(var(--i) * 18px);
}
.notes { font-family: var(--font-display); font-size: 1.2rem; }
.small { font-size: 0.8rem; }
.actions { display: flex; gap: 12px; flex-wrap: wrap; }
@media (max-width: 860px) {
  .detail { grid-template-columns: 1fr; gap: 32px; }
  .visual { position: static; aspect-ratio: auto; height: 280px; padding: 32px; }
  .facts { grid-template-columns: repeat(2, auto); }
  .level { grid-template-columns: 1fr; gap: 2px; margin-left: 0; }
}
</style>
