import type { PalaceObject } from "@/types/palace";

/**
 * Every entry here is a real, placeable concept target: it highlights when you
 * look at it and takes a floating label once a concept lands on it. Purely
 * decorative fill (loose books, lamps, plants, paintings) lives in RoomDecor.
 *
 * The first five are the canonical concept anchors and drive the tour + quiz.
 * Positions are world space, spread across the 18 x 15 rooms.
 */
export const palaceObjects: PalaceObject[] = [
  /* ---- canonical concept anchors ---- */
  {
    id: "storage-chest",
    name: "Storage chest",
    position: [-17.0, 0, -14.8],
    roomId: "living-room",
    labelHeight: 2.0,
  },
  {
    id: "kitchen-recipe-book",
    name: "Kitchen recipe book",
    position: [6.0, 1.01, -7.0],
    roomId: "kitchen",
    labelHeight: 1.05,
  },
  {
    id: "staircase-clock",
    name: "Wall clock",
    position: [9.5, 4.4, 15.25],
    roomId: "clock-hall",
    labelHeight: 1.35,
  },
  {
    id: "bookshelf",
    name: "Bookshelf",
    position: [-16.5, 0, -1.4],
    roomId: "living-room",
    labelHeight: 2.9,
  },
  {
    id: "mirror",
    name: "Nested mirror",
    position: [-3.5, 0, 15.0],
    roomId: "study",
    labelHeight: 2.6,
  },

  /* ---- living room ---- */
  {
    id: "living-room-plant",
    name: "Potted plant",
    position: [-3.5, 0, -12.5],
    roomId: "living-room",
    labelHeight: 2.1,
  },
  {
    id: "coffee-table",
    name: "Coffee table",
    position: [-8.0, 0, -7.0],
    roomId: "living-room",
    labelHeight: 1.3,
  },
  {
    id: "sofa",
    name: "Sofa",
    position: [-15.5, 0, -4.4],
    roomId: "living-room",
    labelHeight: 1.7,
  },

  /* ---- kitchen ---- */
  {
    id: "kitchen-counter",
    name: "Kitchen counter",
    position: [6.0, 0, -7.0],
    roomId: "kitchen",
    labelHeight: 1.8,
  },
  {
    id: "dining-set",
    name: "Dining table and chairs",
    position: [13.5, 0, -6.0],
    roomId: "kitchen",
    labelHeight: 1.6,
  },

  /* ---- study ---- */
  {
    id: "desk",
    name: "Study desk",
    position: [-14.0, 0, 1.3],
    roomId: "study",
    labelHeight: 1.9,
  },
  {
    id: "sideboard",
    name: "Sideboard",
    position: [-12.5, 0, 15.0],
    roomId: "study",
    labelHeight: 1.6,
  },
  {
    id: "globe",
    name: "Globe",
    position: [-13.3, 1.08, 15.0],
    roomId: "study",
    labelHeight: 1.2,
  },
  {
    id: "study-plant",
    name: "Tall plant",
    position: [-1.6, 0, 14.5],
    roomId: "study",
    labelHeight: 2.2,
  },

  /* ---- clock hall ---- */
  {
    id: "tiered-stand",
    name: "Tiered display stand",
    position: [4.0, 0, 1.6],
    roomId: "clock-hall",
    labelHeight: 1.5,
  },
  {
    id: "console-table",
    name: "Console table",
    position: [17.1, 0, 10.0],
    roomId: "clock-hall",
    labelHeight: 1.6,
  },
  {
    id: "hall-bench",
    name: "Bench",
    position: [6.5, 0, 14.9],
    roomId: "clock-hall",
    labelHeight: 1.3,
  },
  {
    id: "hall-plant",
    name: "Corner plant",
    position: [17.2, 0, 14.4],
    roomId: "clock-hall",
    labelHeight: 2.2,
  },
];
