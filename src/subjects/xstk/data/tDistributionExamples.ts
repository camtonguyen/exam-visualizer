import type { TTestSpec } from "@/engine/types";
import type { CalculatorTipData } from "@/components/ui/CalculatorTip";
import type { AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export interface TDistributionExample {
  id: string;
  label: string;
  spec: TTestSpec;
  tip?: string;
  calculatorTip: CalculatorTipData;
  answerKey: AnswerKeySpec;
}

/**
 * 1 ví dụ thật duy nhất, transcribed từ `docs/xstk/files/ck_xstk_hk2_2023_2024.md`
 * Câu 4 — đề DUY NHẤT trong cả bộ tài liệu không cho σ (phải tự tính s từ mẫu) và có
 * n nhỏ (15), nên phải dùng Student-t. Cũng là ví dụ DUY NHẤT có BÁC BỎ H0 — mọi kiểm
 * định khác trong bộ tài liệu đều kết luận "không bác bỏ".
 */
export const T_DISTRIBUTION_EXAMPLES: TDistributionExample[] = [
  {
    id: "ck-hk2-ph-ho",
    label: "CK HK2 2023-2024 — pH của các hồ",
    spec: {
      values: [7.2, 7.3, 6.1, 6.9, 6.6, 7.9, 5.8, 7.3, 6.3, 5.5, 6.3, 6.5, 5.7, 6.9, 6.7],
      confidenceLevel: 0.95,
      tCriticalForCI: 2.145,
      nullMean: 6,
      alternative: "greater",
      alpha: 0.05,
      tCriticalForTest: 1.761,
    },
    tip: "Đây là điểm khác biệt lớn nhất so với các câu ước lượng/kiểm định trước — vì σ (độ lệch chuẩn tổng thể) không biết, và cỡ mẫu n=15 nhỏ, nên PHẢI dùng phân phối Student-t (không dùng z chuẩn), với bậc tự do = n−1.",
    calculatorTip: {
      menu: "STAT → 1-Variable (+ Distribution → Inverse t / tra bảng t)",
      steps: [
        "MODE→Statistics(STAT)→1-Variable, nhập 15 giá trị pH vào cột X",
        "SHIFT→STAT→Var→x̄ → 6.6",
        "SHIFT→STAT→xσn-1 → 0.672",
        "Tra bảng t (hoặc Distribution→Inverse t nếu máy có): t_{0,025,14}=2,145; t_{0,05,14}=1,761",
        "2.145×0.672÷√15 =         → 0.372    (câu a)",
        "(6.6-6)÷(0.672÷√15) =     → 3.458    (câu b)",
      ],
    },
    answerKey: {
      title: "Câu 4 — Ước lượng & kiểm định trung bình khi CHƯA biết σ (Student-t)",
      totalPoints: 3,
      setup: [
        { text: "pH tại 15 hồ: 7,2/7,3/6,1/6,9/6,6/7,9/5,8/7,3/6,3/5,5/6,3/6,5/5,7/6,9/6,7." },
        { text: "n=15; x̄=6,6; s=0,672 (độ lệch chuẩn mẫu). Bậc tự do df=14." },
      ],
      parts: [
        {
          label: "a)",
          lines: [{ text: "t_{α/2,14}=2,145; ε≈0,372; KTC=(6,228 ; 6,972)" }],
        },
        {
          label: "b)",
          lines: [
            {
              text: "H0:μ=6 vs H1:μ>6. t≈3,458 > t_{0,05,14}=1,761 ⇒ BÁC BỎ H0 (pH trung bình lớn hơn 6).",
            },
          ],
        },
      ],
    },
  },
];
