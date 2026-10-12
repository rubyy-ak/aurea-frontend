<script setup>
import { FAMILIES, SORTS } from '../labels'

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
  </div>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 32px;
}
@media (max-width: 800px) {
  .filters { grid-template-columns: 1fr 1fr; }
  .search { grid-column: 1 / -1; }
}
</style>
