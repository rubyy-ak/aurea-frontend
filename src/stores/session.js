import { reactive } from 'vue'

const STORAGE_KEY = 'aurea.session'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null
  } catch {
    return null
  }
}

const saved = load()

/** Globaler Login-Zustand. Gespeichert wird nur das Sitzungs-Token, nie das Passwort. */
export const session = reactive({
  token: saved?.token ?? null,
  username: saved?.username ?? null,
  get loggedIn() {
    return !!this.token
  },
})

export function setSession({ token, username }) {
  session.token = token
  session.username = username
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, username }))
  } catch {
    /* privater Modus – Sitzung gilt dann nur bis zum Neuladen */
  }
}

export function clearSession() {
  session.token = null
  session.username = null
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignorieren */
  }
}
