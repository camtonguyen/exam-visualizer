import type { DoublyLinkedListSpec } from "../engine/doublyLinkedList";

export interface DoublyLinkedListExample {
  id: string;
  label: string;
  spec: DoublyLinkedListSpec;
  tip?: string;
}

/** Code chuẩn (data là int): addHead/addTail/printList theo cách của `QLSV_List2.cpp`; removeValue là kiến thức chuẩn (không có trong file nguồn). Nguồn: `.claude/skills/ctdl-content/reference/solutions/list_stack_queue.cpp` (namespace dll). */
export const DOUBLY_LIST_CODE = `struct Node { Node* pPre; int data; Node* pNext; };
struct List { Node* pHead; Node* pTail; };

/*Thêm node vào đầu danh sách (cập nhật CẢ 2 chiều)
Input:
    + List& l
    + Node* p
Output:
    + List& l
*/
void addHead(List& l, Node* p)
{
    if (l.pHead == nullptr && l.pTail == nullptr) { l.pHead = l.pTail = p; }
    else
    {
        p->pNext = l.pHead;      // chiều xuôi
        l.pHead->pPre = p;       // chiều ngược — đừng quên
        l.pHead = p;
    }
}

/*Thêm node vào cuối danh sách (cập nhật CẢ 2 chiều)
Input:
    + List& l
    + Node* p
Output:
    + List& l
*/
void addTail(List& l, Node* p)
{
    if (l.pHead == nullptr && l.pTail == nullptr) { l.pHead = l.pTail = p; }
    else
    {
        l.pTail->pNext = p;      // chiều xuôi
        p->pPre = l.pTail;       // chiều ngược — đừng quên
        l.pTail = p;
    }
}

/*In danh sách xuôi (pHead → pTail) và ngược (pTail → pHead)
Input:
    + List l
Output:
    + int data
*/
void printList(List l)
{
    for (Node* p = l.pHead; p != nullptr; p = p->pNext) cout << p->data << " ";   // xuôi
    cout << endl;
    for (Node* p = l.pTail; p != nullptr; p = p->pPre)  cout << p->data << " ";   // ngược
    cout << endl;
}

// ---- kiến thức chuẩn (không có trong file nguồn): nhờ pPre không cần prev riêng ----
/*Xóa node đầu tiên có giá trị v (nhờ pPre không cần prev riêng)
Input:
    + List& l
    + int v
Output:
    + List& l
    + return bool
*/
bool removeValue(List& l, int v)
{
    for (Node* p = l.pHead; p != nullptr; p = p->pNext)
    {
        if (p->data != v) continue;
        if (p->pPre) p->pPre->pNext = p->pNext; else l.pHead = p->pNext;
        if (p->pNext) p->pNext->pPre = p->pPre; else l.pTail = p->pPre;
        delete p;
        return true;
    }
    return false;
}`;

/**
 * 1 ví dụ theo thao tác của `QLSV_List2.cpp` (addTail 123, 124, 125 rồi addHead 100 rồi printList), data là int + 1 ví dụ MINH HỌA tự tạo (xóa node — kiến thức chuẩn, KHÔNG phải đề thật).
 */
export const DOUBLY_LIST_EXAMPLES: DoublyLinkedListExample[] = [
  {
    id: "qlsv-list2",
    label: "Theo QLSV_List2.cpp — addTail 123 124 125 · addHead 100 · printList",
    spec: {
      ops: [
        { op: "addTail", value: 123, brief: true },
        { op: "addTail", value: 124, brief: true },
        { op: "addTail", value: 125 },
        { op: "addHead", value: 100 },
        { op: "print" },
      ],
    },
    tip: "MỖI lệnh nối phải cập nhật cả pNext lẫn pPre — quên 1 chiều là lỗi hay gặp nhất. printList duyệt xuôi từ pHead rồi ngược từ pTail (DSLK đơn không duyệt ngược được).",
  },
  {
    id: "minhhoa-remove",
    label: "Minh họa (kiến thức chuẩn) — xóa node giữa, đầu, cuối",
    spec: {
      ops: [
        { op: "addTail", value: 1, brief: true },
        { op: "addTail", value: 2, brief: true },
        { op: "addTail", value: 3, brief: true },
        { op: "addTail", value: 4, brief: true },
        { op: "removeValue", value: 3 },
        { op: "removeValue", value: 1 },
        { op: "removeValue", value: 4 },
      ],
    },
    tip: "Ví dụ tự tạo, không có trong file nguồn. Nối tắt CẢ 2 chiều (p->pPre->pNext và p->pNext->pPre); p ở đầu/cuối thì thay bằng cập nhật pHead/pTail.",
  },
];
