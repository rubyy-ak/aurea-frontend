import { describe, it, expect } from 'vitest'
import { validatePerfume, validateCredentials } from '@/utils/validation'

const valid = { name: 'Santal 33', brand: 'Le Labo', concentration: 'EAU_DE_PARFUM', family: 'WOODY' }

describe('validatePerfume', () => {
  it('akzeptiert ein gültiges Parfüm', () => {
    expect(validatePerfume({ ...valid, sizeMl: 50, priceEur: '245,50' })).toEqual({})
  })

  it('verlangt Pflichtfelder', () => {
    const errors = validatePerfume({ name: ' ', brand: '', concentration: '', family: '' })
    expect(Object.keys(errors)).toEqual(['name', 'brand', 'concentration', 'family'])
  })

  it('prüft Größe und Preis', () => {
    expect(validatePerfume({ ...valid, sizeMl: 0 }).sizeMl).toBeDefined()
    expect(validatePerfume({ ...valid, sizeMl: 12.5 }).sizeMl).toBeDefined()
    expect(validatePerfume({ ...valid, priceEur: -1 }).priceEur).toBeDefined()
    expect(validatePerfume({ ...valid, priceEur: '9.999' }).priceEur).toBeDefined()
  })
})

describe('validateCredentials', () => {
  it('verlangt bei der Registrierung ein Passwort mit mindestens 8 Zeichen', () => {
    expect(validateCredentials({ username: 'camille', password: 'kurz' }, 'register').password).toBeDefined()
    expect(validateCredentials({ username: 'camille', password: 'lang-genug' }, 'register')).toEqual({})
  })

  it('erlaubt eine E-Mail-Adresse als Benutzernamen', () => {
    expect(validateCredentials({ username: 'rubyyy.ak@icloud.com', password: 'lang-genug' }, 'register')).toEqual({})
  })

  it('prüft das Format des Benutzernamens nur bei der Registrierung', () => {
    expect(validateCredentials({ username: 'a b', password: 'x' }, 'register').username).toBeDefined()
    expect(validateCredentials({ username: 'a b', password: 'x' }, 'login')).toEqual({})
  })
})
