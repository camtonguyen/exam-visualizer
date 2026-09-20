// De thuc hanh Test03_IT003 — Bang bam SIZE = 9, phuong phap NOI KET (moi bucket la 1 danh sach lien ket).
// Tu kiem: clang++ -std=c++17 -DSELFTEST hash_test03.cpp -o t && ./t
#include <iostream>
#include <cstdlib>
#include <ctime>
#include <climits>
#include <cassert>
using namespace std;

const int SIZE = 9;

struct Node { int data; Node* pNext; };
struct Bucket { Node* pHead; Node* pTail; };
struct Hashtable { Bucket bucket[SIZE]; };

Node* initNode(int value) { Node* p = new Node; p->data = value; p->pNext = nullptr; return p; }

void initHashtable(Hashtable& h)
{
    for (int i = 0; i < SIZE; i++) h.bucket[i].pHead = h.bucket[i].pTail = nullptr;
}

/* Cau 1: ham bam phuong phap chia.  Input: int value.  Output: vi tri bucket [0, SIZE-1]
Gia tri am: (value % SIZE + SIZE) % SIZE de khong ra chi so am. */
int hashFun(int value) { return ((value % SIZE) + SIZE) % SIZE; }

/* Them 1 gia tri: bam -> addTail vao bucket tuong ung (dung do => noi tiep vao cung danh sach) */
void add(Hashtable& h, int value)
{
    int idx = hashFun(value);
    Node* p = initNode(value);
    if (h.bucket[idx].pHead == nullptr) h.bucket[idx].pHead = h.bucket[idx].pTail = p;
    else { h.bucket[idx].pTail->pNext = p; h.bucket[idx].pTail = p; }
}

/* Cau 2: khoi tao tu dong — so luong [45;95], gia tri [856;988] (bang bam KHONG loai trung: trung => noi tiep) */
void createRandom(Hashtable& h)
{
    int n = 45 + rand() % (95 - 45 + 1);
    for (int i = 0; i < n; i++) add(h, 856 + rand() % (988 - 856 + 1));
}

/* Cau 3: nhap tu mang 1D n phan tu */
void createFromArray(Hashtable& h, int a[], int n) { for (int i = 0; i < n; i++) add(h, a[i]); }

/* Cau 4: nhap thu cong tu ban phim — dieu kien dung tu quy dinh (o day: nhap -1 de ket thuc) */
void createManual(Hashtable& h)
{
    int x;
    cout << "Nhap so nguyen (nhap -1 de dung): ";
    while (cin >> x && x != -1) add(h, x);
}

/* Cau 5: bang bam rong?  true = rong */
bool isEmpty(Hashtable h)
{
    for (int i = 0; i < SIZE; i++) if (h.bucket[i].pHead != nullptr) return false;
    return true;
}

/* Cau 6: dem tong so gia tri luu tru */
int demGiaTri(Hashtable h)
{
    int dem = 0;
    for (int i = 0; i < SIZE; i++)
        for (Node* p = h.bucket[i].pHead; p != nullptr; p = p->pNext) dem++;
    return dem;
}

/* Cau 7: tim X — chi can duyet DUNG 1 bucket hashFun(X) (day la loi the cua bang bam) */
bool timGiaTri(Hashtable h, int x)
{
    for (Node* p = h.bucket[hashFun(x)].pHead; p != nullptr; p = p->pNext)
        if (p->data == x) return true;
    return false;
}

/* Cau 8: tim max VA min trong 1 ham (tham chieu ra 2 gia tri).  Output: false neu bang rong */
bool timMaxMin(Hashtable h, int& maxV, int& minV)
{
    bool co = false;
    for (int i = 0; i < SIZE; i++)
        for (Node* p = h.bucket[i].pHead; p != nullptr; p = p->pNext)
        {
            if (!co) { maxV = minV = p->data; co = true; }
            else { if (p->data > maxV) maxV = p->data; if (p->data < minV) minV = p->data; }
        }
    return co;
}

/* Cau 9: dem gia tri chan / le.  De bai ghi "<" true; "=" 1; ">" false — CHINH TA MO HO (true va 1 trung nhau),
   nen doi chieu de/hoi giam thi. O day tra int: chan<le => -1, chan==le => 0, chan>le => 1 (giong Test01 Cau 9). */
int demChanLe(Hashtable h, int& chan, int& le)
{
    chan = le = 0;
    for (int i = 0; i < SIZE; i++)
        for (Node* p = h.bucket[i].pHead; p != nullptr; p = p->pNext)
            if (p->data % 2 == 0) chan++; else le++;
    return chan < le ? -1 : (chan == le ? 0 : 1);
}

void printHashtable(Hashtable h)
{
    for (int i = 0; i < SIZE; i++)
    {
        cout << "Bucket[" << i << "]: ";
        for (Node* p = h.bucket[i].pHead; p != nullptr; p = p->pNext) cout << p->data << " ";
        cout << endl;
    }
}

#ifdef SELFTEST
int main()
{
    Hashtable h; initHashtable(h);
    assert(isEmpty(h) && demGiaTri(h) == 0);
    int maxV, minV; assert(!timMaxMin(h, maxV, minV));

    int demo[] = {50, 75, 25, 30, 10, 90, 70, 60, 30, 70, 90};      // Cau 10
    createFromArray(h, demo, 11);
    assert(!isEmpty(h) && demGiaTri(h) == 11);                        // bang bam GIU gia tri trung
    assert(hashFun(50) == 5 && hashFun(75) == 3 && hashFun(90) == 0 && hashFun(-1) == 8);
    assert(timGiaTri(h, 60) && !timGiaTri(h, 61));
    assert(timMaxMin(h, maxV, minV) && maxV == 90 && minV == 10);
    int c, l; assert(demChanLe(h, c, l) == 1 && c == 9 && l == 2);    // le: 75, 25
    // bucket[0] = 90 90 ; bucket[3] = 75 30 30 ; bucket[7] = 25 70 70  (dung thu tu them vao)
    assert(h.bucket[0].pHead->data == 90 && h.bucket[0].pTail->data == 90);
    int order3[] = {75, 30, 30}; int k = 0;
    for (Node* p = h.bucket[3].pHead; p; p = p->pNext) assert(p->data == order3[k++]);
    assert(k == 3);
    int order7[] = {25, 70, 70}; k = 0;
    for (Node* p = h.bucket[7].pHead; p; p = p->pNext) assert(p->data == order7[k++]);
    assert(k == 3);

    Hashtable r; initHashtable(r); srand(1); createRandom(r);
    assert(demGiaTri(r) >= 45 && demGiaTri(r) <= 95);
    cout << "OK hash_test03\n";
}
#else
int main()
{
    srand((unsigned)time(0));
    Hashtable h; initHashtable(h);
    int demo[] = {50, 75, 25, 30, 10, 90, 70, 60, 30, 70, 90};
    createFromArray(h, demo, 11);
    printHashtable(h);
}
#endif
