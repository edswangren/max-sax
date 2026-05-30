// Music utilities — note/interval/key manipulation
// Scientific pitch notation: C4 = MIDI 60

export type PitchClass =
  | 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E'
  | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B'

const LETTER_TO_SEMITONE: Record<string, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
}

const SEMITONE_TO_SHARP: PitchClass[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const SEMITONE_TO_FLAT: PitchClass[] = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']

// ---------- Note name normalization ----------

/** Normalize a pitch class spelling — strips octave, uppercases letter, normalizes accidental. */
export function normalizeNoteName(input: string): string {
  let s = input.trim()
    .replace(/♭/g, 'b')
    .replace(/♯/g, '#')
    .replace(/\s+/g, '')
  if (!s) return ''
  const letter = s[0].toUpperCase()
  const rest = s.slice(1)
  // strip trailing octave digits
  const accidentalMatch = rest.match(/^([#b]?)/)
  const accidental = (accidentalMatch?.[1] ?? '')
  return letter + accidental
}

/** Parse pitch-class string into a semitone 0..11 (or undefined). */
export function pitchClassToSemitone(input: string): number | undefined {
  const n = normalizeNoteName(input)
  const letter = n[0]
  const accidental = n.slice(1)
  const base = LETTER_TO_SEMITONE[letter]
  if (base === undefined) return undefined
  const shift = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0
  return (base + shift + 12) % 12
}

/** Common enharmonic equivalents for a pitch class. */
export function enharmonicEquivalents(pc: string): string[] {
  const n = normalizeNoteName(pc)
  const map: Record<string, string[]> = {
    'C#': ['Db'], 'Db': ['C#'],
    'D#': ['Eb'], 'Eb': ['D#'],
    'F#': ['Gb'], 'Gb': ['F#'],
    'G#': ['Ab'], 'Ab': ['G#'],
    'A#': ['Bb'], 'Bb': ['A#'],
  }
  return map[n] ?? []
}

// ---------- Scientific pitch / MIDI ----------

/** Parse "C4" / "Bb3" / "F#5" → MIDI. C4 = 60. Returns undefined on parse failure. */
export function noteNameToMidi(input: string): number | undefined {
  const s = input.trim().replace(/♭/g, 'b').replace(/♯/g, '#').replace(/\s+/g, '')
  const m = s.match(/^([A-Ga-g])([#b]?)(-?\d+)$/)
  if (!m) return undefined
  const letter = m[1].toUpperCase()
  const accidental = m[2]
  const octave = parseInt(m[3], 10)
  const base = LETTER_TO_SEMITONE[letter]
  if (base === undefined) return undefined
  const shift = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0
  return (octave + 1) * 12 + base + shift
}

/** MIDI → "C4" using sharps. */
export function midiToNoteNameSharp(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  const pc = SEMITONE_TO_SHARP[midi % 12]
  return `${pc}${octave}`
}

/** MIDI → "C4" using flats. */
export function midiToNoteNameFlat(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  const pc = SEMITONE_TO_FLAT[midi % 12]
  return `${pc}${octave}`
}

/** MIDI → frequency Hz (A4 = MIDI 69 = 440 Hz). */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

// ---------- Key signatures ----------

/** Major key → list of accidentals as pitch classes (e.g. "Bb major" → ["Bb","Eb"]). */
export function keySignatureAccidentals(key: string): string[] {
  const n = normalizeKeyName(key)
  const flatKeys: Record<string, string[]> = {
    'C major': [],
    'F major': ['Bb'],
    'Bb major': ['Bb','Eb'],
    'Eb major': ['Bb','Eb','Ab'],
    'Ab major': ['Bb','Eb','Ab','Db'],
    'Db major': ['Bb','Eb','Ab','Db','Gb'],
    'Gb major': ['Bb','Eb','Ab','Db','Gb','Cb'],
    'Cb major': ['Bb','Eb','Ab','Db','Gb','Cb','Fb'],
  }
  const sharpKeys: Record<string, string[]> = {
    'G major': ['F#'],
    'D major': ['F#','C#'],
    'A major': ['F#','C#','G#'],
    'E major': ['F#','C#','G#','D#'],
    'B major': ['F#','C#','G#','D#','A#'],
    'F# major': ['F#','C#','G#','D#','A#','E#'],
    'C# major': ['F#','C#','G#','D#','A#','E#','B#'],
  }
  return flatKeys[n] ?? sharpKeys[n] ?? []
}

/** VexFlow key signature spec for a major key — e.g. "Bb", "F#", "C". */
export function vexKeySignature(key: string): string {
  const n = normalizeKeyName(key).replace(/ major$/, '').replace(/ minor$/, '')
  return n
}

/** Count of flats/sharps for a major key. Positive = sharps, negative = flats. */
export function keySignatureCount(key: string): number {
  const accs = keySignatureAccidentals(key)
  if (accs.length === 0) return 0
  return accs[0].endsWith('b') ? -accs.length : accs.length
}

/** Major key from accidental count. */
export function majorKeyFromCount(count: number): string {
  const sharp = ['C','G','D','A','E','B','F#','C#']
  const flat = ['C','F','Bb','Eb','Ab','Db','Gb','Cb']
  if (count >= 0 && count <= 7) return `${sharp[count]} major`
  if (count < 0 && count >= -7) return `${flat[-count]} major`
  return 'C major'
}

// ---------- Scales ----------

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11]
const NATURAL_MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10]

const SHARP_KEYS = new Set(['G','D','A','E','B','F#','C#'])

/** Build a 7-note scale starting at the given pitch class. Uses correct accidental spellings. */
export function buildScale(root: string, type: 'major' | 'natural-minor' = 'major'): string[] {
  const intervals = type === 'major' ? MAJOR_INTERVALS : NATURAL_MINOR_INTERVALS
  const rootPc = normalizeNoteName(root)
  const rootSemi = pitchClassToSemitone(rootPc)
  if (rootSemi === undefined) return []
  // Choose letter-cycle so each scale degree uses a unique letter
  const letterOrder = ['C','D','E','F','G','A','B']
  const rootLetter = rootPc[0]
  const startIdx = letterOrder.indexOf(rootLetter)
  const out: string[] = []
  for (let i = 0; i < 7; i++) {
    const expectedSemi = (rootSemi + intervals[i]) % 12
    const letter = letterOrder[(startIdx + i) % 7]
    const naturalSemi = LETTER_TO_SEMITONE[letter]
    let diff = (expectedSemi - naturalSemi + 12) % 12
    if (diff > 6) diff -= 12 // prefer flats over sharps when distance > 6
    let spelling: string
    if (diff === 0) spelling = letter
    else if (diff === 1) spelling = letter + '#'
    else if (diff === -1) spelling = letter + 'b'
    else if (diff === 2) spelling = letter + '##' // double sharp — rare
    else if (diff === -2) spelling = letter + 'bb' // double flat — rare
    else spelling = letter
    out.push(spelling)
  }
  return out
}

/** Choose major-vs-flat spelling appropriate for the root. */
export function preferredAccidentalForRoot(root: string): 'sharp' | 'flat' {
  const n = normalizeNoteName(root)
  if (n.endsWith('b')) return 'flat'
  if (n.endsWith('#')) return 'sharp'
  return SHARP_KEYS.has(n) ? 'sharp' : 'flat'
}

// ---------- Intervals ----------

const INTERVAL_BY_SEMITONE: Record<number, string> = {
  0: 'P1',
  1: 'm2', 2: 'M2',
  3: 'm3', 4: 'M3',
  5: 'P4',
  6: 'A4', // also d5 — defaults to A4
  7: 'P5',
  8: 'm6', 9: 'M6',
  10: 'm7', 11: 'M7',
  12: 'P8',
}

const INTERVAL_NAMES: Record<string, string> = {
  P1: 'Perfect Unison', m2: 'Minor 2nd', M2: 'Major 2nd',
  m3: 'Minor 3rd', M3: 'Major 3rd', P4: 'Perfect 4th',
  A4: 'Augmented 4th', d5: 'Diminished 5th',
  P5: 'Perfect 5th', m6: 'Minor 6th', M6: 'Major 6th',
  m7: 'Minor 7th', M7: 'Major 7th', P8: 'Octave',
}

/** Interval between two MIDI notes as short name (e.g. "M3"). Direction-agnostic. */
export function intervalFromMidis(a: number, b: number): string {
  const semi = Math.abs(b - a) % 12
  const isOctave = Math.abs(b - a) === 12
  if (isOctave) return 'P8'
  return INTERVAL_BY_SEMITONE[semi] ?? 'P1'
}

/** Long form of an interval short name. */
export function intervalLongName(short: string): string {
  return INTERVAL_NAMES[normalizeInterval(short)] ?? short
}

/** Normalize an interval string. Accepts short ("M3", "p5") and long ("Major 3rd"). */
export function normalizeInterval(input: string): string {
  const raw = input.trim().replace(/\s+/g, ' ')
  if (!raw) return ''

  // short form: m3, M3, P5, A4, d5 — case-sensitive on quality letter
  const shortMatch = raw.match(/^([mMpPaAdD])(\d+)$/)
  if (shortMatch) {
    const q = shortMatch[1]
    const n = shortMatch[2]
    // Major = uppercase M; minor = lowercase m; perfect/augmented/diminished have one canonical case
    const qNorm = q === 'M' ? 'M'
      : q === 'm' ? 'm'
      : q.toLowerCase() === 'p' ? 'P'
      : q.toLowerCase() === 'a' ? 'A'
      : 'd'
    return `${qNorm}${n}`
  }

  const s = raw.toLowerCase()
  const longMap: Record<string, string> = {
    'unison': 'P1', 'perfect unison': 'P1',
    'minor 2nd': 'm2', 'minor second': 'm2', 'half step': 'm2', 'halfstep': 'm2', 'semitone': 'm2',
    'major 2nd': 'M2', 'major second': 'M2', 'whole step': 'M2', 'wholestep': 'M2', 'whole tone': 'M2',
    'minor 3rd': 'm3', 'minor third': 'm3',
    'major 3rd': 'M3', 'major third': 'M3',
    'perfect 4th': 'P4', 'perfect fourth': 'P4', 'fourth': 'P4',
    'augmented 4th': 'A4', 'tritone': 'A4', 'aug 4': 'A4', 'aug4': 'A4',
    'diminished 5th': 'd5', 'dim 5': 'd5', 'dim5': 'd5',
    'perfect 5th': 'P5', 'perfect fifth': 'P5', 'fifth': 'P5',
    'minor 6th': 'm6', 'minor sixth': 'm6',
    'major 6th': 'M6', 'major sixth': 'M6',
    'minor 7th': 'm7', 'minor seventh': 'm7',
    'major 7th': 'M7', 'major seventh': 'M7',
    'octave': 'P8', 'perfect octave': 'P8', '8ve': 'P8',
  }
  return longMap[s] ?? s
}

// ---------- Key names ----------

/** Normalize "bb maj" / "B♭ Major" / "Bb" → "Bb major". */
export function normalizeKeyName(input: string): string {
  let s = input.trim().replace(/♭/g, 'b').replace(/♯/g, '#').replace(/\s+/g, ' ').toLowerCase()
  if (!s) return ''
  const m = s.match(/^([a-g])([#b]?)\s*(maj|major|min|minor|m|nat\s*min|natural\s*minor)?$/i)
  if (!m) return s
  const letter = m[1].toUpperCase()
  const accidental = m[2]
  const qualityRaw = (m[3] ?? '').toLowerCase().replace(/\s+/g, '')
  const isMinor = qualityRaw === 'min' || qualityRaw === 'minor' || qualityRaw === 'm' || qualityRaw === 'natmin' || qualityRaw === 'naturalminor'
  const quality = isMinor ? 'minor' : 'major'
  return `${letter}${accidental} ${quality}`
}

// ---------- Triads ----------

export type TriadQuality = 'major' | 'minor' | 'diminished' | 'augmented'

/** Semitone intervals from root for a triad in root position. */
export function triadIntervals(quality: TriadQuality): [number, number, number] {
  switch (quality) {
    case 'major':       return [0, 4, 7]
    case 'minor':       return [0, 3, 7]
    case 'diminished':  return [0, 3, 6]
    case 'augmented':   return [0, 4, 8]
  }
}

// ---------- Relative / parallel keys ----------

// Hardcoded relative-key pairs match conventional spelling (e.g. G minor ↔ Bb
// major, not A# major). Computing by semitone shift gets the pitch right but
// not always the spelling musicians expect.
const RELATIVE_PAIRS: Array<[string, string]> = [
  ['C major', 'A minor'],
  ['G major', 'E minor'],
  ['D major', 'B minor'],
  ['A major', 'F# minor'],
  ['E major', 'C# minor'],
  ['B major', 'G# minor'],
  ['F# major', 'D# minor'],
  ['C# major', 'A# minor'],
  ['F major', 'D minor'],
  ['Bb major', 'G minor'],
  ['Eb major', 'C minor'],
  ['Ab major', 'F minor'],
  ['Db major', 'Bb minor'],
  ['Gb major', 'Eb minor'],
  ['Cb major', 'Ab minor'],
]

const MAJOR_TO_MINOR = new Map(RELATIVE_PAIRS)
const MINOR_TO_MAJOR = new Map(RELATIVE_PAIRS.map(([maj, min]) => [min, maj] as const))

/** Relative minor of a major key. "Bb major" → "G minor". */
export function relativeMinor(majorKey: string): string {
  const n = normalizeKeyName(majorKey)
  return MAJOR_TO_MINOR.get(n) ?? n
}

/** Relative major of a natural-minor key. "G minor" → "Bb major". */
export function relativeMajor(minorKey: string): string {
  const n = normalizeKeyName(minorKey)
  return MINOR_TO_MAJOR.get(n) ?? n
}

// ---------- Chromatic ----------

/** Next chromatic note from a pitch class. Direction-aware, with letter-conventional spelling. */
export function chromaticNext(pc: string, direction: 'up' | 'down'): string {
  const semi = pitchClassToSemitone(pc)
  if (semi === undefined) return pc
  const next = (semi + (direction === 'up' ? 1 : 11)) % 12
  // Ascending → prefer sharps; descending → prefer flats. Convention.
  return direction === 'up' ? SEMITONE_TO_SHARP[next] : SEMITONE_TO_FLAT[next]
}

// ---------- Order of accidentals (sharps + flats) ----------

export const ORDER_OF_SHARPS: string[] = ['F#','C#','G#','D#','A#','E#','B#']
export const ORDER_OF_FLATS:  string[] = ['Bb','Eb','Ab','Db','Gb','Cb','Fb']

// ---------- Sax range ----------

/** Standard written sax range — low Bb (Bb3) to palm F# (F#6). Altissimo extends higher. */
export const SAX_RANGE = {
  LOW_BB: 58,        // Bb3
  LOW_C: 60,         // C4
  STAFF_BOTTOM: 64,  // E4 (bottom line of treble staff)
  STAFF_TOP: 77,     // F5 (top line of treble staff)
  PALM_D: 86,        // D6
  PALM_F_SHARP: 90,  // F#6
  ALTISSIMO_G: 91,   // G6
}

/** Concert pitch transposition: returns the MIDI offset to ADD to concert pitch to get written sax pitch. */
export function transpositionOffset(instrument: 'alto' | 'tenor'): number {
  // Alto sax (Eb): written sounds a major 6th lower → written = concert + 9
  // Tenor sax (Bb): written sounds a major 9th lower → written = concert + 14
  return instrument === 'alto' ? 9 : 14
}

/** What pitch class does the sax player READ when the band plays this concert pitch? */
export function concertToWrittenPc(concertPc: string, instrument: 'alto' | 'tenor'): string {
  const semi = pitchClassToSemitone(concertPc)
  if (semi === undefined) return concertPc
  const newSemi = (semi + transpositionOffset(instrument)) % 12
  // Use flat spelling for flat instruments (alto/tenor are both flat-friendly)
  return SEMITONE_TO_FLAT[newSemi]
}

/** What KEY does the sax player read when the band plays this concert key? */
export function concertToWrittenKey(concertKey: string, instrument: 'alto' | 'tenor'): string {
  const n = normalizeKeyName(concertKey)
  const isMinor = n.endsWith('minor')
  const rootMatch = n.match(/^([A-G][#b]?)/)
  if (!rootMatch) return concertKey
  const written = concertToWrittenPc(rootMatch[1], instrument)
  return `${written} ${isMinor ? 'minor' : 'major'}`
}
