"use client";

import ConceptLabel from "@/components/palace/ConceptLabel";
import { memo, useState, type ReactElement } from "react";
import type { Concept, PalaceObject } from "@/types/palace";

type InteractiveObjectProps = {
  object: PalaceObject;
  concept?: Concept;
  focused?: boolean;
  showLabel?: boolean;
};

const baseColor = "#d18a50";
const hoverColor = "#f6c56f";
const assignedColor = "#6fd3b0";
const darkWood = "#633a2e";
const wood = "#77432f";
const brass = "#d9a45f";

function Material({
  highlighted,
  assigned,
  color = baseColor,
}: {
  highlighted: boolean;
  assigned: boolean;
  color?: string;
}) {
  const active = highlighted || assigned;
  return (
    <meshStandardMaterial
      color={active ? (assigned ? assignedColor : hoverColor) : color}
      emissive={active ? (assigned ? "#1f8f72" : "#8f4d2e") : "#000000"}
      emissiveIntensity={active ? 0.65 : 0}
      roughness={0.72}
    />
  );
}

function StorageChest({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.5, 0]} {...props}>
        <boxGeometry args={[1.5, 0.8, 0.9]} />
        <Material highlighted={highlighted} assigned={assigned} color={wood} />
      </mesh>
      <mesh position={[0, 0.94, 0]} rotation={[0.1, 0, 0]} {...props}>
        <boxGeometry args={[1.56, 0.14, 0.96]} />
        <Material highlighted={highlighted} assigned={assigned} color="#8c4d37" />
      </mesh>
      <mesh position={[0, 1.03, 0]} {...props}>
        <boxGeometry args={[1.2, 0.06, 0.62]} />
        <meshStandardMaterial color={brass} metalness={0.5} roughness={0.42} />
      </mesh>
      {/* Plank seams. */}
      {[-0.45, -0.15, 0.15, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.5, 0.46]} {...props}>
          <boxGeometry args={[0.04, 0.72, 0.03]} />
          <meshStandardMaterial color="#5d3227" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.9, 0.49]} {...props}>
        <boxGeometry args={[0.2, 0.24, 0.05]} />
        <meshStandardMaterial color={brass} metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.84, 0.52]} {...props}>
        <torusGeometry args={[0.05, 0.018, 6, 12]} />
        <meshStandardMaterial color={brass} metalness={0.7} roughness={0.28} />
      </mesh>
      {[-0.58, 0.58].map((x) => (
        <group key={`strap-${x}`}>
          <mesh position={[x, 0.5, 0.47]} {...props}>
            <boxGeometry args={[0.09, 0.74, 0.04]} />
            <meshStandardMaterial color={brass} metalness={0.55} roughness={0.35} />
          </mesh>
          <mesh position={[x, 0.94, 0]} {...props}>
            <boxGeometry args={[0.09, 0.16, 0.98]} />
            <meshStandardMaterial color={brass} metalness={0.55} roughness={0.35} />
          </mesh>
        </group>
      ))}
      {[-0.58, 0.58].map((x) => (
        <mesh key={`foot-${x}`} position={[x, 0.06, 0]} {...props}>
          <boxGeometry args={[0.18, 0.12, 0.72]} />
          <meshStandardMaterial color={darkWood} roughness={0.85} />
        </mesh>
      ))}
    </>
  );
}

function RecipeBook({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.08, 0]} rotation={[0.08, 0, -0.08]} {...props}>
        <boxGeometry args={[1.3, 0.12, 0.88]} />
        <Material highlighted={highlighted} assigned={assigned} color="#6f3e35" />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[0.08, 0, -0.08]} {...props}>
        <boxGeometry args={[1.08, 0.025, 0.72]} />
        <meshStandardMaterial color="#f0bd78" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.17, 0]} rotation={[0.08, 0, -0.08]} {...props}>
        <boxGeometry args={[0.025, 0.03, 0.7]} />
        <meshStandardMaterial color="#9a6547" roughness={0.9} />
      </mesh>
      {[-0.28, 0.08, 0.4].map((x) => (
        <mesh key={x} position={[x, 0.18, -0.1]} rotation={[0.08, 0, -0.08]} {...props}>
          <boxGeometry args={[0.16, 0.015, 0.04]} />
          <meshStandardMaterial color="#bd754e" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0.52, 0.19, 0.12]} rotation={[0.08, 0, -0.08]} {...props}>
        <boxGeometry args={[0.08, 0.02, 0.42]} />
        <meshStandardMaterial color="#8c4d37" roughness={0.85} />
      </mesh>
    </>
  );
}

