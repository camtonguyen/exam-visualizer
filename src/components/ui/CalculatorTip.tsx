import { useState } from "react";

export interface CalculatorTipData {
  menu: string;
  steps: string[];
}

type Props = CalculatorTipData;

/**
 * Collapsed/expanded box for "cách bấm máy Casio fx-880BTG" — every XSTK module must
 * render at least one of these for its main calculation step (content requirement from
 * the source guides, not optional), so the animation stays tied to what a student
 * actually types on the exam calculator.
 */
export function CalculatorTip({ menu, steps }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-slate-700 bg-exam-panel/40">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-exam-accent"
      >
        <span>🖩 Bấm máy Casio — {menu}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && <pre className="px-3 pb-3 text-xs text-slate-300 whitespace-pre-wrap font-mono">{steps.join("\n")}</pre>}
    </div>
  );
}
