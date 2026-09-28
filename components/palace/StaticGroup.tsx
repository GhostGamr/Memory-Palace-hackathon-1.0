"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { Group as ThreeGroup } from "three";

/**
 * Wraps a fully static subtree and freezes its world matrices after mount.
 * The palace shell never moves, so three.js can stop recomposing every
 * transform each frame — worth it once a room holds hundreds of meshes.
 */
export default function StaticGroup({ children }: { children: ReactNode }) {
  const ref = useRef<ThreeGroup>(null);

  useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;
    group.updateMatrixWorld(true);
    group.traverse((object) => {
      object.updateMatrix();
      object.matrixAutoUpdate = false;
    });
  }, []);

  return <group ref={ref}>{children}</group>;
}
