import { useMemo, useState } from "react";
import { runSort } from "../../engine/sorting";
import { SORT_EXAMPLES } from "../../data/sortingExamples";
import { answerKeyFromSteps } from "../../answerKey";
import { ArrayCanvas } from "@/components/table/ArrayCanvas";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";
import { TraceTable } from "@/components/table/TraceTable";

export default function SortingModule() {
  const [selectedId, setSelectedId] = useState(SORT_EXAMPLES[0].id);
  const example = SORT_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary, table } = useMemo(() => runSort(example.spec), [example]);
  const answerKey = useMemo(
    () => answerKeyFromSteps("Cách ghi thứ 2 (có vị trí min & hoán vị)", [`Đầu vào: ${example.spec.array.join(" ")}`], steps),
    [example, steps]
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  function selectExample(id: string) {
    setSelectedId(id);
    setIndex(0);
    setPlaying(false);
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">9. Sắp xếp (chọn, chèn trực tiếp)</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng bước và bảng "Bước i = …" / "Lần #k" đúng cách trình bày của thầy (vùng đã sắp xếp: gạch chân / tô vàng).{" "}
          <span className="text-exam-good">Xanh lá</span> = vùng đã sắp xếp ·{" "}
          <span className="text-exam-accent">xanh dương</span> = phần tử vừa hoán vị / vừa chèn.
        </p>
      </div>
      <ExamplePicker
        options={SORT_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
        selectedId={selectedId}
        onSelect={selectExample}
      />
      <ArrayCanvas step={steps[index]} />
      <div className="rounded-lg border border-slate-700 bg-exam-panel/40 p-3">
        <div className="mb-2 text-xs font-semibold text-slate-400">Bảng chạy từng bước (cách trình bày của thầy) — hiện tới bước đang xem</div>
        <TraceTable table={table} upto={index} />
      </div>
      <StepPlayer
        steps={steps}
        summary={summary}
        index={index}
        onIndexChange={setIndex}
        playing={playing}
        onPlayingChange={setPlaying}
      />
      {example.tip && <TipCallout tip={example.tip} />}
      <div className="space-y-3 rounded-lg border border-exam-good/50 bg-exam-good/10 p-4">
        <div className="text-sm font-semibold text-exam-good">✍️ Ghi vào bài làm — bảng chạy từng bước</div>
        <TraceTable table={table} />
      </div>
      {example.spec.algorithm === "selection" && <AnswerKeyPanel spec={answerKey} />}
    </div>
  );
}
