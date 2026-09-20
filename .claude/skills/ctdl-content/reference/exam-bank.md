# Ngân hàng đề CTDL (IT003) — đề thật, luyện tập, thi thử, kèm đáp án đã kiểm chứng

Quy ước: **[THẬT]** = đề/hướng dẫn của trường (PDF scan trong `docs/ctdl/`, đã OCR + đối chiếu ảnh);
**[ARTIFACT]** = đề thi thử trong artifact `https://claude.ai/artifact/BUcXGh6Y78uijEWJ5vyxEd` (không phải đề thật).
Mọi kết quả chạy/mô phỏng đã chạy bằng clang++ (`solutions/*.cpp`). Code đầy đủ: xem cột "Code" — file trong `solutions/`.

---

## A. Đề mẫu cuối kỳ CITD [THẬT] — 90', không tài liệu, làm trên đề

### Phần 1

| Câu | Đề | Đáp án |
|---|---|---|
| 1 | Tại sao khi xây dựng cấu trúc dữ liệu nên dùng **cấp phát động**? | Không cần biết trước số phần tử; thêm/bớt linh hoạt lúc chạy, không bị giới hạn kích thước như mảng tĩnh, chỉ cấp đúng lượng cần (tiết kiệm bộ nhớ). |
| 2 | `bool func(int a[], int n, int value)` dùng `left, right, m = left+(right-left)/2`, so `a[m]` với `value` rồi dời `left/right`: thuật toán gì? Điều kiện? | **Tìm kiếm nhị phân**; mảng `a` phải **đã sắp xếp** (tăng dần) trước khi gọi. |
| 3 | Ý tưởng chọn trực tiếp? | Mỗi vòng tìm phần tử **nhỏ nhất** của vùng chưa sắp xếp rồi **hoán vị** vào đầu vùng đó. |
| 4 | `List l; Node* p=initNode(39); l.head=p; cout<<l.tail->data;` (`head=tail=NULL` mặc định) | **Lỗi runtime (segfault)** — `tail` vẫn NULL, giải tham chiếu NULL. Không phải in 0/39. |
| 5 | `Node* p=initNode(79); cout<<p->data<<endl<<(*p).data<<endl<<p->next<<endl;` | `79` / `79` / `NULL` (in `0` hoặc `0x0` tùy trình biên dịch — clang: `0x0`). |
| 6 | `double* a=new double[10]; a[0]=9.3; a[1]=6.1; cout<<*a;` | `9.3` (`*a ≡ a[0]`). |
| 7 | Như Câu 4 nhưng `cout<<l.head->data<<endl<<l.tail<<endl;` | `39` rồi `NULL` (`0`/`0x0`). |
| 8 | Mô phỏng chọn trực tiếp `90 68 72 32 55 21` (không viết code) | Bảng dưới. |
| 9 | `struct Node{double data; Node* next;}; struct Stack{Node* Top;};` hoàn thành `void push(Stack &s, Node* p)` | `p->next = s.Top; s.Top = p;` (Input: Stack&, Node* đã cấp phát; Output: Top mới) — code: `dethi_mau_viet_ham.cpp` |
| 10 | Tìm nhị phân áp dụng khi nào? Viết hàm tìm giá trị thực trong mảng 1 chiều, mô tả input/output | Khi mảng đã sắp xếp, cần tìm nhanh O(log n). Code: `binarySearch(double a[], int n, double value)` trong `dethi_mau_viet_ham.cpp` |
| 11 | `struct node{float data; node* left; node* right;}; struct tree{node* root;};` hàm tìm giá trị trong BST, **không đệ quy, đúng 1 hàm** | `while (p) { if (value==p->data) return true; p = value<p->data ? p->left : p->right; } return false;` — `dethi_mau_viet_ham.cpp` |

**Câu 8 — chọn trực tiếp `[90 68 72 32 55 21]` (tăng dần):**

| Bước | Vị trí min | Hoán vị | Kết quả |
|---|---|---|---|
| i=0 | 5 | 21, 90 | 21 68 72 32 55 90 |
| i=1 | 3 | 32, 68 | 21 32 72 68 55 90 |
| i=2 | 4 | 55, 72 | 21 32 55 68 72 90 |
| i=3 | 3 | 68, 68 | 21 32 55 68 72 90 |
| i=4 | 4 | 72, 72 | 21 32 55 68 72 90 |

