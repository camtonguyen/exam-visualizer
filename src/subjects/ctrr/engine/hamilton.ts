import type { AlgoResult, AlgoStep, GraphSpec, HighlightState, NodeId } from "@/engine/types";

export interface HamiltonStepState {
  /** Edge ids that are locked into the cycle (Quy tắc 2, or a search guess). */
  forcedEdges: Set<string>;
  /** Edge ids ruled out — either excess edges at a saturated vertex (Quy tắc 4) or a
   *  guess that turned out to violate Quy tắc 3. */
  deletedEdges: Set<string>;
}

export interface HamiltonResult {
  possible: boolean;
  reason: string;
  cycle: NodeId[] | null; // null if Quy tắc 1 blocks immediately, or no cycle exists
}

interface Ctx {
  nodes: NodeId[];
  n: number;
  adj: Map<NodeId, { edgeId: string; to: NodeId }[]>;
  edgeOf: Map<string, { from: NodeId; to: NodeId }>;
}

function buildCtx(graph: GraphSpec): Ctx {
  const adj = new Map<NodeId, { edgeId: string; to: NodeId }[]>();
  const edgeOf = new Map<string, { from: NodeId; to: NodeId }>();
  graph.nodes.forEach((n) => adj.set(n, []));
  graph.edges.forEach((e) => {
    adj.get(e.from)?.push({ edgeId: e.id, to: e.to });
    adj.get(e.to)?.push({ edgeId: e.id, to: e.from });
    edgeOf.set(e.id, { from: e.from, to: e.to });
  });
  return { nodes: graph.nodes, n: graph.nodes.length, adj, edgeOf };
}

function availableAt(ctx: Ctx, v: NodeId, state: HamiltonStepState) {
  return (ctx.adj.get(v) ?? []).filter((e) => !state.deletedEdges.has(e.edgeId));
}
function forcedAt(ctx: Ctx, v: NodeId, state: HamiltonStepState) {
  return (ctx.adj.get(v) ?? []).filter((e) => state.forcedEdges.has(e.edgeId));
}

/** Quy tắc 3 check: do the forced edges so far already close a cycle smaller than the
 *  whole graph? A component of the forced-only subgraph where every vertex has forced
 *  degree exactly 2 is necessarily a closed loop — a violation if it's not all n vertices. */
function findEarlySubcycle(ctx: Ctx, state: HamiltonStepState): NodeId[] | null {
  const forcedAdj = new Map<NodeId, NodeId[]>();
  const forcedDeg = new Map<NodeId, number>();
  ctx.nodes.forEach((n) => {
    forcedAdj.set(n, []);
    forcedDeg.set(n, 0);
  });
  state.forcedEdges.forEach((id) => {
    const e = ctx.edgeOf.get(id)!;
    forcedAdj.get(e.from)!.push(e.to);
    forcedAdj.get(e.to)!.push(e.from);
    forcedDeg.set(e.from, (forcedDeg.get(e.from) ?? 0) + 1);
    forcedDeg.set(e.to, (forcedDeg.get(e.to) ?? 0) + 1);
  });

  const visited = new Set<NodeId>();
  for (const start of ctx.nodes) {
    if (visited.has(start) || (forcedDeg.get(start) ?? 0) === 0) continue;
    const comp: NodeId[] = [];
    const stack = [start];
    visited.add(start);
    while (stack.length) {
      const cur = stack.pop()!;
      comp.push(cur);
      for (const nb of forcedAdj.get(cur) ?? []) {
        if (!visited.has(nb)) {
          visited.add(nb);
          stack.push(nb);
        }
      }
    }
    if (comp.length < ctx.n && comp.every((n) => (forcedDeg.get(n) ?? 0) === 2)) {
      return comp;
    }
  }
  return null;
}

/** One round of Quy tắc 2 (a vertex down to exactly 2 available edges must force both)
 *  and Quy tắc 4 (a vertex with 2 forced edges sheds the rest), repeated to a fixed
 *  point, checking Quy tắc 3 after every new forced edge. Appends 1 step per rule firing. */
