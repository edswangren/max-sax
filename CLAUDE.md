# MaxSAX — Claude working notes

Saxophone-practice drill app for Max (6th grader, Canyon Ridge MS, Austin TX). Sibling of MaxMATH at `~/repos/tx-teks-tutoring`. Self-paced jump-in/out: pick a topic → 10 problems → done.

## Stack snapshot

- React 19 + TypeScript + Vite 8 + Tailwind v4
- React Router 7 (hash routing — works on GitHub Pages)
- VexFlow 5 (notation), Web Audio API (synth for ear training)
- localStorage only — no backend
- Vitest for unit tests (158+ passing as of initial build)
- Deployed via GitHub Actions to https://edswangren.github.io/max-sax/

## Architecture

- `src/data/catalog.ts` — 6 categories × topics metadata
- `src/data/fingerings.ts` — note → key-state map for the SaxFingering SVG
- `src/templates/<category>/<topic-id>.ts` — each topic exports `templates: ProblemTemplate[]` (one per difficulty)
- `src/templates/registry.ts` — imports all topic files, exposes lookup by topicId
- `src/templates/validator.ts` — checkAnswer() handles each AnswerFormat
- `src/utils/music.ts` — midi↔name, intervals, key sigs, scales, transposition
- `src/store/{progress,sessions,weakspots}.ts` — localStorage layer
- `src/components/` — Layout, Landing, TopicList, PracticeSession, Staff (VexFlow), SaxFingering (SVG), etc.
- `src/audio/synth.ts` — lazy AudioContext + reedy sawtooth synth

## Test-and-harden loop (DEFAULT MODE)

**Always do real browser testing — not just `npm test` — when touching anything visual or interactive.** The user wants this hardened in a loop using chrome-devtools-mcp.

Workflow:

1. Start dev server: `npm run dev -- --port 5189` (background). Wait ~3s. Url is `http://localhost:5189/max-sax/`.
2. Open via `new_page` (or reuse a tab via `select_page` / `list_pages`).
3. Set viewport per scenario:
   - **iPhone 14 mobile**: `emulate { viewport: "390x844x3,mobile,touch" }`
   - **iPhone SE narrow**: `emulate { viewport: "375x667x2,mobile,touch" }`
   - **Desktop**: `emulate { viewport: "1280x800x1" }`
4. For each route (`/`, `/category/<id>`, `/practice/<topicId>`, `/history`, `/weak-spots`, `/settings`):
   - `navigate_page` (use hash route, e.g. `http://localhost:5189/max-sax/#/category/note-reading`)
   - `wait_for` a route-specific string (e.g. category name) — never assume render is instant
   - `take_screenshot` (save under `/tmp/maxsax-screens/...` for later review)
   - `list_console_messages { types: ["error","warn"] }` — flag anything that's not a known harmless warning
   - `take_snapshot` to get clickable uids
5. Always click through one full practice session per shape: home → category → topic → answer 10 → results.
6. When fixing a bug, **re-screenshot the same route at the same viewport** to confirm.
7. After all viewports clear, build (`npm run build`) and push.

When inspecting layout issues, prefer `take_snapshot` over `take_screenshot` first — the a11y-tree text snapshot is faster and shows element structure. Use screenshots for visual confirmation only.

## Mobile constraints

- Header must fit 375px (iPhone SE) with zero horizontal scroll
- `Staff` SVG is fixed ~320px wide; wrap in `overflow-x-auto` containers
- `SaxFingering` is 200×340 — fits comfortably
- Default `<main>` padding: `p-4` on mobile, `sm:p-6` on ≥640px
- Multiple-choice option grid is `grid-cols-1 sm:grid-cols-2` — keep that pattern

## Code conventions

- Topic file naming: `<cat-prefix>-<slug>.ts` (e.g. `nr-lines`, `sk-keysig-flats`)
- Each topic exports `templates` (NOT a unique name) — the registry aliases on import
- One generator function per file, branching on difficulty
- MC questions: ensure `correctAnswer` always appears in `choices` (template tests enforce this)
- Validator-driven formats: `note-name`, `note-sequence`, `interval`, `key-name`, `integer`, `multiple-choice`, `text`
- Don't accept enharmonic equivalents implicitly — the template author opts in via `acceptableAnswers`

## Deploy

Auto-deploys on push to `main` via `.github/workflows/deploy.yml`. Workflow runs `npm test` first, so failing tests block the deploy.

## Naming

The app brand is **MaxSAX** (mixed case — NOT all-caps). Logo splits as `<Max>` (maroon) + `<SAX>` (ink) + `<.>` (maroon).

## Where to look next

- See `.planning/` if it exists for any phase plans (none yet on this repo)
- Plan files at `~/.claude/plans/we-re-going-to-build-dynamic-donut.md` covered the initial build
- Persistent memory: `~/.claude/projects/-Users-edward-repos-max-sax/memory/`
