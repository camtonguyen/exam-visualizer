# PLAN — Exam Visualizer

Web tương tác, có animation, hướng dẫn giải đề từng bước — **nhiều môn học**, mỗi môn
là một bộ module độc lập dưới `src/subjects/<id>/`. Xem `CLAUDE.md` mục "Kiến trúc đa
môn" để hiểu ranh giới shared vs. per-subject; xem `docs/ADDING_A_SUBJECT.md` khi thêm
môn mới.

## Danh sách môn học

| Môn | id | Trạng thái | Nguồn tài liệu |
|---|---|---|---|
| Cấu trúc rời rạc | `ctrr` | ✅ Hoàn thành (8/8 module) | `Huong_dan_giai_de_cuoi_ky_CTRR.docx` |
| Xác suất Thống kê | `xstk` | ✅ Hoàn thành (10/10 module) | `docs/xstk/files/*.md` — 2 đề CITD HK1 2025-2026, 2 đề UICD-2025, 1 đề CK XSTK HK2 2023-2024 |
| Cấu trúc Dữ liệu & Giải thuật (IT003) | `ctdl` | ✅ Hoàn thành: skill + kho đề + lời giải C++ + app: ✅ 10/10 module | `docs/ctdl/` — 6 PDF scan (đề mẫu CITD, hướng dẫn trình bày, luyện tập 005, 3 đề thực hành) + 15 file `.cpp` của thầy + artifact 3 đề thi thử |

Thêm hàng vào bảng này mỗi khi có môn mới, kể cả khi mới ở bước "chờ tài liệu".

---

## Môn 1: Cấu trúc rời rạc (`src/subjects/ctrr/`)

Nguồn: `Huong_dan_giai_de_cuoi_ky_CTRR.docx` (đã hoàn thiện qua nhiều vòng chỉnh sửa —
dùng đúng ví dụ, đúng số liệu, đúng thuật toán trong đó, không bịa thêm).

**✅ Môn CTRR hoàn thành đủ 8/8 module** (7 module gốc theo cấu trúc đề + `graph-properties`
cho Câu 2 được thêm sau). Việc tiếp theo cho môn này (nếu có) là sửa lỗi/tinh chỉnh, không
phải thêm module mới, trừ khi có đề thi mới (xem "Khi extending to a new exam graph" trong
SKILL.md).

### 8 module, theo đúng cấu trúc đề (Câu 1a/1b/1c, Câu 2, Câu 3a/3b/3c/3d)

| # | Module (`id`) | Input mẫu (đề thật) | Điều cần animate | Trạng thái |
|---|---|---|---|---|
| 1 | `cdnf` | f⁻¹(0) đề 2022-2023 và 2023-2024 | Quét từng ô bảng chân trị, chấm (•) từng đơn thức, gộp thành CDNF | ✅ Xong |
| 2 | `karnaugh` | CDNF câu 1, cả 2 đề thật + 1 hàm minh họa | Tô từng tế bào lớn xuất hiện dần trên lưới 4×4, đánh dấu tế bào thiết yếu, so sánh phủ khác cỡ | ✅ Xong |
| 3 | `circuit` | "Cách 1" của câu 1b, cả 2 đề thật | Tín hiệu chạy dọc dây qua cổng NOT → AND → OR, đúng ký hiệu chuẩn | ✅ Xong |
| 4 | `graph-properties` | Câu 2 cả 2 đề thật (Kiểu 1: HK1 2022-2023; Kiểu 2 ý a/b: HK1 2023-2024) + ví dụ minh họa thêm mọi kiểu (5 đồ thị đặc biệt Kₙ/Cₙ/Wₙ/đều bậc k/Qₙ dùng chung cho cả 3 tab) | 3 tab: Havel–Hakimi từng vòng (Kiểu 1), xây dần đồ thị scripted theo đúng lời giải (Kiểu 2), 2 kỹ thuật Dirichlet khác nhau — Định lý 1.2 và hệ quả Định lý 1.1 (Kiểu 3) | ✅ Xong |
| 5 | `euler` | Đồ thị Câu 3, 2 đề thật + `graphMinhHoa` (circulant 10 đỉnh, không phải đề thật) | Đếm bậc từng đỉnh, kết luận 4 đỉnh lẻ → không Euler ở cả 2 đề thật; animate Fleury thật trên `graphMinhHoa` (mặc định) | ✅ Xong |
| 6 | `hamilton` | Cùng 3 đồ thị (2 đề thật + `graphMinhHoa`) | Animate đúng 4 quy tắc trong guide | ✅ Xong |
| 7 | `dijkstra` | Cùng 3 đồ thị (nguồn E / nguồn H / nguồn A cho `graphMinhHoa`, đúng theo đề — không phải tự chọn) | Chọn đề qua `GraphPicker` dùng chung, cố định đỉnh từng bước, bảng L(v) tích lũy | ✅ Xong |
| 8 | `spanning-tree` | Cùng 3 đồ thị | Sắp cạnh giảm dần, animate Kruskal đảo dấu từng cạnh (chọn/loại), dừng ngay khi đủ n-1 cạnh | ✅ Xong |

