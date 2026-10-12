<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

const route = useRoute()
const isPublic = computed(() => route.meta.public)
</script>

<template>
  <AppHeader v-if="!isPublic" />
  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </main>
  <footer v-if="!isPublic" class="footer">
    <div class="container">
      <span class="brand">Auréa</span>
      <span class="muted">Deine Parfümsammlung · Wetterdaten von Open-Meteo</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--line);
  padding: 28px 0;
  font-size: 0.85rem;
}
.footer .container {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.brand {
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 0.08em;
}
</style>
