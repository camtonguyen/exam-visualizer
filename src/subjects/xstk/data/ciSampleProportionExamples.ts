import type { GroupedProportionSpec } from "@/engine/types";
import type { CalculatorTipData } from "@/components/ui/CalculatorTip";
import type { AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export interface CiSampleProportionExample {
  id: string;
  label: string;
  spec: GroupedProportionSpec;
  tip?: string;
  calculatorTip: CalculatorTipData;
  answerKey: AnswerKeySpec;
}

/**
 * 2 ví dụ thật, transcribed từ `docs/xstk/files/citd_hk1_2025_2026_de{1,2}.md` Câu 4 —
 * cả 2: bảng tần số ghép nhóm 7 khoảng, n=380, hỏi x̄/S, KTC cho μ, và kiểm định tỷ lệ
 * (1 phía phải).
 */
export const CI_SAMPLE_PROPORTION_EXAMPLES: CiSampleProportionExample[] = [
  {
    id: "citd-de1-chieucao",
    label: "CITD Đề 1 — Chiều cao sinh viên",
    spec: {
      bins: [
        { midpoint: 162, frequency: 38 },
        { midpoint: 166, frequency: 54 },
        { midpoint: 170, frequency: 74 },
        { midpoint: 174, frequency: 115 },
        { midpoint: 178, frequency: 57 },
        { midpoint: 182, frequency: 28 },
        { midpoint: 186, frequency: 14 },
      ],
      unit: "cm",
      confidenceLevel: 0.95,
      proportionThreshold: 180,
      proportionLabel: "Tỷ lệ sinh viên cao lý tưởng (≥180cm)",
      claimedProportion: 0.1,
      alpha: 0.01,
    },
    tip: "Với bảng tần số ghép nhóm, KHÔNG bấm nhập từng giá trị — dùng trung điểm khoảng + tần số nᵢ, nhập vào máy theo cặp (giá trị đại diện, tần số) để tiết kiệm thời gian và tránh sai sót.",
    calculatorTip: {
      menu: "STAT → 1-Variable (Frequency ON) + MODE COMP",
      steps: [
        "MODE→STAT→1-Variable, SETUP→Frequency→ON",
        "Nhập (trung điểm,tần số): (162,38)(166,54)(170,74)(174,115)(178,57)(182,28)(186,14)",
        "SHIFT→STAT→Var → x̄=172.516, xσn-1=6.0767",
        "1.96×6.076666142÷√380 =        → 0.611",
        "((28+14)/380-0.1)÷√(0.1×0.9÷380) =   → 0.684",
        "z_{0,01}=2,326 lấy bằng InverseNormal (Area=0,99, σ=1, μ=0).",
      ],
    },
    answerKey: {
      title: "Câu 4 — Ước lượng khoảng & kiểm định tỷ lệ từ bảng tần số",
      totalPoints: 2.5,
      setup: [{ text: "Chiều cao 380 sinh viên theo bảng tần số ghép nhóm (7 khoảng từ 160-188cm)." }],
      parts: [
        { label: "a)", lines: [{ text: "x̄ ≈ 172,5157895 (cm); S ≈ 6,076666142 (cm)" }] },
        {
          label: "b)",
          lines: [{ text: "z_{α/2}=1,96; ε≈0,6110; KTC=(171,9048 ; 173,1268) cm" }],
        },
        {
          label: "c)",
          lines: [
            {
              text: "f=(28+14)/380=21/190≈0,1105. H0:p=0,1 vs H1:p>0,1. Z≈0,6840 < z_0,01≈2,326 ⇒ KHÔNG bác bỏ H0.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "citd-de2-chieucao",
    label: "CITD Đề 2 — Chiều cao sinh viên",
    spec: {
      bins: [
        { midpoint: 164, frequency: 39 },
        { midpoint: 168, frequency: 58 },
        { midpoint: 172, frequency: 75 },
        { midpoint: 176, frequency: 112 },
        { midpoint: 180, frequency: 63 },
        { midpoint: 184, frequency: 21 },
        { midpoint: 188, frequency: 12 },
      ],
      unit: "cm",
      confidenceLevel: 0.95,
      proportionThreshold: 182,
      proportionLabel: "Tỷ lệ sinh viên cao lý tưởng (≥182cm)",
      claimedProportion: 0.08,
      alpha: 0.01,
    },
    calculatorTip: {
      menu: "STAT → 1-Variable (Frequency ON) + MODE COMP",
      steps: [
        "MODE→STAT→1-Variable, SETUP→Frequency→ON",
        "Nhập (trung điểm,tần số): (164,39)(168,58)(172,75)(176,112)(180,63)(184,21)(188,12)",
        "SHIFT→STAT→Var → x̄=174.242, xσn-1=5.9536",
        "1.96×5.95358616÷√380 =         → 0.5986",
        "(33/380-0.08)÷√(0.08×0.92÷380) =  → 0.4916",
      ],
    },
    answerKey: {
      title: "Câu 4 — Ước lượng khoảng & kiểm định tỷ lệ từ bảng tần số",
      totalPoints: 2.5,
      setup: [{ text: "Chiều cao 380 sinh viên theo bảng tần số ghép nhóm (7 khoảng từ 162-190cm)." }],
      parts: [
        { label: "a)", lines: [{ text: "x̄ ≈ 174,2421053 (cm); S ≈ 5,95358616 (cm)" }] },
        {
          label: "b)",
          lines: [{ text: "z_{α/2}=1,96; ε≈0,5986; KTC=(173,6435 ; 174,8407) cm" }],
        },
        {
          label: "c)",
          lines: [
            {
              text: "f=33/380≈0,0868. H0:p=0,08 vs H1:p>0,08. Z≈0,4916 < z_0,01≈2,326 ⇒ KHÔNG bác bỏ H0.",
            },
          ],
        },
      ],
    },
  },
];