Lưu ý: `graph-properties` (Câu 2) có 3 KIỂU khác hẳn nhau về bản chất dưới 1 module (xem
SKILL.md) — Kiểu 1 và Kiểu 3 là thuật toán tổng quát (`degreeSequence.ts`,
`pigeonholeDegree.ts`, kiểu 3 có 2 kỹ thuật chứng minh khác nhau); Kiểu 2 KHÔNG phải thuật
toán tổng quát (đây là bài toán xây dựng sáng tạo), nên `data/scriptedGraphBuild.ts` chứa
2 ví dụ viết tay (ý a, ý b — đề thật HK1 2023-2024, xem SKILL.md) — đừng cố tổng quát hóa
thành "engine sinh đồ thị tự động thỏa property bất kỳ". `data/specialGraphs.ts` (5 đồ thị
đặc biệt: Kₙ, Cₙ, Wₙ, đều bậc k, Qₙ — KHÔNG phải đề thật, chỉ minh họa bảng công thức
trong guide) dùng CHUNG làm ví dụ minh họa thêm cho cả 3 Kiểu.

Dữ liệu 2 đồ thị thật + `graphMinhHoa` (circulant 10 đỉnh, KHÔNG phải đề thật — xem
SKILL.md) đều nằm trong `src/subjects/ctrr/data/graphs.ts`; cả 4 module Câu 3 dùng
chung qua `src/subjects/ctrr/graphOptions.ts` (`CTRR_GRAPH_OPTIONS`) — không tạo đồ thị
mới trừ khi thầy ra đề khác, và không định nghĩa `GRAPH_OPTIONS` riêng trong từng module.

### Trạng thái hạ tầng dùng chung (áp dụng cho MỌI môn, không riêng CTRR)

- [x] Scaffold Vite + React + TS + Tailwind v4 + Framer Motion + Router
- [x] `src/engine/types.ts` — kiểu dữ liệu chung cho mọi thuật toán (`AlgoStep`, `GraphSpec`...)
- [x] `src/components/graph/GraphCanvas.tsx` — SVG đồ thị animate theo step
- [x] `src/components/ui/StepPlayer.tsx` — điều khiển play/pause/next/prev dùng chung
- [x] `src/subjects/types.ts` + `src/subjects/registry.ts` — khung đăng ký môn học
- [x] `src/routes/Home.tsx`, `SubjectHome.tsx` — trang chọn môn / chọn bài, tự sinh từ registry
- [x] Canvas dùng chung thứ 2 (bảng/lưới ô vuông) — `src/components/table/TruthTableCanvas.tsx`,
      viết khi làm `cdnf`; Karnaugh (CTRR) và môn sau dùng lại được.