function Bookshelf({ highlighted, assigned, props }: ModelProps) {
  const upperBooks = ["#9e5b3f", "#d99a5d", "#6f3e35", "#c98a5e"];
  return (
    <>
      <mesh position={[0, 1.18, 0]} {...props}>
        <boxGeometry args={[1.7, 2.36, 0.35]} />
        <Material highlighted={highlighted} assigned={assigned} color={darkWood} />
      </mesh>
      {[-0.83, 0.83].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.18, -0.2]} {...props}>
            <boxGeometry args={[0.12, 2.36, 0.44]} />
            <Material highlighted={highlighted} assigned={assigned} color={wood} />
          </mesh>
          <mesh position={[x * 0.86, 2.44, -0.1]} {...props}>
            <boxGeometry args={[0.16, 0.18, 0.6]} />
            <Material highlighted={highlighted} assigned={assigned} color="#8c4d37" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.58, -0.1]} {...props}>
        <boxGeometry args={[1.86, 0.14, 0.56]} />
        <Material highlighted={highlighted} assigned={assigned} color="#8c4d37" />
      </mesh>
      {[0.28, 0.92, 1.56].map((height) => (
        <mesh key={height} position={[0, height, -0.23]} {...props}>
          <boxGeometry args={[1.5, 0.08, 0.34]} />
          <Material highlighted={highlighted} assigned={assigned} color={brass} />
        </mesh>
      ))}
      {[-0.48, -0.12, 0.25, 0.58].map((x, index) => (
        <mesh key={x} position={[x, 0.62, -0.44]} rotation={[0, 0, index % 2 ? -0.05 : 0]} {...props}>
          <boxGeometry args={[0.18, 0.52 + (index % 2) * 0.12, 0.12]} />
          <meshStandardMaterial color={["#d18a50", "#8c5a42", "#b8754b", "#e2b779"][index]} roughness={0.8} />
        </mesh>
      ))}
      {[-0.42, -0.05, 0.34].map((x, index) => (
        <mesh key={x} position={[x, 1.27, -0.44]} rotation={[0, 0, index === 1 ? 0.04 : -0.03]} {...props}>
          <boxGeometry args={[0.2, 0.48, 0.12]} />
          <meshStandardMaterial color={upperBooks[index]} roughness={0.8} />
        </mesh>
      ))}
      {[-0.5, -0.2, 0.15, 0.45].map((x, index) => (
        <mesh key={`top-${x}`} position={[x, 1.95, -0.44]} rotation={[0, 0, index % 2 ? 0.06 : -0.02]} {...props}>
          <boxGeometry args={[0.19, 0.6 - (index % 2) * 0.1, 0.12]} />
          <meshStandardMaterial color={["#c98a5e", "#8c5a42", "#e2b779", "#a65b3d"][index]} roughness={0.8} />
        </mesh>
      ))}
    </>
  );
}

function NestedMirror({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 1.3, 0]} {...props}>
        <boxGeometry args={[1.35, 1.8, 0.14]} />
        <Material highlighted={highlighted} assigned={assigned} color="#6e3f35" />
      </mesh>
      <mesh position={[0, 1.3, -0.09]} {...props}>
        <boxGeometry args={[1.16, 1.6, 0.04]} />
        <meshStandardMaterial color={brass} metalness={0.55} roughness={0.42} />
      </mesh>
      <mesh position={[0, 1.3, -0.1]} {...props}>
        <boxGeometry args={[0.95, 1.4, 0.03]} />
        <meshStandardMaterial
          color={highlighted ? "#fff0bc" : "#b8a27f"}
          metalness={0.3}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0, 1.3, -0.13]} scale={0.7} {...props}>
        <boxGeometry args={[0.95, 1.4, 0.03]} />
        <meshStandardMaterial
          color="#ead29c"
          emissive="#8f6847"
          emissiveIntensity={0.3}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 1.3, -0.16]} scale={0.42} {...props}>
        <boxGeometry args={[0.95, 1.4, 0.03]} />
        <meshStandardMaterial
          color="#f2e2b6"
          emissive="#a07c52"
          emissiveIntensity={0.45}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.09, 0.05]} {...props}>
        <boxGeometry args={[0.9, 0.18, 0.5]} />
        <meshStandardMaterial color={wood} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.2, 0.05]} {...props}>
        <boxGeometry args={[1.02, 0.08, 0.58]} />
        <meshStandardMaterial color={darkWood} roughness={0.8} />
      </mesh>
    </>
  );
}

