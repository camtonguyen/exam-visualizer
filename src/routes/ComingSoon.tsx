interface Props {
  title: string;
}

export default function ComingSoon({ title }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
      <div className="text-lg font-semibold text-slate-200 mb-2">{title}</div>
      <p>
        Module này chưa được xây dựng. Xem <code className="text-exam-accent">docs/PLAN.md</code> mục tương ứng
        và implement theo kiến trúc <code className="text-exam-accent">engine/ → module/</code> giống Dijkstra.
      </p>
    </div>
  );
}
