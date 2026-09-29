import { parseExam } from "../engine/quiz";

// Mọi file `exams/*.md` tự hiện trong app — thêm đề mới = thả thêm 1 file đúng định dạng (xem engine/quiz.ts).
const files = import.meta.glob<string>("./exams/*.md", { query: "?raw", import: "default", eager: true });

export const EXAMS = Object.entries(files)
  .sort(([a], [b]) => (a.includes("de-mau") ? -1 : b.includes("de-mau") ? 1 : a.localeCompare(b)))
  .map(([path, md]) => parseExam(path.replace(/^.*\/|\.md$/g, ""), md));
