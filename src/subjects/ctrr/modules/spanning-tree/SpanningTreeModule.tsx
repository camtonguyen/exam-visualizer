import { useMemo, useState } from "react";
import { runKruskalMax } from "../../engine/kruskalMax";
import { CTRR_GRAPH_OPTIONS } from "../../graphOptions";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { GraphPicker } from "@/components/ui/GraphPicker";
import { StepPlayer } from "@/components/ui/StepPlayer";

export default function SpanningTreeModule() {
  const [selectedId, setSelectedId] = useState("2023-2024");
  const option = CTRR_GRAPH_OPTIONS.find((o) => o.id === selectedId)!;
  const { steps, summary } = useMemo(() => runKruskalMax(option.graph), [option]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const sortedEdges = useMemo(
    () => [...option.graph.edges].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0)),
    [option]
  );

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
        <div className="rounded-lg border border-slate-700 bg-exam-panel p-3 text-xs text-slate-400">
          <span className="text-slate-500">Cạnh đã sắp giảm dần: </span>
          {sortedEdges.map((e) => `${e.from}${e.to}=${e.weight ?? 0}`).join(", ")}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">3d. Cây khung trọng số lớn nhất</h2>
        <p className="text-sm text-slate-400 mb-4">
          {option.label}, Câu 3d — thuật toán Kruskal đảo dấu (chọn cạnh nặng nhất
          trước). Bấm "Tiếp" để xét từng cạnh, hoặc "Tự chạy" để xem animation tự động.
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
