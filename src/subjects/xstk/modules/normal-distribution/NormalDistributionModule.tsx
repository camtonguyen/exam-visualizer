import { useMemo, useState } from "react";
import { runNormalDistribution } from "../../engine/normalDistribution";
import { NORMAL_EXAMPLES } from "../../data/normalExamples";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CalculatorTip } from "@/components/ui/CalculatorTip";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function NormalDistributionModule() {
  const [selectedId, setSelectedId] = useState(NORMAL_EXAMPLES[0].id);
  const example = NORMAL_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runNormalDistribution(example.spec), [example]);
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
        <h2 className="text-lg font-semibold mb-2">3. Phân phối chuẩn</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng bước giải: chuẩn hóa Z=(X-μ)/σ, tra Φ(z); chiều ngược — cho
          %, tra ngược ra ngưỡng.
        </p>
      </div>
      <ExamplePicker
        options={NORMAL_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
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
