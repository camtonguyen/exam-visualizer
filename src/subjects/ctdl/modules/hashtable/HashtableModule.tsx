import { useMemo, useState } from "react";
import { runHashtable } from "../../engine/hashtable";
import { HASHTABLE_EXAMPLES, HASHTABLE_CODE } from "../../data/hashtableExamples";
import { HashTableCanvas } from "@/components/hash/HashTableCanvas";
import { ExamplePicker } from "@/components/ui/ExamplePicker";
import { StepPlayer } from "@/components/ui/StepPlayer";
import { TipCallout } from "@/components/ui/TipCallout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AnswerKeyPanel, type AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

export default function HashtableModule() {
  const [selectedId, setSelectedId] = useState(HASHTABLE_EXAMPLES[0].id);
  const example = HASHTABLE_EXAMPLES.find((e) => e.id === selectedId)!;
  const { steps, summary, opLog, table } = useMemo(() => runHashtable(example.spec), [example]);
  const answerKey = useMemo<AnswerKeySpec>(
    () => ({
      title: "Bảng băm sau từng thao tác",
      setup: [{ text: `Size = ${example.spec.size}, hashFun(x) = x % ${example.spec.size}` }],
      parts: [
        { label: "", lines: opLog.map((text) => ({ text })) },
        { label: "Kết quả:", lines: table.map((text) => ({ text })) },
      ],
    }),
    [example, opLog, table]
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
        <h2 className="text-lg font-semibold mb-2">6. Bảng băm (nối kết)</h2>
        <p className="text-sm text-slate-400">
          {example.label}. Từng dòng lệnh của add / find: băm ra bucket, đụng độ thì nối tiếp vào cùng danh sách.{" "}
          <span className="text-exam-accent">Xanh dương</span> = bucket/node đang xử lý · <span className="text-exam-good">xanh lá</span> = vừa nối xong ·{" "}
          <span className="text-exam-bad">đỏ</span> = đã loại · nét đứt = node mới chưa nối.
        </p>
      </div>
      <ExamplePicker
        options={HASHTABLE_EXAMPLES.map((e) => ({ id: e.id, label: e.label }))}
        selectedId={selectedId}
        onSelect={selectExample}
      />
      <HashTableCanvas step={steps[index]} />
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
      <CodeBlock title="Code chuẩn (viết hàm trên đề)" code={HASHTABLE_CODE} />
    </div>
  );
}
