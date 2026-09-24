import { CodeBlock } from '@/components/ui/CodeBlock';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PRACTICE_EXAMS,
  PRACTICE_RULES,
  practiceSolution,
} from '../../data/practiceExams';

/** Phần tự luận (bộ 4 câu kèm lời giải Input/Output): không chấm điểm (PDF không cho điểm từng câu) — chỉ danh sách yêu cầu tự đánh dấu + quy định chấm thật + lối tắt sang module/lời giải. */
export default function PracticeExams() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <div className='space-y-4'>
      <div className='rounded-xl border border-exam-warn/40 bg-exam-warn/10 p-4 text-sm text-slate-200'>
        <div className='mb-2 font-semibold text-exam-warn'>
          Quy định chấm thi thực hành (đề thật)
        </div>
        <table className='mb-2 text-sm'>
          <tbody>
            {PRACTICE_RULES.penalties.map(([what, pen]) => (
              <tr key={what}>
                <td className='pr-6'>{what}</td>
                <td className='font-mono font-bold text-exam-bad'>{pen}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className='list-disc space-y-1 pl-5'>
          {PRACTICE_RULES.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
      {PRACTICE_EXAMS.map((ex) => {
        const reqs = ex.questions.filter((q) => q.startsWith('Câu'));
        const n = reqs.filter((_, i) => done[`${ex.id}:${i}`]).length;
        return (
          <div
            key={ex.id}
            className='rounded-xl border border-slate-700 bg-exam-panel/50 p-4'
          >
            <div className='flex flex-wrap items-baseline gap-2'>
              <h3 className='font-semibold text-slate-100'>{ex.title}</h3>
              <span className='rounded-full bg-slate-700/60 px-2 py-0.5 font-mono text-xs text-slate-300'>
                {ex.time}
              </span>
              <span className='ml-auto font-mono text-xs text-exam-accent'>
                {n} / {reqs.length} câu đã làm
              </span>
            </div>
            <div className='mt-1 text-xs text-slate-500'>
              Nguồn: {ex.source}
              {ex.similar && (
                <span className='ml-2 rounded border border-exam-warn/50 px-1.5 text-exam-warn'>
                  tự soạn — không phải đề thật
                </span>
              )}
            </div>
            <ul className='mt-3 space-y-1.5'>
              {ex.questions.map((q) => {
                const ri = reqs.indexOf(q);
                return (
                  <li
                    key={q}
                    className='flex items-start gap-2 text-sm text-slate-300'
                  >
                    {ri >= 0 ? (
                      <input
                        type='checkbox'
                        className='mt-1 h-4 w-4 accent-green-500'
                        checked={!!done[`${ex.id}:${ri}`]}
                        onChange={(e) =>
                          setDone((d) => ({
                            ...d,
                            [`${ex.id}:${ri}`]: e.target.checked,
                          }))
                        }
                        aria-label={q}
                      />
                    ) : (
                      <span className='w-4' />
                    )}
                    <span>{q}</span>
                  </li>
                );
              })}
            </ul>
            <div className='mt-3 space-y-2'>
              <button
                onClick={() => setOpen((o) => ({ ...o, [ex.id]: !o[ex.id] }))}
                className='rounded-md bg-exam-bad/90 px-3 py-1.5 text-sm font-semibold text-white'
              >
                {open[ex.id]
                  ? 'Ẩn lời giải'
                  : 'Xem lời giải (ghi Input/Output)'}
              </button>
              {open[ex.id] && (
                <CodeBlock
                  title='Lời giải — comment Input/Output trước mỗi hàm, Câu 4 là main (đã biên dịch & chạy thử)'
                  code={practiceSolution(ex.solutionKey)}
                />
              )}
            </div>
            <div className='mt-3 flex flex-wrap gap-3 text-sm'>
              <Link
                to={`/ctdl/${ex.moduleId}`}
                className='text-exam-accent underline'
              >
                Ôn kiến thức: module tương ứng →
              </Link>
              <span className='text-slate-400'>
                Lời giải C++ đã chạy thật:{' '}
                <code className='font-mono text-slate-300'>{ex.solution}</code>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
