import type { BayesSpec } from "@/engine/types";
import type { CalculatorTipData } from "@/components/ui/CalculatorTip";
import type { AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export interface BayesExample {
  id: string;
  label: string;
  spec: BayesSpec;
  tip: string;
  calculatorTip: CalculatorTipData;
  answerKey: AnswerKeySpec;
}

/**
 * 4 ví dụ thật, transcribed từ `docs/xstk/files/*.md` (đối chiếu số liệu + kết quả với
 * "Bấm máy" của từng file — không chỉ tin số cho sẵn). CITD Đề1/Đề2 hỏi Bayes MỞ RỘNG
 * (gộp 2 Ai ở tử số, điều kiện theo phần bù của B); UICD Đề1/Đề2 hỏi Bayes ĐƠN GIẢN
 * (1 nhánh, điều kiện trực tiếp theo B) — cùng 1 `BayesSpec`/`runBayes` xử lý cả 2 kiểu
 * qua `targetEventIds`/`conditionOnComplement`, không cần nhánh code riêng.
 *
 * `answerKey.totalPoints` = điểm TỔNG của cả câu, đúng như nguồn ghi ("Câu 1 (2đ)") —
 * nguồn không cho điểm chi tiết từng dòng a)/b), nên KHÔNG bịa điểm ở cấp độ dòng
 * (`AnswerKeyLine.points` để trống ở mọi dòng con).
 */
export const BAYES_EXAMPLES: BayesExample[] = [
  {
    id: "citd-2025-2026-de1-cau1",
    label: "CITD 2025-2026, Đề 1, Câu 1",
    spec: {
      partition: [
        { id: "sang", label: "Ca sáng", prior: 0.4 },
        { id: "chieu", label: "Ca chiều", prior: 0.45 },
        { id: "toi", label: "Ca tối", prior: 0.15 },
      ],
      branches: [
        { fromEventId: "sang", prob: 0.05 },
        { fromEventId: "chieu", prob: 0.08 },
        { fromEventId: "toi", prob: 0.16 },
      ],
      eventLabel: "Phế phẩm",
      targetLabel: "Không phải ca tối, biết sản phẩm không phải phế phẩm",
      targetEventIds: ["sang", "chieu"],
      conditionOnComplement: true,
    },
    tip: "Câu b hỏi \"KHÔNG phải ca tối\" tức là hỏi gộp cả ca sáng và ca chiều — phải cộng tử số của 2 nhóm này lại, không chỉ tính riêng 1 ca.",
    calculatorTip: {
      menu: "MODE COMP",
      steps: ["0.4×0.05+0.45×0.08+0.15×0.16 =        → 0.08", "(0.4×0.95+0.45×0.92)÷0.92 =           → 0.863"],
    },
    answerKey: {
      title: "Câu 1 — Xác suất toàn phần & Bayes",
      totalPoints: 2,
      setup: [
        { text: "Gọi S, C, T là biến cố sản phẩm thuộc ca sáng/chiều/tối; P là biến cố sản phẩm phế phẩm." },
        { text: "P(S)=0,4   P(C)=0,45   P(T)=0,15" },
        { text: "P(P|S)=0,05   P(P|C)=0,08   P(P|T)=0,16" },
      ],
      parts: [
        { label: "a)", lines: [{ text: "P(P) = P(S)P(P|S)+P(C)P(P|C)+P(T)P(P|T) = 0,08 = 8%" }] },
        {
          label: "b)",
          lines: [
            {
              text: "P(không T|không P) = [P(S)P(khôngP|S)+P(C)P(khôngP|C)] / P(khôngP) ≈ 0,8630 = 86,30%",
            },
          ],
        },
      ],
    },
  },
  {
    id: "citd-2025-2026-de2-cau1",
    label: "CITD 2025-2026, Đề 2, Câu 1",
    spec: {
      partition: [
        { id: "px1", label: "Phân xưởng I", prior: 0.36 },
        { id: "px2", label: "Phân xưởng II", prior: 0.4 },
        { id: "px3", label: "Phân xưởng III", prior: 0.24 },
      ],
      branches: [
        { fromEventId: "px1", prob: 0.1 },
        { fromEventId: "px2", prob: 0.08 },
        { fromEventId: "px3", prob: 0.12 },
      ],
      eventLabel: "Phế phẩm",
      targetLabel: "Không phải phân xưởng III, biết sản phẩm không phải phế phẩm",
      targetEventIds: ["px1", "px2"],
      conditionOnComplement: true,
    },
    tip: "Giống dạng bài của Đề 1 — \"không phải PX III\" nghĩa là gộp PX I và PX II vào tử số Bayes, không chỉ 1 phân xưởng.",
    calculatorTip: {
      menu: "MODE COMP",
      steps: ["0.36×0.1+0.4×0.08+0.24×0.12 =        → 0.0968", "(0.36×0.9+0.4×0.92)÷(1-0.0968) =     → 0.7662"],
    },
    answerKey: {
      title: "Câu 1 — Xác suất toàn phần & Bayes",
      totalPoints: 2,
      setup: [
        { text: "Gọi A, B, C là biến cố sản phẩm thuộc phân xưởng I/II/III; D là biến cố sản phẩm phế phẩm." },
        { text: "P(A)=0,36   P(B)=0,4   P(C)=0,24" },
        { text: "P(D|A)=0,1   P(D|B)=0,08   P(D|C)=0,12" },
      ],
      parts: [
        { label: "a)", lines: [{ text: "P(D) = P(A)P(D|A)+P(B)P(D|B)+P(C)P(D|C) = 0,0968 = 9,68%" }] },
        {
          label: "b)",
          lines: [
            {
              text: "P(không III|không D) = [P(A)P(khôngD|A)+P(B)P(khôngD|B)] / P(khôngD) ≈ 0,7662 = 76,62%",
            },
          ],
        },
      ],
    },
  },
  {
    id: "uicd-2025-de1-cau1",
    label: "UICD 2025, Đề 1, Câu 1",
    spec: {
      partition: [
        { id: "donviA", label: "Đơn vị A", prior: 0.7 },
        { id: "donviB", label: "Đơn vị B", prior: 0.2 },
        { id: "donviC", label: "Đơn vị C", prior: 0.1 },
      ],
      branches: [
        { fromEventId: "donviA", prob: 0.03 },
        { fromEventId: "donviB", prob: 0.05 },
        { fromEventId: "donviC", prob: 0.07 },
      ],
      eventLabel: "Lỗi",
      targetLabel: "Đơn vị A, biết sản phẩm bị lỗi",
      targetEventIds: ["donviA"],
      conditionOnComplement: false,
    },
    tip: "Luôn lập bảng 3 cột (tỉ lệ nguồn × xác suất lỗi) trước khi tính — tránh nhầm lẫn giữa các đơn vị khi số liệu nhiều.",
    calculatorTip: {
      menu: "MODE COMP",
      steps: [
        "0.7×0.03+0.2×0.05+0.1×0.07 =        → 0.038   (lưu vào biến A: SHIFT→RCL→A)",
        "0.7×0.03÷0.038 =                     → 0.5526",
      ],
    },
    answerKey: {
      title: "Câu 1 — Xác suất toàn phần & Bayes",
      totalPoints: 2,
      setup: [
        { text: "Gọi A, B, C là biến cố sản phẩm đến từ đơn vị A/B/C; L là biến cố sản phẩm bị lỗi." },
        { text: "P(A)=0,7   P(B)=0,2   P(C)=0,1" },
        { text: "P(L|A)=0,03   P(L|B)=0,05   P(L|C)=0,07" },
      ],
      parts: [
        { label: "a)", lines: [{ text: "P(L) = P(A)P(L|A)+P(B)P(L|B)+P(C)P(L|C) = 0,038 = 3,8%" }] },
        { label: "b)", lines: [{ text: "P(A|L) = P(A)P(L|A) / P(L) = 0,021/0,038 ≈ 0,5526 = 55,26%" }] },
      ],
    },
  },
  {
    id: "uicd-2025-de2-cau1",
    label: "UICD 2025, Đề 2, Câu 1",
    spec: {
      partition: [
        { id: "nccX", label: "Nhà cung cấp X", prior: 0.5 },
        { id: "nccY", label: "Nhà cung cấp Y", prior: 0.3 },
        { id: "nccZ", label: "Nhà cung cấp Z", prior: 0.2 },
      ],
      branches: [
        { fromEventId: "nccX", prob: 0.02 },
        { fromEventId: "nccY", prob: 0.04 },
        { fromEventId: "nccZ", prob: 0.05 },
      ],
      eventLabel: "Lỗi",
      targetLabel: "Nhà cung cấp Y, biết linh kiện bị lỗi",
      targetEventIds: ["nccY"],
      conditionOnComplement: false,
    },
    tip: "Tính P(D) (mẫu số của Bayes) một lần rồi dùng lại — không tính lại từ đầu ở câu b.",
    calculatorTip: {
      menu: "MODE COMP",
      steps: [
        "0.5×0.02+0.3×0.04+0.2×0.05 =    → 0.032   (SHIFT→RCL→A để lưu)",
        "0.3×0.04÷0.032 =                 → 0.375",
      ],
    },
    answerKey: {
      title: "Câu 1 — Xác suất toàn phần & Bayes",
      totalPoints: 2,
      setup: [
        { text: "Gọi X, Y, Z là biến cố linh kiện đến từ nhà cung cấp X/Y/Z; D là biến cố linh kiện bị lỗi." },
        { text: "P(X)=0,5   P(Y)=0,3   P(Z)=0,2" },
        { text: "P(D|X)=0,02   P(D|Y)=0,04   P(D|Z)=0,05" },
      ],
      parts: [
        { label: "a)", lines: [{ text: "P(D) = P(X)P(D|X)+P(Y)P(D|Y)+P(Z)P(D|Z) = 0,032 = 3,2%" }] },
        { label: "b)", lines: [{ text: "P(Y|D) = P(Y)P(D|Y) / P(D) = 0,012/0,032 = 0,375 = 37,5%" }] },
      ],
    },
  },
];
