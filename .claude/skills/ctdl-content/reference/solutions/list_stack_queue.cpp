// DSLK don / DSLK doi / Stack / Queue — khung code chuan theo file cua thay (list.cpp, QLSV_List2.cpp, demo_stackv1.cpp,
// Queue.cpp, inverse_string_stack.cpp) + cac ham hay ra thi. Moi cau truc nam trong 1 namespace de khong trung ten Node/List.
// Doi kieu du lieu: sua `typedef int T;` (de thi dung int / float / double / struct SinhVien...).
// Tu kiem: clang++ -std=c++17 list_stack_queue.cpp -o t && ./t
#include <iostream>
#include <string>
#include <stack>
#include <cassert>
using namespace std;

typedef int T;

// =====================================================================================================
// DSLK DON — 4 buoc: Node -> initNode -> List -> initList
// =====================================================================================================
namespace sll {
struct Node { T data; Node* pNext; };
struct List { Node* pHead; Node* pTail; };

Node* initNode(T value) { Node* p = new Node; p->data = value; p->pNext = nullptr; return p; }
void initList(List& l) { l.pHead = l.pTail = nullptr; }

void addHead(List& l, Node* p)
{
    if (l.pHead == nullptr) l.pHead = l.pTail = p;
    else { p->pNext = l.pHead; l.pHead = p; }
}
void addTail(List& l, Node* p)
{
    if (l.pHead == nullptr) l.pHead = l.pTail = p;
    else { l.pTail->pNext = p; l.pTail = p; }
}
int size(List l) { int n = 0; for (Node* p = l.pHead; p; p = p->pNext) n++; return n; }

bool timGiaTri(List l, T v) { for (Node* p = l.pHead; p; p = p->pNext) if (p->data == v) return true; return false; }

/* Node ke cuoi (thay). Rong hoac 1 node => khong co.  Dung p->pNext->pNext (khong dung pTail->pPre vi la DSLK don) */
bool timNodeKeCuoi(List l, T& value)
{
    if (l.pHead == nullptr || l.pHead == l.pTail) return false;
    Node* p = l.pHead;
    while (p->pNext->pNext != nullptr) p = p->pNext;
    value = p->data;
    return true;
}

/* Xoa dau: nho cap nhat pTail khi danh sach chi con 1 node */
bool removeHead(List& l)
{
    if (l.pHead == nullptr) return false;
    Node* p = l.pHead;
    l.pHead = p->pNext;
    if (l.pHead == nullptr) l.pTail = nullptr;
    delete p;
    return true;
}
/* Xoa cuoi: BAT BUOC co con tro prev (DSLK don khong lui duoc) */
bool removeTail(List& l)
{
    if (l.pHead == nullptr) return false;
    if (l.pHead == l.pTail) return removeHead(l);
    Node* prev = l.pHead;
    while (prev->pNext != l.pTail) prev = prev->pNext;
    delete l.pTail;
    l.pTail = prev;
    prev->pNext = nullptr;
    return true;
}
/* Xoa node dau tien co gia tri v: prev->pNext = p->pNext ("noi tat" qua node bi xoa) */
bool removeValue(List& l, T v)
{
    Node* prev = nullptr;
    for (Node* p = l.pHead; p != nullptr; prev = p, p = p->pNext)
    {
        if (p->data != v) continue;
        if (prev == nullptr) return removeHead(l);
        prev->pNext = p->pNext;
        if (p == l.pTail) l.pTail = prev;
        delete p;
        return true;
    }
    return false;
}
void freeList(List& l) { while (removeHead(l)) {} }
string toString(List l) { string s; for (Node* p = l.pHead; p; p = p->pNext) s += to_string(p->data) + " "; return s; }
}

// =====================================================================================================
// DSLK DOI — them pPre; MOI thao tac noi phai cap nhat CA 2 chieu (quen 1 chieu la loi hay gap nhat)
// =====================================================================================================
namespace dll {
struct Node { Node* pPre; T data; Node* pNext; };
struct List { Node* pHead; Node* pTail; };

Node* initNode(T value) { Node* p = new Node; p->data = value; p->pPre = p->pNext = nullptr; return p; }
void initList(List& l) { l.pHead = l.pTail = nullptr; }

void addHead(List& l, Node* p)
{
    if (l.pHead == nullptr && l.pTail == nullptr) l.pHead = l.pTail = p;
    else { p->pNext = l.pHead; l.pHead->pPre = p; l.pHead = p; }
}
void addTail(List& l, Node* p)
{
    if (l.pHead == nullptr && l.pTail == nullptr) l.pHead = l.pTail = p;
    else { l.pTail->pNext = p; p->pPre = l.pTail; l.pTail = p; }
}
/* Xoa node dau tien co gia tri v — khong can prev rieng vi p->pPre da co san */
bool removeValue(List& l, T v)
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
}
string forward(List l)  { string s; for (Node* p = l.pHead; p; p = p->pNext) s += to_string(p->data) + " "; return s; }
string backward(List l) { string s; for (Node* p = l.pTail; p; p = p->pPre)  s += to_string(p->data) + " "; return s; }
void freeList(List& l) { while (l.pHead) removeValue(l, l.pHead->data); }
}

