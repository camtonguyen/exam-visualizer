import type { RegressionSpec } from "@/engine/types";
import type { CalculatorTipData } from "@/components/ui/CalculatorTip";
import type { AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export interface RegressionExample {
  id: string;
  label: string;
  spec: RegressionSpec;
  tip?: string;
  calculatorTip: CalculatorTipData;
  answerKey: AnswerKeySpec;
}

/**
 * 3 ví dụ, transcribed từ `docs/xstk/files/*.md`. CITD Đề1/Đề2 (Câu 5) có đủ 8 điểm dữ
 * liệu gốc — engine tự tính lại r/slope/intercept. CK HK2 2023-2024 Câu5 dùng bảng tần
 * số 2 CHIỀU mà tài liệu nguồn KHÔNG liệt kê đầy đủ (chỉ vài ô ví dụ trong "Bấm máy") —
 * `points` để trống, chỉ hiển thị kết quả theo đáp án (`verified`), không tự bịa bảng
 * tần số để lấp chỗ trống.
 */
export const REGRESSION_EXAMPLES: RegressionExample[] = [
  {
    id: "citd-de1-hocsinh",
    label: "CITD Đề 1 — Số học sinh vào lớp 10",
    spec: {
      xLabel: "X",
      yLabel: "Y",
      unit: "nghìn người",
      points: [
        { x: 2018, y: 8.7 },
        { x: 2019, y: 9.1 },
        { x: 2020, y: 9.3 },
        { x: 2021, y: 9.7 },
        { x: 2022, y: 9.9 },
        { x: 2023, y: 10.5 },
        { x: 2024, y: 11.0 },
        { x: 2025, y: 11.3 },
      ],
      predictX: 2028,
      predictLabel: "Dự đoán năm 2028",
      verified: { r: 0.9923, slope: 0.375, intercept: -748.125, predictedY: 12.375 },
    },
    tip: "Với X là năm (số lớn, ví dụ 2018-2025), hệ số a (hệ số chặn) thường ra số rất lớn/âm — đây là điều bình thường về mặt toán học (vì X=0 tương ứng năm 0, không có ý nghĩa thực tế), không phải sai.",
    calculatorTip: {
      menu: "STAT → A+BX (Linear Regression)",
      steps: [
        "MODE→STAT→A+BX",
        "Nhập từng cặp (Năm,Số học sinh): (2018,8.7)(2019,9.1)(2020,9.3)(2021,9.7)(2022,9.9)(2023,10.5)(2024,11.0)(2025,11.3)",
        "SHIFT→STAT→Regression → r=0.9923, A=-748.125, B=0.375",
        "Dùng phím Ŷ: nhập X=2028 → Ŷ → 12.375",
      ],
    },
    answerKey: {
      title: "Câu 5 — Hồi quy tuyến tính theo thời gian",
      totalPoints: 1.5,
      setup: [{ text: "Số học sinh vào lớp 10 qua các năm 2018-2025." }],
      parts: [
        { label: "a)", lines: [{ text: "r_{X,Y} = 0,9923 → tương quan thuận, rất mạnh." }] },
        { label: "b)", lines: [{ text: "ŷ = −748,125 + 0,375X" }] },
        { label: "c)", lines: [{ text: "Dự đoán năm 2028: ŷ = −748,125 + 0,375×2028 = 12,375 (nghìn người)" }] },
      ],
    },
  },
  {
    id: "citd-de2-hocsinh",
    label: "CITD Đề 2 — Số học sinh vào lớp 10",
    spec: {
      xLabel: "X",
      yLabel: "Y",
      unit: "nghìn người",
      points: [
        { x: 2018, y: 8.8 },
        { x: 2019, y: 9.2 },
        { x: 2020, y: 9.5 },
        { x: 2021, y: 9.8 },
        { x: 2022, y: 10.0 },
        { x: 2023, y: 10.6 },
        { x: 2024, y: 11.3 },
        { x: 2025, y: 11.5 },
      ],
      predictX: 2028,
      predictLabel: "Dự đoán năm 2028",
      verified: { r: 0.9874, slope: 0.3916666667, intercept: -781.6666667, predictedY: 12.6333 },
    },
    calculatorTip: {
      menu: "STAT → A+BX (Linear Regression)",
      steps: [
        "MODE→STAT→A+BX",
        "Nhập từng cặp (Năm,Số học sinh): (2018,8.8)(2019,9.2)(2020,9.5)(2021,9.8)(2022,10.0)(2023,10.6)(2024,11.3)(2025,11.5)",
        "SHIFT→STAT→Regression → r=0.9874, A=-781.6667, B=0.3917",
        "Dùng phím Ŷ: nhập X=2028 → Ŷ → 12.633",
      ],
    },
    answerKey: {
      title: "Câu 5 — Hồi quy tuyến tính theo thời gian",
      totalPoints: 1.5,
      setup: [{ text: "Số học sinh vào lớp 10 qua các năm 2018-2025." }],
      parts: [
        { label: "a)", lines: [{ text: "r_{X,Y} = 0,9874 → tương quan thuận, rất mạnh." }] },
        { label: "b)", lines: [{ text: "ŷ = −781,6666667 + 0,3916666667X" }] },
        { label: "c)", lines: [{ text: "Dự đoán năm 2028: ŷ ≈ 12,6333 (nghìn người)" }] },
      ],
    },
  },
  {
    id: "ck-hk2-caycoi",
    label: "CK HK2 2023-2024 — Đường kính & chiều cao cây",
    spec: {
      xLabel: "x",
      yLabel: "y",
      unit: "m",
      predictX: 30,
      predictLabel: "Dự đoán chiều cao khi đường kính x=30cm",
      verified: { slope: 0.44, intercept: -5.99, predictedY: 7.21 },
      missingRawDataNote:
        'Đề dùng bảng tần số 2 chiều (đường kính X cm, chiều cao Y m, tần số n) nhưng tài liệu nguồn KHÔNG liệt kê đầy đủ bảng — phần "Bấm máy" chỉ nêu vài ô ví dụ (X=20,Y=2,Freq=3; X=20,Y=3,Freq=5; X=22,Y=3,Freq=2; X=22,Y=4,Freq=10) rồi ghi "nhập đủ tất cả các ô" mà không liệt kê hết. Không tự bịa bảng tần số còn thiếu — chỉ hiển thị kết quả hồi quy theo đáp án đề.',
    },
    tip: 'Khi bảng tần số 2 chiều, phải "khai triển" dữ liệu — mỗi ô (x,y) có tần số n sẽ nhập n lần cặp (x,y) đó vào máy (hoặc dùng chức năng Frequency của máy để nhập tần số trực tiếp, khỏi gõ lặp lại).',
    calculatorTip: {
      menu: "STAT → A+BX / 2-Variable (Frequency ON)",
      steps: [
        "MODE→Statistics(STAT)→A+BX hoặc 2-Variable, SETUP→Frequency→ON",
        "Nhập từng (x,y,tần số) theo bảng đề cho, vd: X=20,Y=2,Freq=3; X=20,Y=3,Freq=5; X=22,Y=3,Freq=2; X=22,Y=4,Freq=10; ... (nhập đủ mọi ô có tần số khác 0)",
        "SHIFT→STAT→Regression → A≈-5.99, B≈0.44",
        "Dùng phím Ŷ: nhập X=30 → Ŷ → 7.21",
      ],
    },
    answerKey: {
      title: "Câu 5 — Hồi quy tuyến tính từ bảng tần số 2 chiều",
      totalPoints: 1,
      setup: [{ text: "Đường kính X (cm) và chiều cao Y (m) của cây, cho theo bảng tần số đồng thời." }],
      parts: [
        { label: "", lines: [{ text: "ŷ = 0,44x − 5,99 (theo đáp án)" }] },
        { label: "b)", lines: [{ text: "Dự đoán x=30cm: ŷ = 0,44×30−5,99 = 13,2−5,99 = 7,21 (m)" }] },
      ],
    },
  },
];
