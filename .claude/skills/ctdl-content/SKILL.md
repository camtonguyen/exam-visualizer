---
name: ctdl-content
description: Use whenever solving, checking, or writing practice/exam material for IT003 Cấu trúc Dữ liệu & Giải thuật (CTDL) in this repo — con trỏ & cấp phát động, DSLK đơn/đôi, Stack, Queue, Bảng băm (hashtable nối kết), cây nhị phân tìm kiếm, tìm kiếm (tuyến tính/nhị phân/nội suy), sắp xếp (chọn/chèn). Packages the real exam formats, verified answers, canonical C++ code and grading rules so you don't re-read the scanned PDFs or re-derive traces.
---

# CTDL (IT003) domain knowledge

Skill **riêng của môn CTDL** (id môn: `ctdl`). Môn khác có skill riêng — xem
`docs/ADDING_A_SUBJECT.md`. Đây là môn **lập trình C++ trên giấy/máy**, không phải môn
tính toán như XSTK/CTRR: "giải đề" = trả lời lý thuyết ngắn, đọc code ghi kết quả, chạy
tay thuật toán, **viết hàm C++** đúng khung của thầy.

## Nguồn & mức tin cậy

| Nguồn | Là gì | Tin cậy |
|---|---|---|
| `docs/ctdl/IT003_Bai09_De_CuoiKy_CITD_De_mau.pdf` | **Đề mẫu cuối kỳ CITD thật** (90', Phần 1 viết tay + Phần 2 thực hành Stack) | Đề thật — PDF là ảnh scan, đã OCR + đối chiếu ảnh |
| `docs/ctdl/IT003_Bai09_Huong_Dan_Trinh_Bay.pdf` | Cách trình bày bài (chạy từng bước tìm kiếm/sắp xếp, đọc code) | Thật — chuẩn định dạng câu trả lời |
| `docs/ctdl/IT003_Bai10_Luyen_tap_005.pdf` | "Mẫu ôn tập" 10 câu (giống đề cuối kỳ) | Thật |
| `docs/ctdl/Test01/02/03_IT003.pdf` | 3 đề **thực hành** mẫu: BST (60'), QLSV DSLK đơn (70'), Hashtable SIZE=9 (60') | Thật |
| `docs/ctdl/*.cpp` (15 file) | Code mẫu thầy: `list.cpp`, `Queue.cpp`, `demo_stackv1/v2.cpp`, `inverse_string_stack.cpp`, `demo_tree_v1.cpp`, `hashtable_*.cpp` (4 bản), `buoi4_qlsv*.cpp`, `QLSV_List2.cpp` (DSLK đôi), `bai03_qlnv.cpp` (mảng động), `Cau1-4_*.cpp` (mảng động + con trỏ) | **Chuẩn khung code** — bám đúng tên/thứ tự bước |
| Artifact `https://claude.ai/artifact/BUcXGh6Y78uijEWJ5vyxEd` | 3 đề **thi thử tự chấm** (14 câu/đề, rubric) — **do người khác dựng, bám dạng đề thật, KHÔNG phải đề thật** | Đã đối chiếu: đáp án đúng; xem "Lưu ý artifact" ở `reference/exam-bank.md` |

Mọi đáp án số/kết quả dưới đây đã **chạy thật bằng clang++** (xem `reference/solutions/`,
mỗi file tự kiểm bằng `assert`). Đừng suy đoán lại — chạy lại file nếu nghi ngờ.

## Cấu trúc đề (đề thật)

- **Cuối kỳ CITD, 90', không tài liệu, làm trực tiếp trên đề.** Phần 1 (viết tay): ~11 câu
  gồm lý thuyết ngắn ("Tại sao nên cấp phát động?", "ý tưởng chọn trực tiếp?"), nhận diện
  thuật toán từ code (Câu 2 = tìm kiếm nhị phân + điều kiện đã sắp xếp), **đọc code ghi kết
  quả** (Câu 4–7), **mô phỏng thuật toán không viết code** (Câu 8), **viết hàm** trên giấy
  (push Stack Câu 9, tìm nhị phân Câu 10, tìm trong BST không đệ quy Câu 11 — luôn kèm
  "**mô tả input và output trước khi viết hàm**"). Phần 2 thực hành: viết hàm Stack
  (thêm→bool, lấy ra, đếm) + `main` khởi tạo `12 -95 78 -89 35`.
- **Thực hành 60–70'** (Test01/02/03): một cấu trúc, ~10 câu, câu cuối là `main`/menu với
  dữ liệu cho sẵn. Quy định: **thiếu comment Input/Output trước hàm: −0.25**; hàm không phải
  hàm xuất **không được `cout`**; chương trình không chạy **−3**; nộp trễ **−1**; trao đổi code /
  phát tán đề / dùng code trên mạng **= 0 điểm**. File nộp `Ca0x_STT_MSSV_HoVaTen_De0x.cpp`.
- Nội dung thi (nguyên văn "Hướng dẫn trình bày"): DSLK đơn/đôi với **data là struct**
  (SinhVien, NhanVien, HoaDon…), Stack, Queue, Hashtable, BST, thuật toán tìm kiếm & sắp
  xếp; đọc code phủ **cấp phát động của mọi kiểu** (xem lại slide Buổi 1).
- Điểm từng câu **không có** trong các PDF (chỉ có phạt thực hành ở trên). Bảng điểm
  3/4/3 (6 câu×0.5 + 4×1 + 4×0.75) là của artifact, đừng nói là điểm đề thật.

## 6 dạng câu → cách làm

1. **Lý thuyết ngắn** → 1–2 câu đúng ý chính (bảng "Trả lời chuẩn" ở `reference/exam-bank.md`).
2. **Nhận diện thuật toán từ code** → dấu hiệu: `left/right` + `m=(l+r)/2` = nhị phân (điều kiện:
   mảng **đã sắp xếp**); `% Size` + bucket = bảng băm nối kết; `std::stack` + pop rồi push 2 con
   = duyệt cây không đệ quy; `min` rồi hoán vị = chọn trực tiếp.
3. **Đọc code ghi kết quả** → vẽ ô nhớ, đánh dấu "con trỏ nào trỏ tới node nào". Danh sách bẫy bên dưới.
4. **Mô phỏng từng bước** → đúng định dạng thầy (bảng dưới). Chọn thuật toán trước nếu đề hỏi
   ("tìm 33 trong dãy chưa sắp xếp" → **tuyến tính**; dãy giảm dần → nhị phân có đảo dấu so sánh).
5. **Viết hàm trên giấy** → comment Input/Output → khung chuẩn ở `reference/solutions/`.
6. **Thực hành** → đọc thẳng file lời giải tương ứng (bảng cuối trang).

## Định dạng chạy từng bước (theo `Huong_Dan_Trinh_Bay.pdf` — dùng đúng chữ này)

- **Tuyến tính** (tìm 66 trong `16 78 50 66 38`): `Bước i = 0: 16 khác 66 => chưa tìm thấy` … `Bước i = 3: 66 bằng 66 => Đã tìm thấy. Kết thúc.`
- **Nhị phân**: mỗi bước ghi `L, R => M = (L+R)/2 => a[M] ?= value`. `a[M] < value` ⇒ `L = M+1`; `a[M] > value` ⇒ `R = M−1`. Không thấy: bước cuối **`DỪNG vì L phải <= R`** (`L=4, R=3` trong ví dụ tìm 57).
- **Chọn trực tiếp**: `Bước i = k: (Vị trí min = j). Hoán vị <min>, <a[i] cũ>. Kết quả: …` — ghi hoán vị **kể cả** khi `j == i` ("Hoán vị 2, 2"). n phần tử ⇒ n−1 bước (i = 0…n−2).
- **Chèn trực tiếp**: bảng `Đầu vào / Lần #1 … Lần #(n−1)`; "Lần #k" = xét `a[k]`, dịch các phần tử lớn hơn sang phải rồi chèn; tô vùng đã sắp xếp `a[0..k]`.

## Kiến thức lõi theo chủ đề (đã đối chiếu code thầy)

**Con trỏ & cấp phát động.** `new T` / `new T[n]` ↔ `delete` / `delete[]` (sai cặp = UB); mảng động không tự biết
số phần tử đang dùng ⇒ cần biến đếm riêng (`soNV`). `*a ≡ a[0]`, `*(a+k) ≡ a[k]`. `(*p)++` tăng **giá trị**, trả giá trị cũ.
Cấp phát mảng động + random `[min,max]`: `min + (double)rand()/RAND_MAX*(max-min)`, làm tròn `round(x*100)/100`, `srand(time(0))`;
số nguyên `min + rand() % (max-min+1)`. Truyền tham chiếu ra nhiều kết quả: `int& duong` hoặc con trỏ `double* sum` (gọi `&sum`).
**Rò rỉ**: `double* a = new double[n]; a = createArray(...)` làm mất mảng đầu (code thầy vẫn viết vậy — đừng bắt chước khi viết mới).
`cout` in `float 9355500` ra `9.3555e+06` — in tiền dùng `printf("%.1f")`/`fixed << setprecision`.

**DSLK đơn** (khung 4 bước: `Node` → `initNode` → `List{pHead,pTail}` → `initList`). `addHead`: rỗng thì gán cả head & tail, không rỗng
`p->pNext = pHead; pHead = p`. `addTail`: `pTail->pNext = p; pTail = p`. Kiểm rỗng bằng `pHead==NULL` (hoặc cả hai). Xóa 1 node cần **`prev`**
(`prev->pNext = p->pNext`); xóa node cuối/đầu duy nhất phải cập nhật **`pTail`/`pHead = NULL`**. Node kế cuối: `while (p->pNext->pNext != NULL)`,
loại trường hợp rỗng/1 node trước. Data là struct: `p->data.diemTB` (chấm sau `data`, mũi tên sau con trỏ).

**DSLK đôi**: thêm `pPre`; **mỗi lệnh nối phải cập nhật cả 2 chiều** (`addHead`: `p->pNext=pHead; pHead->pPre=p`; `addTail`: `pTail->pNext=p; p->pPre=pTail`).
Duyệt ngược từ `pTail` bằng `pPre` — DSLK đơn không làm được.

**Stack (LIFO)**: 1 con trỏ `pTop`; `push` = addHead (**2 dòng, không cần if rỗng**), `pop` = removeHead + `delete`. Ứng dụng có trong tài liệu:
đổi hệ 10→2/16 (push dư, pop ngược thứ tự: 13→`1101`), đảo chuỗi từng từ (`inverse_string_stack.cpp`), palindrome, ngoặc hợp lệ, 3 stack A/B/C (`diChuyen`, kiểu tháp Hà Nội thủ công).

**Queue (FIFO)**: 2 con trỏ; `enQueue` = addTail ở `pRear`, `deQueue` = removeHead ở `pFront`; **sau khi lấy hết phải `pRear = NULL`** (lỗi hay gặp).
Vì sao cần 2 con trỏ: thêm và lấy ở 2 đầu khác nhau, cần O(1) cho cả hai.

**Bảng băm nối kết**: `Bucket{pHead,pTail}`, `h(x) = x % Size` (phương pháp chia); đụng độ ⇒ nối tiếp vào **cùng** DSLK của bucket (không ghi đè); bảng băm **giữ giá trị trùng**
(khác BST). Tìm kiếm chỉ duyệt đúng 1 bucket `hashFun(x)`. Hệ số tải = tổng phần tử / Size (cao ⇒ nhiều đụng độ, chậm). 4 bản code thầy: tĩnh/động (`Bucket* bucket; int Size`) × 6 bước/4 bước (Bucket lồng trong Hashtable).

**BST**: `Node{data,pLeft,pRight}`, `Tree{pRoot}`. Chèn không đệ quy cần con trỏ **cha** đi song song (`pLoca`) vì khi `pGoto==NULL` đã mất node cha; **trùng ⇒ bỏ qua/`false`**. Lưu ý: `add` trong `demo_tree_v1.cpp` của thầy KHÔNG có nhánh `==` (lặp vô hạn khi chèn giá trị trùng) — khi đề yêu cầu "trùng thì bỏ qua" phải tự thêm `if (value == pGoto->data) return false;` (kiểm TRƯỚC khi cấp phát node).
LNR (trung tố) luôn ra dãy **tăng dần** (mẹo kiểm tra); NLR/LRN/LNR; LNR không đệ quy = "Left_full → xử lý → Right" bằng `std::stack<Node*>` (`demo_tree_v1.cpp`).
Chèn `50,75,25,30,10,90,70,60,30,70,90` (Test01 Câu 10) ⇒ 8 node (bỏ 3 trùng), LNR `10 25 30 50 60 70 75 90`.

**Tìm kiếm**: tuyến tính O(n) — dãy bất kỳ; nhị phân O(log n) — **dãy đã sắp xếp** (giảm dần ⇒ đảo dấu so sánh), khung 5 bước: `L=0,R=n-1` → `while(L<=R)` → `M=L+(R-L)/2` → so sánh → cập nhật;
nội suy — như nhị phân nhưng vị trí đoán theo tỷ lệ giá trị `pos = L + (x−a[L])(R−L)/(a[R]−a[L])`, nhanh hơn với dữ liệu phân bố đều.
**Sắp xếp**: chọn trực tiếp (tìm min vùng chưa sắp xếp, hoán vị vào đầu vùng; mỗi vòng đúng 1 hoán vị), chèn trực tiếp (dịch rồi chèn). Đây là **hai** thuật toán sắp xếp có trong tài liệu.

## Bẫy "đọc code" — kết quả đã chạy thật

| Đề | Kết quả | Vì sao |
|---|---|---|
| Đề mẫu Câu 4 (`l.head=p; cout<<l.tail->data`) | **lỗi runtime** (segfault) | `tail` chỉ khởi tạo `NULL`, giải tham chiếu NULL |
| Đề mẫu Câu 5 | `79`, `79`, `NULL` (in `0`/`0x0` tùy trình biên dịch) | `p->data ≡ (*p).data`; `p->next` chưa gán |
| Đề mẫu Câu 6 | `9.3` | `*a ≡ a[0]` |
| Đề mẫu Câu 7 | `39` rồi `NULL` (`0`/`0x0`) | `head` được gán, `tail` vẫn NULL |
| Guide `*(a+3)+*(a+7)` với `{1,3,5,7,9,2,4,6,8}` | `13` (7+6) | chỉ số 0-based |
| Guide `a=102; p=&a; b=(*p)++` | `103 102` | hậu tố: b nhận giá trị cũ |
| LT005 Câu 5 | `a = 5.6` | `p=&a` bỏ rơi vùng `new float(0.4)` (rò rỉ); `*p=5.1` sửa `a`; `+0.5` |
| LT005 Câu 6 | `69` | node thứ 2 chỉ được nối, không ảnh hưởng `p->data` |
| LT005 Câu 7 | `9.1` | `Top` chưa bao giờ đổi khỏi `p1`; `p2,p3` chỉ trỏ vào `p1` |
| LT005 Câu 8 | `9.3` | `pFront`, `pRear`, `p` cùng trỏ **một** node; lệnh gán cuối thắng |
| LT005 Câu 9 | `8.2` | `L.pHead->next` là node thứ 2 |
| LT005 Câu 10 | `6.2` | `pRight = pLeft` chỉ chia sẻ node con, không đổi root |

Quy tắc chung: liệt kê từng con trỏ → node nó trỏ tới **sau mỗi dòng**; "gán con trỏ" ≠ "sao chép node".

## Cách trình bày lời giải viết hàm (cách của thầy)

```
/*Câu 1: Thêm một phần tử vào stack
Input:
    + Stack& s
    + int value
Output:
    + Stack& s
    + return bool
*/
bool cau01(Stack& s, int value) { ... }
```
Khối Input/Output đứng TRƯỚC mỗi hàm (thiếu −0.25), mỗi dòng chỉ ghi kiểu + tên (KHÔNG thêm giải thích tiếng Việt trong ngoặc — hàm in thì Output liệt kê trường được in); tham số `&` nào bị hàm sửa thì cũng ghi ở Output; dùng đúng tên struct/trường đề cho
(kể cả giá trị mặc định `= nullptr`, nên `new Node({value})` là đủ); Câu 4 là `main` gọi lại Câu 1–3; không cần `#include` nếu đề nói vậy.
Mẫu đầy đủ 5 cấu trúc: `src/subjects/ctdl/data/practice_4cau.cpp`.

## Khi trả lời một câu của user

1. Xác định dạng (6 dạng trên) → nếu là **thực hành/viết hàm**, mở file lời giải tương ứng, chỉ sửa kiểu dữ liệu/tên trường theo đề.
2. Luôn ghi **Input/Output** ở comment trước hàm (mất 0.25 nếu thiếu); hàm không phải "xuất" thì **không `cout`**.
3. Nếu trả lời có code mới, **biên dịch + chạy thử** (`clang++ -std=c++17 file.cpp`) trước khi báo đúng.
4. Đề mơ hồ (vd Test01 Câu 7 "in các node nhánh còn lại", Test03 Câu 9 "`<` trả true; `=` trả 1; `>` false") → nêu cách hiểu đã chọn, không im lặng đoán.
5. Không bịa đề: ví dụ mới phải ghi rõ "tự tạo, không phải đề thật".

## Bảng tra nhanh: đề → file lời giải (`reference/solutions/`, tự kiểm bằng `assert`)

| Đề / chủ đề | File |
|---|---|
| Tìm kiếm tuyến tính/nhị phân(tăng, giảm)/nội suy, sắp xếp chọn/chèn (tăng, giảm) kèm in từng bước | `algos_trace.cpp` |
| Test01 BST (10 câu, menu) | `bst_test01.cpp` |
| Hàm viết tay trên đề, **đúng tên struct của đề**: Đề mẫu Câu 9 (push `Top/next`), Câu 10 (nhị phân `double`), Câu 11 (tìm BST không đệ quy `node/tree`); LT005 Câu 1 (pop `float`), Câu 4 (chèn BST không đệ quy `double`) | `dethi_mau_viet_ham.cpp` |
| Test02 QLSV DSLK đơn (10 câu) | `qlsv_test02.cpp` |
| Test03 Hashtable SIZE=9 (10 câu) | `hash_test03.cpp` |
| DSLK đơn/đôi, Stack (Đề mẫu Phần 2, LT005 Câu 1), Queue, ứng dụng Stack | `list_stack_queue.cpp` |
| **Bộ luyện tập 4 câu như Đề mẫu Phần 2** — Stack (thật) + DSLK đơn, DSLK đôi, Queue, Bảng băm (tự soạn), lời giải đúng cách trình bày của thầy | `src/subjects/ctdl/data/practice_4cau.cpp` (kiểm bằng `engine/check.mjs`) |
| Toàn bộ câu hỏi đề thật/luyện tập/artifact kèm đáp án | `reference/exam-bank.md` |

Chạy lại tất cả: `for f in algos_trace list_stack_queue dethi_mau_viet_ham; do clang++ -std=c++17 $f.cpp -o /tmp/$f && /tmp/$f; done` và
`for f in bst_test01 qlsv_test02 hash_test03; do clang++ -std=c++17 -DSELFTEST $f.cpp -o /tmp/$f && /tmp/$f; done` (trong thư mục `reference/solutions/`).

## Ngoài nguồn (kiến thức chuẩn, CHƯA thấy trong đề nguồn — chỉ dùng nếu đề hỏi)

Độ phức tạp: tuyến tính O(n); nhị phân O(log n); nội suy trung bình O(log log n), xấu nhất O(n); chọn trực tiếp O(n²) mọi trường hợp;
chèn trực tiếp O(n²), tốt nhất O(n) (đã sắp xếp); bảng băm nối kết trung bình O(1+α). Xóa node BST có 3 trường hợp (lá / 1 con / 2 con — thay bằng node nhỏ nhất
nhánh phải). Các sắp xếp khác (nổi bọt, nhanh, trộn, vun đống) **không có** trong tài liệu môn — không cần trừ khi đề nêu.

## Trạng thái tích hợp app

Môn `ctdl` đã đăng ký (`src/subjects/ctdl/subject.tsx` + `registry.ts`) với 10 module: **cả 10 module đều đã có engine + giao diện thật** (`pointers`, `linked-list`, `doubly-linked-list`, `stack`, `queue`, `hashtable`, `bst`, `searching`, `sorting`, `mock-exams`); không module nào còn là stub (đúng quy ước "module chưa có engine + đề thật = stub", `CLAUDE.md`). Kế hoạch/trạng thái từng module: `docs/PLAN.md` mục CTDL. Engine đã port: `src/subjects/ctdl/engine/{searching,sorting,stack,queue,linkedList,doublyLinkedList,hashtable,bst,memoryMachine,memoryTrace,mockExam}.ts` (stack/queue/danh sách chạy từng dòng code của thầy, khớp `reference/solutions/list_stack_queue.cpp`) — kiểm bằng `node src/subjects/ctdl/engine/check.mjs`; trace phải luôn khớp `reference/solutions/algos_trace.cpp`.
Khi làm module thật: engine thuần trả `AlgoResult` (`src/engine/types.ts`), hiển thị text bằng `StepPlayer`/`ExamplePicker`/`TipCallout`/`AnswerKeyPanel` như XSTK; dùng chung
`components/table/ArrayCanvas.tsx` (mảng + con trỏ, đọc `arraySnapshot`/`arrayMarkers`) cho module dạng mảng, `components/pointer/PointerCanvas.tsx` (node + con trỏ, đọc `pointerSnapshot`) cho DSLK/Stack/Queue/bucket, `components/ui/CodeBlock.tsx` (code chuẩn) và `ctdl/answerKey.ts` (sinh "Ghi vào bài làm" từ `steps`);
`components/hash/HashTableCanvas.tsx` (bảng băm: cột bucket + chuỗi node, đọc `hashSnapshot`), `components/memory/MemoryCanvas.tsx` (stack/heap/con trỏ cho "đọc code ghi kết quả", đọc `memorySnapshot`; `pointers` chạy trên máy bộ nhớ `memoryMachine.ts` — thêm chương trình mới = viết mỗi dòng đề thành vài lệnh máy + ghi đáp án ĐÃ CHẠY THẬT vào `expected`); `components/tree/TreeCanvas.tsx` (cây nhị phân: x = thứ hạng trung tố, đọc `treeSnapshot`). Dữ liệu ví dụ lấy từ `reference/exam-bank.md`, không tự bịa.
