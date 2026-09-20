# Decisions log

Atomic records of "why", so nobody re-litigates a settled call. Newest first.
One entry per decision, not per session — see `docs/progress.md` for session-by-session notes.

---

## 2026-09-15 (4) — XSTK Giai đoạn 2 complete: standard z via a real inverse-CDF, Student-t via table-lookup input, not computed

Implemented the 7 remaining modules (`ci-known-sigma`, `ci-sample-proportion`,
`hypothesis-proportion`, `t-distribution`, `regression`, `joint-discrete`,
`joint-continuous`), completing all 10 XSTK dạng. Two math-tooling decisions worth
recording since they look superficially similar to earlier ones but are opposite calls:

1. **Standard z-critical values (1.96, 2.326, 2.576, 1.645) ARE computed via a real
   inverse normal CDF** (`engine/normalQuantile.ts`, Acklam's rational approximation),
   unlike `normalDistribution.ts`'s back-derived exam-specific thresholds. The
   distinction: those earlier thresholds (2887.15, 3342...) are exam-ANSWER figures
   that the source computed via a coarser table-lookup method, so a precise continuous
   inverse CDF disagrees with them by ~0.1 unit. Here, z_{0.025}=1.96 etc. are
   themselves textbook constants that a continuous inverse normal reproduces exactly —
   confirmed numerically before writing any engine code (standardNormalQuantile(0.975)
   = 1.959963986...). There's no "exam table rounding" to diverge from because these
   values ARE what a real inverse CDF outputs.

2. **Student-t critical values (t_{0.025,14}=2.145, t_{0.05,14}=1.761) are NOT
   computed** — `TTestSpec.tCriticalForCI`/`tCriticalForTest` are plain data fields,
   filled from the source's own table lookup. Reason: unlike the continuous z-table,
   real t-tables are inherently discrete-by-df, so "look up the table value for this
   df" IS the correct real-world method (not an approximation of some better
   continuous answer) — implementing a continuous t-quantile function here would be
   solving a problem nobody has, since every consumer of this module only ever has
   one fixed df per problem.

`GroupedProportionSpec` (module 5) computes x̄/S from raw frequency bins via weighted
mean/variance (verified via a standalone Node script to match the source's
172.5157895/6.076666142 and 174.2421053/5.95358616 exactly) and derives the
proportion's success count mechanically (sum frequency where midpoint ≥ threshold) —
confirmed this reproduces both real exams' stated numerators (42/380, 33/380) exactly,
so no hardcoded "verified success count" field was needed.

`JointContinuousSpec` (module 10) reuses the "nested 1-D Simpson's rule" pattern for a
2-D double integral over a fixed rectangle — deliberately NOT generalized to
variable/non-rectangular integration bounds, since the one real example
(`f(x,y)=c(2x+y)` on `[0,1]×[0,2]`) is rectangular and no other exam gives joint-
continuous content; a general bounded-region integrator would be speculative
generality for a single consumer.

All 7 new modules follow the exact `bayes`/`continuous-density`/`normal-distribution`
shape from the prior round unchanged: `ExamplePicker → StepPlayer → TipCallout? →
CalculatorTip → AnswerKeyPanel`, zero canvas, zero new shared UI components needed.

## 2026-09-15 (3) — XSTK drops canvas/animation entirely, replaced with text-based "step + tip + calculator + answer key"

User explicitly asked to stop drawing canvas visuals for XSTK and instead show a
step-by-step solve with tips, calculator instructions, and an exam-answer-key-style
"ghi vào bài làm" block, using a handwritten answer sheet (`docs/xstk/Dap an.jpg`) as
the FORMAT reference (not as new exam content — its own problems, e.g. a Binomial
question and a 2-event Bayes question, don't match any of the 3 implemented modules'
data models and weren't added). Confirmed via `AskUserQuestion` that this applies to
the whole XSTK subject, including the 7 not-yet-built modules, not just the 3 done so
far. Deleted all 5 canvas components written in the previous 2 rounds
(`ProbabilityTreeCanvas`, `AreaUnderCurveCanvas`, `DensityCurveCanvas`,
`NormalCurveCanvas`, `NumberLineCanvas`, `ScatterRegressionCanvas`) along with the
now-dead canvas-facing `DensitySpec` type — none had a second consumer, so keeping them
"just in case" would only be speculative dead code. The planned `JointTableCanvas` for
`joint-discrete` was also dropped from the plan before ever being written.

This is a deliberate, XSTK-only exception to CLAUDE.md's general "every algorithm
module owns a canvas" pattern — CTRR keeps its canvases unchanged, and any future
subject defaults to the canvas pattern unless it explicitly diverges the same way.
Reasoning: XSTK's problems (probability trees expressed as formulas, density/normal
curves solved via calculus, number-line test statistics) are exam-answer artifacts a
Vietnamese student is trained to write as formulas on paper, not shapes a student
draws — an animated diagram doesn't match how this content is actually graded or
studied, unlike CTRR's graph-theory content where the diagram IS the content.

