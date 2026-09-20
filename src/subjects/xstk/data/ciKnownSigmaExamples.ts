import type { ConfidenceIntervalSpec } from "@/engine/types";
import type { CalculatorTipData } from "@/components/ui/CalculatorTip";
import type { AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export interface CiKnownSigmaExample {
  id: string;
  label: string;
  spec: ConfidenceIntervalSpec;
  tip?: string;
  calculatorTip: CalculatorTipData;
  answerKey: AnswerKeySpec;
}

/**
 * 2 ví dụ thật, transcribed từ `docs/xstk/files/{de1,de2}_uicd_2025.md` Câu 4 — cả 2
 * đều: cho σ biết trước + n + x̄, hỏi khoảng tin cậy VÀ cỡ mẫu tối thiểu.
 */
export const CI_KNOWN_SIGMA_EXAMPLES: CiKnownSigmaExample[] = [
  {
    id: "uicd-de1-tieuhaonhienlieu",
    label: "UICD Đề 1 — Tiêu hao nhiên liệu",
    spec: {
      sampleMean: 25.6,
      knownStdDev: 4.8,
      n: 64,
      confidenceLevel: 0.95,
      unit: "km/l",
      minSampleSize: { maxError: 3.1, verifiedN: 10 },
    },
    tip: "Luôn làm tròn n LÊN số nguyên gần nhất — n nhỏ hơn giá trị tính được sẽ không đảm bảo sai số yêu cầu.",
    calculatorTip: {
      menu: "MODE COMP (+ InverseNormal cho z)",
      steps: [
        "1.96×4.8÷8 =                 → 1.176   (câu a, vì √64=8)",
        "(1.96×4.8÷3.1)² =            → 9.21 → làm tròn lên 10",
        "z₀,₀₂₅=1,96 lấy nhanh bằng InverseNormal, Area=0,975, σ=1, μ=0.",
      ],
    },
    answerKey: {
      title: "Câu 4 — Ước lượng khoảng & cỡ mẫu (biết σ)",
      totalPoints: 2,
      setup: [{ text: "σ = 4,8 km/l; n = 64; x̄ = 25,6 km/l." }],
      parts: [
        {
          label: "a)",
          lines: [{ text: "z_{α/2}=1,96; ε=1,96×4,8/√64=1,176; KTC=(24,424 ; 26,776)" }],
        },
        {
          label: "b)",
          lines: [{ text: "n ≥ (1,96×4,8/3,1)² ≈ 9,21 ⇒ n = 10 (làm tròn LÊN)" }],
        },
      ],
    },
  },
  {
    id: "uicd-de2-khoiluonggoi",
    label: "UICD Đề 2 — Khối lượng gói hàng",
    spec: {
      sampleMean: 505,
      knownStdDev: 15,
      n: 36,
      confidenceLevel: 0.99,
      unit: "gram",
      minSampleSize: { maxError: 5, verifiedN: 60 },
    },
    tip: "Đây là lỗi hay bị trừ điểm nhất — n phải làm tròn LÊN (60), làm tròn xuống (59) sẽ không đủ đảm bảo sai số ≤ 5g.",
    calculatorTip: {
      menu: "MODE COMP (+ InverseNormal cho z)",
      steps: [
        "2.576×15÷6 =              → 6.44    (câu a, √36=6)",
        "(2.576×15÷5)² =           → 59.72 → làm tròn lên 60",
        "z₀,₀₀₅=2,576 lấy nhanh bằng InverseNormal, Area=0,995, σ=1, μ=0.",
      ],
    },
    answerKey: {
      title: "Câu 4 — Ước lượng khoảng & cỡ mẫu (biết σ)",
      totalPoints: 2,
      setup: [{ text: "σ=15g, n=36, x̄=505g." }],
      parts: [
        {
          label: "a)",
          lines: [{ text: "z_{α/2}=2,576; ε=2,576×15/√36=6,44; KTC=(498,56 ; 511,44) gram" }],
        },
        {
          label: "b)",
          lines: [{ text: "n ≥ (2,576×15/5)² ≈ 59,72 ⇒ n = 60 (làm tròn LÊN)" }],
        },
      ],
    },
  },
];
