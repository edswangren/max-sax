import { useEffect, useRef } from 'react'
import {
  Renderer,
  Stave,
  StaveNote,
  Formatter,
  Voice,
  Accidental,
  Beam,
  BarNote,
  Dot,
  Fraction,
  BarlineType,
} from 'vexflow'
import type { StaffSpec } from '../templates/types'

interface Props extends StaffSpec {}

type Tok =
  | { kind: 'bar' }
  | { kind: 'note'; key: string; accidental: string | null; base: string; dotted: boolean; rest: boolean }

const DUR_RE = /^(w|h|q|8|16)(\.?)$/

/** Parse one comma-separated token of the notes grammar. */
function tokenize(spec: string, clef: 'treble' | 'bass'): Tok {
  if (spec === '|') return { kind: 'bar' }

  // Rest: "<dur>[.]r" with no pitch, e.g. "qr", "8r", "q.r"
  const restM = spec.match(/^(w|h|q|8|16)(\.?)r$/)
  if (restM) {
    return {
      kind: 'note',
      key: clef === 'bass' ? 'd/3' : 'b/4',
      accidental: null,
      base: restM[1],
      dotted: restM[2] === '.',
      rest: true,
    }
  }

  // Note: "<pitch>[/<dur>[.]]" — pitch like Bb4, F#5, Fn4; defaults to whole note.
  const [pitch, durRaw] = spec.split('/')
  let base = 'w'
  let dotted = false
  if (durRaw) {
    const dm = durRaw.match(DUR_RE)
    if (dm) {
      base = dm[1]
      dotted = dm[2] === '.'
    } else {
      base = durRaw
    }
  }
  const m = pitch.match(/^([A-Ga-g])([#bn]?)(-?\d+)$/)
  if (!m) return { kind: 'note', key: 'c/4', accidental: null, base, dotted, rest: false }
  return {
    kind: 'note',
    key: `${m[1].toLowerCase()}/${m[3]}`,
    accidental: m[2] || null,
    base,
    dotted,
    rest: false,
  }
}

function buildStaveNote(t: Extract<Tok, { kind: 'note' }>, clef: 'treble' | 'bass'): StaveNote {
  const duration = `${t.base}${t.dotted ? 'd' : ''}${t.rest ? 'r' : ''}`
  const sn = new StaveNote({ clef, keys: [t.key], duration })
  if (t.accidental && !t.rest) sn.addModifier(new Accidental(t.accidental), 0)
  if (t.dotted) Dot.buildAndAttach([sn])
  return sn
}

/** Perceived luminance of an `rgb(r, g, b)` string; low = dark. */
function isDark(color: string): boolean {
  const m = color.match(/\d+/g)
  if (!m || m.length < 3) return false
  const [r, g, b] = m.map(Number)
  return 0.299 * r + 0.587 * g + 0.114 * b < 110
}

/** Repaint any dark stroke/fill (VexFlow defaults) to the theme cream. */
function recolorDark(root: HTMLElement, cream: string): void {
  const svg = root.querySelector('svg')
  if (!svg) return
  svg.querySelectorAll<SVGElement>('path, line, rect, polygon, ellipse, circle').forEach((el) => {
    const cs = getComputedStyle(el)
    if (cs.stroke && cs.stroke !== 'none' && isDark(cs.stroke)) el.setAttribute('stroke', cream)
    if (cs.fill && cs.fill !== 'none' && isDark(cs.fill)) el.setAttribute('fill', cream)
  })
}

export default function Staff({
  clef = 'treble',
  keySignature = '',
  timeSignature,
  notes,
  width = 320,
  height = 140,
  highlightIndex,
  endBar = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''
    const cream = '#d9cfb8'
    const clefName = clef as 'treble' | 'bass'

    // Tokenize first so the canvas can be sized to the actual note range —
    // high (altissimo) and low (ledger) notes need headroom or they clip.
    const specs = (notes ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    const toks = specs.map((s) => tokenize(s, clefName))

    const STEP: Record<string, number> = { c: 0, d: 1, e: 2, f: 3, g: 4, a: 5, b: 6 }
    const steps = toks
      .filter((t): t is Extract<Tok, { kind: 'note' }> => t.kind === 'note' && !t.rest)
      .map((t) => { const [l, o] = t.key.split('/'); return parseInt(o, 10) * 7 + (STEP[l] ?? 0) })
    const TOP_LINE = clefName === 'bass' ? 26 : 38     // A3 / F5
    const BOTTOM_LINE = clefName === 'bass' ? 18 : 30  // G2 / E4
    const maxStep = steps.length ? Math.max(...steps) : TOP_LINE
    const minStep = steps.length ? Math.min(...steps) : BOTTOM_LINE
    const above = Math.max(0, maxStep - TOP_LINE) * 5   // ~5px per staff step
    const below = Math.max(0, BOTTOM_LINE - minStep) * 5
    const staveY = 24 + above
    const canvasHeight = Math.max(height, staveY + 52 + below + 24, 110)

    const renderer = new Renderer(ref.current, Renderer.Backends.SVG)
    renderer.resize(width, canvasHeight)
    const ctx = renderer.getContext()
    type StylableCtx = {
      setFillStyle?: (v: string) => void
      setStrokeStyle?: (v: string) => void
      setLineWidth?: (v: number) => void
    }
    const sctx = ctx as unknown as StylableCtx
    sctx.setFillStyle?.(cream)
    sctx.setStrokeStyle?.(cream)
    sctx.setLineWidth?.(1.2)

    const stave = new Stave(8, staveY, width - 16)
    stave.addClef(clefName)
    if (keySignature) stave.addKeySignature(keySignature)
    if (timeSignature) stave.addTimeSignature(timeSignature)
    if (endBar) stave.setEndBarType(BarlineType.END)
    stave.setContext(ctx).draw()

    if (specs.length === 0) return // stave + key sig only

    // Build tickables in stream order, grouping notes into measures (split on '|').
    const tickables: (StaveNote | BarNote)[] = []
    const measures: StaveNote[][] = [[]]
    const sounding: StaveNote[] = [] // non-rest notes, for highlightIndex mapping
    for (const t of toks) {
      if (t.kind === 'bar') {
        tickables.push(new BarNote(BarlineType.SINGLE))
        measures.push([])
        continue
      }
      const sn = buildStaveNote(t, clefName)
      tickables.push(sn)
      measures[measures.length - 1].push(sn)
      if (!t.rest) sounding.push(sn)
    }

    if (highlightIndex != null && sounding[highlightIndex]) {
      const brass = '#f5b50f'
      sounding[highlightIndex].setStyle({ fillStyle: brass, strokeStyle: brass })
    }

    const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false)
    voice.addTickables(tickables)
    new Formatter().joinVoices([voice]).format([voice], width - 80)
    voice.draw(ctx, stave)

    // Beam eighths/sixteenths per measure (never across barlines), grouped by beat.
    const [, beatBottom] = (timeSignature ?? '4/4').split('/').map(Number)
    const group = beatBottom === 8 ? new Fraction(3, 8) : new Fraction(1, 4)
    for (const measureNotes of measures) {
      if (measureNotes.length < 2) continue
      const beams = Beam.generateBeams(measureNotes, { groups: [group] })
      beams.forEach((b) => b.setContext(ctx).draw())
    }

    // VexFlow draws some elements (stems, beams, staff lines) with a default
    // black / #444 stroke that doesn't inherit our context color and is unreadable
    // on the dark theme. Recolor anything dark to cream; leave the brass highlight.
    recolorDark(ref.current, cream)
  }, [clef, keySignature, timeSignature, notes, width, height, highlightIndex, endBar])

  return <div ref={ref} className="inline-block" />
}
