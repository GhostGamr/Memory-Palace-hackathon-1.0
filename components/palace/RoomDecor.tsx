import {
  ROOM_DEPTH,
  ROOM_WIDTH,
  WALL_HEIGHT,
  WALL_THICKNESS,
  type RoomConfig,
  type WallSide,
} from "@/lib/layout";

type Vec3 = [number, number, number];

const northFace = -ROOM_DEPTH / 2 + WALL_THICKNESS / 2 + 0.05;
const southFace = ROOM_DEPTH / 2 - WALL_THICKNESS / 2 - 0.05;
const westFace = -ROOM_WIDTH / 2 + WALL_THICKNESS / 2 + 0.05;
const eastFace = ROOM_WIDTH / 2 - WALL_THICKNESS / 2 - 0.05;

function wallPlacement(wall: WallSide, along: number, y: number) {
  switch (wall) {
    case "north":
      return { position: [along, y, northFace] as Vec3, rotationY: 0 };
    case "south":
      return { position: [along, y, southFace] as Vec3, rotationY: Math.PI };
    case "west":
      return { position: [westFace, y, along] as Vec3, rotationY: Math.PI / 2 };
    default:
      return { position: [eastFace, y, along] as Vec3, rotationY: -Math.PI / 2 };
  }
}

type Motif = { x: number; y: number; w: number; h: number; color: string };

function Painting({
  wall,
  along,
  y,
  width,
  height,
  frame,
  canvas,
  motif = [],
}: {
  wall: WallSide;
  along: number;
  y: number;
  width: number;
  height: number;
  frame: string;
  canvas: string;
  motif?: Motif[];
}) {
  const { position, rotationY } = wallPlacement(wall, along, y);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color={frame} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[width - 0.24, height - 0.24, 0.05]} />
        <meshStandardMaterial color={canvas} roughness={0.9} />
      </mesh>
      {motif.map((shape, index) => (
        <mesh key={index} position={[shape.x, shape.y, 0.065]} receiveShadow>
          <boxGeometry args={[shape.w, shape.h, 0.02]} />
          <meshStandardMaterial color={shape.color} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Rug({
  position,
  size,
  color,
  trim,
}: {
  position: Vec3;
  size: [number, number];
  color: string;
  trim: string;
}) {
  return (
    <group position={position}>
      <mesh receiveShadow>
        <boxGeometry args={[size[0], 0.04, size[1]]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[0, 0.026, 0]} receiveShadow>
        <boxGeometry args={[size[0] - 0.7, 0.02, size[1] - 0.7]} />
        <meshStandardMaterial color={trim} roughness={1} />
      </mesh>
    </group>
  );
}

function CeilingLamp({
  position,
  shade,
  bulb,
  glow = 2.4,
}: {
  position: Vec3;
  shade: string;
  bulb: string;
  glow?: number;
}) {
  const drop = WALL_HEIGHT - 0.2 - position[1];
  return (
    <group position={position}>
      <mesh position={[0, drop / 2 + 0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.03, drop, 6]} />
        <meshStandardMaterial color="#3d2a20" roughness={0.8} />
      </mesh>
      <mesh>
        <coneGeometry args={[0.62, 0.6, 16, 1, true]} />
        <meshStandardMaterial color={shade} roughness={0.7} side={2} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.16, 12, 10]} />
        <meshStandardMaterial color={bulb} emissive={bulb} emissiveIntensity={glow} roughness={0.4} />
      </mesh>
    </group>
  );
}

function TableLamp({
  position,
  shade,
  glow = 2.2,
}: {
  position: Vec3;
  shade: string;
  glow?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.06, 12]} />
        <meshStandardMaterial color="#5c3a2a" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.62, 8]} />
        <meshStandardMaterial color={shade} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.76, 0]}>
        <coneGeometry args={[0.3, 0.42, 14, 1, true]} />
        <meshStandardMaterial color={shade} roughness={0.7} side={2} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.11, 10, 8]} />
        <meshStandardMaterial color="#ffe0a8" emissive="#ffcf87" emissiveIntensity={glow} roughness={0.4} />
      </mesh>
    </group>
  );
}

