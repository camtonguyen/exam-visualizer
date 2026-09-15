import { useMemo, useState } from "react";
import type { AlgoStep } from "@/engine/types";
import { buildDegreeSequenceGraph, runDegreeSequenceCheck } from "../../engine/degreeSequence";
import { runOddDegreeCountProof, runPigeonholeProof } from "../../engine/pigeonholeDegree";
import { describeSpecialGraph } from "../../engine/specialGraphIllustration";
import {
  realExamSequences,
  existsExampleSequence,
  specialGraphSequences,
} from "../../data/degreeSequences";
import { meetingAcquaintanceGraph, handshakeGraph } from "../../data/pigeonholeExamples";
import {
  directedStronglyConnectedNotComplete,
  multigraphNoEulerHasHamilton,
} from "../../data/scriptedGraphBuild";
import { specialGraphs, wheelGraphW5 } from "../../data/specialGraphs";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { StepPlayer } from "@/components/ui/StepPlayer";

type Kind = "1" | "2" | "3";

function hasGraphContent(step: AlgoStep): boolean {
  return (
    Object.keys(step.nodeHighlights ?? {}).length > 0 || Object.keys(step.edgeHighlights ?? {}).length > 0
  );
}

const SEQUENCE_SETS = [
  { key: "real", label: "Đề thật HK1 2022–2023 (2 dãy)", seqs: realExamSequences },
  { key: "exists", label: "Ví dụ minh họa thêm (1 dãy tồn tại)", seqs: existsExampleSequence },
  { key: "special", label: "Ví dụ minh họa thêm (5 dạng đồ thị đặc biệt)", seqs: specialGraphSequences },
] as const;

