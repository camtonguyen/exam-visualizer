import { motion } from "framer-motion";
import type { AlgoStep, HighlightState, TreeNodeView } from "@/engine/types";
import { NODE_COLOR } from "@/components/graph/GraphCanvas";

interface Props {
  step: AlgoStep;
}

const R = 18;
const GX = 48; // horizontal step per in-order rank
const GY = 64;
const PADX = 28;
const PADY = 28;
const LABEL_LINE = 13;

/**
 * Draws `step.treeSnapshot` as the exam's hand-drawn binary tree: x = in-order rank (so a node never overlaps another
 * and left < node < right reads left-to-right), y = depth. Named pointers (pGoto, pLoca, p…) sit under the node they
 * point to; a pointer that is NULL is a chip under the drawing; a node not linked yet is dashed beside the tree.
 * An explicit `std::stack` and the traversal output so far are shown underneath. Colors read the shared HighlightState map.
 */
export function TreeCanvas({ step }: Props) {
  const snap = step.treeSnapshot;
  if (!snap) return null;

  const byId = new Map<string, TreeNodeView>(snap.nodes.map((n) => [n.id, n]));
  const pos = new Map<string, { x: number; y: number }>();
  let rank = 0;
  let maxDepth = 0;
  const place = (id: string | null, depth: number) => {
    if (id === null || !byId.has(id)) return;
    const n = byId.get(id)!;
    place(n.left, depth + 1);
    pos.set(id, { x: PADX + rank++ * GX, y: PADY + depth * GY });
    maxDepth = Math.max(maxDepth, depth);
    place(n.right, depth + 1);
  };
  place(snap.root, 0);

  const treeW = Math.max(1, rank) * GX;
  const width = PADX * 2 + treeW + (snap.pending ? 70 : 0);
  const height = PADY + (snap.nodes.length ? maxDepth : 0) * GY + R + 46;
  const pendingPos = snap.pending ? { x: PADX + treeW + 24, y: PADY } : null;

  const labelsAt = new Map<string, string[]>();
  const chips: string[] = [];
  for (const [name, target] of Object.entries(snap.labels ?? {})) {
    if (target === null) chips.push(name);
    else labelsAt.set(target, [...(labelsAt.get(target) ?? []), name]);
  }

  const circle = (id: string, value: number, at: { x: number; y: number }, dashed: boolean) => {
    const state: HighlightState = step.nodeHighlights?.[id] ?? "idle";
    const labels = labelsAt.get(id) ?? [];
    return (
      <motion.g key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <circle cx={at.x} cy={at.y} r={R} fill={NODE_COLOR[state]} stroke="#e2e8f0" strokeWidth={2} strokeDasharray={dashed ? "4 3" : undefined} />
        <text x={at.x} y={at.y + 5} textAnchor="middle" fontSize="14" fontWeight={700} fontFamily="monospace" fill={state === "idle" ? "#e2e8f0" : "#0f172a"}>
          {value}
        </text>
        {labels.length > 0 && (
          <text x={at.x} y={at.y + R + LABEL_LINE} textAnchor="middle" fontSize="11" fontWeight={700} fontFamily="monospace" fill="#f59e0b">
            ▲ {labels.join(", ")}
          </text>
        )}
      </motion.g>
    );
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="select-none">
          {snap.nodes.flatMap((n) =>
            [n.left, n.right].map((c) => {
              const a = pos.get(n.id);
              const b = c ? pos.get(c) : undefined;
              return a && b ? <line key={`${n.id}-${c}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#94a3b8" strokeWidth={2} /> : null;
            })
          )}
          {snap.nodes.map((n) => (pos.has(n.id) ? circle(n.id, n.value, pos.get(n.id)!, false) : null))}
          {snap.pending && pendingPos && circle(snap.pending.id, snap.pending.value, pendingPos, true)}
        </svg>
      </div>
      {snap.nodes.length === 0 && !snap.pending && <div className="font-mono text-xs text-slate-400">Cây rỗng (t.pRoot = NULL)</div>}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {chips.map((name) => (
            <span key={name} className="rounded border border-slate-600 px-2 py-0.5 text-slate-300">
              {name} = NULL
            </span>
          ))}
        </div>
      )}
      {snap.stack && (
        <div className="font-mono text-xs text-slate-300">
          <span className="text-slate-500">std::stack (đáy → đỉnh): </span>
          {snap.stack.length ? snap.stack.map((v, i) => <span key={i} className="mr-1 rounded border border-exam-accent/60 px-1.5 py-0.5">{v}</span>) : "(rỗng)"}
        </div>
      )}
      {snap.output && (
        <div className="font-mono text-sm text-slate-100">
          <span className="text-xs text-slate-500">Đã in: </span>
          {snap.output.length ? snap.output.join("  ") : "(chưa in gì)"}
        </div>
      )}
    </div>
  );
}
