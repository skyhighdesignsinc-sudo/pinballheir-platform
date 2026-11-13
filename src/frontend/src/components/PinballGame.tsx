/**
 * PinballGame.tsx
 * Full Three.js + @react-three/cannon pinball engine.
 *
 * COORDINATE SYSTEM:
 *   - Table runs along Z axis: top = z ≈ +TABLE_H/2, drain = z ≈ -TABLE_H/2
 *   - Camera positioned at [0, 20, 18] looking at [0, 0, -3] so drain appears at BOTTOM of screen
 *   - Ball launches from plunger lane (right side, z near top) toward top, enters playfield
 *   - Flippers rotate on Y-axis (in the XZ plane) to scoop ball upward
 */

import {
  Physics,
  useBox,
  useCylinder,
  usePlane,
  useSphere,
} from "@react-three/cannon";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import type { PinballTable } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GameCallbacks {
  onScoreChange: (score: number, combo: number, multiplier: number) => void;
  onBallsChange: (balls: number) => void;
  onBallNearDrain: () => void;
  onDrain: () => void;
  onGameOver: (score: number, movesJson: string, replayHash: string) => void;
  onBumperHit: () => void;
  onTilt: () => void;
  onGoldenBall: () => void;
  onFlipperLeft: (down: boolean) => void;
  onFlipperRight: (down: boolean) => void;
  registerFlipperCallbacks: (cbs: {
    leftDown?: () => void;
    leftUp?: () => void;
    rightDown?: () => void;
    rightUp?: () => void;
    nudge?: () => void;
  }) => void;
}

interface MoveEvent {
  timestamp: number;
  action: "leftDown" | "leftUp" | "rightDown" | "rightUp" | "nudge" | "drain";
}

interface BumperDef {
  position: [number, number, number];
  color: string;
}

