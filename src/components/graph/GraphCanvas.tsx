import { motion } from "framer-motion";
import type { GraphSpec, AlgoStep, HighlightState, WeightedEdge, NodeId } from "@/engine/types";

export const NODE_COLOR: Record<HighlightState, string> = {
  idle: "#334155",
  active: "#38bdf8",
  settled: "#22c55e",
  rejected: "#ef4444",
  path: "#38bdf8",
};
const EDGE_COLOR: Record<HighlightState, string> = {
  idle: "#475569",
  active: "#38bdf8",
  settled: "#64748b",
  rejected: "#ef4444",
  path: "#22c55e",
};

interface Props {
  graph: GraphSpec;
  step: AlgoStep;
  width?: number;
  height?: number;
}

/** Small filled triangle pointing from (x1,y1) toward (x2,y2), stopped short of the
 *  target node's circle so the tip sits right at its edge. */
function arrowheadPoints(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const nodeRadius = 20;
  const arrowLen = 10;
  const arrowWidth = 7;
  const tipX = x2 - ux * nodeRadius;
  const tipY = y2 - uy * nodeRadius;
  const baseX = tipX - ux * arrowLen;
  const baseY = tipY - uy * arrowLen;
  const perpX = (-uy * arrowWidth) / 2;
  const perpY = (ux * arrowWidth) / 2;
  return `${tipX},${tipY} ${baseX + perpX},${baseY + perpY} ${baseX - perpX},${baseY - perpY}`;
}

/**
 * Renders one frame of a graph algorithm. Every node/edge only reads its highlight
 * state from `step` — Framer Motion's layout/color transitions handle the "animation"
 * for free when the parent swaps `step` on next/prev, no manual tweening needed.
 */
export function GraphCanvas({ graph, step, width = 760, height = 440 }: Props) {
  const pos = graph.positions ?? {};

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
      {graph.edges.map((e: WeightedEdge) => {
        const a = pos[e.from];
        const b = pos[e.to];
        if (!a || !b) return null;
        const state = step.edgeHighlights?.[e.id] ?? "idle";
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        return (
          <g key={e.id}>
            <motion.line
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={EDGE_COLOR[state]}
              strokeWidth={state === "idle" ? 2 : 4}
              animate={{ stroke: EDGE_COLOR[state], strokeWidth: state === "idle" ? 2 : 4 }}
              transition={{ duration: 0.4 }}
            />
            {graph.directed && (
              <motion.polygon
                points={arrowheadPoints(a.x, a.y, b.x, b.y)}
                fill={EDGE_COLOR[state]}
                animate={{ fill: EDGE_COLOR[state] }}
                transition={{ duration: 0.4 }}
              />
            )}
            {e.weight !== undefined && (
              <>
                <circle cx={mx} cy={my} r={11} fill="#0f172a" stroke="#1e293b" />
                <text x={mx} y={my + 4} textAnchor="middle" fontSize="11" fill="#facc15">
                  {e.weight}
                </text>
              </>
            )}
          </g>
        );
      })}

      {graph.nodes.map((n: NodeId) => {
        const p = pos[n];
        if (!p) return null;
        const state = step.nodeHighlights?.[n] ?? "idle";
        return (
          <motion.g key={n} animate={{ x: p.x, y: p.y }} transition={{ duration: 0.4 }} style={{ x: p.x, y: p.y }}>
            <motion.circle
              r={20}
              fill={NODE_COLOR[state]}
              stroke="#e2e8f0"
              strokeWidth={2}
              animate={{ fill: NODE_COLOR[state], scale: state === "active" ? 1.15 : 1 }}
              transition={{ duration: 0.4 }}
            />
            <text textAnchor="middle" dy="5" fontSize="14" fontWeight={700} fill="#0f172a">
              {graph.labels?.[n] ?? n}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
