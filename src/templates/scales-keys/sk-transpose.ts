import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'
import { getInstrument } from '../../data/instrument'
import { concertToWrittenKey } from '../../utils/music'

// Most common band concert keys
const BAND_KEYS = [
  'Bb major', 'Eb major', 'F major', 'Ab major', 'Db major', 'C major', 'G major',
]

function makeProblem(d: Difficulty): GeneratedProblem {
  const instrument = getInstrument()
  const pool = d === 'easy' ? BAND_KEYS.slice(0, 3) : d === 'medium' ? BAND_KEYS.slice(0, 5) : BAND_KEYS
  const concertKey = pick(pool)
  const writtenKey = concertToWrittenKey(concertKey, instrument)
  return {
    questionText: `Band is playing concert ${concertKey}. On your ${instrument} sax, what key are YOU reading?`,
    correctAnswer: writtenKey,
    answerFormat: 'key-name',
    hint: instrument === 'alto'
      ? 'Alto reads a Major 6th up from concert.'
      : 'Tenor reads a Major 2nd up from concert (same letter family, plus an octave).',
    checkWork: `Concert ${concertKey} → ${instrument} reads ${writtenKey}.`,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-transpose-${d}`,
  topicId: 'sk-transpose',
  category: 'scales-keys',
  title: 'Concert pitch transposition',
  difficulty: d,
  answerFormat: 'key-name',
  generate: () => makeProblem(d),
}))
