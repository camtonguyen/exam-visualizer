import type { AlgoStep, GraphSpec } from "@/engine/types";

/**
 * Câu 2, Kiểu 2 — "phác họa đồ thị thỏa tính chất cho trước" is a creative construction
 * problem, NOT a general algorithm (see SKILL.md and docs/PLAN.md): don't try to
 * generalize this into "generate any graph satisfying arbitrary properties".
 *
 * Real exam data — HK1 2023-2024, Câu 2 Kiểu 2 (from Huong_dan_giai_de_cuoi_ky_CTRR.docx):
 * "Hãy phác họa đồ thị G có các tính chất sau:
 *  a) Đồ thị có hướng, không đầy đủ, liên thông mạnh, có ít nhất 4 đỉnh.
 *  b) Đa đồ thị vô hướng, có ít nhất 5 đỉnh, không có chu trình Euler (giải thích vì sao
 *     không có) nhưng có chu trình Hamilton (ghi tên chu trình)."
 * These are the guide's own worked solutions to a) and b), transcribed exactly — not
 * invented. If a future exam gives a different property set, write a NEW scripted
 * example next to these instead of trying to make either one generic.
 */

export interface ScriptedGraphBuild {
  /** graphs[i] is the GraphSpec to render alongside steps[i] — the graph literally grows
   *  from step to step, so (unlike every other module) each step needs its own GraphSpec. */
  graphs: GraphSpec[];
  steps: AlgoStep[];
  summary: string;
}

// ---------------------------------------------------------------------------
// a) Đồ thị có hướng, không đầy đủ, liên thông mạnh, có ít nhất 4 đỉnh.
// Guide's answer: 4 đỉnh A,B,C,D, đúng 1 chu trình có hướng A→B→C→D→A.
// ---------------------------------------------------------------------------

const positionsA = {
  A: { x: 100, y: 90 },
  B: { x: 380, y: 90 },
  C: { x: 380, y: 320 },
  D: { x: 100, y: 320 },
};

function graphA(nodes: string[], edgeIds: string[]): GraphSpec {
  const allEdges = [
    { id: "a1", from: "A", to: "B" },
    { id: "a2", from: "B", to: "C" },
    { id: "a3", from: "C", to: "D" },
    { id: "a4", from: "D", to: "A" },
  ];
  return { nodes, edges: allEdges.filter((e) => edgeIds.includes(e.id)), positions: positionsA, directed: true };
}

export const directedStronglyConnectedNotComplete: ScriptedGraphBuild = {
  graphs: [
    graphA(["A"], []),
    graphA(["A", "B"], ["a1"]),
    graphA(["A", "B", "C"], ["a1", "a2"]),
    graphA(["A", "B", "C", "D"], ["a1", "a2", "a3"]),
    graphA(["A", "B", "C", "D"], ["a1", "a2", "a3", "a4"]),
    graphA(["A", "B", "C", "D"], ["a1", "a2", "a3", "a4"]),
    graphA(["A", "B", "C", "D"], ["a1", "a2", "a3", "a4"]),
  ],
  steps: [
    {
      title: "Bước 1: chọn 4 đỉnh, thêm đỉnh A",
      explanation: "Đề yêu cầu ≥4 đỉnh — chọn đúng 4 đỉnh A, B, C, D (số đỉnh tối thiểu theo đề).",
      nodeHighlights: { A: "active" },
    },
    {
      title: "Bước 2: thêm đỉnh B, nối cạnh có hướng A→B",
      explanation: "Vẽ cạnh có hướng A→B.",
      nodeHighlights: { A: "settled", B: "active" },
      edgeHighlights: { a1: "active" },
    },
    {
      title: "Bước 3: thêm đỉnh C, nối cạnh có hướng B→C",
      explanation: "Vẽ cạnh có hướng B→C, tiếp tục kéo dài chu trình.",
      nodeHighlights: { A: "settled", B: "settled", C: "active" },
      edgeHighlights: { a1: "settled", a2: "active" },
    },
    {
      title: "Bước 4: thêm đỉnh D, nối cạnh có hướng C→D",
      explanation: "Vẽ cạnh có hướng C→D.",
      nodeHighlights: { A: "settled", B: "settled", C: "settled", D: "active" },
      edgeHighlights: { a1: "settled", a2: "settled", a3: "active" },
    },
    {
      title: "Bước 5: nối D→A để đóng chu trình có hướng",
      explanation: "Vẽ đúng 4 cạnh có hướng tạo thành 1 chu trình có hướng: A→B→C→D→A.",
      nodeHighlights: { A: "settled", B: "settled", C: "settled", D: "settled" },
      edgeHighlights: { a1: "settled", a2: "settled", a3: "settled", a4: "active" },
    },
    {
      title: "Kiểm tra: có hướng + liên thông mạnh",
      explanation:
        "Có hướng — mọi cạnh đều có mũi tên một chiều. Liên thông mạnh — từ bất kỳ đỉnh nào cũng đi theo chiều mũi tên vòng quanh chu trình để đến được mọi đỉnh còn lại (vd từ B: B→C→D→A, đi hết chu trình là tới đủ mọi đỉnh).",
      nodeHighlights: { A: "path", B: "path", C: "path", D: "path" },
      edgeHighlights: { a1: "path", a2: "path", a3: "path", a4: "path" },
    },
    {
      title: "Kiểm tra: không đầy đủ",
      explanation:
        "Chỉ có 4 cạnh trong khi đồ thị có hướng đầy đủ 4 đỉnh cần đến 4×3=12 cạnh (mỗi cặp đỉnh 2 chiều) — ví dụ không hề có cạnh A→C hay B→D. Vậy đồ thị trên thỏa mãn đủ cả 3 tính chất: có hướng, liên thông mạnh, không đầy đủ.",
      nodeHighlights: { A: "settled", B: "settled", C: "settled", D: "settled" },
      edgeHighlights: { a1: "settled", a2: "settled", a3: "settled", a4: "settled" },
    },
  ],
  summary:
    "Đồ thị có hướng 4 đỉnh, chu trình có hướng duy nhất A→B→C→D→A — có hướng ✓, liên thông mạnh ✓ (đi hết vòng tới mọi đỉnh), không đầy đủ ✓ (4 cạnh, thiếu 8 cạnh so với 12 cạnh của đồ thị có hướng đầy đủ).",
};

