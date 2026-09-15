import type {
  AlgoResult,
  AlgoStep,
  CircuitLiteral,
  CircuitSpec,
  CircuitTerm,
  HighlightState,
} from "@/engine/types";
import type { PrimeImplicant } from "./karnaugh";

/** Parses a term string like "xz't'" (as produced by `karnaugh.ts`'s `PrimeImplicant.term`)
 *  into structured literals — single-letter variables only, which is all this app uses. */
export function parseTermString(id: string, formula: string): CircuitTerm {
  const literals: CircuitLiteral[] = [];
  let i = 0;
  while (i < formula.length) {
    const variable = formula[i];
    const negated = formula[i + 1] === "'";
    literals.push({ variable, isTrue: !negated });
    i += negated ? 2 : 1;
  }
  return { id, literals };
}

export function circuitSpecFromTerms(
  variables: string[],
  formulas: string[],
  outputLabel = "f"
): CircuitSpec {
  return {
    variables,
    terms: formulas.map((f, i) => parseTermString(`T${i + 1}`, f)),
    outputLabel,
  };
}

/** Bridges Câu 1b's output straight into Câu 1c: builds a CircuitSpec from one of
 *  `findAllMinimalCovers`'s covers, so a circuit is never drawn from a hand-typed formula. */
export function circuitSpecFromCover(
  variables: string[],
  cover: PrimeImplicant[],
  outputLabel = "f"
): CircuitSpec {
  return circuitSpecFromTerms(
    variables,
    cover.map((p) => p.term),
    outputLabel
  );
}

function termLabel(term: CircuitTerm): string {
  return term.literals.map((l) => (l.isTrue ? l.variable : `${l.variable}'`)).join("");
}

function fullFormula(spec: CircuitSpec): string {
  return spec.terms.map(termLabel).join(" ∨ ");
}

function literalValue(literal: CircuitLiteral, assignment: Record<string, "0" | "1">): 0 | 1 {
  const raw = assignment[literal.variable];
  const isOne = literal.isTrue ? raw === "1" : raw === "0";
  return isOne ? 1 : 0;
}

function termValue(term: CircuitTerm, assignment: Record<string, "0" | "1">): 0 | 1 {
  return term.literals.every((l) => literalValue(l, assignment) === 1) ? 1 : 0;
}

/**
 * Circuit diagram (Câu 1c) — animates the guide's 5-step procedure exactly: every
 * variable AND its complement line are drawn together in one step (all "trục" first,
 * before any gate) → a NOT gate symbol for every variable that appears negated anywhere
 * (one step each) → one AND gate per term (never merged, so a 4-term formula gets 4
 * distinct "add AND gate" steps) → one shared OR gate → declare the output. A final
 * signal-run phase then lights up one topological layer at a time (inputs → NOT → AND →
 * OR) at a concrete f=1 combination, to show the circuit actually computing the right value.
 *
 * `nodeHighlights` keys: `line:<wireKey>` for a vertical bus line ("x" or "x'"),
 * `gate:not:<variable>` for a NOT gate symbol, a term's `id` for its AND gate, and `"or"`
 * for the OR gate.
 */
