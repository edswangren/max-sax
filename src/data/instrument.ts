export type Instrument = 'alto' | 'tenor'

const KEY = 'maxsax-instrument'

export function getInstrument(): Instrument {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'tenor' || v === 'alto') return v
  } catch { /* ignore */ }
  return 'alto'
}

export function setInstrument(i: Instrument): void {
  try {
    localStorage.setItem(KEY, i)
  } catch { /* ignore */ }
}
