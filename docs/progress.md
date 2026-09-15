# Progress log

Append-only. One entry per work session (`/save` convention from `CLAUDE.md`), newest first.
Keep each entry to ~3-5 lines — this is a pointer for `/resume`, not a full changelog.

---

## 2026-09-14 (6) — `graphMinhHoa` redesigned again: fully distinct labels/weights

- The previous session's `graphMinhHoa` (real exam `graph20232024` + 1 extra edge)
  fixed the "looks like a polygon" problem but introduced a new one: it reused the exam's
  own vertex labels (A-J) and 19 of its 20 edges/weights, so a student could easily
  mistake the illustrative graph for the real exam graph. Replaced entirely with a
  10-vertex graph using distinct labels (P,Q,R,S,T,U,V,W,X,Y) and entirely distinct
  weights — only the grid LAYOUT SHAPE (2 vertices top, 4 middle, 4 bottom) is shared,
  which is what gives it exam-like visual complexity without exam-like content.
- Independently re-verified all 4 claimed results against this repo's own engines before
  trusting the task's numbers (same discipline as every prior graph swap): degrees
  P=4,Q=4,R=4,S=4,T=3,U=6,V=5,W=2,X=4,Y=4 (exactly T,V odd, confirmed by direct
  computation); Euler now returns a genuine T↔V path using all 20 edges once; Hamilton
  finds a valid 10-vertex cycle; Dijkstra from T and the max spanning tree (144, a total
  deliberately different from both real exams' 95/93) match the task's numbers exactly.
- `graphOptions.ts`'s "minh-hoa" entry: `defaultSource` updated from "E" (leftover from
  the graph20232024-based design) to "T" (this graph's own source), and the picker label
  now reads "Ví dụ minh họa (đồ thị P-Y, không phải đề thi thật)" so the display text
  itself signals it's not exam data.
- Confirmed live in browser: all 4 modules' SVG shows only P-Y labels (no A-J leaking
  in), all 4 results match. `tsc -b --noEmit` clean, `npm run build` succeeds, no
  console errors.
- Updated SKILL.md's "Đồ thị minh họa" section with the new numbers and an explicit
  "if you see A-J here, that's a bug" note for future sessions.

## 2026-09-14 (5) — `graphMinhHoa` redesigned: minimal diff from `graph20232024`, not a polygon

- Replaced the circulant/10-gon `graphMinhHoa` from the previous session — it worked
  correctly but looked nothing like a hand-drawn exam graph. New version: `graph20232024`
  (all 19 edges, all weights, same grid layout) plus exactly 1 edge, A-F weight 7 — that
  single edge flips the degree sequence from 4-odd-vertices (no Euler) to exactly 2-odd
  (E, G → has an Euler path), without touching anything else.
- `data/graphs.ts` now builds it as `{ ...graph20232024, edges: [...graph20232024.edges,
  { id: "AF", ... }] }` — literally the real exam plus one edge, not a rewrite.
- Re-verified everything against the actual engines before trusting the task's numbers
  (same discipline as every prior graph addition this project): degrees now A=4,B=4,C=4,
  D=4,E=3,F=6,G=5,H=2,I=4,J=4 (exactly E,G odd, confirmed by direct computation, not
  just trusting the prompt); Euler now returns a path E↔G using all 20 edges once;
  Hamilton/Dijkstra/spanning-tree are UNCHANGED from `graph20232024`'s own real-exam
  results (Dijkstra from E matches exactly, max spanning tree total 95 with AF correctly
  excluded as too light).
