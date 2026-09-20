# Decisions log

Atomic records of "why", so nobody re-litigates a settled call. Newest first.
One entry per decision, not per session — see `docs/progress.md` for session-by-session notes.

---

## 2026-09-21 — CTDL `mock-exams`: chuyển đề artifact bằng script thay vì gõ lại; đề thực hành thật KHÔNG chấm điểm; bằng chứng bộ đề đúng lấy từ engine

(1) 42 câu của artifact có nhiều HTML (`<b>`, `<code>`, `&lt;`, bảng phụ). Gõ lại tay = rủi ro sai chữ số/đáp án; nên trích trực tiếp dữ liệu (`EXAMS`) từ file artifact đã lưu, chuyển HTML → markup gọn (`**đậm**`, `` `code` ``) có kiểm "không còn thẻ lạ" trước khi giải mã thực thể,
rồi sinh file TS. Hiển thị bằng `RichText` (text node), không `dangerouslySetInnerHTML`. (2) Đề THI THỬ được giữ NGUYÊN cách chấm của artifact (rubric 3/4/3, mốc 7, điểm cộng comment I/O ngoài tổng 10) và gắn nhãn rõ "không phải đề thật".
Đề THỰC HÀNH thật (Test01/02/03, Đề mẫu Phần 2) KHÔNG chấm điểm vì PDF không cho điểm từng câu — bịa thang điểm sẽ là bịa dữ liệu đề (CLAUDE.md); thay vào đó: checklist tự đánh dấu, bảng phạt thật (−1/−3/0, thiếu comment −0.25), lối tắt sang module ôn và tên file lời giải.
(3) Vì đề thi thử do bên thứ ba dựng, độ tin cậy của đáp án được KIỂM bằng cách dùng các engine đã xác minh (chọn/chèn, nhị phân, Queue, bảng băm, Stack, BST, máy bộ nhớ) tính lại đáp án các câu điền và so với đáp án artifact — khớp hết; mỗi đề đúng 10 điểm là bất biến được test.
(4) Cả 3 đề luôn mount (chỉ ẩn bằng CSS) để đổi đề không mất bài; state chấm (tick rubric, đáp án đã kiểm tra) nằm ở `ExamPaper`, còn nháp/ô nhập nằm trong từng thẻ. Không lưu localStorage: mục đích là làm một lượt rồi xem kết quả; thêm khi có nhu cầu.

## 2026-09-20 (7) — CTDL `bst`: `TreeCanvas` riêng, layout theo thứ hạng trung tố; giữ hành vi "trùng thì bỏ qua" thay vì sao chép `add` của thầy

Cây cần layout khác hàng-cột của `PointerCanvas`. Chọn x = thứ hạng trung tố (mỗi node một cột riêng ⇒ không bao giờ chồng lấn, đọc trái→phải ra dãy tăng dần — chính mẹo "LNR luôn tăng"), y = độ sâu; vị trí snap giữa các bước
(cạnh phải khớp node). Không dùng thuật toán căn giữa cha-con (Reingold–Tilford): đẹp hơn cho cây cân nhưng vị trí cha nhảy khi con thêm vào, khó theo dõi từng bước; đề thi chỉ cây nhỏ (≤ 11 node).
Node mới cấp phát vẽ nét đứt cạnh cây (`pending`) cho tới khi nối — cùng quy ước với `HashTableCanvas`.
Về hành vi: `add` trong `demo_tree_v1.cpp` không có nhánh bằng (vòng lặp không thoát khi trùng), nhưng đề thực hành (Test01 Câu 1, LT005 Câu 4) yêu cầu trùng thì bỏ qua và trả false ⇒ engine theo ĐỀ, kiểm trùng TRƯỚC khi cấp phát
(khớp `bst_test01.cpp` đã kiểm chứng), và nêu khác biệt với code thầy trong tip/code chuẩn thay vì mô phỏng lại lỗi vô hạn. Duyệt đệ quy hiển thị theo thứ tự thăm (không vẽ call stack — không cần cho đáp án); duyệt LNR bằng `std::stack`
mới hiện stack vì đó là câu đề hỏi.

## 2026-09-20 (6) — CTDL `pointers`: máy bộ nhớ tính kết quả thay vì gõ tay từng ảnh chụp; không viết trình thông dịch C++

