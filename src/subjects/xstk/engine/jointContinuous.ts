import type { JointContinuousSpec, AlgoResult, AlgoStep } from "@/engine/types";

function simpson1D(f: (x: number) => number, a: number, b: number, n = 400): number {
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) sum += f(a + i * h) * (i % 2 === 0 ? 2 : 4);
  return (h / 3) * sum;
}

function doubleIntegral(
  fn: (x: number, y: number) => number,
  xFrom: number,
  xTo: number,
  yFrom: number,
  yTo: number
): number {
  return simpson1D((x) => simpson1D((y) => fn(x, y), yFrom, yTo), xFrom, xTo);
}

/**
 * Dạng 10: phân phối đồng thời liên tục. Phân biệt rõ 2 công thức điều kiện khác nhau
 * — điểm dễ nhầm nhất theo chính lời giải gốc:
 * - Điều kiện TẠI 1 điểm X=x0: dùng mật độ có điều kiện fY(y|x0)=f(x0,y)/fX(x0).
 * - Điều kiện trên 1 KHOẢNG X: dùng P(B|A)=P(A∩B)/P(A) với tích phân kép.
 */
export function runJointContinuous(spec: JointContinuousSpec): AlgoResult {
  const { fn, xDomain, yDomain, pointConditional, intervalConditional } = spec;
  const [xLo, xHi] = xDomain;
  const [yLo, yHi] = yDomain;

  const total = doubleIntegral(fn, xLo, xHi, yLo, yHi);

  const fXAt = (x0: number) => simpson1D((y) => fn(x0, y), yLo, yHi);
  const fXAtPoint = fXAt(pointConditional.x0);
  const condDensityIntegral = simpson1D(
    (y) => fn(pointConditional.x0, y) / fXAtPoint,
    pointConditional.yFrom,
    pointConditional.yTo
  );

  const marginalA = simpson1D(fXAt, intervalConditional.xFrom, intervalConditional.xTo);
  const jointAB = doubleIntegral(
    fn,
    intervalConditional.xFrom,
    intervalConditional.xTo,
    intervalConditional.yFrom,
    intervalConditional.yTo
  );
  const conditionalOnInterval = jointAB / marginalA;

  const steps: AlgoStep[] = [
    {
      title: `Kiểm tra tổng xác suất ∫∫f(x,y)dxdy = ${total.toFixed(4)}`,
      explanation: `Tích phân f(x,y) trên toàn miền [${xLo},${xHi}]×[${yLo},${yHi}] ≈ ${total.toFixed(4)} — xác nhận hằng số c đã cho đúng.`,
      tableSnapshot: { total: total.toFixed(4) },
    },
    {
      title: `fX(${pointConditional.x0}) = ${fXAtPoint.toFixed(4)}`,
      explanation: `Mật độ biên fX(x) = ∫f(x,y)dy trên [${yLo},${yHi}], tại x=${pointConditional.x0}: fX(${
        pointConditional.x0
      }) ≈ ${fXAtPoint.toFixed(4)}.`,
      tableSnapshot: { fX: fXAtPoint.toFixed(4) },
    },
    {
      title: `P(${pointConditional.yFrom}≤Y≤${pointConditional.yTo} | X=${pointConditional.x0}) ≈ ${condDensityIntegral.toFixed(4)}`,
      explanation: `Điều kiện TẠI 1 điểm cụ thể ⇒ dùng mật độ có điều kiện fY(y|x0)=f(x0,y)/fX(x0), rồi tích phân trên [${
        pointConditional.yFrom
      },${pointConditional.yTo}] ≈ ${condDensityIntegral.toFixed(4)}.`,
      tableSnapshot: { conditionalAtPoint: condDensityIntegral.toFixed(4) },
    },
    {
      title: `P(${intervalConditional.yFrom}≤Y≤${intervalConditional.yTo} | ${intervalConditional.xFrom}≤X≤${intervalConditional.xTo}) ≈ ${conditionalOnInterval.toFixed(4)}`,
      explanation: `Điều kiện trên 1 KHOẢNG X (khác câu trên!) ⇒ dùng P(B|A)=P(A∩B)/P(A): P(A)=P(${
        intervalConditional.xFrom
      }≤X≤${intervalConditional.xTo}) ≈ ${marginalA.toFixed(4)}, P(A∩B) ≈ ${jointAB.toFixed(4)} (tích phân kép) ⇒ P(B|A) ≈ ${conditionalOnInterval.toFixed(
        4
      )}.`,
      tableSnapshot: { marginalA: marginalA.toFixed(4), jointAB: jointAB.toFixed(4), conditionalOnInterval: conditionalOnInterval.toFixed(4) },
    },
  ];

  const summary = `fX(${pointConditional.x0})≈${fXAtPoint.toFixed(4)} · P(...|X=${pointConditional.x0})≈${condDensityIntegral.toFixed(
    4
  )} · P(...|X trong khoảng)≈${conditionalOnInterval.toFixed(4)}`;
  return { steps, summary };
}
