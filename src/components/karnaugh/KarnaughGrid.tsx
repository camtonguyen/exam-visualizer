import { motion } from "framer-motion";
import type { AlgoStep, HighlightState } from "@/engine/types";
import { NODE_COLOR } from "@/components/graph/GraphCanvas";

interface Props {
  variables: string[];
  step: AlgoStep;
}

const GROUP_PALETTE = [
  "#38bdf8",
  "#f472b6",
  "#facc15",
  "#4ade80",
  "#a78bfa",
  "#fb923c",
  "#f87171",
  "#2dd4bf",
];

const CELL = 84;
const HEAD = 56;

function grayCode(bits: number): string[] {
  if (bits === 0) return [""];
  const prev = grayCode(bits - 1);
  return [...prev.map((p) => "0" + p), ...[...prev].reverse().map((p) => "1" + p)];
}

function label(bits: string, vars: string[]): string {
  return bits
    .split("")
    .map((b, i) => vars[i] + (b === "0" ? "'" : ""))
    .join("");
}

/**
 * A group's cells always form a rectangle on the cyclic (wrap-around) grid — but drawn on
 * a flat grid, a wrapping group breaks into 2 (or 4, for a corner group) separate pieces
 * instead of one continuous rectangle. Row/col index sets are always size 1, 2 or 4 (a
 * valid Boolean subcube), so this only ever has 3 cases to handle.
 */
function runs(idxs: number[]): { start: number; len: number }[] {
  const sorted = [...idxs].sort((a, b) => a - b);
  if (sorted.length === 4) return [{ start: 0, len: 4 }];
  if (sorted.length === 1) return [{ start: sorted[0], len: 1 }];
  const [a, b] = sorted;
  if (b - a === 1) return [{ start: a, len: 2 }];
  return [
    { start: b, len: 1 },
    { start: a, len: 1 },
  ]; // wrap pair, e.g. {0,3} — draw as two separate 1-wide strips
}

/**
 * 4×4 Karnaugh grid (not GraphCanvas/TruthTableCanvas — this needs Gray-code row/col
 * labels plus group outlines that can span several cells, including split pieces for
 * groups that wrap around the grid's edge). Reads the same HighlightState → color
 * mapping GraphCanvas uses (`NODE_COLOR`) for cell fill so "settled"/"rejected" mean the
 * same thing everywhere; group outline color is chosen per prime-implicant id instead,
 * since several groups (different meaning) can be visible on the same step.
 */
export function KarnaughGrid({ variables, step }: Props) {
  const half = Math.ceil(variables.length / 2);
  const colVars = variables.slice(0, half);
  const rowVars = variables.slice(half);
  const colCombos = grayCode(colVars.length);
  const rowCombos = grayCode(rowVars.length);

  const discoveredGroups = (step.groupHighlights ?? []).filter((g) => g.state !== "idle");

  function cellContent(combo: string): string {
    const state: HighlightState = step.nodeHighlights?.[combo] ?? "idle";
    if (state === "idle") return "";
    if (state === "rejected") return "0";
    const ids = discoveredGroups
      .filter((g) => g.cells.includes(combo))
      .map((g) => g.id)
      .sort((a, b) => a - b);
    return ids.length > 0 ? ids.join(",") : "•";
  }

  const width = HEAD + colCombos.length * CELL;
  const height = HEAD + rowCombos.length * CELL;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
      {colCombos.map((c, ci) => (
        <text
          key={`col-${c}`}
          x={HEAD + ci * CELL + CELL / 2}
          y={HEAD / 2 + 5}
          textAnchor="middle"
          fontSize="15"
          fill="#94a3b8"
        >
          {label(c, colVars)}
        </text>
      ))}
      {rowCombos.map((r, ri) => (
        <text
          key={`row-${r}`}
          x={HEAD / 2}
          y={HEAD + ri * CELL + CELL / 2 + 5}
          textAnchor="middle"
          fontSize="15"
          fill="#94a3b8"
        >
          {label(r, rowVars)}
        </text>
      ))}

      {rowCombos.map((r, ri) =>
        colCombos.map((c, ci) => {
          const combo = c + r;
          const state: HighlightState = step.nodeHighlights?.[combo] ?? "idle";
          const x = HEAD + ci * CELL;
          const y = HEAD + ri * CELL;
          return (
            <g key={combo}>
              <motion.rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                stroke="#1e293b"
                strokeWidth={1}
                animate={{ fill: state === "idle" ? "#0f172a" : NODE_COLOR[state] }}
                transition={{ duration: 0.4 }}
              />
              <text
                x={x + CELL / 2}
                y={y + CELL / 2 + 5}
                textAnchor="middle"
                fontSize="16"
                fontWeight={700}
                fill={state === "idle" ? "#475569" : "#0f172a"}
              >
                {cellContent(combo)}
              </text>
            </g>
          );
        })
      )}

      {(step.groupHighlights ?? [])
        .filter((g) => g.state !== "idle")
        .flatMap((g) => {
          const rowIdxs = Array.from(
            new Set(g.cells.map((cell) => rowCombos.indexOf(cell.slice(colVars.length))))
          );
          const colIdxs = Array.from(
            new Set(g.cells.map((cell) => colCombos.indexOf(cell.slice(0, colVars.length))))
          );
          const color = GROUP_PALETTE[(g.id - 1) % GROUP_PALETTE.length];
          const inset = 4 + ((g.id - 1) % 4) * 3; // stagger overlapping groups apart a little
          const dashed = g.state === "rejected" ? "6 4" : g.state === "path" ? "2 3" : undefined;
          const strokeWidth = g.state === "active" ? 4 : g.state === "path" ? 3.5 : 2.5;
          const opacity = g.state === "rejected" ? 0.5 : 1;

          return runs(rowIdxs).flatMap((rr) =>
            runs(colIdxs).map((cr) => {
              const x = HEAD + cr.start * CELL + inset;
              const y = HEAD + rr.start * CELL + inset;
              const w = cr.len * CELL - inset * 2;
              const h = rr.len * CELL - inset * 2;
              return (
                <motion.rect
                  key={`g${g.id}-${rr.start}-${cr.start}`}
                  rx={10}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashed}
                  initial={{ x: x + w / 2, y: y + h / 2, width: 0, height: 0, opacity: 0 }}
                  animate={{ x, y, width: w, height: h, opacity }}
                  transition={{ duration: 0.4 }}
                />
              );
            })
          );
        })}
    </svg>
  );
}
