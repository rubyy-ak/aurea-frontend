<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
})
</script>

<template>
  <div class="empty card">
    <p class="ornament">❦</p>
    <h3>{{ title }}</h3>
    <p v-if="text" class="muted">{{ text }}</p>
    <div class="slot"><slot /></div>
  </div>
</template>

<style scoped>
.empty { padding: 56px 24px; text-align: center; }
.ornament { font-size: 2rem; color: var(--gold); margin-bottom: 8px; }
h3 { margin-bottom: 8px; }
.slot { margin-top: 24px; }
</style>
