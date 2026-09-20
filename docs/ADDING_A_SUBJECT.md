# Thêm một môn học mới

Checklist này dùng khi bạn cung cấp tài liệu của môn tiếp theo. Đọc `CLAUDE.md` +
`docs/PLAN.md` trước (mục "Kiến trúc đa môn") để hiểu vì sao chia thư mục như vậy.

## 0. Trước khi viết code

Đừng bắt đầu code ngay khi có tài liệu mới. Làm theo đúng quy trình đã dùng cho CTRR:

1. Đọc/trích tài liệu gốc (Word/PDF/pptx) — lấy đúng số liệu, đúng thuật toán, đúng ví dụ
   đề thi thật nếu có. Không tự bịa ví dụ khi tài liệu đã có ví dụ thật.
   Nếu PDF là **ảnh scan** (không copy được chữ, máy không có `pdftotext`): dùng `PDFKit` + `Vision`
   (`VNRecognizeTextRequest`, `recognitionLanguages = ["vi-VN","en-US"]`) qua một script Swift để OCR, rồi
   **xem ảnh trang** cho mọi chỗ có số liệu/mã — OCR hay nhầm chữ số (CTDL: `123` → `1123`, `F` → `E`).
2. Liệt kê "dạng bài" giống cách CTRR có 7 dạng (1a,1b,1c,3a,3b,3c,3d) — mỗi dạng bài
   sau này là 1 module.
3. Với mỗi dạng bài, xác định: input là gì (đồ thị? hàm số? ma trận?), output từng bước
   cần animate là gì. Nếu input không phải đồ thị (`GraphSpec`), có thể cần thêm kiểu
   dữ liệu mới vào `src/engine/types.ts` (xem mục 3 bên dưới) — đừng ép input về
   `GraphSpec` chỉ để tái dùng `GraphCanvas` nếu bản chất bài toán khác hẳn (Karnaugh của
   CTRR chẳng hạn KHÔNG dùng GraphCanvas, cần canvas riêng).

## 1. Tạo thư mục môn học

```bash
mkdir -p src/subjects/<subject-id>/engine src/subjects/<subject-id>/modules src/subjects/<subject-id>/data
```

`<subject-id>` viết thường, không dấu, gạch ngang nếu nhiều từ (ví dụ `xstk` cho Xác suất
Thống kê, không phải `Xác Suất Thống Kê`).

## 2. Viết engine (thuật toán thuần, không React)

Mỗi dạng bài → 1 file `src/subjects/<subject-id>/engine/<ten-thuat-toan>.ts`, theo đúng
khuôn `src/subjects/ctrr/engine/dijkstra.ts`:

- Nhận input cụ thể của bài toán (không phải props React).
- Trả về `AlgoResult` (`{ steps: AlgoStep[], summary }`) từ `src/engine/types.ts`.
- Không import React, không import bất kỳ thứ gì trong `components/`.
- Nếu môn mới cần input KHÔNG phải đồ thị (ví dụ: ma trận, bảng phân phối xác suất),
  thêm interface mới vào `src/engine/types.ts` cạnh `GraphSpec` — đây là tầng DÙNG CHUNG
  cho mọi môn, không đặt trong `subjects/<id>/`.

## 3. Viết canvas hiển thị (nếu GraphCanvas không phù hợp)

`src/components/graph/GraphCanvas.tsx` chỉ vẽ được node/edge. Nếu môn mới cần hiển thị
khác (bảng số, biểu đồ, ma trận, cây quyết định...), tạo canvas mới trong
`src/components/<loai-hien-thi>/` (KHÔNG đặt trong `subjects/<id>/` nếu có khả năng môn
khác cũng dùng lại được — ví dụ một `TableCanvas` hiển thị bảng đổi màu theo bước có thể
dùng chung cho cả Karnaugh của CTRR lẫn bảng phân phối của Xác suất Thống kê).

`StepPlayer` (play/pause/next/prev) dùng chung tuyệt đối, không viết lại.

## 4. Viết module (nối engine + canvas + StepPlayer)

`src/subjects/<subject-id>/modules/<ten>/<Ten>Module.tsx`, theo khuôn
`DijkstraModule.tsx`: gọi engine 1 lần bằng `useMemo`, giữ state `index`/`playing`,
render canvas + `StepPlayer`.

## 5. Viết dữ liệu đề thật

`src/subjects/<subject-id>/data/<ten>.ts` — chép đúng số liệu từ tài liệu/đề thi thật.
Nếu số liệu đọc từ ảnh chụp đề (không phải text), ghi chú rõ "đọc từ ảnh, cần xác nhận"
giống cách `docs/decisions.md` của CTRR đã làm — đừng âm thầm đoán khi không chắc.

## 6. Khai báo môn học

Tạo `src/subjects/<subject-id>/subject.tsx` (copy `src/subjects/ctrr/subject.tsx`),
liệt kê đủ các module — kể cả module chưa code xong (trỏ `ComingSoon`).

Rồi thêm đúng 1 dòng vào `src/subjects/registry.ts`:

```ts
import { xstkSubject } from "./xstk/subject";
// ...
export const subjects: SubjectDef[] = [ctrrSubject, xstkSubject];
```

Không sửa gì ở `App.tsx`, `Home.tsx`, `SubjectHome.tsx` — routing/nav tự động nhận môn
mới từ registry.

## 7. Cập nhật tài liệu

- `docs/PLAN.md` — thêm bảng module cho môn mới, giống format bảng CTRR.
- `.claude/skills/<subject-id>-content/SKILL.md` — đóng gói thuật ngữ/số liệu đã kiểm
  chứng của môn mới, giống `.claude/skills/ctrr-content/SKILL.md`. Đặt riêng skill theo
  từng môn (không gộp chung) để Claude Code chỉ nạp đúng skill của môn đang làm việc.
- `docs/progress.md` — 1 dòng log khi xong.

## Không làm

- Không import chéo giữa 2 thư mục `subjects/` (ví dụ CTRR import từ `subjects/xstk/`).
  Nếu có logic dùng chung thật sự, nó thuộc về `src/engine/` hoặc `src/components/`,
  không phải "mượn" từ môn khác.
- Không sửa `GraphCanvas`/`StepPlayer` theo hướng chỉ hợp với 1 môn — nếu cần hành vi
  riêng, thêm prop có default giữ nguyên hành vi cũ, đừng rẽ nhánh cứng theo `subjectId`.
