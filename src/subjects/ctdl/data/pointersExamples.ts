import type { Machine } from "../engine/memoryMachine";
import type { MemLine, MemProgram } from "../engine/memoryTrace";

export interface PointerExample {
  id: string;
  label: string;
  program: MemProgram;
  /** Đáp án ĐÃ CHẠY THẬT bằng C++ (xem `.claude/skills/ctdl-content/reference/exam-bank.md`): `output` = chữ in ra, `crash` = lỗi runtime. */
  expected: { output: string } | { crash: true };
  /** Câu trả lời "giải thích" ngắn để ghi vào bài làm. */
  reason: string;
  tip?: string;
}

const line = (code: string, why: string, run: (m: Machine) => void): MemLine => ({ code, why, run });

const HEAD = ["#include <iostream>", "using namespace std;"];
const MAIN = ["int main()", "{"];
const NODE_INT = ["struct Node", "{", "    int data;", "    Node* next;", "};"];
const INIT_INT = ["Node* initNode(int x)", "{", "    Node* p = new Node;", "    p->data = x;", "    p->next = NULL;", "    return p;", "}"];
const LIST_DEFAULT = ["struct List", "{", "    Node *head = NULL, *tail = NULL;", "};"];
const NULL_NOTE = "In con trỏ NULL ra màn hình: viết NULL (máy thật in 0 hoặc 0x0 tuỳ trình biên dịch).";

/**
 * 12 chương trình, TẤT CẢ là đề/hướng dẫn thật: `IT003_Bai09_De_CuoiKy_CITD_De_mau.pdf` Câu 4–7,
 * `IT003_Bai09_Huong_Dan_Trinh_Bay.pdf` (2 ví dụ đọc code), `IT003_Bai10_Luyen_tap_005.pdf` Câu 5–10 (đối chiếu với ảnh trang).
 * Kết quả mỗi câu do máy bộ nhớ tính; `expected` là đáp án đã chạy bằng clang++ — `engine/check.mjs` bắt hai bên khớp nhau.
 */
