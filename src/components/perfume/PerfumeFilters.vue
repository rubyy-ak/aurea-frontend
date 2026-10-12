<script setup>
import { FAMILIES, SORTS } from '@/utils/labels'

const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])

function update(key, value) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="filters">
    <input
      class="input search"
      type="search"
      placeholder="Suche nach Name, Marke oder Duftnote …"
      :value="modelValue.q"
      aria-label="Suche"
      @input="update('q', $event.target.value)"
    />
    <select class="select" :value="modelValue.family" aria-label="Duftfamilie" @change="update('family', $event.target.value)">
      <option value="">Alle Duftfamilien</option>
      <option v-for="(info, key) in FAMILIES" :key="key" :value="key">{{ info.label }}</option>
    </select>
    <select class="select" :value="modelValue.sort" aria-label="Sortierung" @change="update('sort', $event.target.value)">
      <option v-for="(label, key) in SORTS" :key="key" :value="key">{{ label }}</option>
    </select>
    <label class="fav-toggle">
      <input type="checkbox" :checked="modelValue.favorite" @change="update('favorite', $event.target.checked)" />
      <span>♥ Nur Favoriten</span>
    </label>
  </div>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 32px;
}
.fav-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  cursor: pointer;
  white-space: nowrap;
  padding: 0 4px;
}
.fav-toggle input { accent-color: var(--gold-deep); width: 16px; height: 16px; }
@media (max-width: 800px) {
  .filters { grid-template-columns: 1fr 1fr; }
  .search { grid-column: 1 / -1; }
}
</style>