function StudyDesk({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.88, 0]} {...props}>
        <boxGeometry args={[1.9, 0.14, 0.95]} />
        <Material highlighted={highlighted} assigned={assigned} color={wood} />
      </mesh>
      <mesh position={[0, 0.7, 0.42]} {...props}>
        <boxGeometry args={[1.7, 0.22, 0.12]} />
        <meshStandardMaterial color={darkWood} roughness={0.85} />
      </mesh>
      {[-0.75, 0.75].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.4, 0]} {...props}>
            <boxGeometry args={[0.14, 0.8, 0.76]} />
            <meshStandardMaterial color={darkWood} roughness={0.85} />
          </mesh>
          {[-0.2, 0.2].map((z) => (
            <mesh key={z} position={[x, 0.6, z]} {...props}>
              <boxGeometry args={[0.17, 0.24, 0.2]} />
              <meshStandardMaterial color="#6d412c" roughness={0.8} />
            </mesh>
          ))}
          {[-0.2, 0.2].map((z) => (
            <mesh key={`pull-${z}`} position={[x, 0.6, z * 1.6]} {...props}>
              <boxGeometry args={[0.08, 0.05, 0.05]} />
              <meshStandardMaterial color={brass} metalness={0.6} roughness={0.32} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0.25, 0.99, -0.2]} rotation={[0, 0, -0.08]} {...props}>
        <boxGeometry args={[0.3, 0.05, 0.22]} />
        <meshStandardMaterial color="#b8754b" roughness={0.8} />
      </mesh>
      <mesh position={[0.25, 1.04, -0.2]} rotation={[0, 0, -0.04]} {...props}>
        <boxGeometry args={[0.28, 0.05, 0.2]} />
        <meshStandardMaterial color="#e2b779" roughness={0.8} />
      </mesh>
      <mesh position={[0.62, 1.0, 0.1]} rotation={[0.4, 0, 0.5]} {...props}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
        <meshStandardMaterial color={brass} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-0.55, 0.98, 0.2]} {...props}>
        <cylinderGeometry args={[0.11, 0.1, 0.08, 12]} />
        <meshStandardMaterial color="#4a3b33" roughness={0.6} />
      </mesh>
      <mesh position={[-0.5, 1.05, 0.26]} {...props}>
        <cylinderGeometry args={[0.1, 0.08, 0.18, 12]} />
        <meshStandardMaterial color="#cfd8c4" roughness={0.6} />
      </mesh>
      {[
        [-0.1, 0.965, 0.28],
        [-0.06, 0.977, 0.26],
        [-0.13, 0.989, 0.24],
      ].map(([x, y, z], index) => (
        <mesh key={`sheet-${index}`} position={[x, y, z]} rotation={[0, index * 0.09, 0]} {...props}>
          <boxGeometry args={[0.44, 0.012, 0.32]} />
          <meshStandardMaterial color={index % 2 ? "#efe4cd" : "#e2d5ba"} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0.78, 1.04, -0.12]} {...props}>
        <cylinderGeometry args={[0.11, 0.09, 0.2, 10]} />
        <meshStandardMaterial color="#8a5a3c" roughness={0.6} />
      </mesh>
      {[
        [0.76, 1.24, -0.12],
        [0.82, 1.26, -0.1],
      ].map(([x, y, z], index) => (
        <mesh key={`pen-${index}`} position={[x, y, z]} rotation={[0, 0, index * 0.22 - 0.11]} {...props}>
          <cylinderGeometry args={[0.012, 0.012, 0.24, 5]} />
          <meshStandardMaterial color={index ? "#3d2a20" : "#c9a06a"} roughness={0.8} />
        </mesh>
      ))}
      <group position={[-1.12, 0, 0]}>
        <mesh position={[0, 0.5, 0]} {...props}>
          <boxGeometry args={[0.74, 0.1, 0.74]} />
          <Material highlighted={highlighted} assigned={assigned} color={wood} />
        </mesh>
        <mesh position={[0, 0.25, 0]} {...props}>
          <boxGeometry args={[0.24, 0.5, 0.24]} />
          <meshStandardMaterial color={darkWood} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.92, 0]} {...props}>
          <cylinderGeometry args={[0.06, 0.06, 0.74, 8]} />
          <meshStandardMaterial color={brass} metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.36, 0]} {...props}>
          <coneGeometry args={[0.26, 0.34, 12, 1, true]} />
          <meshStandardMaterial color="#b8754b" roughness={0.7} side={2} />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial color="#ffe0a8" emissive="#ffcf87" emissiveIntensity={1.8} roughness={0.4} />
        </mesh>
      </group>
    </>
  );
}

