import { useMemo, useState } from "react";
import { runJointContinuous } from "../../engine/jointContinuous";
import { JOINT_CONTINUOUS_EXAMPLES } from "../../data/jointContinuousExamples";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CalculatorTip } from "@/components/ui/CalculatorTip";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function JointContinuousModule() {
  const [selectedId, setSelectedId] = useState(JOINT_CONTINUOUS_EXAMPLES[0].id);
  const example = JOINT_CONTINUOUS_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runJointContinuous(example.spec), [example]);
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
        <h2 className="text-lg font-semibold mb-2">10. Phân phối đồng thời liên tục</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng bước giải: mật độ biên, rồi phân biệt 2 kiểu điều kiện —
          tại 1 điểm X=x₀ (mật độ có điều kiện) và trên 1 khoảng X (xác suất có điều
          kiện P(A∩B)/P(A)).
        </p>
      </div>
      <ExamplePicker
        options={JOINT_CONTINUOUS_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
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
