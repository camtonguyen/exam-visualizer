import type { ContinuousDensitySpec } from "@/engine/types";
import type { CalculatorTipData } from "@/components/ui/CalculatorTip";
import type { AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export interface ContinuousDensityExample {
  id: string;
  label: string;
  spec: ContinuousDensitySpec;
  tip?: string;
  calculatorTip: CalculatorTipData;
  answerKey: AnswerKeySpec;
}

/**
 * 4 ví dụ thật, transcribed từ `docs/xstk/files/*.md`. 2 đề CITD là đa thức bậc 3 (K
 * nhân toàn biểu thức); 2 đề UICD là bậc 1 (`k - x/450`, k CHỈ là hằng số cộng thêm) và
 * bậc 2 (`k(4x-x²)`) — 3 dạng khác nhau này là lý do `runContinuousDensity` giải k bằng
 * 2 điểm tích phân số thay vì giả định "k luôn nhân toàn biểu thức". UICD 2 đề không có
 * Var(X) trong đáp án gốc — để `verifiedVariance` undefined thay vì bịa số.
 */
export const CONTINUOUS_DENSITY_EXAMPLES: ContinuousDensityExample[] = [
  {
    id: "citd-de1-tuoitho",
    label: "CITD Đề 1 — Tuổi thọ (bậc 3)",
    spec: {
      domain: [0, 6],
      fn: (x, k) => k * (x ** 3 / 4 + x + 1 / 6),
      expr: "K(x³/4+x+1/6)",
      probabilityQuery: { from: -3, to: 4 },
      verifiedK: 0.01,
      verifiedMean: 4.638,
      verifiedVariance: 1.288956,
      verifiedProbabilityPercent: 24.67,
    },
    tip: "Luôn kiểm tra miền xác định trước khi lấy tích phân — cận âm (ở đây là −3) nằm ngoài [0,6] nên f(x)=0 trên đoạn đó, chỉ cần tính từ 0 đến 4.",
    calculatorTip: {
      menu: "MODE COMP → ∫dx",
      steps: [
        "∫(X³/4+X+1/6,0,6) =                    → 100  → K=1/100",
        "∫(0.01×X×(X³/4+X+1/6),0,6) =            → 4.638",
        "∫(0.01×(X-4.638)²×(X³/4+X+1/6),0,6) =   → 1.288956",
        "∫(0.01×(X³/4+X+1/6),0,4) =              → 0.2467",
      ],
    },
    answerKey: {
      title: "Câu 3 — Biến ngẫu nhiên liên tục",
      totalPoints: 2,
      setup: [{ text: "f(x) = K(x³/4+x+1/6), 0≤x≤6." }],
      parts: [
        { label: "a)", lines: [{ text: "∫₀⁶ f(x)dx = 1 ⇒ K = 1/100 = 0,01" }] },
        { label: "b)", lines: [{ text: "E(X) = 2319/500 = 4,638   Var(X) ≈ 1,288956" }] },
        { label: "c)", lines: [{ text: "P(−3≤X≤4) = ∫₀⁴ f(x)dx = 37/150 ≈ 24,67% (đổi cận vì f(x)=0 ngoài [0,6])" }] },
      ],
    },
  },
  {
    id: "citd-de2-tuoitho",
    label: "CITD Đề 2 — Tuổi thọ (bậc 3)",
    spec: {
      domain: [0, 5],
      fn: (x, k) => k * ((12 * x ** 3) / 25 + (2 * x) / 3 + 10 / 3),
      expr: "K(12x³/25+2x/3+10/3)",
      probabilityQuery: { from: -4, to: 1 },
      verifiedK: 0.01,
      verifiedMean: 3.6944,
      verifiedVariance: 1.281636,
      verifiedProbabilityPercent: 3.79,
    },
    tip: "Giống câu 3 của Đề 1 — kiểm tra miền xác định trước, cận −4 nằm ngoài [0,5] nên bỏ qua, chỉ tính từ 0 đến 1.",
    calculatorTip: {
      menu: "MODE COMP → ∫dx",
      steps: [
        "∫(12X³/25+2X/3+10/3,0,5) =                        → 100 → K=1/100",
        "∫(0.01×X×(12X³/25+2X/3+10/3),0,5) =                 → 3.6944",
        "∫(0.01×(X-3.6944)²×(12X³/25+2X/3+10/3),0,5) =       → 1.2816",
        "∫(0.01×(12X³/25+2X/3+10/3),0,1) =                   → 0.0379",
      ],
    },
    answerKey: {
      title: "Câu 3 — Biến ngẫu nhiên liên tục",
      totalPoints: 2,
      setup: [{ text: "f(x) = K(12x³/25+2x/3+10/3), 0≤x≤5." }],
      parts: [
        { label: "a)", lines: [{ text: "∫₀⁵ f(x)dx = 1 ⇒ K = 1/100 = 0,01" }] },
        { label: "b)", lines: [{ text: "E(X) = 133/36 ≈ 3,6944   Var(X) = 1661/1296 ≈ 1,281636" }] },
        { label: "c)", lines: [{ text: "P(−4≤X≤1) = ∫₀¹ f(x)dx = 71/1875 ≈ 3,79%" }] },
      ],
    },
  },
  {
    id: "uicd-de1-bongden",
    label: "UICD Đề 1 — Tuổi thọ bóng đèn (bậc 1)",
    spec: {
      domain: [0, 30],
      fn: (x, k) => k - x / 450,
      expr: "K - x/450",
      probabilityQuery: { from: 15, to: 30 },
      verifiedK: 1 / 15,
      verifiedMean: 10,
      verifiedProbabilityPercent: 25,
      unit: "tháng",
    },
    tip: "Với hàm bậc nhất (đường thẳng), có thể tính nhanh bằng công thức diện tích hình thang thay vì nguyên hàm — nhưng khi trình bày bài thi vẫn nên viết đủ bước tích phân để chắc điểm.",
    calculatorTip: {
      menu: "MODE COMP → ∫dx",
      steps: [
        "∫(1/15 - X/450, 0, 30) =        → 1          (kiểm tra tổng xác suất = 1)",
        "∫(X×(1/15 - X/450), 0, 30) =    → 10          (câu b)",
        "∫(1/15 - X/450, 15, 30) =       → 0.25        (câu c)",
      ],
    },
    answerKey: {
      title: "Câu 2 — Biến ngẫu nhiên liên tục",
      totalPoints: 2,
      setup: [{ text: "f(x) = K − x/450, 0≤x≤30 (tuổi thọ bóng đèn, tháng)." }],
      parts: [
        { label: "a)", lines: [{ text: "∫₀³⁰ (K−x/450)dx = 1 ⇒ K = 1/15 ≈ 0,0667" }] },
        { label: "b)", lines: [{ text: "E(X) = ∫₀³⁰ x(K−x/450)dx = 10 (tháng)" }] },
        { label: "c)", lines: [{ text: "P(X≥15) = ∫₁₅³⁰ (K−x/450)dx = 0,25 = 25%" }] },
      ],
    },
  },
  {
    id: "uicd-de2-loinhuan",
    label: "UICD Đề 2 — Lợi nhuận hàng ngày (bậc 2)",
    spec: {
      domain: [0, 4],
      fn: (x, k) => k * (4 * x - x ** 2),
      expr: "K(4x-x²)",
      probabilityQuery: { from: 3, to: 4 },
      verifiedK: 3 / 32,
      verifiedMean: 2,
      verifiedProbabilityPercent: 15.625,
      unit: "triệu đồng",
    },
    tip: "Với f(x) dạng đa thức, nguyên hàm tay chắc điểm hơn — dùng máy tích phân chỉ để kiểm tra lại kết quả.",
    calculatorTip: {
      menu: "MODE COMP → ∫dx",
      steps: [
        "∫(4X-X²,0,4) =                    → 10.667 (=32/3, để tìm K = 1/kết_quả)",
        "∫((3/32)(4X-X²),3,4) =            → 0.15625",
      ],
    },
    answerKey: {
      title: "Câu 2 — Biến ngẫu nhiên liên tục",
      totalPoints: 2,
      setup: [{ text: "f(x) = K(4x−x²), 0≤x≤4 (lợi nhuận hàng ngày, triệu đồng)." }],
      parts: [
        { label: "a)", lines: [{ text: "∫₀⁴ (4x−x²)dx = 32/3 ⇒ K = 3/32" }] },
        { label: "b)", lines: [{ text: "E(X) = K∫₀⁴ (4x²−x³)dx = 2 (triệu đồng)" }] },
        { label: "c)", lines: [{ text: "P(X>3) = K∫₃⁴ (4x−x²)dx = 5/32 ≈ 15,625%" }] },
      ],
    },
  },
];
