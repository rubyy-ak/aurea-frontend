import { beforeEach, describe, expect, it } from 'vitest'
import router from '@/router'
import { clearSession, setSession } from '@/stores/session'

describe('Router-Zugriffsschutz', () => {
    beforeEach(async () => {
        clearSession()
        await router.push('/login')
    })

    it('leitet Gäste von geschützten Seiten zum Login', async () => {
        await router.push('/collection')
        expect(router.currentRoute.value.name).toBe('login')
        expect(router.currentRoute.value.query.redirect).toBe('/collection')
    })

    it('erlaubt Gästen die öffentliche Loginseite', async () => {
        await router.push('/login')
        expect(router.currentRoute.value.name).toBe('login')
    })

    it('erlaubt angemeldeten Nutzern geschützte Seiten', async () => {
        setSession({ token: 'test-token', username: 'duc' })
        await router.push('/wishlist')
        expect(router.currentRoute.value.name).toBe('wishlist')
    })

    it('leitet angemeldete Nutzer vom Login zur Startseite', async () => {
        setSession({ token: 'test-token', username: 'duc' })
        await router.push('/wishlist')
        await router.push('/login')
        expect(router.currentRoute.value.name).toBe('home')
    })
})