import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ExpenseSummary from '@/components/perfume/ExpenseSummary.vue'
import { perfumeApi } from '@/services/perfumeService'

vi.mock('@/services/perfumeService', () => ({
    perfumeApi: { summary: vi.fn() },
}))

describe('ExpenseSummary', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('zeigt die Zahlen aus dem Backend an', async () => {
        perfumeApi.summary.mockResolvedValue({
            ownedCount: 2,
            wishlistCount: 1,
            totalValueEur: 150,
            averagePriceEur: 75,
        })

        const wrapper = mount(ExpenseSummary)
        await flushPromises()

        expect(wrapper.get('[data-testid="owned"]').text()).toBe('2')
        expect(wrapper.get('[data-testid="wishlist"]').text()).toBe('1')
        expect(wrapper.get('[data-testid="total"]').text()).toContain('150')
        expect(wrapper.get('[data-testid="average"]').text()).toContain('75')
    })

    it('zeigt einen Ladehinweis, solange geladen wird', () => {
        perfumeApi.summary.mockReturnValue(new Promise(() => {}))

        const wrapper = mount(ExpenseSummary)

        expect(wrapper.get('[role="status"]').text()).toContain('geladen')
    })

    it('zeigt eine Fehlermeldung, wenn das Laden fehlschlägt', async () => {
        perfumeApi.summary.mockRejectedValue(new Error('Server nicht erreichbar'))

        const wrapper = mount(ExpenseSummary)
        await flushPromises()

        expect(wrapper.get('[role="alert"]').text()).toContain('Server nicht erreichbar')
    })
})