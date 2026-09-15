import type { SubjectDef } from '@/subjects/types';
import CdnfModule from './modules/cdnf/CdnfModule';
import CircuitModule from './modules/circuit/CircuitModule';
import DijkstraModule from './modules/dijkstra/DijkstraModule';
import EulerModule from './modules/euler/EulerModule';
import GraphPropertiesModule from './modules/graph-properties/GraphPropertiesModule';
import HamiltonModule from './modules/hamilton/HamiltonModule';
import KarnaughModule from './modules/karnaugh/KarnaughModule';
import SpanningTreeModule from './modules/spanning-tree/SpanningTreeModule';

/**
 * Môn khởi đầu: Cấu trúc rời rạc (CTRR). Nguồn nội dung:
 * `Huong_dan_giai_de_cuoi_ky_CTRR.docx` — xem `docs/PLAN.md` mục CTRR để biết
 * module nào ánh xạ với câu nào trong đề, và trạng thái hoàn thành.
 *
 * Cả 8 module đều có component thật — không còn module nào trỏ vào ComingSoon.
 */
export const ctrrSubject: SubjectDef = {
  id: 'ctrr',
  label: 'Cấu trúc rời rạc (CTRR)',
  shortLabel: 'CTRR',
  description:
    'Hàm Bool (CDNF, Karnaugh, mạch logic) và Lý thuyết đồ thị (Euler, Hamilton, Dijkstra, cây khung) — đúng cấu trúc đề cuối kỳ.',
  available: true,
  modules: [
    {
      id: 'cdnf',
      label: '1a. Dạng nối rời chính tắc',
      Component: CdnfModule,
    },
    {
      id: 'karnaugh',
      label: '1b. Biểu đồ Karnaugh',
      Component: KarnaughModule,
    },
    {
      id: 'circuit',
      label: '1c. Sơ đồ mạch',
      Component: CircuitModule,
    },
    {
      id: 'graph-properties',
      label: '2. Dãy bậc & tính chất đồ thị',
      Component: GraphPropertiesModule,
    },
    {
      id: 'euler',
      label: '3a. Chu trình/đường đi Euler',
      Component: EulerModule,
    },
    {
      id: 'hamilton',
      label: '3b. Chu trình/đường đi Hamilton',
      Component: HamiltonModule,
    },
    {
      id: 'dijkstra',
      label: '3c. Thuật toán Dijkstra',
      Component: DijkstraModule,
    },
    {
      id: 'spanning-tree',
      label: '3d. Cây khung trọng số lớn nhất',
      Component: SpanningTreeModule,
    },
  ],
};
