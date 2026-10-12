<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi, exampleApi } from '../api'
import { setSession } from '../auth'
import { validateCredentials } from '../validation'

const router = useRouter()
const route = useRoute()

const mode = ref('login')
const form = reactive({ username: '', password: '' })
const errors = ref({})
const message = ref('')
const busy = ref(false)

const isRegister = computed(() => mode.value === 'register')

// Öffentliche Beispiel-Parfüms als kleiner Vorgeschmack – Fehler sind hier unkritisch.
const examples = ref([])
onMounted(async () => {
  try {
    examples.value = await exampleApi.list()
  } catch {
    examples.value = []
  }
})

function switchMode() {
  mode.value = isRegister.value ? 'login' : 'register'
  errors.value = {}
  message.value = ''
}

async function submit() {
  message.value = ''
  errors.value = validateCredentials(form, mode.value)
  if (Object.keys(errors.value).length) return

  busy.value = true
  try {
    const action = isRegister.value ? authApi.register : authApi.login
    const result = await action(form.username.trim(), form.password)
    setSession(result)
    form.password = ''
    router.push(route.query.redirect || '/')
  } catch (e) {
    errors.value = e.fieldErrors ?? {}
    message.value = e.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="auth">
    <aside class="hero">
      <div class="hero-inner">
        <p class="eyebrow">Deine Duftsammlung</p>
        <h1 class="logo">Auréa</h1>
        <hr class="divider" />
        <p class="tagline">Die Kunst, Düfte zu sammeln.</p>
        <p class="sub">
          Deine Flakons, deine Wunschliste, deine Lieblingsdüfte – an einem Ort.
          Und jeden Morgen ein Vorschlag, der zum Wetter passt.
        </p>
        <div v-if="examples.length" class="examples">
          <p class="eyebrow">Aus dem Beispielregal</p>
          <ul>
            <li v-for="perfume in examples" :key="perfume.id">
              <span class="ex-name">{{ perfume.name }}</span>
              <span class="ex-brand">{{ perfume.brand }}</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <section class="panel">
      <form class="form" novalidate @submit.prevent="submit">
        <p class="eyebrow">{{ isRegister ? 'Willkommen' : 'Schön, dass du da bist' }}</p>
        <h2>{{ isRegister ? 'Konto erstellen' : 'Anmelden' }}</h2>

        <p v-if="message" class="alert">{{ message }}</p>

        <div class="field" :class="{ 'has-error': errors.username }">
          <label for="username">Benutzername</label>
          <input id="username" v-model="form.username" class="input" autocomplete="username" />
          <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
        </div>

        <div class="field" :class="{ 'has-error': errors.password }">
          <label for="password">Passwort</label>
          <input
            id="password"
            v-model="form.password"
            class="input"
            type="password"
            :autocomplete="isRegister ? 'new-password' : 'current-password'"
          />
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
          <span v-else-if="isRegister" class="muted hint">Mindestens 8 Zeichen.</span>
        </div>

        <button class="btn submit" type="submit" :disabled="busy">
          {{ busy ? 'Einen Moment …' : isRegister ? 'Registrieren' : 'Anmelden' }}
        </button>

        <p class="switch muted">
          {{ isRegister ? 'Schon ein Konto?' : 'Neu bei Auréa?' }}
          <button type="button" class="link" @click="switchMode">
            {{ isRegister ? 'Jetzt anmelden' : 'Konto erstellen' }}
          </button>
        </p>
      </form>
    </section>
  </div>
</template>

<style scoped>
.auth { display: grid; grid-template-columns: 1.1fr 1fr; min-height: 100vh; }
.hero {
  display: flex;
  align-items: center;
  padding: 64px;
  color: var(--paper);
  background:
    radial-gradient(circle at 75% 25%, rgba(184, 149, 90, 0.35), transparent 50%),
    radial-gradient(circle at 15% 85%, rgba(201, 141, 141, 0.2), transparent 45%),
    var(--ink);
}
.hero-inner { max-width: 460px; }
.hero .eyebrow { color: var(--gold); }
.logo { font-size: clamp(4rem, 9vw, 6.5rem); font-weight: 400; letter-spacing: 0.08em; margin-top: 12px; }
.tagline { font-family: var(--font-display); font-style: italic; font-size: 1.7rem; }
.sub { margin-top: 18px; color: #cfc4b6; }
.examples { margin-top: 40px; }
.examples ul { list-style: none; padding: 0; margin: 12px 0 0; border-top: 1px solid rgba(255, 255, 255, 0.12); }
.examples li {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.ex-name { font-family: var(--font-display); font-style: italic; font-size: 1.15rem; }
.ex-brand { font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; color: #cfc4b6; align-self: center; text-align: right; }
.panel { display: flex; align-items: center; justify-content: center; padding: 48px 24px; }
.form { width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 20px; }
.form h2 { font-size: 2.4rem; margin-top: -10px; }
.hint { font-size: 0.82rem; }
.submit { margin-top: 8px; width: 100%; padding: 14px; }
.switch { text-align: center; font-size: 0.92rem; }
.link {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  color: var(--ink);
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: var(--gold);
  text-underline-offset: 3px;
}
@media (max-width: 860px) {
  .auth { grid-template-columns: 1fr; }
  .hero { padding: 48px 24px; min-height: 0; }
  .logo { font-size: 3.8rem; }
}
</style>
