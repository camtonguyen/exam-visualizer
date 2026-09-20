// Kiểm tra engine CTDL (tìm kiếm, sắp xếp, Stack, Queue, DSLK đơn/đôi, bảng băm, bộ nhớ/con trỏ, cây BST, chấm đề thi thử): `node src/subjects/ctdl/engine/check.mjs` (Node ≥ 22.18 chạy thẳng .ts).
// Đáp án đối chiếu = trace đã xác minh bằng C++ (.claude/skills/ctdl-content/reference/solutions/algos_trace.cpp) + đề thật.
import { runSearch } from "./searching.ts";
import { runSort } from "./sorting.ts";
import { runStack } from "./stack.ts";
import { runQueue } from "./queue.ts";
import { STACK_EXAMPLES } from "../data/stackExamples.ts";
import { QUEUE_EXAMPLES } from "../data/queueExamples.ts";
import { runLinkedList } from "./linkedList.ts";
import { runDoublyLinkedList } from "./doublyLinkedList.ts";
import { LINKED_LIST_EXAMPLES } from "../data/linkedListExamples.ts";
import { DOUBLY_LIST_EXAMPLES } from "../data/doublyLinkedListExamples.ts";
import { runHashtable, hashFun } from "./hashtable.ts";
import { HASHTABLE_EXAMPLES } from "../data/hashtableExamples.ts";
import { runMemory } from "./memoryTrace.ts";
import { createMachine, CrashError, cppNum } from "./memoryMachine.ts";
import { POINTER_EXAMPLES } from "../data/pointersExamples.ts";
import { runBst } from "./bst.ts";
import { BST_EXAMPLES } from "../data/bstExamples.ts";
import { MOCK_EXAMS } from "../data/mockExams.ts";
import { normalizeAnswer, fieldCorrect, groupCorrect, scoreFill, scoreRubric, scoreExam } from "./mockExam.ts";
import assert from "node:assert/strict";

const lr = (steps) => steps.filter(s => s.arrayMarkers?.L !== undefined).map(s => { const m = s.arrayMarkers; return [m.L, m.R, m.M ?? m.pos]; });

// Tuyến tính (guide) tìm 66 trong 16 78 50 66 38
let r = runSearch({ algorithm: "linear", array: [16,78,50,66,38], target: 66 });
assert.equal(r.steps.length, 1 + 4); assert.match(r.summary, /vị trí 3 sau 4 bước/);
assert.equal(r.steps[4].title, "Bước i = 3: 66 bằng 66 ⇒ Đã tìm thấy. Kết thúc.");
// Tuyến tính 33 trong dãy chưa sắp xếp (Đề mẫu / guide)
r = runSearch({ algorithm: "linear", array: [90,68,72,32,55,21], target: 33 });
assert.equal(r.steps.length, 1 + 6 + 1); assert.match(r.steps[0].explanation, /CHƯA sắp xếp/); assert.match(r.summary, /Không tìm thấy 33/);
// Nhị phân 56 / 57 (guide)
r = runSearch({ algorithm: "binary", array: [16,23,31,56,62], target: 56 });
assert.deepEqual(lr(r.steps), [[0,4,2],[3,4,3]]);
r = runSearch({ algorithm: "binary", array: [16,23,31,56,62], target: 57 });
assert.deepEqual(lr(r.steps), [[0,4,2],[3,4,3],[4,4,4],[4,3,undefined]]);
assert.equal(r.steps.at(-1).title, "Bước 4: L = 4, R = 3 ⇒ DỪNG vì L phải ≤ R");
// Nhị phân trên dãy GIẢM dần (Luyện tập 005 Câu 3): 88 74 59 58 32 17 tìm 32
r = runSearch({ algorithm: "binary", array: [88,74,59,58,32,17], target: 32, order: "desc" });
assert.deepEqual(lr(r.steps), [[0,5,2],[3,5,4]]); assert.match(r.summary, /vị trí 4 sau 2 bước/);
// Thi thử: 10 15 18 25 27 35 tìm 27
r = runSearch({ algorithm: "binary", array: [10,15,18,25,27,35], target: 27 });
assert.deepEqual(lr(r.steps), [[0,5,2],[3,5,4]]);
// Điều kiện áp dụng: nhị phân trên dãy chưa sắp xếp -> 1 bước cảnh báo
r = runSearch({ algorithm: "binary", array: [90,68,72,32,55,21], target: 33 });
assert.equal(r.steps.length, 1); assert.match(r.summary, /KHÔNG áp dụng được tìm kiếm nhị phân/);
// Nội suy 56 trong 16 23 31 56 62 -> pos 3 ngay bước 1 ; 57 -> không thấy
r = runSearch({ algorithm: "interpolation", array: [16,23,31,56,62], target: 56 });
assert.deepEqual(lr(r.steps), [[0,4,3]]);
r = runSearch({ algorithm: "interpolation", array: [16,23,31,56,62], target: 57 });
assert.match(r.summary, /Không tìm thấy 57/);
r = runSearch({ algorithm: "interpolation", array: [16,23,31,56,62], target: 10 });
assert.equal(r.steps.length, 2);           // ngoài [a[L], a[R]] -> dừng ngay
r = runSearch({ algorithm: "interpolation", array: [5,5,5], target: 5 });   // chia 0 được chặn
assert.match(r.summary, /vị trí 0/);
r = runSearch({ algorithm: "binary", array: [], target: 1 });
assert.match(r.summary, /Không tìm thấy 1/);

