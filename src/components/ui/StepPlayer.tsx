import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import type { AlgoStep } from "@/engine/types";

interface Props {
  steps: AlgoStep[];
  summary: string;
  index: number;
  onIndexChange: (next: number) => void;
  playing: boolean;
  onPlayingChange: (next: boolean) => void;
}

/**
 * Play / pause / next / prev / speed controls for any algorithm's step array.
 * Fully controlled: the owning module (Dijkstra/Euler/Hamilton/Kruskal...) holds
 * `index` in its own state so it can feed the SAME index into <GraphCanvas step={steps[index]} />.
 * That's what keeps the graph drawing and the narration panel in lockstep.
 */
export function StepPlayer({ steps, summary, index, onIndexChange, playing, onPlayingChange }: Props) {
  const step = steps[index];
  const atEnd = index === steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (atEnd) { onPlayingChange(false); return; }
    const t = setTimeout(() => onIndexChange(Math.min(index + 1, steps.length - 1)), 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, atEnd, steps.length]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1.5 rounded-md bg-exam-panel border border-slate-600 hover:border-exam-accent disabled:opacity-40"
          onClick={() => onIndexChange(0)}
          disabled={index === 0}
        >
          ⏮ Đầu
        </button>
        <button
          className="px-3 py-1.5 rounded-md bg-exam-panel border border-slate-600 hover:border-exam-accent disabled:opacity-40"
          onClick={() => onIndexChange(Math.max(0, index - 1))}
          disabled={index === 0}
        >
          ◀ Trước
        </button>
        <button
          className="px-4 py-1.5 rounded-md bg-exam-accent text-slate-900 font-semibold"
          onClick={() => onPlayingChange(!playing)}
        >
          {playing ? "⏸ Tạm dừng" : "▶ Tự chạy"}
        </button>
        <button
          className="px-3 py-1.5 rounded-md bg-exam-panel border border-slate-600 hover:border-exam-accent disabled:opacity-40"
          onClick={() => onIndexChange(Math.min(steps.length - 1, index + 1))}
          disabled={atEnd}
        >
          Tiếp ▶
        </button>
        <button
          className="px-3 py-1.5 rounded-md bg-exam-panel border border-slate-600 hover:border-exam-accent disabled:opacity-40"
          onClick={() => onIndexChange(steps.length - 1)}
          disabled={atEnd}
        >
          Cuối ⏭
        </button>
      </div>

      <div className="text-sm text-slate-400">
        Bước {index + 1} / {steps.length}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="rounded-lg border border-slate-700 bg-exam-panel p-4"
        >
          <div className="font-semibold text-exam-accent">{step.title}</div>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{step.explanation}</p>
        </motion.div>
      </AnimatePresence>

      {atEnd && (
        <div className="rounded-lg border border-exam-good/50 bg-exam-good/10 p-3 text-sm">
          <span className="font-semibold text-exam-good">Kết quả: </span>
          {summary}
        </div>
      )}
    </div>
  );
}