Dạng "đọc code ghi kết quả" cần vẽ stack/heap/con trỏ sau MỖI dòng, và đáp án (giá trị, NULL, lỗi runtime) phụ thuộc hành vi thật của C++. Ba lựa chọn: (a) gõ tay ảnh chụp từng dòng ×12 chương trình — dễ lệch với đáp án,
không tái dùng; (b) trình thông dịch C++ — quá lớn, đề chỉ dùng một tập rất nhỏ; (c) **máy bộ nhớ tối giản + mỗi dòng đề là vài lệnh của máy** (`declarePtr`, `assign`, `cout`, biểu thức vế trái dạng chuỗi C++). Chọn (c):
kết quả do máy tính nên ảnh chụp và đáp án không thể mâu thuẫn nhau, và `check.mjs` đối chiếu đáp án với kết quả C++ THẬT đã chạy (bắt lỗi ở người viết chương trình mẫu lẫn ở máy).
Máy cố ý KHÔNG hỗ trợ: số học con trỏ lưu vào biến (chỉ `*(a+K)`/`a[K]`), `delete`, hàm, vòng lặp — đề thật chưa dùng; thêm khi có đề cần. Số thực in theo `cout` mặc định (6 chữ số có nghĩa), không mô phỏng float 32-bit
(kết quả trong đề không phân biệt). Rò rỉ = đối tượng heap không còn với tới từ biến stack (tính lại mỗi bước, nên nét đứt đỏ xuất hiện đúng dòng `p = &a`). In con trỏ NULL hiển thị `NULL` (máy thật in 0/0x0 — ghi chú trong lời giải thích).
Lỗi runtime (`CrashError`) dừng chương trình; lỗi của CHƯƠNG TRÌNH MẪU (biến chưa khai báo, sai kiểu) là `Error` thường để không bị nuốt thành "đáp án lỗi runtime".

## 2026-09-20 (5) — CTDL: bảng băm dùng `HashTableCanvas` riêng thay vì mở rộng `PointerCanvas`

Bảng băm là N chuỗi song song có chỉ số bucket, trong khi `PointerCanvas` dành hàng 2 cho "node vừa cấp phát chưa nối" và đặt nhãn con trỏ trên/dưới theo hàng. Mở rộng (rowLabels, hàng nhỏ gọn, nhãn theo bucket)
sẽ làm quy ước của canvas cũ mơ hồ và phình props cho cả stack/queue/danh sách. Quyết định: canvas riêng, snapshot riêng (`HashSnapshot`: `buckets[i]` = chuỗi, `pending` = node nét đứt chưa nối, `labels` = pHead/pTail/p của bucket đang đổi),
dùng chung `NODE_COLOR`/`HighlightState`. Tô bucket bằng key `b{i}` trong `nodeHighlights` (không thêm field mới). Chỉ hiển thị nhãn con trỏ của bucket đang thao tác — 10 bucket × pHead/pTail sẽ chật hình.
Rejected: một `PointerCanvas` tổng quát với layout tùy biến (tốn hơn 2 canvas nhỏ), và vẽ bucket như mảng con trỏ trong `ArrayCanvas` (mất chuỗi nối kết — chính là nội dung "nối kết").

## 2026-09-20 (4) — CTDL: danh sách dùng `ListModel` với next/prev từng node; `prev` optional trên `PointerNode`; dangling cả ở `next`/`prev`

DSLK đôi buộc phải tách `pNext` và `pPre` thành các dòng lệnh riêng — chính chỗ đề hay hỏi ("quên 1 chiều"). Vì vậy engine danh sách không suy trạng thái từ một mảng thứ tự
(như stack/queue) mà giữ `next`/`prev` riêng từng node (`createListModel`); thứ tự hiển thị (`order`) tách khỏi liên kết, nên mọi trạng thái trung gian sai lệch đều vẽ được.
`prev` là field OPTIONAL: có ⇒ vẽ nút 3 ngăn, không ⇒ nút đơn — module cũ (stack/queue) không đổi. Rejected: một `PointerNode` luôn có `prev` (làm mọi hình đơn rối),
và type riêng cho DSLK đôi (hai canvas trùng logic). `next`/`prev` trỏ vào id đã `delete` được coi là hợp lệ và vẽ bằng stub đỏ "✗ freed" — đúng trạng thái giữa `delete l.pTail;` và
`prev->pNext = nullptr;`. Kiểm bằng mutation test tay (4 lỗi cố ý đều bị `check.mjs` bắt) vì test pass ngay lần đầu chưa chứng minh test có răng.

## 2026-09-20 (3) — CTDL: `PointerCanvas` dùng chung; engine chỉ định vị trí ô, canvas không tự layout; dangling là trạng thái hợp lệ

