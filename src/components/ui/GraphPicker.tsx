import type { GraphSpec, NodeId } from "@/engine/types";

export interface GraphOption {
  id: string;
  label: string; // fully-formatted display text, e.g. "Đề HK1 2022–2023" or "Ví dụ minh họa thêm"
  graph: GraphSpec;
  defaultSource?: NodeId; // Dijkstra-only; Euler/Hamilton just ignore this field
}

interface GraphPickerProps {
  options: GraphOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/**
 * Shared "which đề" button row for every module that plays back an algorithm over one
 * of a small fixed set of GraphSpecs (Dijkstra, Euler, Hamilton, spanning-tree...). Plain
 * buttons, not a dropdown — 2-3 options is few enough that seeing them all at once beats
 * an extra click to open a menu.
 */
export function GraphPicker({ options, selectedId, onSelect }: GraphPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onSelect(o.id)}
          className={`px-3 py-1.5 rounded-md border text-sm ${
            o.id === selectedId
              ? "border-exam-accent bg-exam-accent/10 text-exam-accent"
              : "border-slate-600 text-slate-400 hover:border-exam-accent"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
