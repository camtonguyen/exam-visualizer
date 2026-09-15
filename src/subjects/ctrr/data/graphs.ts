import type { GraphSpec } from "@/engine/types";

/**
 * HK1 2023-2024, Câu 3 — same graph solved in the written guide (Huong_dan_giai_de_cuoi_ky_CTRR.docx).
 * Positions are laid out to match the exam's grid-like sketch (E,F top / A,B,G,H middle / C,D,J,I bottom).
 */
export const graph20232024: GraphSpec = {
  nodes: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
  positions: {
    E: { x: 220, y: 60 }, F: { x: 460, y: 60 },
    A: { x: 60, y: 220 }, B: { x: 220, y: 220 }, G: { x: 460, y: 220 }, H: { x: 700, y: 220 },
    C: { x: 60, y: 380 }, D: { x: 220, y: 380 }, J: { x: 460, y: 380 }, I: { x: 700, y: 380 },
  },
  edges: [
    { id: "e1", from: "E", to: "F", weight: 2 },
    { id: "e2", from: "A", to: "E", weight: 9 },
    { id: "e3", from: "E", to: "G", weight: 10 },
    { id: "e4", from: "F", to: "G", weight: 3 },
    { id: "e5", from: "F", to: "H", weight: 2 },
    { id: "e6", from: "A", to: "B", weight: 4 },
    { id: "e7", from: "B", to: "G", weight: 2 },
    { id: "e8", from: "A", to: "C", weight: 3 },
    { id: "e9", from: "B", to: "D", weight: 1 },
    { id: "e10", from: "B", to: "J", weight: 5 },
    { id: "e11", from: "D", to: "G", weight: 4 },
    { id: "e12", from: "G", to: "J", weight: 8 },
    { id: "e13", from: "H", to: "I", weight: 12 },
    { id: "e14", from: "C", to: "D", weight: 6 },
    { id: "e15", from: "D", to: "J", weight: 2 },
    { id: "e16", from: "J", to: "I", weight: 10 },
    { id: "e17", from: "C", to: "F", weight: 1 },
    { id: "e18", from: "F", to: "I", weight: 20 },
    { id: "e19", from: "C", to: "I", weight: 15 },
  ],
};

/** HK1 2022-2023, Câu 3 — second real exam graph, source vertex H per the exam text. */
export const graph20222023: GraphSpec = {
  nodes: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
  positions: {
    D: { x: 220, y: 60 }, F: { x: 460, y: 60 },
    A: { x: 60, y: 220 }, B: { x: 220, y: 220 }, E: { x: 460, y: 220 },
    C: { x: 60, y: 380 }, G: { x: 220, y: 380 }, H: { x: 460, y: 380 },
    I: { x: 700, y: 140 }, J: { x: 700, y: 300 },
  },
  edges: [
    { id: "e1", from: "A", to: "D", weight: 3 },
    { id: "e2", from: "D", to: "B", weight: 4 },
    { id: "e3", from: "A", to: "B", weight: 10 },
    { id: "e4", from: "A", to: "C", weight: 12 },
    { id: "e5", from: "B", to: "E", weight: 6 },
    { id: "e6", from: "E", to: "F", weight: 9 },
    { id: "e7", from: "F", to: "I", weight: 1 },
    { id: "e8", from: "F", to: "J", weight: 5 },
    { id: "e9", from: "B", to: "G", weight: 1 },
    { id: "e10", from: "B", to: "C", weight: 2 },
    { id: "e11", from: "C", to: "G", weight: 3 },
    { id: "e12", from: "C", to: "I", weight: 20 },
    { id: "e13", from: "G", to: "H", weight: 15 },
    { id: "e14", from: "H", to: "I", weight: 10 },
    { id: "e15", from: "H", to: "J", weight: 4 },
    { id: "e16", from: "E", to: "H", weight: 7 },
    { id: "e17", from: "A", to: "F", weight: 8 },
    { id: "e18", from: "I", to: "J", weight: 1 },
  ],
};

/**
 * Đồ thị MINH HỌA — hoàn toàn KHÔNG trùng nhãn đỉnh hay trọng số với 2 đề thật (tránh
 * nhầm lẫn), chỉ giữ chung KIỂU BỐ CỤC LƯỚI (2 đỉnh hàng trên, 4 đỉnh hàng giữa, 4 đỉnh
 * hàng dưới) để độ phức tạp/hình dạng vẫn tương đương đề thi. KHÔNG phải đề thi thật —
 * nếu thấy chữ A-J hoặc số liệu trùng với đề thật xuất hiện ở đây, đó là lỗi. Verified:
 * xem SKILL.md mục "Đồ thị minh họa".
 */
export const graphMinhHoa: GraphSpec = {
  nodes: ["P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y"],
  positions: {
    T: { x: 220, y: 60 }, U: { x: 460, y: 60 },
    P: { x: 60, y: 220 }, Q: { x: 220, y: 220 }, V: { x: 460, y: 220 }, W: { x: 700, y: 220 },
    R: { x: 60, y: 380 }, S: { x: 220, y: 380 }, Y: { x: 460, y: 380 }, X: { x: 700, y: 380 },
  },
  edges: [
    { id: "TU", from: "T", to: "U", weight: 6 },
    { id: "PT", from: "P", to: "T", weight: 14 },
    { id: "TV", from: "T", to: "V", weight: 5 },
    { id: "UV", from: "U", to: "V", weight: 11 },
    { id: "UW", from: "U", to: "W", weight: 9 },
    { id: "PQ", from: "P", to: "Q", weight: 13 },
    { id: "QV", from: "Q", to: "V", weight: 7 },
    { id: "PR", from: "P", to: "R", weight: 8 },
    { id: "QS", from: "Q", to: "S", weight: 16 },
    { id: "QY", from: "Q", to: "Y", weight: 4 },
    { id: "SV", from: "S", to: "V", weight: 12 },
    { id: "VY", from: "V", to: "Y", weight: 3 },
    { id: "WX", from: "W", to: "X", weight: 17 },
    { id: "RS", from: "R", to: "S", weight: 10 },
    { id: "SY", from: "S", to: "Y", weight: 15 },
    { id: "YX", from: "Y", to: "X", weight: 20 },
    { id: "RU", from: "R", to: "U", weight: 18 },
    { id: "UX", from: "U", to: "X", weight: 2 },
    { id: "RX", from: "R", to: "X", weight: 19 },
    { id: "PU", from: "P", to: "U", weight: 7 },
  ],
};
