<script setup>
import { computed } from 'vue'
import { CONCENTRATIONS, formatEuro } from '../labels'
import FamilyBadge from './FamilyBadge.vue'
import StarRating from './StarRating.vue'
import BottleArt from './BottleArt.vue'

const props = defineProps({ perfume: { type: Object, required: true } })
const emit = defineEmits(['purchase'])

const isWish = computed(() => props.perfume.status === 'WISHLIST')
const concentration = computed(() => CONCENTRATIONS[props.perfume.concentration]?.short)
</script>

<template>
  <article class="perfume-card card">
    <span v-if="perfume.favorite" class="fav" title="Favorit" aria-label="Favorit">♥</span>
    <RouterLink :to="`/perfumes/${perfume.id}`" class="body">
      <div class="art">
        <BottleArt :family="perfume.family" :initial="perfume.brand.charAt(0)" />
      </div>
      <p class="eyebrow brand">{{ perfume.brand }}</p>
      <h3 class="name">{{ perfume.name }}</h3>
      <p class="meta muted">
        {{ concentration }}<template v-if="perfume.sizeMl"> · {{ perfume.sizeMl }} ml</template>
        <template v-if="perfume.priceEur !== null"> · {{ formatEuro(perfume.priceEur) }}</template>
      </p>
      <div class="row">
        <FamilyBadge :family="perfume.family" />
        <StarRating v-if="perfume.rating" :model-value="perfume.rating" readonly />
      </div>
    </RouterLink>

    <footer v-if="isWish" class="actions">
      <span class="muted hint">Auf der Wunschliste</span>
      <button class="btn btn-ghost btn-sm" @click="emit('purchase', perfume)">Gekauft ✓</button>
    </footer>
  </article>
</template>

<style scoped>
.perfume-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease);
}
.perfume-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lift); }
.body { display: block; padding: 24px 24px 16px; flex: 1; }
.art {
  height: 150px;
  margin: -24px -24px 20px;
  padding: 18px 0 10px;
  background: linear-gradient(180deg, #f3ece1 0%, var(--paper) 100%);
  display: flex;
  justify-content: center;
}
.art :deep(svg) { width: auto; }
.brand { margin-bottom: 4px; }
.name { font-size: 1.55rem; margin-bottom: 6px; }
.meta { font-size: 0.86rem; margin-bottom: 14px; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 24px;
  border-top: 1px solid var(--line);
}
.fav {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--rose);
  background: var(--paper);
  color: var(--rose);
  font-size: 0.95rem;
}
.hint { font-size: 0.82rem; white-space: nowrap; }
</style>
