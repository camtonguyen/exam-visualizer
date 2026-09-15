import type { BooleanFunctionSpec } from "@/engine/types";

const VARIABLES = ["x", "y", "z", "t"];

function allCombos(bits: number): string[] {
  return Array.from({ length: 2 ** bits }, (_, i) => i.toString(2).padStart(bits, "0"));
}

function fromZeros(zerosSet: string[]): BooleanFunctionSpec {
  const zeros = new Set(zerosSet);
  return {
    variables: VARIABLES,
    onesSet: allCombos(VARIABLES.length).filter((c) => !zeros.has(c)),
    givenAs: "zeros",
    zerosSet,
  };
}

/** HK1 2022-2023, Câu 1a — real exam: f⁻¹(0) = {0000, 0101, 1101, 1111, 1110, 1010}. */
export const boolFn20222023: BooleanFunctionSpec = fromZeros([
  "0000",
  "0101",
  "1101",
  "1111",
  "1110",
  "1010",
]);

/** HK1 2023-2024, Câu 1a — real exam: f⁻¹(0) = {0110, 0111, 0000, 1000, 1101}. */
export const boolFn20232024: BooleanFunctionSpec = fromZeros([
  "0110",
  "0111",
  "0000",
  "1000",
  "1101",
]);

/**
 * Teaching-only example (NOT from a real exam — flagged per CLAUDE.md "Do NOT invent
 * exam data" rule). Both real exams above happen to have all their minimal covers land
 * on the same cell count, so this function exists purely to give the Karnaugh module a
 * case where irredundant covers of DIFFERENT sizes appear, so the "loại phủ nhiều tế
 * bào hơn" comparison step (SKILL.md, Bước 5→6) is actually exercised at least once.
 * Verified (Quine-McCluskey): 5 prime implicants, 2 essential (y'zt', xyt'), one
 * 3-cell minimal cover {y'zt', xyt', x'zt} vs. one discarded 4-cell cover
 * {y'zt', xyt', x'y'z, yzt}.
 */
export const boolFnTeachingCoverSizes: BooleanFunctionSpec = {
  variables: VARIABLES,
  onesSet: ["0010", "0011", "0111", "1010", "1101", "1111"],
  givenAs: "ones",
};
