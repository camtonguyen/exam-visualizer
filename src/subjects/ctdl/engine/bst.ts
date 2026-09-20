import type { AlgoStep, HighlightState, TreeSnapshot } from "@/engine/types";
import { idGen, type OpTraceResult } from "./pointerModel.ts";

export type TraverseOrder = "NLR" | "LNR" | "LRN";

export type BstOp =
  | { op: "insert"; value: number; brief?: boolean }
  | { op: "search"; value: number }
  | { op: "traverse"; order: TraverseOrder }
  | { op: "traverseStack" }
  | { op: "count" };

export interface BstSpec {
  ops: BstOp[];
}

export interface BstResult extends OpTraceResult {
  /** Cây cuối dạng `giá trị(trái,phải)`, vd `50(25(10,30),75)`; lá chỉ ghi giá trị. */
  tree: string;
}

interface TNode {
  value: number;
  left: string | null;
  right: string | null;
}

const RULE: Record<TraverseOrder, string> = {
  NLR: "Node → Left → Right (tiền tố)",
  LNR: "Left → Node → Right (trung tố — với BST luôn ra dãy TĂNG DẦN)",
  LRN: "Left → Right → Node (hậu tố)",
};

/**
 * Chạy cây nhị phân tìm kiếm qua chuỗi thao tác, theo code của thầy (`demo_tree_v1.cpp`) và các đề thực hành (Test01, Luyện tập 005 Câu 4):
 *  - insert KHÔNG đệ quy: `pGoto` đi xuống, `pLoca` (cha) đi song song vì khi pGoto chạm NULL đã mất node cha; GIÁ TRỊ TRÙNG ⇒ bỏ qua
 *    (đề yêu cầu; `add` trong demo_tree_v1.cpp KHÔNG xử lý trùng nên lặp vô hạn khi value == pGoto->data).
 *  - search không đệ quy (Đề mẫu Câu 11), duyệt NLR/LNR/LRN, LNR không đệ quy bằng std::stack ("Left_full → Xử lý → Right"), đếm node.
 * Đường đi, so sánh, con trỏ và kết quả đều do engine tính; `brief` gộp 1 lần chèn thành 1 bước.
 */
