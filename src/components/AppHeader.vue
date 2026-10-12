<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { session, clearSession } from '../auth'
import { authApi } from '../api'

const router = useRouter()
const menuOpen = ref(false)

const links = [
  { to: '/', label: 'Start' },
  { to: '/collection', label: 'Sammlung' },
  { to: '/wishlist', label: 'Wunschliste' },
  { to: '/stats', label: 'Statistik' },
]

async function logout() {
  try {
    await authApi.logout()
  } catch {
    /* Token evtl. schon ungültig – lokal trotzdem abmelden */
  }
  clearSession()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="header">
    <div class="container bar">
      <RouterLink to="/" class="logo" @click="menuOpen = false">Auréa</RouterLink>

      <button class="burger" :aria-expanded="menuOpen" aria-label="Menü" @click="menuOpen = !menuOpen">
        <span /><span />
      </button>

      <nav :class="{ open: menuOpen }" @click="menuOpen = false">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/perfumes/new" class="btn btn-sm">+ Parfüm</RouterLink>
        <span class="user">
          <span class="muted">{{ session.username }}</span>
          <button class="logout" @click="logout">Abmelden</button>
        </span>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(246, 241, 233, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}
.logo {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}
nav {
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav-link {
  font-size: 0.76rem;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-soft);
  padding: 6px 0;
  border-bottom: 1px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}
.nav-link:hover { color: var(--gold-deep); }
.nav-link.router-link-exact-active { border-color: var(--gold); color: var(--ink); }
.user {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  padding-left: 20px;
  border-left: 1px solid var(--line);
}
.logout {
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
.burger {
  display: none;
  background: none;
  border: 0;
  width: 36px;
  height: 36px;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
}
.burger span { display: block; height: 1px; background: var(--ink); }

@media (max-width: 900px) {
  .burger { display: flex; }
  nav {
    display: none;
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    padding: 24px 16px 28px;
    background: var(--ivory);
    border-bottom: 1px solid var(--line);
  }
  nav.open { display: flex; }
  .user { border-left: 0; padding-left: 0; }
}
</style>
