interface Props {
  tip: string;
}

/**
 * "Mẹo" callout — the watch-out note every source guide gives separately from its main
 * solution steps (e.g. "câu b hỏi 'không phải ca tối' tức là hỏi gộp..."). Kept visually
 * distinct (exam-warn accent) from the step narration and the "Ghi vào bài làm" answer
 * key so a student scanning the page can tell "explanation" / "watch out" / "what to
 * write" apart at a glance.
 */
export function TipCallout({ tip }: Props) {
  return (
    <div className="rounded-lg border border-exam-warn/40 bg-exam-warn/10 p-3 text-sm text-exam-warn">
      <span className="font-semibold">💡 Mẹo: </span>
      <span className="text-slate-200">{tip}</span>
    </div>
  );
}
