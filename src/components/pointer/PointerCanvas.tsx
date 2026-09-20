import { motion } from "framer-motion";
import type { AlgoStep, HighlightState, PointerNode } from "@/engine/types";
import { NODE_COLOR } from "@/components/graph/GraphCanvas";

interface Props {
  step: AlgoStep;
}

const LINK_W = 20; // width of a pNext / pPre cell
const PADTOP = 56; // room for up to 3 stacked pointer labels above row 0
const LABEL_LINE = 14;
const GY = 56; // gap between rows
const ARC_NEXT = 40; // depth of the arc a pNext skipping over nodes takes (drawn below the row)
const ARC_PREV = 60; // same for pPre — deeper so the two arcs don't overlap

/**
 * Draws `step.pointerSnapshot` the way the exam's hand-drawn diagrams do: boxes [ data | • ] (or
 * [ • | data | • ] for a doubly linked list, when nodes carry `prev`) with an arrow from each link cell to
 * the node it points to (or "NULL"), and named pointers (pHead, pTop, pFront, p, prev…) as labels
 * above/below the node they point to. Row 0 labels sit above, row ≥ 1 below, so a freshly allocated `p`
 * under the chain reads as "not linked yet". Pointers to NULL or to freed memory are listed as chips under
 * the drawing; a pNext/pPre that still points at freed memory ends in a red "freed" stub. Positions snap
 * between steps (arrows must always agree with the boxes); only nodes fade in.
 */
