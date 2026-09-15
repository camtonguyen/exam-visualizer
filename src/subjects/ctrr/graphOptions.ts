import type { GraphOption } from "@/components/ui/GraphPicker";
import { graph20222023, graph20232024, graphMinhHoa } from "./data/graphs";

/**
 * Shared `GraphPicker` option list for every Câu 3 module (euler, hamilton, dijkstra,
 * spanning-tree) — one place to add a graph instead of editing 4 files. Fixed order
 * (2022-2023, 2023-2024, ví dụ minh họa) so the picker looks identical across modules;
 * each module still chooses its own default via its own `useState`, independent of
 * this array's order.
 */
export const CTRR_GRAPH_OPTIONS: GraphOption[] = [
  { id: "2022-2023", label: "Đề HK1 2022–2023", graph: graph20222023, defaultSource: "H" },
  { id: "2023-2024", label: "Đề HK1 2023–2024", graph: graph20232024, defaultSource: "E" },
  // graphMinhHoa uses its own vertex labels (P-Y) and weights — defaultSource "T" is
  // that graph's own choice, unrelated to either real exam's source vertex.
  {
    id: "minh-hoa",
    label: "Ví dụ minh họa (đồ thị P-Y, không phải đề thi thật)",
    graph: graphMinhHoa,
    defaultSource: "T",
  },
];
