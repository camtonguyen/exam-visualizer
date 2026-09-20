import type { MemObjView, MemSlotView } from "@/engine/types";

/** Kết quả `new …` — dùng làm giá trị gán cho con trỏ. */
export interface RefVal {
  ref: string;
}
/** Giá trị khởi tạo một ô: số, con trỏ (`{ref}` / null = NULL), hoặc "ptr?" / "num?" = CHƯA khởi tạo (giá trị rác). */
export type Init = number | RefVal | null | "ptr?" | "num?";

/** Lỗi runtime của chương trình được mô phỏng (giải tham chiếu NULL, con trỏ rác, ra ngoài mảng…). */
export class CrashError extends Error {}

interface Slot {
  kind: "num" | "ptr";
  init: boolean;
  num: number;
  ref: string | null;
}
interface Obj {
  id: string; // "v:tên" (stack) | "h1", "h2"… (heap)
  label: string;
  type: string;
  heap: boolean;
  addr: number;
  kind: "scalar" | "struct" | "array";
  slot?: Slot;
  fields?: { name: string; slot: Slot }[];
  cells?: Slot[];
}
/** Một "chỗ" trong bộ nhớ: cả đối tượng (struct/mảng) hoặc một ô đơn lẻ trong nó. */
interface Place {
  obj: Obj;
  slot?: Slot;
}

/** In số như `cout` mặc định (6 chữ số có nghĩa): 5.6, 9.3, 13, 1e+06… */
export const cppNum = (v: number) => String(parseFloat(v.toPrecision(6)));

const newSlot = (init: Init): Slot => {
  if (init === "ptr?") return { kind: "ptr", init: false, num: 0, ref: null };
  if (init === "num?") return { kind: "num", init: false, num: 0, ref: null };
  if (init === null) return { kind: "ptr", init: true, num: 0, ref: null };
  if (typeof init === "number") return { kind: "num", init: true, num: init, ref: null };
  return { kind: "ptr", init: true, num: 0, ref: init.ref };
};

/**
 * Máy bộ nhớ tối giản cho môn "đọc code ghi kết quả": biến trên stack, đối tượng trên heap, con trỏ giữa chúng.
 * KHÔNG phải trình thông dịch C++ — mỗi dòng code của đề được viết bằng vài lệnh của máy (`declarePtr`, `assign`,
 * `cout`…), còn KẾT QUẢ (giá trị, con trỏ NULL/rác, lỗi runtime, rò rỉ) do máy tính ra. Biểu thức vế trái/phải là chuỗi
 * kiểu C++: `p`, `l.tail->data`, `(*p).data`, `*a`, `a[3]`, `*(a+3)`, `(L.pHead->next)->data`, `&a`, `NULL`.
 */
