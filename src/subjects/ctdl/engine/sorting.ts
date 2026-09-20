import type { AlgoResult, AlgoStep, HighlightState } from "@/engine/types";
import type { SortOrder } from "./searching";

export type SortAlgorithm = "selection" | "insertion";

export interface SortSpec {
  algorithm: SortAlgorithm;
  array: number[];
  order?: SortOrder;
}

const arr = (a: number[]) => a.join(" ");

function settled(from: number, to: number): Record<string, HighlightState> {
  const h: Record<string, HighlightState> = {};
  for (let i = from; i <= to; i++) h[String(i)] = "settled";
  return h;
}

/**
 * Sắp xếp từng bước theo ĐÚNG định dạng `IT003_Bai09_Huong_Dan_Trinh_Bay.pdf`:
 *  - chọn trực tiếp: "Bước i = k: (Vị trí min = j). Hoán vị <min>, <a[i] cũ>. Kết quả: …" — ghi hoán vị KỂ CẢ
 *    khi j = i ("Hoán vị 2, 2"); n phần tử ⇒ n−1 bước.
 *  - chèn trực tiếp: "Lần #k (xét a[k]): …" — vùng a[0..k] luôn đã sắp xếp.
 * `order` "desc" đảo dấu so sánh (Luyện tập 005 Câu 2 chèn giảm dần).
 */
export function runSort(spec: SortSpec): AlgoResult {
  const a = [...spec.array];
  const n = a.length;
  const asc = (spec.order ?? "asc") === "asc";
  const dir = asc ? "tăng" : "giảm";
  const steps: AlgoStep[] = [];

  if (spec.algorithm === "selection") {
    const word = asc ? "min" : "max";
    steps.push({
      title: `Sắp xếp ${dir} dần bằng chọn trực tiếp: ${arr(a)}`,
      explanation: `Mỗi vòng i: tìm phần tử ${word} trong vùng chưa sắp xếp a[i..${n - 1}] rồi hoán vị nó vào vị trí i (đúng 1 hoán vị mỗi vòng). ${n} phần tử ⇒ ${Math.max(n - 1, 0)} bước (i = 0…${n - 2}).`,
      arraySnapshot: [...a],
    });
    for (let i = 0; i < n - 1; i++) {
      let best = i;
      for (let j = i + 1; j < n; j++) if (asc ? a[j] < a[best] : a[j] > a[best]) best = j;
      const picked = a[best];
      const old = a[i];
      [a[i], a[best]] = [a[best], a[i]];
      const h = settled(0, i === n - 2 ? n - 1 : i);
      if (best !== i && i < n - 2) h[String(best)] = "active"; // bước cuối: cả dãy đã xong, không tô "đang xét"
      steps.push({
        title: `Bước i = ${i}: (Vị trí ${word} = ${best}). Hoán vị ${picked}, ${old}. Kết quả: ${arr(a)}`,
        explanation:
          best === i
            ? `Vùng chưa sắp xếp a[${i}..${n - 1}] có ${word} = ${picked} ngay tại vị trí ${i} ⇒ đã đúng chỗ (mẫu của thầy vẫn ghi "Hoán vị ${picked}, ${picked}").`
            : `Vùng chưa sắp xếp a[${i}..${n - 1}] có ${word} = ${picked} tại vị trí ${best} ⇒ hoán vị với a[${i}] = ${old}. Vùng đã sắp xếp mở rộng thành a[0..${i}].`,
        arraySnapshot: [...a],
        nodeHighlights: h,
        arrayMarkers: { i, [word]: best },
      });
    }
  } else {
    steps.push({
      title: `Sắp xếp ${dir} dần bằng chèn trực tiếp: ${arr(a)}`,
      explanation: `Coi a[0] là vùng đã sắp xếp. Lần #k (k = 1…${n - 1}): lấy a[k], dịch các phần tử ${asc ? "lớn hơn" : "nhỏ hơn"} nó trong vùng đã sắp xếp sang phải 1 ô rồi chèn vào chỗ trống.`,
      arraySnapshot: [...a],
      nodeHighlights: n > 0 ? settled(0, 0) : undefined,
    });
    for (let k = 1; k < n; k++) {
      const x = a[k];
      let j = k - 1;
      while (j >= 0 && (asc ? a[j] > x : a[j] < x)) {
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = x;
      const pos = j + 1;
      const shifts = k - pos;
      const h = settled(0, k);
      h[String(pos)] = "active";
      steps.push({
        title: `Lần #${k} (xét ${x}): ${arr(a)}`,
        explanation:
          shifts === 0
            ? `${x} đã ${asc ? "lớn hơn hoặc bằng" : "nhỏ hơn hoặc bằng"} phần tử đứng trước ⇒ giữ nguyên vị trí ${k}.`
            : `Dịch ${shifts} phần tử ${asc ? "lớn hơn" : "nhỏ hơn"} ${x} sang phải, chèn ${x} vào vị trí ${pos}. Vùng đã sắp xếp: a[0..${k}].`,
        arraySnapshot: [...a],
        nodeHighlights: h,
        arrayMarkers: { chèn: pos },
      });
    }
  }
  return { steps, summary: `Dãy sau khi sắp xếp ${dir} dần: ${arr(a)}` };
}