- [x] `GraphSpec` mở rộng thêm `directed?`, `labels?` (viết khi làm `graph-properties` —
      Kiểu 2 cần mũi tên đồ thị có hướng, Kiểu 1 cần hiện label ngắn cho id đỉnh dài) và
      `WeightedEdge.weight` thành optional (đồ thị không trọng số khỏi hiện nhãn "1" giả).
- [x] `src/components/ui/GraphPicker.tsx` — hàng nút chọn đề dùng chung cho mọi module
      đồ thị (viết khi hoàn thiện `dijkstra`, đồng thời sửa lại `EulerModule.tsx` và
      `HamiltonModule.tsx` để dùng chung, không giữ 2 bản trùng chức năng).
- [x] `src/components/pointer/PointerCanvas.tsx` + `AlgoStep.pointerSnapshot` (`PointerNode`/`PointerSnapshot`) — sơ đồ node + con trỏ dùng chung
      (viết khi làm CTDL `stack`/`queue`, mở rộng cho `linked-list`/`doubly-linked-list`: nút 3 ngăn khi node có `prev`, cung nối tắt, stub đỏ "freed" cho pNext dangling;
      sẽ dùng lại cho bucket của `hashtable`; BST cần layout cây riêng).
      `components/ui/CodeBlock.tsx` — khối code chuẩn C++ cạnh phần trace.
- [x] `src/components/ui/RichText.tsx` — hiển thị markup gọn (**đậm**, `code`, xuống dòng) bằng text node React, không innerHTML.
- [x] `src/components/tree/TreeCanvas.tsx` + `AlgoStep.treeSnapshot` (`TreeSnapshot`/`TreeNodeView`) — cây nhị phân: x = thứ hạng trung tố (không chồng lấn, trái→phải = tăng dần), y = độ sâu; nhãn pGoto/pLoca/p dưới node,
      node chờ chèn nét đứt, chip NULL, khung `std::stack` + output tích lũy.
- [x] `src/components/memory/MemoryCanvas.tsx` + `AlgoStep.memorySnapshot`/`codeLine` (`MemorySnapshot`/`MemObjView`/`MemSlotView`) — sơ đồ stack/heap/con trỏ cho "đọc code ghi kết quả";
      `CodeBlock` có prop `highlight` (tô dòng + số dòng). Engine: `ctdl/engine/memoryMachine.ts` (máy bộ nhớ + bộ phân giải biểu thức C++) và `memoryTrace.ts`.
- [x] `src/components/hash/HashTableCanvas.tsx` + `AlgoStep.hashSnapshot` (`HashSnapshot`/`HashNode`) — bảng băm nối kết: cột bucket [i] + chuỗi node → NULL,
      node mới cấp phát chưa nối vẽ nét đứt (`pending`), nhãn pHead/pTail/p dưới node. Canvas RIÊNG (không tái dùng `PointerCanvas`) vì quy ước hàng của PointerCanvas
      (hàng 2 = node chưa nối) xung đột với "mỗi bucket một hàng", cần nhiều chuỗi song song + hàng nhỏ gọn.
- [x] `src/components/table/ArrayCanvas.tsx` + `AlgoStep.arraySnapshot`/`arrayMarkers` — canvas mảng 1 chiều dùng chung (viết khi làm CTDL
      `searching`/`sorting`; đọc `nodeHighlights[String(index)]` cùng bảng màu `NODE_COLOR` với GraphCanvas).
- [x] `src/subjects/ctrr/graphOptions.ts` (`CTRR_GRAPH_OPTIONS`) — danh sách đồ thị dùng
      chung cho `GraphPicker` ở cả 4 module Câu 3, thay vì mỗi module tự định nghĩa
      `GRAPH_OPTIONS` riêng (viết khi thêm `graphMinhHoa` làm lựa chọn thứ 3).

### Việc kế tiếp cho CTRR

Không còn module nào cần code — cả 8/8 đã xong (xem ghi chú đầu mục CTRR ở trên). Việc
còn lại chỉ là bảo trì:

1. `CdnfModule.tsx`/`KarnaughModule.tsx` vẫn tự làm hàng nút chọn đề riêng — KHÔNG phải
   trùng chức năng với `GraphPicker` (chúng chọn `BooleanFunctionSpec`, không phải
   `GraphSpec`), nên không cần đổi; chỉ các module dùng `GraphSpec` mới bắt buộc dùng
   `GraphPicker`.
2. Nếu có đề thi mới (HK khác), làm theo mục "When extending to a new exam graph" trong
   SKILL.md — transcribe cẩn thận, đối chiếu lại số liệu, không tự bịa.

---

## Môn 2: Xác suất Thống kê (`src/subjects/xstk/`)

Nguồn: `docs/xstk/files/*.md` — hướng dẫn giải chi tiết (kèm cách bấm máy Casio
fx-880BTG) transcribed từ 5 đề: `citd_hk1_2025_2026_de1.md`, `citd_hk1_2025_2026_de2.md`
(có đáp án đầy đủ), `de1_uicd_2025.md`, `de2_uicd_2025.md` (có đáp án), và
`ck_xstk_hk2_2023_2024.md` (đề khác kỳ, giới thiệu 2 dạng bài mới không xuất hiện ở
4 đề kia: phân phối đồng thời, kiểm định/ước lượng bằng Student-t). Đối chiếu cả 5, đề
xoay quanh 10 dạng bài cố định (bảng dưới) — 1 dạng = 1 module, giống cấu trúc CTRR.
(Dạng "biến ngẫu nhiên rời rạc/nhị thức" phỏng đoán ở lượt trước KHÔNG xuất hiện trong
bất kỳ đề nào trong 5 file — đã loại khỏi danh sách, không phải dạng thật.)

**✅ Môn XSTK hoàn thành đủ 10/10 module** (Giai đoạn 1: `bayes`, `continuous-density`,
`normal-distribution`; Giai đoạn 2: `ci-known-sigma`, `ci-sample-proportion`,
`hypothesis-proportion`, `t-distribution`, `regression`, `joint-discrete`,
`joint-continuous`). Toàn bộ số liệu + công thức chi tiết nằm trong
`.claude/skills/xstk-content/SKILL.md`, không lặp lại ở đây — việc còn lại (nếu có) chỉ
là bảo trì, trừ khi có đề thi mới.

### 10 module

XSTK KHÔNG dùng canvas/animation cho bất kỳ dạng bài nào (khác với CTRR) — mỗi module
hiển thị dạng "từng bước giải" (text, tái dùng `StepPlayer`), kèm `TipCallout` (mẹo),
`CalculatorTip` (bấm máy), và `AnswerKeyPanel` ("ghi vào bài làm", format theo mẫu
`docs/xstk/Dap an.jpg`). Xem "Ghi chú kiến trúc riêng của XSTK" bên dưới và
`docs/decisions.md` cho lý do.

| # | Module (`id`) | Nguồn (đề thật) | Trạng thái |
|---|---|---|---|
| 1 | `bayes` | MỌI đề (CITD Đề1,2; UICD Đề1,2), Câu 1 | ✅ Xong |
| 2 | `continuous-density` | CITD Đề1,2 (bậc 3); UICD Đề1 (bậc 1); UICD Đề2 (bậc 2), Câu 3/Câu2 | ✅ Xong |
| 3 | `normal-distribution` | CITD Đề1,2; UICD Đề1,2 — đủ 4 kiểu câu hỏi (cdf-left/cdf-right/inverse-left/inverse-topk) | ✅ Xong |
| 4 | `ci-known-sigma` | UICD Đề1,2, Câu 4 — ước lượng khoảng KHI BIẾT σ + tìm cỡ mẫu tối thiểu | ✅ Xong |
| 5 | `ci-sample-proportion` | CITD Đề1,2, Câu 4 — x̄/S từ bảng tần số ghép nhóm rồi ước lượng khoảng + kiểm định TỶ LỆ | ✅ Xong |
| 6 | `hypothesis-proportion` | UICD Đề1,2 (2 phía), CK HK2 2023-2024 Câu3 (1 phía trái + CI cho p) | ✅ Xong |
| 7 | `t-distribution` | CK HK2 2023-2024 Câu4 — CHƯA biết σ, n nhỏ → Student-t thay vì Z | ✅ Xong |
| 8 | `regression` | CITD Đề1,2 (theo năm); CK HK2 2023-2024 Câu5 (bảng tần số 2 chiều, thiếu dữ liệu gốc — chỉ hiển thị kết quả) | ✅ Xong |
| 9 | `joint-discrete` | CK HK2 2023-2024 Câu1 — bảng phân phối đồng thời rời rạc, biên, kiểm tra độc lập | ✅ Xong |
| 10 | `joint-continuous` | CK HK2 2023-2024 Câu2 — mật độ đồng thời, mật độ biên, mật độ/xác suất có điều kiện (2 kiểu khác nhau) | ✅ Xong |