export function createMachine() {
  const objs = new Map<string, Obj>();
  const stackOrder: string[] = [];
  let heapSeq = 0;
  let output = "";

  const crash = (msg: string): never => {
    throw new CrashError(msg);
  };
  const bug = (msg: string): never => {
    throw new Error(`chương trình mẫu sai: ${msg}`);
  };

  const varObj = (name: string): Obj => objs.get(`v:${name}`) ?? bug(`biến ${name} chưa khai báo`);
  const placeOf = (o: Obj): Place => (o.kind === "scalar" ? { obj: o, slot: o.slot } : { obj: o });

  const targetOf = (slot: Slot, text: string): Obj => {
    if (slot.kind !== "ptr") bug(`${text} không phải con trỏ`);
    if (!slot.init) crash(`Lỗi runtime: con trỏ ${text} CHƯA khởi tạo (giá trị rác) mà bị giải tham chiếu`);
    if (slot.ref === null) crash(`Lỗi runtime (segmentation fault): con trỏ ${text} = NULL mà bị giải tham chiếu`);
    return objs.get(slot.ref!) ?? bug(`con trỏ ${text} trỏ vào ô không tồn tại`);
  };
  const deref = (p: Place, text: string): Place => {
    if (!p.slot) bug(`${text} không phải con trỏ`);
    const t = targetOf(p.slot!, text);
    return t.kind === "array" ? { obj: t, slot: t.cells![0] } : placeOf(t); // *a ≡ a[0]
  };
  const field = (p: Place, name: string): Place => {
    if (p.slot || p.obj.kind !== "struct") bug(`.${name} trên thứ không phải struct`);
    const f = p.obj.fields!.find((x) => x.name === name) ?? bug(`struct không có trường ${name}`);
    return { obj: p.obj, slot: f.slot };
  };
  const index = (p: Place, i: number, text: string): Place => {
    const arr = p.slot ? targetOf(p.slot, text) : p.obj;
    if (arr.kind !== "array") bug(`${text}[${i}] trên thứ không phải mảng`);
    if (i < 0 || i >= arr.cells!.length) crash(`Lỗi runtime: ${text}[${i}] nằm NGOÀI mảng (${arr.cells!.length} phần tử)`);
    return { obj: arr, slot: arr.cells![i] };
  };

  const matching = (s: string): number => {
    let depth = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === "(") depth++;
      else if (s[i] === ")" && --depth === 0) return i;
    }
    return bug(`ngoặc không khớp: ${s}`);
  };
  const parsePostfix = (s: string): Place => {
    let i: number;
    let place: Place;
    if (s[0] === "(") {
      const close = matching(s);
      place = parseUnary(s.slice(1, close));
      i = close + 1;
    } else {
      const m = /^\w+/.exec(s) ?? bug(`cú pháp: ${s}`);
      place = placeOf(varObj(m[0]));
      i = m[0].length;
    }
    while (i < s.length) {
      const rest = s.slice(i);
      let m: RegExpExecArray | null;
      if ((m = /^->(\w+)/.exec(rest))) {
        place = field(deref(place, s.slice(0, i)), m[1]);
        i += m[0].length;
      } else if ((m = /^\.(\w+)/.exec(rest))) {
        place = field(place, m[1]);
        i += m[0].length;
      } else if ((m = /^\[(\d+)\]/.exec(rest))) {
        place = index(place, +m[1], s.slice(0, i));
        i += m[0].length;
      } else bug(`cú pháp: ${s}`);
    }
    return place;
  };
  const parseUnary = (s: string): Place => {
    const arith = /^\*\((\w+)\+(\d+)\)$/.exec(s); // *(a+3)
    if (arith) return index(placeOf(varObj(arith[1])), +arith[2], arith[1]);
    if (s[0] === "*") return deref(parseUnary(s.slice(1)), s.slice(1));
    return parsePostfix(s);
  };
  const resolve = (expr: string): Place => parseUnary(expr.replace(/\s+/g, ""));
  const slotOf = (expr: string): Slot => resolve(expr).slot ?? bug(`${expr} là cả struct/mảng, không phải 1 ô`);

  const addrOf = (o: Obj) => (o.heap ? `0x${(0x1000 + 16 * (o.addr - 1)).toString(16)}` : `0x${(0x7ff0 - 16 * o.addr).toString(16)}`);
  const show = (s: Slot): string => {
    if (!s.init) return "?";
    if (s.kind === "num") return cppNum(s.num);
    return s.ref === null ? "NULL" : addrOf(objs.get(s.ref)!);
  };

  const addVar = (name: string, type: string, o: Partial<Obj>) => {
    if (objs.has(`v:${name}`)) bug(`biến ${name} khai báo 2 lần`);
    objs.set(`v:${name}`, { id: `v:${name}`, label: name, type, heap: false, addr: stackOrder.length, kind: "scalar", ...o });
    stackOrder.push(`v:${name}`);
  };
  const addHeap = (type: string, o: Partial<Obj>): RefVal => {
    const id = `h${++heapSeq}`;
    objs.set(id, { id, label: type, type, heap: true, addr: heapSeq, kind: "scalar", ...o });
    return { ref: id };
  };
  const fieldsOf = (spec: Record<string, Init>) => Object.entries(spec).map(([name, v]) => ({ name, slot: newSlot(v) }));

  const assignValue = (slot: Slot, rhs: number | string | RefVal) => {
    if (typeof rhs === "number") {
      if (slot.kind !== "num") bug("gán số cho con trỏ");
      Object.assign(slot, { init: true, num: rhs });
    } else if (typeof rhs === "object") {
      if (slot.kind !== "ptr") bug("gán con trỏ cho số");
      Object.assign(slot, { init: true, ref: rhs.ref });
    } else if (rhs === "NULL") {
      if (slot.kind !== "ptr") bug("gán NULL cho số");
      Object.assign(slot, { init: true, ref: null });
    } else if (rhs[0] === "&") {
      if (slot.kind !== "ptr") bug("gán địa chỉ cho số");
      Object.assign(slot, { init: true, ref: varObj(rhs.slice(1)).id });
    } else {
      const src = slotOf(rhs);
      if (src.kind !== slot.kind) bug(`gán ${rhs} sai kiểu`);
      Object.assign(slot, { init: src.init, num: src.num, ref: src.ref });
    }
  };

  return {
    // ---- khai báo biến trên stack ----
    declare: (name: string, type: string, init?: number) => addVar(name, type, { slot: newSlot(init ?? "num?") }),
    declarePtr: (name: string, type: string, init?: RefVal | null) => addVar(name, type, { slot: newSlot(init === undefined ? "ptr?" : init) }),
    declareStruct: (name: string, type: string, fields: Record<string, Init>) => addVar(name, type, { kind: "struct", fields: fieldsOf(fields) }),
    declareArray: (name: string, type: string, values: number[]) => addVar(name, `${type}[${values.length}]`, { kind: "array", cells: values.map((v) => newSlot(v)) }),
    // ---- cấp phát trên heap (new) ----
    newNode: (type: string, fields: Record<string, Init>): RefVal => addHeap(type, { kind: "struct", fields: fieldsOf(fields) }),
    newScalar: (type: string, value: number): RefVal => addHeap(type, { slot: newSlot(value) }),
    newArray: (type: string, n: number): RefVal => addHeap(type, { label: `${type}[${n}]`, kind: "array", cells: Array.from({ length: n }, () => newSlot("num?")) }),
    // ---- câu lệnh ----
    assign: (lhs: string, rhs: number | string | RefVal) => assignValue(slotOf(lhs), rhs),
    compound: (lhs: string, op: "+=" | "-=", n: number) => {
      const s = slotOf(lhs);
      if (!s.init) bug(`${lhs} chưa khởi tạo`);
      s.num += op === "+=" ? n : -n;
    },
    /** `x++` hậu tố: trả giá trị CŨ, rồi tăng. */
    postInc: (lhs: string): number => {
      const s = slotOf(lhs);
      const old = s.num;
      s.num += 1;
      return old;
    },
    /** Giá trị số của 1 biểu thức (để tính toán trong `cout`). */
    num: (expr: string): number => slotOf(expr).num,
    /** Chuỗi `cout` sẽ in cho biểu thức (số, NULL, hoặc địa chỉ). */
    read: (expr: string): string => show(slotOf(expr)),
    cout: (...parts: (string | number)[]) => {
      output += parts.map((p) => (typeof p === "number" ? cppNum(p) : p)).join("");
    },
    // ---- ảnh chụp ----
    output: () => output,
    snapshot(): { stack: MemObjView[]; heap: MemObjView[]; output: string } {
      const view = (s: Slot): MemSlotView => (s.init && s.kind === "ptr" && s.ref !== null ? { text: "", target: s.ref } : { text: show(s) });
      const slotsOf = (o: Obj): Slot[] => (o.slot ? [o.slot] : o.fields ? o.fields.map((f) => f.slot) : (o.cells ?? []));
      // rò rỉ = đối tượng heap mà không con trỏ nào (bắt đầu từ biến trên stack) còn với tới
      const reached = new Set<string>();
      const visit = (o: Obj) => {
        for (const s of slotsOf(o)) if (s.kind === "ptr" && s.init && s.ref !== null && !reached.has(s.ref)) {
          reached.add(s.ref);
          visit(objs.get(s.ref)!);
        }
      };
      for (const id of stackOrder) visit(objs.get(id)!);
      const toView = (o: Obj): MemObjView => ({
        id: o.id,
        label: o.label,
        type: o.type,
        heap: o.heap,
        addr: addrOf(o),
        kind: o.kind,
        slot: o.slot && view(o.slot),
        fields: o.fields?.map((f) => ({ name: f.name, slot: view(f.slot) })),
        cells: o.cells?.map(view),
        leaked: o.heap && !reached.has(o.id) ? true : undefined,
      });
      return {
        stack: stackOrder.map((id) => toView(objs.get(id)!)),
        heap: [...objs.values()].filter((o) => o.heap).map(toView),
        output,
      };
    },
  };
}

export type Machine = ReturnType<typeof createMachine>;