function Kieu1() {
  const [setKey, setSetKey] = useState<(typeof SEQUENCE_SETS)[number]["key"]>("real");
  const seqs = SEQUENCE_SETS.find((s) => s.key === setKey)!.seqs;
  const { steps, summary } = useMemo(() => runDegreeSequenceCheck(seqs), [seqs]);
  const graph = useMemo(() => buildDegreeSequenceGraph(seqs), [seqs]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[index];

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="rounded-xl border border-slate-700 bg-exam-panel/50 p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {SEQUENCE_SETS.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setSetKey(s.key);
                setIndex(0);
                setPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-md border text-sm ${
                s.key === setKey
                  ? "border-exam-accent bg-exam-accent/10 text-exam-accent"
                  : "border-slate-600 text-slate-400 hover:border-exam-accent"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {hasGraphContent(step) ? (
          <GraphCanvas graph={graph} step={step} />
        ) : (
          <div className="rounded-lg border border-slate-700 bg-exam-panel p-4 space-y-2">
            {seqs.map((seq, i) => (
              <div key={i} className="text-sm font-mono text-slate-300">
                Dãy {seq.label ?? `(${i + 1})`} = ({seq.sequence.join(", ")})
              </div>
            ))}
            <p className="text-xs text-slate-500 pt-1">Chưa có gì để vẽ ở bước này.</p>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Kiểu 1 — Xét tồn tại đồ thị theo dãy bậc</h2>
        <p className="text-sm text-slate-400 mb-4">
          Định lý bắt tay + Havel–Hakimi. Bấm "Tiếp" để xem từng vòng lặp, hoặc "Tự chạy".
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

const PIGEONHOLE_EXAMPLES = [
  { key: "meeting", label: "Cuộc họp quen biết", graph: meetingAcquaintanceGraph },
  { key: "handshake", label: "Bắt tay", graph: handshakeGraph },
  { key: "wheel", label: "Bánh xe W₅ (ví dụ thêm)", graph: wheelGraphW5 },
] as const;

const PROOF_TECHNIQUES = [
  { key: "dirichlet", label: "Định lý 1.2 (2 đỉnh cùng bậc)" },
  { key: "odd-count", label: "Hệ quả Định lý 1.1 (số đỉnh bậc lẻ luôn chẵn)" },
] as const;

function Kieu3() {
  const [exKey, setExKey] = useState<(typeof PIGEONHOLE_EXAMPLES)[number]["key"]>("meeting");
  const [technique, setTechnique] = useState<(typeof PROOF_TECHNIQUES)[number]["key"]>("dirichlet");
  const graph = PIGEONHOLE_EXAMPLES.find((e) => e.key === exKey)!.graph;
  const { steps, summary } = useMemo(
    () => (technique === "dirichlet" ? runPigeonholeProof(graph) : runOddDegreeCountProof(graph)),
    [graph, technique]
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  function selectExample(key: (typeof PIGEONHOLE_EXAMPLES)[number]["key"]) {
    setExKey(key);
    setIndex(0);
    setPlaying(false);
  }
  function selectTechnique(key: (typeof PROOF_TECHNIQUES)[number]["key"]) {
    setTechnique(key);
    setIndex(0);
    setPlaying(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="rounded-xl border border-slate-700 bg-exam-panel/50 p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {PIGEONHOLE_EXAMPLES.map((e) => (
            <button
              key={e.key}
              onClick={() => selectExample(e.key)}
              className={`px-3 py-1.5 rounded-md border text-sm ${
                e.key === exKey
                  ? "border-exam-accent bg-exam-accent/10 text-exam-accent"
                  : "border-slate-600 text-slate-400 hover:border-exam-accent"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {PROOF_TECHNIQUES.map((t) => (
            <button
              key={t.key}
              onClick={() => selectTechnique(t.key)}
              className={`px-3 py-1.5 rounded-md border text-xs ${
                t.key === technique
                  ? "border-exam-good bg-exam-good/10 text-exam-good"
                  : "border-slate-600 text-slate-400 hover:border-exam-good"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <GraphCanvas graph={graph} step={steps[index]} />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Kiểu 3 — Chứng minh tồn tại 2 đối tượng cùng tính chất</h2>
        <p className="text-sm text-slate-400 mb-4">
          Guide mô tả 2 kỹ thuật chứng minh khác nhau cho Kiểu 3 — chọn kỹ thuật ở hàng nút
          thứ 2. Ví dụ minh họa — không phải số liệu đề thi thật.
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

const KIEU2_EXAM_PARTS = [
  {
    key: "a",
    label: "Ý a) Có hướng, liên thông mạnh, không đầy đủ",
    build: directedStronglyConnectedNotComplete,
  },
  {
    key: "b",
    label: "Ý b) Đa đồ thị, không Euler, có Hamilton",
    build: multigraphNoEulerHasHamilton,
  },
] as const;

const KIEU2_SPECIAL_PARTS = specialGraphs.map((sg) => {
  const { steps, summary } = describeSpecialGraph(sg.name, sg.formula, sg.graph);
  return { key: sg.key, label: sg.name, build: { graphs: steps.map(() => sg.graph), steps, summary } };
});

const KIEU2_PARTS = [...KIEU2_EXAM_PARTS, ...KIEU2_SPECIAL_PARTS];

function Kieu2() {
  const [partKey, setPartKey] = useState<(typeof KIEU2_PARTS)[number]["key"]>("a");
  const { graphs, steps, summary } = KIEU2_PARTS.find((p) => p.key === partKey)!.build;
  const isSpecial = KIEU2_SPECIAL_PARTS.some((p) => p.key === partKey);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  function selectPart(key: (typeof KIEU2_PARTS)[number]["key"]) {
    setPartKey(key);
    setIndex(0);
    setPlaying(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="rounded-xl border border-slate-700 bg-exam-panel/50 p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {KIEU2_EXAM_PARTS.map((p) => (
              <button
                key={p.key}
                onClick={() => selectPart(p.key)}
                className={`px-3 py-1.5 rounded-md border text-sm ${
                  p.key === partKey
                    ? "border-exam-accent bg-exam-accent/10 text-exam-accent"
                    : "border-slate-600 text-slate-400 hover:border-exam-accent"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {KIEU2_SPECIAL_PARTS.map((p) => (
              <button
                key={p.key}
                onClick={() => selectPart(p.key)}
                className={`px-3 py-1.5 rounded-md border text-xs ${
                  p.key === partKey
                    ? "border-exam-good bg-exam-good/10 text-exam-good"
                    : "border-slate-600 text-slate-400 hover:border-exam-good"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <GraphCanvas graph={graphs[index]} step={steps[index]} />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Kiểu 2 — Phác họa đồ thị thỏa tính chất cho trước</h2>
        <p className="text-sm text-slate-400 mb-4">
          {isSpecial
            ? "Ví dụ minh họa thêm (không phải đề thi thật) — 1 trong 5 dạng đồ thị đặc biệt của bảng \"Mẹo nhớ\" (Kₙ, Cₙ, Wₙ, đều bậc k, Qₙ)."
            : "Đề thật HK1 2023–2024, Câu 2 Kiểu 2. Ví dụ dựng sẵn (scripted) theo đúng lời giải trong guide."}{" "}
          Đây KHÔNG phải thuật toán tổng quát; dạng bài này vốn là xây dựng sáng tạo, mỗi
          đề có thể cần 1 đồ thị khác.
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

const KIND_TABS: { key: Kind; label: string }[] = [
  { key: "1", label: "Kiểu 1: Dãy bậc" },
  { key: "2", label: "Kiểu 2: Phác họa đồ thị" },
  { key: "3", label: "Kiểu 3: Nguyên lý Dirichlet" },
];

export default function GraphPropertiesModule() {
  const [kind, setKind] = useState<Kind>("1");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {KIND_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setKind(tab.key)}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              tab.key === kind
                ? "border-exam-accent bg-exam-accent/10 text-exam-accent"
                : "border-slate-600 text-slate-400 hover:border-exam-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {kind === "1" && <Kieu1 />}
      {kind === "2" && <Kieu2 />}
      {kind === "3" && <Kieu3 />}
    </div>
  );
}
