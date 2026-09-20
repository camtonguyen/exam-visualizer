// Tim kiem & sap xep — chay tung buoc theo DUNG dinh dang de thi (IT003_Bai09_Huong_Dan_Trinh_Bay.pdf).
// Bien dich + tu kiem: g++ -std=c++17 algos_trace.cpp -o algos && ./algos   (assert sai => dung ngay)
#include <iostream>
#include <cassert>
using namespace std;

void printArr(int a[], int n)
{
    for (int i = 0; i < n; i++) cout << a[i] << " ";
    cout << endl;
}

/* Tim kiem tuyen tinh — day BAT KY (chua sap xep)
Input:  int a[], int n, int value
Output: vi tri dau tien tim thay, -1 neu khong co */
int linearSearch(int a[], int n, int value, bool trace = false)
{
    for (int i = 0; i < n; i++)
    {
        if (trace) cout << "Buoc i = " << i << ": " << a[i] << (a[i] == value ? " bang " : " khac ") << value
                        << (a[i] == value ? " => Da tim thay" : " => chua tim thay") << endl;
        if (a[i] == value) return i;
    }
    return -1;
}

/* Tim kiem nhi phan — day DA SAP XEP (asc = tang dan, !asc = giam dan)
Input:  int a[], int n, int value, bool asc
Output: vi tri tim thay, -1 neu khong co */
int binarySearch(int a[], int n, int value, bool asc = true, bool trace = false)
{
    int left = 0, right = n - 1, step = 1;
    while (left <= right)                       // DUNG khi L > R
    {
        int m = left + (right - left) / 2;
        if (trace) cout << "Buoc " << step++ << ": L = " << left << " R = " << right << " => M = " << m
                        << " => a[M] = " << a[m] << (a[m] == value ? " = " : " != ") << value
                        << (a[m] == value ? " tim thay" : " chua tim thay") << endl;
        if (a[m] == value) return m;
        bool goRight = asc ? (a[m] < value) : (a[m] > value);   // day giam dan: dao dau so sanh
        if (goRight) left = m + 1; else right = m - 1;
    }
    if (trace) cout << "Buoc " << step << ": L = " << left << " R = " << right << " => DUNG vi L phai <= R" << endl;
    return -1;
}

/* Tim kiem noi suy — day tang dan, phan bo deu (cong thuc noi suy chuan, KHONG co trong PDF de thi)
pos = L + (value - a[L]) * (R - L) / (a[R] - a[L]) */
int interpolationSearch(int a[], int n, int value, bool trace = false)
{
    int left = 0, right = n - 1;
    while (left <= right && value >= a[left] && value <= a[right])
    {
        if (a[left] == a[right]) return a[left] == value ? left : -1;   // tranh chia 0
        int pos = left + (long long)(value - a[left]) * (right - left) / (a[right] - a[left]);
        if (trace) cout << "L = " << left << " R = " << right << " => pos = " << pos << " a[pos] = " << a[pos] << endl;
        if (a[pos] == value) return pos;
        if (a[pos] < value) left = pos + 1; else right = pos - 1;
    }
    return -1;
}

/* Sap xep chon truc tiep. Dinh dang de thi: "Buoc i: (Vi tri min = k). Hoan vi <min>, <a[i] cu>. Ket qua: ..." */
void selectionSort(int a[], int n, bool asc = true, bool trace = false)
{
    for (int i = 0; i < n - 1; i++)
    {
        int best = i;
        for (int j = i + 1; j < n; j++)
            if (asc ? a[j] < a[best] : a[j] > a[best]) best = j;
        if (trace) cout << "Buoc i = " << i << ": (Vi tri " << (asc ? "min" : "max") << " = " << best
                        << "). Hoan vi " << a[best] << ", " << a[i] << ". Ket qua: ";
        swap(a[i], a[best]);                    // guide van ghi "Hoan vi 2, 2" khi best == i
        if (trace) printArr(a, n);
    }
}

