<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { perfumeApi } from '@/services/perfumeService'
import { FAMILIES, CONCENTRATIONS } from '@/utils/labels'
import { validatePerfume } from '@/utils/validation'
import StarRating from '@/components/common/StarRating.vue'

const props = defineProps({ id: { type: String, default: null } })
const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!props.id)
const form = ref({
  name: '',
  brand: '',
  concentration: 'EAU_DE_PARFUM',
  family: '',
  topNotes: '',
  heartNotes: '',
  baseNotes: '',
  sizeMl: '',
  priceEur: '',
  rating: null,
  status: route.query.status === 'WISHLIST' ? 'WISHLIST' : 'OWNED',
  favorite: false,
})
const errors = ref({})
const message = ref('')
const busy = ref(false)
const loading = ref(false)

onMounted(async () => {
  if (!isEdit.value) return
  loading.value = true
  try {
    const p = await perfumeApi.get(props.id)
    form.value = {
      ...p,
      topNotes: p.topNotes ?? '',
      heartNotes: p.heartNotes ?? '',
      baseNotes: p.baseNotes ?? '',
      sizeMl: p.sizeMl ?? '',
      priceEur: p.priceEur ?? '',
    }
  } catch (e) {
    message.value = e.message
  } finally {
    loading.value = false
  }
})

function toPayload(f) {
  const empty = (v) => v === '' || v === null || v === undefined
  return {
    name: f.name.trim(),
    brand: f.brand.trim(),
    concentration: f.concentration,
    family: f.family,
    topNotes: f.topNotes,
    heartNotes: f.heartNotes,
    baseNotes: f.baseNotes,
    sizeMl: empty(f.sizeMl) ? null : Number(f.sizeMl),
    priceEur: empty(f.priceEur) ? null : Number(String(f.priceEur).replace(',', '.')),
    rating: f.rating,
    status: f.status,
    favorite: f.favorite,
  }
}

