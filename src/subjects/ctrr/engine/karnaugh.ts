import type {
  AlgoResult,
  AlgoStep,
  BooleanFunctionSpec,
  GroupHighlight,
  HighlightState,
} from "@/engine/types";

export interface PrimeImplicant {
  id: number; // display order (1,2,3,...)
  term: string; // "xz", "y't'"...
  pattern: string; // "1-1-" Quine-McCluskey style (- = variable dropped)
  cells: string[]; // 4-char bit strings this cell covers
  essential: boolean;
}

interface Implicant {
  pattern: string;
  cells: string[];
}

function combine(a: Implicant, b: Implicant): Implicant | null {
  let diffIndex = -1;
  for (let i = 0; i < a.pattern.length; i++) {
    if (a.pattern[i] !== b.pattern[i]) {
      if (diffIndex !== -1) return null; // more than 1 bit differs — not adjacent
      diffIndex = i;
    }
  }
  if (diffIndex === -1) return null; // identical pattern
  if (a.pattern[diffIndex] === "-" || b.pattern[diffIndex] === "-") return null;
  return {
    pattern: a.pattern.slice(0, diffIndex) + "-" + a.pattern.slice(diffIndex + 1),
    cells: Array.from(new Set([...a.cells, ...b.cells])).sort(),
  };
}

function patternToTerm(pattern: string, variables: string[]): string {
  return pattern
    .split("")
    .map((bit, i) => (bit === "1" ? variables[i] : bit === "0" ? variables[i] + "'" : ""))
    .join("");
}

/**
 * Quine-McCluskey prime-implicant search. Combining two minterms that differ in exactly
 * one bit is exactly what "two adjacent Karnaugh cells" means once the grid is laid out
 * in Gray code — including wrap-around, since Gray-coded neighbors (first/last column or
 * row included) always differ by exactly 1 bit. So plain bit-string QM already finds
 * every prime implicant a hand-drawn Karnaugh map would, no separate "wrap" logic needed
 * here (SKILL.md Bước 3) — wrap-around only affects how `KarnaughGrid` *draws* a group.
 */
export function findPrimeImplicants(spec: BooleanFunctionSpec): PrimeImplicant[] {
  const { variables, onesSet } = spec;
  let current: Implicant[] = onesSet.map((c) => ({ pattern: c, cells: [c] }));
  const primeMap = new Map<string, Implicant>();

  while (current.length > 0) {
    const used = new Set<number>();
    const next = new Map<string, Implicant>();
    for (let i = 0; i < current.length; i++) {
      for (let j = i + 1; j < current.length; j++) {
        const combined = combine(current[i], current[j]);
        if (combined) {
          used.add(i);
          used.add(j);
          next.set(combined.pattern, combined);
        }
      }
    }
    current.forEach((imp, idx) => {
      if (!used.has(idx)) primeMap.set(imp.pattern, imp);
    });
    current = Array.from(next.values());
  }

  // Biggest groups first (most "obviously essential" tend to be biggest), tie-break by
  // pattern for a stable, deterministic id assignment.
  const sorted = Array.from(primeMap.values()).sort(
    (a, b) => b.cells.length - a.cells.length || a.pattern.localeCompare(b.pattern)
  );

  const coverCount = new Map<string, number>();
  sorted.forEach((imp) => imp.cells.forEach((c) => coverCount.set(c, (coverCount.get(c) ?? 0) + 1)));

  return sorted.map((imp, i) => ({
    id: i + 1,
    term: patternToTerm(imp.pattern, variables),
    pattern: imp.pattern,
    cells: imp.cells,
    essential: imp.cells.some((c) => coverCount.get(c) === 1),
  }));
}

/**
 * SKILL.md Bước 5: every irredundant way to cover the cells the essential prime
 * implicants don't already cover — NOT just the smallest one. Brute-forced over subsets
 * of the non-essential PIs (always a handful for a 4-variable function, so 2^n is cheap).
 */
