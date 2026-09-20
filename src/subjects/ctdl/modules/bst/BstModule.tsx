import { useMemo, useState } from "react";
import { runBst } from "../../engine/bst";
import { BST_EXAMPLES, BST_CODE } from "../../data/bstExamples";
import { TreeCanvas } from "@/components/tree/TreeCanvas";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AnswerKeyPanel, type AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export default function BstModule() {
  const [selectedId, setSelectedId] = useState(BST_EXAMPLES[0].id);
  const example = BST_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary, opLog, tree } = useMemo(() => runBst(example.spec), [example]);
  const answerKey = useMemo<AnswerKeySpec>(
    () => ({
      title: "Cây nhị phân tìm kiếm sau từng thao tác",
      setup: [{ text: "Quy tắc: trái < node < phải; giá trị trùng bị bỏ qua." }],
      parts: [
        { label: "", lines: opLog.map((text) => ({ text })) },
        { label: "Cây cuối:", lines: [{ text: `${tree}    (dạng gốc(trái,phải))` }] },
      ],
    }),
    [opLog, tree]
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
        <h2 className="text-lg font-semibold mb-2">7. Cây nhị phân tìm kiếm</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Chèn (pGoto/pLoca), tìm, duyệt NLR/LNR/LRN và LNR bằng std::stack — từng bước đúng code của thầy.{" "}
          <span className="text-exam-accent">Xanh dương</span> = node đang xét · <span className="text-exam-good">xanh lá</span> = đã chèn / đã thăm / tìm thấy ·{" "}
          <span className="text-exam-bad">đỏ</span> = trùng hoặc đã loại · nét đứt = node mới chưa nối.
        </p>
      </div>
      <ExamplePicker
        options={BST_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
        selectedId={selectedId}
        onSelect={selectExample}
      />
      <TreeCanvas step={steps[index]} />
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
      <CodeBlock title="Code chuẩn (viết hàm trên đề)" code={BST_CODE} />
    </div>
  );
}