async function submit() {
  message.value = ''
  errors.value = validatePerfume(form.value)
  if (Object.keys(errors.value).length) {
    message.value = 'Bitte die markierten Felder prüfen.'
    return
  }
  busy.value = true
  try {
    const payload = toPayload(form.value)
    const saved = isEdit.value
      ? await perfumeApi.update(props.id, payload)
      : await perfumeApi.create(payload)
    router.push(`/perfumes/${saved.id}`)
  } catch (e) {
    errors.value = e.fieldErrors ?? {}
    message.value = e.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="page container narrow">
    <header class="page-header">
      <div>
        <span class="eyebrow">{{ isEdit ? 'Bearbeiten' : 'Neuer Duft' }}</span>
        <h1>{{ isEdit ? 'Parfüm bearbeiten' : 'Parfüm hinzufügen' }}</h1>
      </div>
    </header>

    <p v-if="loading" class="loading">Einen Moment …</p>

    <form v-else class="form card" novalidate @submit.prevent="submit">
      <p v-if="message" class="alert">{{ message }}</p>

      <fieldset class="status-switch">
        <legend class="sr-only">Wohin?</legend>
        <label :class="{ active: form.status === 'OWNED' }">
          <input v-model="form.status" type="radio" value="OWNED" /> In meiner Sammlung
        </label>
        <label :class="{ active: form.status === 'WISHLIST' }">
          <input v-model="form.status" type="radio" value="WISHLIST" /> Auf der Wunschliste
        </label>
      </fieldset>

      <div class="row two">
        <div class="field" :class="{ 'has-error': errors.name }">
          <label for="name">Name *</label>
          <input id="name" v-model="form.name" class="input" placeholder="z. B. Baccarat Rouge 540" />
          <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
        </div>
        <div class="field" :class="{ 'has-error': errors.brand }">
          <label for="brand">Marke *</label>
          <input id="brand" v-model="form.brand" class="input" placeholder="z. B. Maison Francis Kurkdjian" />
          <span v-if="errors.brand" class="field-error">{{ errors.brand }}</span>
        </div>
      </div>

      <div class="row two">
        <div class="field" :class="{ 'has-error': errors.concentration }">
          <label for="concentration">Konzentration *</label>
          <select id="concentration" v-model="form.concentration" class="select">
            <option v-for="(info, key) in CONCENTRATIONS" :key="key" :value="key">{{ info.label }}</option>
          </select>
          <span v-if="errors.concentration" class="field-error">{{ errors.concentration }}</span>
        </div>
        <div class="field" :class="{ 'has-error': errors.family }">
          <label for="family">Duftfamilie *</label>
          <select id="family" v-model="form.family" class="select">
            <option value="" disabled>Bitte wählen</option>
            <option v-for="(info, key) in FAMILIES" :key="key" :value="key">{{ info.label }}</option>
          </select>
          <span v-if="errors.family" class="field-error">{{ errors.family }}</span>
        </div>
      </div>

      <div class="notes">
        <p class="eyebrow">Duftpyramide</p>
        <div class="row three">
          <div class="field" :class="{ 'has-error': errors.topNotes }">
            <label for="top">Kopfnote</label>
            <input id="top" v-model="form.topNotes" class="input" placeholder="Bergamotte, Safran" />
            <span v-if="errors.topNotes" class="field-error">{{ errors.topNotes }}</span>
          </div>
          <div class="field" :class="{ 'has-error': errors.heartNotes }">
            <label for="heart">Herznote</label>
            <input id="heart" v-model="form.heartNotes" class="input" placeholder="Jasmin, Rose" />
            <span v-if="errors.heartNotes" class="field-error">{{ errors.heartNotes }}</span>
          </div>
          <div class="field" :class="{ 'has-error': errors.baseNotes }">
            <label for="base">Basisnote</label>
            <input id="base" v-model="form.baseNotes" class="input" placeholder="Ambra, Zedernholz" />
            <span v-if="errors.baseNotes" class="field-error">{{ errors.baseNotes }}</span>
          </div>
        </div>
      </div>

      <div class="row three">
        <div class="field" :class="{ 'has-error': errors.sizeMl }">
          <label for="size">Größe (ml)</label>
          <input id="size" v-model="form.sizeMl" class="input" type="number" min="1" max="1000" step="1" />
          <span v-if="errors.sizeMl" class="field-error">{{ errors.sizeMl }}</span>
        </div>
        <div class="field" :class="{ 'has-error': errors.priceEur }">
          <label for="price">Preis (€)</label>
          <input id="price" v-model="form.priceEur" class="input" inputmode="decimal" placeholder="0,00" />
          <span v-if="errors.priceEur" class="field-error">{{ errors.priceEur }}</span>
        </div>
        <div class="field">
          <label>Bewertung</label>
          <div class="rating"><StarRating v-model="form.rating" /></div>
        </div>
      </div>

      <label class="check">
        <input v-model="form.favorite" type="checkbox" /> <span class="heart">♥</span> Als Favorit markieren
      </label>

      <div class="buttons">
        <button type="button" class="btn btn-ghost" @click="router.back()">Abbrechen</button>
        <button type="submit" class="btn" :disabled="busy">
          {{ busy ? 'Speichern …' : isEdit ? 'Änderungen speichern' : 'Hinzufügen' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.narrow { max-width: 860px; }
.form { padding: 40px; display: flex; flex-direction: column; gap: 24px; }
.row { display: grid; gap: 20px; }
.row.two { grid-template-columns: 1fr 1fr; }
.row.three { grid-template-columns: repeat(3, 1fr); }
.notes { padding: 24px; background: var(--ivory); border-radius: 12px; display: flex; flex-direction: column; gap: 16px; }
.rating { padding: 10px 0; }
.rating :deep(.star) { font-size: 1.6rem; }
.status-switch { display: flex; gap: 8px; border: 0; padding: 4px; margin: 0; background: var(--ivory); border-radius: 999px; width: fit-content; flex-wrap: wrap; }
.status-switch label {
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.status-switch label.active { background: var(--ink); color: var(--paper); }
.status-switch input { position: absolute; opacity: 0; pointer-events: none; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.check { display: flex; align-items: center; gap: 10px; cursor: pointer; width: fit-content; }
.check input { accent-color: var(--gold-deep); width: 16px; height: 16px; }
.heart { color: var(--rose); }
.buttons { display: flex; justify-content: flex-end; gap: 12px; padding-top: 8px; border-top: 1px solid var(--line); flex-wrap: wrap; }
.buttons .btn { margin-top: 16px; }
@media (max-width: 720px) {
  .form { padding: 24px 18px; }
  .row.two, .row.three { grid-template-columns: 1fr; }
}
</style>
