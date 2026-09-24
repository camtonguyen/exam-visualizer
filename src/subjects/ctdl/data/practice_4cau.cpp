// Đề luyện tập "4 câu như Đề mẫu Phần 2" — lời giải theo ĐÚNG cách trình bày của thầy:
// comment Input/Output trước MỖI hàm, viết trên đúng struct đề cho, Câu 4 là main kiểm thử.
// Stack = ĐỀ THẬT (IT003_Bai09_De_CuoiKy_CITD_De_mau.pdf Phần 2). DSLK đơn/đôi, Queue, Bảng băm = TỰ SOẠN cùng khuôn, KHÔNG phải đề thật.
// App đọc file này (import ?raw), cắt theo cặp dấu BEGIN/END — sửa lời giải ở ĐÂY, không chép sang TS.
// Mỗi cặp BEGIN/END là MỘT chương trình hoàn chỉnh (thiếu #include như đề cho phép) — tự kiểm: node src/subjects/ctdl/engine/check.mjs (cần clang++).
#include <iostream>
#include <new>
#include <cassert>
using namespace std;

// ===== BEGIN stack =====
struct Node
{
    int data = 0;
    Node* pNext = nullptr;
};

struct Stack
{
    Node* pTop = nullptr;
};

/*Câu 1: Thêm một phần tử vào stack
Input:
    + Stack& s
    + int value
Output:
    + Stack& s
    + return bool
*/
bool cau01(Stack& s, int value)
{
    Node* p = new (nothrow) Node({value});
    if (p == nullptr)
        return false;

    p->pNext = s.pTop;
    s.pTop = p;
    return true;
}

/*Câu 2: Lấy một phần tử ra khỏi stack
Input:
    + Stack& s
    + int& value
Output:
    + Stack& s
    + int& value
    + return bool
*/
bool cau02(Stack& s, int& value)
{
    if (s.pTop == nullptr)
        return false;

    Node* p = s.pTop;
    value = p->data;
    s.pTop = p->pNext;
    delete p;
    return true;
}

/*Câu 3: Đếm số lượng các phần tử có trong stack
Input:
    + Stack s
Output:
    + return int
*/
int cau03(Stack s)
{
    int dem = 0;
    for (Node* p = s.pTop; p != nullptr; p = p->pNext)
        dem++;
    return dem;
}

// Câu 4
int main()
{
    Stack s;
    cau01(s, 12);
    cau01(s, -95);
    cau01(s, 78);
    cau01(s, -89);
    cau01(s, 35);                                   // pTop -> 35 -89 78 -95 12

    cout << "So phan tu: " << cau03(s) << endl;     // 5
    int value;
    if (cau02(s, value))
        cout << "Lay ra: " << value << endl;        // 35
    cout << "So phan tu: " << cau03(s) << endl;     // 4
    return 0;
}
// ===== END stack =====

// ===== BEGIN list =====
struct Node
{
    int data = 0;
    Node* pNext = nullptr;
};

struct List
{
    Node* pHead = nullptr;
    Node* pTail = nullptr;
};

/*Câu 1: Thêm một phần tử vào cuối danh sách
Input:
    + List& l
    + int value
Output:
    + List& l
    + return bool
*/
bool cau01(List& l, int value)
{
    Node* p = new (nothrow) Node({value});
    if (p == nullptr)
        return false;

    if (l.pHead == nullptr)
    {
        l.pHead = p;
        l.pTail = p;
    }
    else
    {
        l.pTail->pNext = p;
        l.pTail = p;
    }
    return true;
}

/*Câu 2: Xóa phần tử có giá trị x (đầu tiên) khỏi danh sách
Input:
    + List& l
    + int x
Output:
    + List& l
    + return bool
*/
bool cau02(List& l, int x)
{
    Node* prev = nullptr;
    for (Node* p = l.pHead; p != nullptr; prev = p, p = p->pNext)
    {
        if (p->data != x)
            continue;

        if (prev == nullptr)            // x ở đầu
            l.pHead = p->pNext;
        else                            // nối tắt qua p
            prev->pNext = p->pNext;

        if (p == l.pTail)               // x ở cuối
            l.pTail = prev;

        delete p;
        return true;
    }
    return false;
}

