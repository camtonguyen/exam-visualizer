import type { NormalSpec, NormalQuery, AlgoResult, AlgoStep } from "@/engine/types";

/** Standard normal CDF, Abramowitz & Stegun 26.2.17 approximation (|error| < 7.5e-8). */
function stdNormalCdf(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const y =
    1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
}

function runQuery(mean: number, stdDev: number, unit: string, q: NormalQuery): { steps: AlgoStep[]; result: string } {
  if (q.mode === "cdf-left" || q.mode === "cdf-right") {
    // Chiều thuận: cho ngưỡng X, tính % thật bằng CDF chuẩn tắc liên tục (không lệch
    // làm tròn vì không có "đáp án bảng" nào cần khớp ở chiều này).
    const threshold = q.input;
    const z = (threshold - mean) / stdDev;
    const leftPercent = stdNormalCdf(z) * 100;
    const percent = q.mode === "cdf-left" ? leftPercent : 100 - leftPercent;
    const shade = q.mode === "cdf-left" ? "left" : "right";
    // 3 chữ số thập phân (không phải 2) vì đây là % của xác suất — giá trị "kinh điển"
    // Φ(-2)≈2.275% cần 3 chữ số mới hiện đúng, các giá trị khác vẫn làm tròn nhất quán.
    const pctStr = percent.toFixed(3);
    const steps: AlgoStep[] = [
      {
        title: "Chuẩn hóa: Z = (X - μ)/σ",
        explanation: `μ=${mean} ${unit}, σ=${stdDev} ${unit}. Z = (${threshold}-${mean})/${stdDev} = ${z.toFixed(4)}.`,
        tableSnapshot: { z: z.toFixed(4), shade: "none" },
      },
      {
        title: `${q.label} ≈ ${pctStr}%`,
        explanation:
          q.mode === "cdf-left"
            ? `Diện tích bên trái z=${z.toFixed(4)}: Φ(${z.toFixed(4)}) ≈ ${pctStr}%.`
            : `Diện tích bên phải z=${z.toFixed(4)}: 1-Φ(${z.toFixed(4)}) ≈ ${pctStr}%.`,
        tableSnapshot: { z: z.toFixed(4), shade },
      },
    ];
    return { steps, result: `${q.label} ≈ ${pctStr}%` };
  }

  // Chiều ngược (inverse-left / inverse-topk): back-derive z từ ngưỡng đã verify thay vì
  // tính bằng nghịch đảo CDF liên tục — đáp án đề dùng bảng Laplace nội suy (kém chính
  // xác hơn liên tục ~0.1 đơn vị), xem docs/decisions.md.
  const verified = q.verifiedThreshold!;
  const z = (verified - mean) / stdDev;
  const isTopK = q.mode === "inverse-topk";
  const areaFromLeft = isTopK ? 100 - q.input : q.input;
  const steps: AlgoStep[] = [
    {
      title: "Chiều ngược: tra ngược ra z",
      explanation: isTopK
        ? `"Nhóm ${q.input}% cao nhất" ⇒ đổi thành φ(z) = 1-${(q.input / 100).toFixed(4)} = ${(areaFromLeft / 100).toFixed(
            4
          )} trước khi tra: z ≈ ${z.toFixed(4)}.`
        : `Tra ngược để Φ(z) = ${q.input}%: z ≈ ${z.toFixed(4)}.`,
      tableSnapshot: { z: z.toFixed(4), shade: "none" },
    },
    {
      title: `${q.label} ≈ ${verified} ${unit}`,
      explanation: `x₀ = μ + z·σ = ${mean} + (${z.toFixed(4)})×${stdDev} ≈ ${verified} ${unit}.`,
      tableSnapshot: { z: z.toFixed(4), shade: "left" },
    },
  ];
  return { steps, result: `${q.label} ≈ ${verified} ${unit}` };
}

/**
 * Phân phối chuẩn, tổng quát cho cả 4 kiểu câu hỏi thấy trong bộ đề (cdf-left, cdf-right,
 * inverse-left, inverse-topk — xem `NormalQueryMode`). Mỗi đề có đúng 2 câu (a/b, không
 * nhất thiết cùng cặp mode giữa các đề), chạy tuần tự và nối step lại.
 */
export function runNormalDistribution(spec: NormalSpec): AlgoResult {
  const { mean, stdDev, unit, queries } = spec;
  const steps: AlgoStep[] = [];
  const results: string[] = [];
  for (const q of queries) {
    const r = runQuery(mean, stdDev, unit, q);
    steps.push(...r.steps);
    results.push(r.result);
  }
  return { steps, summary: results.join(" · ") };
}
