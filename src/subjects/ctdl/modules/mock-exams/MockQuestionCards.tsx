import { useState } from "react";
import { RichText } from "@/components/ui/RichText";
import { fieldCorrect, groupCorrect, scoreFill, scoreRubric, type MockQuestion } from "../../engine/mockExam";

type RubricQ = Extract<MockQuestion, { type: "rubric" }>;
type FillQ = Extract<MockQuestion, { type: "fill" }>;

function Head({ q, num, earned }: { q: MockQuestion; num: number; earned?: string }) {
  const parts = q.type === "fill" && q.groups.length > 1 ? ` (${q.groups.length} phần)` : "";
  return (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <span className="font-bold text-slate-100">Câu {num}</span>
      <span className="rounded-full bg-slate-700/60 px-2 py-0.5 font-mono text-xs text-slate-300">
        {q.points}đ{parts}
      </span>
      {q.star && <span className="text-xs font-bold text-exam-bad">★ ăn điểm</span>}
      {earned && <span className="ml-auto font-mono text-xs font-bold text-exam-accent">{earned}</span>}
    </div>
  );
}

function Hint({ text }: { text?: string }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return (
    <div className="mt-2">
      <button onClick={() => setOpen((o) => !o)} className="rounded-md border border-exam-warn/40 bg-exam-warn/10 px-2.5 py-1 text-xs font-semibold text-exam-warn">
        💡 Mẹo nhớ
      </button>
      {open && (
        <div className="mt-2 rounded-md border-l-2 border-exam-warn bg-exam-warn/10 px-3 py-2 text-sm text-slate-200">
          <RichText text={text} />
        </div>
      )}
    </div>
  );
}

const card = (star: boolean) => `rounded-xl border bg-exam-panel/50 p-4 ${star ? "border-slate-700 border-l-4 border-l-exam-bad" : "border-slate-700"}`;

/** Câu tự luận / viết hàm: viết nháp → xem đáp án mẫu → tự tick từng ý rubric (giống cách chấm thật). */
export function RubricCard({ q, num, checked, onToggle }: { q: RubricQ; num: number; checked: boolean[]; onToggle: (i: number, v: boolean) => void }) {
  const [revealed, setRevealed] = useState(false);
  const { earned, bonus } = scoreRubric(q, checked);
  return (
    <div className={card(q.star)}>
      <Head q={q} num={num} />
      <div className="text-sm leading-relaxed text-slate-300">
        <RichText text={q.text} />
      </div>
      <textarea
        className="mt-3 min-h-20 w-full resize-y rounded-lg border border-slate-600 bg-exam-bg p-2 font-mono text-xs text-slate-200"
        placeholder="Viết câu trả lời của bạn vào đây (không bắt buộc, không lưu)..."
      />
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <button onClick={() => setRevealed((r) => !r)} className="rounded-md bg-exam-bad/90 px-3 py-1.5 text-sm font-semibold text-white">
          {revealed ? "Ẩn đáp án mẫu" : "Xem đáp án mẫu & tự chấm"}
        </button>
        <Hint text={q.hint} />
      </div>
      {revealed && (
        <div className="mt-3 divide-y divide-slate-700 border-t border-dashed border-slate-600">
          {q.parts.map((p, i) => (
            <label key={i} className={`flex cursor-pointer items-start gap-3 py-2 ${p.bonus ? "rounded-md bg-exam-warn/10 px-2" : ""}`}>
              <input type="checkbox" className="mt-1 h-4 w-4 accent-green-500" checked={!!checked[i]} onChange={(e) => onToggle(i, e.target.checked)} />
              <span className="text-sm text-slate-300">
                <b className={p.bonus ? "text-exam-warn" : "text-slate-100"}>{p.label}</b>{" "}
                {p.body && <RichText text={p.body} />}
                {p.code && <pre className="mt-1.5 overflow-x-auto rounded-md bg-exam-bg p-2 font-mono text-xs text-slate-200">{p.code}</pre>}
              </span>
            </label>
          ))}
          <div className="pt-2 text-xs font-bold text-exam-accent">
            Điểm câu này: {earned.toFixed(2)} / {q.points}đ{bonus > 0 && `  (điểm cộng: +${bonus.toFixed(2)}đ)`}
          </div>
        </div>
      )}
    </div>
  );
}

/** Câu điền / mô phỏng: nhập rồi "Kiểm tra tất cả" — mỗi nhóm đúng hoàn toàn mới có điểm, sai thì hiện đáp án đúng. */
export function FillCard({ q, num, submitted, onSubmit }: { q: FillQ; num: number; submitted?: string[][]; onSubmit: (answers: string[][]) => void }) {
  const [inputs, setInputs] = useState<string[][]>(() => q.groups.map((g) => g.fields.map(() => "")));
  const done = submitted !== undefined;
  const earned = done ? scoreFill(q, submitted) : 0;
  const set = (gi: number, fi: number, v: string) => setInputs((prev) => prev.map((row, i) => (i === gi ? row.map((c, j) => (j === fi ? v : c)) : row)));
  return (
    <div className={card(q.star)}>
      <Head q={q} num={num} earned={done ? `${earned.toFixed(2)} / ${q.points}đ` : undefined} />
      <div className="text-sm leading-relaxed text-slate-300">
        <RichText text={q.text} />
      </div>
      {q.table && (
        <div className="mt-2 overflow-x-auto">
          <table className="border-collapse font-mono text-xs">
            <tbody>
              {q.table.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} colSpan={row.length === 1 ? 2 : 1} className={`border border-slate-600 px-2.5 py-1 ${r === 0 ? "bg-slate-700 font-semibold" : c === 0 ? "bg-slate-800 font-bold" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 space-y-2">
        {q.groups.map((g, gi) => (
          <div key={gi} className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
            <span>{g.label}</span>
            {g.fields.map((f, fi) => {
              const val = done ? (submitted[gi]?.[fi] ?? "") : inputs[gi][fi];
              const ok = done && fieldCorrect(f, val);
              return (
                <span key={fi} className="inline-flex items-center gap-1">
                  {f.prefix}
                  <input
                    aria-label={`${g.label} ${f.prefix ?? ""}`}
                    value={val}
                    disabled={done}
                    onChange={(e) => set(gi, fi, e.target.value)}
                    style={{ width: f.width ?? 60 }}
                    className={`rounded-md border px-2 py-1 text-slate-100 ${done ? (ok ? "border-exam-good bg-exam-good/15" : "border-exam-bad bg-exam-bad/15") : "border-slate-600 bg-exam-bg"}`}
                  />
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button disabled={done} onClick={() => onSubmit(inputs)} className="rounded-md bg-exam-accent px-3 py-1.5 text-sm font-semibold text-slate-900 disabled:opacity-40">
          Kiểm tra tất cả
        </button>
        <Hint text={q.hint} />
      </div>
      {done && (
        <div className="mt-2 space-y-0.5 text-sm font-semibold">
          {q.groups.map((g, gi) =>
            groupCorrect(g, submitted[gi] ?? []) ? (
              <div key={gi} className="text-exam-good">✓ {g.label} đúng</div>
            ) : (
              <div key={gi} className="text-exam-bad">✗ {g.label} sai — đáp án đúng: {g.fields.map((f) => f.accepted[0]).join(", ")}</div>
            )
          )}
        </div>
      )}
    </div>
  );
}
