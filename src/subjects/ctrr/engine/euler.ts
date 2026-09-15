import type { AlgoResult, AlgoStep, GraphSpec, HighlightState, NodeId } from "@/engine/types";

export interface EulerCheckResult {
  connected: boolean;
  /** Undirected: total degree. Directed: out-degree (see `reason` for the in/out story). */
  degrees: Record<NodeId, number>;
  /** Undirected: odd-degree vertices. Directed: vertices where in-degree ≠ out-degree. */
  oddVertices: NodeId[];
  hasCircuit: boolean;
  hasPath: boolean;
  reason: string;
}

function undirectedDegrees(graph: GraphSpec): Record<NodeId, number> {
  const degrees: Record<NodeId, number> = {};
  graph.nodes.forEach((n) => (degrees[n] = 0));
  graph.edges.forEach((e) => {
    degrees[e.from] = (degrees[e.from] ?? 0) + 1;
    degrees[e.to] = (degrees[e.to] ?? 0) + 1;
  });
  return degrees;
}

function isConnectedUndirected(graph: GraphSpec): boolean {
  if (graph.nodes.length === 0) return true;
  const adj = new Map<NodeId, NodeId[]>();
  graph.nodes.forEach((n) => adj.set(n, []));
  graph.edges.forEach((e) => {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from);
  });
  const seen = new Set<NodeId>([graph.nodes[0]]);
  const stack = [graph.nodes[0]];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const next of adj.get(cur) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        stack.push(next);
      }
    }
  }
  return seen.size === graph.nodes.length;
}

/** Directed case — implemented for completeness (SKILL.md); neither real exam graph is
 *  directed, so this branch isn't the pedagogical focus. */
function checkEulerDirected(graph: GraphSpec): EulerCheckResult {
  const outDeg: Record<NodeId, number> = {};
  const inDeg: Record<NodeId, number> = {};
  graph.nodes.forEach((n) => {
    outDeg[n] = 0;
    inDeg[n] = 0;
  });
  graph.edges.forEach((e) => {
    outDeg[e.from] = (outDeg[e.from] ?? 0) + 1;
    inDeg[e.to] = (inDeg[e.to] ?? 0) + 1;
  });

  // Weak connectivity: treat edges as undirected for reachability.
  const connected = isConnectedUndirected(graph);
  const imbalanced = graph.nodes.filter((n) => outDeg[n] !== inDeg[n]);

  const plusOne = graph.nodes.filter((n) => outDeg[n] - inDeg[n] === 1);
  const minusOne = graph.nodes.filter((n) => inDeg[n] - outDeg[n] === 1);
  const hasCircuit = connected && imbalanced.length === 0;
  const hasPath = !hasCircuit && connected && plusOne.length === 1 && minusOne.length === 1 && imbalanced.length === 2;

  let reason: string;
  if (!connected) {
    reason = "Đồ thị không liên thông (kể cả bỏ chiều mũi tên) → không có chu trình lẫn đường đi Euler.";
  } else if (hasCircuit) {
    reason = "Liên thông và deg⁺(v) = deg⁻(v) tại mọi đỉnh → có chu trình Euler có hướng.";
  } else if (hasPath) {
    reason = `Liên thông yếu, đúng 1 đỉnh deg⁺=deg⁻+1 (${plusOne[0]}, "nguồn") và 1 đỉnh deg⁺=deg⁻−1 (${minusOne[0]}, "đích"), còn lại cân bằng → có đường đi Euler có hướng.`;
  } else {
    reason = `Có ${imbalanced.length} đỉnh không cân bằng deg⁺/deg⁻ (${imbalanced.join(", ") || "không có"}) — không thỏa điều kiện chu trình lẫn đường đi Euler có hướng.`;
  }

  return { connected, degrees: outDeg, oddVertices: imbalanced, hasCircuit, hasPath, reason };
}

/**
 * Câu 3a — Euler. Undirected (both real exam graphs): circuit iff connected + every
 * vertex even degree; path iff connected + exactly 2 odd-degree vertices. Directed
 * case included for completeness (see SKILL.md) though not the pedagogical focus here.
 */