// Sắp xếp
const snaps = (r) => r.steps.slice(1).map(s => s.arraySnapshot.join(" "));
r = runSort({ algorithm: "selection", array: [3,2,5,1,4] });
assert.deepEqual(snaps(r), ["1 2 5 3 4","1 2 5 3 4","1 2 3 5 4","1 2 3 4 5"]);
assert.deepEqual(r.steps.slice(1).map(s => s.title.match(/Hoán vị ([\d, ]+)\./)[1]), ["1, 3","2, 2","3, 5","4, 5"]);
r = runSort({ algorithm: "selection", array: [90,68,72,32,55,21] });
assert.deepEqual(snaps(r), ["21 68 72 32 55 90","21 32 72 68 55 90","21 32 55 68 72 90","21 32 55 68 72 90","21 32 55 68 72 90"]);
assert.deepEqual(r.steps.slice(1).map(s => s.title.match(/min = (\d+)/)[1]), ["5","3","4","3","4"]);
assert.equal(r.steps.at(-1).nodeHighlights["5"], "settled");
r = runSort({ algorithm: "selection", array: [3,2,5,1,4] });
assert.ok(Object.values(r.steps.at(-1).nodeHighlights).every(v => v === "settled"));   // bước cuối: cả dãy đã xong
r = runSort({ algorithm: "insertion", array: [79,39,26,66,55,20] });
assert.deepEqual(snaps(r), ["39 79 26 66 55 20","26 39 79 66 55 20","26 39 66 79 55 20","26 39 55 66 79 20","20 26 39 55 66 79"]);
r = runSort({ algorithm: "insertion", array: [11,54,37,69,85,74], order: "desc" });
assert.deepEqual(snaps(r), ["54 11 37 69 85 74","54 37 11 69 85 74","69 54 37 11 85 74","85 69 54 37 11 74","85 74 69 54 37 11"]);
assert.match(r.summary, /85 74 69 54 37 11/);
// Ngẫu nhiên: mọi kết quả phải đúng thứ tự & đủ phần tử, engine không đổi mảng đầu vào
for (let t = 0; t < 300; t++) {
  const a = Array.from({ length: 1 + (t % 9) }, () => Math.floor(Math.random() * 20));
  const copy = [...a];
  for (const algorithm of ["selection", "insertion"]) for (const order of ["asc", "desc"]) {
    const res = runSort({ algorithm, array: a, order });
    const fin = res.steps.at(-1).arraySnapshot;
    const want = [...a].sort((x, y) => order === "asc" ? x - y : y - x);
    assert.deepEqual(fin, want);
  }
  assert.deepEqual(a, copy);
  const sorted = [...a].sort((x, y) => x - y), tgt = Math.floor(Math.random() * 20);
  for (const algorithm of ["linear", "binary", "interpolation"]) {
    const res = runSearch({ algorithm, array: sorted, target: tgt });
    assert.equal(/^Tìm thấy/.test(res.summary), sorted.includes(tgt), `${algorithm} ${sorted} ${tgt}`);
  }
}

// ---------------- Stack / Queue ----------------
// Bất biến của MỌI snapshot: id & ô (row,col) không trùng, next trỏ tới node có thật, con trỏ trỏ node có thật (hoặc NULL).
// Ngoại lệ có chủ đích: con trỏ dangling (id đã delete) — chỉ được xuất hiện ở bước "delete p;" của node cuối trong Queue.
const walk = (snap, name) => { const by = new Map(snap.nodes.map(n => [n.id, n])); const out = []; const seen = new Set();
  for (let id = snap.pointers[name]; id && by.has(id); id = by.get(id).next) { assert.ok(!seen.has(id), "vòng lặp con trỏ"); seen.add(id); out.push(by.get(id).value); } return out; };
function invariants(steps, { allowDangling }) {
  for (const st of steps) { const sn = st.pointerSnapshot; assert.ok(sn, st.title);
    const ids = sn.nodes.map(n => n.id), cells = sn.nodes.map(n => `${n.row},${n.col}`);
    assert.equal(new Set(ids).size, ids.length, "id trùng: " + st.title); assert.equal(new Set(cells).size, cells.length, "ô trùng: " + st.title);
    for (const n of sn.nodes) { assert.ok(n.next === null || ids.includes(n.next) || allowDangling, "next hỏng: " + st.title);
      assert.ok(n.prev === undefined || n.prev === null || ids.includes(n.prev) || allowDangling, "prev hỏng: " + st.title); }
    for (const [k, v] of Object.entries(sn.pointers)) assert.ok(v === null || ids.includes(v) || allowDangling, `con trỏ ${k} hỏng: ` + st.title);
    for (const id of Object.keys(st.nodeHighlights ?? {})) assert.ok(ids.includes(id), "tô node không tồn tại: " + st.title); }
}
for (const ex of STACK_EXAMPLES) invariants(runStack(ex.spec).steps, { allowDangling: false });
for (const ex of QUEUE_EXAMPLES) invariants(runQueue(ex.spec).steps, { allowDangling: true });

// Đề mẫu Phần 2: push 12 -95 78 -89 35 -> pop -> count
let st = runStack(STACK_EXAMPLES.find(e => e.id === "dethimau-p2").spec);
assert.equal(st.summary, "Trạng thái cuối: Top < -89  78  -95  12 > · Thứ tự pop: 35");
assert.ok(st.opLog.includes("count(s) = 4") && st.opLog.includes("push(35) ⇒ Top < 35  -89  78  -95  12 >"));
// Demo thầy: pop 5 lần đến rỗng; đổi 13 -> pop ra 1 1 0 1
st = runStack(STACK_EXAMPLES.find(e => e.id === "demo-thay").spec);
assert.equal(st.summary, "Trạng thái cuối: Top < > · Thứ tự pop: 50 80 79 39 10");
assert.deepEqual(st.steps.at(-1).pointerSnapshot.pointers, { pTop: null });
st = runStack(STACK_EXAMPLES.find(e => e.id === "convert-13").spec);
assert.match(st.summary, /Thứ tự pop: 1 1 0 1$/);
// push chi tiết: 3 bước, bước 1 node p chưa nối (row 1, next NULL), bước 2 p->pNext = đỉnh cũ, bước 3 chuyển pTop
st = runStack({ ops: [{ op: "push", value: 7, brief: true }, { op: "push", value: 9 }] });
const [, , s1, s2, s3] = st.steps.length === 5 ? st.steps : [0, 0, 0, 0, 0];
assert.equal(st.steps.length, 5); assert.equal(s1.pointerSnapshot.nodes.find(n => n.row === 1).next, null);
assert.equal(s2.pointerSnapshot.nodes.find(n => n.row === 1).next, s2.pointerSnapshot.pointers.pTop);
assert.equal(s3.pointerSnapshot.nodes.find(n => n.value === 9).row, 0);
assert.match(runStack({ ops: [{ op: "pop" }] }).steps[1].title, /return false/);

// Queue
let q = runQueue(QUEUE_EXAMPLES.find(e => e.id === "thithu-c10").spec);
assert.equal(q.summary, "Trạng thái cuối: pFront<< 8  3  6 <<pRear · Thứ tự lấy ra: 5");
q = runQueue(QUEUE_EXAMPLES.find(e => e.id === "minhhoa-dangling").spec);
const dq = q.steps.filter(s => s.pointerSnapshot);
const dangling = dq.filter(s => { const p = s.pointerSnapshot.pointers.pRear; return p && !s.pointerSnapshot.nodes.some(n => n.id === p); });
assert.equal(dangling.length, 1); assert.equal(dangling[0].title, "delete p;");        // đúng 1 bước dangling
assert.deepEqual(q.steps.at(-1).pointerSnapshot.pointers, { pFront: null, pRear: null });

