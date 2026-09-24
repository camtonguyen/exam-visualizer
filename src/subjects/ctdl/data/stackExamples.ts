import type { StackSpec } from "../engine/stack";

export interface StackExample {
  id: string;
  label: string;
  spec: StackSpec;
  tip?: string;
}

/** Code chuẩn (khớp `demo_stackv1.cpp` của thầy + Đề mẫu Phần 2). Nguồn: `.claude/skills/ctdl-content/reference/solutions/list_stack_queue.cpp`. */
export const STACK_CODE = `struct Node  { int data; Node* pNext; };
struct Stack { Node* pTop; };

/*Thêm một phần tử vào stack (push = addHead: 2 dòng, đúng cả khi rỗng)
Input:
    + Stack& s
    + int value
Output:
    + Stack& s
    + return bool
*/
bool push(Stack& s, int value)
{
    Node* p = initNode(value);       // p->pNext = NULL
    if (p == nullptr) return false;  // không cấp phát được
    p->pNext = s.pTop;
    s.pTop = p;
    return true;
}

/*Lấy một phần tử ra khỏi stack (lưu p TRƯỚC khi dời pTop, rồi delete)
Input:
    + Stack& s
    + int& value
Output:
    + Stack& s
    + int& value
    + return bool
*/
bool pop(Stack& s, int& value)
{
    if (s.pTop == nullptr) return false;   // rỗng
    Node* p = s.pTop;
    value = p->data;
    s.pTop = p->pNext;
    delete p;
    return true;
}

/*Đếm số phần tử trong stack
Input:
    + Stack s
Output:
    + return int
*/
int count(Stack s)
{
    int dem = 0;
    for (Node* p = s.pTop; p != nullptr; p = p->pNext) dem++;
    return dem;
}`;

/**
 * 3 ví dụ, đều từ tài liệu thật: Đề mẫu Phần 2 Câu 4 (`12 -95 78 -89 35`, đề gọi thêm hàm lấy ra + đếm),
 * `demo_stackv1.cpp` (push 10,39,79,80,50 rồi pop 5 lần), và đổi 13 sang hệ 2 (`convert10_2`, cũng trong `demo_stackv1.cpp`).
 * Các thao tác lặp nhiều lần để `brief` (1 bước/thao tác); thao tác đáng chú ý chạy từng dòng lệnh.
 */
export const STACK_EXAMPLES: StackExample[] = [
  {
    id: "dethimau-p2",
    label: "Đề mẫu Phần 2 — push 12 −95 78 −89 35, pop, đếm",
    spec: {
      ops: [
        { op: "push", value: 12, brief: true },
        { op: "push", value: -95, brief: true },
        { op: "push", value: 78, brief: true },
        { op: "push", value: -89, brief: true },
        { op: "push", value: 35 },
        { op: "pop" },
        { op: "count" },
      ],
    },
    tip: "push đúng thứ tự đề cho ⇒ 35 nằm trên đỉnh (vào sau, ra trước). Câu 1 yêu cầu trả bool (thành công/không) — xem code chuẩn bên dưới.",
  },
  {
    id: "demo-thay",
    label: "Demo của thầy — push 10 39 79 80 50, pop 5 lần",
    spec: {
      ops: [
        { op: "push", value: 10, brief: true },
        { op: "push", value: 39, brief: true },
        { op: "push", value: 79, brief: true },
        { op: "push", value: 80, brief: true },
        { op: "push", value: 50, brief: true },
        { op: "pop" },
        { op: "pop", brief: true },
        { op: "pop", brief: true },
        { op: "pop", brief: true },
        { op: "pop", brief: true },
      ],
    },
    tip: "pop luôn lấy phần tử vào SAU CÙNG (50 trước, 10 sau cùng). Pop đến khi rỗng thì pTop = NULL.",
  },
  {
    id: "convert-13",
    label: "Đổi 13 sang hệ 2 bằng Stack (convert10_2)",
    spec: {
      ops: [
        { op: "push", value: 1, note: "13 ÷ 2 = 6 dư 1 ⇒ push 1.", brief: true },
        { op: "push", value: 0, note: "6 ÷ 2 = 3 dư 0 ⇒ push 0.", brief: true },
        { op: "push", value: 1, note: "3 ÷ 2 = 1 dư 1 ⇒ push 1.", brief: true },
        { op: "push", value: 1, note: "1 ÷ 2 = 0 dư 1 ⇒ push 1. n = 0 ⇒ dừng vòng lặp.", brief: true },
        { op: "pop", brief: true, note: "Pop chữ số đầu tiên của kết quả (bên trái)." },
        { op: "pop", brief: true, note: "Pop chữ số thứ hai." },
        { op: "pop", brief: true, note: "Pop chữ số thứ ba." },
        { op: "pop", brief: true, note: "Pop chữ số cuối." },
      ],
    },
    tip: "Lấy dư liên tiếp rồi push: do LIFO nên pop ra đúng thứ tự chữ số từ trái sang phải. Thứ tự pop 1 1 0 1 ⇒ 13 = 1101₂.",
  },
];
