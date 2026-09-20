import type { GroupedProportionSpec, AlgoResult, AlgoStep } from "@/engine/types";
import { zCritical, zAlpha } from "./normalQuantile";

/**
 * Dạng 5: từ bảng tần số ghép nhóm, tự tính x̄/S (dùng trung điểm mỗi khoảng làm giá
 * trị đại diện — đúng cách 1-Variable Statistics trên Casio với Frequency ON), rồi
 * ước lượng khoảng cho μ VÀ kiểm định tỷ lệ (p > p0, luôn 1 phía phải ở cả 2 đề hiện
 * có) từ cùng bảng đó.
 */
export function runCiSampleProportion(spec: GroupedProportionSpec): AlgoResult {
  const { bins, unit = "", confidenceLevel, proportionThreshold, proportionLabel, claimedProportion, alpha } = spec;
  const n = bins.reduce((s, b) => s + b.frequency, 0);
  const mean = bins.reduce((s, b) => s + b.midpoint * b.frequency, 0) / n;
  const variance = bins.reduce((s, b) => s + b.frequency * (b.midpoint - mean) ** 2, 0) / (n - 1);
  const std = Math.sqrt(variance);

  const z = zCritical(confidenceLevel);
  const margin = (z * std) / Math.sqrt(n);
  const lower = mean - margin;
  const upper = mean + margin;

  const successBins = bins.filter((b) => b.midpoint >= proportionThreshold);
  const successCount = successBins.reduce((s, b) => s + b.frequency, 0);
  const f = successCount / n;
  const Z = (f - claimedProportion) / Math.sqrt((claimedProportion * (1 - claimedProportion)) / n);
  const zA = zAlpha(alpha);
  const rejected = Z > zA;

  const steps: AlgoStep[] = [
    {
      title: `x̄ ≈ ${mean.toFixed(4)} ${unit}, S ≈ ${std.toFixed(4)} ${unit}`,
      explanation: `Dùng trung điểm mỗi khoảng làm giá trị đại diện: x̄ = Σ(xᵢ·nᵢ)/n ≈ ${mean.toFixed(
        4
      )} ${unit}, S = √[Σnᵢ(xᵢ−x̄)²/(n−1)] ≈ ${std.toFixed(4)} ${unit} (n=${n}).`,
      tableSnapshot: { mean: mean.toFixed(4), std: std.toFixed(4) },
    },
    {
      title: `Khoảng tin cậy ${(confidenceLevel * 100).toFixed(0)}% cho μ`,
      explanation: `z_{α/2} = ${z.toFixed(2)}. ε = ${z.toFixed(2)}×${std.toFixed(4)}/√${n} ≈ ${margin.toFixed(
        4
      )}. KTC = (${lower.toFixed(4)} ; ${upper.toFixed(4)}) ${unit}.`,
      tableSnapshot: { lower: lower.toFixed(4), upper: upper.toFixed(4) },
    },
    {
      title: `Tỷ lệ mẫu f ≈ ${(f * 100).toFixed(2)}%`,
      explanation: `${proportionLabel}: cộng tần số các khoảng có trung điểm ≥ ${proportionThreshold}${unit} = ${successCount}/${n} ≈ ${(
        f * 100
      ).toFixed(2)}%.`,
      tableSnapshot: { f: (f * 100).toFixed(2) },
    },
    {
      title: `Z ≈ ${Z.toFixed(4)} — ${rejected ? "BÁC BỎ" : "KHÔNG bác bỏ"} H0`,
      explanation: `H0: p=${claimedProportion}, H1: p>${claimedProportion} (1 phía phải). Z = (f−p0)/√(p0(1−p0)/n) ≈ ${Z.toFixed(
        4
      )}. z_α = z_{${alpha}} ≈ ${zA.toFixed(3)} (miền bác bỏ: Z>z_α). Vì Z${
        rejected ? ">" : "<"
      }z_α ⇒ ${rejected ? "BÁC BỎ H0" : "KHÔNG bác bỏ H0"}.`,
      tableSnapshot: { Z: Z.toFixed(4) },
    },
  ];

  const summary = `x̄≈${mean.toFixed(4)} ${unit} · S≈${std.toFixed(4)} ${unit} · KTC ${(confidenceLevel * 100).toFixed(
    0
  )}%=(${lower.toFixed(4)},${upper.toFixed(4)}) · Z≈${Z.toFixed(4)} ⇒ ${rejected ? "bác bỏ" : "không bác bỏ"} H0`;
  return { steps, summary };
}
