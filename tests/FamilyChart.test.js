import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FamilyChart from '../src/components/FamilyChart.vue'

describe('FamilyChart', () => {
  it('sortiert absteigend und skaliert Balken relativ zum Maximum', () => {
    const wrapper = mount(FamilyChart, { props: { counts: { CITRUS: 1, WOODY: 4, FLORAL: 2 } } })
    const rows = wrapper.findAll('li')
    expect(rows.map((r) => r.find('.label').text())).toEqual(['Holzig', 'Blumig', 'Zitrisch'])
    expect(rows[0].find('.bar').attributes('style')).toContain('width: 100%')
    expect(rows[2].find('.bar').attributes('style')).toContain('width: 25%')
  })
})
