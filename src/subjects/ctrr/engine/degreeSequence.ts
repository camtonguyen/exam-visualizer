import type { AlgoResult, AlgoStep, DegreeSequenceCheck, GraphSpec, HighlightState } from "@/engine/types";

/** Định lý 1.1 (Handshaking): tổng bậc luôn chẵn. */
export function checkHandshake(seq: number[]): { sumEven: boolean; sum: number } {
  const sum = seq.reduce((a, b) => a + b, 0);
  return { sum, sumEven: sum % 2 === 0 };
}

interface Vertex {
  label: string;
  degree: number;
}

export interface HavelHakimiRound {
  removed: { label: string; degree: number };
  connectedTo: string[];
  remaining: Vertex[];
  /** true on the round that discovered a contradiction (this is the failing round). */
  negative?: boolean;
}

function labelFor(index: number): string {
  return String.fromCharCode(65 + index); // A, B, C, ...
}

/**
 * Havel–Hakimi: sort descending, connect the top vertex to its `degree` next-highest
 * neighbors, subtract 1 from each, repeat. A negative remaining degree at any point means
 * the sequence isn't graphical — this check (not just "degree > remaining count") is what
 * makes it correct in general, not just for the length-exceeded case.
 */
export function tryHavelHakimi(seq: number[]): {
  graphical: boolean;
  reason: string;
  edges?: [number, number][];
  rounds: HavelHakimiRound[];
} {
  const rounds: HavelHakimiRound[] = [];
  const edgesByLabel: [string, string][] = [];
  let vertices: Vertex[] = seq.map((d, i) => ({ label: labelFor(i), degree: d }));

  while (vertices.length > 0) {
    vertices = [...vertices].sort((a, b) => b.degree - a.degree);
    const [top, ...rest] = vertices;
    const k = top.degree;

    if (k === 0) {
      // Everyone left needs 0 more edges — trivially done.
      vertices = rest;
      continue;
    }

    if (k > rest.length) {
      rounds.push({ removed: { ...top }, connectedTo: [], remaining: rest.map((v) => ({ ...v })), negative: true });
      return {
        graphical: false,
        reason: `Đỉnh ${top.label} cần bậc ${k} nhưng chỉ còn ${rest.length} đỉnh khác để nối → mâu thuẫn, dãy không đồ thị hóa được.`,
        rounds,
      };
    }

    const connected: string[] = [];
    for (let i = 0; i < k; i++) {
      rest[i] = { ...rest[i], degree: rest[i].degree - 1 };
      connected.push(rest[i].label);
      edgesByLabel.push([top.label, rest[i].label]);
      if (rest[i].degree < 0) {
        rounds.push({
          removed: { ...top },
          connectedTo: connected,
          remaining: rest.map((v) => ({ ...v })),
          negative: true,
        });
        return {
          graphical: false,
          reason: `Đỉnh ${top.label} cần bậc ${k}, buộc phải nối với cả ${k} đỉnh còn lại (${connected.join(", ")}) — trong đó đỉnh ${rest[i].label} đã hết bậc dư từ (các) vòng trước, nối thêm sẽ khiến bậc âm → mâu thuẫn, dãy không đồ thị hóa được.`,
          rounds,
        };
      }
    }

    rounds.push({ removed: { ...top }, connectedTo: connected, remaining: rest.map((v) => ({ ...v })) });
    vertices = rest;
  }

  const labelToIndex = new Map(seq.map((_, i) => [labelFor(i), i]));
  const edges: [number, number][] = edgesByLabel.map(([a, b]) => [labelToIndex.get(a)!, labelToIndex.get(b)!]);

  return {
    graphical: true,
    reason: "Xây dựng thành công theo Havel–Hakimi — mọi bậc đều được thỏa mãn không mâu thuẫn.",
    edges,
    rounds,
  };
}

/** Lays out every sequence's vertices in its own small circle cluster, wrapped into a
 *  grid (not a single ever-widening row) so any number of sequences — including the "5
 *  dạng đồ thị đặc biệt" set — stays inside GraphCanvas's default viewBox instead of
 *  running off the right edge. A sequence that turns out non-graphical simply never gets
 *  any of its edges lit up. */
export function buildDegreeSequenceGraph(seqs: DegreeSequenceCheck[]): GraphSpec {
  const nodes: string[] = [];
  const edges: GraphSpec["edges"] = [];
  const positions: Record<string, { x: number; y: number }> = {};
  const labels: Record<string, string> = {};
  const COLS = 3;
  const CLUSTER_W = 220;
  const ROW_H = 200;
  const RADIUS = 70;
  const LEFT = 150;
  const TOP = 140;

  seqs.forEach((seq, si) => {
    const n = seq.sequence.length;
    const col = si % COLS;
    const row = Math.floor(si / COLS);
    const cx = LEFT + col * CLUSTER_W;
    const cy = TOP + row * ROW_H;
    const result = tryHavelHakimi(seq.sequence);
    for (let i = 0; i < n; i++) {
      const id = `${si}:${labelFor(i)}`;
      nodes.push(id);
      labels[id] = labelFor(i);
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      positions[id] = { x: cx + RADIUS * Math.cos(angle), y: cy + RADIUS * Math.sin(angle) };
    }
    if (result.graphical && result.edges) {
      result.edges.forEach(([a, b], ei) => {
        edges.push({ id: `${si}:e${ei}`, from: `${si}:${labelFor(a)}`, to: `${si}:${labelFor(b)}` });
      });
    }
  });

  return { nodes, edges, positions, labels };
}

