---
name: ctrr-content
description: Use whenever implementing or reviewing an algorithm module (CDNF, Karnaugh, circuit, Euler, Hamilton, Dijkstra, spanning tree) in this repo. Packages the exact algorithm conventions, terminology, and worked exam data already validated in the written guide, so you don't re-derive or re-verify them from scratch.
---

# CTRR domain knowledge (from the written guide)

This skill exists so implementing `src/subjects/ctrr/engine/euler.ts`, `hamilton.ts`,
`kruskalMax.ts`, `karnaugh.ts`, `cdnf.ts`, `circuit.ts`, `degreeSequence.ts`,
`pigeonholeDegree.ts` doesn't require re-deriving the algorithms or re-reading the whole
`.docx` guide. Everything below is already verified (cross-checked with a Quine-McCluskey
script and `networkx` before being written into the guide) — treat it as ground truth,
don't "improve" the math without a reason.

This is a **subject-scoped** skill (CTRR only). Other subjects get their own
`.claude/skills/<subject>-content/SKILL.md` — see `docs/ADDING_A_SUBJECT.md`. Don't add
non-CTRR facts here.

## Terminology to reuse verbatim in UI copy

| Vietnamese term (guide) | Meaning | Use in |
|---|---|---|
| Ghi vào bài làm | The part a student must write on the exam paper | Highlight/callout style in every module's "answer" panel |
| Bước nháp | Scratch work, not required on the exam paper | CDNF dot-marking step, Karnaugh raw-1 step |
| Tế bào lớn | Prime implicant (Karnaugh) | karnaugh module |
| Tế bào lớn thiết yếu | Essential prime implicant | karnaugh module |
| Phủ tối thiểu | Irredundant cover (no wasted term) — NOT the same as "công thức tối tiểu" | karnaugh module — this distinction is the #1 point students lose marks on, animate it explicitly |
| Công thức tối tiểu | The actual minimal SOP (fewest terms among all irredundant covers) | karnaugh module |
| Nhãn L(v) / tập S | Dijkstra label / settled-set, matches the lecture's own notation | dijkstra module (already implemented this way) |

## Algorithm specifics that must match the guide exactly