### Phần 2 — Thực hành (Stack)
`struct Node{int data=0; Node* pNext=nullptr;}; struct Stack{Node* pTop=nullptr;};` Câu 1 `push` → bool (thành công/không), Câu 2 lấy ra, Câu 3 đếm,
Câu 4 `main` khởi tạo `12 -95 78 -89 35` (push đúng thứ tự ⇒ `pTop` = 35) rồi gọi kiểm thử. Không cần khai báo thư viện. Code + test: `list_stack_queue.cpp` (namespace `stk`).

---

## B. "Hướng dẫn trình bày" [THẬT] — các ví dụ mẫu thầy

| Ví dụ | Kết quả |
|---|---|
| Tuyến tính tìm 66 trong `16 78 50 66 38` | i=0,1,2 "khác ⇒ chưa tìm thấy"; i=3 "66 bằng 66 ⇒ Đã tìm thấy. Kết thúc." |
| Nhị phân tìm 56 trong `16 23 31 56 62` | B1: L=0,R=4,M=2 (31≠56) · B2: L=3,R=4,M=3 (56=56, thấy) |
| Nhị phân tìm 57 (cùng dãy) | B1 M=2 (31) · B2 L=3,R=4,M=3 (56) · B3 L=4,R=4,M=4 (62) · B4 L=4,R=3 ⇒ **DỪNG vì L phải ≤ R** |
| "Dãy `90 68 72 32 55 21`, tìm 33 nên dùng thuật toán nào?" | **Tuyến tính** — dãy *chưa* sắp xếp (nhị phân/nội suy cần sắp xếp trước, tốn hơn tìm 1 lần). Chạy: 6 bước i=0…5 đều "khác 33", kết luận không có. |
| Chọn trực tiếp `3 2 5 1 4` | i=0: min ở 3, hoán vị 1,3 → `1 2 5 3 4` · i=1: min ở 1, hoán vị 2,2 · i=2: min ở 3, hoán vị 3,5 → `1 2 3 5 4` · i=3: min ở 4, hoán vị 4,5 → `1 2 3 4 5` |
| Chèn trực tiếp `79 39 26 66 55 20` | #1 `39 79 26 66 55 20` · #2 `26 39 79 66 55 20` · #3 `26 39 66 79 55 20` · #4 `26 39 55 66 79 20` · #5 `20 26 39 55 66 79` |
| Đọc code `int a[]={1,3,5,7,9,2,4,6,8}; cout<<*(a+3)+*(a+7);` | `13` (7 + 6) |
| Đọc code `int a=102,b,*p; p=&a; b=(*p)++; cout<<a<<" "<<b;` | `103 102` |

Code in đúng định dạng trên: `algos_trace.cpp`.

---

## C. Đề luyện tập 005 [THẬT] — 10 câu (`IT003_Bai10_Luyen_tap_005.pdf`)

| Câu | Đề | Đáp án |
|---|---|---|
| 1 | `struct Node{float data; Node* pNext;}; struct Stack{Node* pTop;};` viết hàm lấy 1 node ra, trả `true`/`false`; phân tích input/output | `bool pop(Stack& s, float& value)` — rỗng ⇒ `false`; còn lại lưu `value`, `pTop=pTop->pNext`, `delete` ⇒ `true`. Code: `dethi_mau_viet_ham.cpp` (`lt1`) |
| 2 | Chèn trực tiếp **giảm dần** `11 54 37 69 85 74` | #1 `54 11 37 69 85 74` · #2 `54 37 11 69 85 74` · #3 `69 54 37 11 85 74` · #4 `85 69 54 37 11 74` · #5 `85 74 69 54 37 11` |
| 3 | Dãy `88 74 59 58 32 17`: 3.1 thuật toán tìm kiếm nào, vì sao? 3.2 chạy từng bước tìm 32 | 3.1 **Tìm nhị phân** — dãy đã sắp xếp (**giảm dần**, nên đảo dấu so sánh: `a[M] > value ⇒ L = M+1`). 3.2 B1: L=0,R=5,M=2 (59≠32, 59>32 ⇒ L=3) · B2: L=3,R=5,M=4 (32=32, thấy, vị trí 4) |
| 4 | `struct Node{double data; Node* pLeft; Node* pRight;}; struct Tree{Node* pRoot;};` thêm node **không đệ quy**, thành công `true`, trùng thì bỏ qua (`false`) | `dethi_mau_viet_ham.cpp` (`lt4::insertNode`); cần con trỏ cha `pLoca` |
| 5 | `float a=3.6; float* p=new float(0.4); p=&a; *p=5.1; a+=0.5; cout<<"a = "<<a;` | `a = 5.6` |
| 6 | `Node* p=new Node({69,NULL}); p->pNext=new Node({86,NULL}); cout<<p->data;` | `69` |
| 7 | Stack: `s.Top=p1; p3->pNext=s.Top; p2->pNext=s.Top; cout<<s.Top->data;` (p1=9.1, p2=1.8, p3=3.9) | `9.1` (Top không đổi; p2, p3 chỉ trỏ vào p1) |
| 8 | Queue: `q.pRear=q.pFront=p; p->data=7.5; q.pRear->data=9.3; cout<<q.pFront->data;` (p=2.8) | `9.3` (3 con trỏ cùng 1 node) |
| 9 | `L.pHead=initNode(6.3); L.pHead->next=initNode(8.2); cout<<(L.pHead->next)->data;` | `8.2` |
| 10 | `t.pRoot=new Node({6.2,NULL,NULL}); t.pRoot->pLeft=new Node({5.1,..}); t.pRoot->pRight=t.pRoot->pLeft; cout<<t.pRoot->data;` | `6.2` |

