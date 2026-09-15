import { useMemo, useState } from "react";
import { runCircuit } from "../../engine/circuit";
import { circuit20222023, circuit20232024 } from "../../data/circuits";
import { CircuitCanvas } from "@/components/circuit/CircuitCanvas";
import { StepPlayer } from "@/components/ui/StepPlayer";

const EXAMS = [
  { key: "2022-2023", label: "Đề HK1 2022–2023", spec: circuit20222023 },
  { key: "2023-2024", label: "Đề HK1 2023–2024", spec: circuit20232024 },
] as const;

function formulaText(spec: (typeof EXAMS)[number]["spec"]): string {
  return spec.terms
    .map((t) => t.literals.map((l) => (l.isTrue ? l.variable : `${l.variable}'`)).join(""))
    .join(" ∨ ");
}

export default function CircuitModule() {
  const [examKey, setExamKey] = useState<(typeof EXAMS)[number]["key"]>(EXAMS[0].key);
  const exam = EXAMS.find((e) => e.key === examKey)!;
  const { steps, summary } = useMemo(() => runCircuit(exam.spec), [exam]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  function selectExam(key: (typeof EXAMS)[number]["key"]) {
    setExamKey(key);
    setIndex(0);
    setPlaying(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="rounded-xl border border-slate-700 bg-exam-panel/50 p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {EXAMS.map((e) => (
            <button
              key={e.key}
              onClick={() => selectExam(e.key)}
              className={`px-3 py-1.5 rounded-md border text-sm ${
                e.key === examKey
                  ? "border-exam-accent bg-exam-accent/10 text-exam-accent"
                  : "border-slate-600 text-slate-400 hover:border-exam-accent"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-slate-700 bg-exam-panel p-3 text-sm font-mono">
          {exam.spec.outputLabel}({exam.spec.variables.join(", ")}) = {formulaText(exam.spec)}
        </div>

        <CircuitCanvas spec={exam.spec} step={steps[index]} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">1c. Sơ đồ mạch</h2>
        <p className="text-sm text-slate-400 mb-4">
          {exam.label}, Câu 1c — vẽ mạch cho "Cách 1" tìm được ở Câu 1b (Karnaugh). Bấm
          "Tiếp" để xem từng cổng được thêm vào, hoặc "Tự chạy" để xem animation tự động,
          kết thúc bằng bước chạy thử tín hiệu qua mạch.
        </p>
        <StepPlayer
          steps={steps}
          summary={summary}
          index={index}
          onIndexChange={setIndex}
          playing={playing}
          onPlayingChange={setPlaying}
        />
      </div>
    </div>
  );
}
