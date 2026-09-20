import type { JointDiscreteSpec } from "@/engine/types";
import type { CalculatorTipData } from "@/components/ui/CalculatorTip";
import type { AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export interface JointDiscreteExample {
  id: string;
  label: string;
  spec: JointDiscreteSpec;
  tip?: string;
  calculatorTip: CalculatorTipData;
  answerKey: AnswerKeySpec;
}

/**
 * 1 ví dụ thật duy nhất, transcribed từ `docs/xstk/files/ck_xstk_hk2_2023_2024.md`
 * Câu 1 — dạng bài KHÔNG xuất hiện trong 4 đề CITD/UICD, chỉ có ở đề CK HK2.
 */
export const JOINT_DISCRETE_EXAMPLES: JointDiscreteExample[] = [
  {
    id: "ck-hk2-bang-xy",
    label: "CK HK2 2023-2024 — Bảng phân phối đồng thời P(X,Y)",
    spec: {
      xValues: [0, 1, 2],
      yValues: [0, 1, 2],
      probabilities: {
        "0,0": 0.2,
        "0,1": 0.1,
        "0,2": 0.15,
        "1,0": 0.3,
        "1,1": 0.15,
        "1,2": 0,
        "2,0": 0.1,
        "2,1": 0,
        "2,2": 0,
      },
      eventTest: (x, y) => x + y > 1,
      eventLabel: "X+Y>1",
    },
    tip: 'Không cần kiểm tra hết 9 ô — chỉ cần tìm 1 ô "lệch" bất kỳ (thường chọn ô có giá trị 0 vì dễ thấy khác tích xác suất thành phần).',
    calculatorTip: {
      menu: "MODE COMP (cộng/nhân đơn giản, không cần chức năng đặc biệt)",
      steps: [
        "P(X=0)=0,2+0,1+0,15=0,45; P(X=1)=0,3+0,15+0=0,45; P(X=2)=0,1+0+0=0,1",
        "P(X+Y>1): (0,2)=0,15 + (1,1)=0,15 + (2,0)=0,1 = 0,4",
        "P(X=2)·P(Y=2)=0,1×0,15=0,015 ≠ P(X=2,Y=2)=0 ⇒ không độc lập",
      ],
    },
    answerKey: {
      title: "Câu 1 — Phân phối đồng thời rời rạc",
      totalPoints: 1.5,
      setup: [
        {
          text: "Bảng P(X=x,Y=y): (0,0)=0,2 (0,1)=0,1 (0,2)=0,15 / (1,0)=0,3 (1,1)=0,15 (1,2)=0 / (2,0)=0,1 (2,1)=0 (2,2)=0",
        },
      ],
      parts: [
        {
          label: "a)",
          lines: [{ text: "P(X=0)=0,45   P(X=1)=0,45   P(X=2)=0,1" }],
        },
        { label: "b)", lines: [{ text: "P(X+Y>1) = 0,15+0,15+0,1 = 0,4" }] },
        {
          label: "c)",
          lines: [
            { text: "P(X=2)·P(Y=2)=0,1×0,15=0,015 ≠ P(X=2,Y=2)=0 ⇒ X, Y KHÔNG độc lập" },
          ],
        },
      ],
    },
  },
];
