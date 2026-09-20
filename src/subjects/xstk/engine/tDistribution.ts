import type { TTestSpec, AlgoResult, AlgoStep } from "@/engine/types";

/**
 * Dạng 7: ước lượng/kiểm định trung bình khi CHƯA biết σ (n nhỏ) — dùng Student-t.
 * `values` là dữ liệu mẫu thô (giống nhập vào STAT→1-Variable trên Casio); x̄/s tính
 * thật từ đó. t_{α/2,df}/t_{α,df} là INPUT tra bảng (không tính bằng công thức liên
 * tục) — bảng t rời rạc theo df nên tra bảng chính là cách làm đúng, khác với z liên
 * tục ở `normalQuantile.ts`.
 */
export function runTDistribution(spec: TTestSpec): AlgoResult {
  const { values, unit = "", confidenceLevel, tCriticalForCI, nullMean, alternative, alpha, tCriticalForTest } = spec;
  const n = values.length;
  const mean = values.reduce((s, x) => s + x, 0) / n;
  const variance = values.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1);
  const s = Math.sqrt(variance);
  const df = n - 1;

  const margin = (tCriticalForCI * s) / Math.sqrt(n);
  const lower = mean - margin;
  const upper = mean + margin;

  const t = (mean - nullMean) / (s / Math.sqrt(n));
  let rejected: boolean;
  let h1: string;
  let ruleText: string;
  if (alternative === "greater") {
    rejected = t > tCriticalForTest;
    h1 = `μ>${nullMean}`;
    ruleText = `t>t_α=${tCriticalForTest} ⇒ t=${t.toFixed(3)} ${rejected ? ">" : "<"} ${tCriticalForTest}`;
  } else if (alternative === "less") {
    rejected = t < -tCriticalForTest;
    h1 = `μ<${nullMean}`;
    ruleText = `t<−t_α=${-tCriticalForTest} ⇒ t=${t.toFixed(3)} ${rejected ? "<" : ">"} ${-tCriticalForTest}`;
  } else {
    rejected = Math.abs(t) > tCriticalForTest;
    h1 = `μ≠${nullMean}`;
    ruleText = `|t|>t_{α/2}=${tCriticalForTest} ⇒ |t|=${Math.abs(t).toFixed(3)} ${rejected ? ">" : "<"} ${tCriticalForTest}`;
  }

  const steps: AlgoStep[] = [
    {
      title: `x̄ = ${mean.toFixed(4)} ${unit}, s ≈ ${s.toFixed(4)} ${unit}, df = ${df}`,
      explanation: `Nhập ${n} giá trị vào STAT→1-Variable: n=${n}, x̄=${mean.toFixed(4)} ${unit}, s (xσn-1) ≈ ${s.toFixed(
        4
      )} ${unit}. Bậc tự do df=n−1=${df}. Vì CHƯA biết σ và n nhỏ ⇒ dùng phân phối Student-t, không dùng z.`,
      tableSnapshot: { mean: mean.toFixed(4), s: s.toFixed(4), df },
    },
    {
      title: `Khoảng tin cậy ${(confidenceLevel * 100).toFixed(0)}% cho μ`,
      explanation: `t_{α/2,${df}} = ${tCriticalForCI} (tra bảng t). ε = t_{α/2}·s/√n = ${tCriticalForCI}×${s.toFixed(
        4
      )}/√${n} ≈ ${margin.toFixed(4)}. KTC = (${lower.toFixed(4)} ; ${upper.toFixed(4)}) ${unit}.`,
      tableSnapshot: { lower: lower.toFixed(4), upper: upper.toFixed(4) },
    },
    {
      title: `t ≈ ${t.toFixed(4)} — ${rejected ? "BÁC BỎ" : "KHÔNG bác bỏ"} H0`,
      explanation: `H0: μ=${nullMean}   H1: ${h1}, α=${(alpha * 100).toFixed(0)}%. t = (x̄−μ0)/(s/√n) ≈ ${t.toFixed(
        4
      )}. t_{critical,${df}} = ${tCriticalForTest} (tra bảng). ${ruleText} ⇒ ${
        rejected ? "BÁC BỎ H0" : "KHÔNG bác bỏ H0"
      }.`,
      tableSnapshot: { t: t.toFixed(4) },
    },
  ];

  const summary = `x̄=${mean.toFixed(4)} ${unit} · s≈${s.toFixed(4)} · KTC ${(confidenceLevel * 100).toFixed(
    0
  )}%=(${lower.toFixed(4)},${upper.toFixed(4)}) · t≈${t.toFixed(4)} ⇒ ${rejected ? "bác bỏ" : "không bác bỏ"} H0`;
  return { steps, summary };
}