// Fuzz Stack/Queue so với mô hình mảng
for (let t = 0; t < 300; t++) {
  const sops = [], qops = [], stackModel = [], queueModel = [];
  for (let i = 0; i < 1 + (t % 12); i++) {
    const v = Math.floor(Math.random() * 100) - 50, brief = Math.random() < 0.4, doPush = Math.random() < 0.6;
    if (doPush) { sops.push({ op: "push", value: v, brief }); qops.push({ op: "enQueue", value: v, brief }); stackModel.unshift(v); queueModel.push(v); }
    else { sops.push({ op: "pop", brief }); qops.push({ op: "deQueue", brief }); stackModel.shift(); queueModel.shift(); }
  }
  const rs = runStack({ ops: sops }), rq = runQueue({ ops: qops });
  invariants(rs.steps, { allowDangling: false }); invariants(rq.steps, { allowDangling: true });
  assert.deepEqual(walk(rs.steps.at(-1).pointerSnapshot, "pTop"), stackModel);
  const lastQ = rq.steps.at(-1).pointerSnapshot;
  assert.deepEqual(walk(lastQ, "pFront"), queueModel);
  const rear = lastQ.pointers.pRear;                  // pRear phải là node cuối của chuỗi, hoặc NULL khi rỗng
  assert.equal(rear === null ? null : lastQ.nodes.find(n => n.id === rear).value, queueModel.length ? queueModel.at(-1) : null);
  assert.equal(rq.summary.split(" · ")[0], `Trạng thái cuối: pFront<< ${queueModel.length ? queueModel.join("  ") : "(rỗng)"} <<pRear`);
}

// ---------------- DSLK đơn / đôi ----------------
// Trạng thái CUỐI mỗi chuỗi thao tác phải nhất quán tuyệt đối: không dangling, đi xuôi từ pHead ra đúng mô hình,
// pTail là node cuối (hoặc NULL khi rỗng); DSLK đôi thì next/prev đối xứng và đi ngược từ pTail ra đúng đảo ngược.
function finalConsistent(snap, model, doubly) {
  const by = new Map(snap.nodes.map(n => [n.id, n]));
  for (const n of snap.nodes) { assert.ok(n.next === null || by.has(n.next), "next dangling ở cuối"); if (doubly) assert.ok(n.prev === null || by.has(n.prev), "prev dangling ở cuối"); }
  for (const [k, v] of Object.entries(snap.pointers)) if (k === "pHead" || k === "pTail") assert.ok(v === null || by.has(v), `${k} dangling ở cuối`);
  assert.deepEqual(walk(snap, "pHead"), model);
  const tailId = snap.pointers.pTail;
  assert.equal(tailId === null ? null : by.get(tailId).value, model.length ? model.at(-1) : null);
  assert.equal(snap.pointers.pHead === null, model.length === 0);
  if (doubly) {
    const back = []; for (let id = tailId; id; id = by.get(id).prev) back.push(by.get(id).value);
    assert.deepEqual(back, [...model].reverse());
    for (const n of snap.nodes) { if (n.next) assert.equal(by.get(n.next).prev, n.id); if (n.prev) assert.equal(by.get(n.prev).next, n.id); }
    assert.equal(by.get(snap.pointers.pHead)?.prev ?? null, null); assert.equal(by.get(tailId)?.next ?? null, null);
  }
}
for (const ex of LINKED_LIST_EXAMPLES) { const r = runLinkedList(ex.spec); invariants(r.steps, { allowDangling: true }); finalConsistent(r.steps.at(-1).pointerSnapshot, r.summary.match(/\d+/g)?.map(Number) ?? [], false); }
for (const ex of DOUBLY_LIST_EXAMPLES) { const r = runDoublyLinkedList(ex.spec); invariants(r.steps, { allowDangling: true }); finalConsistent(r.steps.at(-1).pointerSnapshot, r.summary.match(/\d+/g)?.map(Number) ?? [], true); }

// list.cpp: loadData ⇒ 26 79 10 39 88 ; timGiaTri ; timNodeKeCuoi ; xóa
const L = (id) => runLinkedList(LINKED_LIST_EXAMPLES.find(e => e.id === id).spec);
assert.equal(L("list-cpp-load").summary, "Trạng thái cuối: pHead → 26 → 79 → 10 → 39 → 88 → NULL");
assert.ok(L("list-cpp-find").opLog.includes("timGiaTri(39) ⇒ true") && L("list-cpp-find").opLog.includes("timGiaTri(100) ⇒ false"));
assert.ok(L("list-cpp-kecuoi").opLog.includes("timNodeKeCuoi() ⇒ 39"));
const rm = L("minhhoa-remove");
assert.deepEqual(rm.opLog.slice(-3), ["removeValue(10) ⇒ pHead → 26 → 79 → 39 → 88 → NULL", "removeTail() ⇒ pHead → 26 → 79 → 39 → NULL", "removeHead() ⇒ pHead → 79 → 39 → NULL"]);
// removeTail: sau "delete l.pTail;" pTail và prev->pNext dangling; cuối thao tác thì sạch
const del = rm.steps.find(s => s.title === "delete l.pTail;").pointerSnapshot, ids = del.nodes.map(n => n.id);
assert.ok(!ids.includes(del.pointers.pTail) && del.nodes.some(n => n.next && !ids.includes(n.next)));
// xóa node cuối cùng: pTail dangling đúng 1 bước rồi NULL
const one = runLinkedList({ ops: [{ op: "addHead", value: 5, brief: true }, { op: "removeHead" }] });
const dg = one.steps.filter(s => { const sn = s.pointerSnapshot; return sn.pointers.pTail && !sn.nodes.some(n => n.id === sn.pointers.pTail); });
assert.equal(dg.length, 1); assert.equal(dg[0].title, "delete p;"); assert.deepEqual(one.steps.at(-1).pointerSnapshot.pointers, { pHead: null, pTail: null });
assert.match(runLinkedList({ ops: [{ op: "nodeKeCuoi" }] }).steps[1].title, /return false/);
assert.match(runLinkedList({ ops: [{ op: "addHead", value: 1, brief: true }, { op: "nodeKeCuoi" }] }).steps[2].title, /return false/);

