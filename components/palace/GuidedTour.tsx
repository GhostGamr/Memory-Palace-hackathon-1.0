"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { concepts } from "@/data/concepts";
import { palaceObjects } from "@/data/palaceObjects";
import { ROOM_DEPTH, ROOM_WIDTH, ROOM_INSET, getRoom } from "@/lib/layout";
import { usePalaceStore } from "@/stores/palaceStore";
import type { PalaceObject } from "@/types/palace";

const halfWidth = ROOM_WIDTH / 2 - ROOM_INSET - 0.7;
const halfDepth = ROOM_DEPTH / 2 - ROOM_INSET - 0.7;
const lerpRate = 3.4;

/** Module scope scratch: a single tour camera, no per frame allocation. */
const tourTarget = new THREE.Vector3();
const tourDesired = new THREE.Vector3();
const tourRoom = new THREE.Vector3();
const tourOffset = new THREE.Vector3();

/** The object the tour is currently parked on, or null outside tour mode. */
export function useTourStop(): PalaceObject | null {
  const mode = usePalaceStore((state) => state.mode);
  const stops = usePalaceStore((state) => state.tourStops);
  const index = usePalaceStore((state) => state.currentTourIndex);
  if (mode !== "tour") return null;
  const objectId = stops[index];
  if (!objectId) return null;
  return palaceObjects.find((item) => item.id === objectId) ?? null;
}

function TourCamera() {
  const { camera } = useThree();
  const stop = useTourStop();

   
  useFrame((_, delta) => {
    if (!stop) return;

    const focus = THREE.MathUtils.clamp((stop.labelHeight ?? 2.4) * 0.45, 0.9, 2.4);
    tourTarget.set(stop.position[0], stop.position[1] + focus, stop.position[2]);

    const roomConfig = getRoom(stop.roomId);
    tourRoom.set(roomConfig.position[0], 0, roomConfig.position[2]);
    tourOffset.copy(tourRoom).sub(tourTarget).setY(0);
    if (tourOffset.lengthSq() < 0.01) tourOffset.set(0, 0, 1);
    else tourOffset.normalize();

    const distance = 3.2 + (stop.labelHeight ?? 2.4) * 0.55;
    tourDesired.copy(tourTarget).addScaledVector(tourOffset, distance);
    tourDesired.x = THREE.MathUtils.clamp(
      tourDesired.x,
      roomConfig.position[0] - halfWidth,
      roomConfig.position[0] + halfWidth,
    );
    tourDesired.z = THREE.MathUtils.clamp(
      tourDesired.z,
      roomConfig.position[2] - halfDepth,
      roomConfig.position[2] + halfDepth,
    );
    tourDesired.y = THREE.MathUtils.clamp(tourTarget.y + 1.1, 2.4, 5);

    // Frame rate independent so the move feels the same at 60 and 144 hz.
    camera.position.lerp(tourDesired, 1 - Math.exp(-lerpRate * Math.min(delta, 0.1)));
    camera.lookAt(tourTarget);
  });

  return null;
}

export default function GuidedTour() {
  const mode = usePalaceStore((state) => state.mode);
  const stops = usePalaceStore((state) => state.tourStops);
  const index = usePalaceStore((state) => state.currentTourIndex);
  const advanceTour = usePalaceStore((state) => state.advanceTour);
  const setTourIndex = usePalaceStore((state) => state.setTourIndex);
  const transitionMode = usePalaceStore((state) => state.transitionMode);
  const object = useTourStop();
  const placement = usePalaceStore((state) =>
    state.placements.find((item) => item.objectId === object?.id),
  );
  const concept = concepts.find((item) => item.id === placement?.conceptId);
  const isLast = index >= stops.length - 1;
  const total = stops.length;

  useEffect(() => {
    if (mode !== "tour") return;
    const handleArrow = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      if (event.key === "ArrowLeft") {
        setTourIndex(index - 1);
      } else if (index < stops.length - 1) {
        setTourIndex(index + 1);
      } else {
        transitionMode("quiz");
      }
    };
    window.addEventListener("keydown", handleArrow);
    return () => window.removeEventListener("keydown", handleArrow);
  }, [index, mode, setTourIndex, stops.length, transitionMode]);

  // Every stop is a tagged object by construction, so the card always has content.
  if (mode !== "tour" || !object || !concept) return null;

  const finish = () => transitionMode("quiz");
  const next = () => {
    if (isLast) finish();
    else advanceTour();
  };

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 z-30 flex w-full items-end p-4 sm:w-auto sm:max-w-[43rem]">
      <section className="pointer-events-auto w-full rounded-[1.4rem] border border-cyan-200/25 bg-slate-950/88 p-[1.25rem] text-white shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.9rem] font-semibold tracking-[0.18em] text-cyan-300 uppercase">
            Tour {index + 1}/{total}
          </p>
          <div className="flex gap-[0.2rem]">
            {stops.map((stop, stopIndex) => (
              <button
                key={stop}
                type="button"
                aria-label={`Go to stop ${stopIndex + 1}`}
                onClick={() => setTourIndex(stopIndex)}
                className={`h-[0.4rem] w-[1.8rem] rounded-full transition ${
                  stopIndex === index ? "bg-cyan-300" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={finish}
            className="text-[0.9rem] text-slate-400 hover:text-white"
          >
            Skip
          </button>
        </div>

        <h2 className="mt-[0.3rem] text-2xl font-bold">{concept.title}</h2>
        <p className="mt-[0.3rem] text-[1.05rem] leading-[1.7rem] text-slate-300">{concept.explanation}</p>
        <p className="mt-[0.5rem] rounded-[0.7rem] bg-cyan-300/10 px-[1.15rem] py-[0.5rem] text-[1.05rem] leading-[1.7rem] text-cyan-100">
          <span className="font-semibold">Picture it:</span> {concept.visualHint}
        </p>

        <div className="mt-[0.6rem] flex items-center justify-between gap-4">
          <span className="truncate text-[0.9rem] text-slate-400">
            {object.name} · ← → to switch
          </span>
          <button
            type="button"
            onClick={next}
            className="shrink-0 rounded-full bg-cyan-300 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
          >
            {isLast ? "Start quiz" : "Next"}
          </button>
        </div>
      </section>
    </div>
  );
}

export { TourCamera };