export function findAllIrredundantCovers(
  pis: PrimeImplicant[],
  onesSet: string[]
): PrimeImplicant[][] {
  const essential = pis.filter((p) => p.essential);
  const essentialCovered = new Set(essential.flatMap((p) => p.cells));
  const remaining = onesSet.filter((c) => !essentialCovered.has(c));

  if (remaining.length === 0) return [essential];

  const nonEssential = pis.filter((p) => !p.essential);
  const n = nonEssential.length;
  const covers: PrimeImplicant[][] = [];

  for (let mask = 1; mask < 1 << n; mask++) {
    const subset = nonEssential.filter((_, i) => mask & (1 << i));
    const covered = new Set(subset.flatMap((p) => p.cells));
    if (!remaining.every((c) => covered.has(c))) continue;

    const isIrredundant = subset.every((_, idx) => {
      const without = subset.filter((_, j) => j !== idx);
      const coveredWithout = new Set(without.flatMap((p) => p.cells));
      return !remaining.every((c) => coveredWithout.has(c));
    });
    if (isIrredundant) covers.push([...essential, ...subset]);
  }

  return covers;
}

/**
 * SKILL.md Bước 6: of all irredundant covers, keep only the ones with the FEWEST prime
 * implicants — discard any that are still irredundant but bigger. Ties are all valid
 * "công thức tối tiểu" simultaneously (don't just pick the first one found).
 */
export function findAllMinimalCovers(
  pis: PrimeImplicant[],
  onesSet: string[]
): PrimeImplicant[][] {
  const covers = findAllIrredundantCovers(pis, onesSet);
  const minSize = Math.min(...covers.map((c) => c.length));
  return covers.filter((c) => c.length === minSize);
}

function baseCellHighlights(
  onesSet: string[],
  zeroCells: string[]
): Partial<Record<string, HighlightState>> {
  return {
    ...Object.fromEntries(zeroCells.map((c) => [c, "rejected" as const])),
    ...Object.fromEntries(onesSet.map((c) => [c, "settled" as const])),
  };
}

function toGroup(pi: PrimeImplicant, state: HighlightState): GroupHighlight {
  return { id: pi.id, label: pi.term, cells: pi.cells, state };
}

/**
 * Karnaugh (Câu 1b) — animates the full 6-step procedure from SKILL.md, not just the
 * final answer: draw grid → dot the CDNF terms → find every prime implicant one at a
 * time → mark the essential ones → list every irredundant cover (even ones about to be
 * discarded) → keep only the smallest.
 */
