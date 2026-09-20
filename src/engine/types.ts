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

// ---- Xác suất Thống kê (XSTK) — shared across any subject with probability/stats content ----

/** One event of a partition (phân hoạch) of the sample space, with its prior P(Ai). */
export interface PartitionEvent {
  id: string;
  label: string;
  prior: number;
}

/** P(B|Ai) for one branch of the partition — every branch conditions on the same event B
 *  (named by `BayesSpec.eventLabel`), so no per-branch label is needed here. */
export interface ConditionalBranch {
  fromEventId: string;
  prob: number;
}

/** Full-probability + Bayes input: a partition, P(B|Ai) for each branch, and the exact
 *  Bayes question asked (which Ai's, given B or given not-B — exam questions often ask
 *  about a UNION of partition events, e.g. "not the evening shift" = the other two). */
export interface BayesSpec {
  partition: PartitionEvent[];
  branches: ConditionalBranch[];
  eventLabel: string; // tên biến cố B, vd "Phế phẩm"
  targetLabel: string; // câu hỏi Bayes hiển thị, vd "Không phải ca tối, biết không phế phẩm"
  targetEventIds: string[]; // các Ai trong câu hỏi (gộp nếu nhiều)
  conditionOnComplement: boolean; // true nếu điều kiện là "không B" thay vì B
}

/** Dạng 3 (biến ngẫu nhiên liên tục), tổng quát cho đa thức bậc bất kỳ. `fn(x,k)` PHẢI
 *  tuyến tính theo k — đúng cho mọi bài "chuẩn hóa mật độ" (k nhân toàn biểu thức, như
 *  K(x³/4+x+1/6), HOẶC k chỉ là 1 hằng số cộng thêm, như C-x/450) — engine giải k bằng
 *  2 lần tích phân số (k=0 và k=1) rồi suy hệ số tuyến tính, không cần đại số ký hiệu. */
export interface ContinuousDensitySpec {
  domain: [number, number];
  fn: (x: number, k: number) => number;
  expr: string; // hiển thị trong narration, vd "K(x³/4+x+1/6)"
  probabilityQuery: { from: number; to: number }; // cận đề cho — có thể nằm ngoài domain
  verifiedK: number;
  verifiedMean: number;
  /** Không phải mọi đề đều cho Var(X) trong đáp án — khi thiếu, engine vẫn tính (toán
   *  đúng từ f(x) đã cho) nhưng không so với "đáp án đề" trong narration. */
  verifiedVariance?: number;
  verifiedProbabilityPercent: number;
  unit?: string;
}

export type NormalQueryMode = "cdf-left" | "cdf-right" | "inverse-left" | "inverse-topk";

/** 1 trong 2 câu hỏi (a/b) mà mọi đề phân phối chuẩn trong bộ tài liệu này đặt ra. */
export interface NormalQuery {
  mode: NormalQueryMode;
  label: string; // câu hỏi hiển thị, vd "Tỷ lệ phải bảo hành = P(X<2800)"
  /** cdf-left/cdf-right: ngưỡng X. inverse-left: % mục tiêu bên trái, P(X<T)=input%.
   *  inverse-topk: % "nhóm cao nhất", P(X>x0)=input%. */
  input: number;
  /** Ngưỡng x0/T đã verify từ đáp án đề — BẮT BUỘC cho inverse-left/inverse-topk, dùng
   *  để back-derive z thay vì tính bằng nghịch đảo CDF liên tục (xem docs/decisions.md:
   *  đáp án đề dùng bảng Laplace nội suy, làm tròn khác hàm liên tục ~0.1 đơn vị). */
  verifiedThreshold?: number;
}

/** Dạng 4 (phân phối chuẩn): μ, σ, và đúng 2 câu hỏi mỗi đề (luôn 1 chiều thuận + 1
 *  chiều ngược, nhưng hướng/kiểu tra bảng khác nhau tùy đề — xem `NormalQueryMode`). */
export interface NormalSpec {
  mean: number;
  stdDev: number;
  unit: string;
  queries: NormalQuery[];
}

/** Dạng 4 (ước lượng khoảng khi BIẾT σ + tìm cỡ mẫu tối thiểu). */
export interface ConfidenceIntervalSpec {
  sampleMean: number;
  knownStdDev: number; // σ đã biết trước — khác độ lệch chuẩn MẪU (xem TTestSpec)
  n: number;
  confidenceLevel: number; // 0.9, 0.95, 0.99...
  unit?: string;
  /** Câu hỏi cỡ mẫu tối thiểu đi kèm (không phải đề nào cũng hỏi). */
  minSampleSize?: { maxError: number; verifiedN: number };
}