- Caught and fixed a real bug while re-verifying live: `graphOptions.ts`'s "minh-hoa"
  entry still had `defaultSource: "A"` left over from the old circulant design (where A
  was a reasonable source) — now that `graphMinhHoa` is `graph20232024`-based, Dijkstra
  needs to start from E (that exam's real source) to match the verified table. Fixed and
  re-confirmed live in the browser.
- Confirmed via the rendered DOM (not just eyeballing) that node positions match
  `graph20232024`'s exact grid coordinates (E,F top / A,B,G,H middle / C,D,J,I bottom) —
  no polygon shape remains.
- Updated SKILL.md's "Đồ thị minh họa" section to replace the old circulant-graph
  numbers with these new ones.
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds; all 4 modules driven live
  in browser after the fix, no console errors.

## 2026-09-14 (4) — Added `graphMinhHoa` illustrative graph across all 4 Câu 3 modules

- Both real exam graphs have exactly 4 odd-degree vertices, so no module could ever
  actually animate Fleury on real data — `graphMinhHoa` (a 10-vertex circulant graph:
  each vertex connects to its neighbors 1 AND 2 steps away around a 10-cycle → every
  vertex degree 4/even → has an Euler circuit, and the distance-1 sub-cycle is a
  ready-made Hamilton cycle) fills that gap. Added to `data/graphs.ts`, clearly commented
  as not-a-real-exam.
- Independently re-verified all 4 claimed results against this repo's own engines
  before wiring anything in (not just trusting the provided numbers): Euler has a
  circuit (found a valid 20-edge trail, though a different one than the example given —
  both are valid since Euler graphs generally have many valid trails), Hamilton has a
  cycle (again a different-but-valid one than the example), Dijkstra from A matches
  exactly (A=0, I=13, G=16, C=17, B=19, H=20, J=20, D=22, E=24, F=26), and the max
  spanning tree matches exactly (145, same 9-edge set).
- The 4 Câu 3 modules (`euler`/`hamilton`/`dijkstra`/`spanning-tree`) each had their own
  duplicated inline `GRAPH_OPTIONS` array — consolidated into
  `src/subjects/ctrr/graphOptions.ts` (`CTRR_GRAPH_OPTIONS`), fixed order across all 4
  (2022-2023, 2023-2024, ví dụ minh họa), each module still picks its own default via
  its own `useState` rather than relying on array order.
- Deleted `data/eulerExample.ts` (the old "bowtie" teaching graph, 5 vertices) — replaced
  by `graphMinhHoa` everywhere so there's only one illustrative-graph story, not two.
  `EulerModule.tsx` now defaults to `graphMinhHoa` specifically (it's the only module
  where the real exams never show the algorithm's main content); the other 3 modules
  keep defaulting to a real exam, per the task's explicit instruction.
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds; all 4 modules driven live
  in browser — picker shows all 3 options in the same order everywhere, results match,
  no console errors.
- Added a "Đồ thị minh họa" section to SKILL.md with all 4 verified results, so this
  doesn't need re-deriving (or re-running networkx) later.

## 2026-09-14 (3) — Spanning-tree module (Câu 3d) implemented — CTRR now 8/8 complete

- `engine/kruskalMax.ts`: `buildUnionFind` (path compression, though unnecessary at
  10 vertices — just for clarity), `maxSpanningTree` (pure result), `runKruskalMax`
  (step generator). Sort descending ("Kruskal đảo dấu"), one step per edge examined
  (chosen → "path", rejected → "rejected", explanation says which case and why), and
  the step generator stops the INSTANT n-1 edges are chosen — never animates edges past
  that point, matching the guide's own "Bước 4: dừng lại" instruction literally.
- Verified against SKILL.md's totals (95 for 2023-2024, 93 for 2022-2023) AND the full
  9-edge sets for both — not just the totals — via a standalone script; both match
  exactly. Also confirmed step count stops early: 11 steps for 2023-2024 (not 19+2),
  13 for 2022-2023 (not 18+2), i.e. the algorithm skips animating edges it never had to
  examine once the tree was already complete.
- `SpanningTreeModule.tsx` follows the now-established `GraphPicker` pattern (same shape
  as `DijkstraModule.tsx`/`EulerModule.tsx`/`HamiltonModule.tsx`), plus a static
  descending-edge-list text block next to the canvas so the sort order doesn't have to be
  memorized while watching the animation.
- This was the last of the 8 CTRR modules — updated `docs/PLAN.md`'s top status line to
  "✅ Hoàn thành (8/8 module)" and replaced the module-by-module "Việc kế tiếp" list with
  a short maintenance-only note (no new modules planned unless a new exam arrives).
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds; both exams driven live in
  browser, no console errors.
- Next: nothing planned for CTRR. Either a new exam's data lands (see SKILL.md's
  "extending to a new exam graph"), or work moves to Môn 2 once its material arrives.

## 2026-09-14 (2) — Dijkstra module finished (GraphPicker added, source bug fixed)

- `DijkstraModule.tsx` was hard-coded to `graph20232024` + source "E" — `graph20222023`
  (source "H", per the exam) existed in `data/graphs.ts` but was never wired into any UI.
- Neither Euler nor Hamilton had a shared picker yet (each had its own inline button-row
  + local state), so this session created `src/components/ui/GraphPicker.tsx` — the
  first shared graph-picker component — and migrated all 3 modules to it rather than
  leaving 3 near-identical implementations lying around (small mechanical change, worth
  doing now instead of deferring).
- Verified `runDijkstra` against the guide's FULL L(v) tables (every vertex, not just
  the headline number) for both graphs — all values match exactly: 2023-2024 from E
  (fix order E,F,C,H,G,A,B,D,J,I; final labels 0,2,3,4,5,6,7,8,10,16) and 2022-2023 from
  H (fix order H,J,I,F,E,B,A,G,C,D; final labels 0,4,5,6,7,13,14,14,15,17). Added both
  full tables to SKILL.md since they weren't recorded anywhere before this.
