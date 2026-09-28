import {
  OPENING_WIDTH,
  PALACE_BOUNDS,
  PASSAGE_HALF,
  ROOMS,
  ROOM_DEPTH,
  ROOM_INSET,
  ROOM_OFFSET_X,
  ROOM_OFFSET_Z,
  ROOM_WIDTH,
} from "@/lib/layout";

/** Walkable half extents of a room's interior. */
const halfWidth = ROOM_WIDTH / 2 - ROOM_INSET;
const halfDepth = ROOM_DEPTH / 2 - ROOM_INSET;

/** Half of the opening carved out of a wall, plus a small squeeze margin. */
const openingHalf = OPENING_WIDTH / 2 + 0.15;

const roomAt = (x: number, z: number) =>
  ROOMS.find(
    (room) =>
      Math.abs(room.position[0] - x) < 0.001 && Math.abs(room.position[2] - z) < 0.001,
  );

/**
 * Vertical links are the open gaps between the left and right rooms: they exist
 * where both neighbours leave a facing wall open. Deriving them from `openings`
 * keeps collision in lockstep with the geometry instead of duplicating numbers.
 */
const verticalLinks: number[] = [];
for (const z of [-ROOM_OFFSET_Z, ROOM_OFFSET_Z]) {
  const west = roomAt(-ROOM_OFFSET_X, z);
  const east = roomAt(ROOM_OFFSET_X, z);
  if (west?.openings.includes("east") && east?.openings.includes("west")) {
    verticalLinks.push(z);
  }
}

const horizontalLinks: number[] = [];
for (const x of [-ROOM_OFFSET_X, ROOM_OFFSET_X]) {
  const south = roomAt(x, -ROOM_OFFSET_Z);
  const north = roomAt(x, ROOM_OFFSET_Z);
  if (south?.openings.includes("south") && north?.openings.includes("north")) {
    horizontalLinks.push(x);
  }
}

export function isInsideRoom(x: number, z: number) {
  return ROOMS.some(
    (room) =>
      Math.abs(room.position[0] - x) <= halfWidth &&
      Math.abs(room.position[2] - z) <= halfDepth,
  );
}

/** The open strip spanning the gap between two rooms, where no wall exists. */
export function isInPassage(x: number, z: number) {
  if (Math.abs(x) <= PASSAGE_HALF && verticalLinks.some((link) => Math.abs(z - link) <= openingHalf)) {
    return true;
  }
  if (Math.abs(z) <= PASSAGE_HALF && horizontalLinks.some((link) => Math.abs(x - link) <= openingHalf)) {
    return true;
  }
  return false;
}

export function canOccupy(x: number, z: number) {
  const withinPalace =
    x >= PALACE_BOUNDS.minX &&
    x <= PALACE_BOUNDS.maxX &&
    z >= PALACE_BOUNDS.minZ &&
    z <= PALACE_BOUNDS.maxZ;
  return withinPalace && (isInsideRoom(x, z) || isInPassage(x, z));
}

export type MoveResult = { x: number; z: number; blockedX: boolean; blockedZ: boolean };

/**
 * Axis separated slide: each axis is tested on its own so brushing a wall keeps
 * you moving along it instead of stopping dead.
 */
export function resolveMove(x: number, z: number, dx: number, dz: number): MoveResult {
  let nextX = x;
  let nextZ = z;
  let blockedX = false;
  let blockedZ = false;

  if (canOccupy(x + dx, z)) {
    nextX = x + dx;
  } else {
    blockedX = dx !== 0;
  }
  if (canOccupy(nextX, z + dz)) {
    nextZ = z + dz;
  } else {
    blockedZ = dz !== 0;
  }
  if (!canOccupy(nextX, nextZ)) {
    nextX = x;
    nextZ = z;
  }

  return { x: nextX, z: nextZ, blockedX, blockedZ };
}
