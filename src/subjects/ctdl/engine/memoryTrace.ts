import type { AlgoResult, AlgoStep, MemObjView, MemSlotView, MemorySnapshot } from "@/engine/types";
import { createMachine, CrashError, type Machine } from "./memoryMachine.ts";

export interface MemLine {
  /** Đúng dòng code trong đề (không thụt lề) — hiện trong khung code và là tiêu đề bước. */
  code: string;
  /** Vì sao dòng này cho kết quả như vậy (lời giải thích). */
  why: string;
  run: (m: Machine) => void;
}

export interface MemProgram {
  /** Các dòng trước thân `main` (include, struct, hàm, và `int main()` + `{`) — KHÔNG chạy, chỉ để đọc. */
  preamble: string[];
  lines: MemLine[];
}

export interface MemResult extends AlgoResult {
  output: string;
  crashed?: string;
}

/** Toàn bộ chương trình như đề in ra: preamble, thân `main` (thụt 4 ô), `return 0;`, `}`. */
export function buildSource(p: MemProgram): string {
  return [...p.preamble, ...p.lines.map((l) => `    ${l.code}`), "    return 0;", "}"].join("\n");
}

const slotKey = (k: string, s?: MemSlotView) => (s ? `${k}=${s.text}|${s.target ?? ""}` : "");

/** Mọi "ô" của ảnh chụp dưới dạng khóa → giá trị, để so sánh 2 bước và tô cái vừa đổi. */
function flatten(objs: MemObjView[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const o of objs) {
    m.set(o.id, "obj");
    if (o.slot) m.set(o.id, slotKey(o.id, o.slot));
    o.fields?.forEach((f) => m.set(`${o.id}.${f.name}`, slotKey(`${o.id}.${f.name}`, f.slot)));
    o.cells?.forEach((c, i) => m.set(`${o.id}[${i}]`, slotKey(`${o.id}[${i}]`, c)));
  }
  return m;
}

/**
 * Chạy chương trình "đọc code ghi kết quả" từng dòng trên máy bộ nhớ; mỗi dòng = 1 bước với ảnh chụp bộ nhớ sau dòng đó
 * (ô vừa đổi được tô), output tích lũy, và — nếu dòng đó gây lỗi runtime — dừng ngay với thông báo lỗi.
 */
export function runMemory(program: MemProgram): MemResult {
  const m = createMachine();
  const steps: AlgoStep[] = [];
  const body = program.preamble.length;
  let prev = new Map<string, string>();
  let crashed: string | undefined;

  const push = (title: string, explanation: string, codeLine: number, crash?: string) => {
    const s = m.snapshot();
    const now = flatten([...s.stack, ...s.heap]);
    const changed = [...now].filter(([k, v]) => prev.get(k) !== v).map(([k]) => k);
    prev = now;
    const memorySnapshot: MemorySnapshot = { ...s, changed, crashed: crash };
    steps.push({ title, explanation, codeLine, memorySnapshot });
  };

  push("Bắt đầu main(): chưa có biến nào", "Chương trình vừa vào hàm main — stack và heap còn trống, chưa in gì.", body);

  for (let i = 0; i < program.lines.length; i++) {
    const line = program.lines[i];
    try {
      line.run(m);
    } catch (e) {
      if (!(e instanceof CrashError)) throw e;
      crashed = e.message;
      push(line.code, `${line.why}`, body + i + 1, crashed);
      break;
    }
    push(line.code, line.why, body + i + 1);
  }

  const output = m.output();
  return { steps, output, crashed, summary: crashed ? `${crashed}${output ? ` (đã in trước khi lỗi: ${output.trim()})` : ""}` : `Output: ${output.trim() || "(không in gì)"}` };
}