Stack/Queue (và sau này DSLK đơn/đôi, bucket bảng băm) cần vẽ node + con trỏ. Quyết định: 1 canvas chung `components/pointer/PointerCanvas.tsx` đọc
`AlgoStep.pointerSnapshot` = `{nodes:[{id,value,next,row,col}], pointers:{tên → id|null}}`.
(1) **Engine đặt `row/col`, canvas không tự layout**: cần thể hiện "node p đã cấp phát nhưng CHƯA nối" (hàng 2) — canvas tự suy chuỗi từ con trỏ sẽ không vẽ được trạng thái
trung gian đó, mà đây chính là điều đề thi hỏi (thứ tự 2 dòng push/enQueue). (2) **Con trỏ trỏ vào id không còn trong `nodes` = dangling**, vẽ bằng chip đỏ — biến "quên `pRear = NULL`"
từ lời cảnh báo thành hình ảnh thấy được; check.mjs khẳng định dangling chỉ xuất hiện đúng 1 bước. (3) Vị trí ô snap giữa các bước (chỉ fade node mới): mũi tên phải luôn khớp ô, tween sẽ làm
mũi tên và hộp lệch nhau giữa chừng. Rejected: tự layout theo con trỏ (mất trạng thái trung gian), thư viện đồ thị (thừa), canvas riêng trong `subjects/ctdl/`
(DSLK/bảng băm cùng dùng). BST sẽ cần layout cây riêng — không cố nhồi vào canvas hàng-cột này.

## 2026-09-20 (2) — CTDL: thêm `ArrayCanvas` dùng chung (khác quyết định "không canvas" của XSTK) và sinh "Ghi vào bài làm" từ `steps`

XSTK bỏ hết canvas (2026-09-15 đợt 3) vì đường cong/cây xác suất không giúp làm bài. Tìm kiếm/sắp xếp khác: **đáp án đề chính là bảng mảng
từng bước** ("Lần #k", cột L/R/M), nên vẽ mảng + con trỏ là nội dung, không phải trang trí → thêm `components/table/ArrayCanvas.tsx`
(đọc `AlgoStep.arraySnapshot` + `arrayMarkers`, tô ô bằng `nodeHighlights[String(i)]`, cùng `NODE_COLOR`). Hai field mới là optional trên
`AlgoStep` — module CTRR/XSTK không đổi. Rejected: một canvas riêng trong `subjects/ctdl/` (sau này Stack/Queue/hashtable/BST cùng cần hiển thị
cấu trúc; canvas dùng chung theo CLAUDE.md), và nhét mảng vào `tableSnapshot` (kiểu `string|number` không đủ và không có màu ô).
`AnswerKeyPanel` cho CTDL sinh từ `title` của từng step (`ctdl/answerKey.ts`) thay vì chép tay như XSTK: `title` đã đúng định dạng đề, một nguồn
sự thật không thể lệch với phần diễn giải; không điền điểm từng dòng vì PDF không cho.
Nhị phân/nội suy trên dãy chưa sắp xếp KHÔNG chạy tiếp mà trả 1 bước cảnh báo — dạy đúng điều kiện áp dụng (đề mẫu Câu 2) thay vì in ra
kết quả sai.

## 2026-09-20 — CTDL: kho kiến thức + code C++ kiểm chứng trước, module app sau (stub `ComingSoon`)

Môn CTDL khác 2 môn trước: đề là **lập trình C++** (đọc code, chạy tay, viết hàm), tài liệu là PDF scan + code của thầy.
Quyết định: (1) đóng gói vào skill + `reference/solutions/*.cpp` **biên dịch được, có assert** thay vì chỉ văn xuôi — đáp án
"đọc code ghi kết quả" phụ thuộc hành vi thật của C++ (in con trỏ NULL, `(*p)++`, `float` in `9.3555e+06`), nên chạy thật rẻ hơn tranh luận;
(2) đăng ký môn ngay nhưng cả 10 module giữ `ComingSoon` — theo CLAUDE.md, module chưa có engine + đề thật là stub;
(3) artifact 3 đề thi thử được coi là **nguồn luyện tập, không phải đề thật**: đáp án đã đối chiếu, nhưng bảng điểm 3/4/3 và mốc "≥7" là của tác giả artifact
(các PDF thật không có điểm từng câu, chỉ có phạt thực hành −0.25/−1/−3/0).
Rejected: dựng luôn 10 module React (không ai yêu cầu, và mỗi module cần port engine + kiểm trace — làm từng module khi có nhu cầu);
hard-code thuật toán khác ngoài tài liệu (nổi bọt/nhanh/trộn) — không có trong nguồn, chỉ ghi chú "ngoài nguồn" trong SKILL.md.
Đề mơ hồ giữ nguyên và ghi cách hiểu (Test01 Câu 7, Test03 Câu 9) thay vì im lặng chọn.

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
