# Exam Visualizer

Hướng dẫn học & giải đề dạng web tương tác, có animation — **nhiều môn học**. Môn khởi
đầu: Cấu trúc rời rạc (CTRR), chuyển từ `Huong_dan_giai_de_cuoi_ky_CTRR.docx` thành từng
bước bấm/xem trực quan (Karnaugh, mạch logic, Euler, Hamilton, Dijkstra, cây khung).
Các môn khác sẽ được thêm dần khi có tài liệu.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build       # kiểm tra build production
```

## Đọc gì trước khi code

1. **`CLAUDE.md`** — quy ước, kiến trúc đa môn, thứ tự đọc file.
2. **`docs/PLAN.md`** — danh sách môn học + module từng môn, cái nào xong/chưa.
3. **`docs/ADDING_A_SUBJECT.md`** — checklist thêm môn mới (đọc trước khi có tài liệu môn 2).
4. **`docs/decisions.md`** — các quyết định kiến trúc đã chốt, đừng làm lại.
5. **`.claude/skills/ctrr-content/SKILL.md`** — số liệu/thuật ngữ CTRR đã kiểm chứng.

## Cấu trúc thư mục (rút gọn)

```
src/
├── engine/types.ts          # kiểu dữ liệu DÙNG CHUNG cho mọi môn
├── components/               # UI DÙNG CHUNG (GraphCanvas, StepPlayer...)
├── routes/                   # Home, SubjectHome, ComingSoon
└── subjects/
    ├── registry.ts           # danh sách môn học — sửa file này khi thêm môn mới
    └── ctrr/                 # môn Cấu trúc rời rạc (engine/modules/data riêng)
```

## Trạng thái

Xem `docs/PLAN.md`. Tóm tắt: kiến trúc đa môn + module Dijkstra (CTRR) đã chạy được,
6 module CTRR còn lại + mọi môn tiếp theo đi theo cùng khuôn `engine/` + `modules/`.
