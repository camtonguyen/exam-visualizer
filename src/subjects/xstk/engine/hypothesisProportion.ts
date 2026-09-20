import type { ProportionTestSpec, AlgoResult, AlgoStep } from "@/engine/types";
import { zCritical, zAlpha } from "./normalQuantile";

/**
 * Dạng 6: kiểm định tỷ lệ tổng quát (f cho sẵn/suy trực tiếp từ mẫu, KHÔNG cần bảng
 * tần số ghép nhóm như dạng 5). Hỗ trợ cả 2 phía và 1 phía (trái/phải) — đề luôn nêu rõ
 * hướng ("lớn hơn"/"nhỏ hơn" ⇒ 1 phía; "khác với"/không nêu hướng ⇒ 2 phía).
 */
export function runHypothesisProportion(spec: ProportionTestSpec): AlgoResult {
  const { sampleSize: n, successCount, claimedProportion: p0, alpha, tail, confidenceInterval } = spec;
  const f = successCount / n;
  const Z = (f - p0) / Math.sqrt((p0 * (1 - p0)) / n);

  let rejected: boolean;
  let critical: number;
  let ruleText: string;
  let h1: string;
  if (tail === "two") {
    critical = zAlpha(alpha / 2);
    rejected = Math.abs(Z) > critical;
    ruleText = `bác bỏ H0 nếu |Z| > z_{α/2} = ${critical.toFixed(3)}. |Z| = ${Math.abs(Z).toFixed(3)} ${
      rejected ? ">" : "<"
    } ${critical.toFixed(3)}`;
    h1 = `p≠${p0}`;
  } else if (tail === "less") {
    critical = zAlpha(alpha);
    rejected = Z < -critical;
    ruleText = `bác bỏ H0 nếu Z < −z_α = ${(-critical).toFixed(3)}. Z = ${Z.toFixed(3)} ${
      rejected ? "<" : ">"
    } −${critical.toFixed(3)}`;
    h1 = `p<${p0}`;
  } else {
    critical = zAlpha(alpha);
    rejected = Z > critical;
    ruleText = `bác bỏ H0 nếu Z > z_α = ${critical.toFixed(3)}. Z = ${Z.toFixed(3)} ${
      rejected ? ">" : "<"
    } ${critical.toFixed(3)}`;
    h1 = `p>${p0}`;
  }

  const steps: AlgoStep[] = [
    {
      title: `Tỷ lệ mẫu f = ${successCount}/${n} ≈ ${(f * 100).toFixed(2)}%`,
      explanation: `H0: p=${p0}   H1: ${h1} (${tail === "two" ? "2 phía" : "1 phía"}). f = ${successCount}/${n} ≈ ${f.toFixed(
        4
      )}.`,
      tableSnapshot: { f: f.toFixed(4) },
    },
    {
      title: `Z ≈ ${Z.toFixed(4)}`,
      explanation: `Z = (f−p0)/√(p0(1−p0)/n) = (${f.toFixed(4)}−${p0})/√(${p0}×${(1 - p0).toFixed(2)}/${n}) ≈ ${Z.toFixed(4)}.`,
      tableSnapshot: { Z: Z.toFixed(4) },
    },
    {
      title: `${rejected ? "BÁC BỎ" : "KHÔNG bác bỏ"} H0`,
      explanation: `Miền bác bỏ: ${ruleText} ⇒ ${rejected ? "BÁC BỎ H0" : "KHÔNG bác bỏ H0"}.`,
      tableSnapshot: { critical: critical.toFixed(3) },
    },
  ];

  let summary = `f≈${(f * 100).toFixed(2)}% · Z≈${Z.toFixed(4)} ⇒ ${rejected ? "bác bỏ" : "không bác bỏ"} H0`;

  if (confidenceInterval) {
    const zCI = zCritical(confidenceInterval.confidenceLevel);
    const margin = zCI * Math.sqrt((f * (1 - f)) / n);
    const lower = f - margin;
    const upper = f + margin;
    steps.push({
      title: `Ước lượng khoảng ${(confidenceInterval.confidenceLevel * 100).toFixed(0)}% cho p`,
      explanation: `ε = z_{α/2}·√(f(1−f)/n) = ${zCI.toFixed(3)}×√(${f.toFixed(3)}×${(1 - f).toFixed(3)}/${n}) ≈ ${margin.toFixed(
        4
      )}. KTC = (${lower.toFixed(4)} ; ${upper.toFixed(4)}).`,
      tableSnapshot: { lower: lower.toFixed(4), upper: upper.toFixed(4) },
    });
    summary += ` · KTC ${(confidenceInterval.confidenceLevel * 100).toFixed(0)}% cho p = (${lower.toFixed(4)},${upper.toFixed(4)})`;
  }

  return { steps, summary };
}
