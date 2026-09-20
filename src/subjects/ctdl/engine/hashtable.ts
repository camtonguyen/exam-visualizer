import type { AlgoStep, HashNode, HashSnapshot, HighlightState } from "@/engine/types";
import { idGen, type OpTraceResult } from "./pointerModel.ts";

export type HashOp =
  | { op: "add"; value: number; note?: string; brief?: boolean }
  | { op: "find"; value: number };

export interface HashSpec {
  size: number;
  ops: HashOp[];
}

export interface HashResult extends OpTraceResult {
  /** Bảng cuối, theo `printHashtable` của thầy: một dòng `Bucket[i]:   a  b  c` cho MỌI bucket. */
  table: string[];
}

/** Hàm băm phương pháp chia. `%` của JS/C++ có thể âm với số âm ⇒ đưa về [0, size-1]. */
export const hashFun = (value: number, size: number) => ((value % size) + size) % size;

/**
 * Chạy bảng băm NỐI KẾT (mỗi bucket là DSLK `Bucket{pHead,pTail}`) theo code của thầy (`hashtable_*.cpp`):
 * add = `viTri = hashFun(value)` → `initNode` → bucket rỗng thì `pHead = pTail = p`, ngược lại
 * `pTail->pNext = p; pTail = p` (đụng độ ⇒ NỐI TIẾP vào cùng danh sách, không ghi đè; bảng băm GIỮ giá trị trùng).
 * find (Test03 Câu 7) chỉ duyệt đúng bucket `hashFun(x)`. `brief` gộp 1 lần add thành 1 bước.
 */
