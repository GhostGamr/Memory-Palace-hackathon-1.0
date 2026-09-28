"use client";

import { concepts } from "@/data/concepts";
import { usePalaceStore } from "@/stores/palaceStore";

/** Small persistent chip under the crosshair showing the active hotbar slot. */
export default function CarryIndicator() {
  const activeConceptId = usePalaceStore((state) => state.activeConceptId);
  const mode = usePalaceStore((state) => state.mode);

  if (mode !== "explore" || !activeConceptId) return null;
  const concept = concepts.find((item) => item.id === activeConceptId);
  if (!concept) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex justify-center">
      <span className="mt-8 rounded-full border border-amber-300/30 bg-slate-950/80 px-2.5 py-1 text-[10px] font-medium whitespace-nowrap text-amber-100 shadow-lg backdrop-blur-sm">
        Carrying: <span className="font-semibold text-amber-200">{concept.title}</span>
      </span>
    </div>
  );
}