export function runCircuit(spec: CircuitSpec): AlgoResult {
  const { variables, terms, outputLabel } = spec;
  const steps: AlgoStep[] = [];

  const needsNot = variables.filter((v) =>
    terms.some((t) => t.literals.some((l) => l.variable === v && !l.isTrue))
  );
  const noNotNeeded = variables.filter((v) => !needsNot.includes(v));
  const allWireKeys = [...variables, ...needsNot.map((v) => `${v}'`)];

  // Drawn elements light up immediately ("settled" = bright green) instead of sitting at
  // the dim "idle" gray — every step should visibly light up what it just added.
  const litLines = (): Partial<Record<string, HighlightState>> =>
    Object.fromEntries(allWireKeys.map((k) => [`line:${k}`, "settled" as const]));
  const litNotGates = (upTo: string[]): Partial<Record<string, HighlightState>> =>
    Object.fromEntries(upTo.map((v) => [`gate:not:${v}`, "settled" as const]));
  const litAnds = (upTo: CircuitTerm[]): Partial<Record<string, HighlightState>> =>
    Object.fromEntries(upTo.map((t) => [t.id, "settled" as const]));

  // Bước 1: mọi đường thẳng đứng (biến VÀ đường bù) được kẻ cùng lúc, trước khi có cổng nào.
  steps.push({
    title: `Kẻ ${allWireKeys.length} đường thẳng đứng (${variables.length} biến${
      needsNot.length > 0 ? ` + ${needsNot.length} đường bù` : ""
    })`,
    explanation: `Mỗi biến ${variables.join(", ")} → 1 đường thẳng đứng, viết tên biến ở đầu đường.${
      needsNot.length > 0
        ? ` Đường bù ${needsNot.map((v) => `${v}'`).join(", ")} vẽ song song ngay cạnh đường gốc (cổng NOT nối vào 2 đường này sẽ thêm ở bước sau).`
        : ""
    }${
      noNotNeeded.length > 0
        ? ` Biến ${noNotNeeded.join(", ")} chỉ xuất hiện dạng thường trong công thức nên không cần đường bù / cổng NOT.`
        : ""
    }`,
    nodeHighlights: litLines(),
  });

  // Bước 2: 1 cổng NOT riêng cho mỗi biến xuất hiện dạng phẩy — không gộp chung 1 step.
  const drawnNots: string[] = [];
  needsNot.forEach((v) => {
    steps.push({
      title: `Thêm cổng NOT cho biến ${v}`,
      explanation: `${v} xuất hiện dạng phẩy (${v}') ở ít nhất 1 số hạng → gắn cổng NOT giữa đường ${v} và đường bù ${v}' đã kẻ sẵn.`,
      nodeHighlights: { ...litLines(), ...litNotGates(drawnNots), [`gate:not:${v}`]: "settled" },
    });
    drawnNots.push(v);
  });

  // Bước 3: 1 cổng AND riêng cho MỖI số hạng — không gộp chung 1 step.
  const drawnAndTerms: CircuitTerm[] = [];
  terms.forEach((term) => {
    const label = termLabel(term);
    const inputsDesc = term.literals
      .map((l) => (l.isTrue ? `đường ${l.variable}` : `đường bù ${l.variable}'`))
      .join(", ");
    steps.push({
      title: `Thêm cổng AND cho số hạng ${label}`,
      explanation: `Số hạng ${label} có ${term.literals.length} biến (${inputsDesc}) → dùng 1 cổng AND ${term.literals.length} ngõ vào, nối đúng các đường tương ứng.`,
      nodeHighlights: {
        ...litLines(),
        ...litNotGates(drawnNots),
        ...litAnds(drawnAndTerms),
        [term.id]: "settled",
      },
    });
    drawnAndTerms.push(term);
  });

  const fullyDrawn = (): Partial<Record<string, HighlightState>> => ({
    ...litLines(),
    ...litNotGates(drawnNots),
    ...litAnds(drawnAndTerms),
    or: "settled",
  });

  // Bước 4: gộp mọi ngõ ra AND vào 1 cổng OR duy nhất.
  steps.push({
    title: `Thêm cổng OR gộp ${terms.length} ngõ vào`,
    explanation: `Nối ngõ ra của tất cả ${terms.length} cổng AND vào chung 1 cổng OR duy nhất — đúng số dấu ∨ ngoài cùng (${terms.length - 1}) của công thức tối tiểu.`,
    nodeHighlights: fullyDrawn(),
  });

  // Bước 5: ngõ ra OR = f.
  const formula = fullFormula(spec);
  steps.push({
    title: `Ngõ ra cổng OR = ${outputLabel}`,
    explanation: `Ngõ ra của cổng OR chính là ${outputLabel} — hoàn tất sơ đồ mạch cho ${outputLabel} = ${formula}.`,
    nodeHighlights: fullyDrawn(),
  });

  // Chạy tín hiệu: chọn 1 tổ hợp cụ thể làm f=1 (theo đúng số hạng đầu tiên), rồi lan
  // truyền theo thứ tự topo input → NOT → AND → OR, mỗi lớp 1 step.
  const firstTerm = terms[0];
  const assignment: Record<string, "0" | "1"> = Object.fromEntries(
    variables.map((v) => {
      const lit = firstTerm.literals.find((l) => l.variable === v);
      return [v, lit ? (lit.isTrue ? "1" : "0") : "0"];
    })
  ) as Record<string, "0" | "1">;
  const combo = variables.map((v) => assignment[v]).join("");

  // Signal run never dims anything back down — a value-0 wire stays "settled" (still lit,
  // just not the active blue), so by the last step the whole diagram is lit ("toàn sáng").
  const mainLineSignal: Partial<Record<string, HighlightState>> = Object.fromEntries(
    variables.map((v) => [`line:${v}`, assignment[v] === "1" ? "active" : "settled"])
  );
  steps.push({
    title: `Chọn tổ hợp (${variables.join(",")}) = (${combo.split("").join(",")}) để kiểm tra tín hiệu`,
    explanation: `Gán giá trị cụ thể cho từng biến (lấy đúng theo số hạng ${termLabel(firstTerm)} để đảm bảo ${outputLabel}=1, biến còn lại gán tùy ý): ${variables
      .map((v) => `${v}=${assignment[v]}`)
      .join(", ")}. Đường có giá trị 1 sẽ sáng lên.`,
    nodeHighlights: { ...fullyDrawn(), ...mainLineSignal },
  });

  const notGateSignal: Partial<Record<string, HighlightState>> = {};
  const complementLineSignal: Partial<Record<string, HighlightState>> = {};
  needsNot.forEach((v) => {
    const state: HighlightState = assignment[v] === "0" ? "active" : "settled";
    notGateSignal[`gate:not:${v}`] = state;
    complementLineSignal[`line:${v}'`] = state;
  });
  steps.push({
    title: "Tín hiệu qua các cổng NOT",
    explanation:
      needsNot.length > 0
        ? `Mỗi cổng NOT đảo giá trị đường vào: ${needsNot
            .map((v) => `${v}=${assignment[v]} → ${v}'=${assignment[v] === "0" ? "1" : "0"}`)
            .join(", ")}.`
        : "Không có cổng NOT nào trong mạch này.",
    nodeHighlights: { ...fullyDrawn(), ...mainLineSignal, ...notGateSignal, ...complementLineSignal },
  });

  const andSignal: Partial<Record<string, HighlightState>> = Object.fromEntries(
    terms.map((t) => [t.id, termValue(t, assignment) === 1 ? "active" : "settled"])
  );
  steps.push({
    title: "Tín hiệu qua các cổng AND",
    explanation: terms.map((t) => `${termLabel(t)} = ${termValue(t, assignment)}`).join("; ") + ".",
    nodeHighlights: {
      ...fullyDrawn(),
      ...mainLineSignal,
      ...notGateSignal,
      ...complementLineSignal,
      ...andSignal,
    },
  });

  steps.push({
    title: `Ngõ ra ${outputLabel} = 1`,
    explanation: `Cổng OR sáng vì có ít nhất 1 cổng AND = 1 (${termLabel(firstTerm)} = 1 tại tổ hợp đã chọn) → ${outputLabel} = 1, đúng như dự đoán tại tổ hợp (${combo}).`,
    nodeHighlights: {
      ...fullyDrawn(),
      ...mainLineSignal,
      ...notGateSignal,
      ...complementLineSignal,
      ...andSignal,
      or: "active",
    },
  });

  return {
    steps,
    summary: `${outputLabel} = ${formula}; kiểm tra tại (${variables.join(",")}) = (${combo
      .split("")
      .join(",")}) → ${outputLabel} = 1.`,
  };
}
