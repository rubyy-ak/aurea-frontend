export const FAMILIES = {
  CITRUS: { label: 'Zitrisch', color: '#d9b44a' },
  FRESH: { label: 'Frisch', color: '#8fb8a8' },
  AQUATIC: { label: 'Aquatisch', color: '#7aa2c2' },
  GREEN: { label: 'Grün', color: '#8aa66b' },
  FLORAL: { label: 'Blumig', color: '#d79aa8' },
  FRUITY: { label: 'Fruchtig', color: '#e0937a' },
  GOURMAND: { label: 'Gourmand', color: '#b7835a' },
  ORIENTAL: { label: 'Orientalisch', color: '#a5603f' },
  WOODY: { label: 'Holzig', color: '#7c6448' },
  SPICY: { label: 'Würzig', color: '#b5523b' },
  LEATHER: { label: 'Leder', color: '#4e3b31' },
}

export const CONCENTRATIONS = {
  EAU_FRAICHE: { label: 'Eau Fraîche', short: 'EF' },
  EAU_DE_COLOGNE: { label: 'Eau de Cologne', short: 'EdC' },
  EAU_DE_TOILETTE: { label: 'Eau de Toilette', short: 'EdT' },
  EAU_DE_PARFUM: { label: 'Eau de Parfum', short: 'EdP' },
  PARFUM: { label: 'Parfum / Extrait', short: 'Extrait' },
}

export const SORTS = {
  '': 'Zuletzt hinzugefügt',
  name: 'Marke A–Z',
  rating: 'Beste Bewertung',
  price: 'Höchster Preis',
}

export function familyLabel(key) {
  return FAMILIES[key]?.label ?? key
}

export function concentrationLabel(key) {
  return CONCENTRATIONS[key]?.label ?? key
}

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
export function formatEuro(value) {
  return value === null || value === undefined ? '–' : euro.format(value)
}
