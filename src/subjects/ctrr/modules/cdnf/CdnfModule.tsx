import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { runCdnf } from "../../engine/cdnf";
import { boolFn20222023, boolFn20232024 } from "../../data/booleanFunctions";
import { TruthTableCanvas } from "@/components/table/TruthTableCanvas";
import { StepPlayer } from "@/components/ui/StepPlayer";

const EXAMS = [
  { key: "2022-2023", label: "HK1 2022–2023", spec: boolFn20222023 },
  { key: "2023-2024", label: "HK1 2023–2024", spec: boolFn20232024 },
] as const;

export default function CdnfModule() {
  const [examKey, setExamKey] = useState<(typeof EXAMS)[number]["key"]>(EXAMS[0].key);
  const exam = EXAMS.find((e) => e.key === examKey)!;
  const { steps, summary } = useMemo(() => runCdnf(exam.spec), [exam]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const revealedTerms = useMemo(() => {
    const terms: string[] = [];
    for (let i = 0; i <= index; i++) {
      const term = steps[i].tableSnapshot?.term;
      if (typeof term === "string") terms.push(term);
    }
    return terms;
  }, [steps, index]);

  function selectExam(key: (typeof EXAMS)[number]["key"]) {
    setExamKey(key);
    setIndex(0);
    setPlaying(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="rounded-xl border border-slate-700 bg-exam-panel/50 p-4 space-y-4">
        <div className="flex gap-2">
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
              Đề {e.label}
            </button>
          ))}
        </div>

        <TruthTableCanvas variables={exam.spec.variables} step={steps[index]} />

        <div className="rounded-lg border border-slate-700 bg-exam-panel p-3 min-h-[3rem] text-sm font-mono leading-relaxed">
          <span className="text-slate-500">f({exam.spec.variables.join(", ")}) = </span>
          {revealedTerms.map((term, i) => (
            <motion.span
              key={term}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {term}
              {i < revealedTerms.length - 1 ? " ∨ " : ""}
            </motion.span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">1a. Dạng nối rời chính tắc (CDNF)</h2>
        <p className="text-sm text-slate-400 mb-4">
          Đề {exam.label}, Câu 1a — đề cho{" "}
          {exam.spec.givenAs === "zeros" ? "f⁻¹(0)" : "f⁻¹(1)"}. Bấm "Tiếp" để quét từng tổ
          hợp, hoặc "Tự chạy" để xem animation tự động.
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
