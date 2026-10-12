<script setup>
import PerfumeCard from '@/components/perfume/PerfumeCard.vue'

defineProps({ perfumes: { type: Array, required: true } })
const emit = defineEmits(['purchase'])
</script>

<template>
  <TransitionGroup tag="div" name="list" class="grid perfume-list">
    <PerfumeCard
      v-for="perfume in perfumes"
      :key="perfume.id"
      :perfume="perfume"
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