- **Karnaugh (`Bước 1-6`)**: draw grid → mark dots for each CDNF term → find ALL prime
  implicants → mark essential ones → find irredundant cover(s) (there can be MULTIPLE,
  of DIFFERENT sizes) → **only keep the smallest** — this last comparison step is the
  one most guides skip and the one this project's guide added explicitly. The Karnaugh
  module's step list MUST include a step where two candidate covers of different sizes
  are shown side by side and the larger one is visibly discarded (not just picked
  correctly the first time) — that's the pedagogical point, not an implementation detail
  to simplify away. Implemented as a plain Quine-McCluskey search over the bit-string
  minterms (`src/subjects/ctrr/engine/karnaugh.ts`) — no separate "wrap-around" case is
  needed in the algorithm itself, because Gray-code-adjacent K-map cells (including the
  first/last column or row) always differ by exactly 1 bit, which is exactly QM's
  combining rule. Wrap only matters when *drawing* a group (`KarnaughGrid.tsx` splits a
  wrapping group into 2, or 4 for a corner group, separate rectangle pieces).

  Verified prime-implicant tables (Quine-McCluskey, cross-checked against
  `Huong_dan_giai_de_cuoi_ky_CTRR.docx` Câu 1b) — a new `karnaugh.ts` implementation
  disagreeing with these has a bug, not the other way around:
  - **HK1 2022-2023** (f⁻¹(1), 10 minterms): prime implicants `x'z` (essential),
    `y't` (essential), `xz't'`, `yz't'`, `x'yt'`, `xy'z'`. Exactly 3 minimal covers, all
    4 cells: {x'z, y't, xz't', x'yt'}, {x'z, y't, xz't', yz't'}, {x'z, y't, yz't', xy'z'}.
  - **HK1 2023-2024** (f⁻¹(1), 11 minterms): prime implicants `xz` (essential),
    `y'z` (essential), `y't` (essential), `x'yz'`, `x'z't`, `xyt'`, `yz't'`. Exactly 3
    minimal covers, all 5 cells: {xz, y'z, y't, x'z't, yz't'}, {xz, y'z, y't, x'yz', yz't'},
    {xz, y'z, y't, x'yz', xyt'}.
  - **Teaching-only example** (not a real exam — `boolFnTeachingCoverSizes` in
    `data/booleanFunctions.ts`), f⁻¹(1) = {0010, 0011, 0111, 1010, 1101, 1111}: exists
    solely because both real exams above happen to have same-size covers, so this is what
    exercises the "discard the bigger cover" step. Prime implicants `y'zt'` (essential),
    `xyt` (essential), `x'zt`, `x'y'z`, `yzt`. ONE 3-cell minimal cover {y'zt', xyt, x'zt};
    ONE discarded 4-cell irredundant cover {y'zt', xyt, x'y'z, yzt}.
- **Câu 2 (dãy bậc / tính chất đồ thị) — 3 KIỂU khác hẳn nhau, chỉ 1 kiểu xuất hiện mỗi đề**:
  - **Định lý 1.1 (bắt tay)**: trong mọi đồ thị vô hướng, tổng bậc = 2×số cạnh → LUÔN
    CHẴN. Hệ quả: số đỉnh bậc lẻ luôn chẵn. Tổng bậc chẵn chỉ là điều kiện CẦN, không ĐỦ.
  - **Kiểu 1** (thuần thuật toán — `degreeSequence.ts`): kiểm tra dãy bậc bằng Havel–Hakimi
    (sort giảm dần, nối đỉnh đầu với k đỉnh kế tiếp — k=bậc của nó, trừ 1 mỗi đỉnh đó, lặp
    lại; số âm bất kỳ lúc nào → không đồ thị hóa được). Ví dụ thật HK1 2022-2023 đã verify:
    (1,2,3,4,5) tổng=15 lẻ → không tồn tại. (1,2,3,4,4) tổng=14 chẵn nhưng vẫn KHÔNG tồn
    tại — Havel–Hakimi phát hiện mâu thuẫn đúng ở đỉnh bậc 1 (2 đỉnh bậc 4 buộc nối hết,
    kéo đỉnh bậc 1 lên bậc ≥2). Ví dụ minh họa thêm (không phải đề thật): (3,3,2,2,2) tổng=12
    chẵn, TỒN TẠI — Havel–Hakimi dựng ra đúng graph {A-B,A-C,A-D,B-C,B-E,D-E} y hệt guide.
    Ví dụ minh họa thêm thứ 2 (`data/degreeSequences.ts`'s `specialGraphSequences`): dãy
    bậc của cả 5 đồ thị đặc biệt bên dưới (K₅, C₆, W₅, đều bậc 3, Q₃) — Havel–Hakimi phải
    thành công trên cả 5 (chúng là đồ thị thật, dựng được), dùng làm test case bổ sung.
  - **Kiểu 2** (xây dựng sáng tạo, KHÔNG viết engine tổng quát — `data/scriptedGraphBuild.ts`
    chứa 2 `AlgoResult` viết tay, 1 cho mỗi ý). Định lý 1.9 (deg(u)+deg(v)≥n mọi cặp ⇒
    liên thông; hệ quả deg(v)≥n/2 mọi v ⇒ liên thông), Định lý 1.10 (đúng 2 đỉnh bậc lẻ ⇒
    2 đỉnh đó liên thông với nhau), Định lý 1.11 (lưỡng phân ⇔ mọi chu trình độ dài chẵn).
    Bảng đồ thị đặc biệt: Kₙ (đầy đủ, bậc n-1), Cₙ (vòng, bậc 2), Wₙ (bánh xe, vành bậc 3 +
    tâm bậc n), đều bậc k (n·k/2 cạnh), Qₙ (n-khối, 2ⁿ đỉnh bậc n). Ví dụ minh họa thêm cho
    cả 5 loại (`data/specialGraphs.ts`, KHÔNG phải đề thật — chỉ minh họa công thức trong
    bảng, chọn n nhỏ nhất dễ vẽ): K₅ (10 cạnh, bậc 4), C₆ (6 cạnh, bậc 2), W₅ (6 đỉnh, vành
    bậc 3 + tâm bậc 5, 10 cạnh), lăng trụ tam giác cho "đều bậc 3" (6 đỉnh, 9 cạnh), Q₃
    (khối lập phương, 8 đỉnh bậc 3, 12 cạnh — 2 đỉnh kề nhau ⇔ nhãn nhị phân lệch đúng 1
    bit). Verified: tất cả 5 dãy bậc đều Havel–Hakimi thành công (xem Kiểu 1 ở trên).

    **Ví dụ thật đã verify (HK1 2023-2024, Câu 2 Kiểu 2)** — "Hãy phác họa đồ thị G có các
    tính chất sau: a) Đồ thị có hướng, không đầy đủ, liên thông mạnh, có ít nhất 4 đỉnh.
    b) Đa đồ thị vô hướng, có ít nhất 5 đỉnh, không có chu trình Euler nhưng có chu trình
    Hamilton":
    - **Ý a**: 4 đỉnh A,B,C,D, đúng 1 chu trình có hướng A→B→C→D→A (4 cạnh). Có hướng ✓;
      liên thông mạnh ✓ (chu trình cho đường đi có hướng giữa mọi cặp đỉnh); không đầy đủ
      ✓ (4 cạnh, thiếu 8 so với 12 cạnh của đồ thị có hướng đầy đủ 4 đỉnh — vd không có
      A→C hay B→D).
    - **Ý b**: 5 đỉnh A,B,C,D,E xếp vòng A-B-C-D-E-A (chu trình đơn, mọi đỉnh bậc 2 —
      chính là 1 chu trình Hamilton có sẵn), rồi thêm 1 cạnh A-B thứ hai song song (đa đồ
      thị). deg(A)=deg(B)=3 (lẻ) → KHÔNG có chu trình Euler; chu trình Hamilton
      A→B→C→D→E→A vẫn giữ nguyên (dùng 1 trong 2 cạnh A-B). Mẹo dựng nhanh dạng "không
      Euler nhưng có Hamilton": bắt đầu từ 1 chu trình đơn n đỉnh (đã là Hamilton sẵn),
      rồi thêm 1 cạnh phụ (cạnh lặp nếu đa đồ thị, đường chéo nếu đơn đồ thị) vào ĐÚNG 2
      đỉnh để phá vỡ "mọi đỉnh bậc chẵn" mà không đụng tới các cạnh của vòng.
  - **Kiểu 3** (thuần thuật toán, nguyên lý Dirichlet — `pigeonholeDegree.ts`): guide mô tả
    **2 kỹ thuật chứng minh khác nhau** dưới cùng Kiểu 3, cả 2 đều đã implement:
    - **Định lý 1.2** (`runPigeonholeProof`) — mọi đơn đồ thị >1 đỉnh LUÔN có ≥2 đỉnh cùng
      bậc (n đỉnh chỉ có n-1 giá trị bậc khả dĩ, vì bậc 0 và bậc n-1 không cùng tồn tại).
      Định lý 1.3: nếu có ĐÚNG 2 đỉnh cùng bậc thì 2 đỉnh đó không đồng thời bậc 0 hoặc n-1.
      Dùng cho đề dạng "chứng minh tồn tại 2 đối tượng có cùng số lượng".
    - **Hệ quả Định lý 1.1** (`runOddDegreeCountProof`) — số đỉnh bậc LẺ trong bất kỳ đồ
      thị nào cũng luôn là một số CHẴN. Dùng cho đề dạng "chứng minh [số lượng nào đó] là
      một số chẵn" — đây chính là kỹ thuật guide's Ví dụ mẫu 2 (bắt tay) thực sự dùng,
      KHÔNG phải Định lý 1.2 (lưu ý: cả 2 kỹ thuật đều chạy được trên cùng 1 đồ thị, vì
      Định lý 1.2 luôn đúng với mọi đồ thị >1 đỉnh — nhưng chỉ 1 trong 2 là kỹ thuật guide
      thực sự minh họa cho từng ví dụ, đọc kỹ đề để chọn đúng).
    - Cách làm chung: mô hình hóa (đối tượng→đỉnh, quan hệ→cạnh), áp dụng đúng kỹ thuật.
    Guide's 2 ví dụ gốc là các phép chứng minh TRỪU TƯỢNG, không cho số liệu cụ thể —
    `data/pigeonholeExamples.ts`'s 2 đồ thị nhỏ (5-6 đỉnh, minh họa "cuộc họp quen biết" và
    "bắt tay") và `data/specialGraphs.ts`'s đồ thị bánh xe W₅ (6 đỉnh bậc lẻ — A,B,C,D,E
    bậc 3 + tâm O bậc 5 — minh họa hệ quả Định lý 1.1 không tầm thường) là ví dụ minh họa
    TỰ DỰNG, không phải số liệu đề.