// =====================================================================================================
// STACK (LIFO) — chi 1 con tro pTop; push = addHead, pop = removeHead. (De mau Phan 2 + Luyen_tap_005 Cau 1)
// =====================================================================================================
namespace stk {
struct Node { T data = 0; Node* pNext = nullptr; };
struct Stack { Node* pTop = nullptr; };

bool isEmpty(Stack s) { return s.pTop == nullptr; }

/* Cau 1 (De mau P2): them phan tu, tra ve trang thai thanh cong.  Input: Stack&, T value.  Output: bool */
bool push(Stack& s, T value)
{
    Node* p = new (nothrow) Node;
    if (p == nullptr) return false;
    p->data = value;
    p->pNext = s.pTop;          // 2 dong nay dung ca khi rong -> KHONG can if/else kiem rong
    s.pTop = p;
    return true;
}
/* Cau 2 / Luyen_tap_005 Cau 1: lay 1 node ra khoi Stack.  Input: Stack&, T& value (nhan gia tri lay ra).
   Output: true neu lay duoc; false neu Stack rong */
bool pop(Stack& s, T& value)
{
    if (s.pTop == nullptr) return false;
    Node* p = s.pTop;
    value = p->data;
    s.pTop = p->pNext;
    delete p;
    return true;
}
/* Cau 3: dem so phan tu */
int count(Stack s) { int n = 0; for (Node* p = s.pTop; p; p = p->pNext) n++; return n; }

/* Chuyen 1 phan tu dinh a sang b (demo_stackv2.cpp — 3 stack A, B, C, "thap Ha Noi" thu cong) */
void diChuyen(Stack& a, Stack& b) { T v; if (pop(a, v)) push(b, v); }

/* Doi he 10 -> he base bang Stack: lay du push vao, pop ra dung thu tu (LIFO). 13 -> "1101" */
string convertBase(int n, int base)
{
    const char* digit = "0123456789ABCDEF";
    if (n == 0) return "0";
    Stack s;
    for (; n != 0; n /= base) push(s, n % base);
    string kq; T d;
    while (pop(s, d)) kq += digit[d];
    return kq;
}
}

// Ung dung Stack dung std::stack (artifact De 3): dat ten bien KHAC `stack` de khong che ten thu vien
bool ngoacHopLe(const string& s)
{
    stack<char> st;
    for (char c : s)
    {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else if (c == ')' || c == '}' || c == ']')
        {
            if (st.empty()) return false;
            char open = st.top(); st.pop();
            if ((c == ')' && open != '(') || (c == '}' && open != '{') || (c == ']' && open != '[')) return false;
        }
    }
    return st.empty();
}
bool doiXung(const string& s)      // palindrome: push het, pop ra = chuoi dao nguoc, so voi chuoi goc
{
    stack<char> st;
    for (char c : s) st.push(c);
    for (char c : s) { if (st.top() != c) return false; st.pop(); }
    return true;
}

// =====================================================================================================
// QUEUE (FIFO) — 2 con tro: enQueue o pRear, deQueue o pFront. (Queue.cpp cua thay)
// =====================================================================================================
namespace que {
struct Node { T data; Node* pNext; };
struct Queue { Node* pFront; Node* pRear; };

Node* initNode(T value) { Node* p = new Node; p->data = value; p->pNext = nullptr; return p; }
void initQueue(Queue& q) { q.pFront = q.pRear = nullptr; }
bool isEmpty(Queue q) { return q.pFront == nullptr && q.pRear == nullptr; }

void enQueue(Queue& q, Node* p)      // = addTail
{
    if (isEmpty(q)) q.pFront = q.pRear = p;
    else { q.pRear->pNext = p; q.pRear = p; }
}
bool deQueue(Queue& q)               // = removeHead; QUEN pRear = NULL khi rong la loi hay gap nhat
{
    if (isEmpty(q)) return false;
    Node* p = q.pFront;
    q.pFront = p->pNext;
    delete p;
    if (q.pFront == nullptr) q.pRear = nullptr;
    return true;
}
T getFront(Queue q) { return q.pFront->data; }
T getRear(Queue q) { return q.pRear->data; }
int size(Queue q) { int n = 0; for (Node* p = q.pFront; p; p = p->pNext) n++; return n; }
string toString(Queue q) { string s; for (Node* p = q.pFront; p; p = p->pNext) s += to_string(p->data) + " "; return s; }
}

