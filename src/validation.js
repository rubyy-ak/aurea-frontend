/** Clientseitige Prüfung – spiegelt die Regeln im Backend, damit Fehler sofort sichtbar sind. */
export function validatePerfume(p) {
  const errors = {}
  if (!p.name?.trim()) errors.name = 'Bitte einen Namen angeben.'
  else if (p.name.length > 100) errors.name = 'Höchstens 100 Zeichen.'
  if (!p.brand?.trim()) errors.brand = 'Bitte eine Marke angeben.'
  else if (p.brand.length > 100) errors.brand = 'Höchstens 100 Zeichen.'
  if (!p.concentration) errors.concentration = 'Bitte eine Konzentration wählen.'
  if (!p.family) errors.family = 'Bitte eine Duftfamilie wählen.'
  for (const key of ['topNotes', 'heartNotes', 'baseNotes']) {
    if (p[key] && p[key].length > 255) errors[key] = 'Höchstens 255 Zeichen.'
  }
  if (p.sizeMl !== null && p.sizeMl !== '' && p.sizeMl !== undefined) {
    const size = Number(p.sizeMl)
    if (!Number.isInteger(size) || size < 1 || size > 1000) errors.sizeMl = 'Ganze Zahl zwischen 1 und 1000 ml.'
  }
  if (p.priceEur !== null && p.priceEur !== '' && p.priceEur !== undefined) {
    const price = Number(String(p.priceEur).replace(',', '.'))
    if (Number.isNaN(price) || price < 0) errors.priceEur = 'Der Preis darf nicht negativ sein.'
    else if (price > 99999.99) errors.priceEur = 'Der Preis ist zu hoch.'
    else if (!/^\d+([.,]\d{1,2})?$/.test(String(p.priceEur))) errors.priceEur = 'Höchstens zwei Nachkommastellen.'
  }
  return errors
}

export function validateCredentials({ username, password }, mode) {
  const errors = {}
  if (!username?.trim()) errors.username = 'Bitte einen Benutzernamen angeben.'
  else if (mode === 'register' && !/^[A-Za-z0-9_.-]{3,30}$/.test(username.trim())) {
    errors.username = '3–30 Zeichen: Buchstaben, Zahlen, Punkt, Binde- oder Unterstrich.'
  }
  if (!password) errors.password = 'Bitte ein Passwort angeben.'
  else if (mode === 'register' && (password.length < 8 || password.length > 72)) {
    errors.password = 'Das Passwort muss 8–72 Zeichen lang sein.'
  }
  return errors
}
