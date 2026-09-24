import PRACTICE_CPP from "./practice_4cau.cpp?raw";

/** Lời giải 1 đề "4 câu" = đúng 1 phần BEGIN/END của `practice_4cau.cpp` (đã biên dịch + tự kiểm trong `engine/check.mjs`). */
export const practiceSolution = (key: string): string => {
  const m = PRACTICE_CPP.match(new RegExp(`// ===== BEGIN ${key} =====\\n([\\s\\S]*?)// ===== END ${key} =====`));
  if (!m) throw new Error(`practice_4cau.cpp thiếu phần ${key}`);
  return m[1].trimEnd();
};

export interface PracticeExam {
  id: string;
  title: string;
  time: string;
  source: string;
  /** Module của môn CTDL ôn kiến thức cho đề này (id trong `subject.tsx`). */
  moduleId: string;
  /** File lời giải C++ đã biên dịch & tự kiểm. */
  solution: string;
  questions: string[];
  /** Khóa phần lời giải trong `practice_4cau.cpp`. */
  solutionKey: string;
  /** true = tự soạn cùng khuôn đề mẫu, KHÔNG phải đề thật. */
  similar?: boolean;
}

/**
 * Phần tự luận: bộ "4 câu như Đề mẫu Phần 2" — Stack là đề thật, DSLK đơn/đôi, Queue, Bảng băm là TỰ SOẠN cùng khuôn (`similar`),
 * mỗi đề kèm lời giải ghi Input/Output theo cách của thầy. (Test01/02/03 10 câu đã bỏ khỏi phần này theo yêu cầu; lời giải C++ vẫn còn trong skill.)
 * PDF KHÔNG cho điểm từng câu nên KHÔNG chấm điểm ở đây — chỉ danh sách yêu cầu để tự đánh dấu "đã làm" và quy định chấm thật.
 */