// QLSV_List2: addTail 123 124 125, addHead 100, printList
const D = (id) => runDoublyLinkedList(DOUBLY_LIST_EXAMPLES.find(e => e.id === id).spec);
const q2 = D("qlsv-list2");
assert.equal(q2.summary, "Trạng thái cuối: NULL ⇄ 100 ⇄ 123 ⇄ 124 ⇄ 125 ⇄ NULL");
assert.equal(q2.opLog.at(-1), "printList() ⇒ xuôi: 100 123 124 125 | ngược: 125 124 123 100");
// addHead chi tiết trên DSLK đôi: bước "p->pNext" chưa có "pPre" ngược, bước sau mới có (đúng 2 bước riêng cho 2 chiều)
const ah = runDoublyLinkedList({ ops: [{ op: "addTail", value: 2, brief: true }, { op: "addHead", value: 1 }] }).steps;
const at = (t) => ah.find(s => s.title === t).pointerSnapshot;
const headOf = (sn) => sn.nodes.find(n => n.value === 2), newOf = (sn) => sn.nodes.find(n => n.value === 1);
assert.equal(headOf(at("p->pNext = l.pHead;")).prev, null); assert.equal(newOf(at("p->pNext = l.pHead;")).next, headOf(at("p->pNext = l.pHead;")).id);
assert.equal(headOf(at("l.pHead->pPre = p;")).prev, newOf(at("l.pHead->pPre = p;")).id);
assert.equal(D("minhhoa-remove").summary, "Trạng thái cuối: NULL ⇄ 2 ⇄ NULL");

// Fuzz DSLK đơn/đôi so với mô hình mảng
for (let t = 0; t < 400; t++) {
  const sops = [], dops = [], m = [], sLog = [];
  for (let i = 0; i < 1 + (t % 14); i++) {
    const v = Math.floor(Math.random() * 6), brief = Math.random() < 0.4, r = Math.random();
    if (r < 0.25) { sops.push({ op: "addHead", value: v, brief }); dops.push({ op: "addHead", value: v, brief }); m.unshift(v); sLog.push(null); }
    else if (r < 0.5) { sops.push({ op: "addTail", value: v, brief }); dops.push({ op: "addTail", value: v, brief }); m.push(v); sLog.push(null); }
    else if (r < 0.62) { sops.push({ op: "removeHead", brief }); dops.push({ op: "print" }); m.shift(); sLog.push(null); }
    else if (r < 0.74) { sops.push({ op: "removeTail" }); dops.push({ op: "print" }); m.pop(); sLog.push(null); }
    else if (r < 0.86) { sops.push({ op: "removeValue", value: v }); dops.push({ op: "removeValue", value: v }); const k = m.indexOf(v); if (k >= 0) m.splice(k, 1); sLog.push(null); }
    else if (r < 0.93) { sops.push({ op: "find", value: v }); dops.push({ op: "print" }); sLog.push(`timGiaTri(${v}) ⇒ ${m.includes(v)}`); }
    else { sops.push({ op: "nodeKeCuoi" }); dops.push({ op: "print" }); sLog.push(`timNodeKeCuoi() ⇒ ${m.length >= 2 ? m.at(-2) : false}`); }
  }
  const rs = runLinkedList({ ops: sops });
  invariants(rs.steps, { allowDangling: true }); finalConsistent(rs.steps.at(-1).pointerSnapshot, m, false);
  rs.opLog.forEach((line, i) => { if (sLog[i]) assert.equal(line, sLog[i]); });
}
// DSLK đôi: chỉ addHead/addTail/removeValue/print — mô hình riêng
for (let t = 0; t < 400; t++) {
  const ops = [], m = [];
  for (let i = 0; i < 1 + (t % 14); i++) {
    const v = Math.floor(Math.random() * 6), brief = Math.random() < 0.4, r = Math.random();
    if (r < 0.35) { ops.push({ op: "addHead", value: v, brief }); m.unshift(v); }
    else if (r < 0.7) { ops.push({ op: "addTail", value: v, brief }); m.push(v); }
    else if (r < 0.9) { ops.push({ op: "removeValue", value: v }); const k = m.indexOf(v); if (k >= 0) m.splice(k, 1); }
    else ops.push({ op: "print" });
  }
  const rd = runDoublyLinkedList({ ops });
  invariants(rd.steps, { allowDangling: true }); finalConsistent(rd.steps.at(-1).pointerSnapshot, m, true);
}

