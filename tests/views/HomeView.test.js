import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'
import { perfumeApi } from '@/services/perfumeService'
import { fetchWeather } from '@/services/weatherService'
import { session } from '@/stores/session'
import { samplePerfume, testRouter } from '../helpers'

vi.mock('@/services/perfumeService', () => ({
    perfumeApi: { list: vi.fn(), suggestion: vi.fn() },
}))
vi.mock('@/services/weatherService', () => ({ fetchWeather: vi.fn() }))

const suggestion = {
    perfume: samplePerfume(),
    temperatureC: 18,
    weather: 'Bewölkt',
    reason: 'Passt zum milden Wetter.',
}

function mountView() {
    return mount(HomeView, { global: { plugins: [testRouter()] } })
}

describe('HomeView', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        session.username = 'duc'
        fetchWeather.mockResolvedValue({ temperature: 18, weatherCode: 3 })
        perfumeApi.suggestion.mockResolvedValue(suggestion)
        perfumeApi.list.mockResolvedValue([])
    })

    it('lädt Wetter, Empfehlung und eigene Sammlung', async () => {
        const wrapper = mountView()
        expect(wrapper.text()).toContain('Einen Moment')
        await flushPromises()

        expect(fetchWeather).toHaveBeenCalledOnce()
        expect(perfumeApi.suggestion).toHaveBeenCalledWith({ temperature: 18, weatherCode: 3 })
        expect(perfumeApi.list).toHaveBeenCalledWith({ status: 'OWNED' })
        expect(wrapper.text()).toContain('Baccarat Rouge 540')
        expect(wrapper.text()).toContain('duc')
    })

    it('zeigt höchstens vier zuletzt hinzugefügte Düfte', async () => {
        perfumeApi.list.mockResolvedValue(
            Array.from({ length: 6 }, (_, index) => samplePerfume({ id: index + 1, name: `Duft ${index + 1}` })),
        )
        const wrapper = mountView()
        await flushPromises()

        expect(wrapper.text()).toContain('Duft 4')
        expect(wrapper.text()).not.toContain('Duft 5')
        expect(wrapper.findAll('.perfume-card')).toHaveLength(4)
    })

    it('zeigt Fehler verständlich an', async () => {
        perfumeApi.list.mockRejectedValue(new Error('Sammlung konnte nicht geladen werden.'))
        const wrapper = mountView()
        await flushPromises()

        expect(wrapper.find('.alert').text()).toBe('Sammlung konnte nicht geladen werden.')
    })
})