export function runBst(spec: BstSpec): BstResult {
  const nextId = idGen();
  const nodes = new Map<string, TNode>();
  let root: string | null = null;
  const steps: AlgoStep[] = [];
  const opLog: string[] = [];

  const val = (id: string) => nodes.get(id)!.value;
  const inorder = (id: string | null): number[] => (id === null ? [] : [...inorder(nodes.get(id)!.left), val(id), ...inorder(nodes.get(id)!.right)]);
  const paren = (id: string | null): string => {
    if (id === null) return "";
    const n = nodes.get(id)!;
    return n.left === null && n.right === null ? `${n.value}` : `${n.value}(${paren(n.left)},${paren(n.right)})`;
  };
  const treeText = () => (root === null ? "(rỗng)" : paren(root));
  const snap = (
    labels: TreeSnapshot["labels"] = {},
    extra: Pick<TreeSnapshot, "pending" | "stack" | "output"> = {}
  ): TreeSnapshot => ({
    root,
    nodes: [...nodes].map(([id, n]) => ({ id, value: n.value, left: n.left, right: n.right })),
    labels,
    ...extra,
  });
  const emit = (title: string, explanation: string, treeSnapshot: TreeSnapshot, hl: Record<string, HighlightState> = {}) =>
    steps.push({ title, explanation, treeSnapshot, nodeHighlights: hl });

  emit("Cây rỗng: t.pRoot = NULL", "struct Tree { Node* pRoot; } — mỗi Node có data, pLeft, pRight. Quy tắc BST: giá trị bên TRÁI nhỏ hơn node, bên PHẢI lớn hơn node.", snap({ pRoot: null }));

  for (const op of spec.ops) {
    if (op.op === "insert") {
      const v = op.value;
      let goto = root;
      let loca: string | null = null;
      const path: number[] = [];
      let dup = false;
      let side: "pLeft" | "pRight" = "pLeft";
      const detail = !op.brief;

      if (detail) emit(`insert(t, ${v}):  Node* pGoto = t.pRoot;  Node* pLoca = nullptr;`, "pGoto đi xuống tìm chỗ chèn; pLoca đi sau pGoto một bước để nhớ node cha.", snap({ pGoto: goto, pLoca: loca }), goto ? { [goto]: "active" } : {});
      while (goto !== null) {
        const g = nodes.get(goto)!;
        path.push(g.value);
        if (v === g.value) {
          dup = true;
          if (detail) emit(`${v} == ${g.value} ⇒ return false   (trùng, bỏ qua)`, "Giá trị đã có trong cây: đề yêu cầu BỎ QUA nên không tạo node mới.", snap({ pGoto: goto, pLoca: loca }), { [goto]: "rejected" });
          break;
        }
        const left = v < g.value;
        loca = goto;
        goto = left ? g.left : g.right;
        side = left ? "pLeft" : "pRight";
        if (detail) {
          emit(
            `${v} ${left ? "<" : ">"} ${g.value} ⇒ pLoca = pGoto;  pGoto = pGoto->${side};`,
            `${v} ${left ? "nhỏ" : "lớn"} hơn ${g.value} nên đi sang ${left ? "TRÁI" : "PHẢI"}. pLoca ghi nhớ node cha (${g.value}).`,
            snap({ pGoto: goto, pLoca: loca }),
            { [loca]: "active", ...(goto ? { [goto]: "active" } : {}) }
          );
        }
      }

      if (dup) {
        if (!detail) emit(`insert(t, ${v}) ⇒ trùng, bỏ qua   (cây giữ nguyên)`, "Giá trị đã có nên không thêm.", snap());
        opLog.push(`insert(${v}):  đường đi ${path.join(" → ")}  ⇒ trùng, bỏ qua`);
        continue;
      }
      const id = nextId();
      const place = loca === null ? "làm NÚT GỐC (cây rỗng)" : `làm con ${side === "pLeft" ? "TRÁI" : "PHẢI"} của ${val(loca)}`;
      if (detail) {
        emit(`pGoto == nullptr ⇒ dừng:  chèn ${place}`, loca === null ? "Cây rỗng: node mới là gốc." : `Đã đi hết đường: chỗ trống nằm ở ${side} của pLoca (${val(loca)}).`, snap({ pGoto: null, pLoca: loca }), loca ? { [loca]: "active" } : {});
        emit(`Node* p = initNode(${v});`, `Cấp phát node mới p chứa ${v}, pLeft = pRight = NULL. p chưa nối vào cây.`, snap({ pLoca: loca, p: id }, { pending: { id, value: v } }), loca ? { [loca]: "active", [id]: "active" } : { [id]: "active" });
      }
      nodes.set(id, { value: v, left: null, right: null });
      if (loca === null) root = id;
      else nodes.get(loca)![side === "pLeft" ? "left" : "right"] = id;
      emit(
        detail ? (loca === null ? "t.pRoot = p;" : `pLoca->${side} = p;`) : `insert(t, ${v}) ⇒ ${place}`,
        detail ? "Nối node mới vào cây." : `Đường đi ${path.join(" → ") || "(cây rỗng)"}, ${place}.`,
        snap({ p: id }),
        { [id]: "settled" }
      );
      opLog.push(`insert(${v}):  đường đi ${path.length ? path.join(" → ") : "(cây rỗng)"}  ⇒  ${place}`);
    } else if (op.op === "search") {
      const v = op.value;
      let p = root;
      const path: number[] = [];
      let hit = false;
      emit(`search(t, ${v}):  Node* p = t.pRoot;`, "Đi xuống như lúc chèn: nhỏ hơn thì sang trái, lớn hơn thì sang phải, gặp NULL là không có.", snap({ p }), p ? { [p]: "active" } : {});
      while (p !== null) {
        const n = nodes.get(p)!;
        path.push(n.value);
        if (n.value === v) {
          hit = true;
          emit(`p->data = ${n.value} = ${v} ⇒ return true`, `Tìm thấy ${v}.`, snap({ p }), { [p]: "settled" });
          break;
        }
        const left = v < n.value;
        const cur = p;
        p = left ? n.left : n.right;
        emit(`${v} ${left ? "<" : ">"} ${n.value} ⇒ p = p->${left ? "pLeft" : "pRight"};`, `${v} ${left ? "nhỏ" : "lớn"} hơn ${n.value} nên sang ${left ? "trái" : "phải"}.`, snap({ p }), { [cur]: "rejected", ...(p ? { [p]: "active" } : {}) });
      }
      if (!hit) emit("p == nullptr ⇒ return false", `Đi tới NULL mà không gặp ${v} ⇒ không có trong cây.`, snap({ p: null }));
      opLog.push(`search(${v}):  đường đi ${path.join(" → ") || "(cây rỗng)"}  ⇒ ${hit}`);
    } else if (op.op === "traverse") {
      const order: number[] = [];
      const ids: string[] = [];
      const walk = (id: string | null) => {
        if (id === null) return;
        const n = nodes.get(id)!;
        if (op.order === "NLR") ids.push(id);
        walk(n.left);
        if (op.order === "LNR") ids.push(id);
        walk(n.right);
        if (op.order === "LRN") ids.push(id);
      };
      walk(root);
      emit(`duyệt ${op.order}:  ${RULE[op.order]}`, "Duyệt bằng đệ quy: với mỗi node thực hiện đúng thứ tự trên cho node và 2 cây con.", snap({}, { output: [] }));
      const done: Record<string, HighlightState> = {};
      ids.forEach((id, i) => {
        order.push(val(id));
        emit(`${op.order}: thăm ${val(id)}   ⇒ ${order.join("  ")}`, `Thăm node ${val(id)} (thứ ${i + 1}/${ids.length}).`, snap({}, { output: [...order] }), { ...done, [id]: "active" });
        done[id] = "settled";
      });
      opLog.push(`${op.order}:  ${order.join("  ")}`);
    } else if (op.op === "traverseStack") {
      let p = root;
      const stk: string[] = [];
      const out: number[] = [];
      const done: Record<string, HighlightState> = {};
      const stackVals = () => stk.map(val);
      emit("printTree (LNR không đệ quy):  Node* p = t.pRoot;  stack<Node*> s;", "Dùng 1 std::stack tường minh thay cho ngăn xếp gọi hàm của đệ quy: 'Left_full' đẩy hết nhánh trái, rồi xử lý, rồi sang phải.", snap({ p }, { stack: [], output: [] }));
      while (p !== null || stk.length > 0) {
        while (p !== null) {
          stk.push(p);
          const cur: string = p;
          p = nodes.get(p)!.left;
          emit(`s.push(p);  p = p->pLeft;      (Left_full)`, `Đẩy ${val(cur)} vào stack rồi đi sang trái${p === null ? " — hết nhánh trái (p = NULL)" : ""}.`, snap({ p }, { stack: stackVals(), output: [...out] }), { ...done, [cur]: "active" });
        }
        const top: string = stk.pop()!;
        out.push(val(top));
        emit(`p = s.top();  cout << p->data;  s.pop();   ⇒ ${out.join("  ")}`, `Lấy đỉnh stack (${val(top)}), in ra rồi pop: node được xử lý SAU KHI nhánh trái của nó đã xong.`, snap({ p: top }, { stack: stackVals(), output: [...out] }), { ...done, [top]: "settled" });
        done[top] = "settled";
        p = nodes.get(top)!.right;
        emit("p = p->pRight;      (Right)", `Sang nhánh phải của ${val(top)}${p === null ? " — NULL, quay lại lấy đỉnh stack" : ""}.`, snap({ p }, { stack: stackVals(), output: [...out] }), done);
      }
      opLog.push(`LNR không đệ quy:  ${out.join("  ")}`);
    } else {
      const n = nodes.size;
      emit(`demNode(t) = ${n}`, "Đếm mọi node (duyệt cây, mỗi node cộng 1).", snap(), Object.fromEntries([...nodes.keys()].map((id) => [id, "active" as const])));
      opLog.push(`demNode = ${n}`);
    }
  }

  const tree = treeText();
  return { steps, summary: `Cây: ${tree}${root ? ` · LNR: ${inorder(root).join(" ")}` : ""}`, opLog, tree };
}
