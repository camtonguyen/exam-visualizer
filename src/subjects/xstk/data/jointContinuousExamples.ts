import type { JointContinuousSpec } from "@/engine/types";
import type { CalculatorTipData } from "@/components/ui/CalculatorTip";
import type { AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export interface JointContinuousExample {
  id: string;
  label: string;
  spec: JointContinuousSpec;
  tip?: string;
  calculatorTip: CalculatorTipData;
  answerKey: AnswerKeySpec;
}

/**
 * 1 ví dụ thật duy nhất, transcribed từ `docs/xstk/files/ck_xstk_hk2_2023_2024.md`
 * Câu 2 — dạng bài KHÔNG xuất hiện trong 4 đề CITD/UICD. Đây là dạng DỄ NHẦM NHẤT theo
 * chính lời giải gốc: câu c hỏi điều kiện TẠI 1 điểm X=x0, câu d hỏi điều kiện trên 1
 * KHOẢNG X — 2 công thức khác nhau.
 */
export const JOINT_CONTINUOUS_EXAMPLES: JointContinuousExample[] = [
  {
    id: "ck-hk2-fxy",
    label: "CK HK2 2023-2024 — f(x,y)=c(2x+y)",
    spec: {
      fn: (x, y) => 0.25 * (2 * x + y),
      xDomain: [0, 1],
      yDomain: [0, 2],
      pointConditional: { x0: 0.5, yFrom: 1, yTo: 2 },
      intervalConditional: { xFrom: 0.5, xTo: 1, yFrom: 1, yTo: 2 },
    },
    tip: "Câu c: điều kiện là X = một giá trị cụ thể → dùng công thức mật độ có điều kiện fY(y|x) = f(x,y)/fX(x). Câu d: điều kiện là X thuộc một khoảng → dùng công thức xác suất có điều kiện thông thường P(B|A)=P(A∩B)/P(A), tính bằng tích phân kép trên miền tương ứng.",
    calculatorTip: {
      menu: "MODE COMP → ∫dx lồng nhau (tích phân kép)",
      steps: [
        "∫(∫((1/4)(2X+Y),0,2),0,1) =              → 1     (kiểm tra câu a)",
        "∫((1/4)(2×0.5+Y),1,2) =                   → 0.625 (câu c, thế X=0.5 trước)",
        "∫(X+0.5,0.5,1) =                          → 0.625 (mẫu số câu d: P(X>1/2))",
        "∫(∫((1/4)(2X+Y),1,2),0.5,1) =             → 0.375 (tử số câu d)",
        "0.375÷0.625 =                             → 0.6   (kết quả câu d)",
      ],
    },
    answerKey: {
      title: "Câu 2 — Phân phối đồng thời liên tục",
      totalPoints: 2,
      setup: [{ text: "f(x,y) = c(2x+y), 0≤x≤1, 0≤y≤2." }],
      parts: [
        { label: "a)", lines: [{ text: "1 = ∫₀¹∫₀² c(2x+y)dydx = 4c ⇒ c = 1/4" }] },
        { label: "b)", lines: [{ text: "fX(x) = ∫₀² (1/4)(2x+y)dy = x + 1/2, 0≤x≤1" }] },
        {
          label: "c)",
          lines: [
            { text: "fY(y|x=1/2)=f(1/2,y)/fX(1/2)=(1/4)(1+y). P(Y>1|X=1/2)=∫₁²(1/4)(1+y)dy=5/8=0,625" },
          ],
        },
        {
          label: "d)",
          lines: [
            {
              text: "P(X>1/2)=5/8. P(Y>1,X>1/2)=3/8 (tích phân kép). P(Y>1|X>1/2)=(3/8)/(5/8)=3/5=0,6",
            },
          ],
        },
      ],
    },
  },
];
