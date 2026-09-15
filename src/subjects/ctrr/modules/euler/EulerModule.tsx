import { useMemo, useState } from "react";
import { runEuler } from "../../engine/euler";
import { CTRR_GRAPH_OPTIONS } from "../../graphOptions";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { GraphPicker } from "@/components/ui/GraphPicker";
import { StepPlayer } from "@/components/ui/StepPlayer";

export default function EulerModule() {
  // Both real exams have exactly 4 odd-degree vertices (no Euler circuit or path), so
  // default straight to the illustrative graph — the one that actually shows Fleury.
  const [selectedId, setSelectedId] = useState("minh-hoa");
  const option = CTRR_GRAPH_OPTIONS.find((o) => o.id === selectedId)!;
  const isMinhHoa = selectedId === "minh-hoa";
  const { steps, summary } = useMemo(() => runEuler(option.graph), [option]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  function selectGraph(id: string) {
    setSelectedId(id);
    setIndex(0);
    setPlaying(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="rounded-xl border border-slate-700 bg-exam-panel/50 p-4 space-y-4">
        <GraphPicker options={CTRR_GRAPH_OPTIONS} selectedId={selectedId} onSelect={selectGraph} />
        <GraphCanvas graph={option.graph} step={steps[index]} />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">3a. Chu trình/đường đi Euler</h2>
        <p className="text-sm text-slate-400 mb-4">
          {isMinhHoa
            ? "Ví dụ minh họa (không phải đề thi thật) — cả 2 đề thật đều KHÔNG có Euler (đúng 4 đỉnh bậc lẻ mỗi đề), dùng đồ thị này để xem thuật toán Fleury chạy thật."
            : `${option.label}, Câu 3a.`}{" "}
          Bấm "Tiếp" để đếm bậc từng đỉnh, hoặc "Tự chạy" để xem animation tự động.
        </p>
        <StepPlayer
          steps={steps}
          summary={summary}
          index={index}
          onIndexChange={setIndex}
          playing={playing}
          onPlayingChange={setPlaying}
        />
      </div>
    </div>
  );
}
