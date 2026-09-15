// Core types shared by every algorithm module (Dijkstra, Euler, Hamilton, Kruskal, Karnaugh...).
// The idea: each algorithm is a pure function returning an ordered array of AlgoStep.
// The UI layer (StepPlayer + module-specific canvas) only ever renders `steps[currentIndex]`
// and animates the *diff* between steps with Framer Motion. This keeps algorithm logic
// 100% testable without React and lets every module reuse the same playback controls.

export type NodeId = string;

export interface WeightedEdge {
  id: string;
  from: NodeId;
  to: NodeId;
  /** Omit for graphs where a weight is meaningless (e.g. plain degree/property graphs) —
   *  GraphCanvas skips the weight label entirely rather than showing a fake number. */
  weight?: number;
}

export interface GraphSpec {
  nodes: NodeId[];
  edges: WeightedEdge[];
  /** Optional manual layout so hand-drawn exam graphs render in a recognizable shape. */
  positions?: Record<NodeId, { x: number; y: number }>;
  /** true draws an arrowhead at each edge's `to` end (directed graphs, e.g. Câu 2 Kiểu 2). */
  directed?: boolean;
  /** Optional display text per node, when the id needs to stay unique for highlighting
   *  purposes but shouldn't be shown as-is (e.g. "0:A" id displayed as just "A"). */
  labels?: Record<NodeId, string>;
}

/** Generic highlight state a canvas can apply to a node or edge for the current step. */
export type HighlightState = "idle" | "active" | "settled" | "rejected" | "path";

/** A group spanning several cells of a grid canvas (e.g. a Karnaugh prime implicant) —
 *  distinct from nodeHighlights, which only colors a single cell. */
export interface GroupHighlight {
  id: number;
  label: string;
  cells: NodeId[];
  state: HighlightState;
}

export interface AlgoStep {
  /** Short label shown in the step list / narration panel, e.g. "Chọn đỉnh E (nhãn 0)". */
  title: string;
  /** Longer explanation, matches the "GHI VÀO BÀI LÀM" prose from the written guide. */
  explanation: string;
  nodeHighlights?: Partial<Record<NodeId, HighlightState>>;
  edgeHighlights?: Record<string, HighlightState>;
  /** Optional multi-cell group overlays a grid canvas draws as (possibly split, for
   *  wrap-around groups) rectangles over several cells at once. */
  groupHighlights?: GroupHighlight[];
  /** Free-form per-step data for the side table (e.g. current L(v) labels, S set). */
  tableSnapshot?: Record<string, string | number>;
}

export interface AlgoResult {
  steps: AlgoStep[];
  /** Final human-readable result, e.g. "Đường đi ngắn nhất: E-F-H-I (16)". */
  summary: string;
}

/** A Boolean function of n variables, given as either f⁻¹(1) or f⁻¹(0) — shared across
 *  any subject with Boolean-function content (CDNF, Karnaugh, circuit modules). */
export interface BooleanFunctionSpec {
  variables: string[]; // ["x","y","z","t"]
  onesSet: string[]; // f^-1(1), each element a bit string "0101"
  givenAs: "ones" | "zeros"; // which form the exam gave — affects the "loại bỏ" step
  zerosSet?: string[]; // if givenAs === "zeros", the original f^-1(0) to display as given
}

/** One literal (a variable or its negation) inside a circuit term. */
export interface CircuitLiteral {
  variable: string;
  isTrue: boolean; // false = biến có dấu phẩy trong số hạng này
}

/** One AND-gate's worth of literals — a single term of a minimal SOP formula. */
export interface CircuitTerm {
  id: string;
  literals: CircuitLiteral[];
}

/** A logic-gate diagram to draw from an already-chosen minimal formula (NOT the whole
 *  CDNF) — shared across any subject with Boolean-circuit content. */
export interface CircuitSpec {
  variables: string[]; // fixed order, e.g. ["x","y","z","t"]
  terms: CircuitTerm[]; // terms of the chosen minimal formula (one cover, not all of them)
  outputLabel: string; // "f"
}

/** A candidate degree sequence to test for graphicality (Havel–Hakimi) — shared across
 *  any subject with basic graph-theory content, not CTRR-specific. */
export interface DegreeSequenceCheck {
  sequence: number[];
  label?: string; // "(1)", "(2)"... when the exam gives several sequences at once
}
