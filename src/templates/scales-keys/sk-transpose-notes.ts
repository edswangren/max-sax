import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'
import { getInstrument } from '../../data/instrument'
import { buildScale, concertToWrittenPc } from '../../utils/music'

// Same band-key pool as sk-transpose; the per-note drill asks for a specific
// scale degree of the WRITTEN scale on the sax.
const BAND_KEYS = [
  'Bb', 'Eb', 'F', 'Ab', 'Db', 'C', 'G',
]

interface DegreeChoice { label: string; degree: number }
const DEGREES: DegreeChoice[] = [
  { label: 'tonic (1)', degree: 0 },
  { label: '3rd',       degree: 2 },
  { label: '5th',       degree: 4 },
]

function makeProblem(d: Difficulty): GeneratedProblem {
  const instrument = getInstrument()
  const pool = d === 'easy' ? BAND_KEYS.slice(0, 3) : d === 'medium' ? BAND_KEYS.slice(0, 5) : BAND_KEYS
  const concertRoot = pick(pool)
  const writtenRoot = concertToWrittenPc(concertRoot, instrument)
  const writtenScale = buildScale(writtenRoot, 'major')
  const target = pick(DEGREES)
  const answer = writtenScale[target.degree]
  // Distractors: other degrees of the same written scale (so they're plausible).
  const distractorDegrees = [1, 3, 5, 6].slice(0, 3)
  const distractors = distractorDegrees.map((i) => writtenScale[i]).filter((n) => n !== answer)
  const seen = new Set<string>([answer])
  const choices = [answer]
  for (const dn of distractors) {
    if (seen.has(dn)) continue
    seen.add(dn)
    choices.push(dn)
    if (choices.length === 4) break
  }
  // Pad in case writtenScale produced duplicates we filtered out.
  for (let i = 0; choices.length < 4 && i < writtenScale.length; i++) {
    const n = writtenScale[i]
    if (!seen.has(n)) { seen.add(n); choices.push(n) }
  }
  return {
    questionText: `Band plays concert ${concertRoot}. On ${instrument} sax, what's your ${target.label}?`,
    correctAnswer: answer,
    answerFormat: 'multiple-choice',
    choices: choices.map((v) => ({ label: v, value: v })),
    checkWork: `Concert ${concertRoot} → ${instrument} reads ${writtenRoot} major: ${writtenScale.join(' – ')}.`,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-transpose-notes-${d}`,
  topicId: 'sk-transpose-notes',
  category: 'scales-keys',
  title: 'Transpose: tonic / 3rd / 5th',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