function PottedPlant({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.34, 0]} {...props}>
        <cylinderGeometry args={[0.36, 0.28, 0.56, 14]} />
        <Material highlighted={highlighted} assigned={assigned} color="#a65b3d" />
      </mesh>
      <mesh position={[0, 0.64, 0]} {...props}>
        <torusGeometry args={[0.3, 0.045, 6, 16]} />
        <meshStandardMaterial color="#d99a5d" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.12, 0]} {...props}>
        <sphereGeometry args={[0.62, 14, 10]} />
        <meshStandardMaterial color={highlighted ? "#b7c86c" : "#71804b"} roughness={0.85} />
      </mesh>
      {[
        [0.4, 1.36, 0.1],
        [-0.36, 1.28, -0.12],
        [0.08, 1.52, -0.2],
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]} scale={[0.32, 0.7, 0.18]} {...props}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={highlighted ? "#c4d978" : "#84975a"} roughness={0.85} />
        </mesh>
      ))}
    </>
  );
}

function WallClock({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]} {...props}>
        <cylinderGeometry args={[0.6, 0.6, 0.18, 24]} />
        <Material highlighted={highlighted} assigned={assigned} color={darkWood} />
      </mesh>
      <mesh position={[0, 0.8, -0.11]} rotation={[Math.PI / 2, 0, 0]} {...props}>
        <torusGeometry args={[0.52, 0.045, 8, 24]} />
        <meshStandardMaterial color={brass} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.8, -0.1]} rotation={[Math.PI / 2, 0, 0]} {...props}>
        <cylinderGeometry args={[0.46, 0.46, 0.03, 24]} />
        <meshStandardMaterial color={highlighted ? "#fff0bc" : "#e2b779"} roughness={0.55} />
      </mesh>
      {[0, 1, 2, 3].map((index) => (
        <mesh
          key={index}
          position={[
            Math.cos((index * Math.PI) / 2) * 0.36,
            0.8 + Math.sin((index * Math.PI) / 2) * 0.36,
            -0.13,
          ]}
          {...props}
        >
          <boxGeometry args={[0.05, 0.05, 0.02]} />
          <meshStandardMaterial color={darkWood} />
        </mesh>
      ))}
      <mesh position={[0, 0.94, -0.14]} {...props}>
        <boxGeometry args={[0.04, 0.34, 0.03]} />
        <meshStandardMaterial color={darkWood} />
      </mesh>
      <mesh position={[0.12, 0.85, -0.15]} rotation={[0, 0, -0.8]} {...props}>
        <boxGeometry args={[0.035, 0.26, 0.03]} />
        <meshStandardMaterial color={darkWood} />
      </mesh>
      <mesh position={[0, 0.8, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.04, 10]} />
        <meshStandardMaterial color={brass} metalness={0.6} roughness={0.3} />
      </mesh>
    </>
  );
}


