import type { LinkedListOp, LinkedListSpec } from "../engine/linkedList";

export interface LinkedListExample {
  id: string;
  label: string;
  spec: LinkedListSpec;
  tip?: string;
}

/** Code chuẩn: addHead/addTail/timGiaTri/timNodeKeCuoi khớp `list.cpp` của thầy; removeXxx là kiến thức chuẩn (không có trong file nguồn). Nguồn: `.claude/skills/ctdl-content/reference/solutions/list_stack_queue.cpp`. */
export const LINKED_LIST_CODE = `struct Node { int data; Node* pNext; };
struct List { Node* pHead; Node* pTail; };

void addHead(List& l, Node* p)
{
    if (l.pHead == nullptr) { l.pHead = l.pTail = p; }
    else                    { p->pNext = l.pHead; l.pHead = p; }
}

void addTail(List& l, Node* p)
{
    if (l.pHead == nullptr) { l.pHead = l.pTail = p; }
    else                    { l.pTail->pNext = p; l.pTail = p; }
}

bool timGiaTri(List l, int value)
{
    for (Node* p = l.pHead; p != nullptr; p = p->pNext)
        if (p->data == value) return true;
    return false;
}

// Node kế cuối: loại rỗng / 1 node TRƯỚC khi viết p->pNext->pNext
bool timNodeKeCuoi(List l, int& value)
{
    if (l.pHead == nullptr || l.pHead == l.pTail) return false;
    Node* p = l.pHead;
    while (p->pNext->pNext != nullptr) p = p->pNext;
    value = p->data;
    return true;
}

// ---- kiến thức chuẩn (không có trong file nguồn): xóa cần prev, nhớ cập nhật pTail/pHead ----
bool removeValue(List& l, int v)
{
    Node* prev = nullptr;
    for (Node* p = l.pHead; p != nullptr; prev = p, p = p->pNext)
    {
        if (p->data != v) continue;
        if (prev == nullptr) { l.pHead = p->pNext; if (l.pHead == nullptr) l.pTail = nullptr; }
        else { prev->pNext = p->pNext; if (p == l.pTail) l.pTail = prev; }
        delete p;
        return true;
    }
    return false;
}`;

// loadData của `list.cpp`: addHead(10), addHead(79), addTail(39), addHead(26), addTail(88) ⇒ 26 79 10 39 88
const BUILD: LinkedListOp[] = [
  { op: "addHead", value: 10, brief: true },
  { op: "addHead", value: 79, brief: true },
  { op: "addTail", value: 39, brief: true },
  { op: "addHead", value: 26, brief: true },
  { op: "addTail", value: 88, brief: true },
];

/**
 * 3 ví dụ từ `list.cpp` của thầy (loadData, timGiaTri 39 & 100, timNodeKeCuoi) + 1 ví dụ MINH HỌA tự tạo
 * (xóa node — kiến thức chuẩn, KHÔNG phải đề thật). Dữ liệu mẫu ở các ví dụ tìm kiếm dựng nhanh bằng `brief`.
 */
export const LINKED_LIST_EXAMPLES: LinkedListExample[] = [
  {
    id: "list-cpp-load",
    label: "list.cpp — loadData: addHead 10, 79 · addTail 39 · addHead 26 · addTail 88",
    spec: {
      ops: [
        { op: "addHead", value: 10, brief: true },
        { op: "addHead", value: 79 },
        { op: "addTail", value: 39 },
        { op: "addHead", value: 26, brief: true },
        { op: "addTail", value: 88, brief: true },
      ],
    },
    tip: "addHead sửa pHead, addTail sửa pTail; danh sách rỗng thì cả hai cùng trỏ node mới. Kiểm rỗng bằng pHead == NULL (bốc 1 trong 2 con trỏ, hoặc kiểm cả 2 — thầy chấp nhận cả hai).",
  },
  {
    id: "list-cpp-find",
    label: "list.cpp — timGiaTri: tìm 39 (có) và 100 (không có)",
    spec: { ops: [...BUILD, { op: "find", value: 39 }, { op: "find", value: 100 }] },
    tip: "timGiaTri trả bool; timDiaChiGiaTri dùng cùng vòng lặp nhưng trả Node* (nullptr nếu không có).",
  },
  {
    id: "list-cpp-kecuoi",
    label: "list.cpp — timNodeKeCuoi (node kế cuối)",
    spec: { ops: [...BUILD, { op: "nodeKeCuoi" }] },
    tip: "Loại danh sách rỗng / chỉ 1 node TRƯỚC khi viết p->pNext->pNext — nếu không sẽ giải tham chiếu NULL. Dừng khi sau p chỉ còn đúng 1 node.",
  },
  {
    id: "minhhoa-remove",
    label: "Minh họa (kiến thức chuẩn) — xóa node giữa, node cuối, node đầu",
    spec: { ops: [...BUILD, { op: "removeValue", value: 10 }, { op: "removeTail" }, { op: "removeHead" }] },
    tip: "Ví dụ tự tạo, không có trong file nguồn. Xóa node giữa BẮT BUỘC cần prev (prev->pNext = p->pNext); xóa node cuối phải lùi pTail; xóa node đầu phải dời pHead (và pTail = NULL nếu rỗng).",
  },
];
