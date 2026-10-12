import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PerfumeFilters from '../src/components/PerfumeFilters.vue'

const base = { q: '', family: '', sort: '', favorite: false }

describe('PerfumeFilters', () => {
  it('meldet geänderte Suche und behält die übrigen Filter', async () => {
    const wrapper = mount(PerfumeFilters, { props: { modelValue: { ...base, family: 'WOODY' } } })
    await wrapper.find('input[type=search]').setValue('oud')
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual({ ...base, family: 'WOODY', q: 'oud' })
  })

  it('bietet alle Duftfamilien zur Auswahl an', () => {
    const wrapper = mount(PerfumeFilters, { props: { modelValue: base } })
    const options = wrapper.findAll('select')[0].findAll('option')
    expect(options).toHaveLength(12) // "Alle" + 11 Familien
  })

  it('filtert auf Favoriten', async () => {
    const wrapper = mount(PerfumeFilters, { props: { modelValue: base } })
    await wrapper.find('input[type=checkbox]').setValue(true)
    expect(wrapper.emitted('update:modelValue').at(-1)[0].favorite).toBe(true)
  })
})
