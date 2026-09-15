import type { AlgoResult, AlgoStep, GraphSpec, NodeId } from "@/engine/types";

export interface KruskalStepInfo {
  edgeId: string;
  chosen: boolean; // true = added to the spanning tree, false = rejected (would close a cycle)
  componentsBefore: NodeId[][]; // connected groups right before this edge was examined
}

export interface MaxSpanningTreeResult {
  treeEdges: string[]; // edge ids, in the order they were chosen
  totalWeight: number;
}

/** Standard union-find with path compression — the graphs here are only 10 vertices, so
 *  this is just for clarity, not because it's needed for performance. */
export function buildUnionFind(nodes: NodeId[]): {
  find: (x: NodeId) => NodeId;
  union: (a: NodeId, b: NodeId) => void;
} {
  const parent = new Map<NodeId, NodeId>();
  nodes.forEach((n) => parent.set(n, n));

  function find(x: NodeId): NodeId {
    let root = x;
    while (parent.get(root) !== root) root = parent.get(root)!;
    let cur = x;
    while (parent.get(cur) !== root) {
      const next = parent.get(cur)!;
      parent.set(cur, root);
      cur = next;
    }
    return root;
  }

  function union(a: NodeId, b: NodeId): void {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  }

  return { find, union };
}

function componentsOf(nodes: NodeId[], find: (x: NodeId) => NodeId): NodeId[][] {
  const groups = new Map<NodeId, NodeId[]>();
  nodes.forEach((n) => {
    const root = find(n);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(n);
  });
  return [...groups.values()];
}

/**
 * "Kruskal đảo dấu" — sort edges DESCENDING by weight (max spanning tree, not min), take
 * an edge unless its 2 endpoints are already in the same union-find group (would close a
 * cycle), stop once n-1 edges are chosen.
 */
export function maxSpanningTree(graph: GraphSpec): MaxSpanningTreeResult {
  const sorted = [...graph.edges].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  const uf = buildUnionFind(graph.nodes);
  const need = graph.nodes.length - 1;
  const treeEdges: string[] = [];
  let totalWeight = 0;

  for (const e of sorted) {
    if (treeEdges.length >= need) break;
    if (uf.find(e.from) !== uf.find(e.to)) {
      uf.union(e.from, e.to);
      treeEdges.push(e.id);
      totalWeight += e.weight ?? 0;
    }
  }

  return { treeEdges, totalWeight };
}

function edgeLabel(graph: GraphSpec, edgeId: string): string {
  const e = graph.edges.find((e) => e.id === edgeId)!;
  return `${e.from}${e.to}=${e.weight ?? 0}`;
}

/**
 * Câu 3d — animates the guide's 4-step Kruskal-đảo-dấu procedure exactly: sort
 * descending → union-find init → walk the sorted list, choosing/rejecting one edge per
 * step → stop the instant n-1 edges are chosen (never animates edges past that point).
 */
export function runKruskalMax(graph: GraphSpec): AlgoResult {
  const sorted = [...graph.edges].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  const uf = buildUnionFind(graph.nodes);
  const need = graph.nodes.length - 1;
  const steps: AlgoStep[] = [];
  const infos: KruskalStepInfo[] = [];

  steps.push({
    title: `Bước 1: sắp ${sorted.length} cạnh theo trọng số GIẢM DẦN`,
    explanation: `Danh sách cạnh đã sắp: ${sorted
      .map((e) => `${e.from}${e.to}=${e.weight ?? 0}`)
      .join(", ")}. Khởi tạo union-find: mỗi đỉnh tự thành 1 nhóm riêng.`,
    nodeHighlights: {},
    edgeHighlights: Object.fromEntries(sorted.map((e) => [e.id, "idle" as const])),
  });

  const edgeState: Record<string, "path" | "rejected" | "idle"> = Object.fromEntries(
    sorted.map((e) => [e.id, "idle" as const])
  );
  const inTree = new Set<NodeId>();
  let chosenCount = 0;

  for (const e of sorted) {
    if (chosenCount >= need) break;

    const componentsBefore = componentsOf(graph.nodes, uf.find);
    const rootFrom = uf.find(e.from);
    const rootTo = uf.find(e.to);
    const chosen = rootFrom !== rootTo;

    infos.push({ edgeId: e.id, chosen, componentsBefore });

    if (chosen) {
      uf.union(e.from, e.to);
      edgeState[e.id] = "path";
      inTree.add(e.from);
      inTree.add(e.to);
      chosenCount++;
    } else {
      edgeState[e.id] = "rejected";
    }

    steps.push({
      title: `Xét cạnh ${e.from}${e.to}=${e.weight ?? 0} (đã chọn ${chosenCount}/${need})`,
      explanation: chosen
        ? `Chọn — ${e.from} và ${e.to} đang ở 2 nhóm khác nhau, thêm cạnh này không tạo chu trình.`
        : `Loại — ${e.from} và ${e.to} đã cùng nhóm, thêm cạnh này sẽ tạo chu trình.`,
      nodeHighlights: {
        ...Object.fromEntries([...inTree].map((n) => [n, "settled" as const])),
        [e.from]: "active",
        [e.to]: "active",
      },
      edgeHighlights: { ...edgeState },
    });
  }

  // Edges never reached (we stopped early once n-1 were chosen) stay idle in the final step.
  const totalWeight = infos
    .filter((i) => i.chosen)
    .reduce((sum, i) => sum + (graph.edges.find((e) => e.id === i.edgeId)!.weight ?? 0), 0);

  steps.push({
    title: `Hoàn tất — cây khung trọng số lớn nhất (${chosenCount} cạnh)`,
    explanation: `Đã chọn đủ ${need} cạnh (n-1), dừng lại. Cây khung: ${infos
      .filter((i) => i.chosen)
      .map((i) => edgeLabel(graph, i.edgeId))
      .join(", ")}. Tổng trọng số = ${totalWeight}.`,
    nodeHighlights: Object.fromEntries(graph.nodes.map((n) => [n, "settled" as const])),
    edgeHighlights: { ...edgeState },
  });

  return {
    steps,
    summary: `Cây khung trọng số lớn nhất: ${infos
      .filter((i) => i.chosen)
      .map((i) => edgeLabel(graph, i.edgeId))
      .join(", ")} — tổng = ${totalWeight}.`,
  };
}
