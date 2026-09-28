import RoomDecor from "@/components/palace/RoomDecor";
import {
  OPENING_WIDTH,
  ROOMS,
  ROOM_DEPTH,
  ROOM_WIDTH,
  WALL_HEIGHT,
  WALL_THICKNESS,
  type RoomConfig,
  type WallSide,
} from "@/lib/layout";

function Wall({
  side,
  accent,
  opening,
}: {
  side: WallSide;
  accent: string;
  opening: boolean;
}) {
  const horizontal = side === "north" || side === "south";
  const length = horizontal ? ROOM_WIDTH : ROOM_DEPTH;
  const segmentLength = (length - OPENING_WIDTH) / 2;
  const edge = (horizontal ? ROOM_DEPTH : ROOM_WIDTH) / 2;
  const wallPosition: [number, number, number] = [
    horizontal ? 0 : side === "east" ? edge : -edge,
    WALL_HEIGHT / 2,
    horizontal ? (side === "north" ? -edge : edge) : 0,
  ];

  if (!opening) {
    return (
      <mesh castShadow receiveShadow position={wallPosition}>
        <boxGeometry
          args={[
            horizontal ? ROOM_WIDTH : WALL_THICKNESS,
            WALL_HEIGHT,
            horizontal ? WALL_THICKNESS : ROOM_DEPTH,
          ]}
        />
        <meshStandardMaterial color={accent} roughness={0.9} />
      </mesh>
    );
  }

  const positions: [number, number, number][] = horizontal
    ? [
        [-((OPENING_WIDTH + segmentLength) / 2), WALL_HEIGHT / 2, wallPosition[2]],
        [(OPENING_WIDTH + segmentLength) / 2, WALL_HEIGHT / 2, wallPosition[2]],
      ]
    : [
        [wallPosition[0], WALL_HEIGHT / 2, -((OPENING_WIDTH + segmentLength) / 2)],
        [wallPosition[0], WALL_HEIGHT / 2, (OPENING_WIDTH + segmentLength) / 2],
      ];

  return (
    <>
      {positions.map((position, index) => (
        <mesh key={`${side}-${index}`} castShadow receiveShadow position={position}>
          <boxGeometry
            args={[
              horizontal ? segmentLength : WALL_THICKNESS,
              WALL_HEIGHT,
              horizontal ? WALL_THICKNESS : segmentLength,
            ]}
          />
          <meshStandardMaterial color={accent} roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

export default function Room({ room }: { room: RoomConfig }) {
  const { name, position, accent, floor, ceiling, openings } = room;

  return (
    <group name={name} position={position}>
      <mesh receiveShadow position={[0, -0.08, 0]}>
        <boxGeometry args={[ROOM_WIDTH, 0.16, ROOM_DEPTH]} />
        <meshStandardMaterial color={floor} roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[0, WALL_HEIGHT + 0.1, 0]}>
        <boxGeometry args={[ROOM_WIDTH, 0.2, ROOM_DEPTH]} />
        <meshStandardMaterial color={ceiling} roughness={0.95} />
      </mesh>
      {(["north", "south", "east", "west"] as WallSide[]).map((side) => (
        <Wall key={side} side={side} accent={accent} opening={openings.includes(side)} />
      ))}
      <RoomDecor room={room} />
    </group>
  );
}

export { ROOMS };
