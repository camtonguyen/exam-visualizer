import type { AlgoStep, HighlightState, PointerNode, PointerSnapshot } from "@/engine/types";
import { chainNodes, idGen, type ChainItem, type OpTraceResult } from "./pointerModel.ts";

export type QueueOp =
  | { op: "enQueue"; value: number; note?: string; brief?: boolean }
  | { op: "deQueue"; note?: string; brief?: boolean };

export interface QueueSpec {
  ops: QueueOp[];
}

const show = (c: ChainItem[]) => `pFront<< ${c.length ? c.map((i) => i.value).join("  ") : "(rỗng)"} <<pRear`;

/**
 * Chạy Queue (danh sách liên kết, 2 con trỏ pFront/pRear) theo đúng code của thầy (`Queue.cpp`):
 * enQueue = addTail ở pRear; deQueue = lưu p, dời pFront, delete p, và NẾU hàng đợi rỗng thì pRear = NULL.
 * Sau `delete p` của node cuối cùng, pRear còn trỏ vào vùng đã giải phóng — bước dangling đó được vẽ rõ
 * vì "quên pRear = NULL" là lỗi hay gặp nhất. `brief` gộp 1 thao tác thành 1 bước.
 * Trạng thái in theo `printQueue` của thầy: `pFront<< a  b  c <<pRear`.
 */