/*Câu 3: Đếm số lượng các phần tử có trong danh sách
Input:
    + List l
Output:
    + return int
*/
int cau03(List l)
{
    int dem = 0;
    for (Node* p = l.pHead; p != nullptr; p = p->pNext)
        dem++;
    return dem;
}

// Câu 4
int main()
{
    List l;
    cau01(l, 15);
    cau01(l, -42);
    cau01(l, 63);
    cau01(l, -8);
    cau01(l, 21);                                   // pHead -> 15 -42 63 -8 21

    cout << "So phan tu: " << cau03(l) << endl;     // 5
    cout << "Xoa 63: " << cau02(l, 63) << endl;     // 1
    cout << "Xoa 100: " << cau02(l, 100) << endl;   // 0
    cout << "So phan tu: " << cau03(l) << endl;     // 4
    return 0;
}
// ===== END list =====

// ===== BEGIN dlist =====
struct Node
{
    Node* pPre = nullptr;
    int data = 0;
    Node* pNext = nullptr;
};

struct List
{
    Node* pHead = nullptr;
    Node* pTail = nullptr;
};

/*Câu 1: Thêm một phần tử vào cuối danh sách
Input:
    + List& l
    + int value
Output:
    + List& l
    + return bool
*/
bool cau01(List& l, int value)
{
    Node* p = new (nothrow) Node({nullptr, value});
    if (p == nullptr)
        return false;

    if (l.pHead == nullptr)
    {
        l.pHead = p;
        l.pTail = p;
    }
    else
    {
        l.pTail->pNext = p;             // chiều xuôi
        p->pPre = l.pTail;              // chiều ngược
        l.pTail = p;
    }
    return true;
}

/*Câu 2: Xóa phần tử có giá trị x (đầu tiên) khỏi danh sách
Input:
    + List& l
    + int x
Output:
    + List& l
    + return bool
*/
bool cau02(List& l, int x)
{
    for (Node* p = l.pHead; p != nullptr; p = p->pNext)
    {
        if (p->data != x)
            continue;

        if (p->pPre != nullptr) p->pPre->pNext = p->pNext;
        else                    l.pHead = p->pNext;

        if (p->pNext != nullptr) p->pNext->pPre = p->pPre;
        else                     l.pTail = p->pPre;

        delete p;
        return true;
    }
    return false;
}

/*Câu 3: Đếm số lượng các phần tử có trong danh sách
Input:
    + List l
Output:
    + return int
*/
int cau03(List l)
{
    int dem = 0;
    for (Node* p = l.pHead; p != nullptr; p = p->pNext)
        dem++;
    return dem;
}

// Câu 4
int main()
{
    List l;
    cau01(l, 9);
    cau01(l, 27);
    cau01(l, -14);
    cau01(l, 50);                                   // NULL <- 9 <-> 27 <-> -14 <-> 50 -> NULL

    cout << "So phan tu: " << cau03(l) << endl;     // 4
    cout << "Xoa 27: " << cau02(l, 27) << endl;     // 1
    cout << "So phan tu: " << cau03(l) << endl;     // 3
    return 0;
}
// ===== END dlist =====

// ===== BEGIN queue =====
struct Node
{
    int data = 0;
    Node* pNext = nullptr;
};

struct Queue
{
    Node* pFront = nullptr;
    Node* pRear = nullptr;
};

/*Câu 1: Thêm một phần tử vào hàng đợi
Input:
    + Queue& q
    + int value
Output:
    + Queue& q
    + return bool
*/
bool cau01(Queue& q, int value)
{
    Node* p = new (nothrow) Node({value});
    if (p == nullptr)
        return false;

    if (q.pFront == nullptr && q.pRear == nullptr)
    {
        q.pFront = p;
        q.pRear = p;
    }
    else
    {
        q.pRear->pNext = p;
        q.pRear = p;
    }
    return true;
}

