import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import LoginView from '../src/views/LoginView.vue'
import { session, clearSession } from '../src/auth'

function setup() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/login', component: LoginView },
    ],
  })
  return { router, wrapper: mount(LoginView, { global: { plugins: [router] } }) }
}

describe('LoginView', () => {
  beforeEach(() => {
    clearSession()
    vi.unstubAllGlobals()
  })

  it('zeigt Validierungsfehler ohne Server-Anfrage', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetch)
    const { wrapper } = setup()
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Bitte einen Benutzernamen angeben.')
    const authCalls = fetch.mock.calls.filter(([url]) => url.toString().includes('/api/auth'))
    expect(authCalls).toHaveLength(0)
  })

  it('zeigt die öffentlichen Beispiel-Parfüms', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ id: 1, name: 'Santal 33', brand: 'Le Labo' }]),
    }))
    const { wrapper } = setup()
    await flushPromises()
    expect(wrapper.find('.examples').text()).toContain('Santal 33')
  })

  it('wechselt in den Registrierungsmodus', async () => {
    const { wrapper } = setup()
    await wrapper.find('.link').trigger('click')
    expect(wrapper.find('h2').text()).toBe('Konto erstellen')
  })

  it('meldet an und leitet zur Startseite weiter', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ token: 't0k3n', username: 'camille' }),
    }))
    const { wrapper, router } = setup()
    const push = vi.spyOn(router, 'push')
    await wrapper.find('#username').setValue('camille')
    await wrapper.find('#password').setValue('geheim123')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(session.token).toBe('t0k3n')
    expect(push).toHaveBeenCalledWith('/')
  })

  it('zeigt die Fehlermeldung des Servers', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Benutzername oder Passwort ist falsch.', fieldErrors: {} }),
    }))
    const { wrapper } = setup()
    await wrapper.find('#username').setValue('camille')
    await wrapper.find('#password').setValue('falsch')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.find('.alert').text()).toBe('Benutzername oder Passwort ist falsch.')
  })
})