export function checkEuler(graph: GraphSpec): EulerCheckResult {
  if (graph.directed) return checkEulerDirected(graph);

  const degrees = undirectedDegrees(graph);
  const connected = isConnectedUndirected(graph);
  const oddVertices = graph.nodes.filter((n) => degrees[n] % 2 === 1);
  const hasCircuit = connected && oddVertices.length === 0;
  const hasPath = connected && oddVertices.length === 2;

  let reason: string;
  if (!connected) {
    reason = "Đồ thị không liên thông → không có chu trình lẫn đường đi Euler.";
  } else if (hasCircuit) {
    reason = "Mọi đỉnh đều bậc chẵn → có chu trình Euler.";
  } else if (hasPath) {
    reason = `Có đúng 2 đỉnh bậc lẻ là ${oddVertices.join(" và ")} → có đường đi Euler (không phải chu trình), xuất phát tại 1 trong 2 đỉnh này.`;
  } else {
    reason = `Có ${oddVertices.length} đỉnh bậc lẻ (${oddVertices.join(", ") || "không có"}) — không phải 0 (chu trình) cũng không phải đúng 2 (đường đi) → KHÔNG có chu trình lẫn đường đi Euler.`;
  }

  return { connected, degrees, oddVertices, hasCircuit, hasPath, reason };
}

/**
 * Fleury's algorithm: at each step, prefer a non-bridge edge; only cross a bridge when
 * it's the only edge left at the current vertex. Returns the vertex sequence, or null if
 * no Euler circuit/path exists. `start` matters only for the path case (must be one of
 * the 2 odd-degree vertices) — defaults to the first odd vertex, or node 0 for a circuit.
 */
export function findEulerTrail(graph: GraphSpec, start?: NodeId): NodeId[] | null {
  const check = checkEuler(graph);
  if (!check.hasCircuit && !check.hasPath) return null;

  const adj = new Map<NodeId, { to: NodeId; edgeId: string }[]>();
  graph.nodes.forEach((n) => adj.set(n, []));
  graph.edges.forEach((e) => {
    adj.get(e.from)?.push({ to: e.to, edgeId: e.id });
    adj.get(e.to)?.push({ to: e.from, edgeId: e.id });
  });

  const remaining = new Set(graph.edges.map((e) => e.id));

  function reachableCount(from: NodeId): number {
    const seen = new Set<NodeId>([from]);
    const stack = [from];
    while (stack.length) {
      const cur = stack.pop()!;
      for (const edge of adj.get(cur) ?? []) {
        if (remaining.has(edge.edgeId) && !seen.has(edge.to)) {
          seen.add(edge.to);
          stack.push(edge.to);
        }
      }
    }
    return seen.size;
  }

  function isBridge(u: NodeId, edgeId: string): boolean {
    const before = reachableCount(u);
    remaining.delete(edgeId);
    const after = reachableCount(u);
    remaining.add(edgeId);
    return after < before;
  }

  let current = start ?? (check.hasPath ? check.oddVertices[0] : graph.nodes[0]);
  const trail: NodeId[] = [current];

  while (remaining.size > 0) {
    const options = (adj.get(current) ?? []).filter((e) => remaining.has(e.edgeId));
    if (options.length === 0) return null; // shouldn't happen for a valid Eulerian graph
    const nonBridge = options.length > 1 ? options.find((opt) => !isBridge(current, opt.edgeId)) : undefined;
    const chosen = nonBridge ?? options[0];
    remaining.delete(chosen.edgeId);
    current = chosen.to;
    trail.push(current);
  }

  return trail;
}

function edgeBetween(graph: GraphSpec, a: NodeId, b: NodeId, used: Set<string>): string | undefined {
  const e = graph.edges.find(
    (e) => !used.has(e.id) && ((e.from === a && e.to === b) || (e.from === b && e.to === a))
  );
  return e?.id;
}

/**
 * Câu 3a — animates the guide's exact procedure: check connectivity → count each
 * vertex's degree one at a time → conclude (highlighting odd vertices if Euler is
 * impossible) → if possible, run Fleury and reveal the trail one edge at a time.
 */
