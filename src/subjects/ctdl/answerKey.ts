import type { AlgoStep } from "@/engine/types";
import type { AnswerKeySpec } from "@/components/ui/AnswerKeyPanel";

/** "Ghi vào bài làm" từ danh sách dòng có sẵn (vd `opLog` của Stack/Queue: 1 dòng = 1 thao tác + trạng thái sau đó). */
export function answerKeyFromLines(title: string, setup: string[], lines: string[]): AnswerKeySpec {
  return {
    title,
    setup: setup.map((text) => ({ text })),
    parts: [{ label: "", lines: lines.map((text) => ({ text })) }],
  };
}

/**
 * "Ghi vào bài làm" cho các module chạy-từng-bước của CTDL: dòng nào cũng chính là `title` của
 * từng bước engine (đã đúng định dạng đề của thầy), nên sinh từ `steps` thay vì chép tay lần 2 —
 * một nguồn sự thật, không lệch với phần diễn giải. Bỏ bước đầu (giới thiệu). Không có điểm từng
 * dòng: các PDF không cho điểm chi tiết (xem `.claude/skills/ctdl-content/SKILL.md`).
 */
export function answerKeyFromSteps(title: string, setup: string[], steps: AlgoStep[]): AnswerKeySpec {
  return answerKeyFromLines(title, setup, steps.slice(1).map((s) => s.title));
}
