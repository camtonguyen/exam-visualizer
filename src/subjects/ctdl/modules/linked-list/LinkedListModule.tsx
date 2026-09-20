import { useMemo, useState } from "react";
import { runLinkedList } from "../../engine/linkedList";
import { LINKED_LIST_EXAMPLES, LINKED_LIST_CODE } from "../../data/linkedListExamples";
import { answerKeyFromLines } from "../../answerKey";
import { PointerCanvas } from "@/components/pointer/PointerCanvas";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AnswerKeyPanel } from "@/components/ui/AnswerKeyPanel";

export default function LinkedListModule() {
  const [selectedId, setSelectedId] = useState(LINKED_LIST_EXAMPLES[0].id);
  const example = LINKED_LIST_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary, opLog } = useMemo(() => runLinkedList(example.spec), [example]);
  const answerKey = useMemo(
    () => answerKeyFromLines("Trạng thái sau từng thao tác", [steps[0].title], opLog),
    [steps, opLog]
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
        <h2 className="text-lg font-semibold mb-2">2. Danh sách liên kết đơn</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng dòng lệnh của addHead / addTail / timGiaTri / timNodeKeCuoi / xóa trên danh sách liên kết đơn, đúng code của thầy. <span className="text-exam-accent">Xanh dương</span> = node đang xử lý ·{" "}
          <span className="text-exam-good">xanh lá</span> = vừa nối xong · <span className="text-exam-bad">đỏ</span> = sắp bị delete.
        </p>
      </div>
      <ExamplePicker
        options={LINKED_LIST_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
        selectedId={selectedId}
        onSelect={selectExample}
      />
      <PointerCanvas step={steps[index]} />
      <StepPlayer
        steps={steps}
        summary={summary}
        index={index}
        onIndexChange={setIndex}
        playing={playing}
        onPlayingChange={setPlaying}
      />
      {example.tip && <TipCallout tip={example.tip} />}
      <AnswerKeyPanel spec={answerKey} />
      <CodeBlock title="Code chuẩn (viết hàm trên đề)" code={LINKED_LIST_CODE} />
    </div>
  );
}
