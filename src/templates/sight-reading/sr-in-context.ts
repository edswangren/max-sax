import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { generateExcerpt, excerptOptionsFor, type Excerpt } from '../../utils/music'
import { mcFrom, neighborNames } from './_shared'

// Apply the key signature + read courtesy/cancellation accidentals while reading
// a line. Easy: a note the key sig alters (F-line in G = F#). Hard: an explicit
// accidental that overrides the key (the classic trap).

function optsFor(d: Difficulty) {
  if (d === 'easy') {
    return {
      keys: ['G major', 'F major', 'D major', 'Bb major'],
      bars: 2, rhythm: 'plain' as const, leapMax: 5, accidentalDensity: 0,
    }
  }
  if (d === 'medium') return { ...excerptOptionsFor('medium'), accidentalDensity: 0.7 }
  return { ...excerptOptionsFor('hard'), accidentalDensity: 0.9 }
}

function chooseTarget(ex: Excerpt): number {
  if (ex.alteredIndex >= 0) return ex.alteredIndex
  const keyAltered = ex.sounding.findIndex((n) => n.name.length > 1)
  if (keyAltered >= 0) return keyAltered
  return Math.floor(Math.random() * ex.sounding.length)
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const ex = generateExcerpt(optsFor(d))
  const idx = chooseTarget(ex)
  const target = ex.sounding[idx]
  const correct = target.name

  const naturalLetter = correct[0] // the common "forgot the accidental" error
  const staffSpec = {
    clef: 'treble' as const,
    keySignature: ex.vexKey,
    timeSignature: ex.timeSignature,
    notes: ex.staffNotes,
    width: ex.width,
    endBar: true,
    highlightIndex: idx,
  }
  const checkWork = target.altered
    ? 'The accidental on the note overrides the key signature.'
    : `In ${ex.key}, that line/space reads ${correct}.`

  if (d === 'hard') {
    return {
      questionText: `Key of ${ex.key}. Name the gold note exactly (watch the accidental).`,
      correctAnswer: correct,
      answerFormat: 'note-name',
      staffSpec,
      checkWork,
      feedbackAudioSpec: ex.audioSpec,
    }
  }
  return {
    questionText: `Key of ${ex.key}. Name the gold note.`,
    correctAnswer: correct,
    answerFormat: 'multiple-choice',
    choices: mcFrom(correct, [naturalLetter, ...neighborNames(correct), ...ex.sounding.map((n) => n.name)]),
    staffSpec,
    hint: d === 'easy' ? 'Read the key signature first, then apply it to the note.' : undefined,
    checkWork,
    feedbackAudioSpec: ex.audioSpec,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sr-in-context-${d}`,
  topicId: 'sr-in-context',
  category: 'sight-reading',
  title: 'Keys & accidentals in context',
  difficulty: d,
  answerFormat: d === 'hard' ? 'note-name' : 'multiple-choice',
  generate: () => makeProblem(d),
}))