interface GamePhysicsConfig {
  gravity: number;
  friction: number;
  rebound: number;
  flipperStrength: number;
  tiltSensitivity: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABLE_W = 4;
const TABLE_H = 14;
const BALL_R = 0.18;
// DRAIN at z = -(TABLE_H/2 - 0.5) = -6.5
const DRAIN_Z = -(TABLE_H / 2 - 0.5);
// Near-drain warning zone
const NEAR_DRAIN_Z = DRAIN_Z + 2.0;
// Ball spawns at TOP of table in plunger lane
const SPAWN_X = TABLE_W / 2 - 0.35;
const SPAWN_Z = TABLE_H / 2 - 1.5; // near top
const BUMPER_R = 0.38;
const FLIPPER_LEN = 1.6;
// Spawn protection duration (ms)
const SPAWN_PROTECTION_MS = 1500;

// Bumpers in the playfield (mid-section, positive Z area)
const BUMPER_DEFS: BumperDef[] = [
  { position: [-1.0, 0.3, 2.0], color: "#ff0077" },
  { position: [1.0, 0.3, 2.0], color: "#ff0077" },
  { position: [0, 0.3, 0.8], color: "#ff7700" },
  { position: [-1.3, 0.3, -0.5], color: "#00ffcc" },
  { position: [1.3, 0.3, -0.5], color: "#00ffcc" },
  { position: [0, 0.3, -2.0], color: "#cc00ff" },
];

// ─── Dev logging ──────────────────────────────────────────────────────────────

const DEV = import.meta.env.DEV;

function devLog(...args: unknown[]) {
  if (DEV) console.log("[Pinball]", ...args);
}

// ─── Flipper ──────────────────────────────────────────────────────────────────
// Flippers sit just above the drain, near z = DRAIN_Z + 1.8
// They rotate on the Y-axis to scoop ball in the XZ plane.
// Left flipper: base at left wall (-x), tip points right (+x).
//   At rest, tip angled slightly toward drain (-z). On press, tip rises toward center (+z).
// Right flipper: base at right wall (+x), tip points left (-x).
//   Mirror of left.
//
// Rotation on Y-axis (turning in horizontal plane):
//   Left:  rest = +0.4 rad (tip angled toward drain), active = -0.6 rad (tip toward center)
//   Right: rest = -0.4 rad, active = +0.6 rad

function Flipper({
  isLeft,
  forceRef,
  onActivate,
}: {
  isLeft: boolean;
  forceRef: React.MutableRefObject<boolean>;
  onActivate?: (active: boolean) => void;
}) {
  // Flipper center positioned so base is near the wall and tip extends inward
  // Center is at half FLIPPER_LEN from the base
  const baseX = isLeft ? -TABLE_W / 2 + 0.2 : TABLE_W / 2 - 0.2;
  const tipOffsetX = isLeft ? FLIPPER_LEN / 2 : -FLIPPER_LEN / 2;
  const xPos = baseX + tipOffsetX;
  const zPos = DRAIN_Z + 1.8;

  // Y rotation: positive = counterclockwise from above
  // Left flipper at rest points toward drain (tip at -z relative to base)
  // When active, tip swings toward center-top
  const baseAngleY = isLeft ? 0.4 : -0.4;
  const activeAngleY = isLeft ? -0.6 : 0.6;

  const [ref, api] = useBox(() => ({
    mass: 0,
    type: "Kinematic",
    position: [xPos, 0.3, zPos],
    args: [FLIPPER_LEN, 0.22, 0.28],
    rotation: [0, baseAngleY, 0],
  }));

  const prevActive = useRef(false);

  useFrame(() => {
    const active = forceRef.current;
    if (active !== prevActive.current) {
      prevActive.current = active;
      const angle = active ? activeAngleY : baseAngleY;
      api.rotation.set(0, angle, 0);
      if (DEV) {
        devLog(
          `FLIPPER ${isLeft ? "LEFT" : "RIGHT"} ${active ? "UP" : "DOWN"}: yAngle=${angle.toFixed(2)}`,
        );
      }
      onActivate?.(active);
    }
  });

  return (
    <mesh ref={ref as React.RefObject<THREE.Mesh>} castShadow>
      <boxGeometry args={[FLIPPER_LEN, 0.22, 0.28]} />
      <meshStandardMaterial
        color={isLeft ? "#00e5ff" : "#ae00ff"}
        emissive={isLeft ? "#00e5ff" : "#ae00ff"}
        emissiveIntensity={forceRef.current ? 0.9 : 0.25}
        metalness={0.7}
        roughness={0.15}
      />
    </mesh>
  );
}

// ─── Bumper ───────────────────────────────────────────────────────────────────

function Bumper({
  position,
  color,
  bumperIndex,
  onHit,
}: {
  position: [number, number, number];
  color: string;
  bumperIndex: number;
  onHit: (index: number) => void;
}) {
  const [lit, setLit] = useState(false);
  const lightRef = useRef<THREE.PointLight>(null);

  const handleHit = useCallback(() => {
    setLit(true);
    onHit(bumperIndex);
    setTimeout(() => setLit(false), 180);
  }, [onHit, bumperIndex]);

  const [ref] = useCylinder(() => ({
    mass: 0,
    type: "Static",
    position,
    args: [BUMPER_R, BUMPER_R, 0.45, 16],
    material: { restitution: 1.6, friction: 0.05 },
    onCollide: handleHit,
  }));

  return (
    <group position={position}>
      <mesh ref={ref as React.RefObject<THREE.Mesh>} castShadow>
        <cylinderGeometry args={[BUMPER_R, BUMPER_R, 0.45, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={lit ? 1.2 : 0.4}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      {/* Glow ring */}
      <mesh position={[0, 0.25, 0]}>
        <torusGeometry args={[BUMPER_R + 0.05, 0.04, 8, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={lit ? 2 : 0.6}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 0.5, 0]}
        color={color}
        intensity={lit ? 3 : 0.4}
        distance={2.5}
      />
    </group>
  );
}

// ─── Table Geometry ────────────────────────────────────────────────────────────

function TableGeometry() {
  // Floor (XZ plane, y=0)
  const [floor] = usePlane(() => ({
    mass: 0,
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction: 0.35, restitution: 0.6 },
  }));

  // Left wall (normal points in +x direction)
  const [leftWall] = usePlane(() => ({
    mass: 0,
    type: "Static",
    rotation: [0, Math.PI / 2, 0],
    position: [-TABLE_W / 2, 1, 0],
    material: { restitution: 0.7 },
  }));

  // Right wall (normal points in -x direction)
  const [rightWall] = usePlane(() => ({
    mass: 0,
    type: "Static",
    rotation: [0, -Math.PI / 2, 0],
    position: [TABLE_W / 2, 1, 0],
    material: { restitution: 0.7 },
  }));

  // Top wall (normal points in +z direction, at top of table)
  const [topWall] = usePlane(() => ({
    mass: 0,
    type: "Static",
    rotation: [0, Math.PI, 0],
    position: [0, 1, TABLE_H / 2],
    material: { restitution: 0.8 },
  }));

  // Ceiling above table (stops ball flying out)
  const [ceiling] = usePlane(() => ({
    mass: 0,
    type: "Static",
    rotation: [Math.PI / 2, 0, 0],
    position: [0, 2.5, 0],
    material: { restitution: 0.5 },
  }));

  const neonMat = (
    <meshStandardMaterial
      color="#0d2040"
      emissive="#0055aa"
      emissiveIntensity={0.08}
      metalness={0.6}
      roughness={0.4}
    />
  );

  return (
    <>
      {/* Playfield surface */}
      <mesh ref={floor as React.RefObject<THREE.Mesh>} receiveShadow>
        <planeGeometry args={[TABLE_W, TABLE_H]} />
        <meshStandardMaterial
          color="#060818"
          emissive="#0a0530"
          emissiveIntensity={0.15}
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>

      {/* Left wall visual */}
      <mesh ref={leftWall as React.RefObject<THREE.Mesh>}>
        <planeGeometry args={[TABLE_H, 2]} />
        {neonMat}
      </mesh>

      {/* Right wall visual */}
      <mesh ref={rightWall as React.RefObject<THREE.Mesh>}>
        <planeGeometry args={[TABLE_H, 2]} />
        {neonMat}
      </mesh>

      {/* Top wall visual */}
      <mesh ref={topWall as React.RefObject<THREE.Mesh>}>
        <planeGeometry args={[TABLE_W, 2]} />
        {neonMat}
      </mesh>

      {/* Invisible ceiling ref (no visual needed) */}
      <mesh ref={ceiling as React.RefObject<THREE.Mesh>} visible={false}>
        <planeGeometry args={[TABLE_W, TABLE_H]} />
        <meshBasicMaterial />
      </mesh>

      {/* Drain wall visual indicator */}
      <mesh position={[0, 0.01, DRAIN_Z - 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TABLE_W, 0.3]} />
        <meshStandardMaterial
          color="#ff0033"
          emissive="#ff0033"
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Neon lane lines */}
      {[-1.2, 0, 1.2].map((x, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static layout lines
        <mesh key={i} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, TABLE_H - 1]} />
          <meshStandardMaterial
            color="#6600ff"
            emissive="#6600ff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── Ball ─────────────────────────────────────────────────────────────────────

function Ball({
  onNearDrain,
  onDrain,
  onSpawn,
  isGolden,
  ghostTrailRef,
  ballsLeft,
  debugRef,
}: {
  onNearDrain: () => void;
  onDrain: (pos: [number, number]) => void;
  onSpawn: () => void;
  isGolden: boolean;
  ghostTrailRef: React.MutableRefObject<Array<[number, number, number]>>;
  ballsLeft: number;
  debugRef: React.MutableRefObject<{
    pos: [number, number, number];
    vel: number;
    distToDrain: number;
    spawnProtection: boolean;
  }>;
}) {
  const [ref, api] = useSphere(() => ({
    mass: 0.22,
    position: [SPAWN_X, 0.5, SPAWN_Z],
    args: [BALL_R],
    material: { restitution: 0.85, friction: 0.08 },
    linearDamping: 0.05,
    angularDamping: 0.1,
  }));

  const posRef = useRef<[number, number, number]>([SPAWN_X, 0.5, SPAWN_Z]);
  const velRef = useRef<[number, number, number]>([0, 0, 0]);
  const nearDrainFired = useRef(false);
  const frameCount = useRef(0);
  const spawnTime = useRef(Date.now());
  const spawnProtectionActive = useRef(true);

  // Subscribe to position AND velocity for logging/debug
  useEffect(() => {
    const unsubPos = api.position.subscribe((p) => {
      posRef.current = [p[0], p[1], p[2]];
    });
    const unsubVel = api.velocity.subscribe((v) => {
      velRef.current = [v[0], v[1], v[2]];
    });
    return () => {
      unsubPos();
      unsubVel();
    };
  }, [api]);

  // Use refs to capture initial values so the effect only fires once on mount
  const ballsLeftRef = useRef(ballsLeft);
  const onSpawnRef = useRef(onSpawn);

  // Log initial spawn
  useEffect(() => {
    devLog(
      `BALL SPAWNED at position=[${SPAWN_X.toFixed(2)}, 0.5, ${SPAWN_Z.toFixed(2)}], ball #${ballsLeftRef.current}`,
    );
    devLog(
      `SPAWN PROTECTION ACTIVE — drain disabled for ${SPAWN_PROTECTION_MS}ms`,
    );
    spawnTime.current = Date.now();
    spawnProtectionActive.current = true;
    onSpawnRef.current();

    const t = setTimeout(() => {
      spawnProtectionActive.current = false;
      devLog("SPAWN PROTECTION ENDED");
    }, SPAWN_PROTECTION_MS);
    return () => clearTimeout(t);
  }, []);

  // Launch on Space — give ball a push toward top of table (negative Z = up in world, but our top is +Z)
  // Ball should launch from plunger lane INTO the playfield: upward = toward +Z center of table
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        devLog("LAUNCH: Space pressed, launching ball toward playfield");
        // Launch toward center of table (negative x to steer left, +z if currently near top edge)
        api.velocity.set(-0.5, 2.0, -8);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [api]);

  useFrame(() => {
    const [x, y, z] = posRef.current;
    const [vx, vy, vz] = velRef.current;
    const velMag = Math.sqrt(vx * vx + vy * vy + vz * vz);
    const distToDrain = z - DRAIN_Z;
    frameCount.current++;

    // Update debug ref for overlay
    debugRef.current = {
      pos: [x, y, z],
      vel: velMag,
      distToDrain,
      spawnProtection: spawnProtectionActive.current,
    };

    // Record ghost trail every 4 frames
    if (frameCount.current % 4 === 0) {
      ghostTrailRef.current.push([x, y, z]);
      if (ghostTrailRef.current.length > 60) ghostTrailRef.current.shift();
    }

    // Periodic position log every 30 frames
    if (DEV && frameCount.current % 30 === 0) {
      devLog(
        `BALL pos=[${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}] vel=${velMag.toFixed(2)} distToDrain=${distToDrain.toFixed(2)}`,
      );
    }

    // Near drain detection
    if (z < NEAR_DRAIN_Z && !nearDrainFired.current) {
      nearDrainFired.current = true;
      devLog(
        `NEAR DRAIN: z=${z.toFixed(3)}, threshold=${NEAR_DRAIN_Z.toFixed(3)}`,
      );
      onNearDrain();
    }
    if (z > NEAR_DRAIN_Z) {
      nearDrainFired.current = false;
    }

    // Drain detection — only if spawn protection is off
    if (!spawnProtectionActive.current && z < DRAIN_Z + 0.3) {
      devLog(
        `DRAIN: ball at z=${z.toFixed(3)}, drain threshold=${(DRAIN_Z + 0.3).toFixed(3)}`,
      );
      onDrain([x, z]);
      // Reset ball to spawn position
      api.position.set(SPAWN_X, 0.5, SPAWN_Z);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
      // Re-arm spawn protection
      spawnTime.current = Date.now();
      spawnProtectionActive.current = true;
      frameCount.current = 0;
      nearDrainFired.current = false;
      devLog("SPAWN PROTECTION ACTIVE (post-drain reset)");
      const t = setTimeout(() => {
        spawnProtectionActive.current = false;
        devLog("SPAWN PROTECTION ENDED (post-drain)");
      }, SPAWN_PROTECTION_MS);
      // Note: setTimeout cleanup not needed here as it auto-fires
      void t;
    }
  });

  const ballColor = isGolden ? "#ffcc00" : "#cc44ff";
  const emissiveColor = isGolden ? "#ffaa00" : "#7700ff";

  return (
    <mesh ref={ref as React.RefObject<THREE.Mesh>} castShadow>
      <sphereGeometry args={[BALL_R, 24, 24]} />
      <meshStandardMaterial
        color={ballColor}
        emissive={emissiveColor}
        emissiveIntensity={isGolden ? 0.9 : 0.5}
        metalness={0.85}
        roughness={0.1}
      />
    </mesh>
  );
}

// ─── Ghost Trail ──────────────────────────────────────────────────────────────

function GhostTrail({
  positions,
}: { positions: Array<[number, number, number]> }) {
  if (positions.length === 0) return null;

  return (
    <>
      {positions.map((pos, i) => {
        const opacity = (i / positions.length) * 0.55;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: trail points ordered
          <mesh key={i} position={pos}>
            <sphereGeometry args={[BALL_R * 0.7, 8, 8]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.8}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}
    </>
  );
}

// ─── Heatmap Plane ────────────────────────────────────────────────────────────

function HeatmapPlane({
  drainPositions,
}: { drainPositions: Array<[number, number]> }) {
  const texture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, size, size);

    for (const [worldX, worldZ] of drainPositions) {
      const cx = ((worldX + TABLE_W / 2) / TABLE_W) * size;
      const cy = ((worldZ + TABLE_H / 2) / TABLE_H) * size;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12);
      grad.addColorStop(0, "rgba(255,0,0,0.35)");
      grad.addColorStop(0.5, "rgba(255,140,0,0.2)");
      grad.addColorStop(1, "rgba(0,0,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
    }

    return new THREE.CanvasTexture(canvas);
  }, [drainPositions]);

  return (
    <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[TABLE_W, TABLE_H]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Weather Particles ─────────────────────────────────────────────────────────

function WeatherParticles({ weatherType }: { weatherType: string }) {
  const COUNT = 120;
  const meshRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * TABLE_W * 1.5;
      pos[i * 3 + 1] = Math.random() * 6 + 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * TABLE_H;
      vel[i * 3] =
        weatherType === "Rain" ? 0.015 : (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 1] =
        weatherType === "Rain" ? -0.12 : weatherType === "Snow" ? -0.02 : 0;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions: pos, velocities: vel };
  }, [weatherType]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions.slice(), 3),
    );
    return geo;
  }, [positions]);

  const color = useMemo(() => {
    switch (weatherType) {
      case "Rain":
        return "#88ccff";
      case "Snow":
        return "#eeeeff";
      case "Confetti":
        return "#ff66aa";
      case "Fireflies":
        return "#aaff44";
      default:
        return "#ffffff";
    }
  }, [weatherType]);

  useFrame(() => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      let x = posAttr.getX(i) + velocities[i * 3];
      let y = posAttr.getY(i) + velocities[i * 3 + 1];
      let z = posAttr.getZ(i) + velocities[i * 3 + 2];

      if (weatherType === "Fireflies") {
        x += (Math.random() - 0.5) * 0.03;
        y += (Math.random() - 0.5) * 0.02;
        z += (Math.random() - 0.5) * 0.03;
      }

      if (y < 0) {
        y = 6;
        x = (Math.random() - 0.5) * TABLE_W * 1.5;
      }
      if (y > 7) y = 0.5;
      if (Math.abs(x) > TABLE_W) x = (Math.random() - 0.5) * TABLE_W * 1.5;

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  });

  if (weatherType === "None" || !weatherType) return null;

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={weatherType === "Rain" ? 0.04 : 0.07}
        transparent
        opacity={weatherType === "Fireflies" ? 0.85 : 0.65}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Neon Grid Background ─────────────────────────────────────────────────────

