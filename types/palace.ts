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
};

export type Placement = {
  objectId: string;
  conceptId: string;
};

export type PalaceState = {
  mode: "explore" | "tour" | "quiz" | "complete";
  placements: Placement[];
  currentTourIndex: number;
  quizScore: number;
};