// ---------------------------------------------------------------------------
// b) Đa đồ thị vô hướng, ≥5 đỉnh, không có chu trình Euler nhưng có chu trình Hamilton.
// Guide's answer: 5 đỉnh A,B,C,D,E xếp vòng A-B-C-D-E-A, thêm 1 cạnh A-B song song.
// ---------------------------------------------------------------------------

const positionsB = {
  A: { x: 240, y: 40 },
  B: { x: 420, y: 170 },
  C: { x: 350, y: 380 },
  D: { x: 130, y: 380 },
  E: { x: 60, y: 170 },
};

function graphB(nodes: string[], edgeIds: string[]): GraphSpec {
  const allEdges = [
    { id: "b1", from: "A", to: "B" },
    { id: "b1b", from: "A", to: "B" },
    { id: "b2", from: "B", to: "C" },
    { id: "b3", from: "C", to: "D" },
    { id: "b4", from: "D", to: "E" },
    { id: "b5", from: "E", to: "A" },
  ];
  return { nodes, edges: allEdges.filter((e) => edgeIds.includes(e.id)), positions: positionsB };
}

export const multigraphNoEulerHasHamilton: ScriptedGraphBuild = {
  graphs: [
    graphB(["A"], []),
    graphB(["A", "B"], ["b1"]),
    graphB(["A", "B", "C"], ["b1", "b2"]),
    graphB(["A", "B", "C", "D"], ["b1", "b2", "b3"]),
    graphB(["A", "B", "C", "D", "E"], ["b1", "b2", "b3", "b4"]),
    graphB(["A", "B", "C", "D", "E"], ["b1", "b2", "b3", "b4", "b5"]),
    graphB(["A", "B", "C", "D", "E"], ["b1", "b2", "b3", "b4", "b5", "b1b"]),
    graphB(["A", "B", "C", "D", "E"], ["b1", "b2", "b3", "b4", "b5", "b1b"]),
    graphB(["A", "B", "C", "D", "E"], ["b1", "b2", "b3", "b4", "b5", "b1b"]),
    graphB(["A", "B", "C", "D", "E"], ["b1", "b2", "b3", "b4", "b5", "b1b"]),
  ],
  steps: [
    { title: "Bước 1: thêm đỉnh A", explanation: "Đề yêu cầu ≥5 đỉnh — chọn 5 đỉnh A, B, C, D, E.", nodeHighlights: { A: "active" } },
    {
      title: "Bước 2: thêm đỉnh B, nối cạnh A-B",
      explanation: "Bắt đầu dựng 1 chu trình đơn (vòng tròn) qua 5 đỉnh.",
      nodeHighlights: { A: "settled", B: "active" },
      edgeHighlights: { b1: "active" },
    },
    {
      title: "Bước 3: thêm đỉnh C, nối cạnh B-C",
      explanation: "Tiếp tục vòng tròn.",
      nodeHighlights: { A: "settled", B: "settled", C: "active" },
      edgeHighlights: { b1: "settled", b2: "active" },
    },
    {
      title: "Bước 4: thêm đỉnh D, nối cạnh C-D",
      explanation: "Tiếp tục vòng tròn.",
      nodeHighlights: { A: "settled", B: "settled", C: "settled", D: "active" },
      edgeHighlights: { b1: "settled", b2: "settled", b3: "active" },
    },
    {
      title: "Bước 5: thêm đỉnh E, nối cạnh D-E",
      explanation: "Tiếp tục vòng tròn.",
      nodeHighlights: { A: "settled", B: "settled", C: "settled", D: "settled", E: "active" },
      edgeHighlights: { b1: "settled", b2: "settled", b3: "settled", b4: "active" },
    },
    {
      title: "Bước 6: nối E-A để khép kín vòng tròn A-B-C-D-E-A",
      explanation:
        "Khép kín chu trình đơn A-B-C-D-E-A — mọi đỉnh đều bậc 2 (chẵn). Chu trình đơn này đã CHÍNH LÀ 1 chu trình Hamilton (đi qua đủ 5 đỉnh, mỗi đỉnh đúng 1 lần, quay lại đỉnh đầu) — cứ giữ nguyên, không đụng tới ở các bước sau.",
      nodeHighlights: { A: "settled", B: "settled", C: "settled", D: "settled", E: "settled" },
      edgeHighlights: { b1: "settled", b2: "settled", b3: "settled", b4: "settled", b5: "active" },
    },
    {
      title: "Bước 7: thêm cạnh A-B thứ hai song song → đa đồ thị",
      explanation:
        "Đề yêu cầu ĐA đồ thị (được phép có cạnh lặp) — vẽ thêm 1 cạnh A-B song song với cạnh A-B đã có, phá vỡ tính \"mọi đỉnh bậc chẵn\" mà không đụng tới chu trình Hamilton gốc.",
      nodeHighlights: { A: "active", B: "active", C: "settled", D: "settled", E: "settled" },
      edgeHighlights: { b1: "settled", b2: "settled", b3: "settled", b4: "settled", b5: "settled", b1b: "active" },
    },
    {
      title: "Bước 8: kiểm tra Euler — tính bậc từng đỉnh",
      explanation:
        "deg(A) = 3 (B, E, và cạnh B lặp), deg(B) = 3 (A, C, và cạnh A lặp) — cả hai đều bậc LẺ. deg(C)=deg(D)=deg(E)=2. Chu trình Euler đòi hỏi MỌI đỉnh bậc chẵn — A, B vi phạm → đồ thị KHÔNG có chu trình Euler, đúng yêu cầu đề.",
      nodeHighlights: { A: "rejected", B: "rejected", C: "settled", D: "settled", E: "settled" },
      edgeHighlights: { b1: "settled", b2: "settled", b3: "settled", b4: "settled", b5: "settled", b1b: "settled" },
    },
    {
      title: "Bước 9: chỉ ra chu trình Hamilton A→B→C→D→E→A",
      explanation:
        "Dùng 1 trong 2 cạnh A-B, đi A→B→C→D→E→A: qua đủ 5 đỉnh, mỗi đỉnh đúng 1 lần, quay về đúng đỉnh xuất phát — hoàn toàn không bị ảnh hưởng bởi cạnh lặp thêm vào.",
      nodeHighlights: { A: "path", B: "path", C: "path", D: "path", E: "path" },
      edgeHighlights: { b1: "path", b1b: "idle", b2: "path", b3: "path", b4: "path", b5: "path" },
    },
    {
      title: "Kiểm tra lại đủ mọi tính chất đề yêu cầu",
      explanation:
        "Đa đồ thị ✓ (2 cạnh song song A-B). ≥5 đỉnh ✓. Không có chu trình Euler ✓ (A, B bậc lẻ). Có chu trình Hamilton ✓ (A→B→C→D→E→A). Đồ thị vừa dựng thỏa mãn TẤT CẢ các tính chất đề yêu cầu.",
      nodeHighlights: { A: "settled", B: "settled", C: "settled", D: "settled", E: "settled" },
      edgeHighlights: { b1: "settled", b2: "settled", b3: "settled", b4: "settled", b5: "settled", b1b: "settled" },
    },
  ],
  summary:
    "Đồ thị vô hướng 5 đỉnh, 6 cạnh (1 cặp song song A-B) — đa đồ thị, không có chu trình Euler (A, B bậc lẻ), có chu trình Hamilton A→B→C→D→E→A.",
};
