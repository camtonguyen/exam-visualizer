import type { AlgoResult, AlgoStep, GraphSpec, NodeId } from "@/engine/types";

function computeDegrees(graph: GraphSpec): Record<NodeId, number> {
  const degree: Record<NodeId, number> = {};
  graph.nodes.forEach((n) => (degree[n] = 0));
  graph.edges.forEach((e) => {
    degree[e.from] = (degree[e.from] ?? 0) + 1;
    degree[e.to] = (degree[e.to] ?? 0) + 1;
  });
  return degree;
}

/**
 * Câu 2, Kiểu 3 — Định lý 1.2 (nguyên lý Dirichlet): mọi đơn đồ thị >1 đỉnh luôn có ≥2
 * đỉnh cùng bậc, vì n đỉnh chỉ có n-1 giá trị bậc khả dĩ (0 và n-1 không cùng tồn tại).
 * Runs generically on any small GraphSpec used to model a "cuộc họp"/"bắt tay"-style
 * existence proof — finds the actual matching pair, doesn't just assert the theorem.
 */
export function runPigeonholeProof(graph: GraphSpec): AlgoResult {
  const degree = computeDegrees(graph);
  const n = graph.nodes.length;
  const steps: AlgoStep[] = [];

  steps.push({
    title: `Liệt kê bậc từng đỉnh (${n} đỉnh)`,
    explanation: `Mô hình hóa: mỗi đối tượng → 1 đỉnh, mỗi quan hệ → 1 cạnh. Bậc từng đỉnh: ${graph.nodes
      .map((node) => `${node}=${degree[node]}`)
      .join(", ")}.`,
    nodeHighlights: Object.fromEntries(graph.nodes.map((node) => [node, "idle" as const])),
  });

  steps.push({
    title: "Áp dụng Định lý 1.2 (nguyên lý Dirichlet)",
    explanation: `Đồ thị có ${n} đỉnh, nhưng bậc mỗi đỉnh chỉ nhận được ${n - 1} giá trị khả dĩ (0 đến ${n - 1}) — vì bậc 0 (không quen ai) và bậc ${n - 1} (quen tất cả) không thể cùng tồn tại trong 1 đồ thị. Vậy ${n} đỉnh phải "chia nhau" chỉ ${n - 1} giá trị bậc → theo nguyên lý Dirichlet (chuồng bồ câu), LUÔN có ít nhất 2 đỉnh cùng bậc.`,
    nodeHighlights: Object.fromEntries(graph.nodes.map((node) => [node, "idle" as const])),
  });

  let pair: [NodeId, NodeId] | null = null;
  for (let i = 0; i < graph.nodes.length && !pair; i++) {
    for (let j = i + 1; j < graph.nodes.length; j++) {
      if (degree[graph.nodes[i]] === degree[graph.nodes[j]]) {
        pair = [graph.nodes[i], graph.nodes[j]];
        break;
      }
    }
  }
  if (!pair) {
    throw new Error(
      "Không tìm thấy 2 đỉnh cùng bậc — đồ thị mẫu vi phạm Định lý 1.2, kiểm tra lại data/pigeonholeExamples.ts."
    );
  }
  const [a, b] = pair;

  steps.push({
    title: `Tìm thấy: đỉnh ${a} và ${b} cùng bậc = ${degree[a]}`,
    explanation: `Đúng như dự đoán — đỉnh ${a} và ${b} đều có bậc ${degree[a]}. Đây chính là 2 đối tượng "có cùng số lượng" mà đề yêu cầu chứng minh tồn tại (đpcm).`,
    nodeHighlights: {
      ...Object.fromEntries(graph.nodes.map((node) => [node, "idle" as const])),
      [a]: "path",
      [b]: "path",
    },
  });

  return {
    steps,
    summary: `Đỉnh ${a} và ${b} cùng bậc = ${degree[a]} → luôn tồn tại 2 đối tượng cùng "số lượng" (đpcm).`,
  };
}

/**
 * Câu 2, Kiểu 3 — kỹ thuật chứng minh THỨ HAI của guide (dùng khi đề hỏi về TÍNH CHẴN LẺ
 * thay vì "tồn tại 2 đối tượng bằng nhau"): hệ quả Định lý 1.1 — số đỉnh bậc LẺ trong bất
 * kỳ đồ thị nào cũng luôn là một số CHẴN (vì tổng bậc = 2×số cạnh luôn chẵn, nên tổng các
 * bậc lẻ phải chẵn, nên SỐ LƯỢNG đỉnh bậc lẻ phải chẵn). Đây chính là cách guide giải ví
 * dụ "bắt tay" (số người bắt tay lẻ lần luôn là số chẵn) — khác với Định lý 1.2 ở trên.
 */
export function runOddDegreeCountProof(graph: GraphSpec): AlgoResult {
  const degree = computeDegrees(graph);
  const steps: AlgoStep[] = [];

  steps.push({
    title: `Liệt kê bậc từng đỉnh (${graph.nodes.length} đỉnh)`,
    explanation: `Mô hình hóa: mỗi đối tượng → 1 đỉnh, mỗi quan hệ → 1 cạnh. Bậc từng đỉnh: ${graph.nodes
      .map((node) => `${node}=${degree[node]}`)
      .join(", ")}.`,
    nodeHighlights: Object.fromEntries(graph.nodes.map((node) => [node, "idle" as const])),
  });

  const oddNodes = graph.nodes.filter((node) => degree[node] % 2 === 1);

  steps.push({
    title: "Áp dụng hệ quả Định lý 1.1 (bắt tay)",
    explanation: `Tổng bậc = 2×số cạnh luôn CHẴN. Nếu tách riêng các đỉnh bậc chẵn (tổng của chúng luôn chẵn) thì phần còn lại — tổng bậc của riêng các đỉnh bậc LẺ — cũng phải CHẴN. Mà tổng của một số lẻ các số lẻ luôn LẺ, nên SỐ LƯỢNG đỉnh bậc lẻ bắt buộc phải là một số CHẴN.`,
    nodeHighlights: Object.fromEntries(graph.nodes.map((node) => [node, "idle" as const])),
  });

  steps.push({
    title: `Đếm được ${oddNodes.length} đỉnh bậc lẻ — đúng là số CHẴN`,
    explanation:
      oddNodes.length > 0
        ? `Các đỉnh bậc lẻ: ${oddNodes.map((n) => `${n}(${degree[n]})`).join(", ")} — tổng cộng ${oddNodes.length} đỉnh, một số chẵn, đúng như hệ quả dự đoán (đpcm).`
        : `Không có đỉnh nào bậc lẻ (0 đỉnh) — 0 cũng là một số chẵn, vẫn khớp hệ quả (đpcm).`,
    nodeHighlights: {
      ...Object.fromEntries(graph.nodes.map((node) => [node, "idle" as const])),
      ...Object.fromEntries(oddNodes.map((n) => [n, "path" as const])),
    },
  });

  return {
    steps,
    summary: `${oddNodes.length} đỉnh bậc lẻ (${oddNodes.join(", ") || "không có"}) → số chẵn, đúng hệ quả Định lý 1.1 (đpcm).`,
  };
}
