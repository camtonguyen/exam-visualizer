// De thuc hanh Test01_IT003 — Cay nhi phan tim kiem (60 phut). Menu = Cau 10.
// Tu kiem: clang++ -std=c++17 -DSELFTEST bst_test01.cpp -o t && ./t     Chay menu: bo -DSELFTEST
#include <iostream>
#include <vector>
#include <stack>
#include <cstdlib>
#include <ctime>
#include <cassert>
using namespace std;

struct Node { float data; Node* pLeft; Node* pRight; };
struct Tree { Node* pRoot; };

Node* initNode(float value)
{
    Node* p = new Node;
    p->data = value;
    p->pLeft = p->pRight = nullptr;
    return p;
}

void initTree(Tree& t) { t.pRoot = nullptr; }

/* Cau 1: chen node (KHONG de quy). Trung gia tri => bo qua.
Input:  Tree& t, float value
Output: true = chen thanh cong; false = trung (bo qua) */
bool insertNode(Tree& t, float value)
{
    Node* pGoto = t.pRoot;          // con tro "dang xet"
    Node* pLoca = nullptr;          // con tro "cha" di song song (mat cha khi pGoto chay toi NULL)
    while (pGoto != nullptr)
    {
        if (value == pGoto->data) return false;
        pLoca = pGoto;
        pGoto = (value < pGoto->data) ? pGoto->pLeft : pGoto->pRight;
    }
    Node* p = initNode(value);
    if (pLoca == nullptr) t.pRoot = p;                  // cay rong
    else if (value < pLoca->data) pLoca->pLeft = p;
    else pLoca->pRight = p;
    return true;
}

/* Cau 3: tao cay tu mang.  Input: float a[], int n.  Output: t da chen day du (trung bi bo qua) */
void createFromArray(Tree& t, float a[], int n)
{
    for (int i = 0; i < n; i++) insertNode(t, a[i]);
}

/* Cau 2: tao cay tu dong — so luong [50;60], gia tri [512;723].
Luu y: n la so lan CHEN; trung bi bo qua nen so node thuc co the < n. */
void createRandom(Tree& t)
{
    int n = 50 + rand() % (60 - 50 + 1);
    for (int i = 0; i < n; i++) insertNode(t, (float)(512 + rand() % (723 - 512 + 1)));
}

/* Cau 4: duyet NLR / LRN / LNR, in kem dia chi node, Left, Right */
void inNode(Node* p)
{
    cout << p->data << " [node=" << p << " left=" << p->pLeft << " right=" << p->pRight << "]\n";
}
void duyetNLR(Node* p) { if (p) { inNode(p); duyetNLR(p->pLeft); duyetNLR(p->pRight); } }
void duyetLRN(Node* p) { if (p) { duyetLRN(p->pLeft); duyetLRN(p->pRight); inNode(p); } }
void duyetLNR(Node* p) { if (p) { duyetLNR(p->pLeft); inNode(p); duyetLNR(p->pRight); } }

/* LNR khong de quy (theo demo_tree_v1.cpp cua thay) — "Left_full -> xu ly -> Right" */
void duyetLNR_stack(Tree t, vector<float>& out)
{
    stack<Node*> s;
    Node* p = t.pRoot;
    while (p != nullptr || !s.empty())
    {
        while (p != nullptr) { s.push(p); p = p->pLeft; }
        p = s.top(); s.pop();
        out.push_back(p->data);
        p = p->pRight;
    }
}

/* Cau 5: tim X.  Output: dia chi node, nullptr neu khong co */
Node* timKiem(Tree t, float x)
{
    Node* p = t.pRoot;
    while (p != nullptr && p->data != x)
        p = (x < p->data) ? p->pLeft : p->pRight;
    return p;
}

/* Cau 6: dem toan bo node */
int demNode(Node* p) { return p == nullptr ? 0 : 1 + demNode(p->pLeft) + demNode(p->pRight); }
int demNode(Tree t) { return demNode(t.pRoot); }

/* Cau 7: in cac node nhanh cua node X (chinh no + cay con) theo LNR.
De bai mo ho — dang hieu la "cay con goc X"; neu de yeu cau bo chinh X thi bo lenh in cua goc. */
void inNhanhTuNode(Tree t, float x)
{
    Node* p = timKiem(t, x);
    if (p == nullptr) { cout << "Khong tim thay " << x << endl; return; }
    duyetLNR(p);
}

