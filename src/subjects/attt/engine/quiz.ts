/**
 * Đề trắc nghiệm ATTT viết bằng markdown (`data/exams/*.md`) → cấu trúc cho QuizModule.
 * Định dạng file (xem `de-luyen-1.md`): `# Tiêu đề`, `> ghi chú`, câu hỏi bắt đầu bằng `**NN.**`,
 * 4 lựa chọn `a. … b. … c. … d. …` (cùng dòng hoặc xuống dòng), đoạn khác = ngữ cảnh
 * (in nguyên chỗ), và bảng `| NN | x | giải thích |` sau heading `## Đáp án`.
 */
export type QuizItem =
  | { kind: "text"; text: string }
  | { kind: "q"; num: number; text: string; options: string[] };

export interface QuizExam {
  id: string;
  title: string;
  note: string;
  items: QuizItem[];
  key: Record<number, { answer: number; why: string }>;
}

const LETTERS = "abcd";
// a./b./c./d. theo đúng thứ tự, cách nhau bằng dấu cách hoặc xuống dòng (formatter hay gộp 2 dấu cách thành 1).
const OPTIONS = /^([\s\S]*?)(?:^|\s)a\.\s([\s\S]*?)\s+b\.\s([\s\S]*?)\s+c\.\s([\s\S]*?)\s+d\.\s([\s\S]*)$/;

// RichText chỉ hiểu **đậm**/`code`: bỏ *nghiêng*, đổi gạch đầu dòng thành •.
const clean = (s: string) => s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1$2").replace(/^- /gm, "• ");

export function parseExam(id: string, md: string): QuizExam {
  const [body, keyPart = ""] = md.split(/^## Đáp án.*$/m);
  const exam: QuizExam = { id, title: id, note: "", items: [], key: {} };
  let buf: string[] = [];
  let qNum = 0;

  const flush = () => {
    const text = buf.join("\n").trim();
    buf = [];
    if (!text) return;
    if (!qNum) return void exam.items.push({ kind: "text", text: clean(text) });
    const m = text.match(OPTIONS);
    if (!m) throw new Error(`${id}: câu ${qNum} không có đủ 4 lựa chọn a. b. c. d.`);
    const [, stem, ...options] = m;
    exam.items.push({ kind: "q", num: qNum, text: clean(stem.trim()), options: options.map((o) => clean(o.trim())) });
    qNum = 0;
  };

  for (const line of body.split("\n")) {
    const q = line.match(/^\*\*(\d+)\.\*\*\s*(.*)$/);
    if (line.startsWith("# ")) exam.title = line.slice(2).trim();
    else if (line.startsWith(">")) exam.note += clean(line.replace(/^>\s?/, "")) + " ";
    else if (q) {
      flush();
      qNum = Number(q[1]);
      buf.push(q[2]);
    } else if (line.startsWith("## ")) {
      flush();
      exam.items.push({ kind: "text", text: `**${line.slice(3).trim()}**` });
    } else if (!line.trim() || line.trim() === "---") flush();
    else buf.push(line);
  }
  flush();

  for (const m of keyPart.matchAll(/^\| (\d+) \| ([abcd]) \| (.*) \|$/gm))
    exam.key[Number(m[1])] = { answer: LETTERS.indexOf(m[2]), why: m[3] };
  exam.note = exam.note.trim();

  const missing = exam.items.filter((i) => i.kind === "q" && !(i.num in exam.key));
  if (missing.length) throw new Error(`${id}: thiếu đáp án cho ${missing.length} câu`);
  return exam;
}

/** Điểm thang 10 (đề thật: 40 câu × 0.25đ). `chosen[num]` = chỉ số lựa chọn 0..3. */
export function scoreQuiz(exam: QuizExam, chosen: Record<number, number>) {
  const nums = exam.items.flatMap((i) => (i.kind === "q" ? [i.num] : []));
  const correct = nums.filter((n) => chosen[n] === exam.key[n].answer).length;
  return { correct, total: nums.length, score: nums.length ? (correct * 10) / nums.length : 0 };
}
