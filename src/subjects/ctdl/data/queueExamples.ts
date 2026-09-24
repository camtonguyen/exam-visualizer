import type { QueueSpec } from "../engine/queue";

export interface QueueExample {
  id: string;
  label: string;
  spec: QueueSpec;
  tip?: string;
}

/** Code chuẩn (khớp `Queue.cpp` của thầy). Nguồn: `.claude/skills/ctdl-content/reference/solutions/list_stack_queue.cpp`. */
export const QUEUE_CODE = `struct Node  { float data; Node* pNext; };
struct Queue { Node* pFront; Node* pRear; };

/*Thêm một phần tử vào hàng đợi (enQueue = addTail ở pRear)
Input:
    + Queue& q
    + Node* p
Output:
    + Queue& q
*/
void enQueue(Queue& q, Node* p)
{
    if (q.pFront == nullptr && q.pRear == nullptr)   // rỗng
    {
        q.pFront = p;
        q.pRear = p;
    }
    else
    {
        q.pRear->pNext = p;
        q.pRear = p;
    }
}

/*Lấy một phần tử ra khỏi hàng đợi (deQueue = removeHead ở pFront)
Input:
    + Queue& q
Output:
    + Queue& q
*/
void deQueue(Queue& q)
{
    if (isEmpty(q)) return;

    Node* p = q.pFront;
    q.pFront = q.pFront->pNext;
    delete p;

    if (q.pFront == nullptr)   // vừa lấy node cuối => QUÊN dòng này là lỗi hay gặp nhất
        q.pRear = nullptr;
}`;

/**
 * Ví dụ: `Queue.cpp` của thầy (enQueue 6 7 8 9 10 rồi lấy ra), 1 ví dụ THI THỬ (artifact, Đề 2 Câu 10 —
 * không phải đề thật) và 1 ví dụ MINH HỌA tự tạo (không phải đề thật) cho lỗi hay gặp `pRear` dangling.
 */
export const QUEUE_EXAMPLES: QueueExample[] = [
  {
    id: "queue-cpp",
    label: "Demo của thầy — enQueue 6 7 8 9 10, deQueue 2 lần",
    spec: {
      ops: [
        { op: "enQueue", value: 6, brief: true },
        { op: "enQueue", value: 7, brief: true },
        { op: "enQueue", value: 8, brief: true },
        { op: "enQueue", value: 9, brief: true },
        { op: "enQueue", value: 10 },
        { op: "deQueue" },
        { op: "deQueue", brief: true },
      ],
    },
    tip: "FIFO: 6 vào trước nên ra trước. enQueue thêm ở pRear, deQueue lấy ở pFront — 2 đầu khác nhau, vì thế cần 2 con trỏ.",
  },
  {
    id: "thithu-c10",
    label: "Thi thử (artifact) — enQ 5 8 3, deQ, enQ 6",
    spec: {
      ops: [
        { op: "enQueue", value: 5, brief: true },
        { op: "enQueue", value: 8, brief: true },
        { op: "enQueue", value: 3, brief: true },
        { op: "deQueue", brief: true },
        { op: "enQueue", value: 6, brief: true },
      ],
    },
    tip: "Đáp án theo thứ tự Front → Rear: 8, 3, 6 (deQueue lấy 5 — phần tử vào trước nhất).",
  },
  {
    id: "minhhoa-dangling",
    label: "Minh họa (tự tạo) — lấy node cuối cùng, pRear dangling",
    spec: { ops: [{ op: "enQueue", value: 1 }, { op: "deQueue" }] },
    tip: "Ví dụ tự tạo, không phải đề thật. Sau delete p của node cuối, pRear còn trỏ vào vùng đã giải phóng — phải đặt q.pRear = nullptr khi pFront == nullptr.",
  },
];