export function runQueue(spec: QueueSpec): OpTraceResult {
  const nextId = idGen();
  let chain: ChainItem[] = [];
  const out: number[] = [];
  const steps: AlgoStep[] = [];
  const opLog: string[] = [];
  const front = () => chain[0]?.id ?? null;
  const rear = () => chain.at(-1)?.id ?? null;
  const snap = (
    pointers: Record<string, string | null> = { pFront: front(), pRear: rear() },
    extra: PointerNode[] = [],
    linkRearTo?: string
  ): PointerSnapshot => {
    const nodes = chainNodes(chain);
    if (linkRearTo && nodes.length) nodes[nodes.length - 1].next = linkRearTo;
    return { nodes: [...nodes, ...extra], pointers };
  };
  const only = (id: string, state: HighlightState): Record<string, HighlightState> => ({ [id]: state });

  steps.push({
    title: "Hàng đợi rỗng: q.pFront = q.pRear = NULL",
    explanation: "struct Queue { Node* pFront; Node* pRear; } — 2 con trỏ vì FIFO: thêm ở pRear, lấy ở pFront (2 đầu khác nhau, cần O(1) cho cả hai). initQueue gán cả hai = NULL.",
    pointerSnapshot: snap(),
  });

  for (const op of spec.ops) {
    if (op.op === "enQueue") {
      const id = nextId();
      const v = op.value;
      const n = chain.length;
      const fresh: ChainItem = { id, value: v };
      const detached: PointerNode = { id, value: v, next: null, row: 1, col: n };
      if (op.brief) {
        chain = [...chain, fresh];
        steps.push({
          title: `enQueue(q, ${v}) ⇒ ${show(chain)}`,
          explanation: op.note ?? "enQueue = addTail ở pRear: q.pRear->pNext = p; q.pRear = p; (hàng đợi rỗng thì pFront = pRear = p).",
          pointerSnapshot: snap(),
          nodeHighlights: only(id, "settled"),
        });
      } else {
        steps.push({
          title: `enQueue(q, p):  Node* p = initNode(${v});`,
          explanation: `${op.note ? op.note + " " : ""}Cấp phát node mới p chứa ${v}, p->pNext = NULL. p chưa nối vào hàng đợi.`,
          pointerSnapshot: snap({ pFront: front(), pRear: rear(), p: id }, [detached]),
          nodeHighlights: only(id, "active"),
        });
        if (n === 0) {
          chain = [fresh];
          steps.push({
            title: `q.pFront = q.pRear = p;   ⇒ ${show(chain)}`,
            explanation: "Hàng đợi rỗng (pFront == NULL && pRear == NULL) ⇒ cả hai cùng trỏ node mới.",
            pointerSnapshot: snap({ pFront: id, pRear: id, p: id }),
            nodeHighlights: only(id, "settled"),
          });
        } else {
          steps.push({
            title: "q.pRear->pNext = p;",
            explanation: `Nối p vào sau node cuối (${chain[n - 1].value}) — pRear vẫn đang trỏ node cuối cũ.`,
            pointerSnapshot: snap({ pFront: front(), pRear: rear(), p: id }, [detached], id),
            nodeHighlights: only(id, "active"),
          });
          chain = [...chain, fresh];
          steps.push({
            title: `q.pRear = p;   ⇒ ${show(chain)}`,
            explanation: "pRear dời sang node mới — node mới là phần tử cuối hàng đợi.",
            pointerSnapshot: snap({ pFront: front(), pRear: id, p: id }),
            nodeHighlights: only(id, "settled"),
          });
        }
      }
      opLog.push(`enQueue(${v}) ⇒ ${show(chain)}`);
    } else {
      if (chain.length === 0) {
        steps.push({
          title: "deQueue(q): isEmpty(q) ⇒ return",
          explanation: "Hàng đợi rỗng — không có gì để lấy ra.",
          pointerSnapshot: snap(),
        });
        opLog.push("deQueue() ⇒ (hàng đợi rỗng, không làm gì)");
        continue;
      }
      const p = chain[0];
      out.push(p.value);
      const lastNode = chain.length === 1;
      if (op.brief) {
        chain = chain.slice(1);
        steps.push({
          title: `deQueue(q) ⇒ lấy ${p.value},  ${show(chain)}`,
          explanation: op.note ?? "deQueue = removeHead ở pFront; lấy ra phần tử vào TRƯỚC NHẤT (FIFO). Rỗng thì pRear = NULL.",
          pointerSnapshot: snap(),
        });
      } else {
        steps.push({
          title: `Node* p = q.pFront;   (lấy ra ${p.value})`,
          explanation: `${op.note ? op.note + " " : ""}p giữ địa chỉ node đầu hàng — phần tử vào trước nhất.`,
          pointerSnapshot: snap({ pFront: p.id, pRear: rear(), p: p.id }),
          nodeHighlights: only(p.id, "active"),
        });
        steps.push({
          title: "q.pFront = q.pFront->pNext;",
          explanation: "pFront dời sang node kế tiếp; node cũ vẫn còn trong bộ nhớ nên phải delete.",
          pointerSnapshot: snap({ pFront: chain[1]?.id ?? null, pRear: rear(), p: p.id }),
          nodeHighlights: only(p.id, "rejected"),
        });
        const rearBefore = rear();
        chain = chain.slice(1);
        if (lastNode) {
          steps.push({
            title: "delete p;",
            explanation: "Node cuối cùng đã bị xóa nhưng pRear VẪN trỏ vào vùng nhớ vừa giải phóng (dangling)! Phải xử lý ở bước sau.",
            pointerSnapshot: { nodes: [], pointers: { pFront: null, pRear: rearBefore } },
          });
          steps.push({
            title: `if (q.pFront == nullptr) q.pRear = nullptr;   ⇒ ${show(chain)}`,
            explanation: "pFront == NULL nghĩa là hàng đợi vừa rỗng ⇒ BẮT BUỘC đặt pRear = NULL. Quên dòng này là lỗi hay gặp nhất của deQueue.",
            pointerSnapshot: snap(),
          });
        } else {
          steps.push({
            title: `delete p;   ⇒ ${show(chain)}`,
            explanation: "Giải phóng node cũ. pFront khác NULL nên không cần đụng tới pRear.",
            pointerSnapshot: snap(),
          });
        }
      }
      opLog.push(`deQueue() ⇒ lấy ${p.value},  ${show(chain)}`);
    }
  }

  const summary = `Trạng thái cuối: ${show(chain)}` + (out.length ? ` · Thứ tự lấy ra: ${out.join(" ")}` : "");
  return { steps, summary, opLog };
}