// ---------------- Bảng băm ----------------
function hashInvariants(steps, size) {
  for (const st of steps) { const h = st.hashSnapshot; assert.ok(h, st.title); assert.equal(h.size, size); assert.equal(h.buckets.length, size);
    const ids = [...h.buckets.flat().map(n => n.id), ...(h.pending ? [h.pending.node.id] : [])];
    assert.equal(new Set(ids).size, ids.length, "id trùng: " + st.title);
    if (h.pending) assert.ok(h.pending.bucket >= 0 && h.pending.bucket < size);
    for (const id of Object.values(h.labels ?? {})) assert.ok(ids.includes(id), "nhãn trỏ node không tồn tại: " + st.title);
    for (const k of Object.keys(st.nodeHighlights ?? {})) assert.ok(ids.includes(k) || (/^b\d+$/.test(k) && +k.slice(1) < size), "tô không tồn tại: " + st.title + " " + k); }
}
const HT = (id) => runHashtable(HASHTABLE_EXAMPLES.find(e => e.id === id).spec);
for (const ex of HASHTABLE_EXAMPLES) hashInvariants(runHashtable(ex.spec).steps, ex.spec.size);
const bucketOf = (r, i) => r.table[i].replace(/^Bucket\[\d+\]:\s*/, "");
let ht = HT("static-h");   // hashtable_static.cpp: 50 73 35 36 64 28 90 21 53 13
assert.deepEqual([0, 1, 3, 4, 5, 6, 8].map(i => bucketOf(ht, i)), ["50  90", "21", "73  53  13", "64", "35", "36", "28"]);
assert.equal(bucketOf(ht, 2) + bucketOf(ht, 7) + bucketOf(ht, 9), "");
ht = HT("static-h2"); assert.equal(bucketOf(ht, 7), "17  27  37  7  97"); assert.equal(bucketOf(ht, 2), "12  22");
ht = HT("dynamic-7"); assert.deepEqual([0, 1, 3].map(i => bucketOf(ht, i)), ["14  21", "8  15  22", "10  17  3"]);   // khớp chú thích trong hashtable_dynamic.cpp
ht = HT("dynamic-5"); assert.deepEqual([0, 1, 2, 4].map(i => bucketOf(ht, i)), ["10  25", "11  16  21", "12  17", "14  19"]);
ht = HT("test03-9");  // Test03: SIZE = 9, dữ liệu Câu 10 — bảng băm GIỮ giá trị trùng
assert.deepEqual([0, 1, 3, 5, 6, 7].map(i => bucketOf(ht, i)), ["90  90", "10", "75  30  30", "50", "60", "25  70  70"]);
assert.match(ht.summary, /11 giá trị/);
ht = HT("find-x"); assert.deepEqual(ht.opLog.slice(-3), ["find(53):  bucket[3] ⇒ true", "find(44):  bucket[4] ⇒ false", "find(7):  bucket[7] ⇒ false"]);
assert.equal(hashFun(-1, 9), 8); assert.equal(hashFun(50, 10), 0);
// add chi tiết: bucket rỗng = 3 bước; đụng độ = 4 bước; node p chỉ nằm ở `pending` (chưa trong bucket) tới khi nối
const twoAdds = runHashtable({ size: 10, ops: [{ op: "add", value: 50 }, { op: "add", value: 90 }] });
assert.equal(twoAdds.steps.length, 1 + 3 + 4);
const pend = twoAdds.steps.filter(s => s.hashSnapshot.pending);
assert.equal(pend.length, 2); assert.ok(pend.every(s => !s.hashSnapshot.buckets.flat().some(n => n.id === s.hashSnapshot.pending.node.id)));
assert.deepEqual(twoAdds.steps.at(-1).hashSnapshot.labels && Object.keys(twoAdds.steps.at(-1).hashSnapshot.labels), ["pHead", "pTail"]);
const tailBefore = twoAdds.steps.find(s => s.title === "bucket[0].pTail->pNext = p;").hashSnapshot, tailAfter = twoAdds.steps.at(-1).hashSnapshot;
assert.notEqual(tailBefore.labels.pTail, tailAfter.labels.pTail); assert.equal(tailAfter.labels.pTail, tailAfter.buckets[0].at(-1).id);
// Fuzz so với mô hình mảng (kể cả số âm, size 1..12)
for (let t = 0; t < 400; t++) {
  const size = 1 + (t % 12), model = Array.from({ length: size }, () => []), ops = [], finds = [];
  for (let i = 0; i < 1 + (t % 15); i++) {
    const v = Math.floor(Math.random() * 40) - 10;
    if (Math.random() < 0.7) { ops.push({ op: "add", value: v, brief: Math.random() < 0.5 }); model[((v % size) + size) % size].push(v); }
    else { ops.push({ op: "find", value: v }); finds.push(`find(${v}):  bucket[${((v % size) + size) % size}] ⇒ ${model[((v % size) + size) % size].includes(v)}`); }
  }
  const r = runHashtable({ size, ops });
  hashInvariants(r.steps, size);
  assert.deepEqual(r.table, model.map((b, i) => `Bucket[${i}]:   ${b.join("  ")}`.trimEnd()));
  assert.deepEqual(r.opLog.filter(l => l.startsWith("find")), finds);
  assert.deepEqual(r.steps.at(-1).hashSnapshot.buckets.map(b => b.map(n => n.value)), model);
}

// ---------------- Con trỏ / bộ nhớ (đọc code ghi kết quả) ----------------
// Mỗi ví dụ: kết quả máy tính ra == đáp án ĐÃ CHẠY THẬT bằng C++ (clang++), và mọi con trỏ trong mọi ảnh chụp trỏ vào đối tượng có thật.
const MEM = (id) => runMemory(POINTER_EXAMPLES.find(e => e.id === id).program);
for (const ex of POINTER_EXAMPLES) {
  const r = runMemory(ex.program);
  if ("crash" in ex.expected) { assert.ok(r.crashed, ex.id + ": phải lỗi runtime"); assert.equal(r.steps.at(-1).memorySnapshot.crashed, r.crashed); }
  else { assert.equal(r.crashed, undefined, ex.id); assert.equal(r.output, ex.expected.output, ex.id); }
  assert.equal(r.steps.length, ex.program.lines.length + 1 - ("crash" in ex.expected ? 0 : 0));
  for (const st of r.steps) { const sn = st.memorySnapshot, all = [...sn.stack, ...sn.heap], ids = new Set(all.map(o => o.id));
    assert.ok(st.codeLine >= ex.program.preamble.length && st.codeLine <= ex.program.preamble.length + ex.program.lines.length, "codeLine");
    const slots = all.flatMap(o => [o.slot, ...(o.fields ?? []).map(f => f.slot), ...(o.cells ?? [])]).filter(Boolean);
    for (const sl of slots) assert.ok(!sl.target || ids.has(sl.target), ex.id + ": con trỏ trỏ vào ô không có");
    const keys = new Set(all.flatMap(o => [o.id, ...(o.fields ?? []).map(f => `${o.id}.${f.name}`), ...(o.cells ?? []).map((_, i) => `${o.id}[${i}]`)]));
    for (const k of sn.changed) assert.ok(keys.has(k), ex.id + ": changed lạ " + k); }
}
assert.match(MEM("dm-c4").crashed, /segmentation fault.*l\.tail = NULL/);
assert.equal(MEM("dm-c4").output, "");                                   // sập trước khi in gì
// hd-2: b, p chưa khởi tạo ("?") rồi (*p)++ trả giá trị CŨ
const hd2 = MEM("hd-2");
assert.deepEqual(hd2.steps[1].memorySnapshot.stack.map(o => o.slot.text), ["102", "?", "?"]);
assert.deepEqual(hd2.steps[3].memorySnapshot.stack.map(o => o.slot.text), ["103", "102", ""]);   // a = 103, b = 102, p = mũi tên
assert.equal(hd2.steps[3].memorySnapshot.stack[2].slot.target, "v:a");
// lt-c5: vùng new float(0.4) rò rỉ đúng từ lúc p = &a
const c5 = MEM("lt-c5").steps.map(st => st.memorySnapshot.heap.map(o => !!o.leaked));
assert.deepEqual(c5, [[], [], [false], [true], [true], [true], [true]]);
// lt-c8: 1 node duy nhất, p / pFront / pRear cùng trỏ vào nó
const c8 = MEM("lt-c8").steps.at(-1).memorySnapshot;
assert.equal(c8.heap.length, 1); assert.deepEqual([c8.stack[0].slot.target, ...c8.stack[1].fields.map(f => f.slot.target)], ["h1", "h1", "h1"]);
assert.deepEqual(MEM("lt-c8").steps[2].memorySnapshot.stack[1].fields.map(f => f.slot.text), ["?", "?"]);   // Queue q; chưa khởi tạo
// lt-c7: Top chưa bao giờ đổi; không node nào rò rỉ
const c7 = MEM("lt-c7").steps; assert.equal(c7.at(-1).memorySnapshot.stack[0].fields[0].slot.target, "h1"); assert.ok(c7.every(st => st.memorySnapshot.heap.every(o => !o.leaked)));
// lt-c10: pLeft và pRight cùng trỏ 1 node
const c10 = MEM("lt-c10").steps.at(-1).memorySnapshot.heap; assert.equal(c10.length, 2); assert.equal(c10[0].fields[1].slot.target, c10[0].fields[2].slot.target);
// bộ phân giải biểu thức + lỗi runtime
{
  const m = createMachine();
  m.declareArray("a", "int", [1, 3, 5]); m.declarePtr("q", "int*"); m.declarePtr("h", "double*", m.newArray("double", 2));
  m.declareStruct("s", "S", { next: null });
  assert.equal(m.num("*(a+2)"), 5); assert.equal(m.num("a[1]"), 3);
  assert.throws(() => m.read("a[3]"), (e) => e instanceof CrashError && /NGOÀI mảng/.test(e.message));
  assert.throws(() => m.read("*q"), (e) => e instanceof CrashError && /CHƯA khởi tạo/.test(e.message));
  assert.throws(() => m.read("s.next->x"), (e) => e instanceof CrashError && /NULL/.test(e.message));
  assert.equal(m.read("h[0]"), "?"); m.assign("h[1]", 2.5); assert.equal(m.read("*(h+1)"), "2.5");
  assert.equal(m.postInc("a[0]"), 1); assert.equal(m.num("a[0]"), 2);
  assert.equal(cppNum(5.6), "5.6"); assert.equal(cppNum(0.1 + 0.2), "0.3"); assert.equal(cppNum(13), "13");
}