Replaced with 2 new shared components (`src/components/ui/`): `TipCallout` (renders
one optional `tip: string` — not every source example has a "Mẹo" line, e.g. CITD
Đề2's normal-distribution question has none, so the field is optional and the callout
simply doesn't render rather than inventing a tip) and `AnswerKeyPanel` (renders an
`AnswerKeySpec` — title/totalPoints/setup lines/labeled a-b-c parts, each line with an
optional `points` badge). Per-line `points` values are deliberately NOT populated for
any of the 4 CITD/UICD/UICD/UICD examples even though the Dap an.jpg reference shows
per-line scoring — the source guides only ever give a whole-Câu point total (e.g.
"Câu 1 (2đ)"), never a per-part breakdown, so inventing per-line splits to visually
match the reference image would violate CLAUDE.md's "don't invent exam data" rule.
`totalPoints` (verified, whole-câu) is populated; per-line `points` stays undefined
until a source ever actually gives that granularity.

Each of the 3 built modules (`bayes`, `continuous-density`, `normal-distribution`) now
renders, in order: `ExamplePicker` → `StepPlayer` (unchanged, still the step-by-step
narration — just no longer paired with a canvas) → `TipCallout` (if present) →
`CalculatorTip` (unchanged) → `AnswerKeyPanel`. The 3 engine files
(`bayes.ts`/`continuousDensity.ts`/`normalDistribution.ts`) needed ZERO changes — they
already produced the `AlgoStep` sequence `StepPlayer` needs; only the module's JSX and
the data files (added `tip`/`answerKey` fields) changed.

## 2026-09-15 (2) — XSTK re-scoped from 7 to 10 dạng bài after reading the actual source markdown

The first XSTK pass worked from numbers given directly in the prompt (already
cross-checked, but the prompt's own 7-dạng list was a guess at the exam structure, not
a transcription). This round read the actual `docs/xstk/files/*.md` transcripts (5
files, including a newly-added 6th exam `ck_xstk_hk2_2023_2024.md` from a different
semester) directly, and found: (a) a guessed 8th dạng "biến ngẫu nhiên rời rạc/nhị
thức" doesn't appear in any of the 5 files — removed; (b) the CK HK2 exam introduces 2
entirely new dạng not seen before (phân phối đồng thời rời rạc/liên tục) and a 3rd
variant of an existing dạng (Student-t instead of Z, when σ is unknown and n is small).
Net: 10 dạng bài, renumbered 1-10 with no gaps. `subject.tsx`'s old `binomial`/
`confidence-interval`/`hypothesis-test` ComingSoon ids were replaced with the more
specific `ci-known-sigma`/`ci-sample-proportion`/`hypothesis-proportion`/
`t-distribution` — safe to rename since none of these were ever real routes anyone
linked to (ComingSoon placeholders only, no backward-compat concern this early).

## 2026-09-15 (2) — `NormalSpec` redesigned as a list of `NormalQuery` (4 modes), not 2 fixed fields

The first pass's `NormalSpec` had exactly 2 hardcoded fields (`threshold`/
`belowThresholdPercent` for the forward direction, `targetPercent`/`targetThreshold`
for the reverse). Reading the actual UICD exams broke that assumption: UICD asks
P(X>ngưỡng) (right-tail, not left) and "ngưỡng của nhóm k% cao nhất" (inverse-topk,
which requires the extra mental step of converting to a left-tail area = 1-k% before
solving) — 2 modes the CITD-only design never anticipated. Replaced with
`NormalQuery{mode, label, input, verifiedThreshold?}` and `NormalSpec.queries:
NormalQuery[]`, covering `cdf-left`/`cdf-right`/`inverse-left`/`inverse-topk` through
one `runNormalDistribution` loop instead of hardcoded a/b logic. The back-derive-z-from
-verified-threshold approach (see the entry below) extends unchanged to all 3 verified-
threshold-carrying inverse-* examples, not just CITD's 2.

## 2026-09-15 (2) — `ContinuousDensitySpec` solves K by exploiting linearity, not per-degree algebra

