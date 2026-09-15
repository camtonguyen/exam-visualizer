import { motion } from "framer-motion";
import type { AlgoStep, CircuitSpec, HighlightState } from "@/engine/types";
import { NODE_COLOR } from "@/components/graph/GraphCanvas";

interface Props {
  spec: CircuitSpec;
  step: AlgoStep;
}

const LEFT = 50;
const COL_GAP = 130;
const TOP_LABEL_Y = 20;
const LINE_TOP_Y = 34;
const NOT_ROW_Y = 90;
const NOT_TAP_OFFSET = 40; // how far right of the main column the NOT gate sits
const NOT_W = 30;
const NOT_H = 20;
const BUBBLE_R = 4;
const COMPLEMENT_GAP = 14; // gap between NOT bubble and the complement column it feeds into
const AND_W = 56;
const AND_H = 36;
const AND_GAP = 68;
const AND_TOP = NOT_ROW_Y + 56;
const OR_GAP_X = 90;
const OR_W = 58;

function computeNeedsNot(spec: CircuitSpec): string[] {
  const s = new Set<string>();
  spec.terms.forEach((t) => t.literals.forEach((l) => { if (!l.isTrue) s.add(l.variable); }));
  return spec.variables.filter((v) => s.has(v));
}

/** Sharp triangle + a small bubble at the tip — the negation symbol. */
function notGatePath(x: number, y: number): string {
  return `M${x},${y - NOT_H / 2} L${x},${y + NOT_H / 2} L${x + NOT_W},${y} Z`;
}

/** Flat left edge (a straight rect side) + a bulging semicircle on the right — the "D" shape. */
function andGatePath(x: number, y: number, w: number, h: number): string {
  const r = h / 2;
  return `M${x},${y} L${x + w - r},${y} A${r},${r} 0 0 1 ${x + w - r},${y + h} L${x},${y + h} Z`;
}

/** Shield shape: concave back (pulled inward ~20% width), shoulders bulging out at ~75%
 *  width, sharp tip at 100% width — deliberately NOT the AND gate's "D" shape. */
function orGatePath(x: number, y: number, w: number, h: number): string {
  const back = x + w * 0.2;
  const shoulder = x + w * 0.75;
  const tip = x + w;
  const top = y;
  const bottom = y + h;
  const mid = y + h / 2;
  return `M${x},${top} Q${shoulder},${top} ${tip},${mid} Q${shoulder},${bottom} ${x},${bottom} Q${back},${mid} ${x},${top} Z`;
}

/**
 * Logic-gate diagram (NOT/AND/OR only) — a distinct canvas from GraphCanvas/KarnaughGrid
 * because gates aren't nodes/edges or grid cells. Every wire is a single straight
 * horizontal or vertical segment, matching the guide's own diagrams: every variable AND
 * its complement (if it needs one) is a full-height vertical "bus" line, all drawn
 * together before any gate; AND gates tap straight off whichever bus each of their
 * literals needs — no bends. `step.nodeHighlights` is keyed by `line:<wireKey>` ("x" or
 * "x'"), `gate:not:<variable>` (the NOT gate symbol), a term's `id` (its AND gate), and
 * `"or"` (the OR gate); a key absent from the map means "not drawn yet".
 */
