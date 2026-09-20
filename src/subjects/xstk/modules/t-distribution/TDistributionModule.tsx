import { useMemo, useState } from "react";
import { runTDistribution } from "../../engine/tDistribution";
import { T_DISTRIBUTION_EXAMPLES } from "../../data/tDistributionExamples";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CalculatorTip } from "@/components/ui/CalculatorTip";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function TDistributionModule() {
  const [selectedId, setSelectedId] = useState(T_DISTRIBUTION_EXAMPLES[0].id);
  const example = T_DISTRIBUTION_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runTDistribution(example.spec), [example]);
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
        <h2 className="text-lg font-semibold mb-2">7. Ước lượng &amp; kiểm định trung bình (Student-t)</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng bước giải: khi CHƯA biết σ và n nhỏ, tính x̄/s từ mẫu rồi
          dùng phân phối Student-t (tra bảng theo df) thay vì z.
        </p>
      </div>
      <ExamplePicker
        options={T_DISTRIBUTION_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
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
