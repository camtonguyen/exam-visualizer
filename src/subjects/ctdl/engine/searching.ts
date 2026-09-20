import type { AlgoResult, AlgoStep, HighlightState } from "@/engine/types";

export type SearchAlgorithm = "linear" | "binary" | "interpolation";
export type SortOrder = "asc" | "desc";

export interface SearchSpec {
  algorithm: SearchAlgorithm;
  array: number[];
  target: number;
  /** Chiều sắp xếp của dãy — chỉ nhị phân dùng được "desc" (đảo dấu so sánh); nội suy chỉ "asc". */
  order?: SortOrder;
}

const NAME: Record<SearchAlgorithm, string> = {
  linear: "tìm kiếm tuyến tính",
  binary: "tìm kiếm nhị phân",
  interpolation: "tìm kiếm nội suy",
};

const arr = (a: number[]) => a.join(" ");
const orderWord = (o: SortOrder) => (o === "asc" ? "tăng" : "giảm");

function isSorted(a: number[], order: SortOrder): boolean {
  return a.every((v, i) => i === 0 || (order === "asc" ? a[i - 1] <= v : a[i - 1] >= v));
}

/** Ô ngoài đoạn [l, r] đã bị loại — tô "rejected" để thấy đoạn còn lại thu hẹp dần. */
function outside(n: number, l: number, r: number): Record<string, HighlightState> {
  const h: Record<string, HighlightState> = {};
  for (let i = 0; i < n; i++) if (i < l || i > r) h[String(i)] = "rejected";
  return h;
}

/**
 * Tìm kiếm từng bước theo ĐÚNG định dạng `IT003_Bai09_Huong_Dan_Trinh_Bay.pdf` (tuyến tính:
 * "Bước i = …"; nhị phân: "L, R ⇒ M = (L+R)/2"; kết thúc không thấy: "DỪNG vì L phải ≤ R").
 * Nhị phân/nội suy mà dãy chưa sắp xếp ⇒ trả 1 bước cảnh báo (điều kiện áp dụng — Câu 2 đề mẫu),
 * không chạy tiếp vì kết quả sẽ sai. Nội suy dùng công thức chuẩn (không có trong PDF của thầy).
 */
