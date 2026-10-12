<script setup>
defineProps({ message: { type: String, default: '' } })
</script>

<template>
  <Transition name="toast">
    <div v-if="message" class="toast" role="status">{{ message }}</div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  z-index: 60;
  max-width: calc(100vw - 32px);
  padding: 14px 24px;
  border-radius: 999px;
  background: var(--ink);
  color: var(--paper);
  font-size: 0.92rem;
  box-shadow: var(--shadow-lift);
}
.toast-enter-active,
.toast-leave-active { transition: opacity 0.3s var(--ease), transform 0.3s var(--ease); }
.toast-enter-from,
.toast-leave-to { opacity: 0; transform: translate(-50%, 10px); }
</style>
