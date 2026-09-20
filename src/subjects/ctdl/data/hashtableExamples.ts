import type { HashOp, HashSpec } from "../engine/hashtable";

export interface HashtableExample {
  id: string;
  label: string;
  spec: HashSpec;
  tip?: string;
}

/** Code chuẩn: khớp `hashtable_static.cpp` / `hashtable_dynamic.cpp` của thầy (+ hàm tìm của Test03 Câu 7). Nguồn: `.claude/skills/ctdl-content/reference/solutions/hash_test03.cpp`. */
export const HASHTABLE_CODE = `const int Size = 10;

struct Node   { int data; Node* pNext; };
struct Bucket { Node* pHead; Node* pTail; };
struct Hashtable { Bucket bucket[Size]; };     // bản động: Bucket* bucket; int Size; + new Bucket[S]

void initHashtable(Hashtable& h)
{
    for (int i = 0; i < Size; i++) h.bucket[i].pHead = h.bucket[i].pTail = nullptr;
}

int hashFun(int value) { return value % Size; }      // phương pháp chia (bản động: value % h.Size)

void add(Hashtable& h, int value)
{
    int viTri = hashFun(value);
    Node* p = initNode(value);

    if (h.bucket[viTri].pHead == nullptr && h.bucket[viTri].pTail == nullptr)
    {
        h.bucket[viTri].pHead = p;
        h.bucket[viTri].pTail = p;
    }
    else                                             // đụng độ: nối tiếp vào cuối, KHÔNG ghi đè
    {
        h.bucket[viTri].pTail->pNext = p;
        h.bucket[viTri].pTail = p;
    }
}

// Tìm X: chỉ duyệt đúng 1 bucket
bool timGiaTri(Hashtable h, int x)
{
    for (Node* p = h.bucket[hashFun(x)].pHead; p != nullptr; p = p->pNext)
        if (p->data == x) return true;
    return false;
}`;

/** Thêm các giá trị; những vị trí trong `detail` chạy từng dòng lệnh, còn lại gộp 1 bước (`brief`). */
const adds = (values: number[], detail: number[] = []): HashOp[] => values.map((value, i) => ({ op: "add", value, brief: !detail.includes(i) }));

const H_VALUES = [50, 73, 35, 36, 64, 28, 90, 21, 53, 13];

/**
 * Tất cả ví dụ là số liệu thật trong tài liệu: `hashtable_static.cpp` (Size 10, 2 bộ), `hashtable_dynamic.cpp` (Size 7),
 * `hashtable_4steps_dynamic.cpp` (Size 5), Test03 (Size 9, dữ liệu Câu 10 có giá trị trùng), và Test03 Câu 7 (tìm X).
 */
export const HASHTABLE_EXAMPLES: HashtableExample[] = [
  {
    id: "static-h",
    label: "hashtable_static.cpp — Size 10: 50 73 35 36 64 28 90 21 53 13",
    spec: { size: 10, ops: adds(H_VALUES, [0, 6]) },
    tip: "50 và 90 cùng chia 10 dư 0 ⇒ đụng độ ở bucket[0]: node mới nối vào CUỐI danh sách (bucket[3] chứa 73, 53, 13 theo thứ tự thêm vào), không ghi đè.",
  },
  {
    id: "static-h2",
    label: "hashtable_static.cpp — Size 10: 17 27 37 7 97 12 22",
    spec: { size: 10, ops: adds([17, 27, 37, 7, 97, 12, 22], [1]) },
    tip: "17, 27, 37, 7, 97 đều chia 10 dư 7 ⇒ cùng bucket[7], thứ tự trong bucket = thứ tự thêm vào (17, 27, 37, 7, 97).",
  },
  {
    id: "dynamic-7",
    label: "hashtable_dynamic.cpp — Size 7: 14 21 8 15 22 10 17 3",
    spec: { size: 7, ops: adds([14, 21, 8, 15, 22, 10, 17, 3], [1]) },
    tip: "Bản động: initHashtable(h, 7) cấp phát mảng bucket bằng new Bucket[7] và hashFun dùng h.Size (7 nguyên tố) thay vì hằng Size.",
  },
  {
    id: "dynamic-5",
    label: "hashtable_4steps_dynamic.cpp — Size 5: 10 25 11 16 21 12 17 14 19",
    spec: { size: 5, ops: adds([10, 25, 11, 16, 21, 12, 17, 14, 19], [1]) },
    tip: "Size nhỏ ⇒ hệ số tải cao (9 giá trị / 5 bucket) ⇒ nhiều đụng độ, mỗi bucket dài — tìm kiếm chậm dần.",
  },
  {
    id: "test03-9",
    label: "Test03 — Size 9, dữ liệu Câu 10: 50 75 25 30 10 90 70 60 30 70 90",
    spec: { size: 9, ops: adds([50, 75, 25, 30, 10, 90, 70, 60, 30, 70, 90], [3, 8]) },
    tip: "Bảng băm GIỮ giá trị trùng (30, 70, 90 xuất hiện 2 lần ⇒ 11 giá trị được lưu) — khác BST bỏ qua giá trị trùng. Kết quả: bucket[0] = 90 90, bucket[3] = 75 30 30, bucket[7] = 25 70 70.",
  },
  {
    id: "find-x",
    label: "Test03 Câu 7 — tìm X: 53 (có), 44 (không), 7 (bucket rỗng)",
    spec: { size: 10, ops: [...adds(H_VALUES), { op: "find", value: 53 }, { op: "find", value: 44 }, { op: "find", value: 7 }] },
    tip: "Chỉ duyệt đúng bucket hashFun(X): 53 % 10 = 3 nên chỉ xem bucket[3]; bucket rỗng ⇒ false ngay.",
  },
];
