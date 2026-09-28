"use client";

import { BakeShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { concepts } from "@/data/concepts";
import { palaceObjects } from "@/data/palaceObjects";
import House from "@/components/palace/House";
import { TourCamera } from "@/components/palace/GuidedTour";
import InteractiveObject from "@/components/palace/InteractiveObject";
import SceneBoundary from "@/components/palace/SceneBoundary";
import FirstPersonController from "@/components/palace/FirstPersonController";
import { ROOMS, WALL_HEIGHT, type RoomConfig } from "@/lib/layout";
import { usePalaceStore } from "@/stores/palaceStore";
import type { PalaceObject } from "@/types/palace";

const START_POSITION: [number, number, number] = [-3.0, 1.8, -8];
const START_YAW = Math.PI / 2;

/**
 * One warm ceiling fixture per room. Shadows for the whole palace are baked once
 * after mount (see BakeShadows) since nothing in the shell ever moves, so the
 * four shadow maps cost nothing on subsequent frames.
 */
function RoomKeyLight({ room }: { room: RoomConfig }) {
  const light = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  const [x, z] = room.light.lamp;
  const position: [number, number, number] = [
    room.position[0] + x,
    Math.min(WALL_HEIGHT - 1.6, 5.6),
    room.position[2] + z,
  ];

  useEffect(() => {
    const spot = light.current;
    if (!spot) return;
    target.position.set(room.position[0], 0, room.position[2]);
    target.updateMatrixWorld();
    spot.target = target;
  }, [room, target]);

  return (
    <>
      <spotLight
        ref={light}
        position={position}
        color={room.light.color}
        intensity={room.light.intensity}
        angle={1.2}
        penumbra={0.85}
        distance={WALL_HEIGHT * 4.2}
        decay={room.light.decay ?? 1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        shadow-normalBias={0.035}
        shadow-camera-near={1.2}
        shadow-camera-far={WALL_HEIGHT * 5}
      />
      <primitive object={target} />
    </>
  );
}

const InteractiveLayer = memo(function InteractiveLayer({
  focusedId,
  showLabels,
}: {
  focusedId: string | null;
  showLabels: boolean;
}) {
  const placements = usePalaceStore((state) => state.placements);
  const mode = usePalaceStore((state) => state.mode);
  const tourStops = usePalaceStore((state) => state.tourStops);
  const tourIndex = usePalaceStore((state) => state.currentTourIndex);
  const tourObjectId = mode === "tour" ? (tourStops[tourIndex] ?? null) : null;

  return (
    <>
      {palaceObjects.map((object) => {
        const placement = placements.find((item) => item.objectId === object.id);
        const concept = concepts.find((item) => item.id === placement?.conceptId);
        return (
          <InteractiveObject
            key={object.id}
            object={object}
            concept={concept}
            focused={focusedId === object.id || tourObjectId === object.id}
            /* the tour camera parks on the stop, so its own label would fill the
               screen and duplicate the tour card */
            showLabel={showLabels && object.id !== tourObjectId}
          />
        );
      })}
    </>
  );
});

export default function PalaceScene() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const mode = usePalaceStore((state) => state.mode);
  const hideInstructions = useCallback(() => setShowInstructions(false), []);
  const handleNearestChange = useCallback(
    (object: PalaceObject | null) => setFocusedId(object?.id ?? null),
    [],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowInstructions(false), 7000);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div id="palace-canvas" className="absolute inset-0 z-0 h-full w-full">
      <SceneBoundary>
        <Canvas
          shadows="percentage"
          dpr={[1, 1.5]}
          camera={{ position: START_POSITION, fov: 72, near: 0.1, far: 120 }}
          onCreated={({ camera, gl }) => {
            camera.position.set(...START_POSITION);
            camera.rotation.set(0, START_YAW, 0);
            gl.toneMappingExposure = 1.12;
          }}
        >
          <color attach="background" args={["#20181a"]} />
          <fog attach="fog" args={["#241b1b", 46, 120]} />

          <ambientLight intensity={0.85} color="#ffdcb4" />
          <hemisphereLight intensity={0.95} color="#ffe3ba" groundColor="#4a3028" />
          <directionalLight position={[6, 22, -4]} intensity={0.34} color="#ffe2b8" />
          {ROOMS.map((room) => (
            <RoomKeyLight key={room.id} room={room} />
          ))}
          <BakeShadows />

          <House />
          <InteractiveLayer focusedId={focusedId} showLabels={mode !== "quiz"} />
          <FirstPersonController
            onFirstMovement={hideInstructions}
            onNearestChange={handleNearestChange}
          />
          <TourCamera />
        </Canvas>
      </SceneBoundary>

      {showInstructions && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center px-4">
          <p className="animate-in fade-in rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[11px] text-slate-300 shadow-lg backdrop-blur-sm duration-500">
            Scroll or click a slot to choose · aim at a prop · press E to tag it
          </p>
        </div>
      )}
    </div>
  );
}
