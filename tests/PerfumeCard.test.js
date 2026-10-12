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

  it('verlinkt auf die Detailseite', () => {
    const wrapper = mountCard(samplePerfume({ id: 42 }))
    expect(wrapper.find('a').attributes('href')).toBe('/perfumes/42')
  })

  it('zeigt bei Parfüms aus der Sammlung keinen Kaufen-Knopf', () => {
    const wrapper = mountCard(samplePerfume())
    expect(wrapper.find('.actions').exists()).toBe(false)
  })

  it('meldet "Gekauft" für Wunschlisten-Parfüms', async () => {
    const perfume = samplePerfume({ status: 'WISHLIST' })
    const wrapper = mountCard(perfume)
    await wrapper.find('.actions button').trigger('click')
    expect(wrapper.emitted('purchase')[0]).toEqual([perfume])
  })
})
