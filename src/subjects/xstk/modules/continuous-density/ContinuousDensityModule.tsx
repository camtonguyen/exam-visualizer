import { useMemo, useState } from "react";
import { runContinuousDensity } from "../../engine/continuousDensity";
import { CONTINUOUS_DENSITY_EXAMPLES } from "../../data/continuousDensityExamples";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CalculatorTip } from "@/components/ui/CalculatorTip";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function ContinuousDensityModule() {
  const [selectedId, setSelectedId] = useState(CONTINUOUS_DENSITY_EXAMPLES[0].id);
  const example = CONTINUOUS_DENSITY_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runContinuousDensity(example.spec), [example]);
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
        <h2 className="text-lg font-semibold mb-2">2. Biến ngẫu nhiên liên tục</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng bước giải: tìm K bằng cách lấp đầy diện tích dưới f(x) = 1,
          tính E(X)/Var(X), rồi tính xác suất P(khoảng) cần tìm.
        </p>
      </div>
      <ExamplePicker
        options={CONTINUOUS_DENSITY_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
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
