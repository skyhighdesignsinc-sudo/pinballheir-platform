# PinballHEIR — Living Technical Specification

> **Version**: 0.3.0 · **Last updated**: 2026-04-20 · **Status**: Active development
>
> This is the canonical living spec. It documents the actual implemented state of the platform, not aspirational goals. When reality diverges from this doc, update this doc first, then file a task.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Physics Engine](#2-physics-engine)
3. [Coordinate System](#3-coordinate-system)
4. [Game Loop](#4-game-loop)
5. [Table Constants & Geometry](#5-table-constants--geometry)
6. [Flipper Mechanics](#6-flipper-mechanics)
7. [Bumper Mechanics](#7-bumper-mechanics)
8. [Drain & Ball Lifecycle](#8-drain--ball-lifecycle)
9. [Camera & Rendering](#9-camera--rendering)
10. [9-Tab Table Constructor](#10-9-tab-table-constructor)
11. [DAO Governance](#11-dao-governance)
12. [Asset Marketplace](#12-asset-marketplace)
13. [Economy Model](#13-economy-model)
14. [Replay Proof System](#14-replay-proof-system)
15. [Mobile / PWA Support](#15-mobile--pwa-support)
16. [Backend (Motoko) Architecture](#16-backend-motoko-architecture)
17. [Frontend Architecture](#17-frontend-architecture)
18. [Feature Status Matrix](#18-feature-status-matrix)
19. [Known Bugs & Fix Log](#19-known-bugs--fix-log)
20. [User Stories](#20-user-stories)
21. [External Review Notes (Grok)](#21-external-review-notes-grok)

---

## 1. Architecture Overview

PinballHEIR is a fully on-chain DAO-governed pinball arcade hosted on the **Internet Computer (ICP)**. Every layer — from game score validation to governance votes to asset storage — is on-chain.

```
┌──────────────────────────────────────────────────────────────┐
│                     Browser (PWA)                            │
│  React 19 + TypeScript + Vite                               │
│  Three.js (rendering) + @react-three/cannon (physics)       │
│  TanStack Router + TanStack Query                           │
│  Tailwind CSS + OKLCH design tokens                         │
└───────────────────────┬──────────────────────────────────────┘
                        │ ICP canister calls (HTTPS)
┌───────────────────────▼──────────────────────────────────────┐
│              PinballHEIR Motoko Canister                     │
│  main.mo — actor, platform fee, heartbeat, Stripe, charity  │
│  mixins/  — profile, table, gameplay, governance, market,   │
│             asset (mixin-based composition)                  │
│  types/   — table, gameplay, governance, market, asset,     │
│             profile, common                                  │
│  lib/     — governance.mo, table.mo (domain helpers)        │
└───────────────────────┬──────────────────────────────────────┘
                        │ ICP storage extensions
┌───────────────────────▼──────────────────────────────────────┐
│  Platform Extensions (Caffeine AI)                           │
│  • caffeineai-authorization   (Internet Identity + RBAC)    │
│  • caffeineai-object-storage  (file uploads, GLB/MP3/img)   │
│  • caffeineai-http-outcalls   (external API calls)          │
│  • caffeineai-stripe          (payment processing)          │
└──────────────────────────────────────────────────────────────┘
```

### Stack versions (as built)

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 19 |
| Language | TypeScript | 5.x |
| Bundler | Vite | 5.x |
| 3D rendering | Three.js via @react-three/fiber | r164 |
| Physics | @react-three/cannon (cannon-es wrapper) | 6.x |
| Routing | @tanstack/react-router | 1.x |
| Data fetching | @tanstack/react-query | 5.x |
| Styling | Tailwind CSS v4 + OKLCH tokens | 4.x |
| Motion | motion/react | 11.x |
| Backend language | Motoko | 0.12+ |
| Backend package manager | mops | latest |
| ICP SDK | dfx | 0.24+ |
| Data structures | mo:core (Map, Set, List) | latest |

### Identity & Authentication

- Internet Identity via `@caffeineai/core-infrastructure` `useInternetIdentity()`
- `loginStatus` values: `"logged-out"` | `"logging-in"` | `"logged-in"`
- Protected pages redirect unauthenticated users
- ICFC token ledger: **`ddsp7-7iaaa-aaaaq-aacqq-cai`**

---

## 2. Physics Engine

### Engine: @react-three/cannon (cannon-es)

The game uses **@react-three/cannon**, a React wrapper around **cannon-es** (a maintained fork of cannon.js), which is a JavaScript rigid-body physics simulation engine.

**This is NOT Box2D WASM.** Box2D WASM (birch-san/box2d-wasm) was considered for deterministic replay validation only — it is NOT currently in use in the live game loop.

### cannon-es characteristics

| Property | Value |
|---|---|
| Broadphase | NaiveBroadphase (default) |
| Solver iterations | 20 (configured in `<Physics>`) |
| Fixed timestep | Default browser RAF delta (~60fps) |
| Sleep | Disabled (`allowSleep={false}`) |
| Determinism | **Non-deterministic** across browsers/devices (floating-point variability) |

### Physics world configuration

```tsx
<Physics
  gravity={[0, gravityY, 0]}          // gravityY = -9.8 * table.gravity
  defaultContactMaterial={{
    friction: table.friction ?? 0.3,
    restitution: table.rebound ?? 0.8,
  }}
  allowSleep={false}
  iterations={20}
>
```

### Gravity calculation

```ts
const gravityY = table?.gravity != null
  ? -9.8 * Number(table.gravity)
  : -9.8;
```

`table.gravity` is a **multiplier** (e.g. `1.0` = Earth), not raw m/s². The actual Y-axis gravity applied to the physics world is `gravityY` (always negative = downward in Three.js Y-up space).

### Physics presets (table constructor)

| Preset | gravity | flipperForce | restitution | friction | tiltSensitivity |
|---|---|---|---|---|---|
| Easy | 6.5 m/s² | 350 N | 0.90 | 0.03 | 2 |
| Medium | 9.8 m/s² | 300 N | 0.85 | 0.05 | 5 |
| Hard | 13.0 m/s² | 260 N | 0.78 | 0.08 | 7 |
| Extreme | 17.5 m/s² | 220 N | 0.70 | 0.12 | 9 |

### Known physics limitations

- **cannon-es is non-deterministic** for replay validation across machines. The stored `movesJson + rngSeed` is a best-effort approach; a deterministic WASM engine (Box2D WASM or vpx-js) would be required for trustless on-chain dispute resolution.
- Flipper rotation is applied via `api.rotation.set()` on a Kinematic body — this is instant snapping (no angular velocity). Real pinball machines and vpx-js use angular impulse for a more realistic flipper feel.
- No ramp physics collision bodies — the decorative ramps visible in the scene are mesh-only with no collider.

---

## 3. Coordinate System

**CRITICAL — this has caused bugs before. Read carefully.**

```
Three.js coordinate system (Y-up, right-hand):

            +Y (up)
             │
             │
             │
──────────────────────── +X (right)
             │
             │
            -Y (down)

+Z points TOWARD the camera (out of the screen toward viewer)
-Z points AWAY from camera (into the screen / up the table)
```

### Table orientation

```
  Camera at [0, 14, +8] — looking down toward origin

  +Z end (NEAR camera, BOTTOM of table as seen by player)
  ┌─────────────────────┐  z = +6.5 (approx)
  │   ← plunger lane →  │
  │                     │
  │    [FLIPPER ZONE]   │  z ≈ DRAIN_Y + 1.5 = -5.0
  │                     │
  │      DRAIN HERE     │  z < DRAIN_Y + 0.3 = z < -6.2
  └─────────────────────┘  z = -6.5 (DRAIN_Y)

  -Z end (FAR from camera, TOP of table as seen by player)
  Back wall at z = -TABLE_H/2 = -6.0
```

### Key coordinate values

```ts
const TABLE_W  = 4;       // X-axis: -2 to +2
const TABLE_H  = 12;      // Z-axis span: -6 to +6
const DRAIN_Y  = -6.5;    // Z position of drain
const NEAR_DRAIN_Y = DRAIN_Y + 1.8;  // = -4.7 (near-drain warning threshold)

// Ball spawns at (X, Y, Z):
[TABLE_W/2 - 0.35, 0.5, DRAIN_Y + 0.5]
// = [1.65, 0.5, -6.0]
// This is the plunger lane, very near the drain — see Known Bugs
```

### Why the table might look "inverted"

From the camera position `[0, 14, 8]` (high + forward on Z), looking toward origin `[0, 0, 0]`:

- The **top of the table** (back wall, z = -6) appears at the **top of the screen**
- The **drain/flippers** (z ≈ -6.5) should appear at the **bottom of the screen**
- BUT the drain is at the most negative Z value, which is behind the origin from the camera's perspective, so it actually appears **farther away (top of screen)**

**The visual is correct for a top-down view** but may feel counterintuitive. The ball should roll "away" from the camera (toward -Z) under gravity, which is downward in world space (−Y). Gravity is correctly set to Y-axis only; there is no Z-axis gravity tilt applied to simulate a tilted pinball cabinet. This means the table behaves like a flat surface, not an angled cabinet — the ball has no natural tendency to roll toward the drain. **This is a significant physics flaw**: real pinball tables are angled 3–7° so gravity helps the ball roll back toward the flippers.

---

## 4. Game Loop

### Per-frame tick (useFrame in @react-three/fiber)

The game loop runs inside Three.js's `requestAnimationFrame` via `useFrame`:

```
Each RAF tick (~60fps):
  1. Read ball position from cannon-es physics body (posRef.current)
  2. Append position to ghostTrailRef (every 4 frames)
  3. Check z < NEAR_DRAIN_Y: fire onBallNearDrain() once per approach
  4. Check z < DRAIN_Y + 0.3: if true → drain event
     a. Reset ball position to spawn point
     b. Reset ball velocity to zero
     c. Call onDrain([x, z])
  5. Flipper check: if forceRef.current changed → api.rotation.set()
  6. Weather particles: update all particle positions (in separate useFrame)
```

### Score events

```
onBumperHit():
  comboRef += 1
  if combo % 10 === 0: multiplierRef = min(multiplier + 1, 8)
  points = 100 * multiplier
  scoreRef += points
  fire onScoreChange(score, combo, multiplier)
```

Bumper hit is triggered by cannon-es `onCollide` callback on each Bumper's cylinder physics body.

> **⚠️ Bug**: The `handleHit` callback inside `Bumper` component is declared but then suppressed with `void handleHit`. The `onCollide` is wired to the `onHit` prop directly (from `useGameLogic`) — but `handleHit` adds the flash animation. The flash and hit callback are currently **disconnected**. Bumpers score points but may not visually flash correctly.

### Game over sequence

```
When ballsRef.current <= 0:
  1. movesJson = JSON.stringify(movesRef.current)
  2. replayHash = `sha256:${rngSeed}-${score}` (stub — not real SHA-256)
  3. callbacks.onGameOver(score, movesJson, replayHash)
  → PlayPage sets phase = "gameover"
  → GameOverOverlay renders
  → User can submit score on-chain via submitScore() + submitReplay()
```

### Input handling

| Key | Action | Recorded in movesJson |
|---|---|---|
| `A`, `Z` (down) | Left flipper activate | `leftDown` event |
| `A`, `Z` (up) | Left flipper release | `leftUp` event |
| `L`, `/`, `ArrowRight` (down) | Right flipper activate | `rightDown` event |
| `L`, `/`, `ArrowRight` (up) | Right flipper release | `rightUp` event |
| `Space` | Launch ball (velocity `[0.2, 0, -18]`) | Not recorded |
| `Escape` | Pause / unpause | Not recorded |

### Ball launch (Space key)

```ts
api.velocity.set(0.2, 0, -18);
```

This launches the ball slightly rightward and strongly in the `-Z` direction (into the table, away from flippers). The ball travels up the table as expected.

---

## 5. Table Constants & Geometry

```ts
TABLE_W   = 4      // Total width in world units (-2 to +2 on X axis)
TABLE_H   = 12     // Total height in world units (-6 to +6 on Z axis)
BALL_R    = 0.18   // Ball radius (sphere)
DRAIN_Y   = -6.5   // Z-coordinate of drain plane
NEAR_DRAIN_Y = -4.7  // Z-coordinate of near-drain warning
BUMPER_R  = 0.38   // Bumper cylinder radius
FLIPPER_LEN = 1.6  // Flipper box length
```

### Physics bodies present

| Element | Shape | Mass | Type |
|---|---|---|---|
| Ball | Sphere (r=0.18) | 0.22 | Dynamic |
| Floor | Plane (XZ, facing +Y) | 0 | Static |
| Left wall | Plane (facing +X) | 0 | Static |
| Right wall | Plane (facing -X) | 0 | Static |
| Back wall | Plane (facing +Z) | 0 | Static |
| Left flipper | Box (1.6 × 0.22 × 0.3) | 0 | Kinematic |
| Right flipper | Box (1.6 × 0.22 × 0.3) | 0 | Kinematic |
| Bumper × 6 | Cylinder (r=0.38, h=0.45) | 0 | Static |

> **Note**: There is **no drain plane collider**. The drain is detected by position check (Z threshold) in `useFrame`, not by a physics body. Ball is teleported back to spawn when drain threshold is crossed.

### Default bumper positions

```ts
{ position: [-1.0, 0.5,  1.5], color: "#ff0077" }  // Upper left
{ position: [ 1.0, 0.5,  1.5], color: "#ff0077" }  // Upper right
{ position: [ 0.0, 0.5,  0.0], color: "#ff7700" }  // Center
{ position: [-1.3, 0.5, -1.2], color: "#00ffcc" }  // Mid left
{ position: [ 1.3, 0.5, -1.2], color: "#00ffcc" }  // Mid right
{ position: [ 0.0, 0.5, -2.8], color: "#cc00ff" }  // Lower center
```

---

## 6. Flipper Mechanics

### Position

```ts
// Left flipper X:  -TABLE_W/2 + FLIPPER_LEN/2 + 0.2 = -2 + 0.8 + 0.2 = -1.0
// Right flipper X: TABLE_W/2 - FLIPPER_LEN/2 - 0.2  =  2 - 0.8 - 0.2 = +1.0
// Both Z:  DRAIN_Y + 1.5 = -5.0  (near drain, at bottom of table)
// Both Y:  0.3 (slightly above floor)
```

### Rotation

```ts
// Resting (down) angle in radians:
baseAngle_left   = -0.35  // tilted down-left
baseAngle_right  =  0.35  // tilted down-right

// Active (up) angle in radians:
activeAngle_left  = +0.55  // tilted up-left
activeAngle_right = -0.55  // tilted up-right

// Rotation axis: Z (so flippers rotate in the XY plane / tilt up/down)
api.rotation.set(0, 0, active ? activeAngle : baseAngle);
```

### Flipper physics notes

- Flippers are **Kinematic** bodies (mass=0, moved by direct rotation set)
- No impulse force is applied to the ball; the physics engine computes the contact response based on the flipper's geometry and the ball's incoming velocity
- **The flipperForce slider in the constructor currently has no effect** — it is stored in `table.flipperStrength` but not wired into any cannon-es parameter. Kinematic bodies don't use force APIs.
- No angular velocity is set on flippers — they snap instantly to target angle

---

## 7. Bumper Mechanics

### Physics configuration

```ts
useCylinder(() => ({
  mass: 0,
  type: "Static",
  position,
  args: [BUMPER_R, BUMPER_R, 0.45, 16],
  material: { restitution: 1.6, friction: 0.05 },
  onCollide: onHit,
}));
```

- `restitution: 1.6` — bumpers are **super-bouncy** (ball bounces back with 160% of incoming speed). This is intentional for arcade feel.
- `friction: 0.05` — nearly frictionless
- 6 bumpers total with hardcoded positions (layout tab can customize, but positions are not yet wired to the physics engine — see Feature Status)

### Bumper hit callback bug

```ts
const handleHit = useCallback(() => {
  setLit(true);      // visual flash
  onHit();           // score event
  setTimeout(() => setLit(false), 180);
}, [onHit]);

// Suppress unused warning: handleHit is declared but used for its side effects
void handleHit;
```

The `onCollide: onHit` prop is passed directly to `useCylinder`, bypassing `handleHit`. This means:
- ✅ Score events fire on collision
- ❌ Visual flash (`setLit`) does NOT fire on collision — it's dead code
- The glow ring and point light intensity changes (`lit ? 1.2 : 0.4`) never animate

---

## 8. Drain & Ball Lifecycle

### Drain detection logic (FIXED as of v0.2.x)

```ts
// Drain fires when ball Z drops below DRAIN_Y + 0.3
// DRAIN_Y = -6.5, so threshold = -6.2
if (z < DRAIN_Y + 0.3) {   // z < -6.2
  onDrain([x, z]);
  // Reset ball
  api.position.set(TABLE_W / 2 - 0.35, 0.5, DRAIN_Y + 0.5);  // spawn
  api.velocity.set(0, 0, 0);
  api.angularVelocity.set(0, 0, 0);
}
```

**Previously broken**: the drain check was `z > DRAIN_Y + 0.3` (inverted), causing immediate game over on every ball spawn. Fixed in v0.2.x.

### Near-drain warning

```ts
// Warning fires when ball drops below NEAR_DRAIN_Y = -4.7
if (z < NEAR_DRAIN_Y && !nearDrainFired.current) {
  nearDrainFired.current = true;
  onNearDrain();   // triggers SaveBallPrompt overlay in PlayPage
}
if (z > NEAR_DRAIN_Y) {
  nearDrainFired.current = false;  // reset so it can fire again
}
```

### Ball spawn position problem

```ts
api.position.set(TABLE_W / 2 - 0.35, 0.5, DRAIN_Y + 0.5);
// = [1.65, 0.5, -6.0]
```

`DRAIN_Y + 0.5 = -6.0`. The drain fires at `z < -6.2`. So spawn is at `-6.0`, which is **only 0.2 units above the drain threshold**. In a single physics frame the ball can drift 0.2+ units and immediately re-drain.

**Mitigation needed**: Spawn at `DRAIN_Y + 3.0` or higher (e.g. z = -3.5), which is safely above the flippers. Or implement a spawn protection timer.

### Ball count

- Starts at 3 balls
- Each drain decrements `ballsRef.current`
- When `ballsRef.current <= 0` → game over
- "Save the Ball" feature: `actor.saveTheBall(tableId)` is called on-chain, but the ball is not actually prevented from draining in the physics simulation — the save is a social/economy action only

---

## 9. Camera & Rendering

### Camera configuration

```tsx
<PerspectiveCamera
  makeDefault
  position={[0, 14, 8]}   // High above, forward on Z (toward viewer)
  fov={45}
  near={0.1}
  far={100}
/>
<OrbitControls
  enablePan={false}
  enableZoom={false}
  enableRotate={false}
  target={[0, 0, 0]}
/>
```

Camera is **locked** (no pan/zoom/rotate). The fixed isometric-style perspective at `[0, 14, 8]` provides a top-down angled view. Target is world origin `[0, 0, 0]`, which is the center of the table.

### Lighting

| Light | Position | Color | Intensity |
|---|---|---|---|
| AmbientLight | — | `#220033` (dark purple) | 0.3 |
| DirectionalLight | `[2, 8, 4]` | white | 0.7 (casts shadows) |
| PointLight (main) | `[0, 6, -2]` | `#7700ff` (violet) | 1.2 |
| PointLight (left) | `[-2, 4, 3]` | `#00aaff` (blue) | 0.6 |
| PointLight (right) | `[2, 4, 3]` | `#ff00aa` (pink) | 0.6 |
| Per-bumper PointLight | bumper position | bumper color | 0.4–3.0 |

### Canvas settings

```tsx
<Canvas
  shadows
  gl={{ antialias: true, alpha: false }}
  camera={{ position: [0, 14, 8], fov: 45 }}
>
```

- Full WebGL shadows enabled
- Anti-aliasing on
- Alpha off (opaque background)
- CSS filter: `drop-shadow(0 0 12px rgba(180,0,255,0.4))` on canvas element

---

## 10. 9-Tab Table Constructor

Located at `/constructor` (route) and `src/frontend/src/pages/ConstructorPage.tsx` + `src/frontend/src/pages/constructor-tabs/`.

### Tab 1 — Layout

**File**: `constructor-tabs/LayoutTab.tsx`

| Parameter | Type | Description |
|---|---|---|
| bumpers | `BumperConfig[]` | Array of bumper positions (x, y, radius, points, color) |
| flippers | `FlipperConfig[]` | Left/right flipper x, y, length, angle |
| ramps | `RampConfig[]` | Ramp positions (x, y, width, height, angle, points) |
| drainWidth | number | Width of drain opening |
| plungerX, plungerY | number | Plunger lane position |
| playFieldWidth | number | Table width (default 4) |
| playFieldHeight | number | Table height (default 12) |

> **Note**: Layout values are stored as JSON (`layoutJson`) on the backend but are NOT currently fed back into the physics engine. The game always uses hardcoded `TABLE_W=4`, `TABLE_H=12`, and the 6 default bumper positions. Layout customization is cosmetic only.

### Tab 2 — Visuals

**File**: `constructor-tabs/VisualsTab.tsx`

| Parameter | Type | Options |
|---|---|---|
| primaryColor | string | Hex color picker (default `#7c3aed`) |
| secondaryColor | string | Hex color picker (default `#06b6d4`) |
| accentColor | string | Hex color picker (default `#ff007a`) |
| lightTheme | enum | Cyberpunk, Space, Ocean, Forest, Inferno, Custom |
| weatherType | enum | None, Rain, Snow, Fireflies, Aurora, Confetti, Meteors |
| ballSkin | enum | Classic, Chrome, NeonPurple, NeonCyan, Holographic, Fire, Ice, Galaxy |
| backgroundImage | string | URL input |
| enableNeonGlow | boolean | Glowing bumpers/flippers/ball trail |
| enableParticleEffects | boolean | Spark effects on hits |
| bumperColor, bumperGlowColor | string | Per-bumper color pickers |
| bumperSize | number | Slider (radius) |
| bumperGlowIntensity | number | Slider |
| flipperColor, flipperGlowColor | string | Per-flipper color pickers |
| flipperLength | number | Slider |
| flipperThickness | number | Slider |

> **Note**: `weatherType` is the only visual setting currently read by the game engine (parsed from `table.visualsJson` in `PinballScene`). Other visual settings (colors, ball skins, glow toggles) are stored but not applied to the Three.js scene.

### Tab 3 — Physics

**File**: `constructor-tabs/PhysicsTab.tsx`

| Parameter | Range | Default | Unit | Engine Wired? |
|---|---|---|---|---|
| gravity | 0.5 – 20 | 9.8 | m/s² | ✅ Yes (multiplier) |
| flipperForce | 0 – 500 | 300 | N | ❌ No |
| restitution | 0.5 – 1.5 | 0.85 | coefficient | ✅ Yes (defaultContactMaterial) |
| friction | 0 – 1 | 0.05 | coefficient | ✅ Yes (defaultContactMaterial) |
| tiltSensitivity | 0 – 10 | 5 | — | ❌ No (stored, not used) |
| enableFlipperLag | boolean | false | — | ❌ No |
| flipperLagMs | 50 – 150 | 80 | ms | ❌ No |

### Tab 4 — Economy

**File**: `constructor-tabs/EconomyTab.tsx`

| Parameter | Default | Description |
|---|---|---|
| playCostICFC | 0.01 | Cost to start a game in ICFC |
| jackpotSeedAmount | 10 | Initial jackpot treasury seed in ICFC |
| jackpotContributionPct | 10 | % of each play fee going to jackpot |
| leaderboardPrizePct | 50 | % of jackpot paid to top 10 on reset |
| referralRewardAmount | 0.005 | One-time reward for referring a new player |
| referralEnabled | true | Whether referral rewards are active |
| saveTheBallFee | 0.005 | Cost to trigger a ball save in ICFC |
| nudgeFee | 0.001 | Cost to nudge the table |
| goldenBallChance | 5 | % chance per launch for golden ball activation |
| goldenBallReward | 2.0 | ICFC reward for golden ball game |
| adSlotEnabled | false | Show ad panel during gameplay |
| tournamentPrizePool | 100 | ICFC pool for tournament mode |
| charityTiltAmount | 0.001 | Amount sent to charity wallet on tilt |
| **platformFeePct** | **10** | **READ ONLY — DAO controlled only** |

**Platform fee**: `globalPlatformFeePct` is stored in `main.mo` as `var globalPlatformFeePct : Nat = 10`. Only a passed `#ChangePlatformFee` proposal can modify it. The constructor Economy tab displays it as read-only with a lock icon.

### Tab 5 — Ruleset

**File**: `constructor-tabs/RulesetTab.tsx`

| Parameter | Default | Description |
|---|---|---|
| tiltEnabled | true | Whether nudging can trigger tilt |
| tiltWarnings | 3 | Warnings before tilt triggers |
| ballSaveEnabled | true | Ball saver at game start |
| ballSaveDurationSecs | 5 | How long ball saver lasts |
| extraBallEnabled | false | Extra ball rewards available |
| extraBallCondition | "score:100000" | Trigger condition for extra ball |
| multiBallEnabled | false | Multi-ball mode |
| multiBallCount | 2 | Number of simultaneous balls |
| bonusMultiplierEnabled | true | Score multiplier mechanic |
| maxBonusMultiplier | 8 | Maximum multiplier cap |
| timeBonusEnabled | false | Time-based score bonus |
| ballsPerGame | 3 | Starting ball count |
| difficulty | Medium | Difficulty label |
| coopEnabled | false | Co-op session support |
| coopMaxPlayers | 4 | Max players in co-op |

### Tab 6 — Metadata

**File**: `constructor-tabs/MetadataTab.tsx`

| Parameter | Description |
|---|---|
| name | Table display name |
| description | Long description (markdown) |
| shortDescription | One-liner for table cards |
| tags | Array of searchable tags |
| version | Semver string |
| changelog | What changed in this version |

### Tab 7 — Access

**File**: `constructor-tabs/AccessTab.tsx`

| Parameter | Description |
|---|---|
| accessType | Public / TokenGated / Whitelist / InviteOnly |
| whitelist | Array of allowed Principal IDs |
| maxConcurrentPlayers | Concurrent session cap |
| maxDailyPlayers | Daily unique player cap |
| minICFCToPlay | Minimum ICFC balance required |
| geographicRestrictions | Country codes to block |

### Tab 8 — DAO Settings

**File**: `constructor-tabs/DaoTab.tsx`

| Parameter | Description |
|---|---|
| ownerPrincipal | Table owner's Internet Identity |
| governanceToken | Which token votes on table proposals (default: ICFC) |
| tableVotingThreshold | % of tokens needed to pass a table proposal |
| quorumPct | Minimum participation % |
| proposalDelayHours | Time between proposal submission and voting start |
| proposalDurationHours | Voting window |
| allowTableProposals | Whether anyone can propose changes to this table |

### Tab 9 — Sound & Music

**File**: `constructor-tabs/SoundTab.tsx`

| Parameter | Description |
|---|---|
| backgroundMusicUrl | URL to background music loop (MP3/WAV) |
| backgroundMusicEnabled | Toggle background music |
| backgroundVolume | 0–100 volume slider |
| bumperSoundUrl | URL to bumper hit SFX |
| flipperSoundUrl | URL to flipper activation SFX |
| drainSoundUrl | URL to ball drain SFX |
| jackpotSoundUrl | URL to jackpot fanfare SFX |
| tileSoundUrl | URL to tilt SFX |
| hapticsEnabled | Enable vibration haptics (mobile) |
| pinballRadioEnabled | Background radio/music stream |

> **Note**: Sound URLs are stored as JSON but no audio playback is currently implemented in the game engine. The Web Audio API / Howler.js integration is pending.

---

## 11. DAO Governance

### Architecture

The platform uses a **custom SNS-style token-weighted voting system** implemented natively in Motoko. There is no dependency on DFINITY's official SNS canister.

- Global DAO governs platform-wide decisions (platform fee, asset approval, schema changes)
- Per-table mini-DAOs can be enabled by table owners via DAO Settings tab
- No preloaded proposals at genesis — all governance actions initiated by users post-launch

### Proposal lifecycle

```
Submit → Open (voting period) → Passed/Rejected/Expired → Executed
```

- `votingEnds` timestamp controls when voting closes
- Proposal auto-pruned after 90 days (via hourly heartbeat)
- `burnPercentage` field exists for burn-on-reject mechanics (not yet enforced)

### All 34 Proposal Types

Defined in `src/frontend/src/types/index.ts` (`ProposalType` enum):

**Schema mutations** (6):
`NewObjectType`, `EditObjectType`, `DeleteObjectType`, `NewAttribute`, `EditAttribute`, `DeleteAttribute`

**Method mutations** (3):
`NewMethod`, `EditMethod`, `DeleteMethod`

**Instance mutations** (3):
`CreateInstance`, `EditInstance`, `DeleteInstance`

**Asset management** (3):
`UploadAsset`, `DeleteAsset`, `UploadNewPhysicsEngine`

**Frontend updates** (4):
`UpdateFrontend`, `UpdateCSS`, `UpdateJS`, `UpdateCanister`

**Table governance** (2):
`ReleaseTable`, `ChangeTableEconomy`

**Token / currency** (2):
`AddCurrency`, `RemoveCurrency`

**Profile** (1):
`ConfigureProfileSchema`

**Ads** (1):
`ConfigureGlobalAds`

**Treasury** (2):
`TreasuryAction`, `SetCharityWallet`

**Moderation** (3):
`BanPrincipal`, `DeleteProfile`, `DisputeScore`

**Governance config** (1):
`ChangeGovernance`

**Batch / simulate** (2):
`BatchOp`, `SimulateProposal`

**Platform fee** (1):
`ChangePlatformFee` ← only type with live `executeProposal` side-effect implemented

### Voting mechanics

| Field | Type | Description |
|---|---|---|
| `yesVotes` | Nat | Accumulated token weight for Yes |
| `noVotes` | Nat | Accumulated token weight for No |
| `abstainVotes` | Nat | Accumulated token weight for Abstain |
| `stakedAmount` | Nat | Proposer's staked ICFC |
| `burnPercentage` | Nat | % of stakedAmount burned if proposal rejected |

### Currently implemented side-effects (executeProposal)

Only `#ChangePlatformFee` has a live side-effect: it reads `paramsJson` as a Nat string and updates `globalPlatformFeePct`. All other proposal types are stored and voted on, but `executeProposal` returns `#ok(())` without additional side-effects.

### Governance page

Located at `/governance` → `src/frontend/src/pages/GovernancePage.tsx`

Features:
- Proposal list with status filters (All/Open/Passed/Rejected/Executed)
- Create proposal modal (all 34 types, JSON params editor)
- Vote Yes/No/Abstain with ICFC weight
- Voting power display
- Execute passed proposals

---

## 12. Asset Marketplace

Located at `/assets` → `src/frontend/src/pages/AssetsPage.tsx`

### Upload modes

#### File uploads
- Supported formats: GLB, MP3, WAV, texture (PNG/JPG/WebP), SVG
- Storage: Caffeine AI object-storage extension (`MixinObjectStorage`)
- Max file size: ~1.5 MB recommended, 4 MB absolute
- Total storage: ~4–5 GB per app (beta)
- Files get a permanent URL via object-storage public URL
- Metadata stored on-chain: name, description, tags, creator Principal, file category, storageUrl, royaltyBps

#### Code / SVG uploads
- Modes: SVG code, Three.js/JS snippets, JSON table definitions
- Built-in code editor (Monaco editor or textarea with syntax highlighting)
- Live preview in mini Three.js scene
- Content stored as `codeContent` text field on-chain

### Asset lifecycle

```
Submit → Pending → DAO Vote (Approve / Reject) → Approved
                                                 → Rejected
```

- `actor.submitAsset()` creates a `MarketAsset` with `status: "pending"`
- Admins/DAO voters call `actor.approveAsset(id)` or `actor.rejectAsset(id)`
- Approved assets are publicly listed in Browse tab

### Royalty system

```
When a table uses an asset:
  → actor.submitScore() records play against table
  → Table economy credits a % (creatorRoyaltyPercent) to the asset creator
  → Stored in creatorBalanceMap: Map<Principal, CreatorBalance>
  → Creator calls actor.claimRoyalties() to withdraw
```

> **Status**: Royalty accrual logic is stubbed — the `submitScore` flow does not yet call any royalty distribution function. The `getCreatorBalance` / `claimRoyalties` methods exist but balances are never incremented.

### ICRC-7 NFT minting

- `mintedAsNft: boolean` flag exists on `MarketAsset`
- `nftTokenId: ?bigint` field exists
- **Status**: NFT minting via ICRC-7 is not yet implemented. The field is stored but no canister-side minting call is made.

---

## 13. Economy Model

### Money flows

```
Player pays play fee (ICFC)
        │
        ├─► Platform treasury  (globalPlatformFeePct %, default 10%)
        ├─► Table jackpot pool  (jackpotContributionPct %)
        ├─► Table owner wallet  (remainder)
        └─► Referral reward    (one-time per new player, paid from table treasury)

Jackpot pool
        ├─► Leaderboard payouts  (leaderboardPrizePct % at season end)
        └─► Charity wallet       (charityTiltAmount per tilt event)

Asset royalties
        ├─► Creator balance      (creatorRoyaltyPercent per play that uses asset)
        └─► Claimable via actor.claimRoyalties()
```

### Global treasury

- Stores `globalTreasury : Nat` (in ICFC e8s)
- Funded by `triggerCharityTilt()` for now (testing hook)
- Intended use: platform development, DAO bounties, cycle costs
- **Real ICRC-2 token transfer not yet implemented** — all economy values are Nat counters, not actual on-chain token transfers

### Platform fee governance

```motoko
var globalPlatformFeePct : Nat = 10;
// Only modified by executeProposal(#ChangePlatformFee)
// Table owners cannot modify this
// Validated: feePct must be <= 100
```

### ICFC token integration

- Ledger canister: `ddsp7-7iaaa-aaaaq-aacqq-cai`
- ICRC-1/ICRC-2 integration: **planned, not implemented**
- Current economy is bookkeeping only (Nat counters)

---

## 14. Replay Proof System

### Purpose

Allow on-chain validation of scores to prevent cheating. Disputed scores can be re-simulated with the same inputs and verified against the claimed score.

### Current implementation

```ts
// Client-side (PinballGame.tsx — useGameLogic)
interface MoveEvent {
  timestamp: number;
  action: "leftDown" | "leftUp" | "rightDown" | "rightUp" | "nudge" | "drain";
}

// Collected into movesRef during gameplay
movesRef.current.push({ timestamp: Date.now(), action });

// On game over:
const movesJson = JSON.stringify(movesRef.current);
const replayHash = `sha256:${rngSeedRef.current}-${scoreRef.current}`;
// ⚠️ This is NOT a real SHA-256. It's a stub string.
```

### On-chain storage

```motoko
// types/gameplay.mo
type ReplayRecord = {
  id                : Text;
  tableId           : TableId;
  playerId          : UserId;
  score             : Nat;
  movesJson         : Text;       // JSON array of MoveEvent
  initialParamsJson : Text;       // {"gravity":9.8,"friction":0.3,"rebound":0.8}
  rngSeed           : Text;       // Random base-36 string from client
  scoreHash         : Text;       // The stub "sha256:..." string
  disputed          : Bool;
  timestamp         : Timestamp;
};
```

### Validation gaps

| Gap | Status |
|---|---|
| Real SHA-256 hash | ❌ Stub only |
| Deterministic physics engine | ❌ cannon-es is non-deterministic |
| Server-side replay simulation | ❌ Not implemented |
| On-chain dispute resolution flow | ❌ Backend stores dispute flag, no resolution logic |
| `DisputeScore` proposal type | ⚠️ Type exists, no side-effect handler |

### What would be needed for trustless validation

1. Replace cannon-es with Box2D WASM (Birch-san/box2d-wasm) with fixed timestep
2. Implement WASM canister that can run the same physics simulation
3. On dispute: canister re-runs `movesJson` through WASM with `initialParamsJson + rngSeed`
4. If simulated score ≠ claimed score: reject and slash `stakedAmount`

---

## 15. Mobile / PWA Support

### Touch controls

`TouchControls` component renders on screens below `lg` breakpoint (`< 1024px`).

```tsx
// Two large touch targets (40% width each) + center nudge button
// Left flipper  → onTouchStart → leftDown, onTouchEnd → leftUp
// Right flipper → onTouchStart → rightDown, onTouchEnd → rightUp
// Nudge button  → onTouchStart → onNudge (50% tilt chance)
```

Visual feedback: cyan glow on press, box-shadow active state.

### Haptics

```ts
if ("vibrate" in navigator) navigator.vibrate(50);    // bumper hit
navigator.vibrate([100, 50, 100]);                     // drain / flipper
navigator.vibrate([200, 100, 200, 100, 200]);          // golden ball
```

### PWA manifest

- **Status**: PWA manifest defined but not yet verified in public/manifest.json. No service worker is registered (offline play not supported). Installability depends on manifest presence and HTTPS deployment.

### Responsive layout

- Game canvas: `flex-1` fills available height, `overflow-hidden`
- Side panel (leaderboard + toggles): `hidden lg:flex` — desktop only
- Bottom action bar (nudge/golden ball): `hidden lg:flex` — desktop only
- HUD overlay: absolute positioned, pointer-events-none

---

## 16. Backend (Motoko) Architecture

### Module structure

```
src/backend/
├── main.mo                 Actor definition, state, heartbeat, Stripe, charity
├── BaseToCore.mo           Migration helper (mo:base → mo:core)
├── types/
│   ├── common.mo           Shared primitives (UserId, Timestamp, Result, ProposalType...)
│   ├── table.mo            PinballTable, TableEconomy, Season, EasterEgg
│   ├── gameplay.mo         LeaderboardEntry, ReplayRecord, CoOpSession
│   ├── governance.mo       Proposal, Vote
│   ├── market.mo           SkinCollection, Achievement, AdSlot
│   ├── asset.mo            MarketAsset, CreatorBalance, AssetRoyaltyEntry
│   └── profile.mo          PlayerProfile
├── mixins/
│   ├── profile-api.mo      getCallerUserProfile, saveCallerUserProfile, getUserProfile...
│   ├── table-api.mo        addTable, getTable, getTables, updateTable, releaseTable, forkTable...
│   ├── gameplay-api.mo     submitScore, getLeaderboard, submitReplay, saveTheBall, nudgeTable...
│   ├── governance-api.mo   submitProposal, voteOnProposal, getProposals, executeProposal...
│   ├── market-api.mo       getSkinCollections, purchaseSkin, getAchievements...
│   └── asset-api.mo        submitAsset, approveAsset, rejectAsset, getAssets, getCreatorBalance...
└── lib/
    ├── governance.mo       GovLib.execute, GovLib.pruneExpired (pure functions)
    └── table.mo            TableLib.list (pure query helpers)
```

### State variables (main.mo)

```motoko
// Profile state
profiles = Map.empty<Principal, ProfileT.PlayerProfile>()

// Table state
tables   = Map.empty<Text, TableT.PinballTable>()
econs    = Map.empty<Text, TableT.TableEconomy>()
seasons  = Map.empty<Text, TableT.Season>()
eggs     = Map.empty<Text, TableT.EasterEgg>()

// Gameplay state
boards         = Map.empty<Text, List.List<GameT.LeaderboardEntry>>()
replays        = Map.empty<Text, GameT.ReplayRecord>()
sessions       = Map.empty<Text, GameT.CoOpSession>()
globalTreasury : Nat = 0
charityWallet  : ?Principal = null
mysteryTable   : ?Text = null

// Platform fee (DAO-controlled only)
globalPlatformFeePct : Nat = 10

// Governance state
proposals  = Map.empty<Nat, GovT.Proposal>()
votes      = Map.empty<Text, GovT.Vote>()
nextPropId : Nat = 0

// Market state
skins        = Map.empty<Text, MarketT.SkinCollection>()
achievements = Map.empty<Text, MarketT.Achievement>()
ads          = Map.empty<Text, MarketT.AdSlot>()
icfcTreasury : Nat = 0

// Asset marketplace state
assetMap          = Map.empty<Text, AssetT.MarketAsset>()
creatorBalanceMap = Map.empty<Principal, AssetT.CreatorBalance>()
royaltyLedger     = List.empty<AssetT.AssetRoyaltyEntry>()
```

### Migration status

The project migrated from `mo:base` to `mo:core`:

- `BaseToCore.mo` exists as a migration helper
- `main.mo` imports: `Map`, `List`, `Text`, `Nat`, `Principal`, `Time`, `Runtime` from `mo:core`
- **Migration is complete in main.mo** — all data structure imports use `mo:core`
- Individual mixin files may still have legacy patterns — verify before upgrading mops

### Heartbeat

Fires every ~1 second on ICP, gated internally to ~1 hour intervals:

1. Auto-prune expired proposals (> 90 days old)
2. Rotate daily mystery table (cycle through Released tables)
3. TODO: Season payout logic (placeholder comment, not implemented)

### Platform extensions used

| Extension | Purpose |
|---|---|
| `caffeineai-authorization` | Internet Identity, RBAC, admin checks |
| `caffeineai-object-storage` | File uploads for asset marketplace |
| `caffeineai-http-outcalls` | External API calls (with `transform` function) |
| `caffeineai-stripe` | Payment processing for premium features |

---

## 17. Frontend Architecture

### Pages

| Route | File | Description |
|---|---|---|
| `/` | `HomePage.tsx` | Arcade browser, table grid, featured tables |
| `/play/:tableId` | `PlayPage.tsx` | Game canvas + HUD + overlays |
| `/constructor` | `ConstructorPage.tsx` | 9-tab table builder |
| `/governance` | `GovernancePage.tsx` | Proposal list, voting, create proposal |
| `/leaderboard` | `LeaderboardPage.tsx` | Global + per-table rankings |
| `/marketplace` | `MarketplacePage.tsx` | NFT skins, ball skins, ICFC purchases |
| `/assets` | `AssetsPage.tsx` | Asset marketplace (upload/browse/code) |
| `/profile` | `ProfilePage.tsx` | Player stats, achievements, settings |
| `/payment/success` | `PaymentSuccess.tsx` | Stripe success redirect |
| `/payment/failure` | `PaymentFailure.tsx` | Stripe failure redirect |

### Core components

| Component | File | Description |
|---|---|---|
| Layout | `components/Layout.tsx` | Header + nav + footer wrapper |
| PinballGame | `components/PinballGame.tsx` | Full Three.js game engine |
| ProfileSetupModal | `components/ProfileSetupModal.tsx` | First-time player onboarding |

### State management

| State type | Solution |
|---|---|
| Backend data | React Query (TanStack Query v5) via `hooks/useQueries.ts` |
| Game state | `useState` in PlayPage |
| Table constructor | `useState` in ConstructorPage |
| Authentication | `useInternetIdentity()` from `@caffeineai/core-infrastructure` |
| URL state | TanStack Router params |

### Design system

- **Color space**: OKLCH (perceptually uniform)
- **Key tokens**: `--background` (0.145), `--card` (0.205), `--primary` (0.7 / 280°), `--accent` (0.65 / 180°)
- **Typography**: Space Grotesk (display), Plus Jakarta Sans (body), JetBrains Mono (scores)
- **Custom utilities**: `arcade-card`, `arcade-border`, `arcade-bezel`, `neon-text-primary`, `neon-text-accent`, `score-large`, `lever-control`, `transition-smooth`
- **Detail file**: `DESIGN.md` at project root

---

## 18. Feature Status Matrix

| Feature | Status | Notes |
|---|---|---|
| Game canvas (Three.js + cannon-es) | ✅ Built | Physics works; ball rolls and drains correctly |
| Drain detection | ✅ Fixed | Was inverted in v0.1, fixed in v0.2 |
| Flippers (keyboard) | ✅ Built | A/Z (left), L// (right), Space (launch) |
| Flippers (touch mobile) | ✅ Built | TouchControls component |
| Bumper collision scoring | ✅ Built | 100 pts × multiplier per hit |
| Combo multiplier (up to 8x) | ✅ Built | Every 10 bumper hits |
| 6 default bumpers | ✅ Built | Hardcoded positions |
| Ghost trail visualization | ✅ Built | Toggle in side panel |
| Drain heatmap | ✅ Built | Canvas texture, toggle in side panel |
| Weather particles | ✅ Built | Rain, Snow, Fireflies, Confetti, Meteors, Aurora |
| 9-tab table constructor | ✅ Built | All 9 tabs functional (see Tab Status below) |
| Layout tab → physics wiring | ❌ Missing | Bumper positions not fed to physics engine |
| Visuals tab → game wiring | ⚠️ Partial | Only weatherType applied; colors/skins not applied |
| Physics tab → flipperForce | ❌ Missing | Slider exists but not wired to cannon-es |
| Physics tab → tiltSensitivity | ❌ Missing | Stored but not used |
| Flipper lag | ❌ Missing | Toggle/slider exists but not implemented |
| Sound / Web Audio | ❌ Missing | SoundTab stores URLs; no audio playback in engine |
| Ball skins | ❌ Missing | Enum defined, not applied to Three.js material |
| Bumper flash animation | ❌ Bug | handleHit disconnected from onCollide |
| Save The Ball (economy) | ✅ Built | UI prompt, backend mutation wired |
| Save The Ball (physics) | ❌ Missing | Doesn't prevent actual drain in physics |
| Nudge table | ✅ Built | Backend call, 50% tilt chance |
| Golden ball | ✅ Built | On-chain call, 3s visual overlay |
| Charity tilt | ✅ Built | Backend mutation, global treasury funded |
| Leaderboard (on-chain) | ✅ Built | Submit score + retrieve top 100 |
| Replay recording | ✅ Built | movesJson array of {timestamp, action} |
| Replay hash | ⚠️ Stub | String interpolation, not real SHA-256 |
| Replay on-chain validation | ❌ Missing | No server-side simulation |
| Governance (propose + vote) | ✅ Built | All 34 types, token-weighted voting UI |
| Governance side-effects | ⚠️ Partial | Only ChangePlatformFee has live handler |
| Asset marketplace (browse) | ✅ Built | Filter by type, search |
| Asset marketplace (file upload) | ✅ Built | GLB, MP3, textures via object-storage |
| Asset marketplace (code editor) | ✅ Built | SVG, Three.js, JSON |
| Asset DAO approval | ✅ Built | approveAsset / rejectAsset |
| Asset royalties (accrual) | ❌ Missing | Balance fields exist, never incremented |
| ICRC-7 NFT minting | ❌ Missing | Flag stored, no mint call |
| Table forking | ✅ Built | forkTable() on backend |
| Seasons | ✅ Built | createSeason(), getSeasons() |
| Easter eggs | ✅ Built | discoverEasterEgg() |
| Co-op sessions | ✅ Built | join/leaveCoOpSession() |
| Tournaments | ✅ Built | launchTournament() |
| Real ICRC-2 token transfers | ❌ Missing | All economy is bookkeeping Nat counters |
| ICFC ledger integration | ❌ Missing | Canister address known, transfers not wired |
| Daily mystery table | ✅ Built | Heartbeat rotates mysteryTable |
| Table tilt angle / physics slope | ❌ Missing | Table is flat (no Z gravity tilt) |
| Spawn protection | ❌ Missing | Ball spawns 0.2 units above drain |
| Diagnostic logging | ❌ Missing | No console.log, no Playwright, no Vitest |
| E2E tests (Playwright) | ❌ Missing | Zero test coverage |
| Unit tests (Vitest) | ❌ Missing | Zero test coverage |

---

## 19. Known Bugs & Fix Log

### Bug 001 — Drain detector inverted ✅ FIXED (v0.2.x)

**Symptom**: Clicking Play resulted in immediate Game Over.

**Root cause**: Drain condition was `if (z > DRAIN_Y + 0.3)` instead of `if (z < DRAIN_Y + 0.3)`. Since the ball spawns at `z = DRAIN_Y + 0.5 = -6.0`, which is greater than `DRAIN_Y + 0.3 = -6.2`, the drain fired immediately.

**Fix**: Inverted comparison to `if (z < DRAIN_Y + 0.3)`.

---

### Bug 002 — Ball spawn too close to drain ⚠️ OPEN

**Symptom**: Ball occasionally drains immediately after spawn with no physics action.

**Root cause**: Spawn position `z = DRAIN_Y + 0.5 = -6.0`, drain threshold `z < -6.2`. Only 0.2 world units of clearance. cannon-es can move a fast ball 0.2 units in a single frame.

**Fix needed**: Move spawn to `z = DRAIN_Y + 3.0` or higher. Or add 1-second spawn protection (ignore drain events for 1 second after ball reset).

---

### Bug 003 — Bumper flash animation disconnected ⚠️ OPEN

**Symptom**: Bumpers don't flash/glow when hit.

**Root cause**: `handleHit` (which calls `setLit(true)`) is declared inside `Bumper` but never connected. The `onCollide` on `useCylinder` uses the `onHit` prop directly, bypassing `setLit`.

**Fix needed**: Change `useCylinder` `onCollide` to use `handleHit` instead of `onHit`.

---

### Bug 004 — Flipper strength slider has no effect ⚠️ OPEN

**Symptom**: Changing flipper force in Physics tab does nothing.

**Root cause**: Flipper rotation is set via `api.rotation.set()` on a Kinematic body. Kinematic bodies don't participate in force calculations. The `table.flipperStrength` value is parsed but `void physicsConfig` suppresses it.

**Fix needed**: To simulate flipper "strength," apply a velocity impulse to the ball on flipper contact: detect ball proximity, apply `api.applyImpulse(force * flipperStrength * direction, ballPosition)`.

---

### Bug 005 — Table has no tilt angle ⚠️ OPEN

**Symptom**: Ball has no natural tendency to roll toward the drain. Players must keep the ball in play indefinitely with no challenge from gravity.

**Root cause**: Real pinball tables are angled 3–7 degrees. The game applies gravity only on Y axis (`[0, gravityY, 0]`). The flat floor plane doesn't produce any Z-axis pull.

**Fix needed**: Either tilt the floor plane 3–6° on X rotation, or add a Z-component to gravity: `gravity={[0, gravityY * cos(tilt), gravityY * sin(tilt)]}`.

---

### Bug 006 — Camera orientation causes visual confusion ⚠️ KNOWN

**Symptom**: Users report the table "looks inverted."

**Root cause**: In the current setup, the drain (bottom of the table physically) is at the most negative Z, which appears visually *farther away* from the camera. The top of the table (back wall) appears *at the top of the screen*. This matches real pinball viewing angle, but the default mental model (top = Z positive) is confused.

**Mitigation**: The orientation is technically correct for a top-down cabinet view. The real fix is tilt (Bug 005) + a visual lane guide that makes the drain more obvious. No code change required for orientation.

---

### Bug 007 — No diagnostic logging or tests ⚠️ OPEN

**Symptom**: No way to inspect physics state, no CI, no visual QA.

**Fix needed**:
1. Add Playwright E2E tests (see Skill: visual-testing-playwright)
2. Add console debug overlay showing: ball position, velocity, frame rate, drain count
3. Add Vitest unit tests for game logic (useGameLogic, score math)

---

## 20. User Stories

### Persona: Player

> I want to play pinball for ICFC tokens and compete on leaderboards.

| Story | Route | Status |
|---|---|---|
| Browse available tables | `/` | ✅ |
| Launch a game on any Released table | `/play/:tableId` | ✅ |
| Use keyboard flippers to control the ball | `/play/:tableId` | ✅ |
| Use touch controls on mobile | `/play/:tableId` | ✅ |
| See my current score and ball count during play | HUD overlay | ✅ |
| See the top 5 leaderboard while playing | Side panel | ✅ |
| Get a warning when my ball is near the drain | Save Ball prompt | ✅ |
| Pay ICFC to save my ball | Save Ball button | ✅ (UI only — no physics prevention) |
| Nudge the table for a physics boost | Nudge button | ✅ (50% tilt risk) |
| Trigger a Golden Ball for a bonus | Golden Ball button | ✅ |
| Submit my score on-chain at game over | Game Over overlay | ✅ |
| View my replay hash for dispute proof | Game Over overlay | ⚠️ Stub hash |
| Check the global leaderboard | `/leaderboard` | ✅ |
| See my profile and achievements | `/profile` | ✅ |
| Set up my display name on first login | Profile Setup Modal | ✅ |

### Persona: Table Creator

> I want to build, customize, and publish my own pinball table.

| Story | Route | Status |
|---|---|---|
| Open the 9-tab table constructor | `/constructor` | ✅ |
| Set bumper and flipper positions in Layout tab | Layout tab | ✅ (stored; not wired to physics) |
| Customize colors, theme, weather, ball skin | Visuals tab | ✅ (stored; partial engine wiring) |
| Set gravity, friction, and rebound | Physics tab | ✅ (gravity + friction + restitution wired) |
| Configure entry fees, jackpots, and referrals | Economy tab | ✅ |
| Set up ball save, extra balls, tilt rules | Ruleset tab | ✅ (stored; not all rules enforced) |
| Add metadata (name, description, tags) | Metadata tab | ✅ |
| Control who can play (public/token-gated/whitelist) | Access tab | ✅ (stored; not enforced at play) |
| Configure table-level DAO governance | DAO tab | ✅ (stored; mini-DAO not enforced) |
| Add background music and SFX URLs | Sound tab | ✅ (stored; no audio playback) |
| Save and release the table | Constructor → Publish | ✅ |
| Fork an existing table as a template | Table card → Fork | ✅ |
| Launch a tournament on my table | Profile / Constructor | ✅ |

### Persona: Asset Creator

> I want to upload 3D models and sounds for the pinball marketplace and earn ICFC royalties.

| Story | Route | Status |
|---|---|---|
| Browse existing assets | `/assets` → Browse tab | ✅ |
| Upload a GLB 3D model or MP3 sound | `/assets` → Upload Files tab | ✅ |
| Submit SVG / Three.js code | `/assets` → Submit Code tab | ✅ |
| Preview my uploaded asset before submission | Upload flow | ✅ (3D viewer for GLB, audio player for MP3) |
| See my asset go into DAO approval queue | Assets list → Pending | ✅ |
| Track royalties earned from my assets | Profile page / creator balance | ⚠️ Balance exists, never incremented |
| Claim royalties | Creator balance → Claim | ❌ Not yet functional |
| Mint my asset as an ICRC-7 NFT | Asset submission form | ❌ Not implemented |

### Persona: DAO Voter

> I want to participate in platform governance and control the direction of PinballHEIR.

| Story | Route | Status |
|---|---|---|
| View all open proposals | `/governance` | ✅ |
| Vote Yes/No/Abstain with my ICFC weight | Proposal card → Vote | ✅ |
| Create a new governance proposal | Governance → Create | ✅ (all 34 types) |
| Execute a passed proposal | Proposal card → Execute | ✅ (ChangePlatformFee has effect) |
| Propose a platform fee change | Create proposal → ChangePlatformFee | ✅ Live side-effect |
| Propose uploading a new physics engine | Create proposal → UploadNewPhysicsEngine | ⚠️ Stored only |
| Vote to approve/reject marketplace assets | Asset queue → Vote | ✅ |
| View voting power display | Governance page | ✅ |
| See stake burned on rejected proposals | Governance page | ⚠️ Field exists, burn not executed |

---

## 21. External Review Notes (Grok)

*Incorporated from Grok's review, May 2026.*

### Recommended repos (physics)

| Repo | Fit | Notes |
|---|---|---|
| [patrick-s-young/pinball-xr](https://github.com/patrick-s-young/pinball-xr) | **Primary** | Three.js + cannon-es, full pinball table, MIT, already our stack |
| [vpdb/vpx-js](https://github.com/vpdb/vpx-js) | Future upgrade | Full Visual Pinball X physics, GPLv2, realistic feel |
| [Birch-san/box2d-wasm](https://github.com/Birch-san/box2d-wasm) | Replay validation | Deterministic, classic Box2D, good for on-chain simulation |
| fishshiz/pinball-wizard | Lightweight alt | Matter.js + 2D canvas, simple baseline |

### DAO recommendation

Use DFINITY's official [SNS framework](https://github.com/dfinity/awesome-internet-computer#dao-frameworks) or [ICP Governor](https://github.com/redsteep/dfinity-icp-governor) for production governance rather than the current hand-rolled Motoko implementation. The current implementation is functional but lacks the battle-testing and neuron-staking mechanics of SNS.

### Must-add items (from Grok, all now spec'd)

| Item | Status in this build |
|---|---|
| Deterministic replay validation | ⚠️ Stub (real implementation requires WASM engine) |
| Sound & Music tab (tab 9) | ✅ Built (storage layer done; audio playback pending) |
| Touch / mobile controls | ✅ Built |
| Table forking | ✅ Built |
| Referral rewards configurable per table | ✅ Built (stored in TableEconomy) |

### Recommended next priorities

1. **Fix spawn protection** (Bug 002) — trivial, high impact
2. **Add Z-axis gravity tilt** (Bug 005) — core gameplay feel
3. **Wire bumper flash animation** (Bug 003) — visual polish
4. **Wire flipperForce to impulse** (Bug 004) — gameplay depth
5. **Implement Web Audio** for bumper/drain/jackpot sounds
6. **Playwright E2E tests** for drain detection, score submission, physics smoke test
7. **Real SHA-256 hash** for replay proof (SubtleCrypto API in browser)
8. **ICRC-2 token transfers** to make economy functional
9. **Wire layout bumper positions** to physics engine

---

*End of SPECS.md*

> To update this document: file a PR with changes targeting the section(s) that changed. For major architecture changes, update the Feature Status Matrix and Known Bugs sections simultaneously.
