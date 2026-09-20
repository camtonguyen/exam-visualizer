import { useMemo, useState } from "react";
import { runCiSampleProportion } from "../../engine/ciSampleProportion";
import { CI_SAMPLE_PROPORTION_EXAMPLES } from "../../data/ciSampleProportionExamples";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CalculatorTip } from "@/components/ui/CalculatorTip";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function CiSampleProportionModule() {
  const [selectedId, setSelectedId] = useState(CI_SAMPLE_PROPORTION_EXAMPLES[0].id);
  const example = CI_SAMPLE_PROPORTION_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runCiSampleProportion(example.spec), [example]);
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
        <h2 className="text-lg font-semibold mb-2">5. Ước lượng &amp; kiểm định tỷ lệ (từ bảng tần số)</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng bước giải: tính x̄/S từ bảng tần số ghép nhóm, ước lượng
          khoảng cho μ, rồi kiểm định tỷ lệ từ cùng bảng.
        </p>
      </div>
      <ExamplePicker
        options={CI_SAMPLE_PROPORTION_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
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