export function runHashtable(spec: HashSpec): HashResult {
  const { size } = spec;
  const nextId = idGen();
  const buckets: HashNode[][] = Array.from({ length: size }, () => []);
  const steps: AlgoStep[] = [];
  const opLog: string[] = [];
  const vals = (i: number) => buckets[i].map((n) => n.value).join(" → ");
  const snap = (pending?: { bucket: number; node: HashNode }, labels?: Record<string, string>): HashSnapshot => ({
    size,
    buckets: buckets.map((b) => [...b]),
    pending,
    labels,
  });
  const emit = (title: string, explanation: string, hashSnapshot: HashSnapshot, hl: Record<string, HighlightState> = {}) =>
    steps.push({ title, explanation, hashSnapshot, nodeHighlights: hl });
  const ends = (i: number): Record<string, string> => (buckets[i].length ? { pHead: buckets[i][0].id, pTail: buckets[i].at(-1)!.id } : {});

  emit(
    `Bảng băm rỗng: Size = ${size}, mọi bucket[i].pHead = bucket[i].pTail = NULL`,
    `Hashtable { Bucket bucket[Size]; } — mỗi bucket là 1 danh sách liên kết (phương pháp NỐI KẾT). Hàm băm phương pháp chia: hashFun(x) = x % ${size} ⇒ vị trí trong [0, ${size - 1}].`,
    snap()
  );

  for (const op of spec.ops) {
    const v = op.value;
    const idx = hashFun(v, size);
    const hb: Record<string, HighlightState> = { [`b${idx}`]: "active" };
    if (op.op === "add") {
      const collide = buckets[idx].length > 0;
      const node: HashNode = { id: nextId(), value: v };
      if (op.brief) {
        buckets[idx].push(node);
        emit(
          `add(h, ${v}):  ${v} % ${size} = ${idx}  ⇒  bucket[${idx}]: ${vals(idx)}${collide ? "   (đụng độ)" : ""}`,
          op.note ?? (collide ? `bucket[${idx}] đã có giá trị ⇒ đụng độ: nối tiếp vào cuối danh sách của bucket.` : `bucket[${idx}] đang rỗng ⇒ pHead = pTail = p.`),
          snap(),
          { ...hb, [node.id]: "settled" }
        );
      } else {
        emit(
          `add(h, ${v}):  viTri = hashFun(${v}) = ${v} % ${size} = ${idx}`,
          collide
            ? `bucket[${idx}] đang chứa ${vals(idx)} ⇒ ĐỤNG ĐỘ: giá trị mới được nối tiếp vào CÙNG danh sách liên kết (không ghi đè giá trị cũ).`
            : `bucket[${idx}] đang rỗng.`,
          snap(undefined, ends(idx)),
          hb
        );
        emit(`Node* p = initNode(${v});`, `${op.note ? op.note + " " : ""}Cấp phát node mới p chứa ${v}, p->pNext = NULL. p chưa nối vào bucket[${idx}].`, snap({ bucket: idx, node }, ends(idx)), { ...hb, [node.id]: "active" });
        if (!collide) {
          buckets[idx].push(node);
          emit(`bucket[${idx}].pHead = bucket[${idx}].pTail = p;   ⇒ bucket[${idx}]: ${vals(idx)}`, "Bucket rỗng ⇒ cả pHead và pTail cùng trỏ node mới.", snap(undefined, { pHead: node.id, pTail: node.id }), { ...hb, [node.id]: "settled" });
        } else {
          const oldTail = buckets[idx].at(-1)!;
          buckets[idx].push(node);
          emit(`bucket[${idx}].pTail->pNext = p;`, `Nối p vào sau node cuối của bucket (${oldTail.value}) — pTail vẫn đang trỏ node cuối cũ.`, snap(undefined, { pHead: buckets[idx][0].id, pTail: oldTail.id }), { ...hb, [node.id]: "active" });
          emit(`bucket[${idx}].pTail = p;   ⇒ bucket[${idx}]: ${vals(idx)}`, "pTail dời sang node mới.", snap(undefined, { pHead: buckets[idx][0].id, pTail: node.id }), { ...hb, [node.id]: "settled" });
        }
      }
      opLog.push(`add(${v}):  ${v} % ${size} = ${idx}  ⇒  bucket[${idx}]: ${vals(idx)}${collide ? "   (đụng độ)" : ""}`);
    } else {
      const chain = buckets[idx];
      emit(
        `find(h, ${v}):  viTri = hashFun(${v}) = ${v} % ${size} = ${idx}`,
        `Chỉ cần duyệt DUY NHẤT bucket[${idx}] — không quét cả bảng. Đây là lợi thế của bảng băm: trung bình O(1 + hệ số tải).`,
        snap(undefined, ends(idx)),
        hb
      );
      let hit = false;
      if (chain.length === 0) {
        emit(`bucket[${idx}].pHead == NULL ⇒ return false`, `bucket[${idx}] rỗng nên chắc chắn không có ${v}.`, snap(), hb);
      } else {
        for (let k = 0; k < chain.length; k++) {
          const found = chain[k].value === v;
          emit(
            `p->data = ${chain[k].value} ${found ? "=" : "≠"} ${v} ⇒ ${found ? "return true" : "p = p->pNext"}`,
            found ? `Tìm thấy ${v} trong bucket[${idx}].` : "Chưa đúng: sang node kế tiếp trong bucket.",
            snap(undefined, { p: chain[k].id }),
            { ...hb, [chain[k].id]: found ? "settled" : "rejected" }
          );
          if (found) {
            hit = true;
            break;
          }
        }
        if (!hit) emit("p == nullptr ⇒ return false", `Duyệt hết bucket[${idx}] mà không gặp ${v} ⇒ không có trong bảng.`, snap(), hb);
      }
      opLog.push(`find(${v}):  bucket[${idx}] ⇒ ${hit}`);
    }
  }

  const table = buckets.map((_, i) => `Bucket[${i}]:   ${buckets[i].map((n) => n.value).join("  ")}`.trimEnd());
  const total = buckets.reduce((s, b) => s + b.length, 0);
  const filled = buckets.map((_, i) => (buckets[i].length ? `[${i}]: ${buckets[i].map((n) => n.value).join(" ")}` : null)).filter(Boolean);
  return { steps, summary: `Bảng băm (Size = ${size}, ${total} giá trị): ${filled.join(" · ") || "rỗng"}`, opLog, table };
}