function CoffeeTable({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.52, 0]} {...props}>
        <boxGeometry args={[3.2, 0.14, 1.5]} />
        <Material highlighted={highlighted} assigned={assigned} color="#70402f" />
      </mesh>
      <mesh position={[0, 0.38, 0]} {...props}>
        <boxGeometry args={[2.9, 0.16, 1.24]} />
        <meshStandardMaterial color="#633a2e" roughness={0.85} />
      </mesh>
      {[
        [-1.4, -0.6],
        [1.4, -0.6],
        [-1.4, 0.6],
        [1.4, 0.6],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, 0.24, z]} {...props}>
          <boxGeometry args={[0.14, 0.48, 0.14]} />
          <meshStandardMaterial color="#5d3a2c" roughness={0.9} />
        </mesh>
      ))}
      {/* surface clutter so the top never reads empty */}
      {[
        [-1.0, 0.6, 0],
        [-1.0, 0.66, 0],
        [-0.92, 0.72, 0.02],
      ].map(([x, y, z], index) => (
        <mesh key={`book-${index}`} position={[x, y, z]} rotation={[0, index * 0.16, 0]} {...props}>
          <boxGeometry args={[0.52 - index * 0.05, 0.06, 0.38 - index * 0.02]} />
          <meshStandardMaterial color={["#d18a50", "#8c5a42", "#e2b779"][index]} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[1.15, 0.66, -0.32]} {...props}>
        <cylinderGeometry args={[0.1, 0.08, 0.16, 12]} />
        <meshStandardMaterial color="#e7ddc9" roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 0.63, 0.4]} {...props}>
        <cylinderGeometry args={[0.24, 0.19, 0.08, 14]} />
        <meshStandardMaterial color="#b8754b" roughness={0.5} />
      </mesh>
      {(
        [
          [0.3, 0.72, 0.44, "#c85f3c"],
          [0.44, 0.7, 0.32, "#d8a13f"],
        ] as [number, number, number, string][]
      ).map(([x, y, z, color], index) => (
        <mesh key={`fruit-${index}`} position={[x, y, z]} {...props}>
          <sphereGeometry args={[0.1, 10, 8]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[-0.4, 0.6, -0.45]} {...props}>
        <boxGeometry args={[0.44, 0.02, 0.32]} />
        <meshStandardMaterial color="#efe4cd" roughness={0.95} />
      </mesh>
    </>
  );
}

function Sofa({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.3, 0]} {...props}>
        <boxGeometry args={[1.4, 0.5, 3.4]} />
        <Material highlighted={highlighted} assigned={assigned} color="#7a4034" />
      </mesh>
      <mesh position={[-0.62, 0.85, 0]} {...props}>
        <boxGeometry args={[0.24, 1.1, 3.4]} />
        <Material highlighted={highlighted} assigned={assigned} color="#6d352b" />
      </mesh>
      {[-1.6, 0, 1.6].map((z) => (
        <mesh key={z} position={[0.1, 0.62, z]} {...props}>
          <boxGeometry args={[1.2, 0.22, 0.95]} />
          <meshStandardMaterial color="#a75f45" roughness={0.9} />
        </mesh>
      ))}
      {[-1.62, 1.62].map((z) => (
        <mesh key={`arm-${z}`} position={[0, 0.7, z]} {...props}>
          <boxGeometry args={[1.3, 0.36, 0.22]} />
          <meshStandardMaterial color="#6d352b" roughness={0.9} />
        </mesh>
      ))}
      {[-1.1, 1.1].map((z) => (
        <mesh key={`leg-${z}`} position={[0, 0.06, z]} {...props}>
          <boxGeometry args={[1.2, 0.12, 0.12]} />
          <meshStandardMaterial color={darkWood} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0.1, 0.78, -1.1]} rotation={[0, 0.2, 0]} {...props}>
        <boxGeometry args={[0.44, 0.06, 0.34]} />
        <meshStandardMaterial color="#c98a5e" roughness={0.85} />
      </mesh>
    </>
  );
}

function KitchenCounter({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.45, 0]} {...props}>
        <boxGeometry args={[3.4, 0.9, 1.6]} />
        <Material highlighted={highlighted} assigned={assigned} color="#7d4a31" />
      </mesh>
      <mesh position={[0, 0.95, 0]} {...props}>
        <boxGeometry args={[3.6, 0.16, 1.8]} />
        <meshStandardMaterial color="#8a5a3c" roughness={0.6} />
      </mesh>
      {[-0.85, 0.85].map((x) => (
        <group key={x} position={[x, 0.45, 0.82]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 0.72, 0.06]} />
            <meshStandardMaterial color="#6d412c" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.08, 0.3, 0.05]} />
            <meshStandardMaterial color={brass} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {[-1.6, -1.0].map((x, index) => (
        <mesh key={x} position={[x, 1.14, 0.5]} {...props}>
          <cylinderGeometry args={[0.24, 0.19, 0.22 + index * 0.06, 14]} />
          <meshStandardMaterial color={index ? "#c98a5e" : "#b8754b"} roughness={0.5} metalness={0.25} />
        </mesh>
      ))}
      <mesh position={[-0.15, 1.16, 0.5]} rotation={[Math.PI / 2, 0, 0]} {...props}>
        <torusGeometry args={[0.2, 0.035, 6, 14]} />
        <meshStandardMaterial color={brass} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0.1, 1.05, -0.6]} rotation={[0, -0.3, 0]} {...props}>
        <boxGeometry args={[0.7, 0.04, 0.28]} />
        <meshStandardMaterial color="#c9a06a" roughness={0.85} />
      </mesh>
      <mesh position={[1.3, 1.24, 0.3]} {...props}>
        <cylinderGeometry args={[0.16, 0.14, 0.42, 12]} />
        <meshStandardMaterial color="#cbb089" roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh position={[1.0, 1.18, 0.6]} {...props}>
        <cylinderGeometry args={[0.16, 0.14, 0.3, 12]} />
        <meshStandardMaterial color="#a8b083" roughness={0.35} metalness={0.1} />
      </mesh>
    </>
  );
}