export const POINTER_EXAMPLES: PointerExample[] = [
  {
    id: "dm-c4",
    label: "Đề mẫu Câu 4 — l.tail->data khi tail chưa được gán",
    program: {
      preamble: [...HEAD, ...NODE_INT, ...LIST_DEFAULT, ...INIT_INT, ...MAIN],
      lines: [
        line("List l;", "Khai báo l kiểu List trên stack. head và tail có giá trị mặc định NULL (viết = NULL ngay trong struct).", (m) => m.declareStruct("l", "List", { head: null, tail: null })),
        line("Node* p = initNode(39);", "initNode cấp phát 1 node trên heap (new Node): data = 39, next = NULL. p giữ địa chỉ node đó.", (m) => m.declarePtr("p", "Node*", m.newNode("Node", { data: 39, next: null }))),
        line("l.head = p;", "Chỉ l.head được gán để trỏ vào node; l.tail KHÔNG bị đụng tới — vẫn NULL.", (m) => m.assign("l.head", "p")),
        line("cout << l.tail->data << endl;", "l.tail vẫn NULL nên ->data là giải tham chiếu con trỏ NULL ⇒ lỗi runtime (segmentation fault). Không phải in ra 0 hay 39.", (m) => m.cout(m.read("l.tail->data"), "\n")),
      ],
    },
    expected: { crash: true },
    reason: "l.tail chỉ được khởi tạo NULL mặc định và không có dòng nào gán lại, nên l.tail->data giải tham chiếu con trỏ NULL ⇒ chương trình lỗi runtime (sập), không in ra 0 hay 39.",
    tip: "Gặp p->… hay (*p)… luôn hỏi: con trỏ này đã được gán chưa? NULL (hoặc chưa khởi tạo) mà giải tham chiếu = lỗi runtime, đáp án là 'lỗi', không phải một con số.",
  },
  {
    id: "dm-c5",
    label: "Đề mẫu Câu 5 — p->data, (*p).data, p->next",
    program: {
      preamble: [...HEAD, ...NODE_INT, ...INIT_INT, ...MAIN],
      lines: [
        line("Node* p = initNode(79);", "initNode cấp phát node trên heap: data = 79, next = NULL; p trỏ tới node đó.", (m) => m.declarePtr("p", "Node*", m.newNode("Node", { data: 79, next: null }))),
        line("cout << p->data << endl;", "p->data đọc trường data của node p trỏ tới ⇒ 79.", (m) => m.cout(m.read("p->data"), "\n")),
        line("cout << (*p).data << endl;", "(*p).data ≡ p->data: giải tham chiếu p rồi lấy data ⇒ 79.", (m) => m.cout(m.read("(*p).data"), "\n")),
        line("cout << p->next << endl;", `next chỉ được initNode gán NULL ⇒ in ra NULL. ${NULL_NOTE}`, (m) => m.cout(m.read("p->next"), "\n")),
      ],
    },
    expected: { output: "79\n79\nNULL\n" },
    reason: "p->data và (*p).data là cùng một thứ (79); p->next chưa được gán gì ngoài NULL (initNode) nên in ra NULL.",
    tip: "p->x ≡ (*p).x. In một con trỏ (không có ->data) chỉ in địa chỉ/NULL, không lỗi — khác với giải tham chiếu.",
  },
  {
    id: "dm-c6",
    label: "Đề mẫu Câu 6 — new double[10], cout << *a",
    program: {
      preamble: [...HEAD, ...MAIN],
      lines: [
        line("double* a = new double[10];", "new double[10] cấp phát 10 ô double liền nhau trên heap (chưa có giá trị — ô 'rác'); a trỏ tới ô đầu tiên.", (m) => m.declarePtr("a", "double*", m.newArray("double", 10))),
        line("a[0] = 9.3;", "a[0] là ô đầu tiên của mảng.", (m) => m.assign("a[0]", 9.3)),
        line("a[1] = 6.1;", "a[1] là ô thứ hai — không ảnh hưởng a[0].", (m) => m.assign("a[1]", 6.1)),
        line("cout << *a << endl;", "*a ≡ a[0] = 9.3 (a[1] = 6.1 không liên quan).", (m) => m.cout(m.read("*a"), "\n")),
      ],
    },
    expected: { output: "9.3\n" },
    reason: "*a ≡ a[0] = 9.3.",
    tip: "*a ≡ a[0] và *(a + k) ≡ a[k] — con trỏ tới mảng luôn trỏ ô đầu.",
  },
  {
    id: "dm-c7",
    label: "Đề mẫu Câu 7 — head được gán, tail vẫn NULL",
    program: {
      preamble: [...HEAD, ...NODE_INT, ...LIST_DEFAULT, ...INIT_INT, ...MAIN],
      lines: [
        line("List l;", "head và tail mặc định NULL.", (m) => m.declareStruct("l", "List", { head: null, tail: null })),
        line("Node* p = initNode(39);", "Node mới trên heap: data = 39, next = NULL.", (m) => m.declarePtr("p", "Node*", m.newNode("Node", { data: 39, next: null }))),
        line("l.head = p;", "Chỉ head trỏ vào node; tail vẫn NULL.", (m) => m.assign("l.head", "p")),
        line("cout << l.head->data << endl;", "head trỏ vào node ⇒ 39.", (m) => m.cout(m.read("l.head->data"), "\n")),
        line("cout << l.tail << endl;", `In giá trị của CON TRỎ tail (không giải tham chiếu) ⇒ NULL, không lỗi. Khác Câu 4: ở đây không có ->data. ${NULL_NOTE}`, (m) => m.cout(m.read("l.tail"), "\n")),
      ],
    },
    expected: { output: "39\nNULL\n" },
    reason: "l.head->data = 39; l.tail vẫn NULL nên in ra NULL (in con trỏ không phải giải tham chiếu nên không lỗi).",
  },
  {
    id: "hd-1",
    label: "Hướng dẫn — *(a + 3) + *(a + 7)",
    program: {
      preamble: [...HEAD, ...MAIN],
      lines: [
        line("int a[] = {1, 3, 5, 7, 9, 2, 4, 6, 8};", "Mảng 9 phần tử, chỉ số tính từ 0: a[0]=1, a[1]=3, …, a[8]=8.", (m) => m.declareArray("a", "int", [1, 3, 5, 7, 9, 2, 4, 6, 8])),
        line("cout << *(a + 3) + *(a + 7);", "*(a+3) ≡ a[3] = 7; *(a+7) ≡ a[7] = 6 ⇒ 7 + 6 = 13. Chỉ số tính từ 0 (a[3] là phần tử thứ 4).", (m) => m.cout(m.num("*(a+3)") + m.num("*(a+7)"))),
      ],
    },
    expected: { output: "13" },
    reason: "*(a+3) = a[3] = 7 và *(a+7) = a[7] = 6 ⇒ 13.",
    tip: "Đếm chỉ số từ 0: a[3] là số thứ 4 trong dãy.",
  },
  {
    id: "hd-2",
    label: "Hướng dẫn — b = (*p)++",
    program: {
      preamble: [...HEAD, ...MAIN],
      lines: [
        line("int a = 102, b, *p;", "a = 102; b và p chưa khởi tạo (giá trị rác).", (m) => {
          m.declare("a", "int", 102);
          m.declare("b", "int");
          m.declarePtr("p", "int*");
        }),
        line("p = &a;", "p trỏ tới biến a (địa chỉ của a) — không phải bản sao của a.", (m) => m.assign("p", "&a")),
        line("b = (*p)++;", "(*p)++ là hậu tố: lấy giá trị CŨ của a (102) gán cho b, rồi mới tăng a lên 103.", (m) => m.assign("b", m.postInc("*p"))),
        line('cout << a << " " << b;', "a đã tăng thành 103; b giữ giá trị cũ 102.", (m) => m.cout(m.read("a"), " ", m.read("b"))),
      ],
    },
    expected: { output: "103 102" },
    reason: "(*p)++ trả giá trị cũ (102) cho b rồi tăng a thành 103 ⇒ in ra 103 102.",
    tip: "x++ (hậu tố): dùng giá trị CŨ rồi mới tăng. ++x (tiền tố): tăng rồi dùng giá trị mới.",
  },
  {
    id: "lt-c5",
    label: "Luyện tập 005 Câu 5 — p = &a bỏ rơi vùng new (rò rỉ)",
    program: {
      preamble: [...HEAD, ...MAIN],
      lines: [
        line("float a = 3.6;", "a = 3.6 trên stack.", (m) => m.declare("a", "float", 3.6)),
        line("float* p = new float(0.4);", "new float(0.4) cấp phát 1 ô float trên heap chứa 0.4; p trỏ tới đó.", (m) => m.declarePtr("p", "float*", m.newScalar("float", 0.4))),
        line("p = &a;", "p đổi sang trỏ tới a. Ô heap chứa 0.4 không còn con trỏ nào trỏ tới ⇒ rò rỉ bộ nhớ (memory leak) — nhưng KHÔNG ảnh hưởng kết quả in ra.", (m) => m.assign("p", "&a")),
        line("*p = 5.1;", "*p chính là a (p đang trỏ a) ⇒ a = 5.1.", (m) => m.assign("*p", 5.1)),
        line("a += 0.5;", "a = 5.1 + 0.5 = 5.6.", (m) => m.compound("a", "+=", 0.5)),
        line('cout << "a = " << a;', "In chuỗi 'a = ' rồi giá trị a.", (m) => m.cout("a = ", m.read("a"))),
      ],
    },
    expected: { output: "a = 5.6" },
    reason: "p = &a làm p trỏ vào a nên *p = 5.1 sửa chính a; a += 0.5 ⇒ 5.6. (Vùng new float(0.4) bị bỏ rơi — rò rỉ, không ảnh hưởng kết quả.)",
    tip: "Gán lại con trỏ không xoá vùng nó trỏ trước đó — nếu không delete thì thành rò rỉ (ô nét đứt đỏ trên hình).",
  },
  {
    id: "lt-c6",
    label: "Luyện tập 005 Câu 6 — new Node({69, NULL})",
    program: {
      preamble: [...HEAD, "struct Node", "{", "    int data;", "    Node* pNext;", "};", ...MAIN],
      lines: [
        line("Node* p = new Node({69, NULL});", "Cấp phát node đầu trên heap: data = 69, pNext = NULL; p trỏ tới nó.", (m) => m.declarePtr("p", "Node*", m.newNode("Node", { data: 69, pNext: null }))),
        line("p->pNext = new Node({86, NULL});", "Cấp phát node thứ hai và nối vào sau node đầu (p->pNext). p vẫn trỏ node đầu.", (m) => m.assign("p->pNext", m.newNode("Node", { data: 86, pNext: null }))),
        line("cout << p->data;", "p vẫn trỏ node đầu (69) — node thứ hai không ảnh hưởng p->data.", (m) => m.cout(m.read("p->data"))),
      ],
    },
    expected: { output: "69" },
    reason: "p trỏ node đầu (data = 69); node 86 chỉ được nối vào p->pNext nên không đổi p->data.",
  },
  {
    id: "lt-c7",
    label: "Luyện tập 005 Câu 7 — Stack: Top không bao giờ đổi",
    program: {
      preamble: [...HEAD, "struct Node", "{", "    double data;", "    Node* pNext;", "};", "", "struct Stack", "{", "    Node* Top = NULL;", "};", ...MAIN],
      lines: [
        line("Stack s;", "Top có giá trị mặc định NULL.", (m) => m.declareStruct("s", "Stack", { Top: null })),
        line("Node* p1 = new Node({9.1, NULL});", "Node 9.1 trên heap.", (m) => m.declarePtr("p1", "Node*", m.newNode("Node", { data: 9.1, pNext: null }))),
        line("Node* p2 = new Node({1.8, NULL});", "Node 1.8 trên heap.", (m) => m.declarePtr("p2", "Node*", m.newNode("Node", { data: 1.8, pNext: null }))),
        line("Node* p3 = new Node({3.9, NULL});", "Node 3.9 trên heap.", (m) => m.declarePtr("p3", "Node*", m.newNode("Node", { data: 3.9, pNext: null }))),
        line("s.Top = p1;", "Top trỏ node p1 (9.1).", (m) => m.assign("s.Top", "p1")),
        line("p3->pNext = s.Top;", "p3->pNext = giá trị Top LÚC NÀY = p1. Top không đổi.", (m) => m.assign("p3->pNext", "s.Top")),
        line("p2->pNext = s.Top;", "p2->pNext = Top = p1. Top vẫn không đổi — hai lệnh này chỉ trỏ p2, p3 vào p1, KHÔNG đẩy chúng vào stack.", (m) => m.assign("p2->pNext", "s.Top")),
        line("cout << s.Top->data;", "Top chưa bao giờ được gán lại (không có s.Top = p2 hay p3) nên vẫn là p1 ⇒ 9.1.", (m) => m.cout(m.read("s.Top->data"))),
      ],
    },
    expected: { output: "9.1" },
    reason: "s.Top chỉ được gán một lần (= p1); p2->pNext và p3->pNext trỏ vào p1 nhưng không đổi Top nên s.Top->data = 9.1.",
    tip: "push đúng phải có CẢ p->pNext = s.Top VÀ s.Top = p. Ở đây thiếu dòng gán Top nên không có push nào xảy ra.",
  },
  {
    id: "lt-c8",
    label: "Luyện tập 005 Câu 8 — Queue: 3 con trỏ cùng 1 node",
    program: {
      preamble: [...HEAD, "struct Node", "{", "    float data;", "    Node* next;", "};", "Node* initNode(float value)", "{", "    Node* p = new Node;", "    p->data = value;", "    p->next = NULL;", "    return p;", "}", "struct Queue", "{", "    Node* pFront;", "    Node* pRear;", "};", ...MAIN],
      lines: [
        line("Node* p = initNode(2.8);", "Node mới trên heap: data = 2.8; p trỏ tới nó.", (m) => m.declarePtr("p", "Node*", m.newNode("Node", { data: 2.8, next: null }))),
        line("Queue q;", "q.pFront và q.pRear chưa khởi tạo (giá trị rác, dấu ?).", (m) => m.declareStruct("q", "Queue", { pFront: "ptr?", pRear: "ptr?" })),
        line("q.pRear = q.pFront = p;", "Gán từ phải sang trái: pFront = p rồi pRear = pFront ⇒ cả p, pFront, pRear cùng trỏ MỘT node — không có node nào được nhân bản.", (m) => {
          m.assign("q.pFront", "p");
          m.assign("q.pRear", "q.pFront");
        }),
        line("p->data = 7.5;", "Ghi 7.5 vào node dùng chung.", (m) => m.assign("p->data", 7.5)),
        line("q.pRear->data = 9.3;", "pRear cùng trỏ node đó ⇒ ghi đè thành 9.3.", (m) => m.assign("q.pRear->data", 9.3)),
        line("cout << q.pFront->data;", "Chỉ có một node và giá trị cuối cùng ghi vào nó là 9.3.", (m) => m.cout(m.read("q.pFront->data"))),
      ],
    },
    expected: { output: "9.3" },
    reason: "q.pFront, q.pRear và p cùng trỏ tới một node (không phải ba node); các lệnh gán data lần lượt ghi đè lên node đó, lệnh cuối (9.3) là giá trị còn lại.",
    tip: "Gán con trỏ = sao chép ĐỊA CHỈ, không sao chép node. Sửa qua con trỏ nào cũng đổi cùng một node.",
  },
  {
    id: "lt-c9",
    label: "Luyện tập 005 Câu 9 — (L.pHead->next)->data",
    program: {
      preamble: [...HEAD, "struct Node", "{", "    float data;", "    Node* next;", "};", "Node* initNode(float data)", "{", "    Node* p = new Node;", "    p->data = data;", "    p->next = NULL;", "    return p;", "}", "struct List", "{", "    Node* pHead;", "};", "", ...MAIN],
      lines: [
        line("List L({NULL});", "L.pHead được khởi tạo NULL.", (m) => m.declareStruct("L", "List", { pHead: null })),
        line("L.pHead = initNode(6.3);", "Node đầu (6.3) trên heap; pHead trỏ tới nó.", (m) => m.assign("L.pHead", m.newNode("Node", { data: 6.3, next: null }))),
        line("L.pHead->next = initNode(8.2);", "Node thứ hai (8.2) nối sau node đầu.", (m) => m.assign("L.pHead->next", m.newNode("Node", { data: 8.2, next: null }))),
        line("cout << (L.pHead->next)->data;", "L.pHead->next là node thứ hai; ->data của nó = 8.2.", (m) => m.cout(m.read("(L.pHead->next)->data"))),
      ],
    },
    expected: { output: "8.2" },
    reason: "L.pHead->next trỏ node thứ hai (8.2), nên (L.pHead->next)->data = 8.2.",
  },
  {
    id: "lt-c10",
    label: "Luyện tập 005 Câu 10 — Tree: pRight = pLeft",
    program: {
      preamble: [...HEAD, "struct Node{", "    float data;", "    Node* pLeft;", "    Node* pRight;", "};", "struct Tree", "{", "    Node* pRoot = NULL;", "};", ...MAIN],
      lines: [
        line("Tree t;", "pRoot mặc định NULL.", (m) => m.declareStruct("t", "Tree", { pRoot: null })),
        line("t.pRoot = new Node({6.2, NULL, NULL});", "Node gốc 6.2 (hai con NULL).", (m) => m.assign("t.pRoot", m.newNode("Node", { data: 6.2, pLeft: null, pRight: null }))),
        line("t.pRoot->pLeft = new Node({5.1, NULL, NULL});", "Node con trái 5.1.", (m) => m.assign("t.pRoot->pLeft", m.newNode("Node", { data: 5.1, pLeft: null, pRight: null }))),
        line("t.pRoot->pRight = t.pRoot->pLeft;", "pRight được gán BẰNG pLeft: hai con trỏ cùng trỏ node 5.1 (chia sẻ node con) — không đổi gốc, không tạo node mới.", (m) => m.assign("t.pRoot->pRight", "t.pRoot->pLeft")),
        line("cout << t.pRoot->data;", "Gốc vẫn là node 6.2.", (m) => m.cout(m.read("t.pRoot->data"))),
      ],
    },
    expected: { output: "6.2" },
    reason: "pRight = pLeft chỉ làm hai con trỏ cùng trỏ node 5.1; gốc không đổi nên t.pRoot->data = 6.2.",
  },
];
