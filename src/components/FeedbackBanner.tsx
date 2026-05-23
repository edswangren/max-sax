import { pick } from '../utils/random'

interface Props {
  correct: boolean
  correctAnswer: string
  userAnswer: string
  onNext: () => void
  checkWork?: string
}

const correctQuips = [
  "CLEAN. That's a Coltrane note.",
  "Too easy. You're cooking.",
  "Big reed energy.",
  "Pristine. Lock it in.",
  "W. Run the next one.",
  "Smooth. Almost insulting.",
  "Honors Band stuff right there.",
  "Bro didn't even flinch.",
  "That's chair-flipping accuracy.",
  "Built different.",
]

const wrongQuips = [
  "L. But a learning L.",
  "Reed squeak in the brain. Reset.",
  "Even Sonny Rollins shedded for 2 years on a bridge.",
  "Close-ish. Run it back mentally.",
  "Not the note. Try the next rep.",
  "The horn won that one. Best of 3?",
  "We'll get the next one.",
  "Brain fingerings got crossed. Happens.",
]

export default function FeedbackBanner({ correct, correctAnswer, userAnswer, onNext, checkWork }: Props) {
  return (
    <div
      className={`mt-4 rounded-xl border ${
        correct
          ? 'bg-emerald-go/10 border-emerald-go/40 text-emerald-go'
          : 'bg-maroon/10 border-maroon/40 text-maroon'
      }`}
    >
      <div className="flex justify-between items-center p-4 gap-3">
        <div className="min-w-0">
          {correct ? (
            <p className="font-bold text-lg">{pick(correctQuips)}</p>
          ) : (
            <div>
              <p className="font-bold text-lg">{pick(wrongQuips)}</p>
              <p className="text-sm mt-1 text-cream/80">
                You said <strong className="text-white">{userAnswer}</strong> — answer was{' '}
                <strong className="text-white">{correctAnswer}</strong>
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onNext}
          autoFocus
          className={`border rounded-lg px-4 py-2 text-sm font-bold transition-colors shrink-0 ${
            correct
              ? 'border-emerald-go text-emerald-go hover:bg-emerald-go/20'
              : 'border-maroon text-maroon hover:bg-maroon/20'
          }`}
        >
          Next &rarr;
        </button>
      </div>
      {checkWork && (
        <div className="border-t border-white/10 px-4 py-3 bg-white/5 rounded-b-xl">
          <p className="text-xs font-bold text-cream/70 uppercase tracking-wide mb-1">Why</p>
          <p className="text-sm text-cream/80">{checkWork}</p>
        </div>
      )}
    </div>
  )
}
