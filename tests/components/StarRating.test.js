import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StarRating from '@/components/common/StarRating.vue'

describe('StarRating', () => {
  it('füllt so viele Sterne wie die Bewertung', () => {
    const wrapper = mount(StarRating, { props: { modelValue: 3 } })
    expect(wrapper.findAll('.star.filled')).toHaveLength(3)
  })

  it('setzt per Klick eine neue Bewertung', async () => {
    const wrapper = mount(StarRating, { props: { modelValue: null } })
    await wrapper.findAll('.star')[3].trigger('click')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([4])
  })

  it('entfernt die Bewertung bei erneutem Klick auf denselben Stern', async () => {
    const wrapper = mount(StarRating, { props: { modelValue: 2 } })
    await wrapper.findAll('.star')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([null])
  })

  it('ist im Nur-Lesen-Modus nicht klickbar', async () => {
    const wrapper = mount(StarRating, { props: { modelValue: 2, readonly: true } })
    await wrapper.findAll('.star')[4].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