function DiningSet({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.78, 0]} {...props}>
        <boxGeometry args={[2.8, 0.14, 1.6]} />
        <Material highlighted={highlighted} assigned={assigned} color="#70402f" />
      </mesh>
      {[
        [-1.2, -0.6],
        [1.2, -0.6],
        [-1.2, 0.6],
        [1.2, 0.6],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, 0.37, z]} {...props}>
          <boxGeometry args={[0.16, 0.74, 0.16]} />
          <meshStandardMaterial color="#5d3a2c" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.86, 0]} {...props}>
        <cylinderGeometry args={[0.36, 0.22, 0.16, 16]} />
        <meshStandardMaterial color="#b8754b" roughness={0.5} />
      </mesh>
      {(
        [
          [0.12, 0.99, 0.04, "#c85f3c"],
          [-0.12, 1.0, -0.06, "#d8a13f"],
          [0.0, 1.04, -0.12, "#8a9a44"],
        ] as [number, number, number, string][]
      ).map(([x, y, z, color], index) => (
        <mesh key={index} position={[x, y, z]} {...props}>
          <sphereGeometry args={[0.11, 10, 8]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
      {[
        [-1.05, 0.9, -0.42],
        [1.1, 0.9, 0.36],
      ].map(([x, y, z], index) => (
        <group key={index} position={[x, y, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.08, 0.18, 12]} />
            <meshStandardMaterial color={index ? "#d8b48a" : "#e7ddc9"} roughness={0.6} />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.05, 0.018, 6, 12]} />
            <meshStandardMaterial color={index ? "#d8b48a" : "#e7ddc9"} roughness={0.6} />
          </mesh>
        </group>
      ))}
      {[
        [-2.3, 1.6, 0.9],
        [2.3, -1.6, -0.9],
      ].map(([x, z, rot], index) => (
        <group key={index} position={[x, 0, z]} rotation={[0, rot, 0]}>
          <mesh position={[0, 0.46, 0]} {...props}>
            <boxGeometry args={[0.9, 0.12, 0.9]} />
            <meshStandardMaterial color="#8a4f38" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.9, -0.38]} {...props}>
            <boxGeometry args={[0.9, 0.8, 0.12]} />
            <meshStandardMaterial color="#8a4f38" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.58, 0]} {...props}>
            <boxGeometry args={[0.8, 0.16, 0.8]} />
            <meshStandardMaterial color="#a75f45" roughness={0.9} />
          </mesh>
          {[
            [-0.34, -0.34],
            [0.34, -0.34],
            [-0.34, 0.34],
            [0.34, 0.34],
          ].map(([lx, lz], leg) => (
            <mesh key={leg} position={[lx, 0.22, lz]} {...props}>
              <boxGeometry args={[0.1, 0.44, 0.1]} />
              <meshStandardMaterial color="#5d3a2c" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

function Sideboard({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.5, 0]} {...props}>
        <boxGeometry args={[2.8, 1.0, 0.8]} />
        <Material highlighted={highlighted} assigned={assigned} color="#6d412c" />
      </mesh>
      <mesh position={[0, 1.04, 0]} {...props}>
        <boxGeometry args={[2.94, 0.08, 0.9]} />
        <meshStandardMaterial color="#7d4a31" roughness={0.8} />
      </mesh>
      {[-0.7, 0.7].map((x) => (
        <group key={x} position={[x, 0.5, 0.42]}>
          <mesh castShadow>
            <boxGeometry args={[1.25, 0.82, 0.05]} />
            <meshStandardMaterial color="#7d4a31" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[0.07, 0.26, 0.05]} />
            <meshStandardMaterial color={brass} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 0.06, 0.3]} {...props}>
          <boxGeometry args={[0.14, 0.12, 0.14]} />
          <meshStandardMaterial color={darkWood} roughness={0.9} />
        </mesh>
      ))}
      {(
        [
          [0.62, 1.11, 0.05, "#8c5a42"],
          [0.62, 1.17, 0.05, "#d18a50"],
          [0.68, 1.23, 0.07, "#e2b779"],
        ] as [number, number, number, string][]
      ).map(([x, y, z, color], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0, index * 0.14, 0]} {...props}>
          <boxGeometry args={[0.48 - index * 0.04, 0.06, 0.34 - index * 0.02]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[1.2, 1.22, -0.05]} {...props}>
        <cylinderGeometry args={[0.13, 0.19, 0.36, 12]} />
        <meshStandardMaterial color="#8f7a5a" roughness={0.45} metalness={0.15} />
      </mesh>
    </>
  );
}