function NeonGrid() {
  const linePositions = useMemo(() => {
    const pts: number[] = [];
    for (let z = -TABLE_H / 2; z <= TABLE_H / 2; z += 1.5) {
      pts.push(-TABLE_W / 2, 0.005, z, TABLE_W / 2, 0.005, z);
    }
    for (let x = -TABLE_W / 2; x <= TABLE_W / 2; x += 1.5) {
      pts.push(x, 0.005, -TABLE_H / 2, x, 0.005, TABLE_H / 2);
    }
    return new Float32Array(pts);
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    return g;
  }, [linePositions]);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#220044" transparent opacity={0.4} />
    </lineSegments>
  );
}

// ─── Game Logic Hook ──────────────────────────────────────────────────────────

function useGameLogic(callbacks: GameCallbacks) {
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const multiplierRef = useRef(1);
  const ballsRef = useRef(3);
  const movesRef = useRef<MoveEvent[]>([]);
  const rngSeedRef = useRef(Math.random().toString(36).slice(2));
  const totalMovesRef = useRef(0);

  const handleBumperHit = useCallback(
    (bumperIndex: number) => {
      comboRef.current += 1;
      if (comboRef.current % 10 === 0) {
        multiplierRef.current = Math.min(multiplierRef.current + 1, 8);
      }
      const points = 100 * multiplierRef.current;
      scoreRef.current += points;
      devLog(
        `BUMPER HIT: bumper=#${bumperIndex}, points=${points}, score=${scoreRef.current}`,
      );
      callbacks.onScoreChange(
        scoreRef.current,
        comboRef.current,
        multiplierRef.current,
      );
      callbacks.onBumperHit();
    },
    [callbacks],
  );

  const handleDrain = useCallback(
    (_pos: [number, number]) => {
      movesRef.current.push({ timestamp: Date.now(), action: "drain" });
      ballsRef.current -= 1;
      comboRef.current = 0;
      multiplierRef.current = 1;
      callbacks.onBallsChange(ballsRef.current);
      callbacks.onDrain();

      if (ballsRef.current <= 0) {
        const movesJson = JSON.stringify(movesRef.current);
        const replayHash = `sha256:${rngSeedRef.current}-${scoreRef.current}`;
        devLog(
          `GAME OVER: final score=${scoreRef.current}, total moves=${totalMovesRef.current}`,
        );
        callbacks.onGameOver(scoreRef.current, movesJson, replayHash);
      }
    },
    [callbacks],
  );

  const recordMove = useCallback((action: MoveEvent["action"]) => {
    movesRef.current.push({ timestamp: Date.now(), action });
    totalMovesRef.current += 1;
  }, []);

  return {
    handleBumperHit,
    handleDrain,
    recordMove,
    rngSeed: rngSeedRef.current,
  };
}

