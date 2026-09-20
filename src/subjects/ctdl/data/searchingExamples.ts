import type { SearchSpec } from "../engine/searching";

export interface SearchExample {
  id: string;
  label: string;
  spec: SearchSpec;
  tip?: string;
}

/**
 * Ví dụ tìm kiếm. Nguồn: `docs/ctdl/IT003_Bai09_Huong_Dan_Trinh_Bay.pdf` (5 ví dụ đầu),
 * `IT003_Bai10_Luyen_tap_005.pdf` Câu 3 (dãy GIẢM dần). Hai ví dụ cuối KHÔNG phải đề thật
 * (gắn nhãn rõ): 1 từ artifact thi thử, 1 minh họa nội suy tự tạo — nội suy không có ví dụ
 * nào trong PDF của thầy.
 */
export const SEARCH_EXAMPLES: SearchExample[] = [
  {
    id: "guide-linear-66",
    label: "Hướng dẫn — tuyến tính, tìm 66",
    spec: { algorithm: "linear", array: [16, 78, 50, 66, 38], target: 66 },
    tip: "Tuyến tính chạy được trên dãy bất kỳ — không cần sắp xếp trước. Mỗi bước ghi rõ 'khác ⇒ chưa tìm thấy' cho tới khi gặp.",
  },
  {
    id: "guide-binary-56",
    label: "Hướng dẫn — nhị phân, tìm 56",
    spec: { algorithm: "binary", array: [16, 23, 31, 56, 62], target: 56 },
    tip: "M = (L+R)/2. a[M] < value ⇒ L = M+1; a[M] > value ⇒ R = M−1. Vòng lặp chỉ chạy khi L ≤ R.",
  },
  {
    id: "guide-binary-57",
    label: "Hướng dẫn — nhị phân, tìm 57 (không có)",
    spec: { algorithm: "binary", array: [16, 23, 31, 56, 62], target: 57 },
    tip: "Không tìm thấy thì kết thúc bằng dòng 'DỪNG vì L phải ≤ R' (L = 4, R = 3) — đừng bỏ dòng này khỏi bài làm.",
  },
  {
    id: "guide-linear-33",
    label: "Hướng dẫn — dãy chưa sắp xếp, tìm 33",
    spec: { algorithm: "linear", array: [90, 68, 72, 32, 55, 21], target: 33 },
    tip: "Đề hỏi 'nên tìm theo thuật toán nào?': dãy CHƯA sắp xếp ⇒ tuyến tính. Nhị phân/nội suy bắt buộc dãy đã sắp xếp, mà sắp xếp trước chỉ để tìm một lần còn tốn hơn quét thẳng.",
  },
  {
    id: "lt005-c3-desc-32",
    label: "Luyện tập 005 Câu 3 — nhị phân trên dãy giảm dần, tìm 32",
    spec: { algorithm: "binary", array: [88, 74, 59, 58, 32, 17], target: 32, order: "desc" },
    tip: "Dãy GIẢM dần vẫn dùng được nhị phân — chỉ đảo dấu so sánh: a[M] > value ⇒ L = M+1 (tìm nửa phải, nơi các giá trị nhỏ hơn).",
  },
  {
    id: "thithu-binary-27",
    label: "Thi thử (artifact) — nhị phân, tìm 27",
    spec: { algorithm: "binary", array: [10, 15, 18, 25, 27, 35], target: 27 },
  },
  {
    id: "minhhoa-interp-27",
    label: "Minh họa (tự tạo) — nội suy, tìm 27",
    spec: { algorithm: "interpolation", array: [10, 15, 18, 25, 27, 35], target: 27 },
    tip: "Ví dụ tự tạo, không phải đề thật. Nội suy đoán vị trí theo tỷ lệ giá trị nên có thể trúng ngay (hoặc gần) thay vì luôn chia đôi; cần dãy tăng dần và phân bố đều.",
  },
];
