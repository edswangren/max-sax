import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import ProblemDisplay from './ProblemDisplay'
import AnswerInput from './AnswerInput'
import FeedbackBanner from './FeedbackBanner'
import DifficultySelector from './DifficultySelector'
import { getTemplatesForTopic, hasTemplates } from '../templates/registry'
import { checkAnswer } from '../templates/validator'
import { recordSession } from '../store/progress'
import { saveSession, type Mistake } from '../store/sessions'
import { getTopic } from '../data/catalog'
import type { Difficulty, GeneratedProblem } from '../templates/types'
import { pick } from '../utils/random'

const TOTAL_PROBLEMS = 10

function generateProblems(topicId: string, difficulty: Difficulty): GeneratedProblem[] {
  const templates = getTemplatesForTopic(topicId, difficulty)
  if (templates.length === 0) return []
  return Array.from({ length: TOTAL_PROBLEMS }, () => {
    const template = templates[Math.floor(Math.random() * templates.length)]
    return template.generate()
  })
}

export default function PracticeSession() {
  const { topicId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const initialDifficulty = (searchParams.get('d') as Difficulty) || 'easy'

  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty)
  const [sessionKey, setSessionKey] = useState(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const problems = useMemo(
    () => generateProblems(topicId, difficulty),
    [topicId, difficulty, sessionKey]
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean; userAnswer: string } | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const mistakesRef = useRef<Mistake[]>([])
  const savedRef = useRef(false)

  const current = problems[currentIndex]
  const topic = getTopic(topicId)

  useEffect(() => {
    if (finished && !savedRef.current) {
      savedRef.current = true
      recordSession(topicId, difficulty, TOTAL_PROBLEMS, score)
      saveSession({
        topicId,
        difficulty,
        totalProblems: TOTAL_PROBLEMS,
        correct: score,
        mistakes: mistakesRef.current,
      })
    }
  }, [finished, topicId, difficulty, score])

  const reset = useCallback(() => {
    setCurrentIndex(0)
    setFeedback(null)
    setScore(0)
    setFinished(false)
    mistakesRef.current = []
    savedRef.current = false
    setSessionKey((k) => k + 1)
  }, [])

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    setDifficulty(d)
    reset()
  }, [reset])

  const handleSubmit = useCallback((answer: string) => {
    if (feedback || !current) return
    const correct = checkAnswer(answer, current.correctAnswer, current.answerFormat, current.acceptableAnswers)
    if (correct) {
      setScore((s) => s + 1)
    } else {
      mistakesRef.current.push({
        userAnswer: answer,
        correctAnswer: current.correctAnswer,
      })
    }
    setFeedback({ correct, userAnswer: answer })
  }, [current, feedback])

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= TOTAL_PROBLEMS) {
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setFeedback(null)
    }
  }, [currentIndex])

  if (!hasTemplates(topicId)) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">{topic?.title ?? topicId}</h1>
        <p className="text-cream/70 mb-6">Problems for this topic are coming soon. Patience, Max.</p>
        <Link to="/" className="text-brass hover:underline">Back to Home</Link>
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-cream/70">No problems at this difficulty. Try another level.</p>
        <div className="mt-4 flex justify-center">
          <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
        </div>
      </div>
    )
  }

  if (finished) {
    const perfect = [
      "FLAWLESS. Honors Band 1's gonna be like 'who's that?'",
      "10/10. Coltrane stuff.",
      "Not one miss. Built. Different.",
      "Perfect. Reed-soaked excellence.",
    ]
    const good = ["Solid, Max. Keep grinding.", "W. Couple slipped but mostly fire.", "That's a chair-flip pace."]
    const mid  = ["Decent. Not your ceiling though.", "Run it back?", "Honors Band kids aren't sleeping. Neither should we."]
    const rough = ["Down bad. But practice is the cheat code.", "Reset and go again.", "The horn won. For now."]

    const msg = score === TOTAL_PROBLEMS ? pick(perfect)
      : score >= TOTAL_PROBLEMS * 0.8 ? pick(good)
      : score >= TOTAL_PROBLEMS * 0.6 ? pick(mid)
      : pick(rough)

    const scoreColor = score === TOTAL_PROBLEMS ? 'text-brass'
      : score >= TOTAL_PROBLEMS * 0.8 ? 'text-emerald-go'
      : score >= TOTAL_PROBLEMS * 0.6 ? 'text-amber-400'
      : 'text-maroon'

    return (
      <div className="text-center">
        <h1 className="text-2xl font-black mb-4">Session Complete</h1>
        <p className="text-sm text-cream/70 mb-2">{topic?.title ?? topicId} &middot; {difficulty}</p>
        <div className="bg-ink-light rounded-xl border border-ink-lighter p-8 mb-6">
          <p className={`text-6xl font-black mb-3 ${scoreColor}`}>{score}/{TOTAL_PROBLEMS}</p>
          <p className="text-cream/80 text-lg">{msg}</p>
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={reset}
            className="bg-brass text-ink font-bold px-6 py-2 rounded-xl hover:bg-brass-dim transition-colors"
          >
            Run it back
          </button>
          <Link
            to="/"
            className="border border-ink-lighter text-cream/70 px-6 py-2 rounded-xl hover:border-white/30 hover:text-white transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-bold">{topic?.title ?? topicId}</h1>
        <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
      </div>

      <div className="flex justify-between items-center mb-2 text-sm text-cream/70">
        <span>Score: <span className="text-brass font-bold">{score}</span>/{currentIndex + (feedback ? 1 : 0)}</span>
      </div>

      <ProblemDisplay
        problem={current}
        problemNumber={currentIndex + 1}
        totalProblems={TOTAL_PROBLEMS}
      />

      {!feedback && (
        <AnswerInput
          onSubmit={handleSubmit}
          answerFormat={current.answerFormat}
          choices={current.choices}
        />
      )}

      {feedback && (
        <FeedbackBanner
          correct={feedback.correct}
          correctAnswer={current.correctAnswer}
          userAnswer={feedback.userAnswer}
          onNext={handleNext}
          checkWork={current.checkWork}
        />
      )}
    </div>
  )
}