/* Cau 8: dem node co X < gia tri < Y */
int demTrongKhoang(Node* p, float X, float Y)
{
    if (p == nullptr) return 0;
    return (p->data > X && p->data < Y ? 1 : 0) + demTrongKhoang(p->pLeft, X, Y) + demTrongKhoang(p->pRight, X, Y);
}
int demTrongKhoang(Tree t, float X, float Y) { return demTrongKhoang(t.pRoot, X, Y); }

/* Cau 9: dem node chan va le (dua vao phan nguyen). Tra ve: chan < le => -1 ; = => 0 ; > => 1 */
void demChanLe(Node* p, int& chan, int& le)
{
    if (p == nullptr) return;
    if ((int)p->data % 2 == 0) chan++; else le++;
    demChanLe(p->pLeft, chan, le);
    demChanLe(p->pRight, chan, le);
}
int demChanLe(Tree t, int& chan, int& le)
{
    chan = le = 0;
    demChanLe(t.pRoot, chan, le);
    return chan < le ? -1 : (chan == le ? 0 : 1);
}

#ifdef SELFTEST
void layLNR(Node* p, vector<float>& v) { if (p) { layLNR(p->pLeft, v); v.push_back(p->data); layLNR(p->pRight, v); } }

int main()
{
    Tree t; initTree(t);
    float demo[] = {50, 75, 25, 30, 10, 90, 70, 60, 30, 70, 90};   // Cau 10 (co trung: 30, 70, 90)
    createFromArray(t, demo, 11);

    vector<float> v; layLNR(t.pRoot, v);
    assert((v == vector<float>{10, 25, 30, 50, 60, 70, 75, 90}));  // LNR luon tang dan
    vector<float> v2; duyetLNR_stack(t, v2); assert(v == v2);
    assert(demNode(t) == 8);
    assert(!insertNode(t, 50) && insertNode(t, 55) && demNode(t) == 9);
    assert(timKiem(t, 60) != nullptr && timKiem(t, 61) == nullptr);
    assert(demTrongKhoang(t, 25, 75) == 5);                         // 30 50 55 60 70
    int c, l; assert(demChanLe(t, c, l) == 1 && c == 6 && l == 3);  // chan: 50 30 10 90 70 60 ; le: 75 25 55

    Tree r; initTree(r); srand(1); createRandom(r);
    assert(demNode(r) >= 1 && demNode(r) <= 60);
    cout << "OK bst_test01\n";
    return 0;
}
#else
int main()
{
    srand((unsigned)time(0));
    Tree t; initTree(t);
    while (true)
    {
        cout << "\n2.Tao ngau nhien 3.Tao tu mang demo 4.Duyet NLR/LRN/LNR 5.Tim X 6.Dem node\n"
                "7.In nhanh tu node 8.Dem X<node<Y 9.Dem chan/le 0.Thoat\nChon: ";
        int c; cin >> c;
        if (c == 0) break;
        float x, y;
        switch (c)
        {
        case 2: createRandom(t); cout << "So node: " << demNode(t) << endl; break;
        case 3: { float demo[] = {50, 75, 25, 30, 10, 90, 70, 60, 30, 70, 90}; createFromArray(t, demo, 11); break; }
        case 4: cout << "NLR:\n"; duyetNLR(t.pRoot); cout << "LRN:\n"; duyetLRN(t.pRoot); cout << "LNR:\n"; duyetLNR(t.pRoot); break;
        case 5: cout << "X = "; cin >> x; { Node* p = timKiem(t, x); if (p) cout << "Dia chi: " << p << endl; else cout << "NULL\n"; } break;
        case 6: cout << "So node: " << demNode(t) << endl; break;
        case 7: cout << "Node = "; cin >> x; inNhanhTuNode(t, x); break;
        case 8: cout << "X, Y = "; cin >> x >> y; cout << demTrongKhoang(t, x, y) << endl; break;
        case 9: { int ch, le; int r = demChanLe(t, ch, le); cout << "chan=" << ch << " le=" << le << " -> " << r << endl; break; }
        default: cout << "Khong hop le\n";
        }
    }
    return 0;
}
#endif
