import { useEffect, useRef } from 'react'
import {
  Renderer,
  Stave,
  StaveNote,
  Formatter,
  Voice,
  Accidental,
} from 'vexflow'
import type { StaffSpec } from '../templates/types'

interface Props extends StaffSpec {}

function parseNoteSpec(spec: string): { key: string; accidental: string | null; duration: string } {
  // Format: "Bb4/q" or "F#5" (defaults to whole note)
  const [pitch, durRaw] = spec.split('/')
  const duration = durRaw || 'w'
  const m = pitch.match(/^([A-Ga-g])([#b]?)(-?\d+)$/)
  if (!m) {
    return { key: 'c/4', accidental: null, duration }
  }
  const letter = m[1].toLowerCase()
  const accidental = m[2] || null
  const octave = m[3]
  return { key: `${letter}/${octave}`, accidental, duration }
}

export default function Staff({
  clef = 'treble',
  keySignature = '',
  timeSignature,
  notes,
  width = 320,
  height = 140,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''
    const renderer = new Renderer(ref.current, Renderer.Backends.SVG)
    renderer.resize(width, height)
    const ctx = renderer.getContext()
    // Style for dark background
    const cream = '#d9cfb8'
    type StylableCtx = {
      setFillStyle?: (v: string) => void
      setStrokeStyle?: (v: string) => void
      setLineWidth?: (v: number) => void
    }
    const sctx = ctx as unknown as StylableCtx
    sctx.setFillStyle?.(cream)
    sctx.setStrokeStyle?.(cream)
    sctx.setLineWidth?.(1.2)

    const stave = new Stave(8, 24, width - 16)
    stave.addClef(clef as 'treble' | 'bass')
    if (keySignature) stave.addKeySignature(keySignature)
    if (timeSignature) stave.addTimeSignature(timeSignature)
    stave.setContext(ctx).draw()

    const specs = (notes ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    if (specs.length === 0) return // stave + key sig only

    const staveNotes = specs.map((s) => {
      const { key, accidental, duration } = parseNoteSpec(s)
      const sn = new StaveNote({ clef: clef as 'treble' | 'bass', keys: [key], duration })
      if (accidental) {
        sn.addModifier(new Accidental(accidental), 0)
      }
      return sn
    })

    // Build a permissive voice so any combination of durations renders
    const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false)
    voice.addTickables(staveNotes)
    new Formatter().joinVoices([voice]).format([voice], width - 80)
    voice.draw(ctx, stave)
  }, [clef, keySignature, timeSignature, notes, width, height])

  return <div ref={ref} className="inline-block" />
}