Lưu ý module 5 và 6 cùng là "kiểm định tỷ lệ" nhưng khác nhau về NGUỒN f (5 = suy từ
bảng tần số ghép nhóm trước, 6 = f cho sẵn trực tiếp) — không gộp thành 1 module vì
bước "tính x̄/S từ bảng tần số ghép nhóm" (dùng chức năng 1-Variable Statistics + tần số
trên máy) là 1 kỹ năng riêng biệt đáng có step riêng, không phải chi tiết vặt.

### Ghi chú kiến trúc riêng của XSTK

- **Không có canvas/animation nào trong XSTK** (khác CTRR) — quyết định 2026-09-15 (đợt
  3): mỗi module hiển thị "từng bước giải" dạng text, không vẽ SVG/đồ họa. 5 canvas
  viết ở đợt 2 (`ProbabilityTreeCanvas`, `AreaUnderCurveCanvas`, `DensityCurveCanvas`,
  `NormalCurveCanvas`, `NumberLineCanvas`, `ScatterRegressionCanvas`) đã bị XÓA khỏi
  codebase — đừng viết lại chúng cho module 4-10, dùng đúng 4 component dùng chung mới
  dưới đây. `JointTableCanvas` (dự kiến cho `joint-discrete` ở đợt trước) cũng KHÔNG
  cần tạo nữa — bảng phân phối đồng thời hiển thị dạng text/markdown table trong
  `AnswerKeyPanel`, không cần SVG riêng.
- 4 component dùng chung cho MỌI module XSTK (bắt buộc dùng đủ, không tự chế lại):
  1. `src/components/ui/ExamplePicker.tsx` — hàng nút chọn đề (tổng quát hóa từ CTRR's
     `GraphPicker`; `GraphPicker` giờ là wrapper mỏng quanh `ExamplePicker`, không ảnh
     hưởng CTRR).
  2. `src/components/ui/StepPlayer.tsx` — dùng chung với CTRR, hiện "từng bước giải"
     (title/explanation của `AlgoStep`) dạng text, không cần canvas đi kèm.
  3. `src/components/ui/TipCallout.tsx` (props `{tip: string}`) — "Mẹo" riêng của từng
     ví dụ, transcribed nguyên văn từ nguồn. Không phải ví dụ nào cũng có mẹo trong
     nguồn (vd CITD Đề2's Câu2 không có) — field `tip` ở data optional, component chỉ
     render khi có, KHÔNG bịa mẹo để lấp chỗ trống.
  4. `src/components/ui/CalculatorTip.tsx` (accordion, props `{menu, steps}`) — MỌI
     module XSTK phải có ít nhất 1 cái, hiện đúng menu Casio fx-880BTG + phím bấm cụ
     thể transcribed từ file nguồn (yêu cầu nội dung, không phải tùy chọn). Data type
     `CalculatorTipData` export từ chính component, không đặt trong `engine/types.ts`.
  5. `src/components/ui/AnswerKeyPanel.tsx` (props `{spec: AnswerKeySpec}`) — "Ghi vào
     bài làm", format theo mẫu ảnh chụp `docs/xstk/Dap an.jpg`: khối đặt biến cố/giả
     thiết (`setup`) rồi các phần a)/b)/c) (`parts`), mỗi dòng có thể kèm điểm
     (`points`). CHỈ điền `points` khi nguồn thật sự cho điểm ở mức đó — 4 đề CITD/UICD
     chỉ cho điểm TỔNG mỗi câu (vd "Câu 1 (2đ)"), không cho điểm chi tiết từng dòng như
     ảnh mẫu, nên `answerKey.totalPoints` có nhưng từng `AnswerKeyLine.points` để trống
     — đừng bịa điểm chi tiết để giống ảnh mẫu, đó là fabricate exam data.
