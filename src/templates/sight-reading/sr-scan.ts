import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { generateExcerpt, excerptOptionsFor } from '../../utils/music'
import { mcFrom, neighborNames, KEY_POOL } from './_shared'

// STARS pre-read: scan the excerpt before you play. Key? Highest note? Accidentals?
type ScanKind = 'key' | 'highest' | 'lowest' | 'accidentals'

function makeProblem(d: Difficulty): GeneratedProblem {
  const ex = generateExcerpt(excerptOptionsFor(d))
  const staffSpec = {
    clef: 'treble' as const,
    keySignature: ex.vexKey,
    timeSignature: ex.timeSignature,
    notes: ex.staffNotes,
    width: ex.width,
    endBar: true,
  }
  const kinds: ScanKind[] = ['key', 'highest', 'lowest', 'accidentals']
  const kind = pick(kinds)

  if (kind === 'key') {
    const correct = ex.key
    return {
      questionText: 'Scan first: what key is this written in?',
      correctAnswer: correct,
      answerFormat: 'multiple-choice',
      choices: mcFrom(correct, shuffle(KEY_POOL)),
      staffSpec,
      hint: d === 'easy' ? 'Count the sharps/flats next to the clef.' : undefined,
      checkWork: `Key signature: ${ex.vexKey || 'no sharps/flats (C major)'}.`,
    }
  }
  if (kind === 'accidentals') {
    const correct = String(ex.accidentalCount)
    const opts = ['0', '1', '2', '3'].filter((v) => v !== correct)
    return {
      questionText: 'How many accidentals are printed on the notes? (not the key signature)',
      correctAnswer: correct,
      answerFormat: 'multiple-choice',
      choices: mcFrom(correct, [correct, ...opts]),
      staffSpec,
      hint: d === 'easy' ? 'Look for ♯/♭/♮ signs in front of notes — not the key signature.' : undefined,
    }
  }
  // highest / lowest
  const target = kind === 'highest' ? ex.sounding[ex.highestIndex] : ex.sounding[ex.lowestIndex]
  const correct = target.name
  const others = ex.sounding.map((n) => n.name).filter((n) => n !== correct)
  return {
    questionText: `Scan the line: what is the ${kind === 'highest' ? 'HIGHEST' : 'LOWEST'} note?`,
    correctAnswer: correct,
    answerFormat: 'multiple-choice',
    choices: mcFrom(correct, [...others, ...neighborNames(correct)]),
    staffSpec,
    hint: d === 'easy' ? `Find the note ${kind === 'highest' ? 'highest on' : 'lowest on'} the staff, then read it.` : undefined,
    feedbackAudioSpec: ex.audioSpec,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sr-scan-${d}`,
  topicId: 'sr-scan',
  category: 'sight-reading',
  title: 'Scan the excerpt',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
