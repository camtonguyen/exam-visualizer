import { useState } from "react";
import { MOCK_EXAMS } from "../../data/mockExams";
import { scoreExam, type ExamState, type MockExam } from "../../engine/mockExam";
import { FillCard, RubricCard } from "./MockQuestionCards";
import PracticeExams from "./PracticeExams";

const PART_NAMES = { 1: "Lý thuyết & nhận diện thuật toán", 2: "Đọc hiểu code & mô phỏng thuật toán", 3: "Viết hàm (chia nhỏ theo rubric)" } as const;
const PART_DESCS = {
  1: "6 câu tự luận ngắn, mỗi câu 0.5đ — viết câu trả lời rồi tự đối chiếu đáp án mẫu.",
  2: "4 câu, mỗi câu 1đ — đọc code / mô phỏng thuật toán, điền câu trả lời.",
  3: "4 câu, mỗi câu 0.75đ chia 3 phần (0.25đ/phần) — viết code nháp rồi tự chấm theo rubric.",
} as const;
const PART_MAX = { 1: 3, 2: 4, 3: 3 } as const;
const EMPTY: ExamState = { checked: {}, answers: {} };

function band(total: number): { cls: string; text: string } {
  if (total >= 9) return { cls: "border-exam-good/50 bg-exam-good/10 text-exam-good", text: "🏆 Xuất sắc! Bạn nắm rất vững các dạng bài trọng tâm." };
  if (total >= 7) return { cls: "border-exam-good/50 bg-exam-good/10 text-exam-good", text: "✅ Đạt mục tiêu 7+ điểm! Xem lại các câu sai (nếu có) để chắc chắn hơn." };
  if (total >= 5) return { cls: "border-exam-warn/50 bg-exam-warn/10 text-exam-warn", text: "⚠️ Ở mức trung bình — ôn lại các câu ★ ăn điểm trước, đó là dạng lặp lại nhiều nhất." };
  return { cls: "border-exam-bad/50 bg-exam-bad/10 text-exam-bad", text: "📌 Cần ôn lại — tập trung khung code chuẩn Stack/Queue/DSLK/Hash/BST (các module bên trái, có code chuẩn kèm trace)." };
}

