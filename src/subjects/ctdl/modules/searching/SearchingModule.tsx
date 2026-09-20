import { useMemo, useState } from "react";
import { runSearch } from "../../engine/searching";
import { SEARCH_EXAMPLES } from "../../data/searchingExamples";
import { answerKeyFromSteps } from "../../answerKey";
import { ArrayCanvas } from "@/components/table/ArrayCanvas";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function SearchingModule() {
  const [selectedId, setSelectedId] = useState(SEARCH_EXAMPLES[0].id);
  const example = SEARCH_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runSearch(example.spec), [example]);
  const answerKey = useMemo(
    () =>
      answerKeyFromSteps(
        "Chạy từng bước tìm kiếm",
        [`Dãy: ${example.spec.array.join(" ")} — tìm ${example.spec.target}`],
        steps
      ),
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
        <h2 className="text-lg font-semibold mb-2">8. Tìm kiếm (tuyến tính, nhị phân, nội suy)</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Chạy từng bước đúng định dạng "Bước i = …" / "L, R ⇒ M" của thầy.{" "}
          <span className="text-exam-accent">Xanh dương</span> = đang xét ·{" "}
          <span className="text-exam-good">xanh lá</span> = tìm thấy ·{" "}
          <span className="text-exam-bad">đỏ</span> = đã loại.
        </p>
      </div>
      <ExamplePicker
        options={SEARCH_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
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