export function runKarnaugh(spec: BooleanFunctionSpec): AlgoResult {
  const { variables, onesSet } = spec;
  const n = variables.length;
  const allCombos = Array.from({ length: 2 ** n }, (_, i) => i.toString(2).padStart(n, "0"));
  const zeroCells = allCombos.filter((c) => !onesSet.includes(c));

  const steps: AlgoStep[] = [];

  steps.push({
    title: "Vẽ khung Kar(f)",
    explanation: `Lưới ${2 ** Math.ceil(n / 2)}×${2 ** Math.floor(n / 2)}: cột theo Gray code của (${variables
      .slice(0, Math.ceil(n / 2))
      .join(", ")}), hàng theo Gray code của (${variables
      .slice(Math.ceil(n / 2))
      .join(", ")}) — mỗi ô ứng với đúng 1 tổ hợp ${n} biến, bảng có tính vòng (mép đầu và mép cuối mỗi hàng/cột kề nhau).`,
    nodeHighlights: {},
  });

  steps.push({
    title: `Chấm ${onesSet.length} đơn thức của CDNF lên bảng`,
    explanation: `Mỗi tổ hợp trong f⁻¹(1) chấm 1 vào ô tương ứng, các ô còn lại = 0. ${onesSet.length} ô có chấm: ${onesSet.join(", ")}.`,
    nodeHighlights: baseCellHighlights(onesSet, zeroCells),
  });

  const pis = findPrimeImplicants(spec);

  const foundGroups: GroupHighlight[] = [];
  pis.forEach((pi) => {
    steps.push({
      title: `Tế bào lớn T${pi.id}: ${pi.term} (phủ ${pi.cells.length} ô)`,
      explanation: `Nhóm ${pi.cells.length} ô kề nhau LỚN NHẤT có thể gồm các ô ${pi.cells.join(", ")} → bỏ (các) biến đổi giá trị giữa các ô trong nhóm, giữ lại biến không đổi → từ ${pi.term}.`,
      nodeHighlights: baseCellHighlights(onesSet, zeroCells),
      groupHighlights: [...foundGroups, toGroup(pi, "active")],
    });
    foundGroups.push(toGroup(pi, "settled"));
  });

  const essentials = pis.filter((p) => p.essential);
  steps.push({
    title:
      essentials.length > 0
        ? `Tế bào lớn thiết yếu: ${essentials.map((p) => `T${p.id}`).join(", ")}`
        : "Không có tế bào lớn thiết yếu nào",
    explanation:
      essentials.length > 0
        ? `${essentials.map((p) => `T${p.id} (${p.term})`).join(", ")} mỗi tế bào đều là tế bào DUY NHẤT phủ ít nhất 1 ô — bắt buộc phải chọn vào công thức tối tiểu.`
        : "Không có ô nào chỉ được phủ bởi đúng 1 tế bào lớn — phải xét mọi cách phủ ở bước sau.",
    nodeHighlights: baseCellHighlights(onesSet, zeroCells),
    groupHighlights: pis.map((p) => toGroup(p, p.essential ? "path" : "settled")),
  });

  const irredundantCovers = findAllIrredundantCovers(pis, onesSet);
  const minSize = Math.min(...irredundantCovers.map((c) => c.length));

  irredundantCovers.forEach((cover, idx) => {
    const extra = cover.filter((p) => !p.essential);
    steps.push({
      title: `Cách ${idx + 1}: ${cover.map((p) => `T${p.id}`).join(", ")} (${cover.length} tế bào)`,
      explanation:
        extra.length > 0
          ? `Sau tế bào thiết yếu, phủ nốt các ô còn lại bằng ${extra.map((p) => p.term).join(", ")} → phủ tối tiểu (không dư thừa) gồm ${cover.length} tế bào.`
          : `Tế bào thiết yếu đã phủ hết mọi ô — phủ tối tiểu chỉ cần ${cover.length} tế bào.`,
      nodeHighlights: baseCellHighlights(onesSet, zeroCells),
      groupHighlights: pis.map((p) =>
        toGroup(p, cover.some((c) => c.id === p.id) ? (p.essential ? "path" : "active") : "idle")
      ),
    });
  });

  const minimalCovers = irredundantCovers.filter((c) => c.length === minSize);
  const discardedCovers = irredundantCovers.filter((c) => c.length !== minSize);
  const formulas = minimalCovers.map((cover) => cover.map((p) => p.term).join(" ∨ "));

  steps.push({
    title:
      discardedCovers.length > 0
        ? `So sánh: giữ ${minimalCovers.length} phủ ${minSize} tế bào, loại ${discardedCovers.length} phủ nhiều tế bào hơn`
        : `Cả ${minimalCovers.length} phủ đều đạt đúng ${minSize} tế bào — tất cả là công thức tối tiểu`,
    explanation:
      discardedCovers.length > 0
        ? `Trong ${irredundantCovers.length} phủ tối tiểu (irredundant) tìm được ở bước trên, CHỈ GIỮ phủ có SỐ TẾ BÀO ÍT NHẤT (${minSize} tế bào); loại phủ ${discardedCovers
            .map((c) => c.length)
            .join(", ")} tế bào dù bản thân nó vẫn không dư thừa — đó là điểm khác biệt giữa "phủ tối tiểu" và "công thức tối tiểu". Công thức tối tiểu: ${formulas.join(
            "  hoặc  "
          )}.`
        : `Không phủ nào bị loại vì cả ${minimalCovers.length} phủ tìm được đều cùng đạt số tế bào nhỏ nhất (${minSize} tế bào) — tất cả đều là công thức tối tiểu hợp lệ. Công thức tối tiểu: ${formulas.join(
            "  hoặc  "
          )}.`,
    nodeHighlights: baseCellHighlights(onesSet, zeroCells),
    groupHighlights: pis.map((p) => {
      const inMinimal = minimalCovers.some((c) => c.some((x) => x.id === p.id));
      if (inMinimal) return toGroup(p, p.essential ? "path" : "settled");
      const inDiscardedOnly = discardedCovers.some((c) => c.some((x) => x.id === p.id));
      return toGroup(p, inDiscardedOnly ? "rejected" : "idle");
    }),
  });

  return {
    steps,
    summary: `Công thức tối tiểu: ${formulas.join("  hoặc  ")}`,
  };
}
