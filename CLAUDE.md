# CLAUDE.md — Exam Visualizer (đa môn)

Instructions for Claude Code (or any agent) working in this repo. Read this file first,
every session, before touching source. Goal: orient in one file instead of re-reading the tree.

## What this project is

Interactive React + Framer Motion app that turns written exam guides into step-by-step
**animated** solutions. **Multi-subject by design**: CTRR (Cấu trúc rời rạc) is the first
subject, fully scaffolded; more subjects get added over time as their material arrives —
the architecture must never assume "there is only one subject".

Full content plan per subject: **`docs/PLAN.md`**. Checklist for adding a new subject:
**`docs/ADDING_A_SUBJECT.md`** — read that before writing any code for a subject that
isn't CTRR.

## Stack

React 19 + TypeScript + Vite 8 + Tailwind v4 (`@tailwindcss/vite`, no config file —
theme tokens live in `src/index.css` under `@theme`) + Framer Motion (animation) +
React Router (subject + module navigation) + Zustand (only if a module needs cross-
component state; most don't).

## Context Navigation Rule (read in this order, stop as soon as you have the answer)

1. **This file** — stack, conventions, where things live.
2. **`docs/PLAN.md`** — per-subject module list, what's done, what's next.
3. **`docs/ADDING_A_SUBJECT.md`** — if the task is "add subject X" or "add module Y to
   subject X", this is the authoritative checklist, follow it in order.
4. **`docs/decisions.md`** — past architecture calls, don't re-litigate them.
5. **`.claude/skills/<subject>-content/SKILL.md`** — verified domain facts for whichever
   subject you're touching (algorithm specifics, exam data) — load before implementing,
   not after.
   Hiện có: `ctrr-content`, `xstk-content`, `ctdl-content` (CTDL còn kèm `reference/exam-bank.md` — toàn bộ đề
   + đáp án — và `reference/solutions/*.cpp` — code C++ đã biên dịch/kiểm chứng; dùng chúng để giải/ôn đề CTDL).
6. **`graphify-out/graph.json`** (if present — see Graphify section) instead of re-reading
   every file in `src/`.
7. **Only then** read actual source files, and only the ones you're about to change.

## Two-layer architecture: shared vs. per-subject

```
src/engine/types.ts          <- SHARED types every subject's engine functions return
src/components/              <- SHARED UI (GraphCanvas, StepPlayer...) - cross-subject
src/routes/                  <- SHARED shell (Home, SubjectHome, ComingSoon)
src/subjects/
  registry.ts                <- the ONE file listing every subject (add 1 import + 1 line here)
  types.ts                   <- SubjectDef / ModuleDef contracts
  ctrr/
    subject.tsx              <- declares CTRR's module list, wires each to a component
    engine/<algo>.ts          <- CTRR-only pure algorithm functions
    modules/<algo>/*.tsx      <- CTRR-only React pages (engine + canvas + StepPlayer)
    data/*.ts                 <- CTRR-only exam data
  <next-subject>/
    ...same shape...
```

**Rule:** a file under `subjects/<id>/` may import from `src/engine`, `src/components`,
`src/routes`, `src/subjects/types` — never from another `subjects/<other-id>/`. Anything
two subjects both need belongs in the shared layers, not copy-pasted, not imported cross-
subject.

Every algorithm module (regardless of subject) is split into:

- **`engine/<algo>.ts`** — pure function, zero React/DOM, returns
  `{ steps: AlgoStep[], summary }` (`src/engine/types.ts`). Unit-testable standalone.
- **`modules/<algo>/<Algo>Module.tsx`** — thin component: `useMemo` the engine call once,
  own `index`/`playing` state, render a canvas (`GraphCanvas` or a new one, see below) +
  `<StepPlayer>`. No algorithm logic here.

`src/subjects/ctrr/engine/dijkstra.ts` + `.../modules/dijkstra/DijkstraModule.tsx` is the
reference implementation. Copy its shape for any new algorithm, in any subject.

## Adding a subject vs. adding a module

- **New subject** (material for a different course arrives): follow
  `docs/ADDING_A_SUBJECT.md` top to bottom. The only files outside `subjects/<id>/` that
  should change are `src/subjects/registry.ts` (+1 import, +1 array entry) and, if the
  subject needs a display format `GraphCanvas` can't do (tables, matrices, distributions),
  a new shared canvas under `src/components/`.
- **New module in an existing subject** (e.g. filling in CTRR's Karnaugh module): only
  touch `src/subjects/ctrr/**` and, if truly reusable, shared canvas/engine types.
  `App.tsx`, `Home.tsx`, `registry.ts` never need to change for this.

## Data

Exam data lives per-subject in `src/subjects/<id>/data/*.ts`. CTRR's two real exam graphs
(HK1 2022-2023, 2023-2024, Câu 3) are transcribed from the written guide with hand-placed
`positions` matching the original sketch — don't force-layout with physics, it makes the
graph unrecognizable to a student checking it against their exam paper.

## Conventions

- UI copy in Vietnamese, matching each subject's own written-guide terminology (for CTRR:
  `Ghi vào bài làm`, `Hiểu đơn giản`, `Mẹo nhớ`, etc. — reuse exact terms).
- Tailwind only, no CSS modules/styled-components.
- Path alias `@/*` -> `src/*`.
- A module counts as "done" once it has a real engine function + at least one real exam
  data point wired in — a module with only mock/placeholder data is a stub, keep it on
  `ComingSoon` until then (see `subjects/ctrr/subject.tsx` for the pattern).

## Session log convention (lightweight, no Obsidian required)

- `/save` (manual convention): append a dated 3-5 line entry to `docs/progress.md` — one
  running log for the whole repo, not one file per session.
- `/resume`: read the last 2-3 entries of `docs/progress.md` + `docs/decisions.md` first.
- If you keep a multi-project Obsidian vault elsewhere (see the
  `lucasrosati/claude-code-memory-setup` reference this repo's memory setup was adapted
  from), `docs/` can be symlinked into it — optional, not required to work in this repo.

## Graphify (optional, worth it once several subjects exist)

```bash
pip install graphifyy
graphify install --platform claude
graphify extract . --out ./graphify-out --no-cluster   # 0 LLM tokens, AST only
```

Re-run `graphify update .` after adding a subject/module. Not set up yet — revisit once
`src/subjects/` has 2-3 subjects filled in and re-orientation cost starts to matter.

## Do NOT

- Don't import across `subjects/<id>/` folders.
- Don't reimplement algorithm logic inside a `.tsx` file — it belongs in an `engine/` file.
- Don't hand-roll a second step-player or graph canvas per subject — extend the shared
  one with a new prop instead.
- Don't invent exam data — every example must trace back to a real problem in that
  subject's source material, or be explicitly marked as a teaching-only example.
- Don't hard-code subject/module lists in `App.tsx`/`Home.tsx` — they must always read
  from `src/subjects/registry.ts`.
