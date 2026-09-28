"use client";

import { create } from "zustand";
import type { Concept, PalaceState, Placement, QuizQuestion } from "@/types/palace";
import { clearPalaceState, loadPalaceState, savePalaceState } from "@/lib/storage";
import { concepts } from "@/data/concepts";
import { palaceObjects } from "@/data/palaceObjects";

/** Object ids that still exist, used to prune stale placements on hydrate. */
const palaceObjectIds = new Set(palaceObjects.map((object) => object.id));

type PalaceActions = {
  transitionMode: (mode: PalaceState["mode"]) => void;
  setActiveConcept: (conceptId: string) => void;
  /** Move the hotbar selection by `delta` slots, wrapping at both ends. */
  cycleActiveConcept: (delta: number) => void;
  /** Tag `conceptId` onto `objectId`, moving it off whatever held it before. */
  placeConcept: (conceptId: string, objectId: string) => void;
  advanceTour: () => void;
  setTourIndex: (index: number) => void;
  /** Answers the question currently at `quizIndex`. Scoring happens here. */
  recordQuizAnswer: (conceptId: string) => void;
  nextQuestion: () => void;
  hydrate: () => void;
  resetPalace: () => void;
};

export type PalaceStore = PalaceState & PalaceActions;

export const initialState: PalaceState = {
  mode: "explore",
  placements: [],
  activeConceptId: concepts[0]?.id ?? null,
  tourStops: [],
  currentTourIndex: 0,
  quizQuestions: [],
  quizIndex: 0,
  quizScore: 0,
  quizAnswers: {},
};

/**
 * Tour and quiz order follow the concept library, so both are stable between
 * runs and every stop is guaranteed to be an object the player really tagged.
 */
export function taggedStops(placements: Placement[]): string[] {
  const out: string[] = [];
  for (const concept of concepts) {
    const objectId = placements.find((item) => item.conceptId === concept.id)?.objectId;
    if (objectId) out.push(objectId);
  }
  return out;
}

export function buildQuizQuestions(placements: Placement[]): QuizQuestion[] {
  return taggedStops(placements).flatMap((objectId) => {
    const placement = placements.find((item) => item.objectId === objectId);
    return placement ? [{ objectId, conceptId: placement.conceptId }] : [];
  });
}

const isKnownConcept = (id: string) => concepts.some((concept: Concept) => concept.id === id);

export const usePalaceStore = create<PalaceStore>((set) => ({
  ...initialState,

  transitionMode: (mode) =>
    set((state) => {
      const placedConceptIds = new Set(state.placements.map((placement) => placement.conceptId));
      const allConceptsPlaced = concepts.every((concept) => placedConceptIds.has(concept.id));
      if ((mode === "tour" || mode === "quiz") && !allConceptsPlaced) {
        return state;
      }

      return {
        mode,
        // Snapshotted from live placements, so a re-tag is reflected immediately.
        ...(mode === "tour"
          ? { tourStops: taggedStops(state.placements), currentTourIndex: 0 }
          : {}),
        ...(mode === "quiz"
          ? {
              quizQuestions: buildQuizQuestions(state.placements),
              quizIndex: 0,
              quizScore: 0,
              quizAnswers: {},
            }
          : {}),
        ...(mode === "explore" && state.mode === "complete"
          ? { currentTourIndex: 0, quizIndex: 0, quizScore: 0, quizAnswers: {} }
          : {}),
      };
    }),

  setActiveConcept: (conceptId) =>
    set((state) => (isKnownConcept(conceptId) ? { activeConceptId: conceptId } : state)),

  cycleActiveConcept: (delta) =>
    set((state) => {
      if (concepts.length === 0) return state;
      const current = state.activeConceptId
        ? concepts.findIndex((concept) => concept.id === state.activeConceptId)
        : 0;
      const from = current < 0 ? 0 : current;
      const next = (((from + delta) % concepts.length) + concepts.length) % concepts.length;
      return { activeConceptId: concepts[next].id };
    }),

  placeConcept: (conceptId, objectId) =>
    set((state) => {
      if (!isKnownConcept(conceptId)) return state;
      const alreadyThere = state.placements.some(
        (item) => item.objectId === objectId && item.conceptId === conceptId,
      );
      if (alreadyThere) return state;
      return {
        placements: [
          // drop the tag on the target object, and the concept's old home
          ...state.placements.filter(
            (item) => item.objectId !== objectId && item.conceptId !== conceptId,
          ),
          { objectId, conceptId },
        ],
        activeConceptId: conceptId,
      };
    }),

  advanceTour: () =>
    set((state) => ({ currentTourIndex: state.currentTourIndex + 1 })),
  setTourIndex: (currentTourIndex) =>
    set({ currentTourIndex: Math.max(0, currentTourIndex) }),

  recordQuizAnswer: (conceptId) =>
    set((state) => {
      const question = state.quizQuestions[state.quizIndex];
      if (!question) return state;
      // Idempotent: a question is scored exactly once, on its first answer.
      if (state.quizAnswers[question.objectId] !== undefined) return state;
      return {
        quizAnswers: { ...state.quizAnswers, [question.objectId]: conceptId },
        // Correctness is decided here, from the snapshot, never by the caller.
        quizScore: state.quizScore + (conceptId === question.conceptId ? 1 : 0),
      };
    }),

  nextQuestion: () =>
    set((state) => {
      if (state.quizIndex >= state.quizQuestions.length - 1) {
        return { mode: "complete" as const };
      }
      return { quizIndex: state.quizIndex + 1 };
    }),

  hydrate: () => {
    const storedState = loadPalaceState();
    if (!storedState) return;
    const known = new Set(concepts.map((concept) => concept.id));
    // Drop anything referencing a concept or object that no longer exists.
    const placements = (storedState.placements ?? []).filter(
      (placement) =>
        known.has(placement.conceptId) &&
        palaceObjectIds.has(placement.objectId),
    );
    set({
      ...storedState,
      placements,
      activeConceptId: storedState.activeConceptId ?? initialState.activeConceptId,
      tourStops: storedState.tourStops ?? [],
      quizQuestions: storedState.quizQuestions ?? [],
    });
  },

  resetPalace: () => {
    clearPalaceState();
    set(initialState);
  },
}));

usePalaceStore.subscribe((state) => savePalaceState(state));
