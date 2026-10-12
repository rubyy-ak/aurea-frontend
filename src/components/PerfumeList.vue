<script setup>
import PerfumeCard from './PerfumeCard.vue'

defineProps({ perfumes: { type: Array, required: true } })
const emit = defineEmits(['toggle-favorite', 'wear', 'purchase'])
</script>

<template>
  <TransitionGroup tag="div" name="list" class="grid perfume-list">
    <PerfumeCard
      v-for="perfume in perfumes"
      :key="perfume.id"
      :perfume="perfume"
      @toggle-favorite="emit('toggle-favorite', $event)"
      @wear="emit('wear', $event)"
      @purchase="emit('purchase', $event)"
    />
  </TransitionGroup>
</template>

<style scoped>
.list-enter-active,
.list-leave-active { transition: opacity 0.3s var(--ease), transform 0.3s var(--ease); }
.list-enter-from,
.list-leave-to { opacity: 0; transform: translateY(8px); }
</style>
