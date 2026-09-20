import type { AlgoStep, HighlightState } from "@/engine/types";
import { createListModel, type OpTraceResult } from "./pointerModel.ts";

export type DoublyOp =
  | { op: "addHead"; value: number; note?: string; brief?: boolean }
  | { op: "addTail"; value: number; note?: string; brief?: boolean }
  | { op: "print" }
  | { op: "removeValue"; value: number };

export interface DoublyLinkedListSpec {
  ops: DoublyOp[];
}

type Ptrs = Record<string, string | null>;

/**
 * Chạy DSLK ĐÔI (`Node{pPre,data,pNext}`, `List{pHead,pTail}`) từng dòng lệnh theo `QLSV_List2.cpp` của thầy:
 * addHead/addTail — MỖI lệnh nối phải cập nhật CẢ 2 chiều (quên 1 chiều là lỗi hay gặp nhất) — và printList
 * (duyệt xuôi bằng pNext, ngược từ pTail bằng pPre). removeValue là kiến thức chuẩn (KHÔNG có trong file nguồn):
 * nhờ p->pPre nên không cần con trỏ prev riêng như DSLK đơn. `brief` gộp thêm node thành 1 bước.
 */
export function runDoublyLinkedList(spec: DoublyLinkedListSpec): OpTraceResult {
  const M = createListModel(true);
  let head: string | null = null;
  let tail: string | null = null;
  const steps: AlgoStep[] = [];
  const opLog: string[] = [];
  const show = () => `NULL ⇄ ${[...M.values(), "NULL"].join(" ⇄ ")}`;
  const emit = (title: string, explanation: string, hl: Record<string, HighlightState> = {}, extra: Ptrs = {}) =>
    steps.push({ title, explanation, pointerSnapshot: M.snapshot({ pHead: head, pTail: tail, ...extra }), nodeHighlights: hl });

  emit("Danh sách rỗng: l.pHead = l.pTail = NULL", "Node có thêm pPre trỏ về node trước ⇒ duyệt được cả 2 chiều (xuôi từ pHead, ngược từ pTail). initList gán pHead = pTail = NULL.");

  for (const op of spec.ops) {
    if (op.op === "addHead") {
      const v = op.value;
      const id = M.add(v, 0);
      if (op.brief) {
        M.attach(id, 0);
        if (head === null) tail = id;
        else {
          M.setNext(id, head);
          M.setPrev(head, id);
        }
        head = id;
        emit(`addHead(l, ${v}) ⇒ ${show()}`, op.note ?? "addHead: p->pNext = pHead; pHead->pPre = p; pHead = p; — cập nhật CẢ 2 chiều.", { [id]: "settled" });
      } else {
        emit(`addHead(l, p):  Node* p = initNode(${v});`, `${op.note ? op.note + " " : ""}Cấp phát node mới p chứa ${v}, p->pPre = p->pNext = NULL. p chưa nối vào danh sách.`, { [id]: "active" }, { p: id });
        if (head === null) {
          M.attach(id, 0);
          head = tail = id;
          emit(`l.pHead = l.pTail = p;   ⇒ ${show()}`, "Danh sách rỗng ⇒ cả pHead và pTail cùng trỏ node mới.", { [id]: "settled" }, { p: id });
        } else {
          M.setNext(id, head);
          emit("p->pNext = l.pHead;", `Chiều xuôi: node mới trỏ tới đầu cũ (${M.value(head)}).`, { [id]: "active" }, { p: id });
          M.setPrev(head, id);
          emit("l.pHead->pPre = p;", "Chiều ngược: đầu cũ phải trỏ ngược lại node mới — quên dòng này là lỗi hay gặp nhất.", { [head]: "active", [id]: "active" }, { p: id });
          M.attach(id, 0);
          head = id;
          emit(`l.pHead = p;   ⇒ ${show()}`, "pHead chuyển sang node mới.", { [id]: "settled" }, { p: id });
        }
      }
      opLog.push(`addHead(${v}) ⇒ ${show()}`);
    } else if (op.op === "addTail") {
      const v = op.value;
      const n = M.order().length;
      const id = M.add(v, n);
      if (op.brief) {
        M.attach(id, n);
        if (head === null) head = id;
        else {
          M.setNext(tail!, id);
          M.setPrev(id, tail);
        }
        tail = id;
        emit(`addTail(l, ${v}) ⇒ ${show()}`, op.note ?? "addTail: pTail->pNext = p; p->pPre = pTail; pTail = p; — cập nhật CẢ 2 chiều.", { [id]: "settled" });
      } else {
        emit(`addTail(l, p):  Node* p = initNode(${v});`, `${op.note ? op.note + " " : ""}Cấp phát node mới p chứa ${v}, p->pPre = p->pNext = NULL. p chưa nối vào danh sách.`, { [id]: "active" }, { p: id });
        if (head === null) {
          M.attach(id, 0);
          head = tail = id;
          emit(`l.pHead = l.pTail = p;   ⇒ ${show()}`, "Danh sách rỗng ⇒ cả pHead và pTail cùng trỏ node mới.", { [id]: "settled" }, { p: id });
        } else {
          M.setNext(tail!, id);
          emit("l.pTail->pNext = p;", `Chiều xuôi: node cuối (${M.value(tail!)}) trỏ tới node mới.`, { [id]: "active" }, { p: id });
          M.setPrev(id, tail);
          emit("p->pPre = l.pTail;", "Chiều ngược: node mới trỏ ngược về node cuối cũ — quên dòng này là lỗi hay gặp nhất.", { [id]: "active", [tail!]: "active" }, { p: id });
          M.attach(id, n);
          tail = id;
          emit(`l.pTail = p;   ⇒ ${show()}`, "pTail dời sang node mới.", { [id]: "settled" }, { p: id });
        }
      }
      opLog.push(`addTail(${v}) ⇒ ${show()}`);
    } else if (op.op === "print") {
      const ids = M.order();
      const vals = M.values();
      if (ids.length === 0) {
        emit('printList: danh sách rỗng ⇒ in "..."', "pHead == NULL && pTail == NULL: in dấu ... rồi return (không duyệt).");
        opLog.push('printList() ⇒ "..."');
        continue;
      }
      const all = Object.fromEntries(ids.map((i) => [i, "active" as const]));
      emit(`printList: pHead--->>pTail:  ${vals.join("  ")}`, "for (Node* p = l.pHead; p != nullptr; p = p->pNext): duyệt xuôi bằng pNext.", all);
      emit(`printList: pHead<<---pTail:  ${[...vals].reverse().join("  ")}`, "for (Node* p = l.pTail; p != nullptr; p = p->pPre): duyệt NGƯỢC từ pTail bằng pPre — DSLK đơn không làm được.", all);
      opLog.push(`printList() ⇒ xuôi: ${vals.join(" ")} | ngược: ${[...vals].reverse().join(" ")}`);
    } else {
      const v = op.value;
      let p: string | null = head;
      emit(`removeValue(l, ${v}):  Node* p = l.pHead;`, "Duyệt tìm node đầu tiên có giá trị cần xóa.", p ? { [p]: "active" } : {}, { p });
      while (p !== null && M.value(p) !== v) {
        emit(`p->data = ${M.value(p)} ≠ ${v} ⇒ p = p->pNext;`, "Chưa đúng giá trị: sang node kế tiếp.", { [p]: "rejected" }, { p });
        p = M.next(p);
      }
      if (p === null) {
        emit(`p == nullptr ⇒ return false (không có ${v})`, "Duyệt hết danh sách mà không gặp giá trị cần xóa.");
        opLog.push(`removeValue(${v}) ⇒ false (không có)`);
        continue;
      }
      const before = M.prev(p);
      const after = M.next(p);
      emit(`p->data = ${v} ⇒ tìm thấy`, "Nhờ p->pPre ta biết node đứng trước — không cần con trỏ prev riêng như DSLK đơn.", { [p]: "active" }, { p });
      if (before) {
        M.setNext(before, after);
        emit("p->pPre->pNext = p->pNext;", "Nối tắt chiều xuôi: node trước p trỏ thẳng qua p.", { [p]: "rejected" }, { p });
      } else {
        head = after;
        emit("l.pHead = p->pNext;", "p là node đầu (pPre == NULL) ⇒ pHead dời sang node kế tiếp.", { [p]: "rejected" }, { p });
      }
      if (after) {
        M.setPrev(after, before);
        emit("p->pNext->pPre = p->pPre;", "Nối tắt chiều ngược: node sau p trỏ ngược qua p.", { [p]: "rejected" }, { p });
      } else {
        tail = before;
        emit("l.pTail = p->pPre;", "p là node cuối (pNext == NULL) ⇒ pTail lùi về node trước.", { [p]: "rejected" }, { p });
      }
      M.remove(p);
      emit(`delete p;   ⇒ ${show()}`, "Giải phóng node đã được bỏ khỏi cả 2 chiều.");
      opLog.push(`removeValue(${v}) ⇒ ${show()}`);
    }
  }

  return { steps, summary: `Trạng thái cuối: ${show()}`, opLog };
}
