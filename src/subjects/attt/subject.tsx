import type { SubjectDef } from '@/subjects/types';
import QuizModule from './modules/quiz/QuizModule';

/**
 * Môn 4: Nhập môn Bảo đảm & An ninh Thông tin (ATTT). Thi trắc nghiệm 40 câu. Nguồn: `docs/attt/`,
 * đóng gói trong `.claude/skills/attt-content/`. Đề nằm ở `data/exams/*.md` — thả thêm file là tự hiện.
 */
export const atttSubject: SubjectDef = {
  id: 'attt',
  label: 'Nhập môn Bảo đảm & An ninh Thông tin (ATTT)',
  shortLabel: 'ATTT',
  description: 'Trắc nghiệm 40 câu: mã hoá cổ điển & hiện đại, chứng thực dữ liệu, thăm dò/quét mạng, nguy cơ hệ thống, mã độc, Wi-Fi.',
  available: true,
  modules: [{ id: 'quiz', label: '1. Luyện đề trắc nghiệm', Component: QuizModule }],
};
