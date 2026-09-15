import type { GraphSpec } from "@/engine/types";

/**
 * Teaching-only illustrative graphs for Câu 2, Kiểu 3 (nguyên lý Dirichlet / Định lý 1.2).
 * The guide's own 2 examples ("cuộc họp quen biết", "bắt tay") are abstract existence
 * proofs with no concrete numbers — these small graphs exist only to make the same
 * argument visible on a real graph; they are NOT transcribed exam data.
 */

/** "Cuộc họp quen biết": mỗi đỉnh = 1 đại biểu, mỗi cạnh = quen nhau. */
export const meetingAcquaintanceGraph: GraphSpec = {
  nodes: ["A", "B", "C", "D", "E"],
  positions: {
    A: { x: 110, y: 80 },
    B: { x: 330, y: 60 },
    C: { x: 400, y: 240 },
    D: { x: 220, y: 320 },
    E: { x: 60, y: 220 },
  },
  edges: [
    { id: "m1", from: "A", to: "B" },
    { id: "m2", from: "A", to: "C" },
    { id: "m3", from: "B", to: "C" },
    { id: "m4", from: "B", to: "D" },
    { id: "m5", from: "C", to: "E" },
  ],
};

/** "Bắt tay": mỗi đỉnh = 1 người, mỗi cạnh = 1 lần bắt tay giữa 2 người. */
export const handshakeGraph: GraphSpec = {
  nodes: ["F", "G", "H", "I", "J"],
  positions: {
    F: { x: 90, y: 90 },
    G: { x: 300, y: 60 },
    H: { x: 380, y: 220 },
    I: { x: 220, y: 320 },
    J: { x: 60, y: 240 },
  },
  edges: [
    { id: "h1", from: "F", to: "G" },
    { id: "h2", from: "F", to: "H" },
    { id: "h3", from: "G", to: "H" },
    { id: "h4", from: "G", to: "I" },
    { id: "h5", from: "H", to: "J" },
    { id: "h6", from: "I", to: "J" },
  ],
};
