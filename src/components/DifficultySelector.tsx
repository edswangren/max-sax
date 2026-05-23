import type { Difficulty } from '../templates/types'

interface Props {
  value: Difficulty
  onChange: (d: Difficulty) => void
}

const levels: { key: Difficulty; label: string; active: string }[] = [
  { key: 'easy',   label: 'Chill', active: 'bg-emerald-go/20 border-emerald-go text-emerald-go ring-emerald-go/30' },
  { key: 'medium', label: 'Mid',   active: 'bg-amber-400/20 border-amber-400 text-amber-400 ring-amber-400/30' },
  { key: 'hard',   label: 'Demon', active: 'bg-maroon/20 border-maroon text-maroon ring-maroon/30' },
]

export default function DifficultySelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {levels.map((l) => (
        <button
          key={l.key}
          onClick={() => onChange(l.key)}
          className={`px-3 py-1 rounded-full border text-sm font-bold transition-all ${
            value === l.key
              ? `${l.active} ring-2 ring-offset-1 ring-offset-ink`
              : 'bg-ink-lighter border-ink-lighter text-cream/70 hover:text-white hover:border-white/30'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
