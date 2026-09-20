import type { RegressionSpec, AlgoResult, AlgoStep } from "@/engine/types";

/**
 * Dạng 8: tương quan & hồi quy tuyến tính (least squares). Khi `points` có đủ dữ liệu,
 * engine tự tính r/slope/intercept thật (đối chiếu với `verified` trong narration).
 * Khi thiếu dữ liệu điểm gốc (vd bảng tần số 2 chiều không liệt kê đủ — xem
 * `missingRawDataNote`), dùng thẳng `verified` mà KHÔNG tự tính lại từ đầu.
 */
export function runRegression(spec: RegressionSpec): AlgoResult {
  const { xLabel, unit = "", points, predictX, predictLabel, verified, missingRawDataNote } = spec;

  if (!points || points.length === 0) {
    const steps: AlgoStep[] = [
      {
        title: "Thiếu dữ liệu điểm gốc",
        explanation: missingRawDataNote ?? "Đề không cho đủ bảng dữ liệu gốc — chỉ hiển thị kết quả hồi quy theo đáp án.",
      },
      {
        title: `ŷ = ${verified.intercept}${verified.slope >= 0 ? "+" : ""}${verified.slope}${xLabel}`,
        explanation: `Phương trình hồi quy theo đáp án đề${verified.r !== undefined ? ` (r=${verified.r})` : ""}.`,
        tableSnapshot: { slope: verified.slope, intercept: verified.intercept },
      },
      {
        title: `${predictLabel}: ŷ ≈ ${verified.predictedY} ${unit}`,
        explanation: `ŷ = ${verified.intercept} + ${verified.slope}×${predictX} ≈ ${verified.predictedY} ${unit}.`,
        tableSnapshot: { predictedY: verified.predictedY },
      },
    ];
    return { steps, summary: `ŷ = ${verified.intercept}+${verified.slope}${xLabel} · ${predictLabel} ≈ ${verified.predictedY} ${unit}` };
  }

  const n = points.length;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  const syy = points.reduce((s, p) => s + p.y * p.y, 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  const r = (n * sxy - sx * sy) / Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy));
  const predictedY = intercept + slope * predictX;

  const steps: AlgoStep[] = [
    {
      title: `Hệ số tương quan r ≈ ${r.toFixed(4)}`,
      explanation: `r = [nΣxy−ΣxΣy] / √([nΣx²−(Σx)²][nΣy²−(Σy)²]) ≈ ${r.toFixed(4)} (đáp án: ${verified.r}) — tương quan thuận, rất mạnh.`,
      tableSnapshot: { r: r.toFixed(4) },
    },
    {
      title: `ŷ = ${intercept.toFixed(4)} ${slope >= 0 ? "+" : "−"} ${Math.abs(slope).toFixed(4)}${xLabel}`,
      explanation: `b = [nΣxy−ΣxΣy]/[nΣx²−(Σx)²] ≈ ${slope.toFixed(4)}, a = ȳ−b·x̄ ≈ ${intercept.toFixed(4)} (đáp án: a=${
        verified.intercept
      }, b=${verified.slope}).`,
      tableSnapshot: { slope: slope.toFixed(4), intercept: intercept.toFixed(4) },
    },
    {
      title: `${predictLabel}: ŷ ≈ ${predictedY.toFixed(4)} ${unit}`,
      explanation: `ŷ = ${intercept.toFixed(4)} + (${slope.toFixed(4)})×${predictX} ≈ ${predictedY.toFixed(4)} ${unit} (đáp án: ${
        verified.predictedY
      }).`,
      tableSnapshot: { predictedY: predictedY.toFixed(4) },
    },
  ];

  const summary = `r≈${r.toFixed(4)} · ŷ=${intercept.toFixed(2)}${slope >= 0 ? "+" : ""}${slope.toFixed(
    4
  )}${xLabel} · ${predictLabel} ≈ ${predictedY.toFixed(4)} ${unit}`;
  return { steps, summary };
}