- Verified switching graphs in the UI correctly re-runs Dijkstra with the right source
  (the `useMemo` dependency array bug the task warned about — forgetting to include the
  selected option — was avoided from the start, confirmed via live browser check).
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds; all 3 migrated modules
  (Dijkstra, Euler, Hamilton) driven live in browser after the `GraphPicker` swap, no
  console errors, no regressions.
- `CdnfModule.tsx`/`KarnaughModule.tsx` intentionally NOT migrated — they pick a
  `BooleanFunctionSpec`, not a `GraphSpec`, so `GraphPicker` doesn't apply there; this is
  not deferred work, just out of scope for this component.
- Next: `kruskalMax.ts` (Câu 3d, `spanning-tree`) — last remaining CTRR module, can use
  `GraphPicker` directly from the start.

## 2026-09-14 (1) — Hamilton module (Câu 3b) implemented

- `engine/hamilton.ts`: `applyHamiltonRules`/`runHamilton` implement the guide's 4
  practical rules (not generic backtracking) as repeated Rule-2/Rule-4 propagation to a
  fixed point (Rule 3 checked after every new forced edge — a forced-edge component
  where every vertex has forced-degree 2 is a closed loop; a violation if it's smaller
  than the whole graph), falling back to a simple guided DFS only for whatever the rules
  alone can't decide.
- Computed both real graphs' full degree sequences myself before implementing (not
  trusting a guess): 2023-2024 has exactly one degree-2 vertex (H); 2022-2023 has
  exactly one (D) — so Rule 2 only fires once per graph initially, and the bulk of each
  solve is genuinely the guided-search phase, matching what the instructions expected.
  Added both degree tables to SKILL.md so `kruskalMax.ts` (needs the same graphs) doesn't
  have to recompute them.
- Verified both real graphs produce a VALID Hamilton cycle (own validator: right length,
  no repeated vertex, every consecutive edge exists) — 2022-2023's engine output matches
  the guide's own cycle exactly; 2023-2024's differs from the guide's but is equally
  valid (the puzzle has multiple solutions, nothing in the 4 rules picks one).
- Confirmed via a direct step-title dump (not just the browser, which had a timing
  artifact from too-short waits between clicks) that Rules 1/2/3/4 all appear as
  genuinely distinct steps, never merged, and that Rule 3's early-subcycle rejection
  actually fires and triggers a real backtrack (A-B tried and rejected before A-C works).
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds; both exams driven live in
  browser, no console errors.
- Next: `kruskalMax.ts` (Câu 3d, `spanning-tree`) — last remaining CTRR module.

## 2026-09-13 (7) — Euler module (Câu 3a) implemented

- `engine/euler.ts`: `checkEuler` (undirected: circuit iff connected + all-even degree,
  path iff connected + exactly 2 odd; directed branch via `graph.directed` for
  completeness, not the focus since both real graphs are undirected), `findEulerTrail`
  (Fleury's algorithm — prefers non-bridge edges, only crosses a bridge when it's the
  only option left), `runEuler` (full step sequence: connectivity → per-vertex degree
  count → conclusion → Fleury reveal one edge at a time, if Euler exists).
- Verified both real exam graphs independently (not just trusting SKILL.md): 2022-2023
  has odd vertices {B,E,G,J}, 2023-2024 has odd vertices {A,E,F,G} — both exactly 4, both
  correctly conclude no circuit/path, matching SKILL.md exactly.
- Since neither real graph has Euler, added a teaching-only "bowtie" example
  (`data/eulerExample.ts` — 2 triangles sharing 1 vertex, not 1 edge — sharing an edge
  always makes the 2 shared endpoints odd, verified this by direct computation before
  picking the construction) to actually exercise Fleury. `findEulerTrail` on it returns a
  7-vertex trail using all 6 edges exactly once, confirmed via a standalone script.
- `EulerModule.tsx` follows the established 3-button exam-picker pattern (same shape as
  `CdnfModule.tsx`): 2 real exams + 1 teaching example.
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds; all 3 examples driven live
  in browser, no console errors.
