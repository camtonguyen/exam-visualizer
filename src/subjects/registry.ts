import type { SubjectDef } from "./types";
import { ctrrSubject } from "./ctrr/subject";

/**
 * Every subject the app knows about. To add a new subject:
 *   1. Create `src/subjects/<id>/subject.tsx` (copy `ctrr/subject.tsx` as a template).
 *   2. Import it here and add it to this array.
 * That's it — nav, routing, and the home page all derive from this list.
 * See `docs/ADDING_A_SUBJECT.md` for the full checklist (engine/modules/data layout).
 */
export const subjects: SubjectDef[] = [
  ctrrSubject,
  // next subject goes here, e.g.: xacSuatThongKeSubject,
];

export function getSubject(id: string): SubjectDef | undefined {
  return subjects.find((s) => s.id === id);
}

export function getModule(subjectId: string, moduleId: string) {
  return getSubject(subjectId)?.modules.find((m) => m.id === moduleId);
}