- **Euler** (`engine/euler.ts`, implemented): undirected connected graph has an Euler
  circuit iff every vertex has even degree; has an Euler path (not circuit) iff exactly 2
  vertices have odd degree. Directed version (less likely needed here but the guide
  covers it, and `checkEuler` handles it via `graph.directed`): circuit iff strongly
  connected and deg⁺(v)=deg⁻(v) for all v; path iff weakly connected with exactly one
  vertex deg⁺=deg⁻+1, one deg⁺=deg⁻-1, rest equal. Both real exam graphs (2022-2023:
  odd vertices B,E,G,J; 2023-2024: odd vertices A,E,F,G) have exactly 4 odd-degree
  vertices → **no Euler circuit or path in either** — that's the correct, verified
  answer; don't "fix" the data to make Euler exist. Since neither real graph has Euler,
  Fleury's algorithm (`findEulerTrail`) is demoed on a teaching-only example instead
  (`data/eulerExample.ts`'s "bowtie" — 2 triangles sharing one vertex, 5 vertices/6
  edges, all even degree). Note: 2 cycles sharing one EDGE (a construction that sounds
  similar) always makes the 2 shared endpoints odd-degree (each cycle contributes 2,
  minus 1 for the shared edge = 3) — that does NOT satisfy "every vertex even", so the
  bowtie (sharing a VERTEX instead) is the correct minimal construction here.