The `continuous-density` module's 4 real examples turned out to need K in two
structurally different ways: CITD's `K(x³/4+x+1/6)` (K multiplies the whole
expression) vs. UICD Đề1's `K - x/450` (K is only an additive constant term). A
per-example symbolic solve for K would need different code for each shape. Instead,
`ContinuousDensitySpec.fn(x, k)` is required to be **linear in k** (true for every
density-normalization problem, since ∫f dx=1 is always one linear equation in the
unknown scalar) — `runContinuousDensity` computes the definite integral at k=0 and k=1
via Simpson's rule, and solves the resulting linear equation for k. Works identically
for both shapes without branching on polynomial degree or term structure.

## 2026-09-15 (2) — `CalculatorTip` content lives in each data file, not in `engine/types.ts`

Every XSTK module must show at least one "cách bấm máy Casio" block (a content
requirement from the source guides, not decoration). This is presentation text, not
algorithm semantics, so `CalculatorTipData {menu, steps}` is exported from the
`CalculatorTip` component itself (`src/components/ui/CalculatorTip.tsx`) rather than
added to `src/engine/types.ts` — keeps `engine/types.ts` scoped to what an `AlgoStep`
sequence needs to render/animate, not to narration content that never touches the
step/highlight machinery.

## 2026-09-15 (1) — `GraphPicker` generalized into `ExamplePicker`

XSTK's `bayes`/`normal-distribution` modules need the same "pick one of a few worked
examples" button row as CTRR's `GraphPicker`, but their examples carry a `BayesSpec`/
`NormalSpec`, not a `GraphSpec` — forcing them through `GraphPicker`'s `GraphOption` type
would mean either lying about the shape or duplicating the whole component. Extracted
the actual button-row rendering into a new subject-agnostic `src/components/ui/
ExamplePicker.tsx` (`{id, label}` options only); `GraphPicker.tsx` is now a thin wrapper
around it that keeps its own `GraphOption` type (`graph`/`defaultSource` fields) for
CTRR's existing imports — zero changes needed in any `subjects/ctrr/**` file.

## 2026-09-15 (1) — XSTK Normal distribution: back-derive the reverse-direction z from the verified answer key, don't compute it

`runNormalDistribution`'s forward direction (given ngưỡng X, find %) computes Z and Φ(Z)
with a real Abramowitz–Stegun standard-normal-CDF approximation, and matches the answer
key exactly for both real exams (z=-2 in both, Φ(-2)≈2.275%). The reverse direction
(given a target %, find a new ngưỡng T) does NOT use a computed inverse-normal function —
it back-derives z2 = (targetThreshold-μ)/σ from the exam's own verified T. Reason: the
exam's answer key was computed via a Laplace-function lookup table with linear
interpolation (coarser than a continuous inverse-normal calculation), so a "real" inverse
CDF reproduces T off by ~0.1 unit (e.g. 2887.26 instead of the verified 2887.15) even
though the underlying z differs by <0.001. Back-deriving keeps the displayed T byte-exact
to the answer key (the acceptance criterion) while staying mathematically honest — z2 is
a real number satisfying μ+z2·σ=T exactly, not an invented shortcut. If a future module
needs a genuine forward inverse-normal (e.g. `confidenceInterval.ts`'s z_α lookup), it'll
need its own inverse-CDF implementation; this decision only covers the "we already know
the verified answer, derive z from it" case.

## 2026-09-15 (1) — XSTK shared canvases: 5 new components under `src/components/`, none in `subjects/xstk/`

CTRR's `GraphCanvas` only draws node/edge graphs; none of XSTK's 7 problem shapes are
graphs. Added 5 new shared canvases instead of subject-scoped ones, since a future
subject (any other probability/stats course) could need the exact same shapes: probability
trees (`tree/ProbabilityTreeCanvas.tsx`), density curves (`curve/DensityCurveCanvas.tsx`),
normal curves (`curve/NormalCurveCanvas.tsx`), number lines (`numberline/
NumberLineCanvas.tsx`, shared by confidence-interval AND hypothesis-test — they're the
same "shade a region on a line" shape), and scatter+regression (`scatter/
ScatterRegressionCanvas.tsx`). `DensityCurveCanvas` and `NormalCurveCanvas` both delegate
their sampling/area-fill logic to one shared `curve/AreaUnderCurveCanvas.tsx` rather than
each reimplementing it. Every canvas still takes a `step: AlgoStep` prop like
`GraphCanvas` does, reading highlight/shading data off `AlgoStep`'s existing generic
fields (`nodeHighlights`/`edgeHighlights` for the tree; ad hoc string keys in
`tableSnapshot`, e.g. `z`/`shade`/`a`/`b`/`intervalFrom`, for the curve/line/scatter
canvases) instead of adding new step-schema fields — keeps every module on the exact
same `StepPlayer`, no second playback implementation.

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
