import { memo } from "react";
import Room from "@/components/palace/Room";
import StaticGroup from "@/components/palace/StaticGroup";
import {
  OPENING_WIDTH,
  ROOMS,
  ROOM_DEPTH,
  ROOM_GAP,
  ROOM_OFFSET_X,
  ROOM_OFFSET_Z,
  ROOM_WIDTH,
} from "@/lib/layout";

const houseWidth = 2 * (ROOM_OFFSET_X + ROOM_WIDTH / 2);
const houseDepth = 2 * (ROOM_OFFSET_Z + ROOM_DEPTH / 2);
const slotLength = houseDepth / 2 - ROOM_GAP / 2;
const slotOffset = (houseDepth + ROOM_GAP) / 4;

const floorColor = "#9a6547";

function House() {
  return (
    <StaticGroup>
      {ROOMS.map((room) => (
        <Room key={room.id} room={room} />
      ))}

      {/* Open floor through the two vertical passages (no door, no frame). */}
      {[-1, 1].map((side) => (
        <mesh key={`slot-x-${side}`} receiveShadow position={[0, 0.02, side * slotOffset]}>
          <boxGeometry args={[ROOM_GAP, 0.06, slotLength]} />
          <meshStandardMaterial color={floorColor} roughness={0.95} />
        </mesh>
      ))}
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[houseWidth, 0.06, ROOM_GAP]} />
        <meshStandardMaterial color={floorColor} roughness={0.95} />
      </mesh>

      {/* Threshold inlays, purely decorative. */}
      {[-1, 1].map((side) => (
        <group key={`threshold-${side}`}>
          <mesh receiveShadow position={[0, 0.05, side * ROOM_OFFSET_Z]}>
            <boxGeometry args={[ROOM_GAP, 0.02, OPENING_WIDTH]} />
            <meshStandardMaterial color="#a87450" roughness={0.85} />
          </mesh>
          <mesh receiveShadow position={[side * ROOM_OFFSET_X, 0.05, 0]}>
            <boxGeometry args={[OPENING_WIDTH, 0.02, ROOM_GAP]} />
            <meshStandardMaterial color="#a87450" roughness={0.85} />
          </mesh>
        </group>
      ))}

      <mesh receiveShadow position={[0, -0.32, 0]}>
        <boxGeometry args={[houseWidth + 1.6, 0.5, houseDepth + 1.6]} />
        <meshStandardMaterial color="#4e3029" roughness={1} />
      </mesh>
    </StaticGroup>
  );
}

export default memo(House);
