import type { GraphSpec, AlgoResult, AlgoStep, NodeId } from "@/engine/types";

/**
 * Dijkstra shortest-path, instrumented to emit one AlgoStep per "fix a vertex" iteration —
 * mirrors the L(v)/S table taught in the written guide (Chương 5, Bài toán đường đi ngắn nhất).
 */
export function runDijkstra(graph: GraphSpec, source: NodeId): AlgoResult {
  const dist: Record<NodeId, number> = {};
  const prev: Record<NodeId, NodeId | null> = {};
  const settled = new Set<NodeId>();
  const adj: Record<NodeId, { to: NodeId; weight: number; edgeId: string }[]> = {};

  graph.nodes.forEach((n) => {
    dist[n] = Infinity;
    prev[n] = null;
    adj[n] = [];
  });
  graph.edges.forEach((e) => {
    const weight = e.weight ?? 0;
    adj[e.from].push({ to: e.to, weight, edgeId: e.id });
    adj[e.to].push({ to: e.from, weight, edgeId: e.id });
  });
  dist[source] = 0;

  const steps: AlgoStep[] = [];
  const labelTable = () =>
    Object.fromEntries(graph.nodes.map((n) => [n, dist[n] === Infinity ? "∞" : dist[n]]));

  steps.push({
    title: `Khởi tạo: L(${source}) = 0, các đỉnh khác = ∞`,
    explanation: "Bước 1 của thuật toán: L(nguồn) = 0, mọi đỉnh còn lại = ∞, S = ∅.",
    nodeHighlights: { [source]: "active" },
    tableSnapshot: labelTable(),
  });

  while (settled.size < graph.nodes.length) {
    let u: NodeId | null = null;
    let best = Infinity;
    for (const n of graph.nodes) {
      if (!settled.has(n) && dist[n] < best) {
        best = dist[n];
        u = n;
      }
    }
    if (u === null) break; // remaining nodes unreachable
    settled.add(u);

    const relaxedEdges: Record<string, "active"> = {};
    for (const { to, weight, edgeId } of adj[u]) {
      if (settled.has(to)) continue;
      const candidate = dist[u] + weight;
      if (candidate < dist[to]) {
        dist[to] = candidate;
        prev[to] = u;
        relaxedEdges[edgeId] = "active";
      }
    }

    steps.push({
      title: `Cố định đỉnh ${u} (L=${dist[u]})`,
      explanation: `Chọn u = ${u} vì có nhãn nhỏ nhất trong các đỉnh chưa cố định. Cập nhật nhãn các đỉnh kề theo L(v) = min(L(v), L(u)+w(u,v)).`,
      nodeHighlights: {
        ...Object.fromEntries([...settled].map((n) => [n, "settled" as const])),
        [u]: "active",
      },
      edgeHighlights: relaxedEdges,
      tableSnapshot: labelTable(),
    });
  }

  // Build final shortest-path summary + highlight the path tree
  const pathEdges: Record<string, "path"> = {};
  graph.nodes.forEach((n) => {
    if (prev[n]) {
      const e = graph.edges.find(
        (e) => (e.from === prev[n] && e.to === n) || (e.to === prev[n] && e.from === n)
      );
      if (e) pathEdges[e.id] = "path";
    }
  });
  steps.push({
    title: "Hoàn tất — cây đường đi ngắn nhất",
    explanation: "Nhãn cuối cùng của mỗi đỉnh là độ dài đường đi ngắn nhất từ nguồn; truy ngược prev[v] để nêu cụ thể đường đi.",
    nodeHighlights: Object.fromEntries(graph.nodes.map((n) => [n, "settled" as const])),
    edgeHighlights: pathEdges,
    tableSnapshot: labelTable(),
  });

  const summary = graph.nodes
    .filter((n) => n !== source)
    .map((n) => `${source}→${n}: ${dist[n]}`)
    .join(" · ");

  return { steps, summary };
}