// ─── Physics Debug Overlay (HTML) ─────────────────────────────────────────────

interface DebugState {
  pos: [number, number, number];
  vel: number;
  distToDrain: number;
  spawnProtection: boolean;
}

function PhysicsDebugOverlay({
  debugRef,
  leftActive,
  rightActive,
  gravity,
  ballNumber,
  visible,
}: {
  debugRef: React.MutableRefObject<DebugState>;
  leftActive: React.MutableRefObject<boolean>;
  rightActive: React.MutableRefObject<boolean>;
  gravity: number;
  ballNumber: number;
  visible: boolean;
}) {
  const [snap, setSnap] = useState<DebugState>({
    pos: [0, 0, 0],
    vel: 0,
    distToDrain: 0,
    spawnProtection: false,
  });

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setSnap({ ...debugRef.current });
    }, 100);
    return () => clearInterval(id);
  }, [visible, debugRef]);

  if (!visible) return null;

  const [x, y, z] = snap.pos;

  return (
    <div
      className="absolute top-12 left-2 z-50 pointer-events-none font-mono text-xs rounded-lg p-3 flex flex-col gap-1"
      style={{
        background: "oklch(0.05 0.02 280 / 0.88)",
        border: "1px solid oklch(0.5 0.3 180 / 0.5)",
        color: "oklch(0.85 0.15 180)",
        minWidth: "200px",
      }}
      data-ocid="play.debug_overlay"
      data-testid="debug-overlay"
    >
      <div
        className="font-bold text-sm mb-1"
        style={{ color: "oklch(0.9 0.25 160)" }}
      >
        🔬 PHYSICS DEBUG
      </div>
      <div>
        <span className="opacity-60">Ball pos:</span>{" "}
        <span>
          {x.toFixed(2)}, {y.toFixed(2)}, {z.toFixed(2)}
        </span>
      </div>
      <div>
        <span className="opacity-60">Velocity:</span>{" "}
        <span
          style={{ color: snap.vel > 5 ? "oklch(0.75 0.25 60)" : "inherit" }}
        >
          {snap.vel.toFixed(2)} u/s
        </span>
      </div>
      <div>
        <span className="opacity-60">Dist to drain:</span>{" "}
        <span
          style={{
            color: snap.distToDrain < 2 ? "oklch(0.65 0.25 22)" : "inherit",
          }}
        >
          {snap.distToDrain.toFixed(2)}
        </span>
      </div>
      <div>
        <span className="opacity-60">Drain threshold:</span>{" "}
        <span>z &lt; {(DRAIN_Z + 0.3).toFixed(2)}</span>
      </div>
      <div>
        <span className="opacity-60">Spawn protect:</span>{" "}
        <span
          style={{
            color: snap.spawnProtection
              ? "oklch(0.75 0.25 140)"
              : "oklch(0.6 0.1 0)",
          }}
        >
          {snap.spawnProtection ? "ACTIVE" : "OFF"}
        </span>
      </div>
      <div
        className="border-t mt-1 pt-1"
        style={{ borderColor: "oklch(0.5 0.3 180 / 0.3)" }}
      >
        <span className="opacity-60">L flipper:</span>{" "}
        <span
          data-testid="flipper-debug-left"
          style={{
            color: leftActive.current
              ? "oklch(0.75 0.25 180)"
              : "oklch(0.5 0 0)",
          }}
        >
          {leftActive.current ? "UP" : "down"}
        </span>
        {"  "}
        <span className="opacity-60">R flipper:</span>{" "}
        <span
          data-testid="flipper-debug-right"
          style={{
            color: rightActive.current
              ? "oklch(0.75 0.25 280)"
              : "oklch(0.5 0 0)",
          }}
        >
          {rightActive.current ? "UP" : "down"}
        </span>
      </div>
      <div>
        <span className="opacity-60">Gravity:</span>{" "}
        <span>{gravity.toFixed(1)} m/s²</span>
      </div>
      <div>
        <span className="opacity-60">Ball #:</span> <span>{ballNumber}</span>
      </div>
    </div>
  );
}

