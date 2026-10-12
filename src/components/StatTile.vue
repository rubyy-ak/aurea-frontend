<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
})
</script>

<template>
  <div class="tile card">
    <p class="eyebrow">{{ label }}</p>
    <p class="value">{{ value }}</p>
    <p v-if="hint" class="hint muted">{{ hint }}</p>
  </div>
</template>

<style scoped>
.tile { padding: 22px 24px; }
.value {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 500;
  line-height: 1.1;
  margin-top: 8px;
}
.hint { font-size: 0.82rem; margin-top: 4px; }
</style>
