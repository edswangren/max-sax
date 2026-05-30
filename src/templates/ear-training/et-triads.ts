import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { triadIntervals, type TriadQuality } from '../../utils/music'

interface QualityChoice { value: TriadQuality; label: string }

const ALL_QUALITIES: QualityChoice[] = [
  { value: 'major',      label: 'Major (bright)' },
  { value: 'minor',      label: 'Minor (dark)' },
  { value: 'diminished', label: 'Diminished (tense)' },
  { value: 'augmented',  label: 'Augmented (floating)' },
]

function poolFor(d: Difficulty): QualityChoice[] {
  if (d === 'easy')   return ALL_QUALITIES.filter((q) => q.value === 'major' || q.value === 'minor')
  if (d === 'medium') return ALL_QUALITIES.filter((q) => q.value !== 'augmented')
  return ALL_QUALITIES
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const pool = poolFor(d)
  const q = pick(pool)
  const intervals = triadIntervals(q.value)
  // Pick a root that keeps the highest note under MIDI 84.
  const rootChoices = [50, 52, 55, 57, 60, 62, 65, 67].filter((r) => r + 8 <= 84)
  const root = pick(rootChoices)
  const dur = d === 'hard' ? 1400 : 800   // hard = sustained block
  const notes = intervals.map((semi) => ({ midi: root + semi, durationMs: dur }))
  // Block chord: overlap by negating the gap.
  const gapMs = d === 'hard' ? -dur : 40

  return {
    questionText: 'What kind of triad is this?',
    correctAnswer: q.value,
    answerFormat: 'multiple-choice',
    choices: shuffle(pool).map((p) => ({ label: p.label, value: p.value })),
    audioSpec: { notes, gapMs, timbre: 'clean' },
    hint: d === 'easy' ? 'Major sounds happy; minor sounds sad.' : undefined,
    checkWork: q.value === 'major' ? 'Major triad: root + Major 3rd + Perfect 5th (0-4-7).'
      : q.value === 'minor' ? 'Minor triad: root + minor 3rd + Perfect 5th (0-3-7).'
      : q.value === 'diminished' ? 'Diminished triad: root + minor 3rd + diminished 5th (0-3-6).'
      : 'Augmented triad: root + Major 3rd + augmented 5th (0-4-8).',
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `et-triads-${d}`,
  topicId: 'et-triads',
  category: 'ear-training',
  title: 'Triad quality by ear',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