export function PointerCanvas({ step }: Props) {
  const snap = step.pointerSnapshot;
  if (!snap) return null;

  const doubly = snap.nodes.some((n) => n.prev !== undefined);
  const W = doubly ? 100 : 64;
  const H = doubly ? 44 : 36;
  const GX = doubly ? 56 : 40;
  const PADX = doubly ? 48 : 16;
  const x = (col: number) => PADX + col * (W + GX);
  const y = (row: number) => PADTOP + row * (H + GY);
  const nextDot = (n: PointerNode) => ({ x: x(n.col) + W - LINK_W / 2, y: y(n.row) + H / 2 + (doubly ? -7 : 0) });
  const prevDot = (n: PointerNode) => ({ x: x(n.col) + LINK_W / 2, y: y(n.row) + H / 2 + 7 });

  const byId = new Map(snap.nodes.map((n) => [n.id, n]));
  const maxCol = Math.max(0, ...snap.nodes.map((n) => n.col));
  const maxRow = Math.max(0, ...snap.nodes.map((n) => n.row));

  const arcs = snap.nodes.some((n) => {
    const t = n.next ? byId.get(n.next) : undefined;
    const u = n.prev ? byId.get(n.prev) : undefined;
    return (t && t.row === n.row && Math.abs(t.col - n.col) > 1) || (u && u.row === n.row && Math.abs(u.col - n.col) > 1);
  });
  const width = PADX * 2 + (maxCol + 1) * (W + GX) + 40;
  const height = PADTOP + (maxRow + 1) * (H + GY) - GY + 12 + (maxRow > 0 ? 3 * LABEL_LINE : 0) + (arcs ? ARC_PREV : 0);

  const labelsByNode = new Map<string, string[]>();
  const chips: { name: string; kind: "null" | "dangling" }[] = [];
  for (const [name, target] of Object.entries(snap.pointers)) {
    if (target === null) chips.push({ name, kind: "null" });
    else if (!byId.has(target)) chips.push({ name, kind: "dangling" });
    else labelsByNode.set(target, [...(labelsByNode.get(target) ?? []), name]);
  }

  /** Path of an arrow from `from`'s dot to `to`: straight when adjacent / on another row, an arc under the row when it skips nodes. */
  const route = (from: PointerNode, to: PointerNode, start: { x: number; y: number }, kind: "next" | "prev") => {
    if (to.row !== from.row) {
      const above = to.row < from.row;
      return `M ${start.x} ${start.y} L ${x(to.col) + W / 2} ${y(to.row) + (above ? H : 0)}`;
    }
    const adjacent = Math.abs(to.col - from.col) === 1;
    if (adjacent) {
      const forward = to.col > from.col;
      const endX = forward ? x(to.col) : x(to.col) + W;
      return `M ${start.x} ${start.y} L ${endX} ${start.y}`;
    }
    const d = kind === "next" ? ARC_NEXT : ARC_PREV;
    const ex = x(to.col) + W / 2;
    const ey = y(to.row) + H;
    return `M ${start.x} ${start.y} C ${start.x} ${start.y + d}, ${ex} ${ey + d}, ${ex} ${ey}`;
  };

  const linkArrow = (from: PointerNode, id: string | null | undefined, kind: "next" | "prev") => {
    if (id === undefined) return null;
    const dot = kind === "next" ? nextDot(from) : prevDot(from);
    const dir = kind === "next" ? 1 : -1;
    if (id === null) {
      return (
        <>
          <line x1={dot.x} y1={dot.y} x2={dot.x + dir * (LINK_W / 2 + 14)} y2={dot.y} stroke="#94a3b8" strokeWidth={2} />
          <text x={dot.x + dir * (LINK_W / 2 + 18)} y={dot.y + 4} textAnchor={dir === 1 ? "start" : "end"} fontSize="11" fontFamily="monospace" fill="#94a3b8">
            NULL
          </text>
        </>
      );
    }
    const to = byId.get(id);
    if (!to) {
      return (
        <>
          <line x1={dot.x} y1={dot.y} x2={dot.x + dir * (LINK_W / 2 + 14)} y2={dot.y} stroke="#ef4444" strokeWidth={2} strokeDasharray="3 2" />
          <text x={dot.x + dir * (LINK_W / 2 + 18)} y={dot.y + 4} textAnchor={dir === 1 ? "start" : "end"} fontSize="11" fontFamily="monospace" fill="#ef4444">
            ✗ freed
          </text>
        </>
      );
    }
    return <path d={route(from, to, dot, kind)} fill="none" stroke="#e2e8f0" strokeWidth={2} markerEnd="url(#ptr-arrow)" />;
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="select-none">
          <defs>
            <marker id="ptr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#e2e8f0" />
            </marker>
          </defs>

          {snap.nodes.map((n) => {
            const nx = x(n.col);
            const ny = y(n.row);
            const state: HighlightState = step.nodeHighlights?.[n.id] ?? "idle";
            const ink = state === "idle" ? "#e2e8f0" : "#0f172a";
            const labels = labelsByNode.get(n.id) ?? [];
            const dataLeft = nx + (doubly ? LINK_W : 0);
            const dataW = W - LINK_W * (doubly ? 2 : 1);
            const nd = nextDot(n);
            return (
              <motion.g key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <rect x={nx} y={ny} width={W} height={H} rx={6} fill={NODE_COLOR[state]} stroke="#e2e8f0" strokeWidth={1.5} />
                <line x1={nx + W - LINK_W} y1={ny} x2={nx + W - LINK_W} y2={ny + H} stroke="#e2e8f0" strokeWidth={1.5} />
                {doubly && <line x1={nx + LINK_W} y1={ny} x2={nx + LINK_W} y2={ny + H} stroke="#e2e8f0" strokeWidth={1.5} />}
                <text x={dataLeft + dataW / 2} y={ny + H / 2 + 5} textAnchor="middle" fontSize="14" fontWeight={700} fontFamily="monospace" fill={ink}>
                  {n.value}
                </text>
                <circle cx={nd.x} cy={nd.y} r={3} fill={ink} />
                {doubly && <circle cx={prevDot(n).x} cy={prevDot(n).y} r={3} fill={ink} />}
                {linkArrow(n, n.next, "next")}
                {linkArrow(n, n.prev, "prev")}
                {labels.map((name, i) =>
                  n.row === 0 ? (
                    <text key={name} x={dataLeft + dataW / 2} y={ny - 8 - i * LABEL_LINE} textAnchor="middle" fontSize="12" fontWeight={700} fontFamily="monospace" fill="#f59e0b">
                      {name} ▼
                    </text>
                  ) : (
                    <text key={name} x={dataLeft + dataW / 2} y={ny + H + 16 + i * LABEL_LINE} textAnchor="middle" fontSize="12" fontWeight={700} fontFamily="monospace" fill="#f59e0b">
                      ▲ {name}
                    </text>
                  )
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {chips.map((c) => (
            <span
              key={c.name}
              className={c.kind === "null" ? "rounded border border-slate-600 px-2 py-0.5 text-slate-300" : "rounded border border-exam-bad/60 bg-exam-bad/10 px-2 py-0.5 text-exam-bad"}
            >
              {c.kind === "null" ? `${c.name} = NULL` : `${c.name} → vùng nhớ ĐÃ delete (dangling!)`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
