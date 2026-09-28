"use client";

import ConceptPanel from "@/components/palace/ConceptPanel";
import Crosshair from "@/components/palace/Crosshair";
import CarryIndicator from "@/components/palace/CarryIndicator";
import PalaceScene from "@/components/palace/PalaceScene";
import GuidedTour from "@/components/palace/GuidedTour";
import RecallQuiz from "@/components/palace/RecallQuiz";
import { concepts } from "@/data/concepts";
import { usePalaceStore } from "@/stores/palaceStore";
import { useEffect, useState } from "react";

const modes = ["explore", "tour", "quiz", "complete"] as const;
const conceptCount = concepts.length;

export default function PalacePage() {
  const mode = usePalaceStore((state) => state.mode);
  const transitionMode = usePalaceStore((state) => state.transitionMode);
  const resetPalace = usePalaceStore((state) => state.resetPalace);
  const quizAnswers = usePalaceStore((state) => state.quizAnswers);
  const quizScore = usePalaceStore((state) => state.quizScore);
  const quizQuestions = usePalaceStore((state) => state.quizQuestions);
  const placements = usePalaceStore((state) => state.placements);
  const hydrate = usePalaceStore((state) => state.hydrate);
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const placedConceptIds = new Set(placements.map((placement) => placement.conceptId));
  const allConceptsPlaced = concepts.every((concept) => placedConceptIds.has(concept.id));
  const showPanel = mode !== "quiz" && mode !== "complete";

  return (
    <main className="relative h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#164e63,_#0f172a_55%,_#020617)]" />
      <PalaceScene />
      <Crosshair />
      <CarryIndicator />

      {/* Overlays hug the screen edges so the middle of the scene stays clear. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <header className="pointer-events-auto absolute top-3 left-3 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/50 px-2.5 py-1.5 shadow-lg backdrop-blur-md">
          <span className="text-[9px] font-semibold tracking-[0.22em] text-cyan-300 uppercase">
            Memory Palace
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span className="text-[10px] text-slate-300 capitalize">{mode}</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
              allConceptsPlaced
                ? "bg-emerald-400/15 text-emerald-300"
                : "bg-white/10 text-slate-400"
            }`}
          >
            {placedConceptIds.size}/{conceptCount}
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md border border-white/15 bg-white/10 px-1.5 py-0.5 text-[10px] text-white hover:bg-white/20"
          >
            {menuOpen ? "Hide" : "Menu"}
          </button>
          <button
            type="button"
            onClick={resetPalace}
            className="rounded-md border border-white/15 bg-white/10 px-1.5 py-0.5 text-[10px] text-white hover:bg-white/20"
          >
            Reset
          </button>
        </header>

        {menuOpen && (
          <div className="animate-in fade-in duration-300">
            {showPanel && <ConceptPanel />}
            <div className="pointer-events-auto absolute right-3 bottom-3 flex max-w-[13rem] flex-col items-end gap-1">
              <div className="flex flex-wrap justify-end gap-1">
                {modes.map((nextMode) => (
                  <button
                    key={nextMode}
                    type="button"
                    disabled={(nextMode === "tour" || nextMode === "quiz") && !allConceptsPlaced}
                    onClick={() => transitionMode(nextMode)}
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold capitalize transition ${
                      mode === nextMode
                        ? "bg-cyan-300 text-slate-950"
                        : "bg-slate-950/70 text-slate-200 backdrop-blur-sm hover:bg-white/15"
                    } disabled:cursor-not-allowed disabled:opacity-30`}
                  >
                    {nextMode}
                  </button>
                ))}
              </div>
              {!allConceptsPlaced && (
                <p className="rounded-md bg-slate-950/60 px-1.5 py-0.5 text-[9px] text-amber-200/90 backdrop-blur-sm">
                  Place all {conceptCount} concepts to unlock tour + quiz
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 z-30">
        <GuidedTour />
        <RecallQuiz key={mode} />
      </div>

      {mode === "complete" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <section className="w-full max-w-sm rounded-2xl border border-emerald-200/20 bg-slate-950/92 p-4 text-white shadow-2xl">
            <p className="text-[10px] font-semibold tracking-[0.22em] text-emerald-300 uppercase">
              Palace complete
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {quizScore}/{quizQuestions.length}
            </h2>
            <div className="mt-3 grid gap-1">
              {quizQuestions.map((question) => {
                const correct = quizAnswers[question.objectId] === question.conceptId;
                const concept = concepts.find((item) => item.id === question.conceptId);
                return (
                  <div
                    key={question.objectId}
                    className={`flex items-center justify-between rounded-md border px-2 py-1 text-[11px] ${
                      correct
                        ? "border-emerald-300/30 bg-emerald-400/10"
                        : "border-rose-300/30 bg-rose-400/10"
                    }`}
                  >
                    <span>{concept?.title}</span>
                    <span className={correct ? "text-emerald-300" : "text-rose-300"}>
                      {correct ? "Correct" : "Review"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex gap-1.5">
              <button
                type="button"
                onClick={() => transitionMode("explore")}
                className="rounded-full bg-cyan-300 px-3 py-1 text-[11px] font-semibold text-slate-950 hover:bg-cyan-200"
              >
                Explore again
              </button>
              <button
                type="button"
                onClick={resetPalace}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold hover:bg-white/20"
              >
                Restart
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
