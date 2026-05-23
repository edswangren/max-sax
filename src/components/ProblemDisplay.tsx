import Staff from './Staff'
import SaxFingering from './SaxFingering'
import { getFingering } from '../data/fingerings'
import { playSequence } from '../audio/synth'
import type { GeneratedProblem } from '../templates/types'

interface Props {
  problem: GeneratedProblem
  problemNumber: number
  totalProblems: number
}

export default function ProblemDisplay({ problem, problemNumber, totalProblems }: Props) {
  const { questionText, hint, staffSpec, fingeringSpec, audioSpec } = problem
  const fingerState = fingeringSpec ? getFingering(fingeringSpec.note) : undefined

  return (
    <div className="bg-ink-light rounded-xl border border-ink-lighter p-6">
      <p className="text-sm text-cream/60 mb-3">
        <span className="text-brass font-bold">{problemNumber}</span>
        <span className="text-ink-lighter"> / </span>
        <span>{totalProblems}</span>
      </p>

      <p className="text-xl text-white mb-3">{questionText}</p>

      {staffSpec && (
        <div className="bg-ink rounded-lg p-3 inline-block mb-2">
          <Staff {...staffSpec} />
        </div>
      )}

      {fingerState && (
        <div className="bg-ink rounded-lg p-3 inline-block mb-2">
          <SaxFingering state={fingerState} />
        </div>
      )}

      {audioSpec && (
        <div className="mb-2">
          <button
            onClick={() => playSequence(audioSpec.notes, audioSpec.gapMs)}
            className="bg-brass text-ink font-bold px-4 py-2 rounded-xl hover:bg-brass-dim transition-colors inline-flex items-center gap-2"
          >
            <span aria-hidden>▶</span> Play
          </button>
        </div>
      )}

      {hint && (
        <p className="text-sm text-cream/60 italic mt-2">{hint}</p>
      )}
    </div>
  )
}