/** Một khoảng tần số ghép nhóm (bin) — trung điểm + tần số, dùng khi đề cho bảng tần
 *  số thay vì cho x̄/S trực tiếp. */
export interface FrequencyBin {
  midpoint: number;
  frequency: number;
}

/** Dạng 5 (ước lượng + kiểm định tỷ lệ TỪ bảng tần số ghép nhóm) — khác dạng 6 (below)
 *  ở việc x̄/S và tỷ lệ mẫu phải tự suy ra từ `bins` trước, không cho sẵn trực tiếp. */
export interface GroupedProportionSpec {
  bins: FrequencyBin[];
  unit?: string;
  confidenceLevel: number; // cho khoảng tin cậy của μ
  /** Đếm tần số các bin có midpoint ≥ ngưỡng này làm tử số cho tỷ lệ mẫu (kiểm định
   *  luôn 1 phía phải, p>p0 — đúng cả 2 đề hiện có). */
  proportionThreshold: number;
  proportionLabel: string; // "tỷ lệ sinh viên cao lý tưởng (≥180cm)"
  claimedProportion: number; // p0
  alpha: number;
}

/** Dạng 6 (kiểm định + ước lượng khoảng cho tỷ lệ, f cho sẵn/suy trực tiếp từ mẫu —
 *  không cần bảng tần số ghép nhóm như dạng 5). */
export interface ProportionTestSpec {
  sampleSize: number;
  successCount: number;
  claimedProportion: number;
  alpha: number;
  tail: "two" | "less" | "greater";
  /** Câu ước lượng khoảng cho p đi kèm (không phải đề nào cũng có). */
  confidenceInterval?: { confidenceLevel: number };
}

/** Dạng 7 (ước lượng/kiểm định trung bình khi CHƯA biết σ — dùng Student-t). t tra
 *  bảng theo df (input, không tính bằng công thức liên tục) — đúng cách một học sinh
 *  thật sự làm (bảng t rời rạc theo df, không như bảng Laplace/z có thể nội suy). */
export interface TTestSpec {
  values: number[];
  unit?: string;
  confidenceLevel: number;
  tCriticalForCI: number; // t_{alpha/2, df} tra bảng
  nullMean: number;
  alternative: "greater" | "less" | "two-sided";
  alpha: number;
  tCriticalForTest: number; // t_{alpha, df} hoặc t_{alpha/2, df} tra bảng
}

/** Dạng 8 (tương quan & hồi quy tuyến tính). */
export interface RegressionSpec {
  xLabel: string;
  yLabel: string;
  unit?: string;
  /** Để trống khi đề KHÔNG có đủ dữ liệu điểm gốc (vd bảng tần số 2 chiều thiếu) —
   *  engine dùng thẳng `verified` thay vì tính lại từ điểm. */
  points?: { x: number; y: number }[];
  predictX: number;
  predictLabel: string; // "Dự đoán năm 2028"
  verified: { r?: number; slope: number; intercept: number; predictedY: number };
  missingRawDataNote?: string;
}

/** Dạng 9 (phân phối đồng thời rời rạc). */
export interface JointDiscreteSpec {
  xValues: number[];
  yValues: number[];
  /** P(X=x,Y=y) — key `${x},${y}`. */
  probabilities: Record<string, number>;
  eventTest: (x: number, y: number) => boolean;
  eventLabel: string; // "X+Y>1"
}

/** Dạng 10 (phân phối đồng thời liên tục) — miền chữ nhật cố định, đủ cho đề hiện có. */
export interface JointContinuousSpec {
  fn: (x: number, y: number) => number; // f(x,y), ĐÃ có hằng số c
  xDomain: [number, number];
  yDomain: [number, number];
  /** Câu hỏi điều kiện TẠI 1 giá trị cụ thể X=x0 (mật độ có điều kiện). */
  pointConditional: { x0: number; yFrom: number; yTo: number };
  /** Câu hỏi điều kiện trên 1 KHOẢNG X (xác suất có điều kiện P(B|A)=P(A∩B)/P(A)). */
  intervalConditional: { xFrom: number; xTo: number; yFrom: number; yTo: number };
}