// ─── Inner Scene (needs Physics context) ─────────────────────────────────────

function PinballScene({
  table,
  showHeatmap,
  showGhost,
  isPaused: _isPaused,
  callbacks,
  ballNumber,
  debugRef,
  leftForceRef,
  rightForceRef,
}: {
  table: PinballTable | null;
  showHeatmap: boolean;
  showGhost: boolean;
  isPaused: boolean;
  callbacks: GameCallbacks;
  ballNumber: number;
  debugRef: React.MutableRefObject<DebugState>;
  leftForceRef: React.MutableRefObject<boolean>;
  rightForceRef: React.MutableRefObject<boolean>;
}) {
  const [drainPositions, setDrainPositions] = useState<Array<[number, number]>>(
    [],
  );
  const ghostTrailRef = useRef<Array<[number, number, number]>>([]);
  const [ghostPositions, setGhostPositions] = useState<
    Array<[number, number, number]>
  >([]);
  const ghostFrameRef = useRef(0);

  const {
    handleBumperHit,
    handleDrain: gameHandleDrain,
    recordMove,
  } = useGameLogic(callbacks);

  const physicsConfig = useMemo<GamePhysicsConfig>(
    () => ({
      gravity: table?.gravity ?? 1.0,
      friction: table?.friction ?? 0.3,
      rebound: table?.rebound ?? 0.8,
      flipperStrength: table?.flipperStrength ?? 1.0,
      tiltSensitivity: table?.tiltSensitivity ?? 0.5,
    }),
    [table],
  );
  void physicsConfig;

  const weatherType = useMemo(() => {
    if (!table?.visualsJson) return "None";
    try {
      const v = JSON.parse(table.visualsJson);
      return v.weatherType ?? "None";
    } catch {
      return "None";
    }
  }, [table]);

  useEffect(() => {
    callbacks.registerFlipperCallbacks({
      leftDown: () => {
        leftForceRef.current = true;
      },
      leftUp: () => {
        leftForceRef.current = false;
      },
      rightDown: () => {
        rightForceRef.current = true;
      },
      rightUp: () => {
        rightForceRef.current = false;
      },
    });
  }, [callbacks, leftForceRef, rightForceRef]);

  // Keyboard controls
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A" || e.key === "z" || e.key === "Z") {
        if (!leftForceRef.current) {
          leftForceRef.current = true;
          recordMove("leftDown");
          callbacks.onFlipperLeft(true);
        }
      }
      if (
        e.key === "l" ||
        e.key === "L" ||
        e.key === "/" ||
        e.key === "ArrowRight"
      ) {
        if (!rightForceRef.current) {
          rightForceRef.current = true;
          recordMove("rightDown");
          callbacks.onFlipperRight(true);
        }
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A" || e.key === "z" || e.key === "Z") {
        leftForceRef.current = false;
        recordMove("leftUp");
        callbacks.onFlipperLeft(false);
      }
      if (
        e.key === "l" ||
        e.key === "L" ||
        e.key === "/" ||
        e.key === "ArrowRight"
      ) {
        rightForceRef.current = false;
        recordMove("rightUp");
        callbacks.onFlipperRight(false);
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [callbacks, recordMove, leftForceRef, rightForceRef]);

  const handleDrain = useCallback(
    (pos: [number, number]) => {
      setDrainPositions((prev) => [...prev, pos]);
      gameHandleDrain(pos);
    },
    [gameHandleDrain],
  );

  // Update ghost positions from trail ref at 15fps
  useFrame(() => {
    if (!showGhost) return;
    ghostFrameRef.current++;
    if (ghostFrameRef.current % 4 === 0) {
      setGhostPositions([...ghostTrailRef.current]);
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.3} color="#220033" />
      <directionalLight
        position={[2, 8, 4]}
        intensity={0.7}
        color="#ffffff"
        castShadow
      />
      <pointLight
        position={[0, 6, 0]}
        intensity={1.2}
        color="#7700ff"
        distance={14}
      />
      <pointLight
        position={[-2, 4, 3]}
        intensity={0.6}
        color="#00aaff"
        distance={8}
      />
      <pointLight
        position={[2, 4, 3]}
        intensity={0.6}
        color="#ff00aa"
        distance={8}
      />
      {/* Light near drain to illuminate bottom of table */}
      <pointLight
        position={[0, 3, DRAIN_Z + 1]}
        intensity={0.5}
        color="#ff3300"
        distance={5}
      />

      {/* Table surface + walls */}
      <TableGeometry />
      <NeonGrid />

      {/* Bumpers */}
      {BUMPER_DEFS.map((b, i) => (
        <Bumper
          key={`${b.position[0]}-${b.position[2]}`}
          position={b.position}
          color={b.color}
          bumperIndex={i}
          onHit={handleBumperHit}
        />
      ))}

      {/* Flippers */}
      <Flipper isLeft forceRef={leftForceRef} />
      <Flipper isLeft={false} forceRef={rightForceRef} />

      {/* Ball */}
      <Ball
        onNearDrain={callbacks.onBallNearDrain}
        onDrain={handleDrain}
        onSpawn={() => {}}
        isGolden={false}
        ghostTrailRef={ghostTrailRef}
        ballsLeft={ballNumber}
        debugRef={debugRef}
      />

      {/* Ghost trail */}
      {showGhost && <GhostTrail positions={ghostPositions} />}

      {/* Heatmap */}
      {showHeatmap && drainPositions.length > 0 && (
        <HeatmapPlane drainPositions={drainPositions} />
      )}

      {/* Weather particles */}
      <WeatherParticles weatherType={weatherType} />

      {/* Plunger lane visual (right side, near top) */}
      <mesh
        position={[TABLE_W / 2 - 0.2, 0.02, SPAWN_Z]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.3, 3]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Decorative ramp arches */}
      <mesh position={[-1.5, 0.3, -0.5]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.12, 0.5, 2.0]} />
        <meshStandardMaterial
          color="#330066"
          emissive="#6600cc"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[1.5, 0.3, -0.5]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.12, 0.5, 2.0]} />
        <meshStandardMaterial
          color="#330066"
          emissive="#6600cc"
          emissiveIntensity={0.4}
        />
      </mesh>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface PinballGameProps {
  tableId: string;
  table: PinballTable | null;
  showHeatmap: boolean;
  showGhost: boolean;
  isPaused: boolean;
  callbacks: GameCallbacks;
}

