import type { AlgoStep, MemObjView, MemSlotView } from "@/engine/types";

interface Props {
  step: AlgoStep;
}

const HEAD_H = 26;
const ROW_H = 24;
const GAP_Y = 16;
const MIN_W = 176;
const CELL_W = 34;
const TOP = 30;
const PAD_L = 24;
const COL_GAP = 150;

interface Box {
  o: MemObjView;
  x: number;
  y: number;
  w: number;
  h: number;
}

const boxWidth = (o: MemObjView) => (o.kind === "array" ? Math.max(MIN_W, (o.cells?.length ?? 0) * CELL_W + 16) : MIN_W);
const boxHeight = (o: MemObjView) =>
  HEAD_H + (o.kind === "scalar" ? ROW_H : o.kind === "struct" ? (o.fields?.length ?? 0) * ROW_H : CELL_W + 16);

/**
 * Draws `step.memorySnapshot` like the "vẽ ô nhớ" the exam expects: STACK (named variables, structs, arrays) on the
 * left, HEAP (objects made by `new`) on the right, an arrow from every pointer to what it points at, NULL / "?"
 * (uninitialized) written in the cell. What THIS step changed is tinted; a heap object nothing points to is dashed
 * red (memory leak); a runtime error stops the program with a banner. The program's output so far sits underneath.
 */
export function MemoryCanvas({ step }: Props) {
  const snap = step.memorySnapshot;
  if (!snap) return null;
  const changed = new Set(snap.changed);

  const layout = (objs: MemObjView[], x: number): Box[] => {
    let y = TOP;
    return objs.map((o) => {
      const b = { o, x, y, w: boxWidth(o), h: boxHeight(o) };
      y += b.h + GAP_Y;
      return b;
    });
  };
  const stackW = Math.max(MIN_W, ...snap.stack.map(boxWidth));
  const stack = layout(snap.stack, PAD_L);
  const heap = layout(snap.heap, PAD_L + stackW + COL_GAP);
  const heapW = Math.max(MIN_W, ...snap.heap.map(boxWidth));
  const width = PAD_L + stackW + COL_GAP + heapW + 70;
  const height = Math.max(TOP + 20, ...[...stack, ...heap].map((b) => b.y + b.h + GAP_Y));
  const byId = new Map([...stack, ...heap].map((b) => [b.o.id, b]));

  const arrows: { d: string; key: string }[] = [];
  const addArrow = (from: Box, rowY: number, slot: MemSlotView, key: string) => {
    if (!slot.target) return;
    const to = byId.get(slot.target);
    if (!to || to === from) return;
    const sx = from.x + from.w - 12;
    const ty = to.y + HEAD_H / 2;
    const forward = to.x > from.x + from.w - 1;
    arrows.push({
      key,
      d: forward
        ? `M ${sx} ${rowY} C ${sx + 50} ${rowY}, ${to.x - 50} ${ty}, ${to.x} ${ty}`
        : `M ${sx} ${rowY} C ${sx + 70} ${rowY}, ${to.x + to.w + 70} ${ty}, ${to.x + to.w} ${ty}`,
    });
  };

  const cellText = (s: MemSlotView) => (s.target ? "" : s.text);
  const tint = (key: string) => (changed.has(key) ? "rgba(56,189,248,0.4)" : "transparent");

  const drawBox = (b: Box) => {
    const { o } = b;
    const isNew = changed.has(o.id);
    return (
      <g key={o.id}>
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={6} fill="#1e293b" stroke={o.leaked ? "#ef4444" : isNew ? "#38bdf8" : "#94a3b8"} strokeWidth={isNew ? 2.5 : 1.5} strokeDasharray={o.leaked ? "5 3" : undefined} />
        <text x={b.x + 8} y={b.y + 17} fontSize="13" fontWeight={700} fontFamily="monospace" fill="#e2e8f0">
          {o.heap ? o.label : o.label}
          <tspan fontSize="10" fontWeight={400} fill="#94a3b8">{o.heap ? "" : `  ${o.type}`}</tspan>
        </text>
        <text x={b.x + b.w - 8} y={b.y + 17} textAnchor="end" fontSize="10" fontFamily="monospace" fill="#64748b">
          {o.leaked ? "⚠ rò rỉ" : o.addr}
        </text>
        <line x1={b.x} y1={b.y + HEAD_H} x2={b.x + b.w} y2={b.y + HEAD_H} stroke="#475569" />
        {o.kind === "scalar" && o.slot && slotRow(b, o.slot, o.id, "", b.y + HEAD_H)}
        {o.kind === "struct" && o.fields?.map((f, i) => slotRow(b, f.slot, `${o.id}.${f.name}`, f.name, b.y + HEAD_H + i * ROW_H))}
        {o.kind === "array" &&
          o.cells?.map((c, i) => {
            const cx = b.x + 8 + i * CELL_W;
            const cy = b.y + HEAD_H + 8;
            return (
              <g key={i}>
                <rect x={cx} y={cy} width={CELL_W} height={CELL_W - 6} fill={tint(`${o.id}[${i}]`)} stroke="#94a3b8" />
                <text x={cx + CELL_W / 2} y={cy + 17} textAnchor="middle" fontSize="12" fontFamily="monospace" fill="#e2e8f0">
                  {cellText(c)}
                </text>
                <text x={cx + CELL_W / 2} y={cy + CELL_W + 4} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#64748b">
                  {i}
                </text>
              </g>
            );
          })}
      </g>
    );
  };

  const slotRow = (b: Box, slot: MemSlotView, key: string, name: string, y: number) => {
    const cy = y + ROW_H / 2;
    addArrow(b, cy, slot, key);
    return (
      <g key={key}>
        <rect x={b.x + 1} y={y + 1} width={b.w - 2} height={ROW_H - 2} fill={tint(key)} />
        {name && (
          <text x={b.x + 8} y={cy + 4} fontSize="12" fontFamily="monospace" fill="#cbd5e1">
            {name}
          </text>
        )}
        <text x={b.x + b.w - 26} y={cy + 4} textAnchor="end" fontSize="13" fontWeight={700} fontFamily="monospace" fill={slot.text === "?" ? "#f59e0b" : slot.text === "NULL" ? "#94a3b8" : "#e2e8f0"}>
          {cellText(slot)}
        </text>
        {slot.target && <circle cx={b.x + b.w - 12} cy={cy} r={4} fill="#e2e8f0" />}
      </g>
    );
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="select-none">
          <defs>
            <marker id="mem-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#e2e8f0" />
            </marker>
          </defs>
          <text x={PAD_L} y={18} fontSize="11" fontWeight={700} fill="#64748b">STACK (biến)</text>
          <text x={PAD_L + stackW + COL_GAP} y={18} fontSize="11" fontWeight={700} fill="#64748b">HEAP (new)</text>
          {stack.map(drawBox)}
          {heap.map(drawBox)}
          {arrows.map((a) => (
            <path key={a.key} d={a.d} fill="none" stroke="#e2e8f0" strokeWidth={2} markerEnd="url(#mem-arrow)" />
          ))}
        </svg>
      </div>
      {snap.crashed && <div className="rounded-lg border border-exam-bad/60 bg-exam-bad/10 p-3 text-sm text-exam-bad">💥 {snap.crashed}</div>}
      <div className="rounded-lg border border-slate-700 bg-exam-panel/40 p-3 font-mono text-sm">
        <span className="text-xs text-slate-500">Output: </span>
        <span className="whitespace-pre-wrap text-slate-100">{snap.output || (snap.crashed ? "" : "(chưa in gì)")}</span>
      </div>
    </div>
  );
}
