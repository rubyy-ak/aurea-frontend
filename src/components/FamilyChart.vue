<script setup>
import { computed } from 'vue'
import { FAMILIES } from '../labels'

const props = defineProps({ counts: { type: Object, required: true } })

const rows = computed(() => {
  const entries = Object.entries(props.counts).sort((a, b) => b[1] - a[1])
  const max = Math.max(1, ...entries.map(([, count]) => count))
  return entries.map(([key, count]) => ({
    key,
    count,
    label: FAMILIES[key]?.label ?? key,
    color: FAMILIES[key]?.color ?? '#999',
    width: `${(count / max) * 100}%`,
  }))
})
</script>

<template>
  <ul class="chart">
    <li v-for="row in rows" :key="row.key">
      <span class="label">{{ row.label }}</span>
      <span class="track"><span class="bar" :style="{ width: row.width, background: row.color }" /></span>
      <span class="count">{{ row.count }}</span>
    </li>
  </ul>
</template>

<style scoped>
.chart { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
li { display: grid; grid-template-columns: 110px 1fr 28px; align-items: center; gap: 12px; font-size: 0.9rem; }
.track { height: 8px; background: var(--ivory); border-radius: 999px; overflow: hidden; }
.bar { display: block; height: 100%; border-radius: 999px; transition: width 0.6s var(--ease); }
.count { text-align: right; font-weight: 500; }
</style>
