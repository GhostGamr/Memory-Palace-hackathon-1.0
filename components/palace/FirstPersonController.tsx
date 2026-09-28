"use client";

import { PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { palaceObjects } from "@/data/palaceObjects";
import { resolveMove } from "@/lib/collision";
import { usePalaceStore } from "@/stores/palaceStore";
import type { PalaceObject } from "@/types/palace";

const EYE_HEIGHT = 1.8;
const MOVE_SPEED = 9.5;
const ACCELERATION = 14;
const DAMPING = 11;
const BOB_RATE = 1.9;
const BOB_AMOUNT = 0.035;
const MAX_DELTA = 1 / 20;
const INTERACTION_DISTANCE = 4.2;
const AIM_DOT = 0.55;

const MOVE_KEYS = ["KeyW", "KeyA", "KeyS", "KeyD"] as const;

/**
 * Scratch vectors live at module scope: there is only ever one controller, and
 * keeping them out of the component lets the frame loop reuse them without
 * allocating (or tripping the react compiler lint rules).
 */
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const move = new THREE.Vector3();
const targetVelocity = new THREE.Vector3();

/**
 * Nearest object inside the aim cone, ignoring any id in `skipIds`.
 * R3F keeps the frame callback up to date, so it always closes over the
 * current skip set without needing a ref.
 */
export function useNearestInteractable(
  objects: PalaceObject[] = palaceObjects,
  maxDistance = INTERACTION_DISTANCE,
  skipIds: ReadonlySet<string> = EMPTY_SET,
) {
  const { camera } = useThree();
  const nearest = useRef<PalaceObject | null>(null);
  const [interactable, setInteractable] = useState<PalaceObject | null>(null);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const offset = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    camera.getWorldDirection(direction);
    const blocked = skipIds;
    let next: PalaceObject | null = null;
    let closestDistance = maxDistance;

    for (const object of objects) {
      if (blocked.has(object.id)) continue;
      offset.set(...object.position).sub(camera.position);
      const distance = offset.length();
      if (distance > closestDistance) continue;
      if (direction.dot(offset.normalize()) <= AIM_DOT) continue;
      closestDistance = distance;
      next = object;
    }

    if (nearest.current?.id !== next?.id) {
      nearest.current = next;
      setInteractable(next);
    }
  });

  return interactable;
}

const EMPTY_SET: ReadonlySet<string> = new Set<string>();

type FirstPersonControllerProps = {
  onFirstMovement?: () => void;
  onNearestChange?: (object: PalaceObject | null) => void;
};

export default function FirstPersonController({
  onFirstMovement,
  onNearestChange,
}: FirstPersonControllerProps) {
  const { camera } = useThree();
  const mode = usePalaceStore((state) => state.mode);
  const activeConceptId = usePalaceStore((state) => state.activeConceptId);
  const placeConcept = usePalaceStore((state) => state.placeConcept);
  const moved = useRef(false);
  const keys = useRef(new Set<string>());
  const velocity = useRef(new THREE.Vector3());
  const bobPhase = useRef(0);

  // Every object is a valid target: tagging one that already holds a concept
  // re-tags it, which is exactly what the hotbar selection implies.
  const nearest = useNearestInteractable(palaceObjects, INTERACTION_DISTANCE, EMPTY_SET);

  useEffect(() => {
    onNearestChange?.(nearest);
  }, [nearest, onNearestChange]);

  /**
   * One action for both E and click: tag the active hotbar slot's concept onto
   * whatever prop is being looked at. If that concept already lives somewhere
   * else it moves here. Nothing happens when no prop is targeted.
   */
  const interact = useCallback(() => {
    if (!activeConceptId || !nearest) return;
    placeConcept(activeConceptId, nearest.id);
  }, [activeConceptId, nearest, placeConcept]);

  useEffect(() => {
    const pressed = keys.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((MOVE_KEYS as readonly string[]).includes(event.code)) {
        pressed.add(event.code);
        if (!moved.current) {
          moved.current = true;
          onFirstMovement?.();
        }
      }
      if (event.code === "KeyE" && mode === "explore") {
        event.preventDefault();
        interact();
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => pressed.delete(event.code);
    const releaseKeys = () => pressed.clear();
    const handlePointerDown = () => {
      if (document.pointerLockElement) interact();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", releaseKeys);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", releaseKeys);
      window.removeEventListener("pointerdown", handlePointerDown);
      pressed.clear();
    };
  }, [interact, mode, onFirstMovement]);

  // eslint-disable-next-line react-hooks/immutability
  useFrame((_, delta) => {
    if (!document.pointerLockElement) return;

    const dt = Math.min(delta, MAX_DELTA);
    const pressed = keys.current;

    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() < 1e-6) forward.set(0, 0, -1);
    forward.normalize();
    right.crossVectors(forward, camera.up).normalize();

    move.set(0, 0, 0);
    if (pressed.has("KeyW")) move.add(forward);
    if (pressed.has("KeyS")) move.sub(forward);
    if (pressed.has("KeyD")) move.add(right);
    if (pressed.has("KeyA")) move.sub(right);

    // Normalising keeps diagonals the same speed as a single axis.
    const input = move.lengthSq() > 0;
    if (input) move.normalize();

    targetVelocity.copy(move).multiplyScalar(MOVE_SPEED);
    // Frame rate independent exponential ease in / ease out.
    const blend = 1 - Math.exp(-(input ? ACCELERATION : DAMPING) * dt);
    velocity.current.lerp(targetVelocity, blend);
    if (!input && velocity.current.lengthSq() < 1e-4) velocity.current.set(0, 0, 0);

    const result = resolveMove(
      camera.position.x,
      camera.position.z,
      velocity.current.x * dt,
      velocity.current.z * dt,
    );
    if (result.blockedX) velocity.current.x = 0;
    if (result.blockedZ) velocity.current.z = 0;

    // eslint-disable-next-line react-hooks/immutability
    camera.position.x = result.x;
     
    camera.position.z = result.z;

    const speedRatio = Math.min(1, velocity.current.length() / MOVE_SPEED);
    bobPhase.current += dt * BOB_RATE * Math.PI * 2 * speedRatio;
     
    camera.position.y = EYE_HEIGHT + Math.sin(bobPhase.current) * BOB_AMOUNT * speedRatio;
  });

  return mode === "explore" ? (
    <PointerLockControls makeDefault selector="#palace-canvas canvas" />
  ) : null;
}
