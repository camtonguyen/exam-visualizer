import type { AlgoStep, PointerNode, PointerSnapshot } from "@/engine/types";

export interface ChainItem {
  id: string;
  value: number;
}

/** Fresh unique node ids ("n1", "n2"…) — stable across steps so the canvas can tell which node is which. */
export function idGen(): () => string {
  let n = 0;
  return () => `n${++n}`;
}

/** Items in order → a singly linked chain on `row`: each node's pNext is the next item, the last is NULL. */
export function chainNodes(items: ChainItem[], row = 0): PointerNode[] {
  return items.map((it, i) => ({ id: it.id, value: it.value, next: items[i + 1]?.id ?? null, row, col: i }));
}

/** Result of a stack/queue engine: the steps, plus one line per operation for "Ghi vào bài làm". */
export interface OpTraceResult {
  steps: AlgoStep[];
  summary: string;
  opLog: string[];
}

interface Link {
  value: number;
  next: string | null;
  prev: string | null;
}

/**
 * Mô hình danh sách liên kết để engine DSLK đơn/đôi chạy từng dòng lệnh: mỗi node có `next`/`prev` RIÊNG
 * (nên biểu diễn được trạng thái trung gian sai lệch giữa 2 dòng lệnh — vd `p->pNext = pHead` đã chạy nhưng
 * `pHead = p` chưa). `order` = các node đang nằm trên hàng chính (trái → phải); node mới cấp phát nằm hàng 2 cho
 * tới khi `attach`. `remove` = `delete`: mọi con trỏ/`next`/`prev` còn trỏ vào node đó tự thành dangling.
 */
export function createListModel(doubly: boolean) {
  const nextId = idGen();
  const links = new Map<string, Link>();
  let order: string[] = [];
  const detached = new Map<string, number>(); // id → cột trên hàng 2

  const link = (id: string): Link => {
    const l = links.get(id);
    if (!l) throw new Error(`node ${id} đã bị delete`);
    return l;
  };

  return {
    /** initNode(value): node mới, pNext/pPre = NULL, chưa nối vào danh sách (hàng 2, cột `col`). */
    add(value: number, col: number): string {
      const id = nextId();
      links.set(id, { value, next: null, prev: null });
      detached.set(id, col);
      return id;
    },
    /** Đưa node từ hàng 2 vào hàng chính tại vị trí `index` (các node sau dịch sang phải). */
    attach(id: string, index: number): void {
      detached.delete(id);
      order = [...order.slice(0, index), id, ...order.slice(index)];
    },
    /** `delete p`. */
    remove(id: string): void {
      links.delete(id);
      detached.delete(id);
      order = order.filter((o) => o !== id);
    },
    value: (id: string) => link(id).value,
    next: (id: string) => link(id).next,
    prev: (id: string) => link(id).prev,
    setNext(id: string, to: string | null): void {
      link(id).next = to;
    },
    setPrev(id: string, to: string | null): void {
      link(id).prev = to;
    },
    has: (id: string) => links.has(id),
    order: () => [...order],
    values: () => order.map((id) => link(id).value),
    snapshot(pointers: Record<string, string | null>): PointerSnapshot {
      const node = (id: string, row: number, col: number): PointerNode => {
        const l = link(id);
        return doubly ? { id, value: l.value, next: l.next, prev: l.prev, row, col } : { id, value: l.value, next: l.next, row, col };
      };
      return {
        nodes: [...order.map((id, i) => node(id, 0, i)), ...[...detached].map(([id, col]) => node(id, 1, col))],
        pointers,
      };
    },
  };
}
