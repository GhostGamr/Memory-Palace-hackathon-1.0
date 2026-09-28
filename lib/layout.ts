export type WallSide = "north" | "south" | "east" | "west";

/**
 * Single source of truth for palace geometry. House (visual), Room (visual),
 * FirstPersonController (collision) and GuidedTour (camera) all read from here
 * so the built geometry and the walkable volume can never drift apart.
 */
export const ROOM_WIDTH = 18;
export const ROOM_DEPTH = 15;
export const WALL_HEIGHT = 7.2;
export const WALL_THICKNESS = 0.3;
export const OPENING_WIDTH = 3.4;

/** Slot of open air left between two neighbouring rooms (no wall, no door). */
export const ROOM_GAP = 1;

/** Distance from the world origin to a room centre on each axis. */
export const ROOM_OFFSET_X = ROOM_WIDTH / 2 + ROOM_GAP / 2;
export const ROOM_OFFSET_Z = ROOM_DEPTH / 2 + ROOM_GAP / 2;

/** How far inside a room's walls the player may stand. */
export const ROOM_INSET = 0.4;

/**
 * Half-width of the walkable strip that spans the gap between two rooms.
 * Must be >= ROOM_INSET + wall half thickness, otherwise the room rect and the
 * opening strip fail to overlap and the player gets wedged in the doorway.
 */
export const PASSAGE_HALF = 0.95;

export const PALACE_BOUNDS = {
  minX: -(ROOM_OFFSET_X + ROOM_WIDTH / 2) + ROOM_INSET,
  maxX: ROOM_OFFSET_X + ROOM_WIDTH / 2 - ROOM_INSET,
  minZ: -(ROOM_OFFSET_Z + ROOM_DEPTH / 2) + ROOM_INSET,
  maxZ: ROOM_OFFSET_Z + ROOM_DEPTH / 2 - ROOM_INSET,
};

export type RoomLight = {
  /** Warm key colour for the ceiling fixture. */
  color: string;
  /** Candela-ish intensity of the shadow casting ceiling spot. */
  intensity: number;
  /** Bounce colour for the low fill light. */
  fill: string;
  fillIntensity: number;
  /** Distance falloff exponent. Lower spreads light further. */
  decay?: number;
  /** Ceiling fixture position as a local x/z offset inside the room. */
  lamp: [number, number];
};

export type RoomConfig = {
  id: string;
  name: string;
  position: [number, number, number];
  accent: string;
  floor: string;
  skirting: string;
  ceiling: string;
  openings: WallSide[];
  light: RoomLight;
};

export const ROOMS: RoomConfig[] = [
  {
    id: "living-room",
    name: "Living room",
    position: [-ROOM_OFFSET_X, 0, -ROOM_OFFSET_Z],
    accent: "#8d6b56",
    floor: "#9c6748",
    skirting: "#6d412c",
    ceiling: "#bda78c",
    openings: ["east", "south"],
    light: { color: "#ffc27c", intensity: 21, decay: 1.3, fill: "#ff9d5c", fillIntensity: 40, lamp: [-1.5, 0.5] },
  },
  {
    id: "kitchen",
    name: "Kitchen",
    position: [ROOM_OFFSET_X, 0, -ROOM_OFFSET_Z],
    accent: "#a3805f",
    floor: "#a9764f",
    skirting: "#6f4a2c",
    ceiling: "#c6b091",
    openings: ["west", "south"],
    light: { color: "#ffd49a", intensity: 22, decay: 1.3, fill: "#ffb877", fillIntensity: 44, lamp: [2, 0.5] },
  },
  {
    id: "study",
    name: "Study",
    position: [-ROOM_OFFSET_X, 0, ROOM_OFFSET_Z],
    accent: "#6f5648",
    floor: "#8d5c44",
    skirting: "#5d3a2c",
    ceiling: "#a89a86",
    openings: ["north", "east"],
    light: { color: "#ffbe7d", intensity: 20, decay: 1.3, fill: "#e08a4e", fillIntensity: 36, lamp: [-1, -1] },
  },
  {
    id: "clock-hall",
    name: "Clock hall",
    position: [ROOM_OFFSET_X, 0, ROOM_OFFSET_Z],
    accent: "#8f6c52",
    floor: "#96674a",
    skirting: "#6a4128",
    ceiling: "#b8a184",
    openings: ["north", "west"],
    light: { color: "#ffc98b", intensity: 20, decay: 1.3, fill: "#ffa96a", fillIntensity: 38, lamp: [0, 0] },
  },
];

export function getRoom(roomId: string): RoomConfig {
  return ROOMS.find((room) => room.id === roomId) ?? ROOMS[0];
}

/** World-space [x, z] centre of a room, used by collision and the tour camera. */
export function getRoomCenter(roomId: string): [number, number] {
  const room = getRoom(roomId);
  return [room.position[0], room.position[2]];
}
