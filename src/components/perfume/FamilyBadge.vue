<script setup>
import { computed } from 'vue'
import { FAMILIES } from '@/utils/labels'

const props = defineProps({ family: { type: String, required: true } })
const info = computed(() => FAMILIES[props.family] ?? { label: props.family, color: '#999' })
</script>

<template>
  <span class="badge">
    <span class="dot" :style="{ background: info.color }" />
    {{ info.label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.dot { width: 8px; height: 8px; border-radius: 50%; }
</style>