// ---------------- Cây nhị phân tìm kiếm ----------------
// Bất biến của MỌI ảnh chụp: id không trùng, con trỏ trái/phải trỏ node có thật, mọi node đúng 1 lần từ gốc (không vòng, không mồ côi),
// trung tố TĂNG NGẶT (tính chất BST), nhãn/tô chỉ trỏ vào node có thật (hoặc node đang chờ chèn).
function treeInvariants(steps) {
  for (const st of steps) { const t = st.treeSnapshot; assert.ok(t, st.title);
    const by = new Map(t.nodes.map(n => [n.id, n])); assert.equal(by.size, t.nodes.length, "id trùng: " + st.title);
    const seen = [], visit = (id) => { if (id === null) return; assert.ok(by.has(id), "con trỏ hỏng: " + st.title); assert.ok(!seen.includes(id), "vòng/2 cha: " + st.title); seen.push(id); visit(by.get(id).left); visit(by.get(id).right); };
    visit(t.root); assert.equal(seen.length, t.nodes.length, "node mồ côi: " + st.title);
    const inord = []; const io = (id) => { if (id === null) return; io(by.get(id).left); inord.push(by.get(id).value); io(by.get(id).right); }; io(t.root);
    for (let i = 1; i < inord.length; i++) assert.ok(inord[i - 1] < inord[i], "vi phạm BST: " + st.title);
    const valid = new Set([...by.keys(), ...(t.pending ? [t.pending.id] : [])]); if (t.pending) assert.ok(!by.has(t.pending.id), "pending đã trong cây");
    for (const v of Object.values(t.labels ?? {})) assert.ok(v === null || valid.has(v), "nhãn hỏng: " + st.title);
    for (const k of Object.keys(st.nodeHighlights ?? {})) assert.ok(valid.has(k), "tô node không có: " + st.title); }
}
// Cài đặt THAM CHIẾU độc lập (mảng đối tượng, đệ quy) để đối chiếu.
const refTree = () => {
  let root = null;
  const path = (v) => { const p = []; for (let n = root; n; n = v < n.v ? n.l : n.r) { p.push(n.v); if (n.v === v) break; } return p; };
  const has = (v) => path(v).includes(v);
  const insert = (v) => { if (has(v)) return; const n = { v, l: null, r: null }; if (!root) { root = n; return; } let c = root; for (;;) { const k = v < c.v ? "l" : "r"; if (!c[k]) { c[k] = n; return; } c = c[k]; } };
  const nlr = (n = root) => (n ? [n.v, ...nlr(n.l), ...nlr(n.r)] : []);
  const lnr = (n = root) => (n ? [...lnr(n.l), n.v, ...lnr(n.r)] : []);
  const lrn = (n = root) => (n ? [...lrn(n.l), ...lrn(n.r), n.v] : []);
  const paren = (n = root) => (!n ? "" : !n.l && !n.r ? `${n.v}` : `${n.v}(${paren(n.l)},${paren(n.r)})`);
  return { path, has, insert, nlr, lnr, lrn, paren, isEmpty: () => root === null };
};
for (const ex of BST_EXAMPLES) treeInvariants(runBst(ex.spec).steps);
const B = (id) => runBst(BST_EXAMPLES.find(e => e.id === id).spec);
let bt = B("demo-tree-v1");    // demo_tree_v1.cpp
assert.equal(bt.tree, "50(26,73(66(61,),88))");
assert.ok(bt.opLog.includes("LNR không đệ quy:  26  50  61  66  73  88")); assert.equal(bt.opLog.at(-1), "search(88):  đường đi 50 → 73 → 88  ⇒ true");
assert.equal(Math.max(...bt.steps.map(s => s.treeSnapshot.stack?.length ?? 0)), 3);   // [50,26] rồi (50 đã pop) [73,66,61]: stack chỉ giữ tổ tiên chưa xử lý
bt = B("test01-demo");        // Test01 Câu 10: 11 giá trị có 3 trùng ⇒ 8 node
assert.equal(bt.tree, "50(25(10,30),75(70(60,),90))");
for (const l of ["NLR:  50  25  10  30  75  70  60  90", "LRN:  10  30  25  60  70  90  75  50", "LNR:  10  25  30  50  60  70  75  90", "demNode = 8"]) assert.ok(bt.opLog.includes(l), l);
assert.equal(bt.opLog.filter(l => l.endsWith("trùng, bỏ qua")).length, 3);
assert.ok(bt.steps.some(s => s.title === "30 == 30 ⇒ return false   (trùng, bỏ qua)"));
const ins60 = bt.steps.map((s, i) => [s, i]).filter(([s]) => s.title === "Node* p = initNode(60);")[0][1];      // p chỉ ở `pending` tới khi nối
assert.ok(bt.steps[ins60].treeSnapshot.pending && !bt.steps[ins60].treeSnapshot.nodes.some(n => n.value === 60));
assert.equal(bt.steps[ins60 + 1].title, "pLoca->pLeft = p;"); assert.ok(!bt.steps[ins60 + 1].treeSnapshot.pending && bt.steps[ins60 + 1].treeSnapshot.nodes.some(n => n.value === 60));
bt = B("search-x"); assert.deepEqual(bt.opLog.slice(-2), ["search(60):  đường đi 50 → 75 → 70 → 60  ⇒ true", "search(65):  đường đi 50 → 75 → 70 → 60  ⇒ false"]);
assert.ok(B("thithu-q10").opLog.includes("LNR:  10  25  30  50  75  90"));
// Fuzz: thao tác ngẫu nhiên (có trùng, tìm, duyệt, đếm, LNR bằng stack) so với cài đặt tham chiếu
for (let t = 0; t < 400; t++) {
  const ref = refTree(), ops = [], expect = [];
  for (let i = 0; i < 2 + (t % 16); i++) {
    const v = Math.floor(Math.random() * 25), r = Math.random();
    if (r < 0.6) { ops.push({ op: "insert", value: v, brief: Math.random() < 0.5 }); ref.insert(v); }
    else if (r < 0.75) { const pth = ref.path(v); ops.push({ op: "search", value: v }); expect.push(`search(${v}):  đường đi ${pth.join(" → ") || "(cây rỗng)"}  ⇒ ${pth.includes(v)}`); }
    else if (r < 0.85) { const o = ["NLR", "LNR", "LRN"][Math.floor(Math.random() * 3)]; ops.push({ op: "traverse", order: o }); expect.push(`${o}:  ${ref[o.toLowerCase()]().join("  ")}`); }
    else if (r < 0.95) { ops.push({ op: "traverseStack" }); expect.push(`LNR không đệ quy:  ${ref.lnr().join("  ")}`); }
    else { ops.push({ op: "count" }); expect.push(`demNode = ${ref.lnr().length}`); }
  }
  const r = runBst({ ops }); treeInvariants(r.steps);
  assert.equal(r.tree, ref.isEmpty() ? "(rỗng)" : ref.paren());
  assert.deepEqual(r.opLog.filter(l => !l.startsWith("insert")), expect);
}

