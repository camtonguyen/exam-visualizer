/**
 * Standard normal quantile (inverse CDF) — Peter Acklam's rational approximation,
 * accurate to ~1.15e-9. Reproduces the standard textbook z-critical values exactly
 * (z_0.025=1.96, z_0.01=2.326, z_0.005=2.576, z_0.05=1.645...) because THOSE are
 * themselves the output of a continuous inverse normal, not table-interpolated
 * exam-answer figures — unlike `normalDistribution.ts`'s back-derived thresholds
 * (see docs/decisions.md), a real inverse CDF is the right tool here.
 */
export function standardNormalQuantile(p: number): number {
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const plow = 0.02425;
  const phigh = 1 - plow;

  if (p < plow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= phigh) {
    const q = p - 0.5;
    const r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

/** z_{α/2} for a given confidence level (e.g. 0.95 → 1.96). */
export function zCritical(confidenceLevel: number): number {
  return standardNormalQuantile(1 - (1 - confidenceLevel) / 2);
}

/** z_α for a given significance level (e.g. 0.05 → 1.645). */
export function zAlpha(alpha: number): number {
  return standardNormalQuantile(1 - alpha);
}
