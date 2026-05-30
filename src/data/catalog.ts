export type CategoryId =
  | 'note-reading'
  | 'scales-keys'
  | 'rhythm'
  | 'fingerings'
  | 'theory-vocab'
  | 'ear-training'

export interface Topic {
  id: string
  title: string
  blurb: string
}

export interface Category {
  id: CategoryId
  name: string
  tagline: string
  topics: Topic[]
}

export const categories: Category[] = [
  {
    id: 'note-reading',
    name: 'Note Reading',
    tagline: 'Treble clef speed. The faster you read, the faster you play.',
    topics: [
      { id: 'nr-lines',         title: 'Lines of the staff',     blurb: 'E G B D F — every good boy does fine' },
      { id: 'nr-spaces',        title: 'Spaces of the staff',    blurb: 'F A C E' },
      { id: 'nr-mixed',         title: 'Lines & spaces mixed',   blurb: 'All 9 staff notes, no warning' },
      { id: 'nr-ledger-below',  title: 'Ledger lines below',     blurb: 'Down to low B♭' },
      { id: 'nr-above-staff',   title: 'Above the staff',        blurb: 'G–C above top F' },
      { id: 'nr-palm-keys',     title: 'Palm-key range',         blurb: 'D, E, F, F♯ — top of the horn' },
      { id: 'nr-altissimo',     title: 'Altissimo basics',       blurb: 'G–C above palm F♯ — the screamer notes' },
    ],
  },
  {
    id: 'scales-keys',
    name: 'Scales & Key Signatures',
    tagline: 'Band lives in flats. Own them.',
    topics: [
      { id: 'sk-keysig-flats',     title: 'Key sigs — flats',         blurb: '1–4 flats' },
      { id: 'sk-keysig-sharps',    title: 'Key sigs — sharps',        blurb: '1–4 sharps' },
      { id: 'sk-keysig-full',      title: 'Key sigs — full',          blurb: 'Up to 7 either side' },
      { id: 'sk-major-construct',  title: 'Build a major scale',      blurb: 'W-W-H-W-W-W-H from any root' },
      { id: 'sk-identify-scale',   title: 'Name the scale',           blurb: 'From a note sequence' },
      { id: 'sk-transpose',        title: 'Concert pitch transposition', blurb: "Band plays concert. You play... what?" },
      { id: 'sk-transpose-notes',  title: 'Transpose tonic / 3rd / 5th', blurb: 'Band plays concert F. Your 3rd is...?' },
      { id: 'sk-natural-minor',    title: 'Natural minor scales',     blurb: 'W-H-W-W-H-W-W' },
      { id: 'sk-circle-fifths',    title: 'Circle of fifths',         blurb: 'Next key up or down a fifth' },
    ],
  },
  {
    id: 'rhythm',
    name: 'Rhythm & Counting',
    tagline: "Wrong notes recover. Wrong rhythm doesn't.",
    topics: [
      { id: 'ry-note-values',  title: 'Note values',        blurb: 'Whole, half, quarter, eighth, sixteenth' },
      { id: 'ry-rests',        title: 'Rests',              blurb: 'Same values — different shape' },
      { id: 'ry-timesig-math', title: 'Time signature math', blurb: 'Beats per measure, beat unit' },
      { id: 'ry-dotted',       title: 'Dotted notes',       blurb: 'Dot adds half the value' },
      { id: 'ry-ties-slurs',   title: 'Ties vs slurs',      blurb: 'They look similar. They aren’t.' },
      { id: 'ry-counting',     title: 'Counting subdivisions', blurb: '1 e & a 2 e & a — pick the right counting' },
      { id: 'ry-compound',     title: 'Compound meter (6/8)', blurb: 'Two big beats, three little beats each' },
      { id: 'ry-triplets',     title: 'Triplets',           blurb: '3 in the space of 2' },
    ],
  },
  {
    id: 'fingerings',
    name: 'Fingerings',
    tagline: "Same fingerings on alto and tenor. Lock them in.",
    topics: [
      { id: 'fg-low',         title: 'Low-end fingerings', blurb: 'Low B♭ to middle C — bottom of the horn' },
      { id: 'fg-octave-key',  title: 'Octave key range',   blurb: 'D up to high C' },
      { id: 'fg-side-keys',   title: 'Side keys',          blurb: 'Side B♭, side C, high F♯' },
      { id: 'fg-palm-keys',   title: 'Palm keys',          blurb: 'D, E♭, E, F, F♯ — left palm' },
      { id: 'fg-alternates',  title: 'Alternate fingerings', blurb: 'When to use bis B♭, side B♭, alt F♯' },
      { id: 'fg-altissimo',   title: 'Altissimo intro',    blurb: 'G–A above palm F♯' },
    ],
  },
  {
    id: 'theory-vocab',
    name: 'Theory & Vocab',
    tagline: 'Sound smart in class. Read the page like a pro.',
    topics: [
      { id: 'tv-dynamics',        title: 'Dynamics',          blurb: 'pp p mp mf f ff + cresc/decresc' },
      { id: 'tv-tempo',           title: 'Tempo markings',    blurb: 'Largo to presto, accel/rit' },
      { id: 'tv-articulation',    title: 'Articulation marks', blurb: 'Staccato, accent, tenuto, slur, fermata' },
      { id: 'tv-form',            title: 'Form & repeat signs', blurb: 'D.C., D.S., Coda, 1st/2nd endings' },
      { id: 'tv-italian',         title: 'Italian terms',     blurb: 'Espressivo, dolce, legato, cantabile…' },
      { id: 'tv-intervals-sight', title: 'Intervals by sight', blurb: 'Name the interval between two notes' },
    ],
  },
  {
    id: 'ear-training',
    name: 'Ear Training',
    tagline: 'Audio drills. Headphones recommended.',
    topics: [
      { id: 'et-high-low',         title: 'High vs low',          blurb: 'Warm-up — which note is higher?' },
      { id: 'et-2nds-3rds',        title: '2nds vs 3rds',         blurb: 'Hear the gap, name it' },
      { id: 'et-major-minor-3rd',  title: 'Major vs minor 3rd',   blurb: 'Happy or sad' },
      { id: 'et-perfect',          title: 'Perfect intervals',    blurb: '4ths, 5ths, octaves' },
      { id: 'et-all-intervals',    title: 'All intervals',        blurb: 'Mixed bag, harder' },
      { id: 'et-scale-type',       title: 'Scale type by ear',    blurb: 'Major / minor / chromatic / whole-tone' },
    ],
  },
]

const topicCache = new Map<string, { topic: Topic; category: Category }>()
for (const c of categories) {
  for (const t of c.topics) {
    topicCache.set(t.id, { topic: t, category: c })
  }
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getTopic(id: string): Topic | undefined {
  return topicCache.get(id)?.topic
}

export function getCategoryForTopic(id: string): Category | undefined {
  return topicCache.get(id)?.category
}