---

## D. Đề thực hành [THẬT] — 10 câu mỗi đề

Mọi câu cuối (Câu 10) là `main`/menu + dữ liệu mẫu **50, 75, 25, 30, 10, 90, 70, 60, 30, 70, 90** (có trùng: 30, 70, 90).

| Đề | Câu 1–9 | Code |
|---|---|---|
| **Test01** — BST (60'), `float` | 1 chèn (bỏ qua trùng) · 2 tạo ngẫu nhiên `[512;723]`, số lượng `[50;60]` · 3 tạo từ mảng n phần tử · 4 duyệt NLR/LRN/LNR **in kèm địa chỉ Node/Left/Right** · 5 tìm X trả địa chỉ/NULL · 6 đếm node · 7 in các node nhánh từ 1 node nhập tay (LNR) · 8 đếm node `X < node < Y` · 9 đếm node chẵn/lẻ, so sánh trả `-1/0/1` · 10 menu (Câu 3 dùng mảng demo) | `bst_test01.cpp` |
| **Test02** — QLSV DSLK đơn (70') `{maSV, hoTen, diemMH}` | 1 chèn cuối → bool · 2 xuất · 3 tìm theo mã → địa chỉ/NULL · 4 đếm điểm < TB · 5 điểm TB cả lớp · 6 mã SV **đầu tiên** điểm lớn nhất · 7 các mã SV điểm > 8 · 8 cập nhật điểm theo mã · 9 sao chép sang danh sách mới, **phân tích ý tưởng** · 10 `main` 6 SV: `{123,"Nguyen A",8.8} {124,"Nguyen B",9.7} {125,"Nguyen C",2.9} {126,"Nguyen D",9.7} {127,"Nguyen E",4.8} {128,"Nguyen F",7.5}` (không dùng `cin`, chụp **1 màn hình**) | `qlsv_test02.cpp` |
| **Test03** — Hashtable SIZE=9, nối kết, `int` (60') | 1 hàm băm chia · 2 khởi tạo tự động `[856;988]`, số lượng `[45;95]` · 3 nhập từ mảng 1D · 4 nhập tay (điều kiện dừng tự quy định) · 5 rỗng? · 6 đếm giá trị · 7 tìm X → bool · 8 **max và min trong 1 hàm** · 9 đếm chẵn/lẻ ("`<` true; `=` 1; `>` false" — mơ hồ) · 10 main testcase | `hash_test03.cpp` |

Kết quả cho dữ liệu mẫu (đã assert): BST 8 node, LNR `10 25 30 50 60 70 75 90`, NLR `50 25 10 30 75 70 60 90`, LRN `10 30 25 60 70 90 75 50`;
QLSV: dưới TB = 2 (2.9, 4.8), TB lớp = 7.2333, mã điểm max đầu tiên = **124** (không phải 126), mã > 8 = `123 124 126`;
Hashtable SIZE=9: bucket[0]=`90 90`, [1]=`10`, [3]=`75 30 30`, [5]=`50`, [6]=`60`, [7]=`25 70 70`; 11 giá trị (bảng băm giữ trùng), max 90, min 10, chẵn 9 / lẻ 2.

Điểm mơ hồ đã chọn cách hiểu (nói rõ khi trả lời): Test01 Câu 7 = LNR của **cây con gốc X** (gồm cả X); Test03 Câu 9 dùng mã `-1/0/1` cho `chan<le / = / >` vì "true"≡"1" không phân biệt được `<` và `=`.

---

## E. 3 đề thi thử [ARTIFACT] — đáp án tóm tắt (14 câu/đề: 6 lý thuyết 0.5đ + 4 đọc/mô phỏng 1đ + 4 viết hàm 0.75đ + điểm cộng 0.25đ comment I/O)

Bảng điểm và rubric là của artifact. Nội dung đã đối chiếu với tài liệu thật + chạy code.

**Trả lời chuẩn cho câu lý thuyết (dùng lại cho đề thật):**

| Chủ đề | Ý chính |
|---|---|
| Vì sao cấp phát động? | (xem A.1) |
| `new T[n]` phải `delete[]` | `new[]` cấp dải nhiều phần tử; `delete` (không `[]`) trên mảng = hành vi không xác định, có thể rò rỉ/lỗi runtime |
| Tại sao mảng động vẫn cần biến `soNV`? | Mảng chỉ biết dung lượng đã xin (100), không biết số phần tử đang dùng |
| Chọn trực tiếp | (xem A.3) |
| Vì sao xóa node giữa DSLK đơn cần `prev`? | Chỉ có `pNext` một chiều; phải sửa `prev->pNext = p->pNext` để nối tắt qua node bị xóa |
| Khác biệt DSLK đơn vs đôi | Đôi có thêm `pPre` ⇒ duyệt 2 chiều (duyệt ngược từ `pTail`); nối node phải cập nhật cả `pNext` và `pPre` |
| Stack vs Queue | Stack LIFO, 1 đầu (Top); Queue FIFO, 2 đầu (Front lấy ra, Rear thêm vào) |
| Vì sao Queue cần 2 con trỏ, Stack chỉ 1? | Queue thêm ở Rear, lấy ở Front (2 vị trí khác nhau, cần O(1) cả hai); Stack thêm & lấy cùng Top |
| `push` vs `enQueue` khác gì? | `push` ở `pTop` (cùng chỗ lấy ra); `enQueue` ở `pRear` (lấy ra ở `pFront`) |
| Code `idx = value % Size` + nối vào cuối bucket là gì? Đụng độ? | Bảng băm phương pháp chia, cài đặt **nối kết**; đụng độ ⇒ nối tiếp vào cùng DSLK của bucket, không ghi đè |
| Hệ số tải | tổng phần tử / Size; càng cao ⇒ càng nhiều đụng độ, tìm kiếm càng chậm |
| Tìm kiếm nội suy | Như nhị phân (dãy đã sắp xếp) nhưng vị trí đoán theo công thức nội suy dựa trên tỷ lệ giá trị cần tìm so với 2 đầu mút; nhanh hơn với dữ liệu phân bố đều |
| Đổi hệ 10→cơ số khác bằng Stack | Lấy dư liên tiếp, push; LIFO nên pop ra đúng thứ tự chữ số trái→phải (13→`1101`) |
| Palindrome bằng Stack | Push cả chuỗi, pop ra được chuỗi đảo ngược; so từng vị trí với chuỗi gốc |
| Dùng `std::stack<Node*>`, pop 1 node rồi push 2 con, lặp đến rỗng | Duyệt cây nhị phân **không đệ quy** (mô phỏng stack gọi hàm) — đếm node, NLR, giải phóng cây |
| Vì sao chèn BST không đệ quy cần con trỏ cha? | Khi con trỏ đang xét tới NULL thì đã đi qua node cha; cần biết gắn trái hay phải của cha |
| Đọc code `left/right/m` ⇒ ? | Tìm kiếm nhị phân, mảng đã sắp xếp |

**Đọc code/mô phỏng (đã chạy):**

| Đề | Câu | Đáp án |
|---|---|---|
| Đề 1 | Q7 (`l.tail->data`, tail NULL) | Lỗi runtime |
| Đề 1 | Q8 `*a` với `a[0]=9.3` | `9.3` |
| Đề 1 | Q9 chọn trực tiếp `90 68 72 32 55 21` — min từng vòng | 21, 32, 55, 68, 72 ⇒ `21 32 55 68 72 90` |
| Đề 1 | Q10 nhị phân tìm 27 trong `10 15 18 25 27 35` | (L=0,R=5,M=2) ; (L=3,R=5,M=4, thấy) |
| Đề 2 | Q7 Queue 3 con trỏ cùng node → `9.3` | `9.3` |
| Đề 2 | Q8 nhị phân tìm 56 trong `16 23 31 56 62` | (0,4,2) ; (3,4,3, thấy) |
| Đề 2 | Q9 chèn `79 39 26 66 55 20` | như B |
| Đề 2 | Q10 Queue: enQ 5,8,3; deQ; enQ 6 | Front→Rear: `8 3 6` |
| Đề 3 | Q7 `luongHT` với LuongCB=4.500.000, soNG=20 | 8.100.000 (>8tr ⇒ ×1.05 = 8.505.000; LuongCB<5tr ⇒ ×1.10) = **9.355.500** |
| Đề 3 | Q8 hash `x%10`, thêm 17,27,37,7,97,12,22 | bucket[7] = `17,27,37,7,97` |
| Đề 3 | Q9 đổi 13 sang nhị phân | dư 1,0,1,1 (push theo thứ tự) ⇒ pop: `1101` |
| Đề 3 | Q10 BST thêm 50,75,25,30,10,90, LNR | `10,25,30,50,75,90` |

**Viết hàm** (mỗi đề 4 câu, comment I/O = +0.25): Đề 1 push Stack, addTail DSLK đơn, binarySearch, insertNode BST không đệ quy · Đề 2 enQueue, deQueue,
add Hashtable (nối kết, Bucket{pHead,pTail}, `Bucket* bucket; int Size`), addHead DSLK đôi · Đề 3 `tinhLuong(NhanVien&)`, `kiemTraNgoacHopLe`, `countNodeIterative`, `demDauAm`.
Toàn bộ nằm trong `solutions/` (Stack/Queue/DSLK: `list_stack_queue.cpp`; nhị phân/BST/push: `dethi_mau_viet_ham.cpp`, `bst_test01.cpp`; hashtable: `hash_test03.cpp`;
`tinhLuong` + mảng động NhanVien: `docs/ctdl/bai03_qlnv.cpp`).

**Lưu ý artifact (đã soi lỗi):**
- Đề 3 Câu 12 khai báo `string stack` (biến tên `stack` che tên thư viện khi có `using namespace std`) — chạy được nhưng nên dùng `std::stack<char> st` (`ngoacHopLe` trong `list_stack_queue.cpp`).
- Câu `tinhLuong` in bằng `cout` sẽ ra `9.3555e+06`; dùng `printf("%.1f")` như `bai03_qlnv.cpp`.
- Bảng điểm 3/4/3 và các mốc "≥ 7 điểm" là của artifact, không phải quy chế thi.
- Đề 2 Q11 kiểm rỗng bằng cả `pFront==NULL && pRear==NULL` (khớp `Queue.cpp` thầy); Đề 1 Q11 `push` không cần `if` rỗng (khớp ghi chú thầy: 2 dòng đúng cho mọi trường hợp).

## F. Mảng động & struct (bài `bai03_qlnv.cpp`, `Cau1–4_*.cpp` của thầy)

`NV* arrayNV = new NV[100]; int soNV = 0;` — `*(arrayNV+i)` ≡ `arrayNV[i]`; hàm `loadData(NV*, int& soNV)`, `printArrNV`, `tinhLuong(NV&)`,
`tongLuongCongTy`, `tongLuongDuoi5Trieu`, `timTheoMa`; cuối `delete[] arrayNV; arrayNV = NULL;`. Công thức: `luongHT = LuongCB + soNG*180000`; `>8.000.000` ⇒ `+5%`;
`LuongCB<5.000.000` ⇒ `+10%` (áp lên giá trị đã cộng 5%). Ví dụ thầy: 4.500.000, 20 ⇒ 8.100.000 ⇒ 8.505.000 ⇒ 9.355.500; tổng 3 NV mẫu `{9355500, 9618000, 9286200}` = 28.259.700.
Mảng số thực ngẫu nhiên (`Cau1–4`): `createArray(n,min,max)`, `printArray`, `calculateSum`, `sumAndMulication(arr,n,double* sum,double* mul)` (gọi bằng `&sum,&mul`; khởi tạo `*sum=0,*mul=1`).
