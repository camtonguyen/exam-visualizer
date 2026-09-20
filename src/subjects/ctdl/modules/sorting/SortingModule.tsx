import { useMemo, useState } from "react";
import { runSort } from "../../engine/sorting";
import { SORT_EXAMPLES } from "../../data/sortingExamples";
import { answerKeyFromSteps } from "../../answerKey";
import { ArrayCanvas } from "@/components/table/ArrayCanvas";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function SortingModule() {
  const [selectedId, setSelectedId] = useState(SORT_EXAMPLES[0].id);
  const example = SORT_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runSort(example.spec), [example]);
  const answerKey = useMemo(
    () => answerKeyFromSteps("Chạy từng bước sắp xếp", [`Đầu vào: ${example.spec.array.join(" ")}`], steps),
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
          {example.label}. Từng bước đúng bảng "Bước i = …" / "Lần #k" của thầy.{" "}
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
      <StepPlayer
        steps={steps}
        summary={summary}
        index={index}
        onIndexChange={setIndex}
        playing={playing}
        onPlayingChange={setPlaying}
      />
      {example.tip && <TipCallout tip={example.tip} />}
      <AnswerKeyPanel spec={answerKey} />
    </div>
  );
}
