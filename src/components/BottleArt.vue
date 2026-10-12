<script setup>
import { computed } from 'vue'
import { FAMILIES } from '../labels'

/** Dekorativer Flakon, eingefärbt nach Duftfamilie – ersetzt Produktfotos. */
const props = defineProps({
  family: { type: String, required: true },
  initial: { type: String, default: '' },
})
const color = computed(() => FAMILIES[props.family]?.color ?? '#b8955a')
const gradientId = computed(() => `liquid-${props.family}`)
</script>

<template>
  <svg class="bottle" viewBox="0 0 120 150" aria-hidden="true">
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :stop-color="color" stop-opacity="0.35" />
        <stop offset="1" :stop-color="color" stop-opacity="0.85" />
      </linearGradient>
    </defs>
    <rect x="48" y="8" width="24" height="18" rx="3" fill="#1f1a17" />
    <rect x="53" y="26" width="14" height="10" fill="#b8955a" />
    <rect x="22" y="36" width="76" height="104" rx="18" fill="#fffdf9" stroke="#1f1a17" stroke-width="1.2" />
    <rect x="27" y="62" width="66" height="73" rx="14" :fill="`url(#${gradientId})`" />
    <rect x="32" y="44" width="6" height="40" rx="3" fill="#fff" opacity="0.7" />
    <text x="60" y="108" text-anchor="middle" class="initial">{{ initial }}</text>
  </svg>
</template>

<style scoped>
.bottle { width: 100%; height: 100%; }
.initial {
  font-family: var(--font-display);
  font-size: 30px;
  font-style: italic;
  fill: #fffdf9;
}
</style>
