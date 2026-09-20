import { Fragment } from "react";

/** Render chuỗi markup gọn: **đậm**, `code`, xuống dòng (\n). Không dùng innerHTML — mọi thứ là text node của React. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
        if (part.startsWith("**")) return <strong key={i} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>;
        if (part.startsWith("`")) return <code key={i} className="rounded bg-slate-700/60 px-1 py-0.5 font-mono text-[0.85em] text-slate-100">{part.slice(1, -1)}</code>;
        return (
          <Fragment key={i}>
            {part.split("\n").map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </>
  );
}
