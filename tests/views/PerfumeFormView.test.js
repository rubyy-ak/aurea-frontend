import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import PerfumeFormView from '@/views/PerfumeFormView.vue'
import { perfumeApi } from '@/services/perfumeService'
import { samplePerfume } from '../helpers'

vi.mock('@/services/perfumeService', () => ({
    perfumeApi: { get: vi.fn(), create: vi.fn(), update: vi.fn() },
}))

async function setup({ id = null, path = '/perfumes/new' } = {}) {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/perfumes/new', component: { template: '<div />' } },
            { path: '/perfumes/:id/edit', component: { template: '<div />' } },
            { path: '/perfumes/:id', component: { template: '<div />' } },
        ],
    })
    await router.push(path)
    await router.isReady()
    const wrapper = mount(PerfumeFormView, {
        props: id ? { id } : {},
        global: { plugins: [router] },
    })
    return { wrapper, router }
}

async function fillRequired(wrapper) {
    await wrapper.find('#name').setValue('  L Eau Papier  ')
    await wrapper.find('#brand').setValue('  Diptyque  ')
    await wrapper.find('#family').setValue('WOODY')
}

describe('PerfumeFormView', () => {
    beforeEach(() => vi.clearAllMocks())

    it('zeigt Pflichtfehler und sendet keine Anfrage', async () => {
        const { wrapper } = await setup()
        await wrapper.find('form').trigger('submit')

        expect(wrapper.text()).toContain('Bitte einen Namen angeben.')
        expect(wrapper.text()).toContain('Bitte eine Marke angeben.')
        expect(wrapper.text()).toContain('Bitte eine Duftfamilie wählen.')
        expect(perfumeApi.create).not.toHaveBeenCalled()
    })

    it('legt ein Parfüm mit normalisiertem Payload an', async () => {
        perfumeApi.create.mockResolvedValue(samplePerfume({ id: 42 }))
        const { wrapper, router } = await setup({ path: '/perfumes/new?status=WISHLIST' })
        const push = vi.spyOn(router, 'push')
        await fillRequired(wrapper)
        await wrapper.find('#size').setValue('75')
        await wrapper.find('#price').setValue('99,95')
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(perfumeApi.create).toHaveBeenCalledWith(expect.objectContaining({
            name: 'L Eau Papier',
            brand: 'Diptyque',
            family: 'WOODY',
            concentration: 'EAU_DE_PARFUM',
            sizeMl: 75,
            priceEur: 99.95,
            status: 'WISHLIST',
        }))
        expect(push).toHaveBeenCalledWith('/perfumes/42')
    })

    it('lädt vorhandene Daten und speichert Änderungen', async () => {
        perfumeApi.get.mockResolvedValue(samplePerfume({ id: 9, name: 'Alter Name' }))
        perfumeApi.update.mockResolvedValue(samplePerfume({ id: 9, name: 'Neuer Name' }))
        const { wrapper, router } = await setup({ id: '9', path: '/perfumes/9/edit' })
        const push = vi.spyOn(router, 'push')
        await flushPromises()

        expect(perfumeApi.get).toHaveBeenCalledWith('9')
        expect(wrapper.find('#name').element.value).toBe('Alter Name')
        await wrapper.find('#name').setValue('Neuer Name')
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(perfumeApi.update).toHaveBeenCalledWith('9', expect.objectContaining({ name: 'Neuer Name' }))
        expect(push).toHaveBeenCalledWith('/perfumes/9')
    })

    it('zeigt Feldfehler des Backends am Formular', async () => {
        perfumeApi.create.mockRejectedValue({
            message: 'Bitte die markierten Felder prüfen.',
            fieldErrors: { name: 'Dieser Name ist nicht zulässig.' },
        })
        const { wrapper } = await setup()
        await fillRequired(wrapper)
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.find('.alert').text()).toBe('Bitte die markierten Felder prüfen.')
        expect(wrapper.text()).toContain('Dieser Name ist nicht zulässig.')
    })
})