int main()
{
    { // DSLK don: thu tu load cua thay — addHead(10), addHead(79), addTail(39), addHead(26), addTail(88) => 26 79 10 39 88
        sll::List l; sll::initList(l);
        sll::addHead(l, sll::initNode(10)); sll::addHead(l, sll::initNode(79)); sll::addTail(l, sll::initNode(39));
        sll::addHead(l, sll::initNode(26)); sll::addTail(l, sll::initNode(88));
        assert(sll::toString(l) == "26 79 10 39 88 ");
        assert(sll::timGiaTri(l, 39) && !sll::timGiaTri(l, 100));
        int v; assert(sll::timNodeKeCuoi(l, v) && v == 39);
        assert(sll::removeValue(l, 79) && sll::toString(l) == "26 10 39 88 ");
        assert(sll::removeTail(l) && l.pTail->data == 39 && l.pTail->pNext == nullptr);
        assert(sll::removeHead(l) && sll::toString(l) == "10 39 ");
        assert(sll::removeValue(l, 39) && l.pTail->data == 10);      // xoa dung node cuoi => pTail phai cap nhat
        assert(sll::removeValue(l, 10) && l.pHead == nullptr && l.pTail == nullptr);
        assert(!sll::removeHead(l) && !sll::removeTail(l));
        sll::List one; sll::initList(one); sll::addHead(one, sll::initNode(1));
        assert(!sll::timNodeKeCuoi(one, v));
        sll::freeList(one);
    }
    { // DSLK doi: QLSV_List2 — addTail 3 node roi addHead => 2 chieu phai khop nhau
        dll::List l; dll::initList(l);
        for (int x : {2, 3, 4}) dll::addTail(l, dll::initNode(x));
        dll::addHead(l, dll::initNode(1));
        assert(dll::forward(l) == "1 2 3 4 " && dll::backward(l) == "4 3 2 1 ");
        assert(dll::removeValue(l, 1) && dll::removeValue(l, 4) && dll::removeValue(l, 3));
        assert(dll::forward(l) == "2 " && dll::backward(l) == "2 " && l.pHead == l.pTail);
        assert(!dll::removeValue(l, 99));
        dll::freeList(l); assert(l.pHead == nullptr && l.pTail == nullptr);
    }
    { // Stack: De mau Phan 2 Cau 4 — push 12 -95 78 -89 35 => top = 35
        stk::Stack s;
        for (int x : {12, -95, 78, -89, 35}) assert(stk::push(s, x));
        assert(stk::count(s) == 5 && s.pTop->data == 35);
        int v; assert(stk::pop(s, v) && v == 35 && stk::count(s) == 4);
        while (stk::pop(s, v)) {}
        assert(stk::isEmpty(s) && !stk::pop(s, v));
        assert(stk::convertBase(13, 2) == "1101" && stk::convertBase(255, 16) == "FF" && stk::convertBase(0, 2) == "0");
        stk::Stack a, b; for (int x : {3, 2, 1}) stk::push(a, x);
        stk::diChuyen(a, b); assert(b.pTop->data == 1 && a.pTop->data == 2);
    }
    assert(ngoacHopLe("{[()]}") && !ngoacHopLe("(]") && !ngoacHopLe("((") && !ngoacHopLe(")") && ngoacHopLe(""));
    assert(doiXung("abcba") && !doiXung("abca"));
    { // Queue: artifact De 2 Cau 10 — enQ 5, 8, 3 ; deQ ; enQ 6 => 8 3 6
        que::Queue q; que::initQueue(q);
        for (int x : {5, 8, 3}) que::enQueue(q, que::initNode(x));
        assert(que::deQueue(q));
        que::enQueue(q, que::initNode(6));
        assert(que::toString(q) == "8 3 6 " && que::getFront(q) == 8 && que::getRear(q) == 6 && que::size(q) == 3);
        while (que::deQueue(q)) {}
        assert(que::isEmpty(q) && q.pRear == nullptr && !que::deQueue(q));
    }
    cout << "OK list_stack_queue\n";
    return 0;
}
