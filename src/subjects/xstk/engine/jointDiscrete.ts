import type { JointDiscreteSpec, AlgoResult, AlgoStep } from "@/engine/types";

/**
 * Dạng 9: phân phối đồng thời rời rạc — phân phối biên (cộng dồn theo hàng/cột),
 * P(sự kiện gộp nhiều ô), và kiểm tra độc lập (chỉ cần tìm 1 ô lệch, không cần dò hết
 * mọi cặp — đúng "mẹo" của nguồn).
 */
export function runJointDiscrete(spec: JointDiscreteSpec): AlgoResult {
  const { xValues, yValues, probabilities, eventTest, eventLabel } = spec;
  const p = (x: number, y: number) => probabilities[`${x},${y}`] ?? 0;

  const marginalX = xValues.map((x) => ({ x, p: yValues.reduce((s, y) => s + p(x, y), 0) }));
  const marginalY = yValues.map((y) => ({ y, p: xValues.reduce((s, x) => s + p(x, y), 0) }));

  const eventCells = xValues.flatMap((x) => yValues.filter((y) => eventTest(x, y)).map((y) => ({ x, y, p: p(x, y) })));
  const eventProb = eventCells.reduce((s, c) => s + c.p, 0);

  let mismatch: { x: number; y: number; joint: number; product: number } | null = null;
  for (const x of xValues) {
    for (const y of yValues) {
      const joint = p(x, y);
      const px = marginalX.find((m) => m.x === x)!.p;
      const py = marginalY.find((m) => m.y === y)!.p;
      const product = px * py;
      if (Math.abs(joint - product) > 1e-9) {
        mismatch = { x, y, joint, product };
        break;
      }
    }
    if (mismatch) break;
  }

  const steps: AlgoStep[] = [
    {
      title: "Phân phối biên của X",
      explanation: `Cộng dồn theo từng hàng: ${marginalX.map((m) => `P(X=${m.x})=${m.p.toFixed(4)}`).join(", ")}.`,
      tableSnapshot: Object.fromEntries(marginalX.map((m) => [`P(X=${m.x})`, m.p.toFixed(4)])),
    },
    {
      title: "Phân phối biên của Y",
      explanation: `Cộng dồn theo từng cột: ${marginalY.map((m) => `P(Y=${m.y})=${m.p.toFixed(4)}`).join(", ")}.`,
      tableSnapshot: Object.fromEntries(marginalY.map((m) => [`P(Y=${m.y})`, m.p.toFixed(4)])),
    },
    {
      title: `P(${eventLabel}) = ${eventProb.toFixed(4)}`,
      explanation: `Gộp các ô thỏa ${eventLabel}: ${eventCells.map((c) => `(x=${c.x},y=${c.y})=${c.p}`).join("; ")} ⇒ tổng = ${eventProb.toFixed(
        4
      )}.`,
      tableSnapshot: { [`P(${eventLabel})`]: eventProb.toFixed(4) },
    },
    mismatch
      ? {
          title: "X, Y KHÔNG độc lập",
          explanation: `Chỉ cần tìm 1 ô lệch: P(X=${mismatch.x})·P(Y=${mismatch.y}) = ${mismatch.product.toFixed(
            4
          )} nhưng P(X=${mismatch.x},Y=${mismatch.y}) = ${mismatch.joint.toFixed(4)} ≠ ${mismatch.product.toFixed(
            4
          )} ⇒ KHÔNG độc lập (không cần kiểm tra hết các ô còn lại).`,
          tableSnapshot: { joint: mismatch.joint.toFixed(4), product: mismatch.product.toFixed(4) },
        }
      : {
          title: "X, Y độc lập",
          explanation: "Mọi ô đều thỏa P(X=x,Y=y) = P(X=x)·P(Y=y) ⇒ X, Y độc lập.",
        },
  ];

  const summary = `P(${eventLabel})=${eventProb.toFixed(4)} · X,Y ${mismatch ? "KHÔNG độc lập" : "độc lập"}`;
  return { steps, summary };
}