function seqLabel(seq: DegreeSequenceCheck, index: number): string {
  return seq.label ?? `(${index + 1})`;
}

/**
 * Câu 2, Kiểu 1 — animates exactly the guide's procedure per sequence: tổng bậc (chẵn/lẻ)
 * → nếu lẻ, kết luận ngay; nếu chẵn, chạy Havel–Hakimi từng vòng (mỗi vòng 1 step, vẽ dần
 * cạnh lên đồ thị nếu thành công) → kết luận tồn tại/không tồn tại (nêu rõ mâu thuẫn).
 */
export function runDegreeSequenceCheck(seqs: DegreeSequenceCheck[]): AlgoResult {
  const steps: AlgoStep[] = [];

  const handshakeLines = seqs.map((seq, i) => {
    const { sum, sumEven } = checkHandshake(seq.sequence);
    return `Dãy ${seqLabel(seq, i)} = (${seq.sequence.join(", ")}): tổng bậc = ${sum} (${sumEven ? "CHẴN" : "LẺ"}).`;
  });
  steps.push({
    title: "Tính tổng bậc cho từng dãy (Định lý 1.1 — bắt tay)",
    explanation: `${handshakeLines.join(" ")} Tổng bậc LẺ → chắc chắn không tồn tại. Tổng bậc CHẴN chỉ là điều kiện CẦN, phải thử dựng bằng Havel–Hakimi mới kết luận được ĐỦ.`,
    nodeHighlights: {},
  });

  const conclusions: string[] = [];

  seqs.forEach((seq, si) => {
    const label = seqLabel(seq, si);
    const { sum, sumEven } = checkHandshake(seq.sequence);

    if (!sumEven) {
      steps.push({
        title: `Dãy ${label}: tổng bậc lẻ → không tồn tại`,
        explanation: `Tổng bậc = ${sum} (LẺ) — vi phạm định lý bắt tay (tổng bậc đồ thị vô hướng luôn chẵn). Kết luận: KHÔNG tồn tại đồ thị vô hướng nào có dãy bậc ${label}.`,
        nodeHighlights: {},
      });
      conclusions.push(`${label} không tồn tại (tổng bậc lẻ)`);
      return;
    }

    const { graphical, reason, rounds } = tryHavelHakimi(seq.sequence);
    const prefix = (l: string) => `${si}:${l}`;
    const settledEdges: Record<string, HighlightState> = {};
    let edgeCounter = 0;

    rounds.forEach((round, ri) => {
      const isLastAndFailed = round.negative === true;
      const remainingList = round.remaining.map((v) => `${v.label}=${v.degree}`).join(", ") || "(hết)";

      if (isLastAndFailed) {
        steps.push({
          title: `Dãy ${label}, vòng ${ri + 1}: mâu thuẫn tại đỉnh ${round.removed.label}`,
          explanation: reason,
          nodeHighlights: {
            [prefix(round.removed.label)]: "active",
            ...Object.fromEntries(round.connectedTo.map((l) => [prefix(l), "rejected" as const])),
          },
          edgeHighlights: { ...settledEdges },
        });
        conclusions.push(`${label} không tồn tại (Havel–Hakimi mâu thuẫn ở đỉnh ${round.removed.label})`);
        return;
      }

      const newEdgeHighlights: Record<string, HighlightState> = { ...settledEdges };
      round.connectedTo.forEach(() => {
        newEdgeHighlights[prefix(`e${edgeCounter}`)] = "active";
        edgeCounter++;
      });

      steps.push({
        title: `Dãy ${label}, vòng ${ri + 1}: nối đỉnh ${round.removed.label} (bậc ${round.removed.degree})`,
        explanation: `Nối ${round.removed.label} với ${round.connectedTo.length} đỉnh bậc cao nhất còn lại (${round.connectedTo.join(", ")}), trừ 1 bậc mỗi đỉnh đó. Dãy còn lại: ${remainingList}.`,
        nodeHighlights: {
          [prefix(round.removed.label)]: "settled",
          ...Object.fromEntries(round.connectedTo.map((l) => [prefix(l), "active" as const])),
        },
        edgeHighlights: newEdgeHighlights,
      });
      Object.assign(settledEdges, newEdgeHighlights);
      Object.keys(settledEdges).forEach((k) => (settledEdges[k] = "settled"));
    });

    if (graphical) {
      steps.push({
        title: `Dãy ${label}: TỒN TẠI đồ thị`,
        explanation: `${reason} Đồ thị vừa dựng có đúng dãy bậc ${label} = (${seq.sequence.join(", ")}).`,
        nodeHighlights: Object.fromEntries(seq.sequence.map((_, i) => [prefix(labelFor(i)), "settled" as const])),
        edgeHighlights: Object.fromEntries(Object.keys(settledEdges).map((k) => [k, "settled" as const])),
      });
      conclusions.push(`${label} tồn tại`);
    }
  });

  return {
    steps,
    summary: conclusions.join("; ") + ".",
  };
}
