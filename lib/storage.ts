"use client";

import type { PalaceState, QuizQuestion } from "@/types/palace";

const STORAGE_KEY = "programming-palace-state";

type StoredPalaceState = Pick<
  PalaceState,
  | "placements"
  | "activeConceptId"
  | "tourStops"
  | "currentTourIndex"
  | "quizQuestions"
  | "quizIndex"
  | "quizScore"
  | "quizAnswers"
>;

export function loadPalaceState(): Partial<StoredPalaceState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPalaceState>;
    return {
      placements: Array.isArray(parsed.placements) ? parsed.placements : [],
      activeConceptId:
        typeof parsed.activeConceptId === "string" ? parsed.activeConceptId : null,
      tourStops: Array.isArray(parsed.tourStops)
        ? parsed.tourStops.filter((id): id is string => typeof id === "string")
        : [],
      currentTourIndex: typeof parsed.currentTourIndex === "number" ? parsed.currentTourIndex : 0,
      quizQuestions: Array.isArray(parsed.quizQuestions)
        ? parsed.quizQuestions.filter(
            (question): question is QuizQuestion =>
              Boolean(question) &&
              typeof question?.objectId === "string" &&
              typeof question?.conceptId === "string",
          )
        : [],
      quizIndex: typeof parsed.quizIndex === "number" ? parsed.quizIndex : 0,
      quizScore: typeof parsed.quizScore === "number" ? parsed.quizScore : 0,
      quizAnswers:
        parsed.quizAnswers && typeof parsed.quizAnswers === "object" ? parsed.quizAnswers : {},
    };
  } catch {
    return null;
  }
}

export function savePalaceState(state: StoredPalaceState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // private browsing or a full quota: progress is simply not saved
  }
}

export function clearPalaceState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
