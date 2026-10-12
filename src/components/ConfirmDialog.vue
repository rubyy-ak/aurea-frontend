<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Bestätigen' },
})
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="backdrop" @click.self="emit('cancel')">
      <div class="dialog card" role="dialog" aria-modal="true" :aria-label="title">
        <h3>{{ title }}</h3>
        <p v-if="text" class="muted">{{ text }}</p>
        <div class="buttons">
          <button class="btn btn-ghost" @click="emit('cancel')">Abbrechen</button>
          <button class="btn btn-danger" @click="emit('confirm')">{{ confirmLabel }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(31, 26, 23, 0.35);
  backdrop-filter: blur(3px);
}
.dialog { max-width: 420px; width: 100%; padding: 32px; }
h3 { margin-bottom: 8px; }
.buttons { display: flex; justify-content: flex-end; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
</style>
