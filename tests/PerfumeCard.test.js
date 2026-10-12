import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PerfumeCard from '../src/components/PerfumeCard.vue'
import { testRouter, samplePerfume } from './helpers'

const mountCard = (perfume) =>
  mount(PerfumeCard, { props: { perfume }, global: { plugins: [testRouter()] } })

describe('PerfumeCard', () => {
  it('zeigt Name, Marke, Familie und Preis', () => {
    const wrapper = mountCard(samplePerfume())
    expect(wrapper.text()).toContain('Baccarat Rouge 540')
    expect(wrapper.text()).toContain('Maison Francis Kurkdjian')
    expect(wrapper.text()).toContain('Orientalisch')
    expect(wrapper.text()).toContain('70 ml')
    expect(wrapper.text()).toMatch(/325,00\s€/)
  })

  it('meldet "Heute getragen" für Parfüms aus der Sammlung', async () => {
    const perfume = samplePerfume()
    const wrapper = mountCard(perfume)
    await wrapper.find('.actions button').trigger('click')
    expect(wrapper.emitted('wear')[0]).toEqual([perfume])
    expect(wrapper.text()).toContain('2× getragen')
  })

  it('bietet "Gekauft" für Wunschlisten-Parfüms', async () => {
    const perfume = samplePerfume({ status: 'WISHLIST' })
    const wrapper = mountCard(perfume)
    expect(wrapper.text()).not.toContain('Heute getragen')
    await wrapper.find('.actions button').trigger('click')
    expect(wrapper.emitted('purchase')[0]).toEqual([perfume])
  })

  it('schaltet den Favoriten-Status um', async () => {
    const wrapper = mountCard(samplePerfume({ favorite: true }))
    const fav = wrapper.find('.fav')
    expect(fav.classes()).toContain('active')
    await fav.trigger('click')
    expect(wrapper.emitted('toggle-favorite')).toHaveLength(1)
  })
})