export function runSearch(spec: SearchSpec): AlgoResult {
  const { algorithm, array: a, target } = spec;
  const order: SortOrder = spec.order ?? "asc";
  const n = a.length;
  const intro = `Tìm ${target} trong dãy ${arr(a)} bằng ${NAME[algorithm]}`;

  if (algorithm !== "linear") {
    const need: SortOrder = algorithm === "interpolation" ? "asc" : order;
    if (!isSorted(a, need)) {
      const msg = `Dãy ${arr(a)} CHƯA sắp xếp ${orderWord(need)} dần ⇒ KHÔNG áp dụng được ${NAME[algorithm]} (điều kiện bắt buộc: dãy đã sắp xếp). Dùng tìm kiếm tuyến tính, hoặc sắp xếp trước.`;
      return { steps: [{ title: intro, explanation: msg, arraySnapshot: a }], summary: msg };
    }
  }

  const steps: AlgoStep[] = [];

  if (algorithm === "linear") {
    const sortedNote = isSorted(a, "asc") ? "đã sắp xếp tăng dần" : isSorted(a, "desc") ? "đã sắp xếp giảm dần" : "CHƯA sắp xếp";
    steps.push({
      title: intro,
      explanation: `Dãy ${sortedNote}. Tìm kiếm tuyến tính áp dụng cho dãy BẤT KỲ: duyệt từ i = 0, so từng phần tử với ${target} cho tới khi gặp hoặc hết dãy.`,
      arraySnapshot: a,
    });
    for (let i = 0; i < n; i++) {
      const found = a[i] === target;
      const h: Record<string, HighlightState> = {};
      for (let j = 0; j < i; j++) h[String(j)] = "rejected";
      h[String(i)] = found ? "settled" : "active";
      steps.push({
        title: `Bước i = ${i}: ${a[i]} ${found ? "bằng" : "khác"} ${target} ⇒ ${found ? "Đã tìm thấy. Kết thúc." : "chưa tìm thấy"}`,
        explanation: found ? `a[${i}] = ${target} ⇒ trả về vị trí ${i}.` : `a[${i}] = ${a[i]} ≠ ${target} ⇒ sang phần tử kế tiếp.`,
        arraySnapshot: a,
        nodeHighlights: h,
        arrayMarkers: { i },
      });
      if (found) return { steps, summary: `Tìm thấy ${target} tại vị trí ${i} sau ${i + 1} bước` };
    }
    steps.push({
      title: `Hết dãy ⇒ không tìm thấy ${target}`,
      explanation: `Đã so sánh cả ${n} phần tử, không phần tử nào bằng ${target}.`,
      arraySnapshot: a,
      nodeHighlights: outside(n, 0, -1),
    });
    return { steps, summary: `Không tìm thấy ${target} (đã so sánh ${n} phần tử)` };
  }

  if (algorithm === "binary") {
    steps.push({
      title: intro,
      explanation:
        `Dãy đã sắp xếp ${orderWord(order)} dần nên áp dụng được nhị phân: mỗi bước lấy M = (L+R)/2 rồi bỏ một nửa dãy; dừng khi tìm thấy hoặc L > R.` +
        (order === "desc" ? " Dãy GIẢM dần nên đảo dấu so sánh: a[M] > value ⇒ L = M + 1." : ""),
      arraySnapshot: a,
    });
    let l = 0;
    let r = n - 1;
    let k = 1;
    while (l <= r) {
      const m = Math.floor((l + r) / 2);
      const v = a[m];
      const found = v === target;
      const goRight = order === "asc" ? v < target : v > target;
      steps.push({
        title: `Bước ${k}: L = ${l}, R = ${r} ⇒ M = (${l}+${r})/2 = ${m} ⇒ ${v} ${found ? "=" : "≠"} ${target} ⇒ ${found ? "tìm thấy" : "chưa tìm thấy"}`,
        explanation: found
          ? `a[${m}] = ${target} ⇒ tìm thấy tại vị trí ${m}. Kết thúc.`
          : `${v} ${v < target ? "<" : ">"} ${target} ⇒ ${goRight ? `bỏ nửa trái, L = M + 1 = ${m + 1}` : `bỏ nửa phải, R = M − 1 = ${m - 1}`}.`,
        arraySnapshot: a,
        nodeHighlights: { ...outside(n, l, r), [String(m)]: found ? "settled" : "active" },
        arrayMarkers: { L: l, R: r, M: m },
      });
      if (found) return { steps, summary: `Tìm thấy ${target} tại vị trí ${m} sau ${k} bước` };
      if (goRight) l = m + 1;
      else r = m - 1;
      k++;
    }
    steps.push({
      title: `Bước ${k}: L = ${l}, R = ${r} ⇒ DỪNG vì L phải ≤ R`,
      explanation: `L = ${l} > R = ${r}: không còn phần tử nào để xét ⇒ ${target} không có trong dãy.`,
      arraySnapshot: a,
      nodeHighlights: outside(n, 0, -1),
      arrayMarkers: { L: l, R: r },
    });
    return { steps, summary: `Không tìm thấy ${target} (dừng vì L > R sau ${k - 1} bước so sánh)` };
  }

  // interpolation
  steps.push({
    title: intro,
    explanation: "Như nhị phân (dãy đã sắp xếp tăng dần) nhưng vị trí đoán theo tỷ lệ giá trị: pos = L + (value − a[L])·(R − L)/(a[R] − a[L]), lấy phần nguyên — nhanh hơn khi dữ liệu phân bố đều.",
    arraySnapshot: a,
  });
  let l = 0;
  let r = n - 1;
  let k = 1;
  while (l <= r && target >= a[l] && target <= a[r]) {
    const flat = a[l] === a[r];
    const pos = flat ? l : l + Math.floor(((target - a[l]) * (r - l)) / (a[r] - a[l]));
    const calc = flat
      ? `a[L] = a[R] = ${a[l]} ⇒ pos = L = ${l}`
      : `pos = ${l} + (${target} − ${a[l]})·(${r} − ${l})/(${a[r]} − ${a[l]}) = ${pos}`;
    const found = a[pos] === target;
    steps.push({
      title: `Bước ${k}: L = ${l}, R = ${r} ⇒ ${calc} ⇒ a[${pos}] = ${a[pos]} ${found ? "=" : "≠"} ${target}`,
      explanation: found
        ? `a[${pos}] = ${target} ⇒ tìm thấy tại vị trí ${pos}. Kết thúc.`
        : a[pos] < target
          ? `${a[pos]} < ${target} ⇒ L = pos + 1 = ${pos + 1}.`
          : `${a[pos]} > ${target} ⇒ R = pos − 1 = ${pos - 1}.`,
      arraySnapshot: a,
      nodeHighlights: { ...outside(n, l, r), [String(pos)]: found ? "settled" : "active" },
      arrayMarkers: { L: l, R: r, pos },
    });
    if (found) return { steps, summary: `Tìm thấy ${target} tại vị trí ${pos} sau ${k} bước` };
    if (a[pos] < target) l = pos + 1;
    else r = pos - 1;
    k++;
  }
  steps.push({
    title: `Bước ${k}: L = ${l}, R = ${r} ⇒ DỪNG`,
    explanation: `Không còn thỏa L ≤ R và a[L] ≤ ${target} ≤ a[R] ⇒ ${target} không có trong dãy.`,
    arraySnapshot: a,
    nodeHighlights: outside(n, 0, -1),
  });
  return { steps, summary: `Không tìm thấy ${target}` };
}
