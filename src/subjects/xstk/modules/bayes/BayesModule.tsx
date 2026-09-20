import { useMemo, useState } from "react";
import { runBayes } from "../../engine/bayes";
import { BAYES_EXAMPLES } from "../../data/bayesExamples";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CalculatorTip } from "@/components/ui/CalculatorTip";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function BayesModule() {
  const [selectedId, setSelectedId] = useState(BAYES_EXAMPLES[0].id);
  const example = BAYES_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runBayes(example.spec), [example]);
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
        <h2 className="text-lg font-semibold mb-2">1. Xác suất toàn phần &amp; Bayes</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng bước giải: cộng dồn các nhánh của phân hoạch thành xác suất
          toàn phần, rồi áp dụng công thức Bayes.
        </p>
      </div>
      <ExamplePicker
        options={BAYES_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
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
