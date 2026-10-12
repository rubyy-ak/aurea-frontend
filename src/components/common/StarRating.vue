<script setup>
const props = defineProps({
  modelValue: { type: Number, default: null },
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

function select(value) {
  if (props.readonly) return
  // Erneuter Klick auf denselben Stern entfernt die Bewertung.
  emit('update:modelValue', props.modelValue === value ? null : value)
}
</script>

<template>
  <span class="stars" :class="{ readonly }" role="radiogroup" aria-label="Bewertung">
    <button
      v-for="n in 5"
      :key="n"
      type="button"
      class="star"
      :class="{ filled: modelValue && n <= modelValue }"
      :disabled="readonly"
      :aria-label="`${n} von 5 Sternen`"
      :aria-checked="modelValue === n"
      role="radio"
      @click="select(n)"
    >
      ★
    </button>
  </span>
</template>

<style scoped>
.stars { display: inline-flex; gap: 2px; }
.star {
  background: none;
  border: 0;
  padding: 0 1px;
  font-size: 1.15rem;
  line-height: 1;
  color: var(--line);
  cursor: pointer;
  transition: color 0.15s, transform 0.15s;
}
.star.filled { color: var(--gold); }
.stars:not(.readonly) .star:hover { transform: scale(1.15); }
.readonly .star { cursor: default; font-size: 0.95rem; }
</style>