// ---------------- Đề thi thử tự chấm ----------------
const ME = (e, q) => MOCK_EXAMS.find(x => x.id === e).questions.find(x => x.id === q);
// Cấu trúc: 3 đề × 14 câu; mỗi đề đúng 10 điểm (Phần I 3 = 6×0.5, Phần II 4 = 4×1, Phần III 3 = 4×0.75), điểm cộng KHÔNG tính vào tổng.
assert.equal(MOCK_EXAMS.length, 3);
for (const ex of MOCK_EXAMS) {
  assert.equal(ex.questions.length, 14); const sumPart = (n) => ex.questions.filter(q => q.part === n).reduce((s, q) => s + q.points, 0);
  assert.deepEqual([sumPart(1), sumPart(2), sumPart(3)], [3, 4, 3], ex.id);
  for (const q of ex.questions) {
    const inner = q.type === "rubric" ? q.parts.filter(p => !p.bonus).reduce((s, p) => s + p.points, 0) : q.groups.reduce((s, g) => s + g.points, 0);
    assert.ok(Math.abs(inner - q.points) < 1e-9, `${ex.id}/${q.id}: điểm ý (${inner}) ≠ điểm câu (${q.points})`);
  }
}
// Đối chiếu ĐÁP ÁN các câu điền của artifact với engine đã kiểm chứng (nếu artifact sai, đây là chỗ lộ ra).
const accepted = (q, g, f = 0) => q.groups[g].fields[f].accepted;
{ // Đề 1 Q9 chọn trực tiếp 90 68 72 32 55 21: giá trị nhỏ nhất mỗi vòng
  const mins = runSort({ algorithm: "selection", array: [90, 68, 72, 32, 55, 21] }).steps.slice(1).map(s => s.title.match(/Hoán vị (\d+),/)[1]);
  const q = ME("de1", "q9"); assert.equal(q.groups.length, 5); mins.forEach((m, i) => assert.deepEqual(accepted(q, i), [m], "Đề1 Q9 vòng " + i)); }
{ // Đề 1 Q10 nhị phân tìm 27 / Đề 2 Q8 nhị phân tìm 56: L, R, M từng bước
  const lrm = (arr, t) => runSearch({ algorithm: "binary", array: arr, target: t }).steps.filter(s => s.arrayMarkers).map(s => [s.arrayMarkers.L, s.arrayMarkers.R, s.arrayMarkers.M].map(String));
  for (const [e, qid, arr, t] of [["de1", "q10", [10, 15, 18, 25, 27, 35], 27], ["de2", "q8", [16, 23, 31, 56, 62], 56]]) {
    const want = lrm(arr, t), q = ME(e, qid); assert.equal(q.groups.length, want.length, e + qid);
    want.forEach((w, gi) => w.forEach((x, fi) => assert.deepEqual(accepted(q, gi, fi), [x], `${e}/${qid} bước ${gi + 1}`))); } }
{ // Đề 2 Q9 chèn trực tiếp 79 39 26 66 55 20: trạng thái sau mỗi lần
  const st = runSort({ algorithm: "insertion", array: [79, 39, 26, 66, 55, 20] }).steps.slice(1).map(s => s.arraySnapshot.join(","));
  const q = ME("de2", "q9"); st.forEach((x, i) => assert.deepEqual(accepted(q, i), [x])); }
{ // Đề 2 Q10 Queue: enQ 5 8 3, deQ, enQ 6 => Front→Rear
  const r = runQueue({ ops: [5, 8, 3].map(v => ({ op: "enQueue", value: v, brief: true })).concat([{ op: "deQueue", brief: true }, { op: "enQueue", value: 6, brief: true }]) });
  assert.deepEqual(accepted(ME("de2", "q10"), 0), [r.steps.at(-1).pointerSnapshot.nodes.map(n => n.value).join(",")]); }
{ // Đề 3 Q8 bảng băm x%10, thêm 17 27 37 7 97 12 22: bucket[7] theo thứ tự thêm
  const r = runHashtable({ size: 10, ops: [17, 27, 37, 7, 97, 12, 22].map(v => ({ op: "add", value: v, brief: true })) });
  assert.deepEqual(accepted(ME("de3", "q8"), 0), [r.steps.at(-1).hashSnapshot.buckets[7].map(n => n.value).join(",")]); }
{ // Đề 3 Q9 đổi 13 sang nhị phân bằng Stack: dư 1,0,1,1 (thứ tự push) rồi đọc ra 1101
  const q = ME("de3", "q9"); assert.deepEqual([0, 1, 2, 3].map(i => accepted(q, i)[0]), ["1", "0", "1", "1"]);
  const r = runStack({ ops: [1, 0, 1, 1].map(v => ({ op: "push", value: v, brief: true })).concat([1, 2, 3, 4].map(() => ({ op: "pop", brief: true }))) });
  assert.deepEqual(accepted(q, 4), [r.summary.match(/Thứ tự pop: ([\d ]+)$/)[1].replace(/ /g, "")]); }
{ // Đề 3 Q10 BST thêm 50 75 25 30 10 90 rồi duyệt LNR
  const r = runBst({ ops: [50, 75, 25, 30, 10, 90].map(v => ({ op: "insert", value: v, brief: true })).concat([{ op: "traverse", order: "LNR" }]) });
  assert.deepEqual(accepted(ME("de3", "q10"), 0), [r.opLog.at(-1).replace("LNR:  ", "").split("  ").join(",")]); }
{ // Đề 1 Q8: *a với a[0]=9.3 (chương trình Đề mẫu Câu 6 trên máy bộ nhớ) ; Đề 3 Q7: tinhLuong
  assert.ok(accepted(ME("de1", "q8"), 0, 0).includes(runMemory(POINTER_EXAMPLES.find(e => e.id === "dm-c6").program).output.trim()));
  const luongCB = 4500000; let lhtt = luongCB + 20 * 180000; if (lhtt > 8000000) lhtt += lhtt * 0.05; if (luongCB < 5000000) lhtt += lhtt * 0.10;
  assert.match(ME("de3", "q7").parts[0].body, /9\.355\.500/); assert.equal(Math.round(lhtt), 9355500); }