- **Hamilton — 4 practical rules** (`engine/hamilton.ts`, implemented — from the
  lecture, this is the method to animate, not Ore/Dirac which are only sufficient
  conditions and rarely decide anything on a 10-vertex hand-drawn exam graph):
  1. Any vertex with degree ≤ 1 → no Hamilton cycle, stop.
  2. Any vertex with degree exactly 2 → both its edges are forced into the cycle.
  3. The cycle may never contain a smaller sub-cycle.
  4. Once a vertex has its 2 forced edges, delete its other incident edges (dead weight
     for the search).
  Animate exactly this elimination order, not a generic backtracking search — the point
  is to teach the rules, not just to show *a* valid cycle. Implemented as repeated
  Rule-2/Rule-4 propagation to a fixed point (checking Rule 3 after every new forced
  edge), falling back to a simple guided DFS — try forcing one undecided edge, backtrack
  via Rule 3 if it closes an early sub-cycle — only for whatever the rules alone can't
  decide (both real graphs only have ONE original degree-2 vertex each, so most of the
  work is this guided search, not the initial Rule 2/4 pass).

  **Degree sequences** (also the source of Rule 2's degree-2 vertex; same graphs as
  Euler above, so these numbers must match there too):
  - HK1 2023-2024: A=3, B=4, C=4, D=4, E=3, F=5, G=5, H=2, I=4, J=4 → only **H** is
    degree-2 (Rule 2 fires once, on H).
  - HK1 2022-2023: A=4, B=5, C=4, D=2, E=3, F=4, G=3, H=4, I=4, J=3 → only **D** is
    degree-2 (Rule 2 fires once, on D).

  **Verified valid Hamilton cycles** (guide's own answer, plus what this engine actually
  produces — different cycle, both equally valid, since the puzzle has multiple valid
  solutions and nothing in the rules picks one over another):
  - HK1 2023-2024 — guide: E→F→H→I→C→A→B→D→J→G→E. Engine:
    A→E→F→H→I→C→D→J→G→B→A.
  - HK1 2022-2023 — guide: A→D→B→E→F→I→J→H→G→C→A. Engine:
    A→D→B→E→F→I→J→H→G→C→A (matches the guide exactly here).
  A new implementation disagreeing with the DEGREE numbers above has a bug; disagreeing
  with the exact CYCLE is fine as long as `applyHamiltonRules`'s own validation (right
  length, no repeated vertex, every consecutive edge exists in `graph.edges`) passes.
