import type { GraphSpec } from "@/engine/types";

/**
 * Ví dụ minh họa thêm (KHÔNG phải đề thi thật) — 5 loại đồ thị đặc biệt từ bảng "Mẹo nhớ"
 * của Câu 2 Kiểu 2 trong guide (Kₙ, Cₙ, Wₙ, đều bậc k, Qₙ), mỗi đồ thị chọn n nhỏ nhất dễ
 * vẽ để minh họa công thức |V|/bậc/|E|. Dùng chung cho cả 3 Kiểu của Câu 2: Kiểu 1 (kiểm
 * tra dãy bậc của chúng đều đồ thị hóa được), Kiểu 2 (tham khảo hình dạng khi đề yêu cầu
 * vẽ 1 đồ thị đặc biệt có tên gọi sẵn), Kiểu 3 (một số minh họa cho nguyên lý Dirichlet
 * khi mọi đỉnh cùng bậc).
 */

export interface SpecialGraphExample {
  key: string;
  name: string;
  formula: string; // the guide's own |V|/bậc/|E| formula, for display
  graph: GraphSpec;
}

function pentagon(labels: string[], radius: number, cx: number, cy: number): Record<string, { x: number; y: number }> {
  const pos: Record<string, { x: number; y: number }> = {};
  labels.forEach((label, i) => {
    const angle = (2 * Math.PI * i) / labels.length - Math.PI / 2;
    pos[label] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });
  return pos;
}

function allPairs(labels: string[]): [string, string][] {
  const pairs: [string, string][] = [];
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) pairs.push([labels[i], labels[j]]);
  }
  return pairs;
}

// --- Kₙ (đầy đủ): n đỉnh, bậc n-1, n(n-1)/2 cạnh. Chọn n=5. ---
const k5Labels = ["A", "B", "C", "D", "E"];
export const completeGraphK5: GraphSpec = {
  nodes: k5Labels,
  positions: pentagon(k5Labels, 120, 200, 200),
  edges: allPairs(k5Labels).map(([a, b], i) => ({ id: `k${i}`, from: a, to: b })),
};

// --- Cₙ (vòng): n đỉnh, bậc 2, n cạnh. Chọn n=6. ---
const c6Labels = ["A", "B", "C", "D", "E", "F"];
export const cycleGraphC6: GraphSpec = {
  nodes: c6Labels,
  positions: pentagon(c6Labels, 120, 200, 200),
  edges: c6Labels.map((label, i) => ({
    id: `c${i}`,
    from: label,
    to: c6Labels[(i + 1) % c6Labels.length],
  })),
};

// --- Wₙ (bánh xe): vành n đỉnh bậc 3 + 1 tâm bậc n, 2n cạnh. Chọn n=5 (vành) → 6 đỉnh. ---
const w5RimLabels = ["A", "B", "C", "D", "E"];
const w5RimPos = pentagon(w5RimLabels, 120, 200, 200);
export const wheelGraphW5: GraphSpec = {
  nodes: [...w5RimLabels, "O"],
  positions: { ...w5RimPos, O: { x: 200, y: 200 } },
  edges: [
    ...w5RimLabels.map((label, i) => ({
      id: `w-rim${i}`,
      from: label,
      to: w5RimLabels[(i + 1) % w5RimLabels.length],
    })),
    ...w5RimLabels.map((label, i) => ({ id: `w-spoke${i}`, from: "O", to: label })),
  ],
};

// --- Đều bậc k=3: lăng trụ tam giác (2 tam giác nối bằng 3 cạnh dọc), n=6, 9 cạnh. ---
export const regular3Graph: GraphSpec = {
  nodes: ["A", "B", "C", "D", "E", "F"],
  positions: {
    A: { x: 130, y: 80 },
    B: { x: 270, y: 80 },
    C: { x: 200, y: 190 },
    D: { x: 130, y: 320 },
    E: { x: 270, y: 320 },
    F: { x: 200, y: 210 },
  },
  edges: [
    { id: "r1", from: "A", to: "B" },
    { id: "r2", from: "B", to: "C" },
    { id: "r3", from: "C", to: "A" },
    { id: "r4", from: "D", to: "E" },
    { id: "r5", from: "E", to: "F" },
    { id: "r6", from: "F", to: "D" },
    { id: "r7", from: "A", to: "D" },
    { id: "r8", from: "B", to: "E" },
    { id: "r9", from: "C", to: "F" },
  ],
};

// --- Qₙ (n-khối): 2ⁿ đỉnh (chuỗi bit), bậc n, n·2ⁿ⁻¹ cạnh — nối 2 đỉnh khác đúng 1 bit.
// Chọn n=3 → khối lập phương quen thuộc (8 đỉnh, bậc 3, 12 cạnh).
function hammingDistanceOne(a: string, b: string): boolean {
  let diff = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
  return diff === 1;
}
const q3Labels = Array.from({ length: 8 }, (_, i) => i.toString(2).padStart(3, "0"));
const q3Positions: Record<string, { x: number; y: number }> = {
  "000": { x: 120, y: 320 },
  "010": { x: 280, y: 320 },
  "110": { x: 280, y: 160 },
  "100": { x: 120, y: 160 },
  "001": { x: 180, y: 260 },
  "011": { x: 340, y: 260 },
  "111": { x: 340, y: 100 },
  "101": { x: 180, y: 100 },
};
export const hypercubeGraphQ3: GraphSpec = {
  nodes: q3Labels,
  positions: q3Positions,
  edges: allPairs(q3Labels)
    .filter(([a, b]) => hammingDistanceOne(a, b))
    .map(([a, b], i) => ({ id: `q${i}`, from: a, to: b })),
};

export const specialGraphs: SpecialGraphExample[] = [
  { key: "k5", name: "Đầy đủ K₅", formula: "|V|=5, bậc=4 (mọi đỉnh), |E|=5·4/2=10", graph: completeGraphK5 },
  { key: "c6", name: "Vòng C₆", formula: "|V|=6, bậc=2 (mọi đỉnh), |E|=6", graph: cycleGraphC6 },
  { key: "w5", name: "Bánh xe W₅", formula: "|V|=5+1=6, bậc=3 (vành)/5 (tâm), |E|=2·5=10", graph: wheelGraphW5 },
  { key: "r3", name: "Đều bậc k=3", formula: "|V|=6, bậc=3 (mọi đỉnh), |E|=6·3/2=9", graph: regular3Graph },
  { key: "q3", name: "Khối lập phương Q₃", formula: "|V|=2³=8, bậc=3 (mọi đỉnh), |E|=3·2²=12", graph: hypercubeGraphQ3 },
];
