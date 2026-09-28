"use client";

import { useEffect, useRef } from "react";
import { concepts } from "@/data/concepts";
import { usePalaceStore } from "@/stores/palaceStore";

/** Wheel deltas below this are treated as scroll jitter, not an intent to switch. */
const WHEEL_THRESHOLD = 24;

/**
 * Minecraft style hotbar. Selection is a single active slot, changed by clicking
 * a slot or scrolling anywhere on the page. The active slot is what E places.
 */
export default function ConceptPanel() {
  const mode = usePalaceStore((state) => state.mode);
  const activeConceptId = usePalaceStore((state) => state.activeConceptId);
  const placements = usePalaceStore((state) => state.placements);
  const setActiveConcept = usePalaceStore((state) => state.setActiveConcept);
  const cycleActiveConcept = usePalaceStore((state) => state.cycleActiveConcept);
  const wheelTotal = useRef(0);

  useEffect(() => {
    if (mode !== "explore") return;
    const handleWheel = (event: WheelEvent) => {
      // The palace view never scrolls, so the wheel is free to drive the hotbar.
      event.preventDefault();
      wheelTotal.current += event.deltaY;
      if (Math.abs(wheelTotal.current) < WHEEL_THRESHOLD) return;
      const step = wheelTotal.current > 0 ? 1 : -1;
      wheelTotal.current = 0;
      cycleActiveConcept(step);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [cycleActiveConcept, mode]);

  if (mode !== "explore") return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center px-3">
      <div
        role="toolbar"
        aria-label="Concept hotbar"
        className="pointer-events-auto flex max-w-full gap-1 overflow-x-auto rounded-lg border-2 border-slate-500/60 bg-slate-900/85 p-1 shadow-2xl backdrop-blur-md"
      >
        {concepts.map((concept, index) => {
          const active = concept.id === activeConceptId;
          const placed = placements.some((item) => item.conceptId === concept.id);
          return (
            <button
              key={concept.id}
              type="button"
              onClick={() => setActiveConcept(concept.id)}
              aria-pressed={active}
              title={`${concept.title} — ${placed ? "already tagged, E moves it" : "not tagged yet"}`}
              className={`flex w-[9.6rem] shrink-0 flex-col gap-[0.28rem] rounded-[0.5rem] border-2 px-[0.6rem] py-[0.85rem] text-left transition ${
                active
                  ? "scale-105 border-amber-200 bg-amber-300/20 shadow-[0_0_12px_rgba(253,230,138,0.45)]"
                  : placed
                    ? "border-emerald-400/40 bg-emerald-400/10 opacity-70 hover:opacity-100"
                    : "border-slate-500/50 bg-slate-800/60 opacity-80 hover:border-cyan-300/60 hover:opacity-100"
              }`}
            >
              <span className="flex items-center justify-between gap-[0.2rem] leading-[1.2rem]">
                <span
                  className={`text-[0.81rem] leading-[1.45rem] font-bold ${active ? "text-amber-100" : "text-slate-400"}`}
                >
                  {index + 1}
                </span>
                <span
                  className={`text-[0.81rem] leading-[1.45rem] ${placed ? "text-emerald-300" : "text-slate-600"}`}
                >
                  {placed ? "✓" : "·"}
                </span>
              </span>
              <span
                className={`truncate text-[0.99rem] leading-[1.7rem] font-semibold ${
                  active ? "text-amber-50" : "text-slate-200"
                }`}
              >
                {concept.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
