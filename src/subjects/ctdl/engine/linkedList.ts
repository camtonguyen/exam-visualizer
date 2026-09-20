import type { AlgoStep, HighlightState } from "@/engine/types";
import { createListModel, type OpTraceResult } from "./pointerModel.ts";

export type LinkedListOp =
  | { op: "addHead"; value: number; note?: string; brief?: boolean }
  | { op: "addTail"; value: number; note?: string; brief?: boolean }
  | { op: "removeHead"; brief?: boolean }
  | { op: "removeTail" }
  | { op: "removeValue"; value: number }
  | { op: "find"; value: number }
  | { op: "nodeKeCuoi" };

export interface LinkedListSpec {
  ops: LinkedListOp[];
}

type Ptrs = Record<string, string | null>;

/**
 * Chạy DSLK ĐƠN (`List{pHead,pTail}`) qua chuỗi thao tác, từng dòng lệnh theo code của thầy (`list.cpp`):
 * addHead/addTail (khung 4 bước Node→initNode→List→initList), timGiaTri, timNodeKeCuoi
 * (`while (p->pNext->pNext != nullptr)`). removeHead/removeTail/removeValue là kiến thức chuẩn (KHÔNG có trong
 * file nguồn) — dùng để dạy vì sao xóa cần con trỏ `prev` và phải cập nhật pTail/pHead; các bước sau `delete`
 * vẽ con trỏ dangling thật (pTail / prev->pNext còn trỏ vào vùng đã xóa). `brief` gộp thao tác đơn giản thành 1 bước.
 */
