import type { SortSpec } from "../engine/sorting";

export interface SortExample {
  id: string;
  label: string;
  spec: SortSpec;
  tip?: string;
}

/**
 * Ví dụ sắp xếp, cả 4 đều là đề/hướng dẫn thật: `IT003_Bai09_Huong_Dan_Trinh_Bay.pdf` (chọn `3 2 5 1 4`,
 * chèn `79 39 26 66 55 20`), `IT003_Bai09_De_CuoiKy_CITD_De_mau.pdf` Câu 8 (chọn `90 68 72 32 55 21`),
 * `IT003_Bai10_Luyen_tap_005.pdf` Câu 2 (chèn GIẢM dần `11 54 37 69 85 74`).
 */
export const SORT_EXAMPLES: SortExample[] = [
  {
    id: "guide-selection",
    label: "Hướng dẫn — chọn trực tiếp 3 2 5 1 4",
    spec: { algorithm: "selection", array: [3, 2, 5, 1, 4] },
    tip: "Mỗi vòng đúng 1 hoán vị. Ghi hoán vị kể cả khi min đã đứng đúng chỗ ('Hoán vị 2, 2') — đúng như mẫu của thầy.",
  },
  {
    id: "dethimau-c8-selection",
    label: "Đề mẫu Câu 8 — chọn trực tiếp 90 68 72 32 55 21",
    spec: { algorithm: "selection", array: [90, 68, 72, 32, 55, 21] },
    tip: "6 phần tử ⇒ 5 bước (i = 0…4). Đề yêu cầu 'không viết code' — chỉ trình bày từng bước như bảng dưới.",
  },
  {
    id: "guide-insertion",
    label: "Hướng dẫn — chèn trực tiếp 79 39 26 66 55 20",
    spec: { algorithm: "insertion", array: [79, 39, 26, 66, 55, 20] },
    tip: "Lần #k xét a[k]; vùng a[0..k] (tô xanh) luôn đã sắp xếp. Mỗi lần dịch các phần tử lớn hơn sang phải rồi chèn.",
  },
  {
    id: "lt005-c2-insertion-desc",
    label: "Luyện tập 005 Câu 2 — chèn giảm dần 11 54 37 69 85 74",
    spec: { algorithm: "insertion", array: [11, 54, 37, 69, 85, 74], order: "desc" },
    tip: "Giảm dần: đảo dấu so sánh — dịch các phần tử NHỎ hơn a[k] sang phải.",
  },
];
