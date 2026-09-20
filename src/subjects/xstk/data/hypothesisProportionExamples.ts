import type { ProportionTestSpec } from "@/engine/types";
import type { CalculatorTipData } from "@/components/ui/CalculatorTip";
import type { AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export interface HypothesisProportionExample {
  id: string;
  label: string;
  spec: ProportionTestSpec;
  tip?: string;
  calculatorTip: CalculatorTipData;
  answerKey: AnswerKeySpec;
}

/**
 * 3 ví dụ thật, transcribed từ `docs/xstk/files/*.md`. UICD Đề1/Đề2 (Câu 5, cả 2 phía —
 * đề không nêu hướng lệch); CK HK2 2023-2024 Câu3 (1 phía TRÁI — đề nêu rõ "ít hơn" —
 * kèm câu b ước lượng khoảng cho p, độ tin cậy 90%, dùng chung n/f với câu a).
 */
export const HYPOTHESIS_PROPORTION_EXAMPLES: HypothesisProportionExample[] = [
  {
    id: "uicd-de1-gym",
    label: "UICD Đề 1 — Tỷ lệ tránh tinh bột (2 phía)",
    spec: {
      sampleSize: 300,
      successCount: 182,
      claimedProportion: 0.6,
      alpha: 0.05,
      tail: "two",
    },
    tip: 'Phân biệt kiểm định 1 phía / 2 phía ngay từ đề bài: "khác với", "có thể bác bỏ tuyên bố" (không nêu hướng) → 2 phía, dùng z_{α/2}; "lớn hơn"/"nhỏ hơn" (nêu rõ hướng) → 1 phía, dùng z_α.',
    calculatorTip: {
      menu: "MODE COMP (+ InverseNormal cho z)",
      steps: [
        "(182÷300-0.6)÷√(0.6×0.4÷300) =     → 0.236",
        "z₀,₀₂₅=1,96 lấy bằng InverseNormal (Area=0,975, σ=1, μ=0).",
      ],
    },
    answerKey: {
      title: "Câu 5 — Kiểm định giả thuyết về tỷ lệ",
      totalPoints: 2,
      setup: [
        {
          text: "Tuyên bố p₀=0,6 (60% người tập gym tránh tinh bột); khảo sát n=300, có 182 người xác nhận. α=5%.",
        },
        { text: "H0: p=0,6   H1: p≠0,6 (2 phía, đề không nêu hướng)" },
      ],
      parts: [
        {
          label: "",
          lines: [{ text: "f=182/300≈0,6067. Z≈0,236. |Z|<z_0,025=1,96 ⇒ KHÔNG bác bỏ H0." }],
        },
      ],
    },
  },
  {
    id: "uicd-de2-thuonghieu",
    label: "UICD Đề 2 — Nhận biết thương hiệu (2 phía)",
    spec: {
      sampleSize: 400,
      successCount: 300,
      claimedProportion: 0.8,
      alpha: 0.01,
      tail: "two",
    },
    tip: "Kiểm định 2 phía luôn so sánh |Z| với z_{α/2} (α chia đôi 2 bên) — khác với kiểm định 1 phía chỉ dùng z_α.",
    calculatorTip: {
      menu: "MODE COMP (+ InverseNormal cho z)",
      steps: [
        "(0.75-0.8)÷√(0.8×0.2÷400) =    → -2.5",
        "z₀,₀₀₅=2,576 lấy bằng InverseNormal, Area=0,995, σ=1, μ=0.",
      ],
    },
    answerKey: {
      title: "Câu 5 — Kiểm định giả thuyết về tỷ lệ",
      totalPoints: 2,
      setup: [
        { text: "Tuyên bố p₀=0,8 (80% nhận biết thương hiệu Y); khảo sát n=400, có 300 người nhận biết. α=1%." },
        { text: "H0: p=0,8   H1: p≠0,8 (2 phía, đề hỏi \"khác với 80%\")" },
      ],
      parts: [
        {
          label: "",
          lines: [{ text: "f=300/400=0,75. Z=-2,5. |Z|=2,5<z_0,005=2,576 ⇒ KHÔNG bác bỏ H0." }],
        },
      ],
    },
  },
  {
    id: "ck-hk2-thietbi",
    label: "CK HK2 2023-2024 — Tỷ lệ thiết bị lỗi (1 phía trái)",
    spec: {
      sampleSize: 200,
      successCount: 7,
      claimedProportion: 0.04,
      alpha: 0.05,
      tail: "less",
      confidenceInterval: { confidenceLevel: 0.9 },
    },
    tip: "Câu a dùng z_α (1 phía) vì đề nêu rõ \"ít hơn\"; câu b luôn dùng z_{α/2} vì ước lượng khoảng bản chất là kiểm định 2 phía tại mọi điểm.",
    calculatorTip: {
      menu: "MODE COMP (+ InverseNormal cho z)",
      steps: [
        "(0.035-0.04)÷√(0.04×0.96÷200) =     → -0.36     (câu a)",
        "1.645×√(0.035×0.965÷200) =          → 0.021      (câu b)",
        "z_α=1,645 lấy bằng InverseNormal (Area=0,95, σ=1, μ=0).",
      ],
    },
    answerKey: {
      title: "Câu 3 — Kiểm định & ước lượng tỷ lệ",
      totalPoints: 2.5,
      setup: [{ text: "n=200 thiết bị, 7 bị lỗi → f=7/200=0,035." }],
      parts: [
        {
          label: "a)",
          lines: [
            {
              text: "H0:p=0,04 vs H1:p<0,04 (1 phía trái). Z≈−0,36 > z_α=−1,645 ⇒ KHÔNG bác bỏ H0.",
            },
          ],
        },
        {
          label: "b)",
          lines: [{ text: "z_{α/2}=1,645; ε≈0,021; KTC cho p = (0,014 ; 0,056), độ tin cậy 90%." }],
        },
      ],
    },
  },
];
