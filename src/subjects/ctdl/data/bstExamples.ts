import type { BstOp, BstSpec } from "../engine/bst";

export interface BstExample {
  id: string;
  label: string;
  spec: BstSpec;
  tip?: string;
}

/** Code chuẩn: khớp `demo_tree_v1.cpp` (printTree, tìm) và các đề thực hành (Test01, Luyện tập 005 Câu 4, Đề mẫu Câu 11). Nguồn: `.claude/skills/ctdl-content/reference/solutions/bst_test01.cpp`. */
export const BST_CODE = `struct Node { float data; Node* pLeft; Node* pRight; };
struct Tree { Node* pRoot; };

// Chèn KHÔNG đệ quy; trùng thì bỏ qua. Cần pLoca (cha) vì khi pGoto chạm NULL đã mất node cha.
// (add trong demo_tree_v1.cpp KHÔNG xử lý trùng: value == pGoto->data thì vòng lặp không thoát!)
bool insertNode(Tree& t, float value)
{
    Node* pGoto = t.pRoot;
    Node* pLoca = nullptr;
    while (pGoto != nullptr)
    {
        if (value == pGoto->data) return false;          // trùng => bỏ qua
        pLoca = pGoto;
        pGoto = (value < pGoto->data) ? pGoto->pLeft : pGoto->pRight;
    }
    Node* p = initNode(value);
    if (pLoca == nullptr)              t.pRoot = p;      // cây rỗng
    else if (value < pLoca->data)      pLoca->pLeft = p;
    else                               pLoca->pRight = p;
    return true;
}

// Tìm KHÔNG đệ quy (Đề mẫu Câu 11)
Node* timKiem(Tree t, float x)
{
    Node* p = t.pRoot;
    while (p != nullptr && p->data != x)
        p = (x < p->data) ? p->pLeft : p->pRight;
    return p;                                            // NULL nếu không có
}

// LNR KHÔNG đệ quy (demo_tree_v1.cpp): Left_full -> xử lý -> Right
void printTree(Tree t)
{
    stack<Node*> s;
    Node* p = t.pRoot;
    while (p != nullptr || !s.empty())
    {
        while (p != nullptr) { s.push(p); p = p->pLeft; }   // Left_full
        p = s.top();
        cout << p->data << " ";                             // xử lý node
        s.pop();
        p = p->pRight;                                      // Right
    }
}

// Duyệt đệ quy: NLR / LNR / LRN chỉ khác chỗ đặt lệnh xử lý
void duyetLNR(Node* p)
{
    if (p == nullptr) return;
    duyetLNR(p->pLeft);
    cout << p->data << " ";
    duyetLNR(p->pRight);
}`;

const adds = (values: number[], detail: number[] = []): BstOp[] => values.map((value, i) => ({ op: "insert", value, brief: !detail.includes(i) }));

/**
 * Ví dụ: `demo_tree_v1.cpp` (add 50 73 26 66 88 61, printTree, timGT 88), Test01 Câu 10 (dữ liệu có giá trị trùng ⇒ 8 node; duyệt NLR/LRN/LNR),
 * tìm kiếm trên cây Test01 (Câu 5), và 1 ví dụ thi thử (artifact Đề 3 Câu 10 — không phải đề thật).
 */
export const BST_EXAMPLES: BstExample[] = [
  {
    id: "demo-tree-v1",
    label: "demo_tree_v1.cpp — add 50 73 26 66 88 61, printTree, tìm 88",
    spec: { ops: [...adds([50, 73, 26, 66, 88, 61], [3, 5]), { op: "traverseStack" }, { op: "search", value: 88 }] },
    tip: "printTree của thầy duyệt LNR KHÔNG đệ quy bằng std::stack: Left_full (đẩy hết nhánh trái) → xử lý (top, in, pop) → Right. Kết quả luôn tăng dần: 26 50 61 66 73 88.",
  },
  {
    id: "test01-demo",
    label: "Test01 Câu 10 — 50 75 25 30 10 90 70 60 30 70 90 (có trùng), NLR/LRN/LNR",
    spec: {
      ops: [
        ...adds([50, 75, 25, 30, 10, 90, 70, 60, 30, 70, 90], [7, 8]),
        { op: "traverse", order: "NLR" },
        { op: "traverse", order: "LRN" },
        { op: "traverse", order: "LNR" },
        { op: "count" },
      ],
    },
    tip: "30, 70, 90 xuất hiện 2 lần nhưng BST BỎ QUA giá trị trùng ⇒ chỉ 8 node (khác bảng băm giữ trùng). LNR luôn cho dãy tăng dần — mẹo kiểm tra nhanh.",
  },
  {
    id: "search-x",
    label: "Test01 Câu 5 — tìm 60 (có) và 65 (không có)",
    spec: { ops: [...adds([50, 75, 25, 30, 10, 90, 70, 60]), { op: "search", value: 60 }, { op: "search", value: 65 }] },
    tip: "Tìm KHÔNG đệ quy: đi xuống như lúc chèn (nhỏ hơn sang trái, lớn hơn sang phải); tới NULL là không có — trả nullptr (hoặc false).",
  },
  {
    id: "thithu-q10",
    label: "Thi thử (artifact) — thêm 50 75 25 30 10 90, duyệt LNR",
    spec: { ops: [...adds([50, 75, 25, 30, 10, 90]), { op: "traverse", order: "LNR" }] },
    tip: "Đáp án LNR: 10, 25, 30, 50, 75, 90.",
  },
];
