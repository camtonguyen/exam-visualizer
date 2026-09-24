export interface TraceRow {
  label: string;
  cells: number[];
  /** Số ô đầu hàng được đánh dấu (vùng đã sắp xếp). */
  marked: number;
}

export interface TraceTableData {
  /** "underline" = gạch chân (mẫu chọn trực tiếp của thầy), "fill" = tô vàng (mẫu chèn trực tiếp). */
  mark: "underline" | "fill";
  /** Nhãn hàng chỉ số (vd "i"); bỏ trống = không có hàng chỉ số. */
  indexLabel?: string;
  inputLabel: string;
  input: number[];
  rows: TraceRow[];
}

interface Props {
  table: TraceTableData;
  /** Chỉ hiện `upto` hàng bước đầu tiên (đồng bộ với StepPlayer); mặc định hiện hết. */
  upto?: number;
}

/**
 * Bảng chạy từng bước đúng cách trình bày trên giấy của thầy (`Huong_Dan_Trinh_Bay.pdf`): hàng chỉ số màu đỏ, hàng đầu vào,
 * rồi mỗi bước 1 hàng với vùng đã sắp xếp được gạch chân (chọn trực tiếp) hoặc tô vàng (chèn trực tiếp).
 */
export function TraceTable({ table, upto }: Props) {
  const rows = table.rows.slice(0, upto ?? table.rows.length);
  const cell = "px-3 py-1 text-center font-mono";
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-x-1 border-spacing-y-1 text-sm text-slate-200">
        <tbody>
          {table.indexLabel !== undefined && (
            <tr>
              <td className="pr-4 text-right font-semibold text-exam-bad">{table.indexLabel}</td>
              {table.input.map((_, i) => (
                <td key={i} className={`${cell} font-bold text-exam-bad`}>{i}</td>
              ))}
            </tr>
          )}
          <tr>
            <td className="pr-4 text-right font-semibold text-slate-300">{table.inputLabel}</td>
            {table.input.map((v, i) => (
              <td key={i} className={`${cell} rounded border border-slate-600 font-bold`}>{v}</td>
            ))}
          </tr>
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="whitespace-nowrap pr-4 text-right text-slate-300">{r.label}</td>
              {r.cells.map((v, i) => {
                const on = i < r.marked;
                const style =
                  table.mark === "underline"
                    ? on ? "underline decoration-2 underline-offset-4 font-bold text-exam-bad" : ""
                    : on ? "rounded bg-exam-warn/80 font-bold text-slate-900" : "rounded border border-slate-600";
                return <td key={i} className={`${cell} ${style}`}>{v}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
