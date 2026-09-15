import type { ComponentType } from "react";

/**
 * One learning module inside a subject (e.g. "Dijkstra" inside CTRR).
 * `Component` is the actual page; if a subject hasn't built a module yet,
 * point it at `ComingSoon` with a `comingSoonTitle` instead of leaving it out —
 * that way the nav/sidebar always shows the full curriculum, done or not.
 */
export interface ModuleDef {
  id: string;
  label: string;
  Component: ComponentType;
}

/**
 * One subject (môn học). Each subject owns its own `engine/`, `modules/`, `data/`
 * under `src/subjects/<id>/` — see `docs/ADDING_A_SUBJECT.md` for the checklist.
 * Subjects never import from each other; only from the shared `src/engine`,
 * `src/components`, `src/routes` layer.
 */
export interface SubjectDef {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  /** false while a subject has no material yet — shows in nav as "sắp có". */
  available: boolean;
  modules: ModuleDef[];
}