- **Dijkstra**: already implemented (`src/subjects/ctrr/engine/dijkstra.ts`) exactly to spec — one
  step per "fix a vertex", label table snapshot each step, final path reconstructed via
  `prev[]`. Copy this file's shape for anything else that needs a step-by-step table.
  **Source vertex is fixed by the exam, not a free choice**: HK1 2023-2024 → source
  **E**; HK1 2022-2023 → source **H**. `DijkstraModule.tsx`'s `GraphOption.defaultSource`
  must match these when switching graphs.

  Verified final L(v) tables (cross-checked against the guide's own worked tables,
  which give the vertex-fix order too) — a new implementation disagreeing with these
  has a bug:
  - **HK1 2023-2024, from E**: fix order E,F,C,H,G,A,B,D,J,I. Final labels: E=0, F=2,
    C=3, H=4, G=5, A=6, B=7, D=8, J=10, I=16. Paths: E→F(2); E→C: E-F-C(3); E→H:
    E-F-H(4); E→G: E-F-G(5); E→A: E-F-C-A(6); E→B: E-F-G-B(7); E→D: E-F-G-B-D(8);
    E→J: E-F-G-B-D-J(10); E→I: E-F-H-I(16).
  - **HK1 2022-2023, from H**: fix order H,J,I,F,E,B,A,G,C,D. Final labels: H=0, J=4,
    I=5, F=6, E=7, B=13, A=14, G=14, C=15, D=17. Paths: H→J(4); H→I: H-J-I(5); H→F:
    H-J-I-F(6); H→E: H-E(7); H→B: H-E-B(13); H→A: H-J-I-F-A(14); H→G: H-E-B-G(14);
    H→C: H-E-B-C(15); H→D: H-E-B-D(17).
- **Max spanning tree** (`engine/kruskalMax.ts`, implemented): Kruskal with edges sorted
  **descending** by weight ("Kruskal đảo dấu" in the guide) — take an edge unless it
  closes a cycle (union-find), stop at n-1 edges (the step generator stops immediately
  too — never animates edges past the (n-1)th chosen one). Verified totals: 95 for the
  2023-2024 graph, 93 for the 2022-2023 graph — a new implementation disagreeing with
  these has a bug.
  - **HK1 2023-2024** verified tree (9 edges): FI(20), CI(15), HI(12), EG(10), JI(10),
    AE(9), GJ(8), CD(6), BJ(5) → total 95. (The guide's own prose lists these in a
    slightly different order — EG/JI before HI — but the achieved SET and total are what
    matters, not the exact prose order.)
  - **HK1 2022-2023** verified tree (9 edges): CI(20), GH(15), AC(12), AB(10), HI(10),
    EF(9), AF(8), FJ(5), DB(4) → total 93.

