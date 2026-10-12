import { createRouter, createMemoryHistory } from 'vue-router'

/** Minimaler Router, damit RouterLink in Komponenten-Tests funktioniert. */
export function testRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
  })
}

export const samplePerfume = (overrides = {}) => ({
  id: 1,
  name: 'Baccarat Rouge 540',
  brand: 'Maison Francis Kurkdjian',
  concentration: 'EAU_DE_PARFUM',
  family: 'ORIENTAL',
  topNotes: 'Safran',
  heartNotes: 'Jasmin',
  baseNotes: 'Ambra',
  sizeMl: 70,
  priceEur: 325,
  rating: 5,
  status: 'OWNED',
  favorite: false,
  wearCount: 2,
  lastWornOn: '2026-10-01',
  createdAt: '2026-10-01T10:00:00Z',
  ...overrides,
})
