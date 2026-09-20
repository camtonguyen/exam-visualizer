import type { MockExam } from "../engine/mockExam";

/**
 * 3 đề THI THỬ tự chấm — chuyển NGUYÊN VĂN từ artifact https://claude.ai/artifact/BUcXGh6Y78uijEWJ5vyxEd (14 câu/đề, rubric 3/4/3 điểm).
 * KHÔNG phải đề thật: do người khác dựng, bám dạng đề thật (Đề mẫu CITD, Luyện tập 005, Test01–03). Bảng điểm 3/4/3 và mốc "≥ 7" là của artifact.
 * Sinh tự động từ dữ liệu artifact (HTML -> markup gọn: **đậm**, `code`, xuống dòng = \n) để không sai chữ nào; đáp án các câu điền đã được
 * `engine/check.mjs` đối chiếu với engine đã kiểm chứng (chọn/chèn trực tiếp, nhị phân, Queue, bảng băm, Stack, BST).
 */
export const MOCK_EXAMS: MockExam[] = [
  {
    "id": "de1",
    "title": "Đề 1",
    "desc": "Con trỏ & cấp phát động · DSLK đơn · Stack · BST cơ bản · Tìm kiếm nhị phân · Sắp xếp chọn trực tiếp",
    "questions": [
      {
        "id": "q1",
        "part": 1,
        "points": 0.5,
        "star": true,
        "text": "Tại sao khi xây dựng một cấu trúc dữ liệu (danh sách, cây, ngăn xếp...) nên áp dụng **cấp phát động**?",
        "hint": "\"new = xin nhà, delete = trả nhà\" — cấp phát động giúp linh hoạt kích thước lúc chạy, đây gần như luôn là câu trả lời chuẩn cho mọi câu lý thuyết dạng \"tại sao nên dùng cấp phát động\".",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Cấp phát động giúp **không cần biết trước số lượng phần tử**, có thể **linh hoạt thêm/bớt** ngay lúc chương trình đang chạy — không bị giới hạn kích thước cố định như mảng tĩnh, và tiết kiệm bộ nhớ vì chỉ cấp đúng số lượng cần dùng."
          }
        ]
      },
      {
        "id": "q2",
        "part": 1,
        "points": 0.5,
        "star": true,
        "text": "Đoạn code dùng 2 biến `left`, `right`, tính `m = left + (right-left)/2`, so sánh `a[m]` với `value` rồi cập nhật lại `left` hoặc `right`. Hàm này cài đặt thuật toán gì? Điều kiện áp dụng?",
        "hint": "Thấy `left`/`right` + `m = (left+right)/2` chia đôi phạm vi tìm kiếm → chắc chắn là Binary Search.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Nhận diện đúng thuật toán — **Tìm kiếm nhị phân (Binary Search)**."
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Nêu đúng điều kiện áp dụng — mảng `a[]` phải **đã được sắp xếp** (thường tăng dần) trước khi gọi hàm."
          }
        ]
      },
      {
        "id": "q3",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Ý tưởng chính của thuật toán **Sắp xếp CHỌN trực tiếp** (Selection Sort)?",
        "hint": "\"Chọn\" = tìm min rồi đổi chỗ. Mỗi vòng lặp chỉ hoán vị đúng 1 lần.",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Với mỗi vòng lặp, **tìm phần tử nhỏ nhất** (hoặc lớn nhất) trong vùng **chưa sắp xếp**, rồi **hoán vị** nó vào đầu vùng đó."
          }
        ]
      },
      {
        "id": "q4",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Vì sao khi **xóa 1 node ở giữa** danh sách liên kết đơn, ta cần một con trỏ `prev` đi trước node cần xóa, thay vì chỉ cần con trỏ tới node đó?",
        "hint": "Muốn \"nối tắt\" qua node bị xóa (`prev->pNext = p->pNext`) thì bắt buộc phải có con trỏ tới node **đứng trước** nó.",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "DSLK đơn chỉ có `pNext` trỏ tới, không có chiều ngược lại; để xóa 1 node ta phải sửa `pNext` của node **đứng trước** nó trỏ thẳng qua node **đứng sau** nó — nên cần con trỏ `prev` đi song song để biết node đứng trước là ai."
          }
        ]
      },
      {
        "id": "q5",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Điểm khác biệt **cốt lõi** giữa Danh sách liên kết đơn và Danh sách liên kết đôi?",
        "hint": "DSLK đôi = DSLK đơn + pPre. Mỗi lần nối node mới phải cập nhật cả 2 chiều (pNext và pPre) — quên 1 chiều là lỗi hay gặp nhất.",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Mỗi node của DSLK đôi có thêm con trỏ `pPre` trỏ về node trước (bên cạnh `pNext`), cho phép **duyệt được cả 2 chiều** (xuôi và ngược) — DSLK đơn không làm được điều này."
          }
        ]
      },
      {
        "id": "q6",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Điểm khác biệt **cốt lõi** giữa Stack và Queue?",
        "hint": "Stack = \"1 cửa ra vào\" (Top). Queue = \"2 cửa riêng biệt\" (Front lấy ra, Rear thêm vào).",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Stack là **LIFO**, chỉ thao tác ở **1 đầu duy nhất** (Top). Queue là **FIFO**, thao tác ở **2 đầu riêng biệt** (Front để lấy ra, Rear để thêm vào)."
          }
        ]
      },
      {
        "id": "q7",
        "part": 2,
        "points": 1,
        "star": true,
        "text": "Cho `struct List { Node *head = NULL, *tail = NULL; };` (chỉ khởi tạo mặc định, không có dòng nào khác gán cho `tail`). Đoạn code trong `main`:\n`List l; Node* p = initNode(39); l.head = p; cout << l.tail->data;`\nCho biết kết quả chạy chương trình và giải thích vì sao.",
        "hint": "Con trỏ chưa được gán (vẫn còn NULL) mà bị giải tham chiếu bằng `->data` là sập chương trình — **không phải** in ra 0.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.5đ):",
            "points": 0.5,
            "body": "Nêu đúng kết quả — chương trình bị **lỗi runtime (sập / segmentation fault)**, không phải in ra 0 hay 39."
          },
          {
            "label": "Phần b (0.5đ):",
            "points": 0.5,
            "body": "Giải thích đúng nguyên nhân — `l.tail` chỉ được khởi tạo NULL mặc định, không có dòng nào gán lại, nên `l.tail->data` giải tham chiếu con trỏ NULL."
          }
        ]
      },
      {
        "id": "q8",
        "part": 2,
        "points": 1,
        "star": false,
        "text": "Cho `double* a = new double[10]; a[0] = 9.3; a[1] = 6.1;`\nLệnh `cout << *a;` in ra giá trị nào?",
        "hint": "`*a` luôn tương đương `a[0]`; `*(a+k)` luôn tương đương `a[k]`.",
        "type": "fill",
        "groups": [
          {
            "label": "Giá trị:",
            "points": 1,
            "fields": [
              {
                "width": 110,
                "accepted": [
                  "9.3",
                  "9,3"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "q9",
        "part": 2,
        "points": 1,
        "star": true,
        "text": "Mô phỏng **Sắp xếp chọn trực tiếp** (tăng dần) với dãy: `[90, 68, 72, 32, 55, 21]`. Ở mỗi vòng lặp, điền giá trị **nhỏ nhất** còn lại trong vùng chưa sắp xếp.",
        "hint": "Mỗi vòng, quét từ vị trí `i` đến hết dãy để tìm giá trị nhỏ nhất. Kết quả cuối: **21 32 55 68 72 90**.",
        "type": "fill",
        "table": [
          [
            "Vòng",
            "Vùng chưa sắp xếp"
          ],
          [
            "i=0",
            "90, 68, 72, 32, 55, 21"
          ],
          [
            "i=1",
            "68, 72, 32, 55, 90"
          ],
          [
            "i=2",
            "72, 68, 55, 90"
          ],
          [
            "i=3",
            "68, 72, 90"
          ],
          [
            "i=4",
            "72, 90"
          ]
        ],
        "groups": [
          {
            "label": "i=0, giá trị nhỏ nhất:",
            "points": 0.2,
            "fields": [
              {
                "width": 64,
                "accepted": [
                  "21"
                ]
              }
            ]
          },
          {
            "label": "i=1, giá trị nhỏ nhất:",
            "points": 0.2,
            "fields": [
              {
                "width": 64,
                "accepted": [
                  "32"
                ]
              }
            ]
          },
          {
            "label": "i=2, giá trị nhỏ nhất:",
            "points": 0.2,
            "fields": [
              {
                "width": 64,
                "accepted": [
                  "55"
                ]
              }
            ]
          },
          {
            "label": "i=3, giá trị nhỏ nhất:",
            "points": 0.2,
            "fields": [
              {
                "width": 64,
                "accepted": [
                  "68"
                ]
              }
            ]
          },
          {
            "label": "i=4, giá trị nhỏ nhất:",
            "points": 0.2,
            "fields": [
              {
                "width": 64,
                "accepted": [
                  "72"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "q10",
        "part": 2,
        "points": 1,
        "star": true,
        "text": "Mô phỏng **Tìm kiếm nhị phân** trên dãy đã sắp xếp: `[10, 15, 18, 25, 27, 35]` (chỉ số 0–5), tìm `value = 27`. Điền L, R, M cho từng bước.",
        "hint": "\"L<=R còn tìm\". `M = L + (R-L)/2`. Nếu `a[M] < value` thì `L=M+1`; nếu `a[M] > value` thì `R=M-1`.",
        "type": "fill",
        "groups": [
          {
            "label": "Bước 1:",
            "points": 0.5,
            "fields": [
              {
                "prefix": "L=",
                "width": 46,
                "accepted": [
                  "0"
                ]
              },
              {
                "prefix": "R=",
                "width": 46,
                "accepted": [
                  "5"
                ]
              },
              {
                "prefix": "M=",
                "width": 46,
                "accepted": [
                  "2"
                ]
              }
            ]
          },
          {
            "label": "Bước 2 (tìm thấy):",
            "points": 0.5,
            "fields": [
              {
                "prefix": "L=",
                "width": 46,
                "accepted": [
                  "3"
                ]
              },
              {
                "prefix": "R=",
                "width": 46,
                "accepted": [
                  "5"
                ]
              },
              {
                "prefix": "M=",
                "width": 46,
                "accepted": [
                  "4"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "q11",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Cho `struct Node { int data; Node* pNext; };` và `struct Stack { Node* pTop; };`\nViết hàm `void push(Stack &s, Node* p)` đưa `p` vào đỉnh ngăn xếp.",
        "hint": "push = addHead của Stack: node mới trỏ tới Top cũ, rồi Top = node mới.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Node mới trỏ tới đỉnh cũ trước khi thay đổi Top",
            "code": "p->pNext = s.pTop;"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Cập nhật đỉnh mới của Stack",
            "code": "s.pTop = p;"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Không thừa if/else kiểm tra rỗng — 2 dòng trên đã đúng cho cả trường hợp pTop == NULL",
            "code": "void push(Stack &s, Node* p)\n{\n    p->pNext = s.pTop;\n    s.pTop = p;\n}"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm — trong đề thi thật, **thiếu** phần này bị **trừ 0.25đ**.",
            "bonus": true
          }
        ]
      },
      {
        "id": "q12",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Cho `struct Node { int data; Node* pNext; };` và `struct List { Node* pHead; Node* pTail; };`\nViết hàm `void addTail(List &l, Node* p)` thêm `p` vào cuối danh sách.",
        "hint": "addTail: rỗng thì gán cả pHead & pTail cùng trỏ vào node mới; không rỗng thì nối tail cũ rồi dời tail sang node mới.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Xử lý trường hợp danh sách rỗng",
            "code": "if (l.pHead == nullptr)\n{\n    l.pHead = p;\n    l.pTail = p;\n}"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Trường hợp không rỗng — nối vào sau pTail",
            "code": "else\n{\n    l.pTail->pNext = p;"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Cập nhật lại pTail = node mới",
            "code": "    l.pTail = p;\n}"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm.",
            "bonus": true
          }
        ]
      },
      {
        "id": "q13",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Viết hàm `bool binarySearch(int a[], int n, int value)` — mảng `a` đã sắp xếp tăng dần, trả về `true`/`false`.",
        "hint": "Khung 5 bước chuẩn: khởi tạo L=0,R=n-1 &rarr; while(L<=R) &rarr; tính M &rarr; so sánh a[M] &rarr; cập nhật L hoặc R.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Khởi tạo phạm vi tìm kiếm",
            "code": "int left = 0, right = n - 1;"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Vòng lặp, tính vị trí giữa, kiểm tra tìm thấy",
            "code": "while (left <= right)\n{\n    int m = left + (right - left) / 2;\n    if (a[m] == value) return true;"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Cập nhật phạm vi khi chưa tìm thấy, trả về false cuối cùng",
            "code": "    else if (a[m] < value) left = m + 1;\n    else right = m - 1;\n}\nreturn false;"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm.",
            "bonus": true
          }
        ]
      },
      {
        "id": "q14",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Cho `struct Node { float data; Node* pLeft; Node* pRight; };` và `struct Tree { Node* pRoot; };`\nViết hàm `bool insertNode(Tree &t, float value)` thêm node vào Cây nhị phân tìm kiếm **không dùng đệ quy**. Nếu trùng thì bỏ qua, trả về `false`.",
        "hint": "Giống tìm kiếm nhị phân nhưng đi theo cây: trái nhỏ hơn, phải lớn hơn, dừng khi gặp NULL thì gắn node mới vào đó.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Trường hợp cây rỗng",
            "code": "if (t.pRoot == nullptr)\n{\n    t.pRoot = initNode(value);\n    return true;\n}"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Vòng lặp tìm vị trí thích hợp, dừng khi trùng",
            "code": "Node* cur = t.pRoot;\nwhile (true)\n{\n    if (value == cur->data) return false;\n    else if (value < cur->data)\n    {\n        if (cur->pLeft == nullptr) { cur->pLeft = initNode(value); return true; }\n        cur = cur->pLeft;\n    }"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Xử lý nhánh phải tương tự",
            "code": "    else\n    {\n        if (cur->pRight == nullptr) { cur->pRight = initNode(value); return true; }\n        cur = cur->pRight;\n    }\n}"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm.",
            "bonus": true
          }
        ]
      }
    ]
  },
  {
    "id": "de2",
    "title": "Đề 2",
    "desc": "DSLK đôi · Stack vs Queue · Hash Table (nối kết) · Sắp xếp chèn trực tiếp · Tìm kiếm nội suy",
    "questions": [
      {
        "id": "q1",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Tại sao `struct Queue` cần **2 con trỏ** `pFront` và `pRear`, trong khi `struct Stack` chỉ cần **1 con trỏ** `pTop`?",
        "hint": "Queue thêm ở 1 đầu, lấy ra ở đầu còn lại (2 vị trí khác nhau); Stack thêm và lấy đều ở cùng 1 vị trí (Top).",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Vì Queue là FIFO: thao tác **thêm** luôn ở `pRear`, thao tác **lấy ra** luôn ở `pFront` — 2 vị trí khác nhau. Nếu chỉ dùng 1 con trỏ sẽ không thể truy cập O(1) cho cả 2 đầu cùng lúc. Stack chỉ thao tác ở 1 đầu (Top) nên chỉ cần 1 con trỏ."
          }
        ]
      },
      {
        "id": "q2",
        "part": 1,
        "points": 0.5,
        "star": true,
        "text": "Cho đoạn code: tính `idx = value % h.Size`, tạo node mới rồi nối vào cuối danh sách liên kết của `bucket[idx]`. Đây là kỹ thuật gì? Khi 2 giá trị có cùng `idx` (đụng độ) thì xử lý ra sao?",
        "hint": "Công thức `h(x) = x % Size` luôn là dấu hiệu của Hash Table theo phương pháp chia.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Đây là **Bảng băm (Hash Table)** theo phương pháp chia, cài đặt theo phương pháp **nối kết** (separate chaining) — mỗi bucket là 1 danh sách liên kết."
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Khi **đụng độ** (2 giá trị cùng `idx`), giá trị mới được **nối tiếp vào cùng 1 danh sách liên kết** của bucket đó (không ghi đè lên giá trị cũ)."
          }
        ]
      },
      {
        "id": "q3",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Ý tưởng chính của thuật toán **Tìm kiếm nội suy** (Interpolation Search)?",
        "hint": "Interpolation Search = Binary Search + công thức nội suy theo tỷ lệ giá trị, thay vì luôn chia đôi.",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Tương tự tìm kiếm nhị phân (áp dụng cho dãy đã sắp xếp), nhưng thay vì luôn lấy vị trí giữa, vị trí \"đoán\" được tính theo **công thức nội suy** dựa trên tỷ lệ giữa giá trị cần tìm và 2 giá trị ở 2 đầu mút — giá trị cần tìm càng gần đầu mút nào thì vị trí đoán càng nhảy gần về phía đó, giúp hội tụ nhanh hơn với dữ liệu phân bố đều."
          }
        ]
      },
      {
        "id": "q4",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Vì sao Danh sách liên kết đôi có thể duyệt **ngược** từ `pTail` mà Danh sách liên kết đơn không làm được?",
        "hint": "Duyệt ngược cần \"lối lùi\" — chính là con trỏ pPre.",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Vì mỗi node của DSLK đôi có thêm con trỏ `pPre` trỏ về phía node trước nó; DSLK đơn chỉ có `pNext` một chiều nên khi đã đi qua một node thì không có cách nào quay lại."
          }
        ]
      },
      {
        "id": "q5",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Trong Bảng băm, **hệ số tải (load factor)** là gì và nó cho biết điều gì?",
        "hint": "load factor = tổng số phần tử / Size.",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Hệ số tải = **tổng số phần tử đang lưu / kích thước bảng (Size)**. Hệ số tải càng cao thì trung bình mỗi bucket càng chứa nhiều phần tử, nghĩa là khả năng **đụng độ** càng lớn và tốc độ tìm kiếm càng giảm."
          }
        ]
      },
      {
        "id": "q6",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Nêu 1 điểm khác nhau về **vị trí thao tác** giữa hàm `push` của Stack và `enQueue` của Queue?",
        "hint": "push luôn ở Top; enQueue luôn ở Rear (khác vị trí lấy ra là Front).",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "`push` luôn thao tác tại **pTop** — cùng 1 vị trí dùng để lấy ra. `enQueue` luôn thêm vào **pRear**, trong khi lấy ra lại ở vị trí khác là **pFront**."
          }
        ]
      },
      {
        "id": "q7",
        "part": 2,
        "points": 1,
        "star": true,
        "text": "Cho `struct Queue { Node* pFront; Node* pRear; };`. Đoạn code:\n`Node* p = initNode(2.8); Queue q; q.pRear = q.pFront = p; p->data = 7.5; q.pRear->data = 9.3; cout << q.pFront->data;`\nCho biết kết quả và giải thích.",
        "hint": "q.pFront, q.pRear và p đều đang là con trỏ tới CÙNG một node — sửa qua biến nào cũng ảnh hưởng như nhau.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.5đ):",
            "points": 0.5,
            "body": "Nêu đúng kết quả — in ra **9.3**."
          },
          {
            "label": "Phần b (0.5đ):",
            "points": 0.5,
            "body": "Giải thích đúng — `q.pFront`, `q.pRear` và `p` đều được gán trỏ tới **cùng 1 node** (không phải 3 node riêng biệt); các lệnh gán `data` lần lượt ghi đè lên node đó, lệnh gán **cuối cùng** (9.3) là giá trị còn lại."
          }
        ]
      },
      {
        "id": "q8",
        "part": 2,
        "points": 1,
        "star": false,
        "text": "Cho dãy đã sắp xếp `[16, 23, 31, 56, 62]` (chỉ số 0–4), tìm `value = 56` bằng Tìm kiếm nhị phân. Điền L, R, M cho từng bước.",
        "hint": "M = L + (R-L)/2. So a[M] với value để thu hẹp phạm vi.",
        "type": "fill",
        "groups": [
          {
            "label": "Bước 1:",
            "points": 0.5,
            "fields": [
              {
                "prefix": "L=",
                "width": 46,
                "accepted": [
                  "0"
                ]
              },
              {
                "prefix": "R=",
                "width": 46,
                "accepted": [
                  "4"
                ]
              },
              {
                "prefix": "M=",
                "width": 46,
                "accepted": [
                  "2"
                ]
              }
            ]
          },
          {
            "label": "Bước 2 (tìm thấy):",
            "points": 0.5,
            "fields": [
              {
                "prefix": "L=",
                "width": 46,
                "accepted": [
                  "3"
                ]
              },
              {
                "prefix": "R=",
                "width": 46,
                "accepted": [
                  "4"
                ]
              },
              {
                "prefix": "M=",
                "width": 46,
                "accepted": [
                  "3"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "q9",
        "part": 2,
        "points": 1,
        "star": true,
        "text": "Mô phỏng **Sắp xếp chèn trực tiếp** (tăng dần) với dãy: `[79, 39, 26, 66, 55, 20]`. Điền trạng thái đầy đủ của mảng sau mỗi lần chèn (6 số, cách nhau dấu phẩy, không cần khoảng trắng).",
        "hint": "Mỗi lần, lấy phần tử tiếp theo và dịch các phần tử lớn hơn nó (đã sắp xếp bên trái) sang phải để chèn đúng chỗ.",
        "type": "fill",
        "table": [
          [
            "Đầu vào: 79, 39, 26, 66, 55, 20"
          ]
        ],
        "groups": [
          {
            "label": "Sau lần #1 (xét 39):",
            "points": 0.2,
            "fields": [
              {
                "width": 220,
                "accepted": [
                  "39,79,26,66,55,20"
                ]
              }
            ]
          },
          {
            "label": "Sau lần #2 (xét 26):",
            "points": 0.2,
            "fields": [
              {
                "width": 220,
                "accepted": [
                  "26,39,79,66,55,20"
                ]
              }
            ]
          },
          {
            "label": "Sau lần #3 (xét 66):",
            "points": 0.2,
            "fields": [
              {
                "width": 220,
                "accepted": [
                  "26,39,66,79,55,20"
                ]
              }
            ]
          },
          {
            "label": "Sau lần #4 (xét 55):",
            "points": 0.2,
            "fields": [
              {
                "width": 220,
                "accepted": [
                  "26,39,55,66,79,20"
                ]
              }
            ]
          },
          {
            "label": "Sau lần #5 (xét 20):",
            "points": 0.2,
            "fields": [
              {
                "width": 220,
                "accepted": [
                  "20,26,39,55,66,79"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "q10",
        "part": 2,
        "points": 1,
        "star": true,
        "text": "Mô phỏng Queue: cho hàng đợi rỗng, thực hiện lần lượt: `enQueue(5)`, `enQueue(8)`, `enQueue(3)`, `deQueue()`, `enQueue(6)`. Điền các giá trị còn lại trong hàng đợi, theo thứ tự **Front → Rear** (cách nhau dấu phẩy).",
        "hint": "deQueue() luôn lấy ra phần tử ở Front (phần tử vào trước nhất).",
        "type": "fill",
        "groups": [
          {
            "label": "Kết quả (Front → Rear):",
            "points": 1,
            "fields": [
              {
                "width": 150,
                "accepted": [
                  "8,3,6"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "q11",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Cho `struct Queue { Node* pFront; Node* pRear; };` (Node có `data`, `pNext`).\nViết hàm `void enQueue(Queue &q, Node* p)` thêm `p` vào hàng đợi.",
        "hint": "enQueue luôn thêm vào Rear — giống addTail của DSLK.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Xử lý trường hợp hàng đợi rỗng",
            "code": "if (q.pFront == nullptr && q.pRear == nullptr)\n{\n    q.pFront = p;\n    q.pRear = p;\n}"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Trường hợp không rỗng — nối vào sau pRear",
            "code": "else\n{\n    q.pRear->pNext = p;"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Cập nhật lại pRear = node mới",
            "code": "    q.pRear = p;\n}"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm.",
            "bonus": true
          }
        ]
      },
      {
        "id": "q12",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Viết hàm `void deQueue(Queue &q)` — lấy 1 phần tử ra khỏi hàng đợi (giả sử đã có hàm `bool isEmpty(Queue q)`).",
        "hint": "Lấy ra ở Front; nếu sau khi lấy hàng đợi trống thì phải cập nhật luôn cả pRear = NULL.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Kiểm tra rỗng thì không làm gì cả",
            "code": "if (isEmpty(q)) return;"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Lưu lại node đầu, cho pFront nhảy sang phần tử kế tiếp, giải phóng node cũ",
            "code": "Node* p = q.pFront;\nq.pFront = q.pFront->pNext;\ndelete p;"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Nếu sau khi xóa hàng đợi trở thành rỗng thì phải cập nhật luôn pRear",
            "code": "if (q.pFront == nullptr) q.pRear = nullptr;"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm.",
            "bonus": true
          }
        ]
      },
      {
        "id": "q13",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Cho `struct Bucket { Node* pHead; Node* pTail; };` và `struct Hashtable { Bucket* bucket; int Size; };`\nViết hàm `void add(Hashtable &h, int value)` thêm giá trị vào bảng băm theo phương pháp nối kết.",
        "hint": "2 bước: băm ra vị trí, rồi addTail vào DSLK của đúng bucket đó.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Tính vị trí băm theo phương pháp chia",
            "code": "int idx = value % h.Size;\nNode* p = initNode(value);"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Xử lý trường hợp bucket đang rỗng",
            "code": "if (h.bucket[idx].pHead == nullptr)\n{\n    h.bucket[idx].pHead = p;\n    h.bucket[idx].pTail = p;\n}"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Trường hợp bucket không rỗng — nối vào cuối rồi cập nhật pTail",
            "code": "else\n{\n    h.bucket[idx].pTail->pNext = p;\n    h.bucket[idx].pTail = p;\n}"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm.",
            "bonus": true
          }
        ]
      },
      {
        "id": "q14",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Cho `struct Node { Node* pPre; int data; Node* pNext; };` và `struct List { Node* pHead; Node* pTail; };`\nViết hàm `void addHead(List &l, Node* p)` thêm `p` vào đầu Danh sách liên kết đôi.",
        "hint": "Khác addHead DSLK đơn ở chỗ phải cập nhật thêm chiều pPre của node cũ trỏ ngược lại node mới.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Xử lý trường hợp danh sách rỗng",
            "code": "if (l.pHead == nullptr && l.pTail == nullptr)\n{\n    l.pHead = p;\n    l.pTail = p;\n}"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Không rỗng — node mới trỏ tới pHead cũ, VÀ pHead cũ phải trỏ ngược lại node mới",
            "code": "else\n{\n    p->pNext = l.pHead;\n    l.pHead->pPre = p;"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Cập nhật lại pHead = node mới",
            "code": "    l.pHead = p;\n}"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm.",
            "bonus": true
          }
        ]
      }
    ]
  },
  {
    "id": "de3",
    "title": "Đề 3",
    "desc": "Mảng động & quản lý struct · Stack nâng cao (đổi cơ số, ngoặc hợp lệ) · Bảng băm mô phỏng · BST không đệ quy",
    "questions": [
      {
        "id": "q1",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Tại sao khi giải phóng một mảng cấp phát bằng `new T[n]`, ta luôn phải dùng `delete[]` thay vì `delete` thông thường?",
        "hint": "new T[n] cấp một dải liên tiếp — phải dùng delete[] tương ứng.",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "`new T[n]` cấp phát một dải liên tiếp **nhiều phần tử**; `delete[]` mới gọi đúng cách giải phóng cho toàn bộ dải đó. Dùng `delete` (không có `[]`) cho một mảng là hành vi không xác định (undefined behavior), có thể gây rò rỉ bộ nhớ hoặc lỗi runtime."
          }
        ]
      },
      {
        "id": "q2",
        "part": 1,
        "points": 0.5,
        "star": true,
        "text": "Đoạn code dùng `std::stack<Node*>`, đẩy node gốc vào, rồi lặp: lấy 1 node ra, xử lý nó, rồi đẩy 2 con (nếu có) vào lại stack cho tới khi stack rỗng. Đây là kỹ thuật gì? Dùng để làm gì?",
        "hint": "Dùng 1 std::stack tường minh để \"giả lập\" ngăn xếp gọi hàm — đây chính là duyệt cây không đệ quy.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Đây là kỹ thuật **duyệt Cây nhị phân KHÔNG DÙNG ĐỆ QUY**, dùng 1 `std::stack` tường minh để mô phỏng lại ngăn xếp gọi hàm mà đệ quy vốn dùng ngầm."
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Có thể dùng để: **đếm số node**, **duyệt NLR**, hoặc **giải phóng toàn bộ cây** — miễn là lưu lại địa chỉ 2 con trước khi xử lý (hoặc xóa) node cha."
          }
        ]
      },
      {
        "id": "q3",
        "part": 1,
        "points": 0.5,
        "star": true,
        "text": "Ý tưởng của kỹ thuật \"đổi số hệ 10 sang hệ cơ số khác (ví dụ hệ 2 hoặc hệ 16) bằng Stack\"?",
        "hint": "Lấy dư liên tiếp, PUSH vào Stack; do LIFO nên POP ra sẽ đúng thứ tự chữ số từ trái sang phải.",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Lấy **phần dư** của phép chia liên tiếp số cần đổi cho cơ số đích, rồi **đẩy (push)** lần lượt từng số dư vào Stack. Do Stack là **LIFO**, khi **lấy (pop)** ra lần lượt sẽ cho đúng thứ tự các chữ số kết quả từ trái sang phải."
          }
        ]
      },
      {
        "id": "q4",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Tại sao dùng Stack lại kiểm tra được một chuỗi có **đối xứng (Palindrome)** hay không?",
        "hint": "Đẩy hết vào rồi lấy ra sẽ cho thứ tự đảo ngược — so sánh với chuỗi gốc.",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Đẩy lần lượt các ký tự của chuỗi vào Stack, rồi lấy ra sẽ cho **thứ tự ngược lại** so với chuỗi ban đầu (do tính chất LIFO). So sánh thứ tự lấy ra với chuỗi gốc theo từng vị trí tương ứng sẽ biết chuỗi có đối xứng hay không."
          }
        ]
      },
      {
        "id": "q5",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Trong bài toán quản lý nhân viên bằng mảng động `NhanVien* arrayNV = new NhanVien[100]`, tại sao vẫn cần thêm một biến `soNV` riêng?",
        "hint": "Mảng động không tự biết đang dùng bao nhiêu phần tử trong tổng dung lượng đã xin.",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Vì mảng cấp phát động chỉ biết **tổng dung lượng đã xin cấp phát** (ở đây là 100), không tự biết số phần tử **đang thực sự được sử dụng**. Cần một biến đếm riêng (`soNV`) để theo dõi số lượng nhân viên hiện có trong mảng."
          }
        ]
      },
      {
        "id": "q6",
        "part": 1,
        "points": 0.5,
        "star": false,
        "text": "Vì sao khi thêm 1 node vào Cây nhị phân tìm kiếm **không đệ quy**, ta cần một con trỏ \"cha\" đi song song với con trỏ \"đang xét\"?",
        "hint": "Khi con trỏ đang xét chạm NULL thì đã đi lỡ qua node cha — cần lưu lại từ trước.",
        "type": "rubric",
        "parts": [
          {
            "label": "Ý chính (0.5đ):",
            "points": 0.5,
            "body": "Khi con trỏ đang xét đi tới `NULL` (đúng vị trí cần chèn), ta đã **đi qua** node cha và mất tham chiếu tới nó. Cần lưu lại con trỏ cha từ trước (hoặc giữ nguyên tham chiếu tới `pLeft`/`pRight` của nó) để biết gắn node mới vào bên trái hay bên phải của node cha đó."
          }
        ]
      },
      {
        "id": "q7",
        "part": 2,
        "points": 1,
        "star": true,
        "text": "Cho `NhanVien nv; nv.LuongCB = 4500000; nv.soNG = 20;` và đoạn code:\n`nv.luongHT = nv.LuongCB + nv.soNG*180000; if(nv.luongHT>8000000) nv.luongHT += nv.luongHT*0.05; if(nv.LuongCB<5000000) nv.luongHT += nv.luongHT*0.10;`\nTính `luongHT` cuối cùng và giải thích từng bước.",
        "hint": "Làm đúng thứ tự: lương cơ bản → kiểm tra thưởng 5% → kiểm tra phụ cấp 10% (áp dụng SAU khi đã cộng thưởng nếu có).",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.5đ):",
            "points": 0.5,
            "body": "Kết quả đúng: **9.355.500**."
          },
          {
            "label": "Phần b (0.5đ):",
            "points": 0.5,
            "body": "Giải thích đúng trình tự: 4.500.000 + 20×180.000 = 8.100.000 → 8.100.000 > 8.000.000 nên +5%: 8.100.000×1.05 = 8.505.000 → LuongCB = 4.500.000 < 5.000.000 nên +10% tiếp: 8.505.000×1.10 = 9.355.500."
          }
        ]
      },
      {
        "id": "q8",
        "part": 2,
        "points": 1,
        "star": false,
        "text": "Cho `SIZE = 10`, hàm băm `h(x) = x % 10`. Thêm lần lượt các giá trị `17, 27, 37, 7, 97, 12, 22` vào bảng băm. Liệt kê các giá trị rơi vào `bucket[7]`, theo đúng thứ tự được thêm vào (cách nhau dấu phẩy).",
        "hint": "17%10=7, 27%10=7, 37%10=7, 7%10=7, 97%10=7 đều cùng rơi vào bucket 7.",
        "type": "fill",
        "groups": [
          {
            "label": "bucket[7] =",
            "points": 1,
            "fields": [
              {
                "width": 220,
                "accepted": [
                  "17,27,37,7,97"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "q9",
        "part": 2,
        "points": 1,
        "star": true,
        "text": "Mô phỏng đổi số **13** sang hệ nhị phân bằng Stack (lấy số dư của phép chia liên tiếp cho 2, đẩy vào Stack, rồi đọc kết quả bằng cách lấy ra lần lượt).",
        "hint": "13/2=6 dư 1 → 6/2=3 dư 0 → 3/2=1 dư 1 → 1/2=0 dư 1. Push theo thứ tự 1,0,1,1 — Pop ra sẽ NGƯỢC LẠI.",
        "type": "fill",
        "groups": [
          {
            "label": "Dư bước 1 (13÷2):",
            "points": 0.2,
            "fields": [
              {
                "width": 50,
                "accepted": [
                  "1"
                ]
              }
            ]
          },
          {
            "label": "Dư bước 2 (6÷2):",
            "points": 0.2,
            "fields": [
              {
                "width": 50,
                "accepted": [
                  "0"
                ]
              }
            ]
          },
          {
            "label": "Dư bước 3 (3÷2):",
            "points": 0.2,
            "fields": [
              {
                "width": 50,
                "accepted": [
                  "1"
                ]
              }
            ]
          },
          {
            "label": "Dư bước 4 (1÷2):",
            "points": 0.2,
            "fields": [
              {
                "width": 50,
                "accepted": [
                  "1"
                ]
              }
            ]
          },
          {
            "label": "Kết quả hệ 2 (đọc từ Stack ra):",
            "points": 0.2,
            "fields": [
              {
                "width": 100,
                "accepted": [
                  "1101"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "q10",
        "part": 2,
        "points": 1,
        "star": true,
        "text": "Thêm lần lượt các giá trị `50, 75, 25, 30, 10, 90` vào Cây nhị phân tìm kiếm (rỗng ban đầu). Sau khi thêm hết, duyệt **LNR (trung tố)** sẽ cho ra dãy nào? (cách nhau dấu phẩy)",
        "hint": "LNR luôn cho ra dãy TĂNG DẦN với BST — đây là mẹo kiểm tra nhanh.",
        "type": "fill",
        "groups": [
          {
            "label": "Kết quả LNR:",
            "points": 1,
            "fields": [
              {
                "width": 220,
                "accepted": [
                  "10,25,30,50,75,90"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "q11",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Cho `struct NhanVien { int maNV; float LuongCB; int soNG; float luongHT; };`. Viết hàm `void tinhLuong(NhanVien &nv)` theo công thức: lương HT = LuongCB + soNG×180000; nếu >8 triệu thì +5%; nếu LuongCB <5 triệu thì +10% (tính sau).",
        "hint": "Làm đúng thứ tự: tính cơ bản → cộng 5% nếu > 8tr → cộng 10% nếu LuongCB < 5tr (áp trên giá trị đã cộng 5% nếu có).",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Tính lương cơ bản cộng phụ cấp ngày công",
            "code": "nv.luongHT = nv.LuongCB + nv.soNG * 180000;"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Kiểm tra và cộng thêm 5% nếu luongHT vượt 8 triệu",
            "code": "if (nv.luongHT > 8000000)\n    nv.luongHT += nv.luongHT * 0.05;"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Kiểm tra và cộng thêm 10% nếu LuongCB dưới 5 triệu",
            "code": "if (nv.LuongCB < 5000000)\n    nv.luongHT += nv.luongHT * 0.10;"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm.",
            "bonus": true
          }
        ]
      },
      {
        "id": "q12",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Viết hàm `bool kiemTraNgoacHopLe(string s)` kiểm tra dãy ngoặc `( ) { } [ ]` có hợp lệ hay không, dùng Stack.",
        "hint": "Ngoặc mở thì push; ngoặc đóng thì kiểm tra khớp với đỉnh Stack rồi pop; cuối cùng Stack phải rỗng.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Gặp ngoặc mở thì đẩy vào Stack",
            "code": "for (char c : s)\n{\n    if (c=='('||c=='{'||c=='[')\n        stack += c;"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Gặp ngoặc đóng — kiểm tra rỗng và khớp cặp trước khi lấy ra",
            "code": "    else if (c==')'||c=='}'||c==']')\n    {\n        if (stack.empty()) return false;\n        char open = stack.back();\n        if ((c==')'&&open!='(') || (c=='}'&&open!='{') || (c==']'&&open!='['))\n            return false;\n        stack.pop_back();\n    }\n}"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Trả về true khi và chỉ khi Stack rỗng sau khi duyệt hết chuỗi",
            "code": "return stack.empty();"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm.",
            "bonus": true
          }
        ]
      },
      {
        "id": "q13",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Viết hàm `int countNodeIterative(Tree t)` đếm số node của Cây nhị phân tìm kiếm **KHÔNG DÙNG ĐỆ QUY** (dùng `std::stack<Node*>`).",
        "hint": "Đẩy root vào stack; mỗi lần lấy 1 node ra thì tăng biến đếm rồi đẩy 2 con (nếu có) vào lại.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Xử lý cây rỗng, khởi tạo stack và đẩy root vào",
            "code": "if (t.pRoot == nullptr) return 0;\nstack<Node*> s;\ns.push(t.pRoot);\nint count = 0;"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Vòng lặp: lấy 1 node ra, tăng biến đếm",
            "code": "while (!s.empty())\n{\n    Node* p = s.top();\n    s.pop();\n    count++;"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Đẩy 2 con (nếu có) vào stack trước khi lặp tiếp, trả về kết quả cuối",
            "code": "    if (p->pRight != nullptr) s.push(p->pRight);\n    if (p->pLeft != nullptr) s.push(p->pLeft);\n}\nreturn count;"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm.",
            "bonus": true
          }
        ]
      },
      {
        "id": "q14",
        "part": 3,
        "points": 0.75,
        "star": true,
        "text": "Viết hàm `void demDauAm(double* arr, int n, int &duong, int &am, int &khong)` đếm số phần tử dương / âm / bằng 0 trong mảng số thực.",
        "hint": "Khởi tạo cả 3 biến đếm về 0 trước, rồi duyệt và so sánh từng phần tử với 0.",
        "type": "rubric",
        "parts": [
          {
            "label": "Phần a (0.25đ):",
            "points": 0.25,
            "body": "Khởi tạo cả 3 biến đếm về 0",
            "code": "duong = am = khong = 0;"
          },
          {
            "label": "Phần b (0.25đ):",
            "points": 0.25,
            "body": "Vòng lặp duyệt qua mảng, so sánh từng phần tử với 0",
            "code": "for (int i = 0; i < n; i++)\n{\n    if (arr[i] > 0) duong++;"
          },
          {
            "label": "Phần c (0.25đ):",
            "points": 0.25,
            "body": "Xử lý đúng 2 trường hợp còn lại (âm và bằng 0)",
            "code": "    else if (arr[i] < 0) am++;\n    else khong++;\n}"
          },
          {
            "label": "Điểm cộng (không tính vào tổng 10):",
            "points": 0.25,
            "body": "Có comment Input/Output đầy đủ trước hàm.",
            "bonus": true
          }
        ]
      }
    ]
  }
];
