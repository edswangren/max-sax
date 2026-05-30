# MaxSAX — musical / pedagogical review

Reviewer perspective: music teacher evaluating content quality and learning value for a 6th-grade saxophone student. Engineering quality is out of scope.

## What's good

- **Category framing matches reality.** "Band lives in flats" is correct. `BAND_KEYS` ordered Bb/Eb/F/Ab/Db is exactly where 6th-grade band lives. The transposition hint ("alto = M6 up, tenor = M2 up") is right and useful.
- **Rhythm category headline** ("Wrong notes recover. Wrong rhythm doesn't.") is a pedagogically true thing most curricula bury.
- **Compound meter pitched well**: "two big beats, each three eighths" — exactly how I'd teach it to a 12-year-old.
- **Articulation glossary is accurate and complete** for the level (staccato/accent/tenuto/marcato/slur/fermata/legato).
- **Bis-Bb / side-Bb / 1-and-1 alternates content is real saxophone knowledge.** Most apps don't go anywhere near this. Correct rationale ("bis fights with B natural"). The most musically substantive section in the app.
- Same fingerings for alto + tenor → correctly noted; saves duplication.
- Web Audio for ear training exists at all (most theory apps skip audio).
- Concert-pitch transposition is the *right* question for a band kid.

## Could be better

- **Ear training has no root randomization.** `et-all-intervals` always plays from MIDI 60 (middle C). Same for `et-major-minor-3rd` and `et-scale-type`. A student doing 20 reps in a row will pattern-match the *absolute* second note, not the *interval*. This isn't ear training — it's pitch memorization of a single root. Randomize the root every problem.
- **Synth timbre is wrong for ear training.** Sawtooth+triangle through a 2.4kHz lowpass is buzzy and harmonically dense. For interval ID (especially harmonic dyads), a cleaner sine-ish or piano-like timbre dramatically improves discrimination. Bonus: it doesn't sound like a sax, which is a missed branding/identification opportunity.
- **Major/minor as "happy/sad"** is the standard crutch but plateaus fast. A 6th grader can absolutely learn "the 3rd sits a half-step lower" or "minor 3rd = 3 half-steps." The happy/sad framing means he'll never connect ear → theory → fingering.
- **Counting subdivisions has a real musical error** (`src/templates/rhythm/ry-counting.ts:20`): triplet alternates include `'1 & a'`. Triplets are three *even* subdivisions; "1 & a" (16th + dotted-8 grouping) is uneven. They're not interchangeable counts — accepting that as correct trains the wrong rhythmic feel.
- **`sk-keysig-full` gives away the answer in the prompt** ("This key signature has 3 flats. What major key?"). The staff display becomes decoration. The whole point of key-signature drill is *reading* the sharps/flats off the staff. Show the signature, ask the key — don't pre-count it.
- **Major-scale construction is text-only** even though you have a working synth. The single highest-leverage upgrade: after the student lists the scale notes, **play it back for them**. That's the audio↔notation link that builds internal pitch.
- **Circle-of-fifths drill is mechanical key→key** and misses the actual purpose of the circle: the order sharps/flats are *added*. "Next sharp is F#, then C#, then G#…" is the part that unlocks key-sig reading. Currently buried in a one-line easy-mode hint.
- **Concert transposition only asks for the key name.** The harder, real-world skill is being handed *concert pitch notes* and producing written notes. "Band plays concert F. What's the first note of your scale?" → "G." That's the chair-test version.
- **Fingerings category underuses the SaxFingering SVG.** `fg-alternates` is all text MC. There's an obvious drill missing: show the SVG, name the note — and its inverse, show a note on the staff, pick the matching SVG.
- **`ry-compound` has only 6 hardcoded questions.** Pool will exhaust within one session.

## Bad / misleading

- **Triplet alternate counts above** — actually wrong, not just suboptimal.
- **"All intervals" labeled as ear training but anchored to one pitch** — overstates what the student is learning.
- **`sk-natural-minor` at hard roots** (F#, C#) hinges on `buildScale` returning correctly spelled letter names. Worth spot-checking that C# natural minor returns `C# D# E F# G# A B`, not enharmonic mongrels — single-letter-per-degree is required for scale spelling pedagogy.

## Big gaps (musically / pedagogically)

For a sax student, these matter more than half of what's already in the app:

1. **No metronome / tap-to-beat / play-along click.** For a wind player, time is the single most under-practiced skill. A metronome page would be more valuable than any theory drill.
2. **No rhythmic ear training / dictation.** "Which of these notated rhythms is what you just heard?" — the most transferable ear skill for ensemble playing. Completely absent.
3. **No tuning / pitch-matching.** Alto sax has notorious pitch tendencies (D2/D3 sharp, low Bb/C# flat). A "is this note sharp, flat, or in tune?" drill would teach an ear skill Max will use *every rehearsal*.
4. **No chromatic scale drill** — every middle-school sax player is tested on chromatic. There's no topic for it.
5. **No chord-quality recognition** beyond Maj/min 3rd. No triads (maj/min/dim/aug), no dominant 7, no perfect-cadence ear training.
6. **No melodic dictation** at any level ("which notation matches the 3-note motif you heard?").
7. **No long-tone, breath, or embouchure content.** "Altissimo basics" is fingerings only; the actual challenge there is voicing, not finger position.
8. **No enharmonic equivalents drill** (F#=Gb, Bb=A#). Comes up constantly in flat-key band parts.
9. **No scale-degree / I-IV-V chord construction.** Free extension of major-scale work that bridges to improv and chord charts.
10. **No actual rhythm sight-reading.** Rhythm category teaches *facts about* rhythm; never shows a notated bar and asks the student to identify or clap it.
11. **No relative/parallel minor** in scales-keys.
12. **No reed/equipment vocab** — useful band-room literacy ("what's a 2.5 reed," "what's a ligature").

## TL;DR — ranked by ROI

1. Randomize roots in ear training (one-line fix, big pedagogical lift).
2. Fix the triplet count bug (factually wrong music).
3. Add a metronome page.
4. Add rhythm sight-reading + rhythmic dictation.
5. Use the synth in `sk-major-construct` to play scales after answering.
6. Add a tuning / pitch-bend recognition drill (sax-specific killer feature).
7. Show the key signature without telling the student how many accidentals it has.
8. Add fingering↔note matching using the SaxFingering SVG.
