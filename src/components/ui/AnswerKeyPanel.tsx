export interface AnswerKeyLine {
  text: string;
  /** Điểm cho riêng dòng này — CHỈ điền khi nguồn đề thật sự cho điểm chi tiết tới mức
   *  đó (đừng bịa điểm từng dòng nếu nguồn chỉ cho điểm tổng cả câu). */
  points?: number;
}

export interface AnswerKeyPart {
  label: string; // "a)", "b)", "" cho khối đặt biến cố/giả thiết đầu câu
  lines: AnswerKeyLine[];
}

export interface AnswerKeySpec {
  title: string; // "Câu 1 — Xác suất toàn phần & Bayes"
  totalPoints?: number;
  setup: AnswerKeyLine[]; // "Gọi A là...", "P(A)=0.9,..." — khối trước a)/b)/c)
  parts: AnswerKeyPart[];
}

interface Props {
  spec: AnswerKeySpec;
}

function PointBadge({ points }: { points: number }) {
  return (
    <span className="ml-2 shrink-0 whitespace-nowrap rounded-full border border-exam-good/60 bg-exam-good/10 px-2 py-0.5 text-xs text-exam-good">
      {points}đ
    </span>
  );
}

function Line({ line, label }: { line: AnswerKeyLine; label?: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="font-mono">
        {label && <span className="mr-1 font-sans font-semibold text-exam-good">{label}</span>}
        {line.text}
      </span>
      {line.points !== undefined && <PointBadge points={line.points} />}
    </div>
  );
}

/**
 * "Ghi vào bài làm" — the compact, formula-only write-up a student would actually put
 * on the exam paper to earn points, formatted like a handwritten answer key (event
 * definitions → given data → labeled a)/b)/c) results). Visually distinct (exam-good
 * accent) from the step-by-step narration in `StepPlayer` above it, which explains WHY
 * each formula is used — this panel only shows WHAT to write.
 */
export function AnswerKeyPanel({ spec }: Props) {
  return (
    <div className="space-y-3 rounded-lg border border-exam-good/50 bg-exam-good/10 p-4 text-sm text-slate-200">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-exam-good">✍️ Ghi vào bài làm — {spec.title}</div>
        {spec.totalPoints !== undefined && <PointBadge points={spec.totalPoints} />}
      </div>
      {spec.setup.length > 0 && (
        <div className="space-y-1 border-t border-exam-good/20 pt-2">
          {spec.setup.map((line, i) => (
            <Line key={i} line={line} />
          ))}
        </div>
      )}
      {spec.parts.map((part, i) => (
        <div key={i} className="space-y-1 border-t border-exam-good/20 pt-2">
          {part.lines.map((line, j) => (
            <Line key={j} line={line} label={j === 0 ? part.label : undefined} />
          ))}
        </div>
      ))}
    </div>
  );
}
