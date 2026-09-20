import { useMemo, useState } from "react";
import { buildSource, runMemory } from "../../engine/memoryTrace";
import { POINTER_EXAMPLES } from "../../data/pointersExamples";
import { MemoryCanvas } from "@/components/memory/MemoryCanvas";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AnswerKeyPanel, type AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export default function PointersModule() {
  const [selectedId, setSelectedId] = useState(POINTER_EXAMPLES[0].id);
  const example = POINTER_EXAMPLES.find((e) => e.id === selectedId)!;
  const source = useMemo(() => buildSource(example.program), [example]);
  const { steps, summary, output, crashed } = useMemo(() => runMemory(example.program), [example]);
  const answerKey = useMemo<AnswerKeySpec>(
    () => ({
      title: "Kết quả chương trình",
      setup: [],
      parts: [
        {
          label: "Kết quả:",
          lines: crashed ? [{ text: "Lỗi runtime (chương trình sập) — không in được kết quả." }] : output.trimEnd().split("\n").map((text) => ({ text })),
        },
        { label: "Giải thích:", lines: [{ text: example.reason }] },
      ],
    }),
    [example, output, crashed]
  );
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
        <h2 className="text-lg font-semibold mb-2">1. Con trỏ &amp; cấp phát động (đọc code ghi kết quả)</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Chạy từng dòng, xem stack, heap và con trỏ thay đổi — cách vẽ ô nhớ để đọc code ra kết quả.{" "}
          <span className="text-exam-accent">Xanh dương</span> = ô vừa đổi · <span className="text-exam-warn">?</span> = chưa khởi tạo (rác) ·{" "}
          <span className="text-exam-bad">nét đứt đỏ</span> = rò rỉ.
        </p>
      </div>
      <ExamplePicker
        options={POINTER_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
        selectedId={selectedId}
        onSelect={selectExample}
      />
      <MemoryCanvas step={steps[index]} />
      <StepPlayer
        steps={steps}
        summary={summary}
        index={index}
        onIndexChange={setIndex}
        playing={playing}
        onPlayingChange={setPlaying}
      />
      <CodeBlock title="Chương trình (dòng đang chạy được tô sáng)" code={source} highlight={steps[index].codeLine} />
      {example.tip && <TipCallout tip={example.tip} />}
      <AnswerKeyPanel spec={answerKey} />
    </div>
  );
}
