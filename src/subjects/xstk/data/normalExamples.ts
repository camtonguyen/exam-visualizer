import type { NormalSpec } from "@/engine/types";
import type { CalculatorTipData } from "@/components/ui/CalculatorTip";
import type { AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export interface NormalExample {
  id: string;
  label: string;
  spec: NormalSpec;
  /** Không phải mọi câu nguồn đều có "Mẹo" riêng (vd CITD Đề2's Câu2 không có) — để
   *  undefined thay vì bịa mẹo không có trong nguồn. */
  tip?: string;
  calculatorTip: CalculatorTipData;
  answerKey: AnswerKeySpec;
}

/**
 * 4 ví dụ thật, transcribed từ `docs/xstk/files/*.md`. CITD Đề1/Đề2 dùng cùng 1 kiểu
 * câu hỏi (cdf-left rồi inverse-left); UICD Đề1/Đề2 mỗi đề dùng 1 CẶP mode khác nhau
 * (Đề1: cdf-right + inverse-topk; Đề2: cdf-left + inverse-topk) — đây là lý do
 * `NormalSpec.queries` là mảng thay vì 2 field cố định "thuận"/"ngược": không phải đề
 * nào cũng hỏi cùng 1 chiều.
 */
export const NORMAL_EXAMPLES: NormalExample[] = [
  {
    id: "citd-de1-ban-phim",
    label: "CITD Đề 1 — Bàn phím máy tính",
    spec: {
      mean: 3500,
      stdDev: 350,
      unit: "giờ",
      queries: [
        { mode: "cdf-left", label: "Tỷ lệ phải bảo hành = P(X<2800)", input: 2800 },
        { mode: "inverse-left", label: "Ngưỡng T để tỷ lệ bảo hành = 4%", input: 4, verifiedThreshold: 2887.15 },
      ],
    },
    tip: "Khi z âm hoặc xác suất cần tra < 0,5, luôn đổi dấu để đưa về vùng φ(z) > 0,5 rồi mới tra bảng — máy Casio InverseNormal thì KHÔNG cần lo việc này vì máy tự xử lý cả hai chiều.",
    calculatorTip: {
      menu: "Distribution → Normal CD / InverseNormal",
      steps: [
        "Câu a: Normal CD, Lower=−1E99, Upper=2800, σ=350, μ=3500 → 0,02275",
        "Câu b: InverseNormal, Area (bên trái)=0,04, σ=350, μ=3500 → ra thẳng T≈2887,15",
      ],
    },
    answerKey: {
      title: "Câu 2 — Phân phối chuẩn",
      totalPoints: 2,
      setup: [{ text: "Gọi X là tuổi thọ bàn phím (giờ). X~N(3500,350²). Bảo hành nếu hỏng trước 2800 giờ." }],
      parts: [
        { label: "a)", lines: [{ text: "Z=(2800−3500)/350=−2 ⇒ P(X<2800)=φ(−2)≈0,02275=2,275%" }] },
        {
          label: "b)",
          lines: [{ text: "φ((3500−T)/350)=0,96 ⇒ (3500−T)/350≈1,751 ⇒ T≈3500−350×1,751≈2887,15 giờ" }],
        },
      ],
    },
  },
  {
    id: "citd-de2-chuot",
    label: "CITD Đề 2 — Chuột máy tính",
    spec: {
      mean: 4000,
      stdDev: 400,
      unit: "giờ",
      queries: [
        { mode: "cdf-left", label: "Tỷ lệ phải bảo hành = P(X<3200)", input: 3200 },
        { mode: "inverse-left", label: "Ngưỡng T để tỷ lệ bảo hành = 5%", input: 5, verifiedThreshold: 3342 },
      ],
    },
    calculatorTip: {
      menu: "Distribution → Normal CD / InverseNormal",
      steps: [
        "Câu a: Normal CD, Lower=−1E99, Upper=3200, σ=400, μ=4000 → 0,02275",
        "Câu b: InverseNormal, Area (bên trái)=0,05, σ=400, μ=4000 → T≈3342",
      ],
    },
    answerKey: {
      title: "Câu 2 — Phân phối chuẩn",
      totalPoints: 2,
      setup: [{ text: "Gọi X là tuổi thọ chuột máy tính (giờ). X~N(4000,400²). Bảo hành nếu hỏng trước 3200 giờ." }],
      parts: [
        { label: "a)", lines: [{ text: "Z=(3200−4000)/400=−2 ⇒ P(X<3200)=φ(−2)≈0,02275=2,275%" }] },
        { label: "b)", lines: [{ text: "φ((4000−T)/400)=0,95 ⇒ (4000−T)/400≈1,645 ⇒ T≈4000−400×1,645≈3342 giờ" }] },
      ],
    },
  },
  {
    id: "uicd-de1-dien",
    label: "UICD Đề 1 — Mức tiêu thụ điện",
    spec: {
      mean: 200,
      stdDev: 40,
      unit: "KWh",
      queries: [
        { mode: "cdf-right", label: "P(X>250)", input: 250 },
        { mode: "inverse-topk", label: "Ngưỡng của nhóm 0,3% tiêu thụ cao nhất", input: 0.3, verifiedThreshold: 309.91 },
      ],
    },
    tip: 'Câu hỏi "nhóm cao nhất k%" luôn đổi thành φ(z) = 1 − k trước khi tra bảng/máy — đây là lỗi hay gặp nhất (nhầm giữa vùng bên trái và bên phải).',
    calculatorTip: {
      menu: "Distribution → Normal CD / InverseNormal",
      steps: [
        "Câu a: Normal CD, Lower=250, Upper=1E99, σ=40, μ=200 → 0,1056",
        "Câu b: InverseNormal, Area (bên trái)=0,997, σ=40, μ=200 → x₀≈309,91 (ra thẳng kết quả)",
      ],
    },
    answerKey: {
      title: "Câu 3 — Phân phối chuẩn",
      totalPoints: 2,
      setup: [{ text: "Gọi X là mức tiêu thụ điện (KWh). X~N(200,40²)." }],
      parts: [
        { label: "a)", lines: [{ text: "Z=(250−200)/40=1,25 ⇒ P(X>250)=1−φ(1,25)≈0,1056=10,56%" }] },
        {
          label: "b)",
          lines: [{ text: "φ(z)=1−0,003=0,997 ⇒ z≈2,7478 ⇒ x₀=200+40×2,7478≈309,91 KWh" }],
        },
      ],
    },
  },
  {
    id: "uicd-de2-chieucao",
    label: "UICD Đề 2 — Chiều cao",
    spec: {
      mean: 175,
      stdDev: 7,
      unit: "cm",
      queries: [
        { mode: "cdf-left", label: "P(X<165)", input: 165 },
        { mode: "inverse-topk", label: "Ngưỡng nhóm 1% cao nhất", input: 1, verifiedThreshold: 191.28 },
      ],
    },
    tip: "Luôn viết công thức φ((T−μ)/σ) trước, đưa về dạng > 0,5 rồi mới tra ngược — tránh lẫn giữa φ(z) và 1−φ(z).",
    calculatorTip: {
      menu: "Distribution → Normal CD / InverseNormal",
      steps: [
        "Câu a: Normal CD, Lower=−1E99, Upper=165, σ=7, μ=175 → 0,0766",
        "Câu b: InverseNormal, Area (bên trái)=0,99, σ=7, μ=175 → x₀≈191,28",
      ],
    },
    answerKey: {
      title: "Câu 3 — Phân phối chuẩn",
      totalPoints: 2,
      setup: [{ text: "Gọi X là chiều cao (cm). X~N(175,7²)." }],
      parts: [
        { label: "a)", lines: [{ text: "Z=(165−175)/7≈−1,4286 ⇒ P(X<165)=φ(−1,4286)≈0,0766=7,66%" }] },
        { label: "b)", lines: [{ text: "φ(z)=0,99 ⇒ z≈2,326 ⇒ x₀=175+7×2,326≈191,28 cm" }] },
      ],
    },
  },
];
