import type { BayesSpec, AlgoResult, AlgoStep, HighlightState } from "@/engine/types";

/**
 * Xác suất toàn phần + Bayes. Mỗi bước "khóa" 1 nhánh của phân hoạch (P(Ai)·P(B|Ai)),
 * rồi cộng dồn các nhánh dẫn tới B để ra xác suất toàn phần P(B), cuối cùng tô đậm đúng
 * tử số/mẫu số của câu hỏi Bayes cụ thể (có thể gộp nhiều Ai, có thể điều kiện theo B
 * hoặc theo phần bù của B — xem `BayesSpec.conditionOnComplement`).
 */
export function runBayes(spec: BayesSpec): AlgoResult {
  const { partition, branches, eventLabel, targetLabel, targetEventIds, conditionOnComplement } = spec;
  const branchOf = (id: string) => branches.find((b) => b.fromEventId === id)!.prob;

  const terms = partition.map((ai) => {
    const p = branchOf(ai.id);
    return { ai, pB: p * ai.prior, pNotB: (1 - p) * ai.prior };
  });
  const pB = terms.reduce((s, t) => s + t.pB, 0);
  const pNotB = 1 - pB;

  const numerator = terms
    .filter((t) => targetEventIds.includes(t.ai.id))
    .reduce((s, t) => s + (conditionOnComplement ? t.pNotB : t.pB), 0);
  const denominator = conditionOnComplement ? pNotB : pB;
  const answer = numerator / denominator;

  const steps: AlgoStep[] = [];

  steps.push({
    title: "Phân hoạch không gian mẫu",
    explanation: `Chia thành ${partition.length} biến cố đối lập từng đôi và phủ kín Ω: ${partition
      .map((p) => `${p.label} (${(p.prior * 100).toFixed(0)}%)`)
      .join(", ")}.`,
  });

  for (const { ai, pB: term } of terms) {
    const p = branchOf(ai.id);
    steps.push({
      title: `Nhánh ${ai.label}`,
      explanation: `P(${ai.label}) = ${(ai.prior * 100).toFixed(0)}%. P(${eventLabel}|${ai.label}) = ${(p * 100).toFixed(
        0
      )}% ⇒ P(${ai.label})·P(${eventLabel}|${ai.label}) = ${(term * 100).toFixed(2)}%.`,
      nodeHighlights: { [ai.id]: "active", [`${ai.id}::b`]: "active" },
      edgeHighlights: { [`root->${ai.id}`]: "active", [`${ai.id}->b`]: "active" },
      tableSnapshot: { [`P(${ai.label})·P(${eventLabel}|${ai.label})`]: `${(term * 100).toFixed(2)}%` },
    });
  }

  const sumEdges: Record<string, HighlightState> = {};
  const sumNodes: Record<string, HighlightState> = {};
  const sumTable: Record<string, string | number> = {};
  terms.forEach((t) => {
    sumEdges[`root->${t.ai.id}`] = "path";
    sumEdges[`${t.ai.id}->b`] = "path";
    sumNodes[t.ai.id] = "settled";
    sumNodes[`${t.ai.id}::b`] = "settled";
    sumTable[`P(${t.ai.label})·P(${eventLabel}|${t.ai.label})`] = `${(t.pB * 100).toFixed(2)}%`;
  });
  sumTable[`P(${eventLabel})`] = `${(pB * 100).toFixed(2)}%`;
  steps.push({
    title: `Xác suất toàn phần P(${eventLabel}) = ${(pB * 100).toFixed(2)}%`,
    explanation: `Cộng dọc tất cả các nhánh dẫn tới ${eventLabel}: P(${eventLabel}) = Σ P(Ai)·P(${eventLabel}|Ai) = ${terms
      .map((t) => `${(t.pB * 100).toFixed(2)}%`)
      .join(" + ")} = ${(pB * 100).toFixed(2)}%.`,
    nodeHighlights: sumNodes,
    edgeHighlights: sumEdges,
    tableSnapshot: sumTable,
  });

  const bayesEdges: Record<string, HighlightState> = {};
  const bayesNodes: Record<string, HighlightState> = {};
  const branchKey = conditionOnComplement ? "notb" : "b";
  terms.forEach((t) => {
    const inTarget = targetEventIds.includes(t.ai.id);
    bayesEdges[`${t.ai.id}->${branchKey}`] = inTarget ? "path" : "settled";
    bayesNodes[`${t.ai.id}::${branchKey}`] = inTarget ? "path" : "rejected";
  });
  const conditionLabel = conditionOnComplement ? `không ${eventLabel.toLowerCase()}` : eventLabel;
  steps.push({
    title: `Bayes: P(${targetLabel}) = ${(answer * 100).toFixed(2)}%`,
    explanation: `Công thức Bayes: lấy tổng các nhánh thuộc câu hỏi (tô xanh) chia cho P(${conditionLabel}) = ${(
      denominator * 100
    ).toFixed(2)}% ⇒ kết quả ${(answer * 100).toFixed(2)}%.`,
    nodeHighlights: bayesNodes,
    edgeHighlights: bayesEdges,
    tableSnapshot: { [`P(${targetLabel})`]: `${(answer * 100).toFixed(2)}%` },
  });

  const summary = `P(${eventLabel}) = ${(pB * 100).toFixed(2)}% · P(${targetLabel}) = ${(answer * 100).toFixed(2)}%`;
  return { steps, summary };
}
