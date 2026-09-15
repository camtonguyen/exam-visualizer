# Decisions log

Atomic records of "why", so nobody re-litigates a settled call. Newest first.
One entry per decision, not per session — see `docs/progress.md` for session-by-session notes.

---

## 2026-09-12 — Multi-subject architecture (`src/subjects/<id>/`)

Project renamed `ctrr-visualizer` → `exam-visualizer`. User will provide material for
more subjects later; CTRR is subject #1, not the only subject. Split into a
shared layer (`src/engine/types.ts`, `src/components/`, `src/routes/`) and a per-subject
layer (`src/subjects/<id>/{engine,modules,data}` + `subject.tsx` declaring its module
list). A single `src/subjects/registry.ts` array drives nav/routing for every subject —
`App.tsx`/`Home.tsx` never hard-code a subject or module list. Adding subject #2 should
touch `registry.ts` (+1 import/line) and files under its own `subjects/<id>/` only.
Checklist: `docs/ADDING_A_SUBJECT.md`.

Rejected alternative: keep everything flat under `src/engine`/`src/modules` and prefix
filenames by subject (`ctrrDijkstra.ts`, `xstkBayes.ts`...). Rejected because it doesn't
scale past 2-3 subjects (flat directory becomes unnavigable) and makes "what belongs to
subject X" a naming convention instead of a directory boundary — harder to enforce, and
harder for Claude Code to know it must never import across subjects.

## 2026-09-12 — Tailwind v4 via `@tailwindcss/vite`, no `tailwind.config.js`

Tailwind v4 moved config into CSS (`@theme` block in `src/index.css`). Started with a v3-style
`tailwind.config.js` + `postcss.config.js`, both removed once `@tailwindcss/vite` was installed —
the plugin handles content scanning automatically, no `content: [...]` globs needed.

## 2026-09-12 — Engine/module split (pure algorithm vs. React component)

Every algorithm lives in `src/engine/<algo>.ts` as a pure function returning
`{ steps: AlgoStep[], summary }`; the React module only plays back those steps. Chosen so
(a) algorithms are unit-testable without a DOM, (b) all 7 modules share one `StepPlayer`
instead of reimplementing play/pause/next/prev seven times, (c) swapping animation
libraries later only touches `components/`, never `engine/`.

## 2026-09-12 — `StepPlayer` is a controlled component

First draft had `StepPlayer` own its own `currentIndex` state internally. Reverted:
`GraphCanvas` also needs the current index (to know which step to render), so the index
has to live in the parent module and be passed down to both children — otherwise the
graph and the narration panel drift out of sync. `StepPlayer` now takes
`index`/`onIndexChange`/`playing`/`onPlayingChange` as props.

## 2026-09-12 — No Obsidian vault for this repo

The reference setup (`lucasrosati/claude-code-memory-setup`) uses a multi-project Obsidian
vault for cross-project memory. This repo is a single project, so `docs/decisions.md` +
`docs/progress.md` (plain markdown, no app required) serve the same purpose without asking
the user to install/maintain a separate vault. Revisit only if this becomes one of several
projects sharing memory.