- `runContinuousDensity` giải K bằng cách tận dụng tính TUYẾN TÍNH của f(x,k) theo k
  (tích phân tại k=0 và k=1 rồi suy hệ số) — tổng quát cho cả trường hợp k nhân toàn
  biểu thức (CITD) và k chỉ là hằng số cộng thêm (UICD Đề1), không cần 2 nhánh code
  riêng theo bậc đa thức. Không đổi khi bỏ canvas — vẫn cần cho step narration.
- `engine/normalQuantile.ts` (Giai đoạn 2) — hàm nghịch đảo CDF chuẩn tắc thật (Acklam's
  algorithm), dùng chung cho `ciKnownSigma.ts`/`ciSampleProportion.ts`/
  `hypothesisProportion.ts` để lấy z-critical chuẩn (z_0.025=1.96, z_0.01=2.326...) —
  KHÁC với `normalDistribution.ts`'s back-derive: những z này là hằng số textbook thật
  (không phải số đáp án đề làm tròn theo bảng), nên tính bằng công thức liên tục là
  ĐÚNG ở đây, không phải shortcut. Ngược lại, `t-distribution` KHÔNG có hàm nghịch đảo
  t tương tự — `TTestSpec.tCriticalForCI`/`tCriticalForTest` là INPUT tra bảng t theo
  df (đúng cách một học sinh thật sự làm, vì bảng t rời rạc theo df).
- Xem `.claude/skills/xstk-content/SKILL.md` cho công thức + toàn bộ số liệu chi tiết.

---

## Môn 3: Cấu trúc Dữ liệu & Giải thuật (`src/subjects/ctdl/`)

Nguồn: `docs/ctdl/` (PDF là ảnh scan — đã OCR bằng Vision của macOS rồi đối chiếu bằng mắt từng trang
có số liệu) + artifact `https://claude.ai/artifact/BUcXGh6Y78uijEWJ5vyxEd` (3 đề **thi thử** do người
khác dựng, KHÔNG phải đề thật — chỉ dùng làm bộ luyện tập). Toàn bộ kiến thức + đáp án đã đóng gói ở
`.claude/skills/ctdl-content/` (`SKILL.md`, `reference/exam-bank.md`, `reference/solutions/*.cpp` —
6 file C++ tự kiểm bằng `assert`, đã biên dịch & chạy bằng clang++).

**Khác CTRR/XSTK:** đây là môn *lập trình C++*, đề thi = lý thuyết ngắn + đọc code ghi kết quả + mô phỏng
thuật toán + **viết hàm** (Input/Output comment, không `cout` ngoài hàm xuất) — nên "giải đề" của môn này là
kho đáp án/code + trình chiếu từng bước, không phải công thức số.

**Trạng thái:** ✅ skill + kho đề + lời giải · ✅ môn đã đăng ký trong app (`subject.tsx`, 10 module) ·
✅ **10/10 module thật:** `pointers` (1), `linked-list` (2), `doubly-linked-list` (3), `stack` (4), `queue` (5), `hashtable` (6), `bst` (7), `searching` (8), `sorting` (9), `mock-exams` (10) trỏ `ComingSoon` (đúng quy ước "module chỉ mock = stub").
Kiểm engine: `node src/subjects/ctdl/engine/check.mjs` (assert đối chiếu trace C++ đã xác minh + bất biến snapshot + fuzz 300 ca ×2 so với mô hình mảng).

