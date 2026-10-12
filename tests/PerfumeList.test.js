import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PerfumeList from '../src/components/PerfumeList.vue'
import PerfumeCard from '../src/components/PerfumeCard.vue'
import { testRouter, samplePerfume } from './helpers'

describe('PerfumeList', () => {
  it('rendert pro Parfüm eine Karte (v-for)', () => {
    const perfumes = [
      samplePerfume({ id: 1, name: 'Eins' }),
      samplePerfume({ id: 2, name: 'Zwei' }),
      samplePerfume({ id: 3, name: 'Drei' }),
    ]
    const wrapper = mount(PerfumeList, { props: { perfumes }, global: { plugins: [testRouter()] } })
    const cards = wrapper.findAllComponents(PerfumeCard)
    expect(cards).toHaveLength(3)
    expect(cards.map((c) => c.props('perfume').name)).toEqual(['Eins', 'Zwei', 'Drei'])
  })

  it('reicht Ereignisse der Karten weiter', async () => {
    const perfume = samplePerfume({ status: 'WISHLIST' })
    const wrapper = mount(PerfumeList, { props: { perfumes: [perfume] }, global: { plugins: [testRouter()] } })
    await wrapper.find('.actions button').trigger('click')
    expect(wrapper.emitted('purchase')[0]).toEqual([perfume])
  })
})
