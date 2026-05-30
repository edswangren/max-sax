import { useState, type FormEvent } from 'react'
import type { AnswerFormat, MultipleChoiceOption } from '../templates/types'
import SaxFingering from './SaxFingering'
import { getFingering } from '../data/fingerings'

const formatLabels: Partial<Record<AnswerFormat, string>> = {
  integer: 'whole number',
  'note-name': 'note name (e.g., F# or Bb)',
  'note-sequence': 'notes separated by commas (e.g., Bb, C, D, Eb)',
  'interval': 'interval (e.g., M3, m7, P5)',
  'key-name': 'key name (e.g., Bb major, G minor)',
  text: 'a short answer',
}

interface Props {
  onSubmit: (answer: string) => void
  disabled?: boolean
  answerFormat?: AnswerFormat
  choices?: MultipleChoiceOption[]
}

export default function AnswerInput({ onSubmit, disabled, answerFormat, choices }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed && !disabled) {
      onSubmit(trimmed)
      setValue('')
    }
  }

  if (answerFormat === 'fingering-pick' && choices && choices.length > 0) {
    return (
      <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
        {choices.map((c) => {
          const state = getFingering(c.value)
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => !disabled && onSubmit(c.value)}
              disabled={disabled}
              className="border border-ink-lighter bg-ink-light rounded-xl p-2 sm:p-3 flex flex-col items-center hover:border-brass/60 hover:bg-brass/10 disabled:opacity-40 transition-all active:scale-[0.98] min-h-[44px]"
              aria-label={`Fingering for ${c.label}`}
            >
              {state ? <SaxFingering state={state} width={130} height={220} />
                     : <div className="text-cream/60 text-sm py-12">no fingering</div>}
            </button>
          )
        })}
      </div>
    )
  }

  if (answerFormat === 'multiple-choice' && choices && choices.length > 0) {
    return (
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {choices.map((c) => (
          <button
            key={c.value}
            onClick={() => !disabled && onSubmit(c.value)}
            disabled={disabled}
            className="border border-ink-lighter bg-ink-light text-white font-bold px-4 py-3 rounded-xl text-left text-base hover:border-brass/60 hover:bg-brass/10 disabled:opacity-40 transition-all active:scale-[0.98]"
          >
            {c.label}
          </button>
        ))}
      </div>
    )
  }

  const formatLabel = answerFormat ? formatLabels[answerFormat] : undefined

  return (
    <div className="mt-4">
      {formatLabel && (
        <p className="text-xs text-cream/50 mb-1.5 ml-1">Answer as {formatLabel}</p>
      )}
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder="Drop your answer here..."
          autoFocus
          className="bg-ink-lighter border border-ink-lighter rounded-xl px-4 py-2 text-lg text-white flex-1 placeholder-cream/40 focus:outline-none focus:ring-2 focus:ring-brass focus:border-brass disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="bg-brass text-ink font-bold px-6 py-2 rounded-xl text-lg hover:bg-brass-dim disabled:opacity-30 transition-colors"
        >
          Send it
        </button>
      </form>
    </div>
  )
}
