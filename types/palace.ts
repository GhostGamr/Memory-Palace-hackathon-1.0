export type Concept = {
  id: string;
  title: string;
  explanation: string;
  visualHint: string;
};

export type PalaceObject = {
  id: string;
  name: string;
  position: [number, number, number];
  roomId: string;
  /** Uniform scale applied to the model, for hero sized props. */
  scale?: number;
  /** Local height of the floating concept label. */
  labelHeight?: number;
};

export type Placement = {
  objectId: string;
  conceptId: string;
};

/**
 * A quiz question is derived from a live placement: `objectId` is the prop the
 * player actually tagged, `conceptId` is the concept they tagged it with.
 */
export type QuizQuestion = {
  objectId: string;
  conceptId: string;
};

export type PalaceState = {
  mode: "explore" | "tour" | "quiz" | "complete";
  placements: Placement[];
  /** Hotbar slot the player has selected. */
  activeConceptId: string | null;
  /** Object ids to visit, snapshotted when the tour starts. */
  tourStops: string[];
  currentTourIndex: number;
  /** Questions snapshotted when the quiz starts, one per tagged object. */
  quizQuestions: QuizQuestion[];
  quizIndex: number;
  quizScore: number;
  /** Keyed by objectId, so a question can only ever be answered once. */
  quizAnswers: Record<string, string>;
};

export type PalaceMode = PalaceState["mode"];
