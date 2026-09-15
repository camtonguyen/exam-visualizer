import { NavLink, Route, Routes, useParams } from "react-router-dom";
import clsx from "clsx";
import { subjects, getSubject, getModule } from "@/subjects/registry";
import Home from "@/routes/Home";
import SubjectHome from "@/routes/SubjectHome";

/** Resolves `:subjectId/:moduleId` to the registered module's component and renders it. */
function ModulePage() {
  const { subjectId, moduleId } = useParams();
  const mod = subjectId && moduleId ? getModule(subjectId, moduleId) : undefined;
  if (!mod) return <div className="text-slate-400">Không tìm thấy bài học này.</div>;
  const Component = mod.Component;
  return <Component />;
}

function Sidebar() {
  const { subjectId } = useParams();
  const activeSubject = subjectId ? getSubject(subjectId) : undefined;

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 p-4 space-y-4 overflow-y-auto">
      <NavLink to="/" className="block text-exam-accent font-bold text-lg mb-2">
        Hướng dẫn giải đề
      </NavLink>

      {/* Subject switcher */}
      <div className="space-y-1">
        {subjects.map((s) => (
          <NavLink
            key={s.id}
            to={s.available ? `/${s.id}` : "#"}
            className={({ isActive }) =>
              clsx(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm",
                !s.available && "opacity-50 pointer-events-none",
                isActive || s.id === subjectId
                  ? "bg-exam-panel text-exam-accent font-semibold"
                  : "hover:bg-exam-panel"
              )
            }
          >
            <span>{s.shortLabel}</span>
            {!s.available && <span className="text-[10px] text-slate-500">sắp có</span>}
          </NavLink>
        ))}
      </div>

      {/* Modules of the active subject */}
      {activeSubject && (
        <div className="border-t border-slate-800 pt-3 space-y-1">
          <div className="px-3 text-xs uppercase tracking-wide text-slate-500 mb-1">
            {activeSubject.shortLabel}
          </div>
          {activeSubject.modules.map((m) => (
            <NavLink
              key={m.id}
              to={`/${activeSubject.id}/${m.id}`}
              className={({ isActive }) =>
                clsx(
                  "block rounded-md px-3 py-2 text-sm",
                  isActive ? "bg-exam-panel text-exam-accent font-semibold" : "hover:bg-exam-panel"
                )
              }
            >
              {m.label}
            </NavLink>
          ))}
        </div>
      )}
    </aside>
  );
}

function App() {
  return (
    <div className="min-h-screen flex">
      <Routes>
        {/* Sidebar only shows module list once a subject is selected; Home has no :subjectId param. */}
        <Route path="/" element={<Sidebar />} />
        <Route path="/:subjectId/*" element={<Sidebar />} />
      </Routes>
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:subjectId" element={<SubjectHome />} />
          <Route path="/:subjectId/:moduleId" element={<ModulePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