/*Câu 2: Lấy một phần tử ra khỏi hàng đợi
Input:
    + Queue& q
    + int& value
Output:
    + Queue& q
    + int& value
    + return bool
*/
bool cau02(Queue& q, int& value)
{
    if (q.pFront == nullptr)
        return false;

    Node* p = q.pFront;
    value = p->data;
    q.pFront = p->pNext;
    delete p;

    if (q.pFront == nullptr)            // vừa lấy node cuối
        q.pRear = nullptr;
    return true;
}

/*Câu 3: Đếm số lượng các phần tử có trong hàng đợi
Input:
    + Queue q
Output:
    + return int
*/
int cau03(Queue q)
{
    int dem = 0;
    for (Node* p = q.pFront; p != nullptr; p = p->pNext)
        dem++;
    return dem;
}

// Câu 4
int main()
{
    Queue q;
    cau01(q, 6);
    cau01(q, -19);
    cau01(q, 33);
    cau01(q, 4);
    cau01(q, -27);                                  // pFront -> 6 -19 33 4 -27 <- pRear

    cout << "So phan tu: " << cau03(q) << endl;     // 5
    int value;
    if (cau02(q, value))
        cout << "Lay ra: " << value << endl;        // 6
    cout << "So phan tu: " << cau03(q) << endl;     // 4
    return 0;
}
// ===== END queue =====

// ===== BEGIN hash =====
const int SIZE = 7;

struct Node
{
    int data = 0;
    Node* pNext = nullptr;
};

struct Bucket
{
    Node* pHead = nullptr;
    Node* pTail = nullptr;
};

struct Hashtable
{
    Bucket bucket[SIZE];
};

/*Câu 1: Thêm một giá trị vào bảng băm (phương pháp chia, nối kết)
Input:
    + Hashtable& h
    + int value
Output:
    + Hashtable& h
    + return bool
*/
bool cau01(Hashtable& h, int value)
{
    Node* p = new (nothrow) Node({value});
    if (p == nullptr)
        return false;

    int viTri = value % SIZE;           // hàm băm: phương pháp chia
    Bucket& bk = h.bucket[viTri];
    if (bk.pHead == nullptr)
    {
        bk.pHead = p;
        bk.pTail = p;
    }
    else                                // đụng độ: nối tiếp vào cuối bucket
    {
        bk.pTail->pNext = p;
        bk.pTail = p;
    }
    return true;
}

/*Câu 2: Tìm giá trị x trong bảng băm
Input:
    + Hashtable h
    + int x
Output:
    + return bool
*/
bool cau02(Hashtable h, int x)
{
    for (Node* p = h.bucket[x % SIZE].pHead; p != nullptr; p = p->pNext)
        if (p->data == x)
            return true;
    return false;
}

/*Câu 3: Đếm số lượng các giá trị có trong bảng băm
Input:
    + Hashtable h
Output:
    + return int
*/
int cau03(Hashtable h)
{
    int dem = 0;
    for (int i = 0; i < SIZE; i++)
        for (Node* p = h.bucket[i].pHead; p != nullptr; p = p->pNext)
            dem++;
    return dem;
}

// Câu 4
int main()
{
    Hashtable h;
    cau01(h, 19);                                   // 19 % 7 = 5
    cau01(h, 26);                                   // 26 % 7 = 5 (đụng độ)
    cau01(h, 8);                                    //  8 % 7 = 1
    cau01(h, 33);                                   // 33 % 7 = 5 (đụng độ)
    cau01(h, 12);                                   // 12 % 7 = 5 (đụng độ)
                                                    // bucket[1]: 8 ; bucket[5]: 19 26 33 12
    cout << "So gia tri: " << cau03(h) << endl;     // 5
    cout << "Tim 33: " << cau02(h, 33) << endl;     // 1
    cout << "Tim 40: " << cau02(h, 40) << endl;     // 0
    return 0;
}
// ===== END hash =====
