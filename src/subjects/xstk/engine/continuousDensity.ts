import type { ContinuousDensitySpec, AlgoResult, AlgoStep } from "@/engine/types";

/** Composite Simpson's rule — accurate enough for the low-degree polynomials in this
 *  subject's exams, no symbolic integration needed. */
function simpson(f: (x: number) => number, a: number, b: number, n = 2000): number {
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) sum += f(a + i * h) * (i % 2 === 0 ? 2 : 4);
  return (h / 3) * sum;
}

/**
 * Biến ngẫu nhiên liên tục (dạng 3), tổng quát cho đa thức bậc bất kỳ. `spec.fn(x,k)`
 * is linear in k, so ∫fn(x,k)dx = B + k·A (constants A,B) — solving that at k=0 and k=1
 * gives k directly, without deriving the algebra by hand per example.
 */
export function runContinuousDensity(spec: ContinuousDensitySpec): AlgoResult {
  const { domain, fn, expr, probabilityQuery, verifiedK, verifiedMean, verifiedVariance, verifiedProbabilityPercent, unit } =
    spec;
  const [lo, hi] = domain;
  const u = unit ? ` ${unit}` : "";

  const B = simpson((x) => fn(x, 0), lo, hi);
  const A = simpson((x) => fn(x, 1), lo, hi) - B;
  const k = (1 - B) / A;
  const density = (x: number) => fn(x, k);

  const mean = simpson((x) => x * density(x), lo, hi);
  const variance = simpson((x) => (x - mean) ** 2 * density(x), lo, hi);

  const from = Math.max(probabilityQuery.from, lo);
  const to = Math.min(probabilityQuery.to, hi);
  const probability = simpson(density, from, to) * 100;
  const clipped = from !== probabilityQuery.from || to !== probabilityQuery.to;

  const steps: AlgoStep[] = [
    {
      title: `Tìm K: ∫ f(x)dx = 1 trên [${lo},${hi}]`,
      explanation: `f(x)=${expr}. Giải ∫${lo}${hi} f(x)dx=1 (tích phân số) ⇒ K ≈ ${k.toFixed(6)} (đáp án: ${verifiedK}).`,
      tableSnapshot: { a: lo, b: hi },
    },
    {
      title: `E(X) ≈ ${mean.toFixed(4)}${u}`,
      explanation: `E(X) = ∫${lo}${hi} x·f(x)dx ≈ ${mean.toFixed(4)}${u} (đáp án: ${verifiedMean}) — "trọng tâm" của vùng diện tích dưới f(x).`,
      tableSnapshot: { a: lo, b: hi },
    },
    {
      title: `Var(X) ≈ ${variance.toFixed(6)}`,
      explanation:
        verifiedVariance !== undefined
          ? `Var(X) = ∫${lo}${hi} (x-E(X))²·f(x)dx ≈ ${variance.toFixed(6)} (đáp án: ${verifiedVariance}).`
          : `Var(X) = ∫${lo}${hi} (x-E(X))²·f(x)dx ≈ ${variance.toFixed(6)} (đề không cho sẵn Var(X) trong đáp án — tính thêm từ f(x) đã verify).`,
      tableSnapshot: { a: lo, b: hi },
    },
    {
      title: `P(${probabilityQuery.from}≤X≤${probabilityQuery.to}) ≈ ${probability.toFixed(2)}%`,
      explanation: clipped
        ? `Cận đề cho [${probabilityQuery.from},${probabilityQuery.to}] vượt ra ngoài miền xác định [${lo},${hi}] — f(x)=0 ngoài miền này, nên chỉ tính từ ${from} đến ${to}: ∫${from}${to} f(x)dx ≈ ${probability.toFixed(
            2
          )}% (đáp án: ${verifiedProbabilityPercent}%).`
        : `∫${from}${to} f(x)dx ≈ ${probability.toFixed(2)}% (đáp án: ${verifiedProbabilityPercent}%).`,
      tableSnapshot: { a: from, b: to },
    },
  ];

  const summary = `K≈${k.toFixed(4)} · E(X)≈${mean.toFixed(4)}${u} · Var(X)≈${variance.toFixed(4)} · P(${probabilityQuery.from}≤X≤${probabilityQuery.to})≈${probability.toFixed(2)}%`;
  return { steps, summary };
}
