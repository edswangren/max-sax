import type { ProblemTemplate, Difficulty } from './types'

// Note Reading
import { templates as nrLines }       from './note-reading/nr-lines'
import { templates as nrSpaces }      from './note-reading/nr-spaces'
import { templates as nrMixed }       from './note-reading/nr-mixed'
import { templates as nrLedgerBelow } from './note-reading/nr-ledger-below'
import { templates as nrAboveStaff }  from './note-reading/nr-above-staff'
import { templates as nrPalmKeys }    from './note-reading/nr-palm-keys'
import { templates as nrAltissimo }   from './note-reading/nr-altissimo'

// Scales & Keys
import { templates as skKeysigFlats }    from './scales-keys/sk-keysig-flats'
import { templates as skKeysigSharps }   from './scales-keys/sk-keysig-sharps'
import { templates as skKeysigFull }     from './scales-keys/sk-keysig-full'
import { templates as skMajorConstruct } from './scales-keys/sk-major-construct'
import { templates as skIdentifyScale }  from './scales-keys/sk-identify-scale'
import { templates as skTranspose }      from './scales-keys/sk-transpose'
import { templates as skTransposeNotes } from './scales-keys/sk-transpose-notes'
import { templates as skNaturalMinor }   from './scales-keys/sk-natural-minor'
import { templates as skCircleFifths }   from './scales-keys/sk-circle-fifths'
import { templates as skEnharmonic }     from './scales-keys/sk-enharmonic'
import { templates as skRelativeMinor }  from './scales-keys/sk-relative-minor'
import { templates as skChromatic }      from './scales-keys/sk-chromatic'
import { templates as skOrderOfAccidentals } from './scales-keys/sk-order-of-accidentals'

// Rhythm
import { templates as ryNoteValues } from './rhythm/ry-note-values'
import { templates as ryRests }      from './rhythm/ry-rests'
import { templates as ryTimesigMath } from './rhythm/ry-timesig-math'
import { templates as ryDotted }     from './rhythm/ry-dotted'
import { templates as ryTiesSlurs }  from './rhythm/ry-ties-slurs'
import { templates as ryCounting }   from './rhythm/ry-counting'
import { templates as ryCompound }   from './rhythm/ry-compound'
import { templates as ryTriplets }   from './rhythm/ry-triplets'
import { templates as rySightRead }  from './rhythm/ry-sight-read'

// Fingerings
import { templates as fgLow }        from './fingerings/fg-low'
import { templates as fgOctaveKey }  from './fingerings/fg-octave-key'
import { templates as fgSideKeys }   from './fingerings/fg-side-keys'
import { templates as fgPalmKeys }   from './fingerings/fg-palm-keys'
import { templates as fgAlternates } from './fingerings/fg-alternates'
import { templates as fgAltissimo }  from './fingerings/fg-altissimo'
import { templates as fgN2FLow }     from './fingerings/fg-note-to-fingering-low'
import { templates as fgN2FOctave }  from './fingerings/fg-note-to-fingering-octave-key'
import { templates as fgN2FPalm }    from './fingerings/fg-note-to-fingering-palm-keys'

// Theory & Vocab
import { templates as tvDynamics }     from './theory-vocab/tv-dynamics'
import { templates as tvTempo }        from './theory-vocab/tv-tempo'
import { templates as tvArticulation } from './theory-vocab/tv-articulation'
import { templates as tvForm }         from './theory-vocab/tv-form'
import { templates as tvItalian }      from './theory-vocab/tv-italian'
import { templates as tvIntervalsSight } from './theory-vocab/tv-intervals-sight'

// Ear Training
import { templates as etHighLow }       from './ear-training/et-high-low'
import { templates as et2nds3rds }      from './ear-training/et-2nds-3rds'
import { templates as etMajorMinor3rd } from './ear-training/et-major-minor-3rd'
import { templates as etPerfect }       from './ear-training/et-perfect'
import { templates as etAllIntervals }  from './ear-training/et-all-intervals'
import { templates as etScaleType }     from './ear-training/et-scale-type'
import { templates as etTriads }        from './ear-training/et-triads'
import { templates as etTuning }        from './ear-training/et-tuning'

const allTemplates: ProblemTemplate[] = [
  ...nrLines, ...nrSpaces, ...nrMixed, ...nrLedgerBelow, ...nrAboveStaff, ...nrPalmKeys, ...nrAltissimo,
  ...skKeysigFlats, ...skKeysigSharps, ...skKeysigFull, ...skMajorConstruct, ...skIdentifyScale, ...skTranspose, ...skTransposeNotes, ...skNaturalMinor, ...skCircleFifths,
  ...skEnharmonic, ...skRelativeMinor, ...skChromatic, ...skOrderOfAccidentals,
  ...ryNoteValues, ...ryRests, ...ryTimesigMath, ...ryDotted, ...ryTiesSlurs, ...ryCounting, ...ryCompound, ...ryTriplets, ...rySightRead,
  ...fgLow, ...fgOctaveKey, ...fgSideKeys, ...fgPalmKeys, ...fgAlternates, ...fgAltissimo,
  ...fgN2FLow, ...fgN2FOctave, ...fgN2FPalm,
  ...tvDynamics, ...tvTempo, ...tvArticulation, ...tvForm, ...tvItalian, ...tvIntervalsSight,
  ...etHighLow, ...et2nds3rds, ...etMajorMinor3rd, ...etPerfect, ...etAllIntervals, ...etScaleType, ...etTriads, ...etTuning,
]

const byTopic = new Map<string, ProblemTemplate[]>()
for (const t of allTemplates) {
  const existing = byTopic.get(t.topicId) ?? []
  existing.push(t)
  byTopic.set(t.topicId, existing)
}

export function getTemplatesForTopic(topicId: string, difficulty?: Difficulty): ProblemTemplate[] {
  const templates = byTopic.get(topicId) ?? []
  if (difficulty) return templates.filter((t) => t.difficulty === difficulty)
  return templates
}

export function hasTemplates(topicId: string): boolean {
  const arr = byTopic.get(topicId)
  return arr !== undefined && arr.length > 0
}

export function getAllTopicIds(): string[] {
  return [...byTopic.keys()]
}

export function getAllTemplates(): ProblemTemplate[] {
  return allTemplates
}