export const PRACTICE_EXAMS: PracticeExam[] = [
  {
    id: "dm-p2",
    title: "Đề mẫu cuối kỳ CITD — Phần 2: Thực hành Stack",
    time: "cùng đề 90 phút",
    source: "IT003_Bai09_De_CuoiKy_CITD_De_mau.pdf (trang 7)",
    moduleId: "stack",
    solution: "src/subjects/ctdl/data/practice_4cau.cpp (phần stack)",
    solutionKey: "stack",
    questions: [
      "Cho struct Node { int data = 0; Node* pNext = nullptr; } và struct Stack { Node* pTop = nullptr; }.",
      "Câu 1. Viết hàm thêm một phần tử vào stack và trả về trạng thái thêm thành công hoặc không thành công.",
      "Câu 2. Viết hàm lấy phần tử ra khỏi stack.",
      "Câu 3. Viết hàm đếm số lượng phần tử có trong stack.",
      "Câu 4. Trong main, khai báo stack và khởi tạo giá trị 12, -95, 78, -89, 35; gọi các hàm câu 1, 2, 3 để kiểm thử. (Không cần khai báo thư viện.)",
    ],
  },
  {
    id: "sim-list",
    title: "Luyện tập — DSLK đơn (4 câu)",
    time: "tự luyện",
    source: "Tự soạn theo khuôn Đề mẫu CITD Phần 2 — KHÔNG phải đề thật",
    moduleId: "linked-list",
    solution: "src/subjects/ctdl/data/practice_4cau.cpp (phần list)",
    solutionKey: "list",
    similar: true,
    questions: [
      "Cho struct Node { int data = 0; Node* pNext = nullptr; } và struct List { Node* pHead = nullptr; Node* pTail = nullptr; }.",
      "Câu 1. Viết hàm thêm một phần tử vào cuối danh sách và trả về trạng thái thêm thành công hoặc không thành công.",
      "Câu 2. Viết hàm xóa phần tử có giá trị x khỏi danh sách (trả về xóa được hay không).",
      "Câu 3. Viết hàm đếm số lượng phần tử có trong danh sách.",
      "Câu 4. Trong main, khai báo danh sách và thêm lần lượt 15, -42, 63, -8, 21; gọi các hàm câu 1, 2, 3 để kiểm thử. (Không cần khai báo thư viện.)",
    ],
  },
  {
    id: "sim-dlist",
    title: "Luyện tập — DSLK đôi (4 câu)",
    time: "tự luyện",
    source: "Tự soạn theo khuôn Đề mẫu CITD Phần 2 — KHÔNG phải đề thật",
    moduleId: "doubly-linked-list",
    solution: "src/subjects/ctdl/data/practice_4cau.cpp (phần dlist)",
    solutionKey: "dlist",
    similar: true,
    questions: [
      "Cho struct Node { Node* pPre = nullptr; int data = 0; Node* pNext = nullptr; } và struct List { Node* pHead = nullptr; Node* pTail = nullptr; }.",
      "Câu 1. Viết hàm thêm một phần tử vào cuối danh sách và trả về trạng thái thêm thành công hoặc không thành công.",
      "Câu 2. Viết hàm xóa phần tử có giá trị x khỏi danh sách (trả về xóa được hay không).",
      "Câu 3. Viết hàm đếm số lượng phần tử có trong danh sách.",
      "Câu 4. Trong main, khai báo danh sách và thêm lần lượt 9, 27, -14, 50; gọi các hàm câu 1, 2, 3 để kiểm thử. (Không cần khai báo thư viện.)",
    ],
  },
  {
    id: "sim-queue",
    title: "Luyện tập — Queue (4 câu)",
    time: "tự luyện",
    source: "Tự soạn theo khuôn Đề mẫu CITD Phần 2 — KHÔNG phải đề thật",
    moduleId: "queue",
    solution: "src/subjects/ctdl/data/practice_4cau.cpp (phần queue)",
    solutionKey: "queue",
    similar: true,
    questions: [
      "Cho struct Node { int data = 0; Node* pNext = nullptr; } và struct Queue { Node* pFront = nullptr; Node* pRear = nullptr; }.",
      "Câu 1. Viết hàm thêm một phần tử vào hàng đợi và trả về trạng thái thêm thành công hoặc không thành công.",
      "Câu 2. Viết hàm lấy phần tử ra khỏi hàng đợi.",
      "Câu 3. Viết hàm đếm số lượng phần tử có trong hàng đợi.",
      "Câu 4. Trong main, khai báo hàng đợi và thêm lần lượt 6, -19, 33, 4, -27; gọi các hàm câu 1, 2, 3 để kiểm thử. (Không cần khai báo thư viện.)",
    ],
  },
  {
    id: "sim-hash",
    title: "Luyện tập — Bảng băm SIZE = 7, nối kết (4 câu)",
    time: "tự luyện",
    source: "Tự soạn theo khuôn Đề mẫu CITD Phần 2 — KHÔNG phải đề thật",
    moduleId: "hashtable",
    solution: "src/subjects/ctdl/data/practice_4cau.cpp (phần hash)",
    solutionKey: "hash",
    similar: true,
    questions: [
      "Cho const int SIZE = 7; struct Node { int data = 0; Node* pNext = nullptr; }; struct Bucket { Node* pHead = nullptr; Node* pTail = nullptr; }; struct Hashtable { Bucket bucket[SIZE]; }.",
      "Câu 1. Viết hàm thêm một giá trị vào bảng băm (hàm băm phương pháp chia) và trả về trạng thái thêm thành công hoặc không thành công.",
      "Câu 2. Viết hàm tìm giá trị x trong bảng băm (có trả true, không có trả false).",
      "Câu 3. Viết hàm đếm số lượng giá trị có trong bảng băm.",
      "Câu 4. Trong main, khai báo bảng băm và thêm lần lượt 19, 26, 8, 33, 12; gọi các hàm câu 1, 2, 3 để kiểm thử. (Không cần khai báo thư viện.)",
    ],
  },
];

/** Quy định thi thực hành (Test02 trang 2 — bảng phạt + chú ý). */
export const PRACTICE_RULES = {
  penalties: [
    ["Nộp không đúng giờ quy định", "−1"],
    ["Chương trình không chạy", "−3"],
    ["Trao đổi code qua lại", "Nhận 0 điểm"],
    ["Chụp, phát tán đề thi", "Nhận 0 điểm"],
    ["Sử dụng code trên mạng", "Nhận 0 điểm"],
  ],
  notes: [
    "Comment Input/Output trước MỖI hàm (dạng /* Câu 5: … Input: + … Output: + … */) — thiếu: −0.25.",
    "Ngoại trừ các hàm xuất (in ra màn hình) thì được dùng cout; các hàm khác KHÔNG được dùng cout để in kết quả trong hàm con.",
    "Quy định file nộp: Ca0x_STT_MSSV_HoVaTen_De0x.cpp (nộp .cpp và hình chụp màn hình, không nén).",
  ],
};
