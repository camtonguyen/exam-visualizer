import { useMemo, useState } from "react";
import { runJointDiscrete } from "../../engine/jointDiscrete";
import { JOINT_DISCRETE_EXAMPLES } from "../../data/jointDiscreteExamples";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CalculatorTip } from "@/components/ui/CalculatorTip";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function JointDiscreteModule() {
  const [selectedId, setSelectedId] = useState(JOINT_DISCRETE_EXAMPLES[0].id);
  const example = JOINT_DISCRETE_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runJointDiscrete(example.spec), [example]);
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
        <h2 className="text-lg font-semibold mb-2">9. Phân phối đồng thời rời rạc</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng bước giải: phân phối biên (cộng theo hàng/cột), xác suất
          gộp nhiều ô, rồi kiểm tra độc lập.
        </p>
      </div>
      <ExamplePicker
        options={JOINT_DISCRETE_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
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
