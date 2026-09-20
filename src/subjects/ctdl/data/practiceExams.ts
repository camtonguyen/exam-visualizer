export interface PracticeExam {
  id: string;
  title: string;
  time: string;
  source: string;
  /** Module của môn CTDL ôn kiến thức cho đề này (id trong `subject.tsx`). */
  moduleId: string;
  /** File lời giải C++ đã biên dịch & tự kiểm (`.claude/skills/ctdl-content/reference/solutions/`). */
  solution: string;
  questions: string[];
}

/**
 * 4 đề THỰC HÀNH thật: Đề mẫu cuối kỳ CITD Phần 2 và `Test01/02/03_IT003.pdf` (đọc từ ảnh scan, đối chiếu từng trang).
 * PDF KHÔNG cho điểm từng câu nên KHÔNG chấm điểm ở đây — chỉ danh sách yêu cầu để tự đánh dấu "đã làm" và quy định chấm thật.
 */
export const PRACTICE_EXAMS: PracticeExam[] = [
  {
    id: "dm-p2",
    title: "Đề mẫu cuối kỳ CITD — Phần 2: Thực hành Stack",
    time: "cùng đề 90 phút",
    source: "IT003_Bai09_De_CuoiKy_CITD_De_mau.pdf (trang 7)",
    moduleId: "stack",
    solution: "list_stack_queue.cpp (namespace stk)",
    questions: [
      "Cho struct Node { int data = 0; Node* pNext = nullptr; } và struct Stack { Node* pTop = nullptr; }.",
      "Câu 1. Viết hàm thêm một phần tử vào stack và trả về trạng thái thêm thành công hoặc không thành công.",
      "Câu 2. Viết hàm lấy phần tử ra khỏi stack.",
      "Câu 3. Viết hàm đếm số lượng phần tử có trong stack.",
      "Câu 4. Trong main, khai báo stack và khởi tạo giá trị 12, -95, 78, -89, 35; gọi các hàm câu 1, 2, 3 để kiểm thử. (Không cần khai báo thư viện.)",
    ],
  },
  {
    id: "test01",
    title: "Test01 — Cây nhị phân tìm kiếm (float)",
    time: "60 phút",
    source: "Test01_IT003.pdf",
    moduleId: "bst",
    solution: "bst_test01.cpp",
    questions: [
      "Câu 1. Viết hàm chèn node chứa giá trị (số thực) vào cây; trường hợp bằng một node nào đó trong cây thì BỎ QUA.",
      "Câu 2. Viết hàm tạo cây tự động: giá trị ngẫu nhiên trong [512; 723], số lượng [50; 60].",
      "Câu 3. Viết hàm tạo cây tự động từ một mảng n phần tử.",
      "Câu 4. Viết hàm duyệt cây theo NLR, LRN, LNR — in kèm 3 địa chỉ: NODE, Left, Right.",
      "Câu 5. Viết hàm tìm giá trị X (nhập từ người dùng, truyền vào hàm): tìm thấy trả địa chỉ node, không thấy trả NULL.",
      "Câu 6. Viết hàm đếm toàn bộ số node của cây.",
      "Câu 7. Viết hàm in ra các node nhánh còn lại từ một node nhập từ bàn phím, duyệt LNR.  (đề mơ hồ — xem lời giải)",
      "Câu 8. Viết hàm đếm số node có giá trị lớn hơn X và nhỏ hơn Y (X < node < Y); X, Y do người dùng nhập, truyền vào hàm.",
      "Câu 9. Viết hàm đếm các node có giá trị chẵn và lẻ; trường hợp \"<\" trả về -1, \"=\" trả về 0, \">\" trả về 1.",
      "Câu 10. Trong main: menu chọn các hàm từ câu 2 đến 9; Câu 3 dùng mảng demo 50, 75, 25, 30, 10, 90, 70, 60, 30, 70, 90.",
    ],
  },
  {
    id: "test02",
    title: "Test02 (Đề 02) — QLSV bằng danh sách liên kết đơn",
    time: "70 phút",
    source: "Test02_IT003.pdf",
    moduleId: "linked-list",
    solution: "qlsv_test02.cpp",
    questions: [
      "Cho struct SinhVien { int maSV; char* hoTen (hoặc string); float diemMH; } và typedef SinhVien SV.",
      "Câu 1. Viết hàm chèn node chứa SV vào cuối danh sách; thành công trả true, thất bại trả false.",
      "Câu 2. Viết hàm xuất (in) danh sách sinh viên.",
      "Câu 3. Viết hàm tìm SV theo mã SV; tìm thấy trả địa chỉ node, không thấy trả NULL.",
      "Câu 4. Viết hàm đếm SV có điểm môn học dưới trung bình.",
      "Câu 5. Viết hàm tính điểm trung bình của cả lớp.",
      "Câu 6. Viết hàm tìm mã SV ĐẦU TIÊN có điểm môn học lớn nhất.",
      "Câu 7. Viết hàm trả về các mã SV có điểm môn học trên 8.",
      "Câu 8. Viết hàm cập nhật điểm môn học theo mã sinh viên.",
      "Câu 9. Viết hàm sao chép các SV sang một danh sách mới; phân tích ý tưởng thực hiện.",
      "Câu 10. Trong main tạo 6 SV (không dùng cin): {123,\"Nguyen A\",8.8} {124,\"Nguyen B\",9.7} {125,\"Nguyen C\",2.9} {126,\"Nguyen D\",9.7} {127,\"Nguyen E\",4.8} {128,\"Nguyen F\",7.5}; chèn vào danh sách rồi gọi câu 2–9; chụp DUY NHẤT 1 màn hình kết quả.",
    ],
  },
  {
    id: "test03",
    title: "Test03 — Bảng băm SIZE = 9, nối kết (int)",
    time: "60 phút",
    source: "Test03_IT003.pdf",
    moduleId: "hashtable",
    solution: "hash_test03.cpp",
    questions: [
      "Câu 1. Viết hàm băm theo phương pháp chia.",
      "Câu 2. Viết hàm khởi tạo giá trị tự động: ngẫu nhiên trong [856; 988], số lượng [45; 95].",
      "Câu 3. Viết hàm nhập giá trị cho bảng băm từ mảng 1D n phần tử.",
      "Câu 4. Viết hàm nhập thủ công từ bàn phím (điều kiện kết thúc tự quy định).",
      "Câu 5. Viết hàm kiểm tra bảng băm có rỗng hay không (rỗng ⇒ true).",
      "Câu 6. Viết hàm đếm các giá trị được lưu trữ trong bảng băm.",
      "Câu 7. Viết hàm tìm giá trị X: thấy trả true, không thấy trả false.",
      "Câu 8. Viết hàm tìm max VÀ min trong bảng băm (viết 1 hàm).",
      "Câu 9. Viết hàm đếm giá trị chẵn và lẻ (dựa vào phần nguyên); \"<\" trả true, \"=\" trả 1, \">\" trả false.  (đề mơ hồ — xem lời giải)",
      "Câu 10. Trong main thiết kế testcase gọi câu 2–9; dữ liệu Câu 3: 50, 75, 25, 30, 10, 90, 70, 60, 30, 70, 90.",
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
