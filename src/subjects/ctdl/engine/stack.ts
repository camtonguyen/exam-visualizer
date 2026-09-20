import type { AlgoStep, HighlightState, PointerNode, PointerSnapshot } from "@/engine/types";
import { chainNodes, idGen, type ChainItem, type OpTraceResult } from "./pointerModel.ts";

export type StackOp =
  | { op: "push"; value: number; note?: string; brief?: boolean }
  | { op: "pop"; note?: string; brief?: boolean }
  | { op: "count" };

export interface StackSpec {
  ops: StackOp[];
}

const show = (c: ChainItem[]) => `Top < ${c.map((i) => i.value).join("  ")} >`.replace("<  >", "< >");

/**
 * Chạy Stack (danh sách liên kết, 1 con trỏ pTop) qua chuỗi thao tác, theo đúng code của thầy
 * (`demo_stackv1.cpp`, Đề mẫu Phần 2): push = `p->pNext = s.pTop; s.pTop = p;`, pop = lưu p, dời pTop, delete p.
 * `brief` gộp 1 thao tác thành 1 bước (dùng khi lặp nhiều lần); mặc định chạy từng dòng lệnh.
 * Trạng thái in theo `printStack` của thầy: `Top < a  b  c >` (đỉnh bên trái).
 */
export function runStack(spec: StackSpec): OpTraceResult {
  const nextId = idGen();
  let chain: ChainItem[] = [];
  const popped: number[] = [];
  const steps: AlgoStep[] = [];
  const opLog: string[] = [];
  const top = () => chain[0]?.id ?? null;
  const snap = (extra: PointerNode[] = [], pointers: Record<string, string | null> = { pTop: top() }): PointerSnapshot => ({
    nodes: [...chainNodes(chain), ...extra],
    pointers,
  });
  const only = (id: string, state: HighlightState): Record<string, HighlightState> => ({ [id]: state });

  steps.push({
    title: "Stack rỗng: s.pTop = NULL",
    explanation: "struct Stack { Node* pTop; } — chỉ 1 con trỏ vì push và pop cùng thao tác ở đỉnh (LIFO: vào sau, ra trước). initStack gán pTop = NULL.",
    pointerSnapshot: snap(),
  });

  for (const op of spec.ops) {
    if (op.op === "push") {
      const id = nextId();
      const v = op.value;
      const oldTop = top();
      const fresh: ChainItem = { id, value: v };
      if (op.brief) {
        chain = [fresh, ...chain];
        steps.push({
          title: `push(s, ${v}) ⇒ ${show(chain)}`,
          explanation: op.note ?? "push = addHead: p->pNext = s.pTop; s.pTop = p; — đúng cả khi stack rỗng.",
          pointerSnapshot: snap(),
          nodeHighlights: only(id, "settled"),
        });
      } else {
        steps.push({
          title: `push(s, ${v}):  Node* p = initNode(${v});`,
          explanation: `${op.note ? op.note + " " : ""}Cấp phát node mới p chứa ${v}; initNode gán p->pNext = NULL. p chưa nối vào stack.`,
          pointerSnapshot: snap([{ id, value: v, next: null, row: 1, col: 0 }], { pTop: oldTop, p: id }),
          nodeHighlights: only(id, "active"),
        });
        steps.push({
          title: "p->pNext = s.pTop;",
          explanation: oldTop
            ? `Node mới trỏ tới đỉnh cũ (${chain[0].value}) TRƯỚC khi đổi pTop — đổi pTop trước sẽ mất cả phần stack cũ.`
            : "pTop đang NULL nên p->pNext = NULL — 2 dòng của push đúng cả khi stack rỗng, không cần if/else kiểm tra rỗng.",
          pointerSnapshot: snap([{ id, value: v, next: oldTop, row: 1, col: 0 }], { pTop: oldTop, p: id }),
          nodeHighlights: only(id, "active"),
        });
        chain = [fresh, ...chain];
        steps.push({
          title: `s.pTop = p;   ⇒ ${show(chain)}`,
          explanation: "pTop chuyển sang node mới — node mới trở thành đỉnh stack.",
          pointerSnapshot: snap([], { pTop: id, p: id }),
          nodeHighlights: only(id, "settled"),
        });
      }
      opLog.push(`push(${v}) ⇒ ${show(chain)}`);
    } else if (op.op === "pop") {
      if (chain.length === 0) {
        steps.push({
          title: "pop(s, value): s.pTop == NULL ⇒ return false",
          explanation: "Stack rỗng — không có gì để lấy; hàm trả false, tuyệt đối không giải tham chiếu NULL.",
          pointerSnapshot: snap(),
        });
        opLog.push("pop() ⇒ false (stack rỗng)");
        continue;
      }
      const p = chain[0];
      popped.push(p.value);
      if (op.brief) {
        chain = chain.slice(1);
        steps.push({
          title: `pop(s, value) ⇒ value = ${p.value},  ${show(chain)}`,
          explanation: op.note ?? "pop: lưu p = pTop, pTop = p->pNext, delete p; lấy ra phần tử vào SAU CÙNG.",
          pointerSnapshot: snap(),
        });
      } else {
        steps.push({
          title: `Node* p = s.pTop;   value = p->data;   (value = ${p.value})`,
          explanation: `${op.note ? op.note + " " : ""}Lưu địa chỉ đỉnh vào p và đọc giá trị ${p.value} — phải lưu p trước khi dời pTop, nếu không sẽ không còn cách delete node.`,
          pointerSnapshot: snap([], { pTop: p.id, p: p.id }),
          nodeHighlights: only(p.id, "active"),
        });
        steps.push({
          title: "s.pTop = p->pNext;",
          explanation: "pTop dời xuống node kế tiếp. Node cũ vẫn còn trong bộ nhớ (p giữ địa chỉ) nên phải delete.",
          pointerSnapshot: snap([], { pTop: chain[1]?.id ?? null, p: p.id }),
          nodeHighlights: only(p.id, "rejected"),
        });
        chain = chain.slice(1);
        steps.push({
          title: `delete p;   ⇒ value = ${p.value},  ${show(chain)}`,
          explanation: "Giải phóng node cũ; hàm trả true.",
          pointerSnapshot: snap(),
        });
      }
      opLog.push(`pop() ⇒ value = ${p.value},  ${show(chain)}`);
    } else {
      steps.push({
        title: `count(s): duyệt từ pTop, đếm ⇒ ${chain.length} phần tử`,
        explanation: "Duyệt bằng for (Node* p = s.pTop; p != NULL; p = p->pNext) dem++.",
        pointerSnapshot: snap(),
        nodeHighlights: Object.fromEntries(chain.map((c) => [c.id, "active" as const])),
      });
      opLog.push(`count(s) = ${chain.length}`);
    }
  }

  const summary = `Trạng thái cuối: ${show(chain)}` + (popped.length ? ` · Thứ tự pop: ${popped.join(" ")}` : "");
  return { steps, summary, opLog };
}
