"use client";

import { Billboard } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

type ConceptLabelProps = {
  title: string;
  height?: number;
};

const LABEL_PADDING = 26;
const FONT = "600 42px system-ui, -apple-system, 'Segoe UI', sans-serif";

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

/**
 * Concept labels are drawn to an offscreen 2D canvas and used as a texture.
 * This is deliberately not drei's <Text>: that pulls in troika, which fetches a
 * font over the network at runtime and leaves the label blank offline (and can
 * stall the frame loop while the request is pending).
 */
export default function ConceptLabel({ title, height = 2.4 }: ConceptLabelProps) {
  const { texture, aspect } = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return { texture: null, aspect: 4 };

    ctx.font = FONT;
    const textWidth = ctx.measureText(title).width;
    canvas.width = Math.ceil(textWidth) + LABEL_PADDING * 2;
    canvas.height = 84;

    // resizing the canvas resets its state, so re-apply everything
    ctx.font = FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(6, 59, 50, 0.92)";
    roundedRect(ctx, 0, 0, canvas.width, canvas.height, 18);
    ctx.fill();
    ctx.strokeStyle = "rgba(217, 255, 242, 0.35)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#d9fff2";
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 + 2);

    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    map.needsUpdate = true;
    return { texture: map, aspect: canvas.width / canvas.height };
  }, [title]);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;

  return (
    <Billboard position={[0, height, 0]}>
      <mesh>
        <planeGeometry args={[0.34 * aspect, 0.34]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </Billboard>
  );
}