function ExamPaper({ exam }: { exam: MockExam }) {
  const [state, setState] = useState<ExamState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [round, setRound] = useState(0); // đổi key ⇒ mọi thẻ câu hỏi mount lại (xóa nháp/ô nhập)
  const score = scoreExam(exam, state);
  const b = band(score.total);
  const num = (q: MockExam["questions"][number]) => exam.questions.filter((x) => x.part < q.part).length + exam.questions.filter((x) => x.part === q.part).indexOf(q) + 1;

  return (
    <div key={round} className="space-y-6">
      <div className="sticky top-0 z-10 -mx-1 flex items-center gap-3 rounded-lg border border-slate-700 bg-exam-bg/95 px-3 py-2 backdrop-blur">
        <span className="whitespace-nowrap text-xs text-slate-400">Điểm hiện tại</span>
        <span className="whitespace-nowrap font-mono text-sm font-bold text-slate-100">{score.total.toFixed(2)} / 10</span>
        <div className="relative h-2.5 flex-1 rounded-full bg-slate-700">
          <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-exam-bad to-exam-warn transition-all" style={{ width: `${Math.min(100, score.total * 10)}%` }} />
          <div className="absolute -bottom-1 -top-1 left-[70%] w-0.5 bg-exam-accent" title="Mốc 7 điểm" />
        </div>
        {score.total >= 7 && <span className="whitespace-nowrap text-xs font-semibold text-exam-good">🎉 Đã đạt mốc 7+</span>}
      </div>

      {([1, 2, 3] as const).map((part) => (
        <section key={part} className="space-y-3">
          <div className="flex items-baseline gap-2 border-b-2 border-slate-600 pb-2">
            <span className="rounded bg-exam-accent px-2 py-0.5 font-mono text-xs font-semibold text-slate-900">PHẦN {["I", "II", "III"][part - 1]}</span>
            <h3 className="font-semibold text-slate-100">{PART_NAMES[part]}</h3>
          </div>
          <p className="text-sm text-slate-400">{PART_DESCS[part]}</p>
          {exam.questions
            .filter((q) => q.part === part)
            .map((q) =>
              q.type === "rubric" ? (
                <RubricCard
                  key={q.id}
                  q={q}
                  num={num(q)}
                  checked={state.checked[q.id] ?? []}
                  onToggle={(i, v) =>
                    setState((s) => {
                      const cur = [...(s.checked[q.id] ?? q.parts.map(() => false))];
                      cur[i] = v;
                      return { ...s, checked: { ...s.checked, [q.id]: cur } };
                    })
                  }
                />
              ) : (
                <FillCard key={q.id} q={q} num={num(q)} submitted={state.answers[q.id]} onSubmit={(a) => setState((s) => ({ ...s, answers: { ...s.answers, [q.id]: a } }))} />
              )
            )}
        </section>
      ))}

      <div className="space-y-3 border-t-2 border-slate-600 pt-4 text-center">
        <button onClick={() => setSubmitted(true)} className="rounded-lg bg-exam-bad px-6 py-2.5 font-bold text-white">
          Nộp bài &amp; Xem kết quả
        </button>
        <button
          onClick={() => {
            setState(EMPTY);
            setSubmitted(false);
            setRound((r) => r + 1);
          }}
          className="ml-3 rounded-lg border border-slate-600 px-4 py-2.5 text-slate-300"
        >
          Làm lại từ đầu
        </button>
        {submitted && (
          <div className="rounded-xl border border-slate-700 bg-exam-panel/60 p-5 text-left" aria-live="polite">
            <h3 className="mb-1 font-semibold text-slate-100">Kết quả {exam.title}</h3>
            <div className="font-mono text-4xl font-bold text-exam-bad">{score.total.toFixed(2)}/10</div>
            <div className="mt-3 divide-y divide-slate-700 text-sm text-slate-300">
              {([1, 2, 3] as const).map((p) => (
                <div key={p} className="flex justify-between py-1.5">
                  <span>Phần {["I", "II", "III"][p - 1]} — {PART_NAMES[p]}</span>
                  <span className="font-mono">{score.perPart[p].toFixed(2)} / {PART_MAX[p]}đ</span>
                </div>
              ))}
              <div className="flex justify-between py-1.5">
                <span>Điểm cộng (comment Input/Output)</span>
                <span className="font-mono">+{score.bonus.toFixed(2)}đ</span>
              </div>
            </div>
            <div className={`mt-3 rounded-lg border p-3 text-sm font-semibold ${b.cls}`}>{b.text}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MockExamsModule() {
  const [tab, setTab] = useState<"mock" | "practice">("mock");
  const [examId, setExamId] = useState(MOCK_EXAMS[0].id);
  const exam = MOCK_EXAMS.find((e) => e.id === examId)!;
  const pill = (active: boolean) => `rounded-full border px-4 py-1.5 text-sm font-semibold ${active ? "border-exam-accent bg-exam-accent text-slate-900" : "border-slate-600 text-slate-400 hover:border-exam-accent"}`;

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="mb-2 text-lg font-semibold">10. Đề thi thử &amp; đề thực hành (tự chấm)</h2>
        <p className="text-sm text-slate-400">
          3 đề thi thử tự chấm (mỗi đề 14 câu, 10 điểm) và 4 đề thực hành thật để tự đánh dấu. Ôn từng dạng ở các module bên trái, rồi vào đây làm cả đề.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setTab("mock")} className={pill(tab === "mock")}>Đề thi thử tự chấm (3 đề)</button>
        <button onClick={() => setTab("practice")} className={pill(tab === "practice")}>Đề thực hành (thật)</button>
      </div>

      <div className={tab === "mock" ? "space-y-4" : "hidden"}>
        <div className="rounded-lg border border-exam-warn/40 bg-exam-warn/10 p-3 text-sm text-slate-200">
          <b className="text-exam-warn">Đề THI THỬ — không phải đề thật.</b> Do người khác dựng theo dạng đề thật (đáp án đã được đối chiếu bằng engine của các module bên trái);
          bảng điểm 3/4/3 và mốc ≥ 7 là của tác giả bộ đề. Các câu <b className="text-exam-bad">★</b> là dạng lặp lại nhiều nhất.
        </div>
        <div className="flex flex-wrap gap-2">
          {MOCK_EXAMS.map((e) => (
            <button key={e.id} onClick={() => setExamId(e.id)} className={pill(e.id === examId)}>
              {e.title}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-400">
          <b className="text-slate-200">{exam.title}:</b> {exam.desc}
        </p>
        {/* Giữ cả 3 đề luôn mount (chỉ ẩn) để đổi tab không mất bài đang làm. */}
        {MOCK_EXAMS.map((e) => (
          <div key={e.id} className={e.id === examId ? "" : "hidden"}>
            <ExamPaper exam={e} />
          </div>
        ))}
      </div>

      <div className={tab === "practice" ? "" : "hidden"}>
        <PracticeExams />
      </div>
    </div>
  );
}
