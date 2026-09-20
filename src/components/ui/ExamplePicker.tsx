export interface ExampleOption {
  id: string;
  label: string;
}

interface Props {
  options: ExampleOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/**
 * Generic "which đề" button row for any module choosing among a small fixed set of
 * worked examples. Subject-agnostic (no `GraphSpec`), so non-graph subjects reuse this
 * instead of `GraphPicker`. Plain buttons, not a dropdown — same reasoning as GraphPicker.
 */
export function ExamplePicker({ options, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onSelect(o.id)}
          className={`px-3 py-1.5 rounded-md border text-sm ${
            o.id === selectedId
              ? "border-exam-accent bg-exam-accent/10 text-exam-accent"
              : "border-slate-600 text-slate-400 hover:border-exam-accent"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
