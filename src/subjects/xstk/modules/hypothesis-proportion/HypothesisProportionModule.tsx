import { useMemo, useState } from "react";
import { runHypothesisProportion } from "../../engine/hypothesisProportion";
import { HYPOTHESIS_PROPORTION_EXAMPLES } from "../../data/hypothesisProportionExamples";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CalculatorTip } from "@/components/ui/CalculatorTip";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function HypothesisProportionModule() {
  const [selectedId, setSelectedId] = useState(HYPOTHESIS_PROPORTION_EXAMPLES[0].id);
  const example = HYPOTHESIS_PROPORTION_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runHypothesisProportion(example.spec), [example]);
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
        <h2 className="text-lg font-semibold mb-2">6. Kiểm định giả thuyết tỷ lệ (1/2 phía)</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng bước giải: tính Z, so với miền bác bỏ 1 hoặc 2 phía tùy
          cách đề nêu hướng lệch.
        </p>
      </div>
      <ExamplePicker
        options={HYPOTHESIS_PROPORTION_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
        selectedId={selectedId}
        onSelect={selectExample}
      />
      <StepPlayer
        steps={steps}
        summary={summary}
        index={index}
        onIndexChange={setIndex}
        playing={playing}
        onPlayingChange={setPlaying}
      />
      {example.tip && <TipCallout tip={example.tip} />}
      <CalculatorTip {...example.calculatorTip} />
      <AnswerKeyPanel spec={example.answerKey} />
    </div>
  );
}