- Next: `hamilton` (can copy `EulerModule.tsx`'s picker shape) or `kruskalMax.ts`.

## 2026-09-13 (6) — Extra illustrative examples added across all 3 Kiểu of Câu 2

- New `data/specialGraphs.ts`: the 5 named special graphs from the guide's Kiểu 2 "Mẹo
  nhớ" table (Kₙ, Cₙ, Wₙ, đều bậc k, Qₙ), concrete small instances (K₅, C₆, W₅, a
  3-regular triangular prism, Q₃) — verified programmatically that each one's actual
  |V|/degrees/|E| matches its formula exactly. Clearly flagged as illustrative, not exam
  data (the guide names the formulas but never draws concrete instances).
- Reused this one dataset across all 3 Kiểu, per the user's request to cover "đầy đủ dạng
  đồ thị" everywhere: Kiểu 1 gets a 3rd picker option running Havel–Hakimi on all 5
  degree sequences (all verified graphical); Kiểu 2 gets a 2nd button row showing each
  as a quick draw-then-verify-formula illustration (`engine/specialGraphIllustration.ts`);
  Kiểu 3 gets the wheel graph W₅ as a 3rd example.
- Along the way, found a real content gap: the guide's Kiểu 3 actually describes **2
  distinct proof techniques** — Định lý 1.2 (2 vertices share a degree) and hệ quả Định lý
  1.1 (odd-degree vertex count is always even). My original `pigeonholeDegree.ts` only
  implemented the first one, even applying it to the guide's own "handshake" example
  which canonically uses the second technique. Added `runOddDegreeCountProof` and a
  technique picker in the Kiểu 3 UI so both are selectable on any example — the wheel
  graph is a good non-trivial demonstration of the second (6 odd-degree vertices, not 0 or 2).
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds; all 5 special-graph degree
  sequences confirmed graphical via a standalone script; the odd-degree-count proof
  confirmed correct on the wheel graph (6 odd vertices); driven live in browser across
  all 3 Kiểu, no console errors.

## 2026-09-13 (5) — Kiểu 2 replaced with real exam data (HK1 2023-2024)

- User updated `Huong_dan_giai_de_cuoi_ky_CTRR.docx` to add a real worked example for
  Câu 2 Kiểu 2 (previously the guide only described the property list generically, with
  no concrete graph — see the (4) entry below). Re-extracted the docx and found: "Hãy
  phác họa đồ thị G có các tính chất sau: a) có hướng, không đầy đủ, liên thông mạnh,
  ≥4 đỉnh. b) đa đồ thị vô hướng, ≥5 đỉnh, không Euler nhưng có Hamilton."
- Replaced the invented `directedMultigraphNoEulerHasHamilton` example in
  `data/scriptedGraphBuild.ts` with 2 separate scripted examples matching the guide's own
  solutions exactly: `directedStronglyConnectedNotComplete` (ý a — 4-vertex directed
  cycle A→B→C→D→A) and `multigraphNoEulerHasHamilton` (ý b — 5-vertex cycle + 1 parallel
  A-B edge). These are two independent graphs, not one combined graph as I'd originally
  guessed when no real data existed yet.
- `GraphPropertiesModule`'s Kiểu 2 tab now has an a)/b) picker (same pattern as every
  other module's exam picker) instead of a single fixed example.
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds; both parts driven live in
  browser, reach the exact conclusions the guide states, no console errors.

## 2026-09-13 (4) — Graph-properties module (Câu 2) implemented, added to PLAN.md

- Câu 2 was missing from `docs/PLAN.md`'s original 7-module table entirely — added it as
  module 4 (`graph-properties`) before fixing anything else, per explicit instruction not
  to code first and register later.