function propagate(ctx: Ctx, state: HamiltonStepState, steps?: AlgoStep[]): "ok" | "contradiction" {
  let changed = true;
  while (changed) {
    changed = false;
    for (const v of ctx.nodes) {
      const avail = availableAt(ctx, v, state);
      const forced = forcedAt(ctx, v, state);

      if (avail.length < 2) {
        steps?.push({
          title: `Mâu thuẫn tại đỉnh ${v}`,
          explanation: `Đỉnh ${v} không còn đủ 2 cạnh khả dụng để vào chu trình → phương án vừa chọn không hợp lệ.`,
          nodeHighlights: { [v]: "rejected" },
        });
        return "contradiction";
      }

      if (forced.length === 2 && avail.length > 2) {
        const toDelete = avail.filter((e) => !state.forcedEdges.has(e.edgeId));
        if (toDelete.length > 0) {
          toDelete.forEach((e) => state.deletedEdges.add(e.edgeId));
          steps?.push({
            title: `Quy tắc 4: xóa cạnh dư tại đỉnh ${v}`,
            explanation: `Đỉnh ${v} đã đủ 2 cạnh khóa → xóa ${toDelete.length} cạnh còn lại tại ${v} (nối tới ${toDelete
              .map((e) => e.to)
              .join(", ")}) vì không dùng nữa.`,
            edgeHighlights: Object.fromEntries(toDelete.map((e) => [e.edgeId, "rejected" as const])),
            nodeHighlights: { [v]: "settled" },
          });
          changed = true;
        }
      } else if (forced.length < 2 && avail.length === 2) {
        const toForce = avail.filter((e) => !state.forcedEdges.has(e.edgeId));
        if (toForce.length > 0) {
          toForce.forEach((e) => state.forcedEdges.add(e.edgeId));
          steps?.push({
            title: `Quy tắc 2: khóa cạnh tại đỉnh ${v} (bậc 2)`,
            explanation: `Đỉnh ${v} chỉ còn đúng 2 lựa chọn cạnh (tới ${toForce
              .map((e) => e.to)
              .join(", ")}) → cả 2 cạnh này bắt buộc thuộc chu trình Hamilton.`,
            edgeHighlights: Object.fromEntries(toForce.map((e) => [e.edgeId, "path" as const])),
            nodeHighlights: { [v]: "active" },
          });
          changed = true;

          const subcycle = findEarlySubcycle(ctx, state);
          if (subcycle) {
            steps?.push({
              title: "Quy tắc 3: phát hiện chu trình con khép kín sớm",
              explanation: `Các cạnh khóa vừa tạo thành 1 chu trình con qua ${subcycle.length} đỉnh (${subcycle.join(
                ", "
              )}) — chưa đủ ${ctx.n} đỉnh → vi phạm Quy tắc 3, phải loại phương án vừa chọn.`,
              nodeHighlights: Object.fromEntries(subcycle.map((n) => [n, "rejected" as const])),
            });
            return "contradiction";
          }
        }
      }
    }
  }
  return "ok";
}

function pickBranchEdge(ctx: Ctx, state: HamiltonStepState): { edgeId: string; from: NodeId; to: NodeId } | null {
  for (const v of ctx.nodes) {
    const avail = availableAt(ctx, v, state);
    const forced = forcedAt(ctx, v, state);
    if (forced.length < 2 && avail.length > 2) {
      const undecided = avail.find((e) => !state.forcedEdges.has(e.edgeId));
      if (undecided) return { edgeId: undecided.edgeId, from: v, to: undecided.to };
    }
  }
  return null;
}

function cloneState(state: HamiltonStepState): HamiltonStepState {
  return { forcedEdges: new Set(state.forcedEdges), deletedEdges: new Set(state.deletedEdges) };
}

function reconstructCycle(ctx: Ctx, state: HamiltonStepState): NodeId[] | null {
  const forcedAdj = new Map<NodeId, NodeId[]>();
  ctx.nodes.forEach((n) => forcedAdj.set(n, []));
  state.forcedEdges.forEach((id) => {
    const e = ctx.edgeOf.get(id)!;
    forcedAdj.get(e.from)!.push(e.to);
    forcedAdj.get(e.to)!.push(e.from);
  });

  const start = ctx.nodes[0];
  const cycle: NodeId[] = [start];
  let prev: NodeId | null = null;
  let cur = start;
  for (let i = 0; i < ctx.n; i++) {
    const neighbors = forcedAdj.get(cur) ?? [];
    const next = neighbors.find((nb) => nb !== prev) ?? neighbors.find((nb) => nb !== cur);
    if (next === undefined) return null;
    prev = cur;
    cur = next;
    if (i < ctx.n - 1) cycle.push(cur);
  }
  return cycle.length === ctx.n ? cycle : null;
}

/** Simple (unoptimized) DFS over the remaining undecided edges, guided by propagate()
 *  (Quy tắc 2 + 4 + 3) at every node — exactly "dò tiếp thủ công" from SKILL.md, not a
 *  generic backtracking search over all possible cycles. */
function search(ctx: Ctx, state: HamiltonStepState, steps?: AlgoStep[]): NodeId[] | null {
  if (propagate(ctx, state, steps) === "contradiction") return null;

  if (ctx.nodes.every((v) => forcedAt(ctx, v, state).length === 2)) {
    return reconstructCycle(ctx, state);
  }

  const branch = pickBranchEdge(ctx, state);
  if (!branch) return null;

  const forcedGuess = cloneState(state);
  forcedGuess.forcedEdges.add(branch.edgeId);
  steps?.push({
    title: `Dò tiếp: thử khóa cạnh ${branch.from}-${branch.to}`,
    explanation: `Đỉnh ${branch.from} còn nhiều hơn 2 lựa chọn cạnh — chưa quyết định được bằng Quy tắc 2/4, thử cho cạnh ${branch.from}-${branch.to} thuộc chu trình.`,
    edgeHighlights: { [branch.edgeId]: "active" },
  });
  const viaForce = search(ctx, forcedGuess, steps);
  if (viaForce) return viaForce;

  steps?.push({
    title: `Loại: cạnh ${branch.from}-${branch.to} không dùng được`,
    explanation: `Thử khóa cạnh ${branch.from}-${branch.to} dẫn đến mâu thuẫn (xem bước trên) → loại phương án này, thử tiếp không dùng cạnh này.`,
    edgeHighlights: { [branch.edgeId]: "rejected" },
  });

  const excludedGuess = cloneState(state);
  excludedGuess.deletedEdges.add(branch.edgeId);
  return search(ctx, excludedGuess, steps);
}

