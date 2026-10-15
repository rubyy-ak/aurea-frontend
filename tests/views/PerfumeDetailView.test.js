import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import PerfumeDetailView from '@/views/PerfumeDetailView.vue'
import { perfumeApi } from '@/services/perfumeService'
import { samplePerfume } from '../helpers'

vi.mock('@/services/perfumeService', () => ({
    perfumeApi: { get: vi.fn(), remove: vi.fn(), purchase: vi.fn() },
}))

async function setup(perfume = samplePerfume()) {
    perfumeApi.get.mockResolvedValue(perfume)
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/collection', component: { template: '<div />' } },
            { path: '/wishlist', component: { template: '<div />' } },
            { path: '/perfumes/:id', component: { template: '<div />' } },
            { path: '/perfumes/:id/edit', component: { template: '<div />' } },
        ],
    })
    await router.push(`/perfumes/${perfume.id}`)
    await router.isReady()
    const wrapper = mount(PerfumeDetailView, {
        props: { id: String(perfume.id) },
        global: { plugins: [router] },
    })
    await flushPromises()
    return { wrapper, router }
}

describe('PerfumeDetailView', () => {
    beforeEach(() => vi.clearAllMocks())

    it('lädt und zeigt die wichtigsten Parfümdaten', async () => {
        const { wrapper } = await setup(samplePerfume({ favorite: true }))
        expect(perfumeApi.get).toHaveBeenCalledWith('1')
        expect(wrapper.text()).toContain('Baccarat Rouge 540')
        expect(wrapper.text()).toContain('Maison Francis Kurkdjian')
        expect(wrapper.text()).toContain('70 ml')
        expect(wrapper.text()).toContain('Favorit')
    })

    it('öffnet die Bestätigung und löscht erst nach Bestätigung', async () => {
        perfumeApi.remove.mockResolvedValue(undefined)
        const { wrapper, router } = await setup()
        const push = vi.spyOn(router, 'push')

        await wrapper.find('.actions .btn-danger').trigger('click')
        expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
        expect(perfumeApi.remove).not.toHaveBeenCalled()

        await wrapper.find('[role="dialog"] .btn-danger').trigger('click')
        await flushPromises()
        expect(perfumeApi.remove).toHaveBeenCalledWith('1')
        expect(push).toHaveBeenCalledWith('/collection')
    })

    it('kauft einen Wunschlistenduft und aktualisiert die Ansicht', async () => {
        const wish = samplePerfume({ id: 5, status: 'WISHLIST', name: 'Wunschduft' })
        perfumeApi.purchase.mockResolvedValue({ ...wish, status: 'OWNED' })
        const { wrapper } = await setup(wish)

        await wrapper.find('.actions > button.btn:not(.btn-danger)').trigger('click')
        await flushPromises()
        expect(perfumeApi.purchase).toHaveBeenCalledWith(5)
        expect(wrapper.text()).toContain('Wunschduft ist jetzt in deiner Sammlung.')
        expect(wrapper.text()).not.toContain('Gekauft – in die Sammlung')
    })

    it('zeigt Ladefehler verständlich an', async () => {
        perfumeApi.get.mockRejectedValueOnce(new Error('Parfüm nicht gefunden.'))
        const { wrapper } = await setup()
        expect(wrapper.find('.alert').text()).toBe('Parfüm nicht gefunden.')
    })
})