/* Sap xep chen truc tiep. "Lan #k" = xet phan tu a[k], dich cac phan tu lon hon (asc) sang phai roi chen */
void insertionSort(int a[], int n, bool asc = true, bool trace = false)
{
    for (int i = 1; i < n; i++)
    {
        int x = a[i], j = i - 1;
        while (j >= 0 && (asc ? a[j] > x : a[j] < x))
        {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = x;
        if (trace) { cout << "Lan #" << i << " (xet " << x << "): "; printArr(a, n); }
    }
}

int main()
{
    // Huong_Dan_Trinh_Bay: tuyen tinh tim 66 trong 16 78 50 66 38 -> tim thay tai i=3
    int lin[] = {16, 78, 50, 66, 38};
    cout << "--- Tuyen tinh tim 66:\n";       assert(linearSearch(lin, 5, 66, true) == 3);
    // De mau Cau 8/guide: day 90 68 72 32 55 21 tim 33 -> day CHUA sap xep => tuyen tinh, khong tim thay
    int raw[] = {90, 68, 72, 32, 55, 21};
    cout << "--- Tuyen tinh tim 33:\n";       assert(linearSearch(raw, 6, 33, true) == -1);

    // Guide: nhi phan 16 23 31 56 62 tim 56 (2 buoc) va 57 (4 buoc, dung vi L > R)
    int bs[] = {16, 23, 31, 56, 62};
    cout << "--- Nhi phan tim 56:\n";         assert(binarySearch(bs, 5, 56, true, true) == 3);
    cout << "--- Nhi phan tim 57:\n";         assert(binarySearch(bs, 5, 57, true, true) == -1);
    // Artifact De 1 Cau 10: 10 15 18 25 27 35 tim 27 -> L=0,R=5,M=2 ; L=3,R=5,M=4
    int bs2[] = {10, 15, 18, 25, 27, 35};
    cout << "--- Nhi phan tim 27:\n";         assert(binarySearch(bs2, 6, 27, true, true) == 4);
    // Luyen_tap_005 Cau 3: day GIAM dan 88 74 59 58 32 17 tim 32 -> nhi phan (dao dau so sanh)
    int desc[] = {88, 74, 59, 58, 32, 17};
    cout << "--- Nhi phan (giam dan) tim 32:\n"; assert(binarySearch(desc, 6, 32, false, true) == 4);

    cout << "--- Noi suy tim 56:\n";          assert(interpolationSearch(bs, 5, 56, true) == 3);
    assert(interpolationSearch(bs, 5, 57) == -1 && interpolationSearch(bs, 5, 10) == -1);

    // Guide: chon truc tiep 3 2 5 1 4
    int s0[] = {3, 2, 5, 1, 4};
    cout << "--- Chon (guide) 3 2 5 1 4:\n";  selectionSort(s0, 5, true, true);
    // De mau Cau 8: 90 68 72 32 55 21
    int s1[] = {90, 68, 72, 32, 55, 21};
    cout << "--- Chon (De mau Cau 8):\n";     selectionSort(s1, 6, true, true);
    int want[] = {21, 32, 55, 68, 72, 90};
    for (int i = 0; i < 6; i++) assert(s1[i] == want[i]);

    // Guide: chen truc tiep 79 39 26 66 55 20
    int i1[] = {79, 39, 26, 66, 55, 20};
    cout << "--- Chen (guide):\n";            insertionSort(i1, 6, true, true);
    int want2[] = {20, 26, 39, 55, 66, 79};
    for (int i = 0; i < 6; i++) assert(i1[i] == want2[i]);
    // Luyen_tap_005 Cau 2: chen GIAM dan 11 54 37 69 85 74
    int i2[] = {11, 54, 37, 69, 85, 74};
    cout << "--- Chen giam dan (Luyen tap 005 Cau 2):\n"; insertionSort(i2, 6, false, true);
    int want3[] = {85, 74, 69, 54, 37, 11};
    for (int i = 0; i < 6; i++) assert(i2[i] == want3[i]);

    cout << "OK algos_trace\n";
    return 0;
}