export function CircuitCanvas({ spec, step }: Props) {
  const { variables, terms, outputLabel } = spec;
  const needsNot = computeNeedsNot(spec);
  const needsNotSet = new Set(needsNot);
  const h = step.nodeHighlights ?? {};

  interface Column { wireKey: string; label: string; x: number }
  const columns: Column[] = [];
  variables.forEach((v, i) => {
    const mainX = LEFT + i * COL_GAP;
    columns.push({ wireKey: v, label: v, x: mainX });
    if (needsNotSet.has(v)) {
      const complementX = mainX + NOT_TAP_OFFSET + NOT_W + BUBBLE_R * 2 + COMPLEMENT_GAP;
      columns.push({ wireKey: `${v}'`, label: `${v}'`, x: complementX });
    }
  });
  const colByWireKey = new Map(columns.map((c) => [c.wireKey, c]));
  const lastX = Math.max(...columns.map((c) => c.x));

  const andX = lastX + 120;
  const andY = (k: number) => AND_TOP + k * AND_GAP + AND_H / 2;
  const orX = andX + AND_W + OR_GAP_X;
  const orH = Math.max(60, (terms.length - 1) * AND_GAP + AND_H);
  const orY = AND_TOP + ((terms.length - 1) * AND_GAP) / 2 + AND_H / 2 - orH / 2;
  const outputX = orX + OR_W + 44;

  const bottomY = andY(terms.length - 1) + AND_H;
  const width = outputX + 30;
  const height = bottomY + 20;

  function stateOf(key: string): HighlightState | undefined {
    return h[key];
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
      {/* variable / complement bus lines — all drawn together, full height, before any gate */}
      {columns.map((col) => {
        const state = stateOf(`line:${col.wireKey}`);
        if (!state) return null;
        const color = NODE_COLOR[state];
        return (
          <g key={col.wireKey}>
            <text x={col.x} y={TOP_LABEL_Y} textAnchor="middle" fontSize="14" fill="#94a3b8">
              {col.label}
            </text>
            <motion.line
              x1={col.x}
              y1={LINE_TOP_Y}
              x2={col.x}
              y2={bottomY}
              stroke={color}
              strokeWidth={2.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, stroke: color }}
              transition={{ duration: 0.4 }}
            />
          </g>
        );
      })}

      {/* NOT gates: a short tap off the main column feeds the triangle, whose bubble
          connects via a short tap into the (already-drawn) complement column. */}
      {needsNot.map((v) => {
        const state = stateOf(`gate:not:${v}`);
        if (!state) return null;
        const color = NODE_COLOR[state];
        const main = colByWireKey.get(v)!;
        const complement = colByWireKey.get(`${v}'`)!;
        const gateX = main.x + NOT_TAP_OFFSET;
        const bubbleX = gateX + NOT_W + BUBBLE_R;
        return (
          <g key={`not-gate-${v}`}>
            <motion.line
              x1={main.x}
              y1={NOT_ROW_Y}
              x2={gateX}
              y2={NOT_ROW_Y}
              stroke={color}
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, stroke: color }}
              transition={{ duration: 0.3 }}
            />
            <motion.path
              d={notGatePath(gateX, NOT_ROW_Y)}
              fill="#0f172a"
              stroke={color}
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, stroke: color }}
              transition={{ duration: 0.4 }}
            />
            <motion.circle
              cx={bubbleX}
              cy={NOT_ROW_Y}
              r={BUBBLE_R}
              fill="#0f172a"
              stroke={color}
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, stroke: color }}
              transition={{ duration: 0.4 }}
            />
            <motion.line
              x1={bubbleX + BUBBLE_R}
              y1={NOT_ROW_Y}
              x2={complement.x}
              y2={NOT_ROW_Y}
              stroke={color}
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, stroke: color }}
              transition={{ duration: 0.3 }}
            />
          </g>
        );
      })}

      {/* AND gates, one per term — each literal taps straight off its column at the
          gate's own row height, no bends. */}
      {terms.map((term, k) => {
        const state = stateOf(term.id);
        if (!state) return null;
        const color = NODE_COLOR[state];
        const cy = andY(k);
        const gateY = cy - AND_H / 2;
        const n = term.literals.length;
        return (
          <g key={term.id}>
            {term.literals.map((lit, j) => {
              const wireKey = lit.isTrue ? lit.variable : `${lit.variable}'`;
              const col = colByWireKey.get(wireKey);
              if (!col) return null;
              const inputY = gateY + ((j + 1) * AND_H) / (n + 1);
              return (
                <motion.line
                  key={`${term.id}-in-${j}`}
                  x1={col.x}
                  y1={inputY}
                  x2={andX}
                  y2={inputY}
                  stroke={color}
                  strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1, stroke: color }}
                  transition={{ duration: 0.4 }}
                />
              );
            })}
            <motion.path
              d={andGatePath(andX, gateY, AND_W, AND_H)}
              fill="#0f172a"
              stroke={color}
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, stroke: color }}
              transition={{ duration: 0.4 }}
            />
            <text x={andX + AND_H / 2} y={gateY - 8} textAnchor="middle" fontSize="12" fill="#94a3b8">
              {term.literals.map((l) => (l.isTrue ? l.variable : `${l.variable}'`)).join("")}
            </text>
            <motion.line
              x1={andX + AND_W + AND_H / 2}
              y1={cy}
              x2={orX}
              y2={cy}
              stroke={color}
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1, stroke: color }}
              transition={{ duration: 0.4 }}
            />
          </g>
        );
      })}

      {/* OR gate */}
      {stateOf("or") && (
        <g>
          <motion.path
            d={orGatePath(orX, orY, OR_W, orH)}
            fill="#0f172a"
            stroke={NODE_COLOR[stateOf("or")!]}
            strokeWidth={2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, stroke: NODE_COLOR[stateOf("or")!] }}
            transition={{ duration: 0.4 }}
          />
          <motion.line
            x1={orX + OR_W}
            y1={orY + orH / 2}
            x2={outputX}
            y2={orY + orH / 2}
            stroke={NODE_COLOR[stateOf("or")!]}
            strokeWidth={2.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, stroke: NODE_COLOR[stateOf("or")!] }}
            transition={{ duration: 0.4 }}
          />
          <text x={outputX + 8} y={orY + orH / 2 + 5} fontSize="15" fontWeight={700} fill="#e2e8f0">
            {outputLabel}
          </text>
        </g>
      )}
    </svg>
  );
}
