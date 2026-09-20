import { useMemo, useState } from "react";
import { runCiKnownSigma } from "../../engine/ciKnownSigma";
import { CI_KNOWN_SIGMA_EXAMPLES } from "../../data/ciKnownSigmaExamples";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CalculatorTip } from "@/components/ui/CalculatorTip";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function CiKnownSigmaModule() {
  const [selectedId, setSelectedId] = useState(CI_KNOWN_SIGMA_EXAMPLES[0].id);
  const example = CI_KNOWN_SIGMA_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary } = useMemo(() => runCiKnownSigma(example.spec), [example]);
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
        <h2 className="text-lg font-semibold mb-2">4. Ước lượng khoảng (biết σ) &amp; cỡ mẫu</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng bước giải: ước lượng khoảng tin cậy cho μ khi biết σ, rồi
          tìm cỡ mẫu tối thiểu cho sai số yêu cầu.
        </p>
      </div>
      <ExamplePicker
        options={CI_KNOWN_SIGMA_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
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