## Đồ thị minh họa (`graphMinhHoa` in `data/graphs.ts`) — NOT a real exam

Both real exam graphs have exactly 4 odd-degree vertices, so **neither has an Euler
circuit or path** — no module could ever actually animate Fleury on real data. This
graph exists purely to fill that gap and give `euler`/`hamilton`/`dijkstra`/
`spanning-tree` a shared third `GraphPicker` option (`CTRR_GRAPH_OPTIONS` in
`src/subjects/ctrr/graphOptions.ts`) with real algorithmic content on all 4 fronts.

**Vertex labels and weights do NOT overlap with either real exam — if you see letters
A-J or numbers matching a real exam's edges under "Ví dụ minh họa", that's a bug.** (3rd
design — the 1st used a circulant/polygon shape that looked nothing like a hand-drawn
exam graph; the 2nd reused `graph20232024`'s own vertex labels A-J and 19 of its 20
edges/weights, which turned out to risk students confusing the two graphs as the same
one. This version keeps only the grid LAYOUT SHAPE (2 vertices top row, 4 middle, 4
bottom) — same visual complexity as a real exam graph — with entirely distinct labels
and weights.)

10 vertices **P,Q,R,S,T,U,V,W,X,Y**, 20 edges, grid layout (T,U top / P,Q,V,W middle /
R,S,Y,X bottom). Degrees: P=4, Q=4, R=4, S=4, T=3, U=6, V=5, W=2, X=4, Y=4 — exactly 2
odd (T, V).

Verified against this repo's own engines (not just asserted) before wiring in — Euler/
Hamilton can legitimately return a *different* valid trail/cycle than any particular
hand-found one, but Dijkstra/spanning-tree have one deterministically-correct answer:
- **Euler**: exactly 2 odd vertices (T, V) → has a path (not a circuit), starting at one
  of them. `findEulerTrail` returns *a* valid 20-edge trail between T and V — not
  necessarily byte-identical to any specific hand-found one, any trail using all 20
  edges exactly once between those 2 endpoints is correct.
- **Hamilton**: one verified cycle is T→U→W→X→R→P→Q→S→Y→V→T (10 vertices).
  `applyHamiltonRules` may legitimately find a different valid cycle instead.
- **Dijkstra from T**: T=0, V=5, U=6, X=8, Y=8, Q=12, P=13, W=15, S=17, R=21.
- **Max spanning tree**: YX(20), RX(19), RU(18), WX(17), QS(16), SY(15), PT(14), PQ(13),
  SV(12) → total **144** (9 edges) — deliberately different from the real exams' 95/93
  totals, so a spanning-tree total matching either real exam here is also a bug.
- A new implementation disagreeing with the Dijkstra labels or the spanning-tree
  total/edge-set has a bug; disagreeing with the exact Euler trail or Hamilton cycle
  does not, as long as its own validity check passes (right endpoints/length, no
  repeated edge or vertex, every step a real edge).

## Verified exam data (do not regenerate/guess — copy from `src/subjects/ctrr/data/graphs.ts`)

Both real exam graphs, their degree sequences, Hamilton cycles, Dijkstra results, and
max spanning trees were computed with a Python (`networkx`) script and cross-checked
before being written into the guide. If a new engine implementation disagrees with the
numbers in `docs/PLAN.md` / the guide, the new code has a bug — the reference numbers
are not up for renegotiation without re-running that verification script.

## When extending to a new exam graph

If the user provides a new exam (new function or new graph image), transcribe it into
`src/subjects/ctrr/data/graphs.ts` / a new Boolean-function data file, but flag any edge/term read
from a hand-drawn image as "best-effort reading, please confirm" the same way the
written guide does — don't silently assume a misread edge is correct.
