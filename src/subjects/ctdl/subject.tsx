import type { SubjectDef } from '@/subjects/types';
import PointersModule from './modules/pointers/PointersModule';
import LinkedListModule from './modules/linked-list/LinkedListModule';
import DoublyLinkedListModule from './modules/doubly-linked-list/DoublyLinkedListModule';
import StackModule from './modules/stack/StackModule';
import QueueModule from './modules/queue/QueueModule';
import HashtableModule from './modules/hashtable/HashtableModule';
import MockExamsModule from './modules/mock-exams/MockExamsModule';
import BstModule from './modules/bst/BstModule';
import SearchingModule from './modules/searching/SearchingModule';
import SortingModule from './modules/sorting/SortingModule';

/**
 * Môn 3: Cấu trúc Dữ liệu & Giải thuật (IT003, CTDL). Nguồn nội dung: `docs/ctdl/` (6 PDF
 * đề mẫu/luyện tập/thực hành + 15 file .cpp của thầy) + artifact 3 đề thi thử — đã đóng gói
 * trong `.claude/skills/ctdl-content/` (SKILL.md + reference/exam-bank.md + reference/solutions/*.cpp).
 *
 * ✅ Cả 10/10 module đã có component thật (engine + dữ liệu đề thật; `mock-exams` = 3 đề thi thử tự chấm + 4 đề thực hành).
 * Kế hoạch/trạng thái từng module: `docs/PLAN.md` mục CTDL.
 */
export const ctdlSubject: SubjectDef = {
  id: 'ctdl',
  label: 'Cấu trúc Dữ liệu & Giải thuật (CTDL)',
  shortLabel: 'CTDL',
  description:
    'Con trỏ, danh sách liên kết, Stack/Queue, bảng băm, cây nhị phân tìm kiếm, tìm kiếm & sắp xếp — đọc code, chạy từng bước, viết hàm C++.',
  available: true,
  modules: [
    { id: 'pointers', label: '1. Con trỏ & cấp phát động (đọc code ghi kết quả)', Component: PointersModule },
    { id: 'linked-list', label: '2. Danh sách liên kết đơn', Component: LinkedListModule },
    { id: 'doubly-linked-list', label: '3. Danh sách liên kết đôi', Component: DoublyLinkedListModule },
    { id: 'stack', label: '4. Stack (ngăn xếp)', Component: StackModule },
    { id: 'queue', label: '5. Queue (hàng đợi)', Component: QueueModule },
    { id: 'hashtable', label: '6. Bảng băm (nối kết)', Component: HashtableModule },
    { id: 'bst', label: '7. Cây nhị phân tìm kiếm', Component: BstModule },
    { id: 'searching', label: '8. Tìm kiếm (tuyến tính, nhị phân, nội suy)', Component: SearchingModule },
    { id: 'sorting', label: '9. Sắp xếp (chọn, chèn trực tiếp)', Component: SortingModule },
    { id: 'mock-exams', label: '10. Đề thi thử & đề thực hành (tự chấm)', Component: MockExamsModule },
  ],
};