export default function PinballGame({
  tableId: _tableId,
  table,
  showHeatmap,
  showGhost,
  isPaused,
  callbacks,
}: PinballGameProps) {
  const gravityY = table?.gravity != null ? -9.8 * Number(table.gravity) : -9.8;
  const [showDebug, setShowDebug] = useState(false);
  const [ballNumber, setBallNumber] = useState(3);
  const debugRef = useRef<DebugState>({
    pos: [0, 0, 0],
    vel: 0,
    distToDrain: 0,
    spawnProtection: false,
  });
  // These refs live here (outside Physics/Canvas) so overlay can read them
  const leftForceRef = useRef(false);
  const rightForceRef = useRef(false);

  // Wrap callbacks to track ball number for debug overlay
  const wrappedCallbacks = useMemo<GameCallbacks>(
    () => ({
      ...callbacks,
      onBallsChange: (balls: number) => {
        setBallNumber(balls);
        callbacks.onBallsChange(balls);
      },
    }),
    [callbacks],
  );

  // D key toggles debug overlay
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "d" || e.key === "D") {
        setShowDebug((v) => !v);
        devLog(`Debug overlay ${!showDebug ? "ENABLED" : "DISABLED"}`);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [showDebug]);

  // Log game config on mount
  useEffect(() => {
    devLog("=== PINBALL GAME INIT ===");
    devLog(
      `Gravity: ${gravityY.toFixed(2)} (table multiplier: ${table?.gravity ?? 1.0})`,
    );
    devLog(`Table dimensions: W=${TABLE_W}, H=${TABLE_H}`);
    devLog(
      `Spawn position: x=${SPAWN_X.toFixed(2)}, y=0.5, z=${SPAWN_Z.toFixed(2)}`,
    );
    devLog(
      `Drain threshold: z < ${(DRAIN_Z + 0.3).toFixed(2)} (DRAIN_Z=${DRAIN_Z})`,
    );
    devLog(`Near-drain zone: z < ${NEAR_DRAIN_Z.toFixed(2)}`);
    devLog(
      `Physics: friction=${table?.friction ?? 0.3}, rebound=${table?.rebound ?? 0.8}`,
    );
    devLog(`Spawn protection: ${SPAWN_PROTECTION_MS}ms`);
    devLog(
      "Camera: position=[0,20,18] looking at [0,0,-3] — drain at screen bottom",
    );
    devLog("Press D to toggle debug overlay");
    devLog("========================");
  }, [gravityY, table]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Debug toggle button */}
      {DEV && (
        <button
          type="button"
          onClick={() => setShowDebug((v) => !v)}
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            zIndex: 60,
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "10px",
            fontFamily: "monospace",
            background: showDebug
              ? "oklch(0.4 0.2 180 / 0.9)"
              : "oklch(0.15 0.02 280 / 0.8)",
            color: "oklch(0.9 0.1 180)",
            border: "1px solid oklch(0.5 0.2 180 / 0.5)",
            cursor: "pointer",
          }}
          data-ocid="play.debug_toggle"
        >
          {showDebug ? "🔬 DEBUG ON" : "DEBUG"}
        </button>
      )}

      {/* Physics debug overlay (outside canvas, HTML overlay) */}
      <PhysicsDebugOverlay
        debugRef={debugRef}
        leftActive={leftForceRef}
        rightActive={rightForceRef}
        gravity={Math.abs(gravityY)}
        ballNumber={ballNumber}
        visible={showDebug}
      />

      <Canvas
        shadows
        style={{
          width: "100%",
          height: "100%",
          filter: "drop-shadow(0 0 12px rgba(180,0,255,0.4))",
        }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/*
           * CAMERA: positioned at [0, 20, 18], looking at [0, 0, -3]
           * This puts the TOP of the table (z ≈ +7) near the top of the screen
           * and the DRAIN (z ≈ -6.5) near the BOTTOM of the screen.
           * Natural top-to-bottom reading: launch lane at top, drain at bottom.
           */}
          <PerspectiveCamera
            makeDefault
            position={[0, 20, 18]}
            fov={50}
            near={0.1}
            far={120}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
            target={[0, 0, -3]}
          />

          {/* Physics world */}
          <Physics
            gravity={[0, gravityY, 0]}
            defaultContactMaterial={{
              friction: table?.friction ?? 0.3,
              restitution: table?.rebound ?? 0.8,
            }}
            allowSleep={false}
            iterations={20}
          >
            <PinballScene
              table={table}
              showHeatmap={showHeatmap}
              showGhost={showGhost}
              isPaused={isPaused}
              callbacks={wrappedCallbacks}
              ballNumber={ballNumber}
              debugRef={debugRef}
              leftForceRef={leftForceRef}
              rightForceRef={rightForceRef}
            />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
