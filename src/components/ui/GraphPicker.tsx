import type { GraphSpec, NodeId } from "@/engine/types";
import { ExamplePicker } from "./ExamplePicker";

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
 * Graph-flavored wrapper around the generic `ExamplePicker` — same button-row UI, kept
 * as its own component because `GraphOption` also carries `graph`/`defaultSource`, which
 * `ExamplePicker` doesn't need to know about. Every CTRR module keeps importing this
 * exact name/props; only the row-rendering implementation now lives in one place.
 */
export function GraphPicker({ options, selectedId, onSelect }: GraphPickerProps) {
  return <ExamplePicker options={options} selectedId={selectedId} onSelect={onSelect} />;
}
