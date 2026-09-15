import { Link } from "react-router-dom";
import clsx from "clsx";
import { subjects } from "@/subjects/registry";

export default function Home() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">Hướng dẫn học & giải đề</h1>
      <p className="text-slate-400 mb-6">
        Chọn môn học để xem hướng dẫn giải đề dạng tương tác, có animation từng bước.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {subjects.map((s) => (
          <Link
            key={s.id}
            to={s.available ? `/${s.id}` : "#"}
            className={clsx(
              "rounded-xl border p-4 transition",
              s.available
                ? "border-slate-700 bg-exam-panel/50 hover:border-exam-accent cursor-pointer"
                : "border-slate-800 bg-slate-900/40 opacity-60 cursor-not-allowed"
            )}
            onClick={(e) => !s.available && e.preventDefault()}
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-100">{s.label}</div>
              {!s.available && (
                <span className="text-xs rounded-full bg-slate-800 px-2 py-0.5 text-slate-400">
                  sắp có
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-400">{s.description}</p>
            {s.available && (
              <p className="mt-2 text-xs text-exam-accent">{s.modules.length} dạng bài →</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