/** Câu 3b — the 4 practical rules from the lecture (SKILL.md), NOT a generic
 *  backtracking Hamilton search: Quy tắc 1 (degree ≤1 kills it immediately) → Quy tắc 2
 *  (every degree-2 vertex forces both its edges) → Quy tắc 4 (a saturated vertex sheds
 *  its other edges) → Quy tắc 3 (reject any choice that closes a sub-cycle early),
 *  repeating 2+4 to a fixed point and falling back to a simple guided DFS only for
 *  whatever the rules alone can't decide.
 */
export function applyHamiltonRules(graph: GraphSpec): HamiltonResult {
  const ctx = buildCtx(graph);

  const tooLow = graph.nodes.find((v) => (ctx.adj.get(v) ?? []).length <= 1);
  if (tooLow) {
    return {
      possible: false,
      reason: `Đỉnh ${tooLow} có bậc ${(ctx.adj.get(tooLow) ?? []).length} ≤ 1 → không thể thuộc bất kỳ chu trình Hamilton nào (Quy tắc 1).`,
      cycle: null,
    };
  }

  const state: HamiltonStepState = { forcedEdges: new Set(), deletedEdges: new Set() };
  const cycle = search(ctx, state);

  if (!cycle) {
    return {
      possible: false,
      reason: "Không tìm được chu trình Hamilton hợp lệ sau khi áp dụng đủ 4 quy tắc.",
      cycle: null,
    };
  }
  return { possible: true, reason: `Tìm được chu trình Hamilton: ${cycle.join(" → ")} → ${cycle[0]}.`, cycle };
}

export function runHamilton(graph: GraphSpec): AlgoResult {
  const ctx = buildCtx(graph);
  const steps: AlgoStep[] = [];

  const tooLow = graph.nodes.find((v) => (ctx.adj.get(v) ?? []).length <= 1);
  if (tooLow) {
    const deg = (ctx.adj.get(tooLow) ?? []).length;
    steps.push({
      title: `Quy tắc 1: đỉnh ${tooLow} bậc ${deg} ≤ 1`,
      explanation: `Đỉnh ${tooLow} có bậc ${deg} ≤ 1 → không thể thuộc chu trình Hamilton nào (mỗi đỉnh trong chu trình cần đúng 2 cạnh). Dừng ngay, không cần xét tiếp.`,
      nodeHighlights: { [tooLow]: "rejected" },
    });
    return { steps, summary: `Không có chu trình Hamilton — đỉnh ${tooLow} bậc ≤ 1.` };
  }

  steps.push({
    title: "Quy tắc 1: mọi đỉnh đều bậc ≥ 2",
    explanation: "Không có đỉnh nào bậc ≤ 1 → chưa bị loại ngay, tiếp tục xét Quy tắc 2 (đỉnh bậc đúng 2).",
    nodeHighlights: Object.fromEntries(graph.nodes.map((n) => [n, "active" as const])),
  });

  const state: HamiltonStepState = { forcedEdges: new Set(), deletedEdges: new Set() };
  const cycle = search(ctx, state, steps);

  if (!cycle) {
    steps.push({
      title: "Không tìm được chu trình Hamilton",
      explanation: "Đã áp dụng đủ Quy tắc 1-4 và dò hết các phương án nhưng không tồn tại chu trình Hamilton hợp lệ.",
      nodeHighlights: {},
    });
    return { steps, summary: "Không có chu trình Hamilton." };
  }

  const cycleEdges: Record<string, HighlightState> = {};
  for (let i = 0; i < cycle.length; i++) {
    const a = cycle[i];
    const b = cycle[(i + 1) % cycle.length];
    const edge = (ctx.adj.get(a) ?? []).find((e) => e.to === b);
    if (edge) cycleEdges[edge.edgeId] = "path";
  }

  steps.push({
    title: "Hoàn tất — chu trình Hamilton",
    explanation: `Chu trình Hamilton: ${cycle.join(" → ")} → ${cycle[0]}. Đi qua đủ ${cycle.length} đỉnh, mỗi đỉnh đúng 1 lần, khép kín về đỉnh xuất phát.`,
    nodeHighlights: Object.fromEntries(graph.nodes.map((n) => [n, "settled" as const])),
    edgeHighlights: cycleEdges,
  });

  return { steps, summary: `Chu trình Hamilton: ${cycle.join(" → ")} → ${cycle[0]}.` };
}
