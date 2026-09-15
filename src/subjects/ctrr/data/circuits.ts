import type { BooleanFunctionSpec, CircuitSpec } from "@/engine/types";
import { circuitSpecFromTerms } from "../engine/circuit";
import { findAllMinimalCovers, findPrimeImplicants } from "../engine/karnaugh";
import { boolFn20222023, boolFn20232024 } from "./booleanFunctions";

const VARIABLES = ["x", "y", "z", "t"];

/**
 * Dev-time safety net: Câu 1c must draw a formula Câu 1b actually produced, never one
 * typed in independently — asserts `formulas` really is one of `findAllMinimalCovers`'s
 * verified covers for `boolFn` (see SKILL.md's Karnaugh section for the full tables).
 */
function assertIsVerifiedMinimalCover(boolFn: BooleanFunctionSpec, formulas: string[]): void {
  const pis = findPrimeImplicants(boolFn);
  const covers = findAllMinimalCovers(pis, boolFn.onesSet);
  const isValid = covers.some((cover) => {
    const coverTerms = new Set(cover.map((p) => p.term));
    return coverTerms.size === formulas.length && formulas.every((f) => coverTerms.has(f));
  });
  if (!isValid) {
    throw new Error(
      `Circuit formula [${formulas.join(", ")}] is not a verified minimal cover from karnaugh.ts — data drifted from SKILL.md.`
    );
  }
}

/** HK1 2022-2023, Câu 1c — "Cách 1" of the minimal covers verified in karnaugh.ts. */
const formulas20222023 = ["x'z", "y't", "xz't'", "x'yt'"];
assertIsVerifiedMinimalCover(boolFn20222023, formulas20222023);
export const circuit20222023: CircuitSpec = circuitSpecFromTerms(VARIABLES, formulas20222023);

/** HK1 2023-2024, Câu 1c — "Cách 1" of the minimal covers verified in karnaugh.ts. */
const formulas20232024 = ["xz", "y'z", "y't", "x'z't", "yz't'"];
assertIsVerifiedMinimalCover(boolFn20232024, formulas20232024);
export const circuit20232024: CircuitSpec = circuitSpecFromTerms(VARIABLES, formulas20232024);
