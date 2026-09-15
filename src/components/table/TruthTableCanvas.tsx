import { motion } from "framer-motion";
import type { AlgoStep, HighlightState } from "@/engine/types";
import { NODE_COLOR } from "@/components/graph/GraphCanvas";

interface Props {
  variables: string[];
  step: AlgoStep;
}

function allCombos(bits: number): string[] {
  return Array.from({ length: 2 ** bits }, (_, i) => i.toString(2).padStart(bits, "0"));
}

/**
 * Renders a full 2^n-row truth table grid (not a graph — CDNF/Karnaugh need rows/cells,
 * not nodes/edges). Each row's background reads the same HighlightState → color mapping
 * GraphCanvas uses for nodes, so "active"/"settled"/"rejected" mean the same thing
 * everywhere in the app.
 */
export function TruthTableCanvas({ variables, step }: Props) {
  const combos = allCombos(variables.length);

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr>
          {variables.map((v) => (
            <th key={v} className="border border-slate-700 px-3 py-1.5 text-exam-accent">
              {v}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {combos.map((combo) => {
          const state: HighlightState = step.nodeHighlights?.[combo] ?? "idle";
          const textColor = state === "idle" ? "#e2e8f0" : "#0f172a";
          return (
            <motion.tr
              key={combo}
              animate={{ backgroundColor: NODE_COLOR[state], color: textColor }}
              transition={{ duration: 0.4 }}
            >
              {combo.split("").map((bit, i) => (
                <td key={i} className="border border-slate-700 px-3 py-1.5 text-center font-mono">
                  {bit}
                </td>
              ))}
            </motion.tr>
          );
        })}
      </tbody>
    </table>
  );
}
