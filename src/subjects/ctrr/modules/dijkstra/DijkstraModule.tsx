import { useMemo, useState } from "react";
import { runDijkstra } from "../../engine/dijkstra";
import { CTRR_GRAPH_OPTIONS } from "../../graphOptions";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { GraphPicker } from "@/components/ui/GraphPicker";
import { StepPlayer } from "@/components/ui/StepPlayer";

export default function DijkstraModule() {
  const [selectedId, setSelectedId] = useState("2023-2024");
  const option = CTRR_GRAPH_OPTIONS.find((o) => o.id === selectedId)!;
  const source = option.defaultSource!;
  const { steps, summary } = useMemo(() => runDijkstra(option.graph, source), [option, source]);
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
        <h2 className="text-lg font-semibold mb-2">3c. Thuật toán Dijkstra — Đường đi ngắn nhất từ {source}</h2>
        <p className="text-sm text-slate-400 mb-4">
          {option.label}, Câu 3c. Bấm "Tiếp" để xem từng bước cố định đỉnh, hoặc "Tự
          chạy" để xem animation tự động.
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
