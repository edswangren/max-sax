import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getInstrument, setInstrument, type Instrument } from '../data/instrument'

export default function Settings() {
  const [instrument, setInstrumentState] = useState<Instrument>(getInstrument())

  const choose = (i: Instrument) => {
    setInstrument(i)
    setInstrumentState(i)
  }

  return (
    <div>
      <Link to="/" className="text-brass text-sm hover:underline mb-4 inline-block">&larr; Home</Link>
      <h1 className="text-2xl font-black mb-6">Settings</h1>

      <section className="bg-ink-light border border-ink-lighter rounded-xl p-5">
        <h2 className="text-lg font-bold mb-1">Which horn are you on?</h2>
        <p className="text-sm text-cream/70 mb-4">
          Fingerings are the same for alto and tenor. This only affects concert-pitch transposition drills.
        </p>
        <div className="flex gap-3">
          {(['alto', 'tenor'] as const).map((i) => (
            <button
              key={i}
              onClick={() => choose(i)}
              className={`px-5 py-2 rounded-xl border-2 font-bold capitalize transition-all ${
                instrument === i
                  ? 'border-brass bg-brass/15 text-brass'
                  : 'border-ink-lighter text-cream/70 hover:border-white/30 hover:text-white'
              }`}
            >
              {i} sax
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
