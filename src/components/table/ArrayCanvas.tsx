import { motion } from "framer-motion";
import type { AlgoStep, HighlightState } from "@/engine/types";
import { NODE_COLOR } from "@/components/graph/GraphCanvas";

interface Props {
  step: AlgoStep;
}

/**
 * Renders `step.arraySnapshot` as a row of cells with the index above and pointer labels
 * (`step.arrayMarkers`, e.g. L/R/M/i) below — the same picture the exam's hand-written
 * "Bước i = …" / "Lần #k" tables draw. Cell colors read the shared HighlightState map, so
 * "active"/"settled"/"rejected" mean the same thing here as in GraphCanvas.
 */
export function ArrayCanvas({ step }: Props) {
  const cells = step.arraySnapshot;
  if (!cells) return null;

  const labelsAt = (i: number) =>
    Object.entries(step.arrayMarkers ?? {})
      .filter(([, idx]) => idx === i)
      .map(([label]) => label)
      .join(",");

  return (
    <div className="overflow-x-auto pb-1">
      <div className="inline-flex gap-1.5">
        {cells.map((value, i) => {
          const state: HighlightState = step.nodeHighlights?.[String(i)] ?? "idle";
          return (
            <div key={i} className="flex w-12 flex-col items-center gap-1">
              <span className="font-mono text-xs text-slate-500">{i}</span>
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-md border border-slate-200/60 font-mono text-sm font-bold"
                animate={{
                  backgroundColor: NODE_COLOR[state],
                  color: state === "idle" ? "#e2e8f0" : "#0f172a",
                  scale: state === "active" ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.div>
              <span className="h-4 font-mono text-xs font-semibold text-exam-warn">{labelsAt(i)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
