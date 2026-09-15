# PLAN — Exam Visualizer

Web tương tác, có animation, hướng dẫn giải đề từng bước — **nhiều môn học**, mỗi môn
là một bộ module độc lập dưới `src/subjects/<id>/`. Xem `CLAUDE.md` mục "Kiến trúc đa
môn" để hiểu ranh giới shared vs. per-subject; xem `docs/ADDING_A_SUBJECT.md` khi thêm
môn mới.

## Danh sách môn học

| Môn | id | Trạng thái | Nguồn tài liệu |
|---|---|---|---|
| Cấu trúc rời rạc | `ctrr` | ✅ Hoàn thành (8/8 module) | `Huong_dan_giai_de_cuoi_ky_CTRR.docx` |
| (chưa xác định) | — | Chờ tài liệu | Sẽ cung cấp sau |

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

## Môn 2+: chưa xác định

Chưa có tài liệu. Khi tài liệu tới:

1. Làm theo `docs/ADDING_A_SUBJECT.md` bước 0 (đọc tài liệu, liệt kê dạng bài) trước khi
   tạo bất kỳ thư mục nào.
2. Thêm một bảng module cho môn đó vào PLAN.md này, đúng format bảng CTRR ở trên.
3. Cập nhật bảng "Danh sách môn học" phía trên.
