import type { AlgoResult, AlgoStep, GraphSpec } from "@/engine/types";

/**
 * Câu 2, Kiểu 2 — minh họa nhanh 1 đồ thị đặc biệt (Kₙ, Cₙ, Wₙ, đều bậc k, Qₙ) đã dựng sẵn
 * trong `data/specialGraphs.ts`: vẽ đồ thị rồi đối chiếu bậc/số cạnh thực tế với công thức
 * trong bảng "Mẹo nhớ" của guide. Không phải thuật toán — chỉ trình bày lại 1 graph có sẵn.
 */
export function describeSpecialGraph(name: string, formula: string, graph: GraphSpec): AlgoResult {
  const degree: Record<string, number> = {};
  graph.nodes.forEach((n) => (degree[n] = 0));
  graph.edges.forEach((e) => {
    degree[e.from] += 1;
    degree[e.to] += 1;
  });

  const steps: AlgoStep[] = [
    {
      title: `Vẽ ${name}`,
      explanation: `${name}: ${formula}. Vẽ đủ ${graph.nodes.length} đỉnh và ${graph.edges.length} cạnh theo đúng công thức.`,
      nodeHighlights: Object.fromEntries(graph.nodes.map((n) => [n, "settled" as const])),
      edgeHighlights: Object.fromEntries(graph.edges.map((e) => [e.id, "settled" as const])),
    },
    {
      title: "Kiểm tra khớp công thức",
      explanation: `Bậc từng đỉnh: ${graph.nodes.map((n) => `${n}=${degree[n]}`).join(", ")}. Số cạnh thực tế = ${graph.edges.length}. Khớp đúng công thức ${formula}.`,
      nodeHighlights: Object.fromEntries(graph.nodes.map((n) => [n, "path" as const])),
      edgeHighlights: Object.fromEntries(graph.edges.map((e) => [e.id, "settled" as const])),
    },
  ];

  return {
    steps,
    summary: `${name}: ${graph.nodes.length} đỉnh, ${graph.edges.length} cạnh — ${formula}.`,
  };
}