### 10 module (kế hoạch) — mọi ví dụ lấy từ `reference/exam-bank.md`

| # | Module (`id`) | Ví dụ thật cần wire | Điều cần hiển thị theo bước | Trạng thái |
|---|---|---|---|---|
| 1 | `pointers` | 12 chương trình đúng nguyên văn đề thật: Đề mẫu Câu 4–7, Hướng dẫn (`*(a+3)+*(a+7)`, `(*p)++`), Luyện tập 005 Câu 5–10 — đối chiếu với ảnh trang | Máy bộ nhớ chạy từng dòng: STACK (biến/struct/mảng) + HEAP (`new`) + mũi tên con trỏ; ô vừa đổi được tô; NULL/`?` (rác); lỗi runtime dừng chương trình; heap mồ côi = rò rỉ; output tích lũy; khung code tô dòng đang chạy | ✅ Xong |
| 2 | `linked-list` | `list.cpp`: loadData (10,79,39,26,88), timGiaTri 39/100, timNodeKeCuoi — tài liệu thật; + 1 ví dụ minh họa xóa node (kiến thức chuẩn, gắn nhãn, không có trong file nguồn) | Từng dòng addHead/addTail/tìm; xóa cần `prev` (cung nối tắt), lùi `pTail`, dangling sau `delete` | ✅ Xong |
| 3 | `doubly-linked-list` | `QLSV_List2.cpp` (addTail 123 124 125, addHead 100, printList) — tài liệu thật; + 1 ví dụ minh họa xóa node (kiến thức chuẩn) | Cập nhật TỪNG chiều `pNext`/`pPre` ở dòng riêng, duyệt xuôi/ngược, nối tắt 2 chiều khi xóa | ✅ Xong |
| 4 | `stack` | Đề mẫu Phần 2 (12 −95 78 −89 35 → pop → đếm), `demo_stackv1.cpp` (push 10 39 79 80 50, pop 5 lần), đổi 13→`1101` (`convert10_2`) — đều là tài liệu thật. Ngoặc/đảo chuỗi/palindrome chưa làm (text, không phải diagram node) | Từng dòng `p->pNext = s.pTop; s.pTop = p;` / pop lưu p→dời pTop→delete p; + code chuẩn | ✅ Xong |
| 5 | `queue` | `Queue.cpp` (enQ 6 7 8 9 10, deQ ×2) + thi thử (enQ 5 8 3 / deQ / enQ 6 ⇒ `8 3 6`) + 1 ví dụ minh họa tự tạo (dangling `pRear`) | enQueue/deQueue từng dòng; bước `delete p` node cuối vẽ `pRear` dangling rồi mới `pRear = NULL` | ✅ Xong |
| 6 | `hashtable` | `hashtable_static.cpp` (Size 10, 2 bộ), `hashtable_dynamic.cpp` (Size 7), `hashtable_4steps_dynamic.cpp` (Size 5), Test03 (Size 9, dữ liệu Câu 10 có giá trị trùng) + Test03 Câu 7 (tìm X) — đều là tài liệu thật | `add` từng dòng: `viTri = x % Size` → `initNode` (node nét đứt chưa nối) → `pHead = pTail = p` hoặc `pTail->pNext = p; pTail = p` (đụng độ nối cuối); `find` chỉ duyệt 1 bucket; in bảng theo `printHashtable` | ✅ Xong |
| 7 | `bst` | `demo_tree_v1.cpp` (add 50 73 26 66 88 61, printTree, tìm 88), Test01 Câu 10 (11 giá trị có trùng ⇒ 8 node; NLR/LRN/LNR, đếm) và Câu 5 (tìm 60/65) — tài liệu thật; + 1 ví dụ thi thử (artifact) | Chèn không đệ quy từng bước (`pGoto` đi xuống, `pLoca` là cha, trùng bỏ qua, node mới nét đứt rồi nối); tìm; duyệt NLR/LNR/LRN; LNR bằng `std::stack` (hiện stack + output tích lũy); đếm node | ✅ Xong |
| 8 | `searching` | Guide (tuyến tính 66; nhị phân 56 & 57; tìm 33 trong dãy chưa sắp xếp), LT005 Câu 3 (dãy **giảm dần**, tìm 32) + 2 ví dụ gắn nhãn thi thử/minh họa (nhị phân 27, nội suy 27) | `Bước k: L, R ⇒ M`, "DỪNG vì L phải ≤ R"; nội suy; cảnh báo khi dãy chưa sắp xếp | ✅ Xong |
| 9 | `sorting` | Đề mẫu Câu 8 (`90 68 72 32 55 21`), guide (`3 2 5 1 4`, `79 39 26 66 55 20`), LT005 Câu 2 (giảm dần) — cả 4 là đề/hướng dẫn thật | Bảng chọn trực tiếp / chèn trực tiếp đúng định dạng thầy | ✅ Xong |
| 10 | `mock-exams` | 2 tab: (a) **3 đề thi thử** của artifact, 42 câu (33 tự luận rubric + 9 điền), chuyển NGUYÊN VĂN bằng script từ dữ liệu artifact — KHÔNG phải đề thật; (b) **đề thực hành**: bộ "4 câu như Đề mẫu Phần 2" — Stack (đề thật) + DSLK đơn, DSLK đôi, Queue, Bảng băm (tự soạn cùng khuôn, gắn nhãn) — kèm lời giải ghi Input/Output như thầy (`data/practice_4cau.cpp`, biên dịch thật trong `check.mjs`). Test01/02/03 (10 câu) đã bỏ khỏi phần tự luận theo yêu cầu (lời giải C++ vẫn ở skill) | (a) tự chấm như artifact: viết nháp → xem đáp án mẫu → tick từng ý rubric; câu điền chấm all-or-nothing theo nhóm; điểm cộng (comment I/O) tách khỏi tổng 10; thanh điểm mốc 7, nộp bài, kết quả 3/4/3 theo phần. (b) KHÔNG chấm điểm (PDF không cho điểm từng câu): checklist "đã làm" + quy định phạt thật + lối tắt sang module/lời giải | ✅ Xong |

