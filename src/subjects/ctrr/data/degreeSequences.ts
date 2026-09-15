import type { DegreeSequenceCheck } from "@/engine/types";

/**
 * HK1 2022-2023, Câu 2, Kiểu 1 — real exam: "Có tồn tại đồ thị vô hướng 5 đỉnh với các
 * dãy bậc sau đây không? (1) 1,2,3,4,5  (2) 1,2,3,4,4". Verified in the guide: (1) tổng=15
 * lẻ → không tồn tại; (2) tổng=14 chẵn nhưng vẫn không tồn tại (2 đỉnh bậc 4 buộc nối hết
 * → đỉnh bậc 1 bị kéo lên bậc ≥2, mâu thuẫn).
 */
export const realExamSequences: DegreeSequenceCheck[] = [
  { sequence: [1, 2, 3, 4, 5], label: "(1)" },
  { sequence: [1, 2, 3, 4, 4], label: "(2)" },
];

/**
 * Ví dụ minh họa thêm (không phải đề thi thật — guide dùng để cho thấy chiều ngược lại:
 * một dãy bậc THỰC SỰ tồn tại). Verified: tổng=12 chẵn, Havel–Hakimi dựng thành công —
 * đồ thị mẫu trong guide: A-B, A-C, A-D, B-C, B-E, D-E.
 */
export const existsExampleSequence: DegreeSequenceCheck[] = [{ sequence: [3, 3, 2, 2, 2], label: "(3)" }];

/**
 * Ví dụ minh họa thêm (không phải đề thi thật) — dãy bậc của 5 đồ thị đặc biệt trong
 * bảng "Mẹo nhớ" Kiểu 2 (`data/specialGraphs.ts`), dùng để cho thấy Havel–Hakimi luôn
 * thành công trên các dạng đồ thị "có tên gọi sẵn" này (đều là đồ thị thật, dựng được).
 */
export const specialGraphSequences: DegreeSequenceCheck[] = [
  { sequence: [4, 4, 4, 4, 4], label: "K₅" },
  { sequence: [2, 2, 2, 2, 2, 2], label: "C₆" },
  { sequence: [3, 3, 3, 3, 3, 5], label: "W₅" },
  { sequence: [3, 3, 3, 3, 3, 3], label: "đều bậc 3" },
  { sequence: [3, 3, 3, 3, 3, 3, 3, 3], label: "Q₃" },
];
