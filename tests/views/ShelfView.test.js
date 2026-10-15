import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ShelfView from '@/views/ShelfView.vue'
import PerfumeFilters from '@/components/perfume/PerfumeFilters.vue'
import PerfumeList from '@/components/perfume/PerfumeList.vue'
import { perfumeApi } from '@/services/perfumeService'
import { samplePerfume, testRouter } from '../helpers'

vi.mock('@/services/perfumeService', () => ({
    perfumeApi: { list: vi.fn(), purchase: vi.fn(), summary: vi.fn(),},
}))

function mountView(status = 'OWNED') {
    return mount(ShelfView, { props: { status }, global: { plugins: [testRouter()] } })
}

describe('ShelfView', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        perfumeApi.list.mockResolvedValue([])
        perfumeApi.summary.mockResolvedValue({
            ownedCount: 0,
            wishlistCount: 0,
            totalValueEur: 0,
            averagePriceEur: 0,
        })
    })

    afterEach(() => vi.useRealTimers())

    it('lädt Sammlung und Wunschliste mit dem richtigen Status', async () => {
        const collection = mountView('OWNED')
        await flushPromises()
        expect(perfumeApi.list).toHaveBeenLastCalledWith(expect.objectContaining({ status: 'OWNED' }))
        expect(collection.find('h1').text()).toBe('Sammlung')

        const wishlist = mountView('WISHLIST')
        await flushPromises()
        expect(perfumeApi.list).toHaveBeenLastCalledWith(expect.objectContaining({ status: 'WISHLIST' }))
        expect(wishlist.find('h1').text()).toBe('Wunschliste')
    })

    it('übergibt Suche und Filter nach 250 Millisekunden', async () => {
        vi.useFakeTimers()
        const wrapper = mountView()
        await flushPromises()
        perfumeApi.list.mockClear()

        wrapper.findComponent(PerfumeFilters).vm.$emit('update:modelValue', {
            q: 'rose', family: 'FLORAL', sort: 'nameAsc', favorite: true,
        })
        await wrapper.vm.$nextTick()
        expect(perfumeApi.list).not.toHaveBeenCalled()

        await vi.advanceTimersByTimeAsync(250)
        await flushPromises()
        expect(perfumeApi.list).toHaveBeenCalledWith({
            status: 'OWNED', q: 'rose', family: 'FLORAL', sort: 'nameAsc', favorite: true,
        })
    })

    it('unterscheidet leere Sammlung von leerem Filterergebnis', async () => {
        const wrapper = mountView()
        await flushPromises()
        expect(wrapper.text()).toContain('Dein Regal ist noch leer')

        vi.useFakeTimers()
        wrapper.findComponent(PerfumeFilters).vm.$emit('update:modelValue', {
            q: 'nicht vorhanden', family: '', sort: '', favorite: false,
        })
        await wrapper.vm.$nextTick()
        await vi.advanceTimersByTimeAsync(250)
        await flushPromises()
        expect(wrapper.text()).toContain('Nichts gefunden')
    })

    it('entfernt einen gekauften Duft aus der Wunschliste', async () => {
        const wish = samplePerfume({ id: 7, status: 'WISHLIST', name: 'Wunschduft' })
        perfumeApi.list.mockResolvedValue([wish])
        perfumeApi.purchase.mockResolvedValue({ ...wish, status: 'OWNED' })
        const wrapper = mountView('WISHLIST')
        await flushPromises()

        wrapper.findComponent(PerfumeList).vm.$emit('purchase', wish)
        await flushPromises()

        expect(perfumeApi.purchase).toHaveBeenCalledWith(7)
        expect(wrapper.text()).toContain('Deine Wunschliste ist leer')
        expect(wrapper.text()).toContain('Wunschduft ist jetzt in deiner Sammlung.')
    })

    it('zeigt einen Ladefehler', async () => {
        perfumeApi.list.mockRejectedValue(new Error('Düfte konnten nicht geladen werden.'))
        const wrapper = mountView()
        await flushPromises()
        expect(wrapper.find('.alert').text()).toBe('Düfte konnten nicht geladen werden.')
    })
})