function Globe({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.06, 0]} {...props}>
        <cylinderGeometry args={[0.26, 0.3, 0.12, 14]} />
        <Material highlighted={highlighted} assigned={assigned} color={darkWood} />
      </mesh>
      <mesh position={[0, 0.14, 0]} {...props}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color={brass} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.62, 0]} {...props}>
        <sphereGeometry args={[0.32, 16, 12]} />
        <Material highlighted={highlighted} assigned={assigned} color="#6f8fa0" />
      </mesh>
      {(
        [
          [0.14, 0.72, 0.2],
          [-0.16, 0.58, 0.18],
          [0.02, 0.44, -0.28],
        ] as [number, number, number][]
      ).map((position, index) => (
        <mesh key={index} position={position} {...props}>
          <sphereGeometry args={[0.12, 10, 8]} />
          <meshStandardMaterial color={index === 1 ? "#8fae86" : "#7d9c72"} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.62, 0]} rotation={[0, 0.4, 0.35]} {...props}>
        <torusGeometry args={[0.36, 0.028, 8, 24]} />
        <meshStandardMaterial color={brass} metalness={0.5} roughness={0.4} />
      </mesh>
    </>
  );
}

function DecorativePlant({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.34, 0]} {...props}>
        <cylinderGeometry args={[0.32, 0.26, 0.68, 14]} />
        <Material highlighted={highlighted} assigned={assigned} color="#8f5a3d" />
      </mesh>
      <mesh position={[0, 0.66, 0]} {...props}>
        <torusGeometry args={[0.27, 0.04, 6, 16]} />
        <meshStandardMaterial color="#d99a5d" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.16, 0]} {...props}>
        <sphereGeometry args={[0.58, 14, 10]} />
        <meshStandardMaterial color={highlighted ? "#b7c86c" : "#6d7d47"} roughness={0.9} />
      </mesh>
      {[
        [0.4, 1.36, 0.1],
        [-0.36, 1.3, -0.12],
        [0.08, 1.54, -0.18],
      ].map((position, index) => (
        <mesh
          key={index}
          position={position as [number, number, number]}
          scale={[0.3, 0.66, 0.17]}
          {...props}
        >
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={highlighted ? "#c4d978" : "#84975a"} roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

function TieredStand({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.08, 0]} {...props}>
        <cylinderGeometry args={[0.95, 0.95, 0.16, 20]} />
        <Material highlighted={highlighted} assigned={assigned} color="#70402f" />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[0, 0.24 + index * 0.3, 0]} {...props}>
          <cylinderGeometry args={[0.66 - index * 0.08, 0.7 - index * 0.08, 0.14, 16]} />
          <meshStandardMaterial
            color={highlighted ? hoverColor : index === 1 ? "#c98a5e" : "#b8754b"}
            roughness={0.7}
          />
        </mesh>
      ))}
      {/* eight markers echoing the eight stages of a cycle */}
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.78, 0.2, Math.sin(angle) * 0.78]}
            {...props}
          >
            <cylinderGeometry args={[0.07, 0.07, 0.1, 8]} />
            <meshStandardMaterial
              color={highlighted ? hoverColor : brass}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        );
      })}
      <mesh position={[0, 0.9, 0]} {...props}>
        <cylinderGeometry args={[0.15, 0.2, 0.4, 12]} />
        <meshStandardMaterial color="#b8734f" roughness={0.45} metalness={0.15} />
      </mesh>
      {[
        [-0.09, 1.28, 0.04],
        [0.07, 1.36, -0.05],
        [0.0, 1.21, 0.1],
      ].map((stem, index) => (
        <mesh key={index} position={stem as [number, number, number]} rotation={[0, 0, index * 0.3 - 0.3]} {...props}>
          <cylinderGeometry args={[0.015, 0.015, 0.42, 5]} />
          <meshStandardMaterial color="#6f8a4b" roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

function ConsoleTable({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.95, 0]} {...props}>
        <boxGeometry args={[2.4, 0.12, 0.7]} />
        <Material highlighted={highlighted} assigned={assigned} color="#70402f" />
      </mesh>
      <mesh position={[0, 0.62, 0]} {...props}>
        <boxGeometry args={[2.1, 0.1, 0.5]} />
        <meshStandardMaterial color="#5d3a2c" roughness={0.85} />
      </mesh>
      {[
        [-1.0, -0.24],
        [1.0, -0.24],
        [-1.0, 0.24],
        [1.0, 0.24],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, 0.46, z]} {...props}>
          <boxGeometry args={[0.12, 0.92, 0.12]} />
          <meshStandardMaterial color="#5d3a2c" roughness={0.9} />
        </mesh>
      ))}
      <group position={[-0.7, 1.01, 0]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.06, 12]} />
          <meshStandardMaterial color="#5c3a2a" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.62, 8]} />
          <meshStandardMaterial color={brass} metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.76, 0]}>
          <coneGeometry args={[0.3, 0.42, 14, 1, true]} />
          <meshStandardMaterial color={highlighted ? hoverColor : "#a26748"} roughness={0.7} side={2} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.11, 10, 8]} />
          <meshStandardMaterial color="#ffe0a8" emissive="#ffcf87" emissiveIntensity={1.6} roughness={0.4} />
        </mesh>
      </group>
      {(
        [
          [0.3, 1.05, 0],
          [0.3, 1.11, 0],
        ] as [number, number, number][]
      ).map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0, index * 0.15, 0]} {...props}>
          <boxGeometry args={[0.46 - index * 0.04, 0.06, 0.32]} />
          <meshStandardMaterial color={["#c98a5e", "#8c5a42"][index]} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0.95, 1.19, 0]} {...props}>
        <cylinderGeometry args={[0.13, 0.18, 0.36, 12]} />
        <meshStandardMaterial color="#8f7a5a" roughness={0.45} metalness={0.15} />
      </mesh>
    </>
  );
}

