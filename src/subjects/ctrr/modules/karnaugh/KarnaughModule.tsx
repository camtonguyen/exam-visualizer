import { useMemo, useState } from "react";
import { runKarnaugh, findPrimeImplicants, findAllMinimalCovers } from "../../engine/karnaugh";
import {
  boolFn20222023,
  boolFn20232024,
  boolFnTeachingCoverSizes,
} from "../../data/booleanFunctions";
import { KarnaughGrid } from "@/components/karnaugh/KarnaughGrid";
import { StepPlayer } from "@/components/ui/StepPlayer";

const EXAMS = [
  { key: "2022-2023", label: "Đề HK1 2022–2023", spec: boolFn20222023, teaching: false },
  { key: "2023-2024", label: "Đề HK1 2023–2024", spec: boolFn20232024, teaching: false },
  {
    key: "teaching",
    label: "Ví dụ minh họa (phủ khác cỡ)",
    spec: boolFnTeachingCoverSizes,
    teaching: true,
  },
] as const;

export default function KarnaughModule() {
  const [examKey, setExamKey] = useState<(typeof EXAMS)[number]["key"]>(EXAMS[0].key);
  const exam = EXAMS.find((e) => e.key === examKey)!;
  const { steps, summary } = useMemo(() => runKarnaugh(exam.spec), [exam]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const minimalFormulas = useMemo(() => {
    const pis = findPrimeImplicants(exam.spec);
    return findAllMinimalCovers(pis, exam.spec.onesSet).map((cover) =>
      cover.map((p) => p.term).join(" ∨ ")
    );
  }, [exam]);

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

        <KarnaughGrid variables={exam.spec.variables} step={steps[index]} />

        <div className="rounded-lg border border-slate-700 bg-exam-panel p-3 text-sm font-mono leading-relaxed space-y-1">
          <div className="text-slate-500 font-sans text-xs uppercase tracking-wide">
            Công thức tối tiểu {minimalFormulas.length > 1 ? `(${minimalFormulas.length} cách)` : ""}
          </div>
          {minimalFormulas.map((f) => (
            <div key={f}>f({exam.spec.variables.join(", ")}) = {f}</div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">1b. Biểu đồ Karnaugh</h2>
        <p className="text-sm text-slate-400 mb-4">
          {exam.teaching
            ? "Hàm minh họa (không phải đề thi thật) — dùng để thấy rõ bước so sánh phủ khác cỡ, vì 2 đề thật đều có các phủ tối tiểu cùng cỡ."
            : `${exam.label}, Câu 1b.`}{" "}
          Bấm "Tiếp" để xem từng tế bào lớn được tìm ra, hoặc "Tự chạy" để xem animation tự
          động.
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