// Đề 1 Q7 (l.tail->data = lỗi) khớp Đề mẫu Câu 4 trên máy bộ nhớ
assert.match(ME("de1", "q7").parts[0].body, /lỗi runtime/); assert.ok(runMemory(POINTER_EXAMPLES.find(e => e.id === "dm-c4").program).crashed);
// Đề 2 Q7: 9.3 (3 con trỏ cùng 1 node) khớp Luyện tập 005 Câu 8
assert.match(ME("de2", "q7").parts[0].body, /9\.3/); assert.equal(runMemory(POINTER_EXAMPLES.find(e => e.id === "lt-c8").program).output, "9.3");

// Hàm chấm điểm
assert.equal(normalizeAnswer(" 39, 79 ,26 "), "39,79,26"); assert.equal(normalizeAnswer("A b"), "ab");
const f9 = ME("de1", "q8").groups[0].fields[0]; assert.ok(fieldCorrect(f9, " 9,3 ") && fieldCorrect(f9, "9.3") && !fieldCorrect(f9, "9.30") && !fieldCorrect(f9, ""));
const q10 = ME("de1", "q10");                      // mỗi nhóm L, R, M: SAI 1 ô là mất cả nhóm
assert.ok(groupCorrect(q10.groups[0], ["0", "5", "2"])); assert.ok(!groupCorrect(q10.groups[0], ["0", "5", "3"])); assert.ok(!groupCorrect(q10.groups[0], ["0", "5"]));
assert.equal(scoreFill(q10, [["0", "5", "2"], ["3", "5", "4"]]), 1); assert.equal(scoreFill(q10, [["0", "5", "2"], ["3", "5", "5"]]), 0.5); assert.equal(scoreFill(q10, []), 0);
assert.equal(scoreFill(ME("de1", "q9"), [["21"], ["32"], ["x"], ["68"], ["72"]]), 0.8);       // 4/5 nhóm × 0.2
const r11 = ME("de1", "q11");                       // 3 ý × 0.25 + điểm cộng 0.25
assert.deepEqual(scoreRubric(r11, [true, true, true, true]), { earned: 0.75, bonus: 0.25 });   // điểm cộng không vào điểm câu
assert.deepEqual(scoreRubric(r11, [false, false, false, true]), { earned: 0, bonus: 0.25 });
assert.deepEqual(scoreRubric(ME("de1", "q2"), [true, false]), { earned: 0.25, bonus: 0 });
// Trần điểm: các ý tick cộng lại vượt điểm câu thì chỉ tính đúng điểm câu (dữ liệu thật luôn vừa khít nên cần câu tổng hợp)
assert.deepEqual(scoreRubric({ id: "x", part: 1, points: 0.5, star: false, text: "", type: "rubric", parts: [{ label: "a", points: 0.5 }, { label: "b", points: 0.5 }, { label: "c", points: 0.25, bonus: true }] }, [true, true, true]), { earned: 0.5, bonus: 0.25 });
{ const e = MOCK_EXAMS[0], perfect = { checked: {}, answers: {} };   // làm đúng hết ⇒ đúng 10, điểm cộng 4 × 0.25 = 1
  for (const q of e.questions) { if (q.type === "rubric") perfect.checked[q.id] = q.parts.map(() => true); else perfect.answers[q.id] = q.groups.map(g => g.fields.map(f => f.accepted[0])); }
  const sc = scoreExam(e, perfect); assert.equal(sc.total, 10); assert.deepEqual(sc.perPart, { 1: 3, 2: 4, 3: 3 }); assert.equal(sc.bonus, 1);
  const half = scoreExam(e, { checked: {}, answers: {} }); assert.equal(half.total, 0); assert.equal(half.bonus, 0); }
// Cả 3 đề: làm đúng toàn bộ cũng đúng 10 điểm
for (const e of MOCK_EXAMS) { const st = { checked: {}, answers: {} };
  for (const q of e.questions) { if (q.type === "rubric") st.checked[q.id] = q.parts.map(() => true); else st.answers[q.id] = q.groups.map(g => g.fields.map(f => f.accepted[0])); }
  assert.equal(scoreExam(e, st).total, 10, e.id); }

console.log("OK engines");