export function runEuler(graph: GraphSpec): AlgoResult {
  const steps: AlgoStep[] = [];
  const check = checkEuler(graph);

  steps.push({
    title: check.connected ? "Kiểm tra liên thông: đồ thị liên thông" : "Kiểm tra liên thông: KHÔNG liên thông",
    explanation: check.connected
      ? "Mọi đỉnh đều có đường đi tới nhau — đủ điều kiện cần để xét chu trình/đường đi Euler."
      : "Đồ thị không liên thông → không cần xét tiếp, kết luận ngay không có Euler.",
    nodeHighlights: check.connected
      ? Object.fromEntries(graph.nodes.map((n) => [n, "active" as const]))
      : {},
  });

  if (!check.connected) {
    steps.push({
      title: "Kết luận: không có chu trình lẫn đường đi Euler",
      explanation: check.reason,
      nodeHighlights: {},
    });
    return { steps, summary: check.reason };
  }

  const countedSoFar: Record<string, string | number> = {};
  graph.nodes.forEach((n) => {
    countedSoFar[n] = check.degrees[n];
    steps.push({
      title: `Đếm bậc đỉnh ${n}`,
      explanation: `deg(${n}) = ${check.degrees[n]}.`,
      nodeHighlights: {
        ...Object.fromEntries(graph.nodes.slice(0, graph.nodes.indexOf(n)).map((m) => [m, "settled" as const])),
        [n]: "active",
      },
      tableSnapshot: { ...countedSoFar },
    });
  });

  if (!check.hasCircuit && !check.hasPath) {
    steps.push({
      title: `Kết luận: KHÔNG có Euler — ${check.oddVertices.length} đỉnh bậc lẻ`,
      explanation: `Đối chiếu điều kiện: chu trình Euler cần 0 đỉnh bậc lẻ, đường đi Euler cần đúng 2 đỉnh bậc lẻ. ${check.reason}`,
      nodeHighlights: {
        ...Object.fromEntries(graph.nodes.map((n) => [n, "settled" as const])),
        ...Object.fromEntries(check.oddVertices.map((n) => [n, "rejected" as const])),
      },
      tableSnapshot: countedSoFar,
    });
    return {
      steps,
      summary: `Không có Euler: ${check.oddVertices.length} đỉnh bậc lẻ (${check.oddVertices.join(", ")}).`,
    };
  }

  steps.push({
    title: check.hasCircuit ? "Kết luận: CÓ chu trình Euler" : "Kết luận: CÓ đường đi Euler",
    explanation: check.reason,
    nodeHighlights: Object.fromEntries(graph.nodes.map((n) => [n, "settled" as const])),
    tableSnapshot: countedSoFar,
  });

  const trail = findEulerTrail(graph);
  if (!trail) {
    // Shouldn't happen once check.hasCircuit/hasPath is true, but keep the result well-formed.
    return { steps, summary: check.reason };
  }

  const usedEdges = new Set<string>();
  const pathEdges: Record<string, HighlightState> = {};
  for (let i = 1; i < trail.length; i++) {
    const edgeId = edgeBetween(graph, trail[i - 1], trail[i], usedEdges);
    if (edgeId) {
      usedEdges.add(edgeId);
      pathEdges[edgeId] = "path";
    }
    steps.push({
      title: `Đi qua cạnh ${trail[i - 1]}–${trail[i]} (bước ${i}/${trail.length - 1})`,
      explanation: `Thuật toán Fleury: ưu tiên cạnh không phải cầu; đến đỉnh ${trail[i]}, xóa cạnh vừa đi khỏi đồ thị còn lại.`,
      nodeHighlights: {
        ...Object.fromEntries(graph.nodes.map((n) => [n, "settled" as const])),
        [trail[i]]: "active",
      },
      edgeHighlights: { ...pathEdges },
    });
  }

  const trailStr = trail.join(" → ");
  return {
    steps,
    summary: `${check.hasCircuit ? "Chu trình" : "Đường đi"} Euler: ${trailStr}.`,
  };
}
