// Cac ham "viet tay tren de" cua De mau cuoi ky CITD (Phan 1 Cau 9-11) va De luyen tap 005 (Cau 1, 4) — GIU DUNG TEN struct/truong cua de.
// (De dung ten khac nhau moi cau: Top/next, pTop/pNext, node/tree lowercase, Tree/Node hoa — chep dung theo de in ra.)
// Tu kiem: clang++ -std=c++17 dethi_mau_viet_ham.cpp -o t && ./t
#include <iostream>
#include <cassert>
using namespace std;

// ---------- De mau Cau 9: struct Node { double data; Node* next; }; struct Stack { Node* Top; };
namespace c9 {
struct Node { double data; Node* next; };
struct Stack { Node* Top; };
/* Cau 9: dua 1 node vao ngan xep.
Input:  Stack& s (ngan xep), Node* p (node da cap phat, p != NULL)
Output: s.Top tro toi p; p->next tro toi dinh cu */
void push(Stack& s, Node* p)
{
    p->next = s.Top;
    s.Top = p;
}
}

// ---------- De mau Cau 10: tim kiem nhi phan mang thuc
/* Cau 10: tim value trong mang 1 chieu theo tim kiem nhi phan.
Tinh huong ap dung: mang DA SAP XEP (tang dan), can tim nhanh nhieu lan — O(log n) thay vi O(n).
Input:  double a[] (da sap xep tang), int n (so phan tu), double value (gia tri can tim)
Output: true neu tim thay, false neu khong */
bool binarySearch(double a[], int n, double value)
{
    int left = 0, right = n - 1;
    while (left <= right)
    {
        int m = left + (right - left) / 2;
        if (a[m] == value) return true;
        if (a[m] < value) left = m + 1;
        else right = m - 1;
    }
    return false;
}

// ---------- De mau Cau 11: struct node { float data; node* left; node* right; }; struct tree { node* root; };
namespace c11 {
struct node { float data; node* left; node* right; };
struct tree { node* root; };
/* Cau 11: tim 1 gia tri trong BST, KHONG de quy, duy nhat 1 ham.
Input:  tree t, float value
Output: true neu co, false neu khong */
bool timKiem(tree t, float value)
{
    node* p = t.root;
    while (p != nullptr)
    {
        if (value == p->data) return true;
        p = (value < p->data) ? p->left : p->right;
    }
    return false;
}
}

// ---------- Luyen_tap_005 Cau 1: struct Node { float data; Node* pNext; }; struct Stack { Node* pTop; };
namespace lt1 {
struct Node { float data; Node* pNext; };
struct Stack { Node* pTop; };
/* Lay 1 node ra khoi Stack.
Input:  Stack& s, float& value (nhan gia tri vua lay)
Output: true neu lay duoc; false neu Stack rong (khi do value khong doi) */
bool pop(Stack& s, float& value)
{
    if (s.pTop == nullptr) return false;
    Node* p = s.pTop;
    value = p->data;
    s.pTop = p->pNext;
    delete p;
    return true;
}
}

// ---------- Luyen_tap_005 Cau 4: struct Node { double data; Node* pLeft; Node* pRight; }; struct Tree { Node* pRoot; };
namespace lt4 {
struct Node { double data; Node* pLeft; Node* pRight; };
struct Tree { Node* pRoot; };
/* Them 1 node vao BST, KHONG de quy. Trung gia tri => bo qua.
Input:  Tree& t, double value
Output: true them thanh cong; false neu trung (hoac khong cap phat duoc) */
bool insertNode(Tree& t, double value)
{
    Node* pGoto = t.pRoot;
    Node* pLoca = nullptr;                       // cha cua pGoto
    while (pGoto != nullptr)
    {
        if (value == pGoto->data) return false;  // trung => bo qua
        pLoca = pGoto;
        pGoto = (value < pGoto->data) ? pGoto->pLeft : pGoto->pRight;
    }
    Node* p = new (nothrow) Node{value, nullptr, nullptr};
    if (p == nullptr) return false;
    if (pLoca == nullptr) t.pRoot = p;
    else if (value < pLoca->data) pLoca->pLeft = p;
    else pLoca->pRight = p;
    return true;
}
}

int main()
{
    c9::Stack s{nullptr};
    c9::push(s, new c9::Node{1.5, nullptr}); c9::push(s, new c9::Node{2.5, nullptr});
    assert(s.Top->data == 2.5 && s.Top->next->data == 1.5 && s.Top->next->next == nullptr);

    double a[] = {1.5, 2.5, 3.5, 7.25, 9.0};
    assert(binarySearch(a, 5, 7.25) && !binarySearch(a, 5, 7.0) && !binarySearch(a, 0, 1));

    c11::tree t{nullptr};
    assert(!c11::timKiem(t, 1));
    t.root = new c11::node{50, nullptr, nullptr};
    t.root->left = new c11::node{25, nullptr, nullptr}; t.root->right = new c11::node{75, nullptr, nullptr};
    assert(c11::timKiem(t, 75) && c11::timKiem(t, 50) && !c11::timKiem(t, 30));

    lt1::Stack st{nullptr};
    st.pTop = new lt1::Node{9.5f, new lt1::Node{1.25f, nullptr}};
    float v = 0;
    assert(lt1::pop(st, v) && v == 9.5f && lt1::pop(st, v) && v == 1.25f && !lt1::pop(st, v) && v == 1.25f);

    lt4::Tree tr{nullptr};
    for (double x : {50.0, 75.0, 25.0, 30.0, 10.0, 90.0}) assert(lt4::insertNode(tr, x));
    assert(!lt4::insertNode(tr, 30.0));
    assert(tr.pRoot->pLeft->pRight->data == 30 && tr.pRoot->pLeft->pLeft->data == 10 && tr.pRoot->pRight->pRight->data == 90);
    cout << "OK dethi_mau_viet_ham\n";
}