function Bench({ highlighted, assigned, props }: ModelProps) {
  return (
    <>
      <mesh position={[0, 0.25, 0]} {...props}>
        <boxGeometry args={[2.6, 0.5, 0.8]} />
        <Material highlighted={highlighted} assigned={assigned} color="#70402f" />
      </mesh>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.58, 0]} {...props}>
          <boxGeometry args={[1.1, 0.16, 0.7]} />
          <meshStandardMaterial color={highlighted ? hoverColor : "#9a5a3d"} roughness={0.9} />
        </mesh>
      ))}
      {[
        [-1.1, 0.08, 0.3],
        [1.1, 0.08, 0.3],
      ].map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]} {...props}>
          <boxGeometry args={[0.16, 0.16, 0.6]} />
          <meshStandardMaterial color={darkWood} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0.5, 0.71, 0]} rotation={[0, 0.2, 0]} {...props}>
        <boxGeometry args={[0.44, 0.06, 0.34]} />
        <meshStandardMaterial color="#c98a5e" roughness={0.85} />
      </mesh>
      <mesh position={[-0.7, 0.71, 0.05]} {...props}>
        <cylinderGeometry args={[0.1, 0.08, 0.18, 12]} />
        <meshStandardMaterial color="#e7ddc9" roughness={0.6} />
      </mesh>
    </>
  );
}

type ModelProps = {
  highlighted: boolean;
  assigned: boolean;
  props: {
    castShadow: boolean;
    receiveShadow: boolean;
    onPointerOver: () => void;
    onPointerOut: () => void;
  };
};

const models: Record<string, (props: ModelProps) => ReactElement> = {
  "storage-chest": StorageChest,
  "kitchen-recipe-book": RecipeBook,
  bookshelf: Bookshelf,
  mirror: NestedMirror,
  desk: StudyDesk,
  "living-room-plant": PottedPlant,
  "staircase-clock": WallClock,
  "coffee-table": CoffeeTable,
  sofa: Sofa,
  "kitchen-counter": KitchenCounter,
  "dining-set": DiningSet,
  sideboard: Sideboard,
  globe: Globe,
  "study-plant": DecorativePlant,
  "tiered-stand": TieredStand,
  "console-table": ConsoleTable,
  "hall-bench": Bench,
  "hall-plant": DecorativePlant,
};

function InteractiveObject({
  object,
  concept,
  focused = false,
  showLabel = true,
}: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false);
  const highlighted = hovered || focused;
  const assigned = Boolean(concept);
  const Model = models[object.id];
  const props = {
    castShadow: true,
    receiveShadow: true,
    onPointerOver: () => setHovered(true),
    onPointerOut: () => setHovered(false),
  };

  return (
    <group
      position={object.position}
      scale={(object.scale ?? 1) * (highlighted ? 1.05 : 1)}
      {...props}
    >
      {Model ? <Model highlighted={highlighted} assigned={assigned} props={props} /> : null}

      {concept && showLabel && (
        <ConceptLabel title={concept.title} height={object.labelHeight ?? 2.4} />
      )}
    </group>
  );
}

export default memo(InteractiveObject);