export function runLinkedList(spec: LinkedListSpec): OpTraceResult {
  const M = createListModel(false);
  let head: string | null = null;
  let tail: string | null = null;
  const steps: AlgoStep[] = [];
  const opLog: string[] = [];
  const show = () => `pHead → ${[...M.values(), "NULL"].join(" → ")}`;
  const emit = (title: string, explanation: string, hl: Record<string, HighlightState> = {}, extra: Ptrs = {}) =>
    steps.push({ title, explanation, pointerSnapshot: M.snapshot({ pHead: head, pTail: tail, ...extra }), nodeHighlights: hl });

  emit("Danh sách rỗng: l.pHead = l.pTail = NULL", "struct List { Node* pHead; Node* pTail; } — pHead để duyệt từ đầu, pTail để thêm cuối O(1). initList gán cả hai = NULL.");

  /** Từ `l.pHead = p->pNext` trở đi, khi p đang là node đầu. */
  const dropHead = (p: string) => {
    head = M.next(p);
    emit("l.pHead = p->pNext;", "pHead dời sang node kế tiếp; p vẫn giữ địa chỉ node cũ.", { [p]: "rejected" }, { p });
    M.remove(p);
    if (head === null) {
      emit("delete p;", "Đã xóa node cuối cùng nhưng pTail VẪN trỏ vào vùng vừa giải phóng (dangling)! Phải xử lý ở bước sau.");
      tail = null;
      emit(`if (l.pHead == nullptr) l.pTail = nullptr;   ⇒ ${show()}`, "pHead == NULL nghĩa là danh sách vừa rỗng ⇒ BẮT BUỘC đặt pTail = NULL.");
    } else {
      emit(`delete p;   ⇒ ${show()}`, "Giải phóng node cũ. pHead khác NULL nên không đụng tới pTail.");
    }
  };

  for (const op of spec.ops) {
    if (op.op === "addHead") {
      const v = op.value;
      const id = M.add(v, 0);
      if (op.brief) {
        M.attach(id, 0);
        if (head === null) tail = id;
        else M.setNext(id, head);
        head = id;
        emit(`addHead(l, ${v}) ⇒ ${show()}`, op.note ?? "addHead: p->pNext = l.pHead; l.pHead = p; (danh sách rỗng thì pHead = pTail = p).", { [id]: "settled" });
      } else {
        emit(`addHead(l, p):  Node* p = initNode(${v});`, `${op.note ? op.note + " " : ""}Cấp phát node mới p chứa ${v}, p->pNext = NULL. p chưa nối vào danh sách.`, { [id]: "active" }, { p: id });
        if (head === null) {
          M.attach(id, 0);
          head = tail = id;
          emit(`l.pHead = l.pTail = p;   ⇒ ${show()}`, "Danh sách rỗng ⇒ cả pHead và pTail cùng trỏ node mới.", { [id]: "settled" }, { p: id });
        } else {
          M.setNext(id, head);
          emit("p->pNext = l.pHead;", `Node mới trỏ tới đầu cũ (${M.value(head)}) TRƯỚC khi đổi pHead — đổi pHead trước sẽ mất cả danh sách cũ.`, { [id]: "active" }, { p: id });
          M.attach(id, 0);
          head = id;
          emit(`l.pHead = p;   ⇒ ${show()}`, "pHead chuyển sang node mới — node mới là node đầu.", { [id]: "settled" }, { p: id });
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
        else M.setNext(tail!, id);
        tail = id;
        emit(`addTail(l, ${v}) ⇒ ${show()}`, op.note ?? "addTail: l.pTail->pNext = p; l.pTail = p; (danh sách rỗng thì pHead = pTail = p).", { [id]: "settled" });
      } else {
        emit(`addTail(l, p):  Node* p = initNode(${v});`, `${op.note ? op.note + " " : ""}Cấp phát node mới p chứa ${v}, p->pNext = NULL. p chưa nối vào danh sách.`, { [id]: "active" }, { p: id });
        if (head === null) {
          M.attach(id, 0);
          head = tail = id;
          emit(`l.pHead = l.pTail = p;   ⇒ ${show()}`, "Danh sách rỗng ⇒ cả pHead và pTail cùng trỏ node mới.", { [id]: "settled" }, { p: id });
        } else {
          M.setNext(tail!, id);
          emit("l.pTail->pNext = p;", `Nối p vào sau node cuối (${M.value(tail!)}) — pTail vẫn đang trỏ node cuối cũ.`, { [id]: "active" }, { p: id });
          M.attach(id, n);
          tail = id;
          emit(`l.pTail = p;   ⇒ ${show()}`, "pTail dời sang node mới — node mới là node cuối.", { [id]: "settled" }, { p: id });
        }
      }
      opLog.push(`addTail(${v}) ⇒ ${show()}`);
    } else if (op.op === "removeHead") {
      if (head === null) {
        emit("removeHead(l): l.pHead == NULL ⇒ return false", "Danh sách rỗng — không có gì để xóa.");
        opLog.push("removeHead() ⇒ false (danh sách rỗng)");
        continue;
      }
      const p = head;
      if (op.brief) {
        head = M.next(p);
        M.remove(p);
        if (head === null) tail = null;
        emit(`removeHead(l) ⇒ ${show()}`, "removeHead: p = pHead; pHead = p->pNext; delete p; (rỗng thì pTail = NULL).");
      } else {
        emit("Node* p = l.pHead;", "Lưu địa chỉ node đầu vào p trước khi dời pHead.", { [p]: "active" }, { p });
        dropHead(p);
      }
      opLog.push(`removeHead() ⇒ ${show()}`);
    } else if (op.op === "removeTail") {
      if (head === null) {
        emit("removeTail(l): l.pHead == NULL ⇒ return false", "Danh sách rỗng — không có gì để xóa.");
        opLog.push("removeTail() ⇒ false (danh sách rỗng)");
        continue;
      }
      if (head === tail) {
        emit("l.pHead == l.pTail ⇒ chỉ có 1 node: xóa như removeHead", "Chỉ 1 node thì không cần prev.", { [head]: "active" });
        const p = head;
        emit("Node* p = l.pHead;", "Lưu địa chỉ node duy nhất vào p.", { [p]: "active" }, { p });
        dropHead(p);
      } else {
        let prev: string = head;
        emit("Node* prev = l.pHead;", "DSLK đơn không lùi được ⇒ phải dùng prev đi từ đầu tới node đứng ngay trước pTail.", { [prev]: "active" }, { prev });
        while (M.next(prev) !== tail) {
          prev = M.next(prev)!;
          emit("prev = prev->pNext;   (while prev->pNext != l.pTail)", `prev->pNext chưa phải pTail ⇒ tiến tiếp: prev = ${M.value(prev)}.`, { [prev]: "active" }, { prev });
        }
        const last = tail!;
        M.remove(last);
        emit("delete l.pTail;", "Node cuối đã bị giải phóng: pTail và prev->pNext đang trỏ vào vùng đã xóa (dangling).", { [prev]: "active" }, { prev });
        tail = prev;
        emit("l.pTail = prev;", "pTail lùi về node kế cuối; nhưng prev->pNext vẫn còn dangling.", { [prev]: "active" }, { prev });
        M.setNext(prev, null);
        emit(`prev->pNext = nullptr;   ⇒ ${show()}`, "Ngắt liên kết: node kế cuối trở thành node cuối (pNext = NULL).", { [prev]: "settled" }, { prev });
      }
      opLog.push(`removeTail() ⇒ ${show()}`);
    } else if (op.op === "removeValue") {
      const v = op.value;
      let prev: string | null = null;
      let p: string | null = head;
      emit(`removeValue(l, ${v}):  Node* prev = nullptr;  Node* p = l.pHead;`, "prev đi sau p một node — để khi tìm thấy p, còn biết node đứng TRƯỚC nó mà sửa pNext.", p ? { [p]: "active" } : {}, { prev, p });
      while (p !== null && M.value(p) !== v) {
        emit(`p->data = ${M.value(p)} ≠ ${v} ⇒ prev = p;  p = p->pNext;`, "Chưa đúng giá trị: prev bước theo p, p sang node kế tiếp.", { [p]: "rejected" }, { prev, p });
        prev = p;
        p = M.next(p);
      }
      if (p === null) {
        emit(`p == nullptr ⇒ return false (không có ${v})`, "Duyệt hết danh sách mà không gặp giá trị cần xóa.", {}, { prev });
        opLog.push(`removeValue(${v}) ⇒ false (không có)`);
        continue;
      }
      emit(`p->data = ${v} ⇒ tìm thấy`, prev === null ? "p đang là node đầu (prev == NULL) ⇒ xóa đầu." : `p = ${v}, prev = ${M.value(prev)} ⇒ nối tắt prev qua p.`, { [p]: "active" }, { prev, p });
      if (prev === null) {
        dropHead(p);
      } else {
        const after = M.next(p);
        M.setNext(prev, after);
        emit("prev->pNext = p->pNext;", "Nối tắt: node đứng trước trỏ thẳng qua node đứng sau — đây là lý do bắt buộc phải có prev.", { [p]: "rejected" }, { prev, p });
        if (p === tail) {
          tail = prev;
          emit("if (p == l.pTail) l.pTail = prev;", "p là node cuối nên pTail phải lùi về prev — quên dòng này thì pTail dangling.", { [p]: "rejected" }, { prev, p });
        }
        M.remove(p);
        emit(`delete p;   ⇒ ${show()}`, "Giải phóng node vừa bị nối tắt.", {}, { prev });
      }
      opLog.push(`removeValue(${v}) ⇒ ${show()}`);
    } else if (op.op === "find") {
      const v = op.value;
      let p: string | null = head;
      let hit = false;
      if (p === null) emit("for (p = l.pHead; …): pHead == NULL ⇒ return false", "Danh sách rỗng.");
      while (p !== null) {
        const found = M.value(p) === v;
        emit(
          `p->data = ${M.value(p)} ${found ? "=" : "≠"} ${v} ⇒ ${found ? "return true" : "p = p->pNext"}`,
          found ? `Tìm thấy ${v}: timGiaTri trả true (timDiaChiGiaTri thì trả địa chỉ p).` : "Chưa đúng: sang node kế tiếp.",
          { [p]: found ? "settled" : "rejected" },
          { p }
        );
        if (found) {
          hit = true;
          break;
        }
        p = M.next(p);
      }
      if (!hit && head !== null) emit("p == nullptr ⇒ return false", `Duyệt hết danh sách, không có ${v}.`);
      opLog.push(`timGiaTri(${v}) ⇒ ${hit}`);
    } else {
      if (head === null || head === tail) {
        emit("l.pHead == NULL || l.pHead == l.pTail ⇒ return false", "Rỗng hoặc chỉ 1 node thì không có node kế cuối — loại trường hợp này TRƯỚC khi viết p->pNext->pNext.");
        opLog.push("timNodeKeCuoi() ⇒ false");
        continue;
      }
      let p = head;
      emit("Node* p = l.pHead;", "Duyệt bằng p->pNext->pNext để dừng ở node đứng ngay trước node cuối.", { [p]: "active" }, { p });
      while (M.next(M.next(p)!) !== null) {
        p = M.next(p)!;
        emit("p->pNext->pNext != nullptr ⇒ p = p->pNext;", `Chưa tới node kế cuối: p = ${M.value(p)}.`, { [p]: "active" }, { p });
      }
      emit(`p->pNext->pNext == nullptr ⇒ value = p->data = ${M.value(p)};  return true`, "p đang ở node kế cuối (sau nó chỉ còn node cuối).", { [p]: "settled" }, { p });
      opLog.push(`timNodeKeCuoi() ⇒ ${M.value(p)}`);
    }
  }

  return { steps, summary: `Trạng thái cuối: ${show()}`, opLog };
}
