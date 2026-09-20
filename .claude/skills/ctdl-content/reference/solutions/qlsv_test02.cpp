// De thuc hanh Test02_IT003 (De 02, 70 phut) — QLSV bang danh sach lien ket DON.
// Quy dinh de: comment Input/Output truoc moi ham (thieu -0.25); ham KHONG in (khong phai ham xuat) thi CAM dung cout.
// Tu kiem: clang++ -std=c++17 -DSELFTEST qlsv_test02.cpp -o t && ./t
#include <iostream>
#include <string>
#include <vector>
#include <new>
#include <cassert>
#include <cmath>
using namespace std;

struct SinhVien
{
    int maSV;
    string hoTen;     // de cho phep char* hoTen; dung string cho an toan bo nho
    float diemMH;
};
typedef SinhVien SV;

struct Node { SV data; Node* pNext; };
struct List { Node* pHead; Node* pTail; };

void initList(List& l) { l.pHead = l.pTail = nullptr; }

/* Cau 1: chen node chua SV vao CUOI danh sach
Input:  List& l, SV sv
Output: true = thanh cong; false = that bai (khong cap phat duoc node) */
bool addTail(List& l, SV sv)
{
    Node* p = new (nothrow) Node{sv, nullptr};
    if (p == nullptr) return false;
    if (l.pHead == nullptr) l.pHead = l.pTail = p;
    else { l.pTail->pNext = p; l.pTail = p; }
    return true;
}

/* Cau 2: xuat danh sach (ham duoc phep cout) */
void printList(List l)
{
    for (Node* p = l.pHead; p != nullptr; p = p->pNext)
        cout << p->data.maSV << " | " << p->data.hoTen << " | " << p->data.diemMH << endl;
}

/* Cau 3: tim SV theo ma.  Output: dia chi node, NULL neu khong co */
Node* timTheoMa(List l, int maSV)
{
    for (Node* p = l.pHead; p != nullptr; p = p->pNext)
        if (p->data.maSV == maSV) return p;
    return nullptr;
}

/* Cau 4: dem SV co diem duoi trung binh (< 5) */
int demDuoiTB(List l)
{
    int dem = 0;
    for (Node* p = l.pHead; p != nullptr; p = p->pNext)
        if (p->data.diemMH < 5) dem++;
    return dem;
}

/* Cau 5: diem trung binh ca lop.  Danh sach rong => tra 0 (tranh chia cho 0) */
float diemTBLop(List l)
{
    float tong = 0;
    int n = 0;
    for (Node* p = l.pHead; p != nullptr; p = p->pNext) { tong += p->data.diemMH; n++; }
    return n == 0 ? 0 : tong / n;
}

/* Cau 6: ma SV DAU TIEN co diem lon nhat.  So sanh '>' (KHONG '>=') de giu SV xuat hien truoc.
Output: maSV; -1 neu danh sach rong */
int maSVDiemMax(List l)
{
    if (l.pHead == nullptr) return -1;
    Node* pMax = l.pHead;
    for (Node* p = l.pHead->pNext; p != nullptr; p = p->pNext)
        if (p->data.diemMH > pMax->data.diemMH) pMax = p;
    return pMax->data.maSV;
}

/* Cau 7: cac ma SV co diem > 8.  Output: vector<int> (khong cout trong ham) */
vector<int> maSVTren8(List l)
{
    vector<int> kq;
    for (Node* p = l.pHead; p != nullptr; p = p->pNext)
        if (p->data.diemMH > 8) kq.push_back(p->data.maSV);
    return kq;
}

/* Cau 8: cap nhat diem theo ma.  Output: true neu tim thay & cap nhat */
bool capNhatDiem(List& l, int maSV, float diemMoi)
{
    Node* p = timTheoMa(l, maSV);
    if (p == nullptr) return false;
    p->data.diemMH = diemMoi;
    return true;
}

/* Cau 9: sao chep sang danh sach moi.
Y tuong: DUYET danh sach nguon, moi node nguon -> CAP PHAT node MOI chua ban sao du lieu roi addTail vao dich.
KHONG gan dst = src (sao chep nong: 2 danh sach dung chung node, xoa 1 ben hong ben kia). */
bool copyList(List src, List& dst)
{
    initList(dst);
    for (Node* p = src.pHead; p != nullptr; p = p->pNext)
        if (!addTail(dst, p->data)) return false;
    return true;
}

void freeList(List& l)
{
    while (l.pHead != nullptr) { Node* p = l.pHead; l.pHead = p->pNext; delete p; }
    l.pTail = nullptr;
}

// Cau 10: du lieu de bai (khong dung cin)
List taoDS6SV()
{
    List l; initList(l);
    SV ds[] = {{123, "Nguyen A", 8.8f}, {124, "Nguyen B", 9.7f}, {125, "Nguyen C", 2.9f},
               {126, "Nguyen D", 9.7f}, {127, "Nguyen E", 4.8f}, {128, "Nguyen F", 7.5f}};
    for (SV sv : ds) addTail(l, sv);
    return l;
}

#ifdef SELFTEST
int main()
{
    List l = taoDS6SV();
    assert(timTheoMa(l, 125) != nullptr && timTheoMa(l, 999) == nullptr);
    assert(demDuoiTB(l) == 2);
    assert(fabs(diemTBLop(l) - 43.4f / 6) < 1e-4);
    assert(maSVDiemMax(l) == 124);                                   // 124 va 126 cung 9.7 -> lay 124 (dau tien)
    assert((maSVTren8(l) == vector<int>{123, 124, 126}));
    assert(capNhatDiem(l, 125, 6.0f) && demDuoiTB(l) == 1 && !capNhatDiem(l, 999, 1));
    List c; assert(copyList(l, c));
    assert(c.pHead != l.pHead && c.pHead->data.maSV == 123 && c.pTail->data.maSV == 128);
    freeList(c);
    assert(c.pHead == nullptr && l.pHead != nullptr);                // xoa ban sao khong anh huong goc
    List rong; initList(rong);
    assert(diemTBLop(rong) == 0 && maSVDiemMax(rong) == -1);
    freeList(l);
    cout << "OK qlsv_test02\n";
}
#else
int main()
{
    List l = taoDS6SV();
    printList(l);
    cout << "Dem duoi TB: " << demDuoiTB(l) << "\nDiem TB lop: " << diemTBLop(l) << "\nMa SV diem max: " << maSVDiemMax(l) << endl;
    for (int ma : maSVTren8(l)) cout << ma << " ";
    cout << endl;
    freeList(l);
}
#endif