Engine từng module = hàm thuần trả `AlgoResult` (mẫu đã làm: `engine/searching.ts`, `engine/sorting.ts` — port từ
`algos_trace.cpp`, cùng câu chữ của đề). Module chạy-từng-bước dùng chung `components/table/ArrayCanvas.tsx` (mảng + con trỏ L/R/M/i) và
`ctdl/answerKey.ts` (sinh "Ghi vào bài làm" từ `steps`). Hiển thị text bằng `StepPlayer`/`ExamplePicker`/`TipCallout`/`AnswerKeyPanel` (kiểu XSTK); canvas
cây BST/bảng băm chỉ làm nếu thật sự cần và đặt ở `src/components/` (dùng chung).

**Không có trong tài liệu môn (đừng thêm vào đề "thật"):** sắp xếp nổi bọt/nhanh/trộn/vun đống, AVL, đồ thị, phân tích
độ phức tạp chi tiết, xóa node BST. Có ghi chú kiến thức chuẩn ở cuối SKILL.md, đánh dấu "ngoài nguồn".

---

## Môn 4+: chưa xác định

Chưa có tài liệu. Khi tài liệu tới:

1. Làm theo `docs/ADDING_A_SUBJECT.md` bước 0 (đọc tài liệu, liệt kê dạng bài) trước khi
   tạo bất kỳ thư mục nào.
2. Thêm một bảng module cho môn đó vào PLAN.md này, đúng format bảng CTRR/XSTK ở trên.
3. Cập nhật bảng "Danh sách môn học" phía trên.
