import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { randInt } from '../../utils/random'
import { midiToNoteNameFlat, SAX_RANGE } from '../../utils/music'
import { mcFrom, neighborNames } from './_shared'

// Full written-range fluency: read a note fast anywhere on the horn, low Bb to
// altissimo. Canonical flat spellings (no Cb/Fb spelling-trivia). Replaces the
// old ledger/palm/altissimo single-note drills and fixes the sub-low-Bb bug.

const RANGE: Record<Difficulty, [number, number]> = {
  easy:   [SAX_RANGE.LOW_C, 84],          // C4 .. C6
  medium: [SAX_RANGE.LOW_BB, SAX_RANGE.PALM_F_SHARP], // Bb3 .. F#6
  hard:   [SAX_RANGE.LOW_BB, 96],         // Bb3 .. C7 (into altissimo)
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const [lo, hi] = RANGE[d]
  const midi = randInt(lo, hi)
  const full = midiToNoteNameFlat(midi)          // e.g. "Bb3", "Db6"
  const correct = full.replace(/-?\d+$/, '')     // pitch class
  // Taller canvas + lower stave so far ledger lines don't clip.
  const high = midi >= 84
  const height = high ? 230 : midi <= 60 ? 200 : 170

  return {
    questionText: 'Name this note.',
    correctAnswer: correct,
    answerFormat: d === 'hard' ? 'note-name' : 'multiple-choice',
    choices: d === 'hard' ? undefined : mcFrom(correct, neighborNames(correct, 5)),
    staffSpec: { clef: 'treble', notes: `${full}/w`, height },
    hint: d === 'easy'
      ? 'Middle C (1 ledger below) and palm D (3 ledger above) are your anchors.'
      : undefined,
    feedbackAudioSpec: { notes: [{ midi, durationMs: 700 }], timbre: 'reed' },
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sr-range-${d}`,
  topicId: 'sr-range',
  category: 'sight-reading',
  title: 'Full-range reading',
  difficulty: d,
  answerFormat: d === 'hard' ? 'note-name' : 'multiple-choice',
  generate: () => makeProblem(d),
}))
