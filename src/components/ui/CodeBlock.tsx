interface Props {
  title: string;
  code: string;
  /** 1-based line to highlight (the line the current step executes). Also turns on line numbers. */
  highlight?: number;
}

/** Canonical / example C++ shown next to a trace — the exam asks students to WRITE or READ it, so the module
 *  shows the source itself. Plain text, no highlighter; `highlight` marks the line being executed. */
export function CodeBlock({ title, code, highlight }: Props) {
  const lines = code.split("\n");
  return (
    <div className="rounded-lg border border-slate-700 bg-exam-panel/40">
      <div className="border-b border-slate-700 px-3 py-2 text-sm font-semibold text-exam-accent">{title}</div>
      <pre className="overflow-x-auto py-3 text-xs leading-relaxed text-slate-200 font-mono">
        {lines.map((line, i) => (
          <div key={i} className={`px-3 ${highlight === i + 1 ? "bg-exam-accent/25 text-white" : ""}`}>
            {highlight !== undefined && <span className="mr-3 inline-block w-5 select-none text-right text-slate-500">{i + 1}</span>}
            {line || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}
