import type { ConfidenceIntervalSpec, AlgoResult, AlgoStep } from "@/engine/types";
import { zCritical } from "./normalQuantile";

/**
 * Ước lượng khoảng cho μ khi BIẾT σ (dạng 4), cộng câu hỏi cỡ mẫu tối thiểu đi kèm nếu
 * đề có. z_{α/2} tính bằng nghịch đảo CDF chuẩn tắc thật (giá trị textbook chuẩn, xem
 * `normalQuantile.ts`), không phải số back-derive từ đáp án.
 */
export function runCiKnownSigma(spec: ConfidenceIntervalSpec): AlgoResult {
  const { sampleMean, knownStdDev, n, confidenceLevel, unit = "", minSampleSize } = spec;
  const z = zCritical(confidenceLevel);
  const margin = (z * knownStdDev) / Math.sqrt(n);
  const lower = sampleMean - margin;
  const upper = sampleMean + margin;

  const steps: AlgoStep[] = [
    {
      title: `Khoảng tin cậy ${(confidenceLevel * 100).toFixed(0)}% cho μ`,
      explanation: `z_{α/2} = ${z.toFixed(3)} (độ tin cậy ${(confidenceLevel * 100).toFixed(
        0
      )}%). ε = z_{α/2}·σ/√n = ${z.toFixed(3)}×${knownStdDev}/√${n} ≈ ${margin.toFixed(4)}.`,
      tableSnapshot: { z: z.toFixed(3), epsilon: margin.toFixed(4) },
    },
    {
      title: `KTC = (${lower.toFixed(4)} ; ${upper.toFixed(4)}) ${unit}`,
      explanation: `(${sampleMean} − ${margin.toFixed(4)} ; ${sampleMean} + ${margin.toFixed(4)}) = (${lower.toFixed(
        4
      )} ; ${upper.toFixed(4)}) ${unit}.`,
      tableSnapshot: { lower: lower.toFixed(4), upper: upper.toFixed(4) },
    },
  ];

  let summary = `KTC ${(confidenceLevel * 100).toFixed(0)}% cho μ: (${lower.toFixed(4)} ; ${upper.toFixed(4)}) ${unit}`;

  if (minSampleSize) {
    const { maxError, verifiedN } = minSampleSize;
    const nExact = ((z * knownStdDev) / maxError) ** 2;
    const nRounded = Math.ceil(nExact);
    steps.push({
      title: `Cỡ mẫu tối thiểu để sai số ≤ ${maxError} ${unit}`,
      explanation: `n ≥ (z_{α/2}·σ/E)² = (${z.toFixed(3)}×${knownStdDev}/${maxError})² ≈ ${nExact.toFixed(
        2
      )} ⇒ n = ${nRounded} (LUÔN làm tròn LÊN, đáp án: ${verifiedN}).`,
      tableSnapshot: { n: nRounded },
    });
    summary += ` · Cỡ mẫu tối thiểu (sai số ≤ ${maxError}): n = ${nRounded}`;
  }

  return { steps, summary };
}