function BookStack({
  position,
  colors = ["#d18a50", "#8c5a42", "#e2b779"],
  count = 3,
}: {
  position: Vec3;
  colors?: string[];
  count?: number;
}) {
  return (
    <group position={position}>
      {Array.from({ length: count }, (_, index) => (
        <mesh
          key={index}
         
          receiveShadow
          position={[index * 0.02, 0.035 + index * 0.07, 0]}
          rotation={[0, index * 0.14, 0]}
        >
          <boxGeometry args={[0.5 - index * 0.04, 0.07, 0.36 - index * 0.02]} />
          <meshStandardMaterial color={colors[index % colors.length]} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Mug({
  position,
  color = "#e7ddc9",
}: {
  position: Vec3;
  color?: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.09, 0.075, 0.17, 12]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.018, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

function Vase({
  position,
  color,
  stems = false,
}: {
  position: Vec3;
  color: string;
  stems?: boolean;
}) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.14, 0.2, 0.42, 12]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.12, 12]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.15} />
      </mesh>
      {stems &&
        [
          [-0.09, 0.62, 0.04],
          [0.07, 0.7, -0.05],
          [0.0, 0.55, 0.1],
        ].map((stem, index) => (
          <mesh key={index} position={stem as Vec3} rotation={[0, 0, index * 0.3 - 0.3]}>
            <cylinderGeometry args={[0.015, 0.015, 0.42, 5]} />
            <meshStandardMaterial color="#6f8a4b" roughness={0.9} />
          </mesh>
        ))}
    </group>
  );
}

function DecorativePlant({
  position,
  scale = 1,
  pot = "#a65b3d",
  leaf = "#71804b",
}: {
  position: Vec3;
  scale?: number;
  pot?: string;
  leaf?: string;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh receiveShadow position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.32, 0.26, 0.68, 14]} />
        <meshStandardMaterial color={pot} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <torusGeometry args={[0.27, 0.04, 6, 16]} />
        <meshStandardMaterial color="#d99a5d" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.14, 0]}>
        <sphereGeometry args={[0.58, 14, 10]} />
        <meshStandardMaterial color={leaf} roughness={0.9} />
      </mesh>
      {[
        [0.4, 1.34, 0.1],
        [-0.36, 1.28, -0.12],
        [0.08, 1.5, -0.18],
      ].map((offset, index) => (
        <mesh key={index} position={offset as Vec3} scale={[0.3, 0.66, 0.17]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={index === 1 ? "#84975a" : leaf} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function WallShelf({
  position,
  rotationY = 0,
  width = 3.2,
  shelves = 3,
  books = 7,
  wood = "#6d412c",
  bookColors = ["#d18a50", "#8c5a42", "#b8754b", "#e2b779", "#9e5b3f", "#6f3e35", "#c9a06a"],
}: {
  position: Vec3;
  rotationY?: number;
  width?: number;
  shelves?: number;
  books?: number;
  wood?: string;
  bookColors?: string[];
}) {
  const height = 0.22 + shelves * 0.62;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-1, 1].map((side) => (
        <mesh key={side} receiveShadow position={[(side * width) / 2, height / 2, 0]}>
          <boxGeometry args={[0.14, height, 0.7]} />
          <meshStandardMaterial color={wood} roughness={0.85} />
        </mesh>
      ))}
      {Array.from({ length: shelves }, (_, index) => (
        <mesh key={`shelf-${index}`} receiveShadow position={[0, 0.26 + index * 0.62, 0]}>
          <boxGeometry args={[width, 0.12, 0.7]} />
          <meshStandardMaterial color={index === 0 ? wood : "#7d4a31"} roughness={0.85} />
        </mesh>
      ))}
      {Array.from({ length: books }, (_, index) => {
        const row = index % shelves;
        const slot = Math.floor(index / shelves);
        return (
          <mesh
            key={`book-${index}`}
           
            position={[-width / 2 + 0.3 + slot * 0.34, 0.56 + row * 0.62, 0.05]}
            rotation={[0, 0, index % 3 === 0 ? -0.12 : 0]}
          >
            <boxGeometry args={[0.24, 0.44 + (index % 2) * 0.08, 0.4]} />
            <meshStandardMaterial color={bookColors[index % bookColors.length]} roughness={0.85} />
          </mesh>
        );
      })}
    </group>
  );
}

function Chair({
  position,
  rotationY = 0,
  color = "#7a4034",
}: {
  position: Vec3;
  rotationY?: number;
  color?: string;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh receiveShadow position={[0, 0.46, 0]}>
        <boxGeometry args={[0.9, 0.12, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.9, -0.38]}>
        <boxGeometry args={[0.9, 0.8, 0.12]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {[
        [-0.36, -0.36],
        [0.36, -0.36],
        [-0.36, 0.36],
        [0.36, 0.36],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, 0.22, z]}>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
          <meshStandardMaterial color="#5d3a2c" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Jar({
  position,
  color,
  height = 0.34,
}: {
  position: Vec3;
  color: string;
  height?: number;
}) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.16, 0.14, height, 12]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
    </mesh>
  );
}

function Skirtings({ walls, color }: { walls: WallSide[]; color: string }) {
  return (
    <>
      {walls.map((wall) => {
        const horizontal = wall === "north" || wall === "south";
        const span = horizontal ? ROOM_WIDTH : ROOM_DEPTH;
        const position: Vec3 =
          wall === "north"
            ? [0, 0.12, -ROOM_DEPTH / 2 + WALL_THICKNESS / 2 + 0.04]
            : wall === "south"
              ? [0, 0.12, ROOM_DEPTH / 2 - WALL_THICKNESS / 2 - 0.04]
              : wall === "west"
                ? [-ROOM_WIDTH / 2 + WALL_THICKNESS / 2 + 0.04, 0.12, 0]
                : [ROOM_WIDTH / 2 - WALL_THICKNESS / 2 - 0.04, 0.12, 0];
        return (
          <mesh key={wall} receiveShadow position={position}>
            <boxGeometry args={horizontal ? [span, 0.24, 0.08] : [0.08, 0.24, span]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
        );
      })}
    </>
  );
}

function LivingRoom({ skirting }: { skirting: string }) {
  return (
    <group>
      <Skirtings walls={["north", "west"]} color={skirting} />
      <Rug position={[1.5, 0.02, 1.0]} size={[7, 4.6]} color="#6f3530" trim="#8f4a3c" />

      <Painting wall="north" along={-2.6} y={3.9} width={3.4} height={2.2} frame="#5b392f" canvas="#c9764a"
        motif={[{ x: 0, y: 0.3, w: 1.9, h: 0.7, color: "#e9b06a" }, { x: -0.6, y: -0.5, w: 0.5, h: 0.5, color: "#7a4433" }]} />
      <Painting wall="north" along={5.4} y={3.8} width={2} height={2.8} frame="#4d2f27" canvas="#8a6a4f"
        motif={[{ x: 0, y: 0, w: 0.9, h: 1.7, color: "#b98a55" }]} />
      <Painting wall="east" along={-4.6} y={3.5} width={2.8} height={1.8} frame="#5b392f" canvas="#7d6a8f"
        motif={[{ x: 0, y: 0, w: 1.5, h: 0.6, color: "#a58cba" }]} />
      <Painting wall="east" along={4.8} y={3.6} width={2.2} height={1.5} frame="#4d2f27" canvas="#b98a55"
        motif={[{ x: -0.5, y: 0, w: 0.5, h: 0.5, color: "#e9c07a" }, { x: 0.5, y: 0.1, w: 0.4, h: 0.6, color: "#8a5a3a" }]} />
      <Painting wall="south" along={4.8} y={3.6} width={2.6} height={1.7} frame="#5b392f" canvas="#6f8a72"
        motif={[{ x: 0, y: 0, w: 1.7, h: 0.7, color: "#96b18a" }]} />
      <Painting wall="west" along={2.4} y={3.4} width={2.4} height={1.4} frame="#4d2f27" canvas="#a8574a"
        motif={[{ x: 0, y: 0, w: 1.4, h: 0.5, color: "#c87a63" }]} />

      {/* armchair, kept decorative so it does not compete with concept targets */}
      <group position={[5.4, 0, 5.2]} rotation={[0, -0.7, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
          <boxGeometry args={[1.1, 0.16, 1.1]} />
          <meshStandardMaterial color="#8a4f38" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 0.86, -0.48]}>
          <boxGeometry args={[1.1, 0.9, 0.18]} />
          <meshStandardMaterial color="#7a4034" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 0.58, 0]}>
          <boxGeometry args={[0.9, 0.2, 0.9]} />
          <meshStandardMaterial color="#a75f45" roughness={0.9} />
        </mesh>
      </group>

      <group position={[-1.4, 0, 5.0]}>
        <mesh castShadow receiveShadow position={[0, 0.66, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.1, 16]} />
          <meshStandardMaterial color="#70402f" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.14, 0.2, 0.64, 12]} />
          <meshStandardMaterial color="#5d3a2c" roughness={0.9} />
        </mesh>
        <TableLamp position={[0, 0.71, 0]} shade="#d9a45f" />
      </group>

      <group position={[-8.2, 0, -2.0]}>
        <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
          <boxGeometry args={[1.1, 2.4, 2.2]} />
          <meshStandardMaterial color="#6d412c" roughness={0.85} />
        </mesh>
        {[-0.55, 0.55].map((z) => (
          <group key={z} position={[0.57, 1.2, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 2.1, 0.98]} />
              <meshStandardMaterial color="#7d4a31" roughness={0.8} />
            </mesh>
            <mesh position={[0.05, 0, 0.38]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#d9a45f" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        ))}
        <Vase position={[0, 2.4, -0.6]} color="#b8734f" stems />
        <BookStack position={[0, 2.4, 0.5]} count={2} colors={["#c98a5e", "#8c5a42"]} />
      </group>

      <WallShelf position={[1.2, 2.9, -7.1]} width={3.6} shelves={2} books={5} />
      <DecorativePlant position={[-8.2, 0, 3.0]} scale={1.15} pot="#9a5238" leaf="#6d7d47" />
      <CeilingLamp position={[-1.5, 5.5, 0.5]} shade="#b8754b" bulb="#ffd9a0" />
    </group>
  );
}

function Kitchen({ skirting }: { skirting: string }) {
  return (
    <group>
      <Skirtings walls={["north", "east"]} color={skirting} />
      <Rug position={[4.0, 0.02, 2.0]} size={[4.6, 3.4]} color="#7a4a30" trim="#96603c" />

      <Painting wall="north" along={1.8} y={3.7} width={2.8} height={1.9} frame="#5b392f" canvas="#d9a05e"
        motif={[{ x: -0.6, y: 0.1, w: 0.7, h: 0.7, color: "#f0d6a0" }, { x: 0.5, y: -0.2, w: 0.6, h: 0.9, color: "#a8653a" }]} />
      <Painting wall="east" along={-4.4} y={3.6} width={2.2} height={1.5} frame="#4d2f27" canvas="#8fa07a"
        motif={[{ x: 0, y: 0, w: 1.3, h: 0.5, color: "#aebd8f" }]} />
      <Painting wall="east" along={4.2} y={3.6} width={2} height={2.4} frame="#5b392f" canvas="#c98a5e"
        motif={[{ x: 0, y: 0.3, w: 0.9, h: 0.9, color: "#f0c98a" }]} />
      <Painting wall="west" along={-4.6} y={3.7} width={2.4} height={1.6} frame="#4d2f27" canvas="#b0705a"
        motif={[{ x: 0, y: 0, w: 1.5, h: 0.6, color: "#d19279" }]} />
      <Painting wall="south" along={-5.0} y={3.6} width={2.2} height={1.5} frame="#5b392f" canvas="#a8878f"
        motif={[{ x: -0.4, y: 0, w: 0.6, h: 0.6, color: "#c8a8b0" }]} />

      <group position={[-3.5, 0, -7.1]}>
        <mesh castShadow receiveShadow position={[0, 3.2, 0]}>
          <boxGeometry args={[3.8, 1.5, 0.55]} />
          <meshStandardMaterial color="#7d4a31" roughness={0.85} />
        </mesh>
        {[-0.95, 0.95].map((x) => (
          <group key={x} position={[x, 3.2, 0.3]}>
            <mesh castShadow>
              <boxGeometry args={[1.8, 1.3, 0.06]} />
              <meshStandardMaterial color="#8a5a3c" roughness={0.8} />
            </mesh>
            <mesh position={[x < 0 ? 0.78 : -0.78, 0, 0.06]}>
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshStandardMaterial color="#d9a45f" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        ))}
        <Mug position={[-1.3, 2.5, 0.28]} color="#d8c8a8" />
        <Mug position={[-1.0, 2.5, 0.28]} color="#c48a6a" />
      </group>

      <group position={[8.6, 0, -1.0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow position={[0, 3.2, 0]}>
          <boxGeometry args={[2.6, 0.1, 0.1]} />
          <meshStandardMaterial color="#d9a45f" metalness={0.5} roughness={0.4} />
        </mesh>
        {[-0.9, 0, 0.9].map((x, index) => (
          <group key={x} position={[x, 2.75, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.26 - index * 0.03, 0.24 - index * 0.03, 0.12, 14]} />
              <meshStandardMaterial color={index === 1 ? "#b8754b" : "#8f6a5a"} roughness={0.5} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.34, 0]}>
              <boxGeometry args={[0.05, 0.5, 0.05]} />
              <meshStandardMaterial color="#6d412c" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      <group position={[-5.0, 0, 6.9]}>
        <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
          <boxGeometry args={[2.6, 1.1, 0.7]} />
          <meshStandardMaterial color="#7d4a31" roughness={0.85} />
        </mesh>
        {[-0.65, 0.65].map((x) => (
          <mesh key={x} castShadow position={[x, 0.55, 0.37]}>
            <boxGeometry args={[1.15, 0.9, 0.05]} />
            <meshStandardMaterial color="#8a5a3c" roughness={0.8} />
          </mesh>
        ))}
        <Jar position={[-0.8, 1.28, 0]} color="#cbb089" height={0.36} />
        <Jar position={[-0.3, 1.22, 0.1]} color="#a8b083" height={0.24} />
        <Vase position={[0.6, 1.1, 0]} color="#b8734f" stems />
        <BookStack position={[1.0, 1.1, -0.05]} count={2} colors={["#c98a5e", "#8c5a42"]} />
      </group>

      <DecorativePlant position={[7.9, 0, 6.4]} scale={1.05} pot="#8f5a3d" leaf="#7b8a4e" />
      <CeilingLamp position={[2, 5.5, 0.5]} shade="#c98a5e" bulb="#ffe2ae" />
    </group>
  );
}

function Study({ skirting }: { skirting: string }) {
  return (
    <group>
      <Skirtings walls={["south", "west"]} color={skirting} />
      <Rug position={[-3.5, 0.02, -3.0]} size={[6, 5]} color="#5e4034" trim="#7d5641" />

      <Painting wall="south" along={-6.5} y={3.7} width={2.4} height={1.6} frame="#4d2f27" canvas="#6f7f8c"
        motif={[{ x: 0, y: 0, w: 1.5, h: 0.6, color: "#8fa3b0" }]} />
      <Painting wall="west" along={-1.5} y={3.7} width={3} height={2} frame="#5b392f" canvas="#8a5a42"
        motif={[{ x: -0.7, y: 0.2, w: 0.6, h: 1.1, color: "#b8825a" }, { x: 0.5, y: -0.1, w: 0.7, h: 0.8, color: "#6d412c" }]} />
      <Painting wall="east" along={-4.6} y={3.6} width={2.2} height={1.5} frame="#4d2f27" canvas="#7a8a6a"
        motif={[{ x: 0, y: 0, w: 1.3, h: 0.5, color: "#9aab86" }]} />
      <Painting wall="east" along={4.4} y={3.6} width={1.8} height={2.4} frame="#5b392f" canvas="#b0705a"
        motif={[{ x: 0, y: 0.2, w: 0.8, h: 1.2, color: "#d19279" }]} />
      <Painting wall="north" along={4.8} y={3.7} width={2.6} height={1.7} frame="#4d2f27" canvas="#c9a06a"
        motif={[{ x: 0, y: 0, w: 1.6, h: 0.7, color: "#e0bd85" }]} />

      <Chair position={[-4.5, 0, -5.1]} color="#6d412c" />
      <WallShelf position={[-8.5, 0, 2.0]} rotationY={Math.PI / 2} width={3.4} shelves={3} books={8} wood="#5d3a2c" />
      <WallShelf position={[8.5, 2.4, -4.6]} rotationY={-Math.PI / 2} width={2.4} shelves={2} books={4} wood="#5d3a2c" />

      <group position={[1.8, 0, 6.6]}>
        <mesh castShadow position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.3, 0.34, 0.1, 14]} />
          <meshStandardMaterial color="#5c3a2a" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh castShadow position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.1, 8]} />
          <meshStandardMaterial color="#d9a45f" roughness={0.4} metalness={0.5} />
        </mesh>
        <TableLamp position={[0, 1.14, 0]} shade="#b8754b" />
      </group>

      <CeilingLamp position={[-1, 5.5, -1]} shade="#a26748" bulb="#ffd9a0" glow={2} />
    </group>
  );
}

function ClockHall({ skirting }: { skirting: string }) {
  return (
    <group>
      <Skirtings walls={["south", "east"]} color={skirting} />
      <Rug position={[-0.5, 0.02, 2.0]} size={[3.4, 8]} color="#6b4030" trim="#8a5638" />
      {/* where the old spiral staircase stood */}
      <Rug position={[0, 0.03, 0]} size={[5.2, 5.2]} color="#7a4636" trim="#9c6242" />

      <Painting wall="east" along={-4.0} y={3.8} width={2.4} height={1.6} frame="#5b392f" canvas="#8d6bb0"
        motif={[{ x: 0, y: 0, w: 1.5, h: 0.6, color: "#ab8bcb" }]} />
      <Painting wall="east" along={4.8} y={3.7} width={1.8} height={2.2} frame="#4d2f27" canvas="#b8734f"
        motif={[{ x: 0, y: 0.2, w: 0.8, h: 1.1, color: "#d19279" }]} />
      <Painting wall="south" along={-6.5} y={3.8} width={2} height={2.4} frame="#4d2f27" canvas="#6f8a72"
        motif={[{ x: 0, y: 0, w: 0.9, h: 1.4, color: "#8fad90" }]} />
      <Painting wall="south" along={2.2} y={3.8} width={2.6} height={1.7} frame="#5b392f" canvas="#c98a5e"
        motif={[{ x: 0, y: 0, w: 1.6, h: 0.7, color: "#e2ac78" }]} />
      <Painting wall="west" along={-4.4} y={3.7} width={2.2} height={1.5} frame="#4d2f27" canvas="#7d8a6a"
        motif={[{ x: 0, y: 0, w: 1.3, h: 0.5, color: "#9aaa83" }]} />

      <WallShelf position={[-8.5, 0, 5.0]} rotationY={Math.PI / 2} width={2.6} shelves={2} books={5} wood="#5d3a2c" />

      <group position={[0, 0, 0]}>
        <mesh position={[0, WALL_HEIGHT - 0.06, 0]} receiveShadow>
          <boxGeometry args={[3.4, 0.12, 3.4]} />
          <meshStandardMaterial color="#5b3a2c" roughness={0.9} />
        </mesh>
        <mesh position={[0, WALL_HEIGHT - 0.12, 0]}>
          <boxGeometry args={[2.9, 0.08, 2.9]} />
          <meshStandardMaterial color="#e8b878" emissive="#d6a15e" emissiveIntensity={1.6} roughness={0.6} />
        </mesh>
      </group>

      <CeilingLamp position={[0, 5.5, 0]} shade="#a26748" bulb="#ffd9a0" />
    </group>
  );
}

export default function RoomDecor({ room }: { room: RoomConfig }) {
  switch (room.id) {
    case "living-room":
      return <LivingRoom skirting={room.skirting} />;
    case "kitchen":
      return <Kitchen skirting={room.skirting} />;
    case "study":
      return <Study skirting={room.skirting} />;
    default:
      return <ClockHall skirting={room.skirting} />;
  }
}
