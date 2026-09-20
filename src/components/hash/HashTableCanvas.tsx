import { motion } from "framer-motion";
import type { AlgoStep, HashNode, HighlightState } from "@/engine/types";
import { NODE_COLOR } from "@/components/graph/GraphCanvas";

interface Props {
  step: AlgoStep;
}

const W = 56; // chain node box (value cell + link cell)
const H = 32;
const LINK_W = 18;
const GX = 44;
const HEAD_W = 44; // bucket index cell
const PITCH = 54; // row height: node + room for pointer labels underneath
const PADX = 12;
const PADY = 8;
const CHAIN_X = PADX + HEAD_W + GX;

/**
 * Draws `step.hashSnapshot` like the exam's hash-table sketches: a column of bucket cells [i], each with its
 * chain of nodes → … → NULL to the right. A freshly allocated, not-yet-linked node is dashed at the end of its
 * bucket's chain with no arrow into it; `labels` (pHead/pTail/p) sit under the node they point to. Colors read the
 * shared HighlightState map, same as every other canvas.
 */
export function HashTableCanvas({ step }: Props) {
  const snap = step.hashSnapshot;
  if (!snap) return null;

  const rowY = (i: number) => PADY + i * PITCH;
  const maxLen = Math.max(1, ...snap.buckets.map((b, i) => b.length + (snap.pending?.bucket === i ? 1 : 0)));
  const width = CHAIN_X + maxLen * (W + GX) + 30;
  const height = PADY * 2 + snap.size * PITCH;

  const labelsAt = new Map<string, string[]>();
  for (const [name, id] of Object.entries(snap.labels ?? {})) labelsAt.set(id, [...(labelsAt.get(id) ?? []), name]);
  if (snap.pending) labelsAt.set(snap.pending.node.id, [...(labelsAt.get(snap.pending.node.id) ?? []), "p"]);

  const node = (n: HashNode, row: number, col: number, dashed: boolean) => {
    const nx = CHAIN_X + col * (W + GX);
    const ny = rowY(row);
    const state: HighlightState = step.nodeHighlights?.[n.id] ?? "idle";
    const ink = state === "idle" ? "#e2e8f0" : "#0f172a";
    return (
      <motion.g key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <rect x={nx} y={ny} width={W} height={H} rx={5} fill={NODE_COLOR[state]} stroke="#e2e8f0" strokeWidth={1.5} strokeDasharray={dashed ? "4 3" : undefined} />
        <line x1={nx + W - LINK_W} y1={ny} x2={nx + W - LINK_W} y2={ny + H} stroke="#e2e8f0" strokeWidth={1.5} />
        <text x={nx + (W - LINK_W) / 2} y={ny + H / 2 + 5} textAnchor="middle" fontSize="13" fontWeight={700} fontFamily="monospace" fill={ink}>
          {n.value}
        </text>
        <circle cx={nx + W - LINK_W / 2} cy={ny + H / 2} r={2.5} fill={ink} />
        {(labelsAt.get(n.id) ?? []).length > 0 && (
          <text x={nx + (W - LINK_W) / 2} y={ny + H + 12} textAnchor="middle" fontSize="10" fontWeight={700} fontFamily="monospace" fill="#f59e0b">
            ▲ {(labelsAt.get(n.id) ?? []).join(", ")}
          </text>
        )}
      </motion.g>
    );
  };

  const nullStub = (x1: number, y: number) => (
    <>
      <line x1={x1} y1={y} x2={x1 + 14} y2={y} stroke="#94a3b8" strokeWidth={2} />
      <text x={x1 + 18} y={y + 4} fontSize="11" fontFamily="monospace" fill="#94a3b8">
        NULL
      </text>
    </>
  );

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="select-none">
        <defs>
          <marker id="hash-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#e2e8f0" />
          </marker>
        </defs>
        {snap.buckets.map((chain, i) => {
          const y = rowY(i);
          const cy = y + H / 2;
          const state: HighlightState = step.nodeHighlights?.[`b${i}`] ?? "idle";
          return (
            <g key={i}>
              <motion.rect
                x={PADX}
                y={y}
                width={HEAD_W}
                height={H}
                rx={5}
                stroke="#e2e8f0"
                strokeWidth={1.5}
                animate={{ fill: NODE_COLOR[state] }}
                transition={{ duration: 0.3 }}
              />
              <text x={PADX + HEAD_W / 2} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight={700} fontFamily="monospace" fill={state === "idle" ? "#e2e8f0" : "#0f172a"}>
                {i}
              </text>
              {chain.length === 0 ? (
                nullStub(PADX + HEAD_W, cy)
              ) : (
                <line x1={PADX + HEAD_W} y1={cy} x2={CHAIN_X} y2={cy} stroke="#e2e8f0" strokeWidth={2} markerEnd="url(#hash-arrow)" />
              )}
              {chain.map((n, k) => (
                <g key={n.id}>
                  {node(n, i, k, false)}
                  {k < chain.length - 1 ? (
                    <line x1={CHAIN_X + k * (W + GX) + W - LINK_W / 2} y1={cy} x2={CHAIN_X + (k + 1) * (W + GX)} y2={cy} stroke="#e2e8f0" strokeWidth={2} markerEnd="url(#hash-arrow)" />
                  ) : (
                    nullStub(CHAIN_X + k * (W + GX) + W - LINK_W / 2, cy)
                  )}
                </g>
              ))}
              {snap.pending?.bucket === i && node(snap.pending.node, i, chain.length, true)}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
