import { useMemo, useState } from "react";
import { runRegression } from "../../engine/regression";
import { REGRESSION_EXAMPLES } from "../../data/regressionExamples";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CalculatorTip } from "@/components/ui/CalculatorTip";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function RegressionModule() {
  const [selectedId, setSelectedId] = useState(REGRESSION_EXAMPLES[0].id);
  const example = REGRESSION_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runRegression(example.spec), [example]);
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
        <h2 className="text-lg font-semibold mb-2">8. Tương quan &amp; hồi quy tuyến tính</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng bước giải: hệ số tương quan r, phương trình hồi quy bình
          phương cực tiểu, rồi dự đoán ngoại suy.
        </p>
      </div>
      <ExamplePicker
        options={REGRESSION_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
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
