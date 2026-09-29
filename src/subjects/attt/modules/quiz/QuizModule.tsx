import { useState } from "react";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { RichText } from "@/components/ui/RichText";
import { EXAMS } from "../../data/exams";
import { scoreQuiz, type QuizExam } from "../../engine/quiz";

const LETTERS = "abcd";

function Paper({ exam }: { exam: QuizExam }) {
  const [chosen, setChosen] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const { correct, total, score } = scoreQuiz(exam, chosen);
  const answered = Object.keys(chosen).length;

  return (
    <div className="space-y-4">
      {exam.note && (
        <p className="rounded-lg border border-slate-700 bg-exam-panel p-3 text-sm text-slate-400">
          <RichText text={exam.note} />
        </p>
      )}

      <div className="sticky top-0 z-10 flex items-center gap-3 rounded-lg border border-slate-700 bg-exam-bg/95 px-3 py-2 text-sm backdrop-blur">
        <span className="text-slate-400">
          Đã làm <b className="text-slate-100">{answered}/{total}</b>
        </span>
        {submitted && (
          <span className={`font-mono font-bold ${score >= 7 ? "text-exam-good" : score >= 5 ? "text-exam-warn" : "text-exam-bad"}`}>
            {correct}/{total} câu đúng · {score.toFixed(2)} / 10
          </span>
        )}
        <div className="ml-auto flex gap-2">
          {!submitted ? (
            <button onClick={() => setSubmitted(true)} className="rounded-md bg-exam-accent px-3 py-1 font-semibold text-slate-900">
              Nộp bài
            </button>
          ) : (
            <button
              onClick={() => {
                setChosen({});
                setSubmitted(false);
              }}
              className="rounded-md border border-slate-600 px-3 py-1 text-slate-300 hover:border-exam-accent"
            >
              Làm lại
            </button>
          )}
        </div>
      </div>

      {exam.items.map((item, i) => {
        if (item.kind === "text")
          return (
            <div key={i} className="whitespace-pre-line text-sm text-slate-300">
              <RichText text={item.text} />
            </div>
          );
        const { answer, why } = exam.key[item.num];
        const pick = chosen[item.num];
        return (
          <fieldset key={i} className="rounded-lg border border-slate-700 bg-exam-panel p-4">
            <legend className="sr-only">Câu {item.num}</legend>
            <p className="mb-3 text-slate-100">
              <b className="text-exam-accent">{String(item.num).padStart(2, "0")}.</b> <RichText text={item.text} />
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {item.options.map((opt, k) => {
                const state = !submitted
                  ? pick === k
                    ? "border-exam-accent bg-exam-accent/10"
                    : "border-slate-600 hover:border-slate-400"
                  : k === answer
                    ? "border-exam-good bg-exam-good/10"
                    : pick === k
                      ? "border-exam-bad bg-exam-bad/10"
                      : "border-slate-700 opacity-60";
                return (
                  <label key={k} className={`flex cursor-pointer gap-2 rounded-md border px-3 py-2 text-sm text-slate-200 ${state}`}>
                    <input
                      type="radio"
                      name={`${exam.id}-${item.num}`}
                      checked={pick === k}
                      disabled={submitted}
                      onChange={() => setChosen((c) => ({ ...c, [item.num]: k }))}
                      className="mt-1 accent-sky-400"
                    />
                    <span>
                      <b>{LETTERS[k]}.</b> <RichText text={opt} />
                    </span>
                  </label>
                );
              })}
            </div>
            {submitted && (
              <p className={`mt-3 text-sm ${pick === answer ? "text-exam-good" : "text-exam-warn"}`}>
                {pick === answer ? "✓ Đúng" : pick === undefined ? "— Bỏ trống" : "✗ Sai"} · Đáp án <b>{LETTERS[answer]}</b>: <RichText text={why} />
              </p>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}

export default function QuizModule() {
  const [id, setId] = useState(EXAMS[0].id);
  const exam = EXAMS.find((e) => e.id === id)!;
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">Luyện đề trắc nghiệm</h2>
        <p className="text-sm text-slate-400">40 câu × 0.25đ, 75 phút, chọn 1 đáp án. Chọn đề, làm xong bấm "Nộp bài" để chấm và xem giải thích.</p>
      </div>
      <ExamplePicker options={EXAMS.map((e) => ({ id: e.id, label: e.title }))} selectedId={id} onSelect={setId} />
      <Paper key={id} exam={exam} />
    </div>
  );
}
