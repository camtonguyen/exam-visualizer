import { Link, useParams } from "react-router-dom";
import { getSubject } from "@/subjects/registry";

export default function SubjectHome() {
  const { subjectId } = useParams();
  const subject = subjectId ? getSubject(subjectId) : undefined;

  if (!subject) {
    return <div className="text-slate-400">Không tìm thấy môn học này.</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-1">{subject.label}</h1>
      <p className="text-slate-400 mb-6">{subject.description}</p>
      <div className="space-y-2">
        {subject.modules.map((m) => (
          <Link
            key={m.id}
            to={`/${subject.id}/${m.id}`}
            className="block rounded-lg border border-slate-700 bg-exam-panel/40 px-4 py-3 hover:border-exam-accent"
          >
            {m.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
