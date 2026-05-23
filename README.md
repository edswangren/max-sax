# MaxSAX

Saxophone-practice drill app for Max — sibling of [MaxMATH](https://github.com/edswangren/tx-teks-tutoring).

Pick a topic, run 10 reps, earn screen time.

## Categories

- **Note Reading** — treble-clef speed (lines, spaces, ledger lines, palm keys, altissimo)
- **Scales & Keys** — key signatures, scale construction, concert-pitch transposition (alto/tenor)
- **Rhythm** — note values, time signatures, dotted notes, subdivisions, 6/8, triplets
- **Fingerings** — sax-specific (low, octave-key, palm keys, alternates, altissimo)
- **Theory & Vocab** — dynamics, tempo, articulation, form signs, Italian terms, intervals by sight
- **Ear Training** — interval & scale-type recognition (Web Audio synth)

Each topic runs at three difficulties: **Chill**, **Mid**, **Demon**.

## Run locally

```bash
npm install
npm run dev    # http://localhost:5173/max-sax/
npm test       # 158 unit tests
npm run build  # production bundle
```

## Stack

React 19, TypeScript, Vite, Tailwind v4, React Router 7, VexFlow (notation), Web Audio API (synth). localStorage-only — no backend.

## Live

https://edswangren.github.io/max-sax/
