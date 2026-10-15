<script setup>
import FamilyBadge from '@/components/perfume/FamilyBadge.vue'
import BottleArt from '@/components/perfume/BottleArt.vue'

defineProps({
  suggestion: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <section v-if="suggestion" class="suggestion">
    <div class="text">
      <p class="eyebrow">Dein Duft für heute</p>

      <p v-if="suggestion.temperatureC != null" class="weather">
        Berlin · {{ Math.round(suggestion.temperatureC) }} °C<template v-if="suggestion.weather">, {{ suggestion.weather }}</template>
      </p>

      <template v-if="suggestion.perfume">
        <h2>{{ suggestion.perfume.name }}</h2>
        <p class="brand">{{ suggestion.perfume.brand }}</p>
        <FamilyBadge :family="suggestion.perfume.family" />
        <p class="reason">{{ suggestion.reason }}</p>
        <RouterLink :to="`/perfumes/${suggestion.perfume.id}`" class="btn">Details ansehen</RouterLink>
      </template>

      <template v-else-if="suggestion.status === 'NO_MATCH'">
        <h2>Heute passt nichts perfekt</h2>
        <p class="reason">{{ suggestion.reason }}</p>
        <RouterLink to="/collection" class="btn">Zur Sammlung</RouterLink>
      </template>

      <template v-else>
        <h2>Noch kein Flakon im Regal</h2>
        <p class="reason">{{ suggestion.reason }}</p>
        <RouterLink to="/perfumes/new" class="btn">Erstes Parfüm hinzufügen</RouterLink>
      </template>
    </div>

    <div v-if="suggestion.perfume" class="art">
      <BottleArt
        :family="suggestion.perfume.family"
        :initial="suggestion.perfume.brand.charAt(0)"
      />
    </div>
  </section>
</template>

<style scoped>
.suggestion {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  align-items: center;
  gap: 32px;
  padding: 48px;
  border-radius: 22px;
  background: radial-gradient(circle at 85% 30%, rgba(184, 149, 90, 0.25), transparent 55%), var(--ink);
  color: var(--paper);
}
.eyebrow { color: var(--gold); }
.weather { margin: 10px 0 18px; font-size: 0.9rem; color: #cfc4b6; }
h2 { font-size: clamp(2.2rem, 4.5vw, 3.2rem); font-style: italic; }
.brand { letter-spacing: 0.2em; text-transform: uppercase; font-size: 0.8rem; margin: 6px 0 14px; color: #cfc4b6; }
.suggestion :deep(.badge) { color: #e8dfd3; }
.reason { margin: 18px 0 26px; max-width: 42ch; color: #e8dfd3; }
.btn { background: var(--gold); border-color: var(--gold); color: var(--ink); }
.btn:hover { background: var(--paper); border-color: var(--paper); }
.art { height: 240px; display: flex; justify-content: center; }
@media (max-width: 720px) {
  .suggestion { grid-template-columns: 1fr; padding: 32px 24px; }
  .art { display: none; }
}
</style>