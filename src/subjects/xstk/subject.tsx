import type { SubjectDef } from '@/subjects/types';
import BayesModule from './modules/bayes/BayesModule';
import ContinuousDensityModule from './modules/continuous-density/ContinuousDensityModule';
import NormalDistributionModule from './modules/normal-distribution/NormalDistributionModule';
import CiKnownSigmaModule from './modules/ci-known-sigma/CiKnownSigmaModule';
import CiSampleProportionModule from './modules/ci-sample-proportion/CiSampleProportionModule';
import HypothesisProportionModule from './modules/hypothesis-proportion/HypothesisProportionModule';
import TDistributionModule from './modules/t-distribution/TDistributionModule';
import RegressionModule from './modules/regression/RegressionModule';
import JointDiscreteModule from './modules/joint-discrete/JointDiscreteModule';
import JointContinuousModule from './modules/joint-continuous/JointContinuousModule';

/**
 * Môn 2: Xác suất Thống kê (XSTK). Nguồn nội dung: `docs/xstk/files/*.md` — 2 đề "CITD
 * 2025-2026" (có đáp án), 2 đề "UICD-2025" (chưa có đáp án gốc, nhưng hướng dẫn đã giải
 * và verify), 1 đề "CK HK2 2023-2024" (giới thiệu 2 dạng bài mới: phân phối đồng thời,
 * Student-t) — xem `docs/PLAN.md` mục XSTK cho bảng 10 dạng bài đầy đủ và trạng thái
 * từng module.
 *
 * ✅ Cả 10/10 module đã có component thật (Giai đoạn 1 + 2 hoàn tất). Không có canvas
 * nào — mỗi module hiển thị "từng bước giải" dạng text + `TipCallout` + `CalculatorTip`
 * + `AnswerKeyPanel`, xem `docs/decisions.md` cho lý do.
 */
export const xstkSubject: SubjectDef = {
  id: 'xstk',
  label: 'Xác suất Thống kê (XSTK)',
  shortLabel: 'XSTK',
  description:
    'Xác suất toàn phần & Bayes, biến ngẫu nhiên liên tục, phân phối chuẩn, ước lượng khoảng, kiểm định giả thuyết, phân phối đồng thời, hồi quy — đúng cấu trúc đề cuối kỳ.',
  available: true,
  modules: [
    {
      id: 'bayes',
      label: '1. Xác suất toàn phần & Bayes',
      Component: BayesModule,
    },
    {
      id: 'continuous-density',
      label: '2. Biến ngẫu nhiên liên tục (hàm mật độ)',
      Component: ContinuousDensityModule,
    },
    {
      id: 'normal-distribution',
      label: '3. Phân phối chuẩn',
      Component: NormalDistributionModule,
    },
    {
      id: 'ci-known-sigma',
      label: '4. Ước lượng khoảng (biết σ) & cỡ mẫu',
      Component: CiKnownSigmaModule,
    },
    {
      id: 'ci-sample-proportion',
      label: '5. Ước lượng & kiểm định tỷ lệ (từ bảng tần số)',
      Component: CiSampleProportionModule,
    },
    {
      id: 'hypothesis-proportion',
      label: '6. Kiểm định giả thuyết tỷ lệ (1/2 phía)',
      Component: HypothesisProportionModule,
    },
    {
      id: 't-distribution',
      label: '7. Ước lượng & kiểm định trung bình (Student-t)',
      Component: TDistributionModule,
    },
    {
      id: 'regression',
      label: '8. Tương quan & hồi quy tuyến tính',
      Component: RegressionModule,
    },
    {
      id: 'joint-discrete',
      label: '9. Phân phối đồng thời rời rạc',
      Component: JointDiscreteModule,
    },
    {
      id: 'joint-continuous',
      label: '10. Phân phối đồng thời liên tục',
      Component: JointContinuousModule,
    },
  ],
};
