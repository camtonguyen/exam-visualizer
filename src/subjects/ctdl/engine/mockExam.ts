/** Kiểu dữ liệu + chấm điểm (thuần, không React) cho module `mock-exams` — 3 đề thi thử tự chấm. */

export interface RubricPart {
  label: string;
  points: number;
  /** Ý cần có trong đáp án mẫu. Markup gọn: **đậm**, `code`, xuống dòng = \n. */
  body?: string;
  /** Đoạn code mẫu của phần này. */
  code?: string;
  /** Điểm cộng (comment Input/Output) — KHÔNG tính vào tổng 10. */
  bonus?: boolean;
}
export interface FillField {
  prefix?: string;
  width?: number;
  /** Các cách viết được chấp nhận (so sánh sau khi bỏ khoảng trắng + không phân biệt hoa thường). */
  accepted: string[];
}
export interface FillGroup {
  label: string;
  points: number;
  fields: FillField[];
}
interface QuestionBase {
  id: string;
  /** 1 = lý thuyết, 2 = đọc code / mô phỏng, 3 = viết hàm. */
  part: 1 | 2 | 3;
  points: number;
  /** ★ dạng lặp lại nhiều nhất trong đề thật. */
  star: boolean;
  text: string;
  hint?: string;
}
export type MockQuestion =
  | (QuestionBase & { type: "rubric"; parts: RubricPart[] })
  | (QuestionBase & { type: "fill"; groups: FillGroup[]; table?: string[][] });

export interface MockExam {
  id: string;
  title: string;
  desc: string;
  questions: MockQuestion[];
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

/** Chuẩn hóa câu trả lời điền: bỏ mọi khoảng trắng, không phân biệt hoa thường. */
export const normalizeAnswer = (s: string) => s.replace(/\s+/g, "").toLowerCase();

/** Một ô đúng khi bằng MỘT trong các đáp án chấp nhận (sau chuẩn hóa). */
export const fieldCorrect = (field: FillField, answer: string) => field.accepted.some((a) => normalizeAnswer(a) === normalizeAnswer(answer));

/** Một nhóm đúng khi MỌI ô của nhóm đúng (all-or-nothing — vd L, R, M của cùng 1 bước). */
export const groupCorrect = (group: FillGroup, answers: string[]) => group.fields.every((f, i) => fieldCorrect(f, answers[i] ?? ""));

/** Điểm câu điền = tổng điểm các nhóm đúng hoàn toàn. */
export function scoreFill(q: Extract<MockQuestion, { type: "fill" }>, answers: string[][]): number {
  return round2(q.groups.reduce((sum, g, gi) => sum + (groupCorrect(g, answers[gi] ?? []) ? g.points : 0), 0));
}

/** Điểm câu rubric = tổng điểm các ý (không phải điểm cộng) được tick, TRẦN bằng điểm câu; điểm cộng tách riêng. */
export function scoreRubric(q: Extract<MockQuestion, { type: "rubric" }>, checked: boolean[]): { earned: number; bonus: number } {
  let earned = 0;
  let bonus = 0;
  q.parts.forEach((p, i) => {
    if (!checked[i]) return;
    if (p.bonus) bonus += p.points;
    else earned += p.points;
  });
  return { earned: round2(Math.min(earned, q.points)), bonus: round2(bonus) };
}

export interface ExamState {
  /** Tick từng ý rubric: checked[questionId][partIndex]. */
  checked: Record<string, boolean[]>;
  /** Câu trả lời đã KIỂM TRA của câu điền: answers[questionId][groupIndex][fieldIndex]; vắng = chưa kiểm tra. */
  answers: Record<string, string[][]>;
}

export interface ExamScore {
  perQuestion: Record<string, number>;
  perPart: Record<1 | 2 | 3, number>;
  total: number;
  bonus: number;
}

/** Tổng hợp điểm cả đề từ trạng thái làm bài. */
export function scoreExam(exam: MockExam, state: ExamState): ExamScore {
  const perQuestion: Record<string, number> = {};
  const perPart: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  let bonus = 0;
  for (const q of exam.questions) {
    let earned = 0;
    if (q.type === "rubric") {
      const r = scoreRubric(q, state.checked[q.id] ?? []);
      earned = r.earned;
      bonus += r.bonus;
    } else if (state.answers[q.id]) {
      earned = scoreFill(q, state.answers[q.id]);
    }
    perQuestion[q.id] = earned;
    perPart[q.part] = round2(perPart[q.part] + earned);
  }
  return { perQuestion, perPart, total: round2(perPart[1] + perPart[2] + perPart[3]), bonus: round2(bonus) };
}