- 3 genuinely different "kiểu" under one module (exactly how the guide presents them):
  **Kiểu 1** (`engine/degreeSequence.ts`) — general Havel–Hakimi + handshake-sum check,
  verified against all 3 guide examples: (1,2,3,4,5) odd-sum rejected, (1,2,3,4,4)
  even-sum but Havel–Hakimi still finds the contradiction at the degree-1 vertex, and
  (3,3,2,2,2) succeeds — its computed edge set is byte-for-byte the same graph the guide
  builds by hand ({A-B,A-C,A-D,B-C,B-E,D-E}), just discovered mechanically instead of by
  ad-hoc reasoning. **Kiểu 3** (`engine/pigeonholeDegree.ts`) — general Định lý 1.2 proof,
  runs on any graph, correctly finds a matching-degree pair on both illustrative examples
  in `data/pigeonholeExamples.ts` (clearly flagged as not-from-a-real-exam, since the
  guide's own 2 examples are abstract proofs with no concrete numbers). **Kiểu 2**
  (`data/scriptedGraphBuild.ts`) — deliberately NOT a general algorithm (creative
  construction problem, per the guide); one hand-written `AlgoResult` + per-step
  `GraphSpec` array building a directed multigraph satisfying the guide's named property
  set (strongly connected, no Euler circuit, has a Hamilton cycle).
- Extended `GraphSpec` with `directed?` (arrowheads, needed for Kiểu 2) and `labels?`
  (display text distinct from id, needed so Kiểu 1's cluster-prefixed ids like "0:A" show
  as just "A"); made `WeightedEdge.weight` optional so unweighted illustrative graphs
  don't show a fake "1" on every edge. All additive/backward-compatible — existing
  Dijkstra graph still renders identically (had to fix one `weight ?? 0` fallback there
  for the type change).
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds; driven in a real browser
  across all 3 kinds, no console errors; Havel–Hakimi and pigeonhole outputs additionally
  cross-checked with standalone node scripts against hand-derived expected results.
- Next: `euler`, `hamilton`, or `spanning-tree` (all graph modules, reuse `data/graphs.ts`).

## 2026-09-13 (3) — Circuit module (Câu 1c) implemented

- Added shared `CircuitLiteral`/`CircuitTerm`/`CircuitSpec` types (`engine/types.ts`).
  `engine/circuit.ts`'s `circuitSpecFromCover` bridges `karnaugh.ts`'s `PrimeImplicant[]`
  covers straight into a circuit spec, and `data/circuits.ts` asserts at module-load time
  that its hand-picked "Cách 1" formulas really are one of `findAllMinimalCovers`'s
  verified covers — a circuit can't silently drift from what Câu 1b actually produced.
- `runCircuit` emits one step per NOT gate and one per AND gate (never merged), then a
  4-layer signal-run phase (inputs → NOT → AND → OR) at a concrete f=1 combination.
- New shared canvas `components/circuit/CircuitCanvas.tsx` — went through two redesigns
  after user feedback while screenshotting: (1) the original per-AND-gate zigzag tap wires
  turned out to have a bug (`<motion.line>` missing `y2` defaults to 0, causing diagonal
  lines to the top of the canvas) and (2) the user supplied the guide's own reference
  circuit images, which showed a cleaner "full-height vertical bus per variable/complement,
  AND gates tap a single straight horizontal segment off whichever bus they need" layout —
  rebuilt around that (no bends at all now) and reordered steps so all 8 lines (4
  variables + 4 complements) are drawn together in step 1, before any gate, matching both
  the guide's own diagrams and the user's explicit request.
- Gate shapes verified visually distinct: AND = flat-left "D" shape, OR = concave-back
  shield with a sharp tip (not the same silhouette).
- Found and flagged a discrepancy: the guide's own prose for the 2023-2024 circuit claims
  "2 cổng 2-vào, 3 cổng 3-vào", but the verified formula (`xz ∨ y'z ∨ y't ∨ x'z't ∨ yz't'`,
  matching `karnaugh.ts`'s cover exactly) actually has 3 two-literal terms and 2
  three-literal terms — confirmed via direct docx extraction, not a transcription error on
  our side. Implemented the mathematically correct arities rather than forcing the wrong
  count; the 2022-2023 circuit's stated counts (4 NOT, 2×AND-2 + 2×AND-3) do match exactly.
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds; driven in a real browser for
  both exams, no console errors, gate counts/shapes confirmed visually correct.
- Next: `euler`, `hamilton`, or `spanning-tree` (all graph modules, reuse `data/graphs.ts`).

## 2026-09-13 (2) — Karnaugh module (Câu 1b) implemented

- `engine/karnaugh.ts`: generic Quine-McCluskey (`findPrimeImplicants`) over the bit-string
  minterms — no special-cased "wrap-around" logic needed in the algorithm itself, since
  Gray-code-adjacent K-map cells (first/last column or row included) always differ by
  exactly 1 bit, which is exactly QM's combining rule. `findAllIrredundantCovers` brute-
  forces every valid non-essential subset (cheap: only ever a handful of PIs for a
  4-variable function); `findAllMinimalCovers` filters that down to the smallest size(s).
- Verified against both real exams' Câu 1b answers term-for-term: 2022-2023 → 6 PIs
  (2 essential), exactly 3 minimal 4-cell covers; 2023-2024 → 7 PIs (3 essential), exactly
  3 minimal 5-cell covers — all matching sets confirmed via a standalone node script.
  Added both verified PI/cover tables to `.claude/skills/ctrr-content/SKILL.md`.
- Both real exams happen to have same-size covers only, so added one teaching-only
  function (`boolFnTeachingCoverSizes` in `data/booleanFunctions.ts`, clearly flagged as
  not from a real exam) whose 2 irredundant covers differ in size (3 vs. 4 cells) — this
  is what actually exercises the "discard the bigger cover" step end to end.
- New shared canvas `components/karnaugh/KarnaughGrid.tsx`: 4×4 Gray-code grid, prime-
  implicant group outlines animated with Framer Motion (grow from center), wrap-around
  groups drawn as multiple separate rectangle pieces instead of one — confirmed visually
  (`y't` in the 2022-2023 exam wraps columns `x'y'`/`xy'` and renders as 2 pieces).
- Added `GroupHighlight`/`groupHighlights` to the shared `AlgoStep` type (`engine/types.ts`)
  for multi-cell overlays — additive, doesn't touch GraphCanvas/StepPlayer.
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds; driven in a real browser
  across all 3 functions (both exams + teaching example), no console errors.
- Next: `circuit` (Câu 1c) — needs a new `CircuitCanvas`, not node/edge or grid-based.

## 2026-09-13 — CDNF module (Câu 1a) implemented

- Added shared `BooleanFunctionSpec` type (`engine/types.ts`); `data/booleanFunctions.ts`
  holds both real exams as f⁻¹(0) (2022-2023: 6 zeros → 10 terms, 2023-2024: 5 zeros →
  11 terms), deriving f⁻¹(1) by complementing against all 16 combos.
- `engine/cdnf.ts` emits the guide's exact 3-step procedure (list 16 → reject f⁻¹(0) →
  one step per f⁻¹(1) row read into a minterm); output cross-checked term-for-term
  against the guide's worked answers for both real exams — exact match.
- New shared canvas `components/table/TruthTableCanvas.tsx` (16-row grid, reuses
  `GraphCanvas`'s exported `NODE_COLOR` map instead of redefining highlight colors).
- `modules/cdnf/CdnfModule.tsx` follows the Dijkstra module's shape; adds a 2-button
  exam picker and a fade-in-per-term CDNF string built alongside the table.
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds, driven in a real browser
  (both exams, all steps) — no console errors.
- Next: `karnaugh` (can reuse `TruthTableCanvas`) or `engine/kruskalMax.ts`.

## 2026-09-12 (2) — Refactor to multi-subject architecture

- Renamed project `ctrr-visualizer` → `exam-visualizer`.
- Moved all CTRR-specific code into `src/subjects/ctrr/{engine,modules,data}` +
  `subject.tsx`; kept `engine/types.ts`, `components/`, `routes/` as the shared layer.
- Added `src/subjects/{types.ts,registry.ts}`, `src/routes/{Home,SubjectHome}.tsx`,
  rewrote `App.tsx` to derive nav/routing entirely from `registry.ts` (no hard-coded
  subject/module lists left in App/Home).
- Added `docs/ADDING_A_SUBJECT.md` — checklist for onboarding subject #2+.
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds, routes `/`, `/ctrr`,
  `/ctrr/dijkstra` all resolve correctly against the registry.
- Next: same as before the refactor — `engine/kruskalMax.ts` — plus, whenever the next
  subject's material arrives, follow `docs/ADDING_A_SUBJECT.md` from step 0.

## 2026-09-12 (1) — Initial scaffold + Dijkstra reference module

- Scaffolded Vite + React 19 + TS + Tailwind v4 + Framer Motion + React Router.
- Built `engine/types.ts` (shared step-based animation contract) and `engine/dijkstra.ts`
  (fully working, matches the guide's L(v)/S notation).
- Built `GraphCanvas` (animated SVG) + `StepPlayer` (playback controls), both shared/reusable.
- Wired `modules/dijkstra/DijkstraModule.tsx` end-to-end against the real HK1 2023-2024
  exam graph (`data/graphs.ts`) — this is the reference shape for the other 6 modules.
- Verified: `tsc -b --noEmit` clean, `npm run build` succeeds.
- Next: `engine/kruskalMax.ts` (see `docs/PLAN.md` → "Việc kế tiếp").
