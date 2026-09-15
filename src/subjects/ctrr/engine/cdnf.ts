import type { AlgoResult, AlgoStep, BooleanFunctionSpec, HighlightState } from "@/engine/types";

function toTerm(combo: string, variables: string[]): string {
  return combo
    .split("")
    .map((bit, i) => variables[i] + (bit === "0" ? "'" : ""))
    .join("");
}

/**
 * CDNF (Dạng nối rời chính tắc) — Câu 1a. Mirrors the guide's procedure exactly:
 * liệt kê đủ 2^n tổ hợp → (nếu đề cho f⁻¹(0)) loại các tổ hợp đó → đọc từng tổ hợp
 * còn lại (f⁻¹(1)) thành 1 từ tối tiểu, nối tất cả bằng ∨.
 */
export function runCdnf(spec: BooleanFunctionSpec): AlgoResult {
  const { variables, onesSet, givenAs, zerosSet } = spec;
  const steps: AlgoStep[] = [];

  const rejected: Partial<Record<string, HighlightState>> =
    givenAs === "zeros" && zerosSet
      ? Object.fromEntries(zerosSet.map((c) => [c, "rejected" as const]))
      : {};

  steps.push({
    title:
      givenAs === "zeros"
        ? `Đề cho f⁻¹(0) = {${zerosSet?.join(", ")}}`
        : `Đề cho f⁻¹(1) = {${onesSet.join(", ")}}`,
    explanation:
      givenAs === "zeros"
        ? `Liệt kê đủ ${2 ** variables.length} tổ hợp của ${variables.length} biến (${"0".repeat(variables.length)} → ${"1".repeat(variables.length)}). Vì đề cho f⁻¹(0) nên cần loại các tổ hợp thuộc f⁻¹(0) trước khi biết f⁻¹(1).`
        : `Liệt kê đủ ${2 ** variables.length} tổ hợp của ${variables.length} biến (${"0".repeat(variables.length)} → ${"1".repeat(variables.length)}). Đề đã cho sẵn f⁻¹(1) — quét lần lượt từng tổ hợp để đọc ra từ tối tiểu.`,
    nodeHighlights: {},
  });

  if (givenAs === "zeros" && zerosSet) {
    steps.push({
      title: `Loại ${zerosSet.length} tổ hợp thuộc f⁻¹(0)`,
      explanation: `Gạch bỏ các tổ hợp ${zerosSet.join(", ")} (thuộc f⁻¹(0)). Còn lại đúng ${onesSet.length} tổ hợp — đó chính là f⁻¹(1) = {${onesSet.join(", ")}}.`,
      nodeHighlights: { ...rejected },
    });
  }

  const settled: Partial<Record<string, HighlightState>> = {};
  onesSet.forEach((combo) => {
    const term = toTerm(combo, variables);
    steps.push({
      title: `Tổ hợp ${combo} → từ tối tiểu ${term}`,
      explanation: `Đọc từng biến theo tổ hợp ${combo}: bit=1 viết biến thường, bit=0 viết biến có dấu phẩy → ${term}.`,
      nodeHighlights: { ...rejected, ...settled, [combo]: "active" },
      tableSnapshot: { combo, term },
    });
    settled[combo] = "settled";
  });

  const cdnf = onesSet.map((c) => toTerm(c, variables)).join(" ∨ ");
  const varList = variables.join(", ");
  steps.push({
    title: "Ghi vào bài làm — CDNF đầy đủ",
    explanation: `Nối tất cả ${onesSet.length} từ tối tiểu bằng ∨ → f(${varList}) = ${cdnf}.`,
    nodeHighlights: { ...rejected, ...settled },
  });

  return { steps, summary: `f(${varList}) = ${cdnf}` };
}
