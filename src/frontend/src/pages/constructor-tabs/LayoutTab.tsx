import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  BumperConfig,
  FlipperConfig,
  PinballTableLayout,
} from "@/types/index";
import { Plus, Trash2 } from "lucide-react";
import { RadioCardGroup, SliderField } from "../ConstructorPage";

const plungerOptions = [
  { value: "spring", label: "Spring", icon: "🌀" },
  { value: "auto", label: "Auto", icon: "⚡" },
  { value: "digital", label: "Digital", icon: "🎮" },
];

const WALLS = ["Left", "Right", "Top", "Bottom"] as const;

export default function LayoutTab({
  layout,
  onChange,
}: {
  layout: PinballTableLayout;
  onChange: (l: PinballTableLayout) => void;
}) {
  const bumpers = layout.bumpers ?? [];
  const flippers = layout.flippers ?? [];
  const ramps = layout.ramps ?? [];

  const addBumper = () => {
    onChange({
      ...layout,
      bumpers: [
        ...bumpers,
        { id: `b${Date.now()}`, x: 200, y: 300, radius: 20, points: 100 },
      ],
    });
  };
  const removeBumper = (id: string) =>
    onChange({ ...layout, bumpers: bumpers.filter((b) => b.id !== id) });
  const updateBumper = (id: string, patch: Partial<BumperConfig>) =>
    onChange({
      ...layout,
      bumpers: bumpers.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    });

  const addFlipper = () => {
    onChange({
      ...layout,
      flippers: [
        ...flippers,
        {
          id: `f${Date.now()}`,
          side: "left",
          x: 150,
          y: 800,
          length: 90,
          angle: -30,
        },
      ],
    });
  };
  const removeFlipper = (id: string) =>
    onChange({ ...layout, flippers: flippers.filter((f) => f.id !== id) });
  const updateFlipper = (id: string, patch: Partial<FlipperConfig>) =>
    onChange({
      ...layout,
      flippers: flippers.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    });

  const addRamp = () =>
    onChange({
      ...layout,
      ramps: [
        ...ramps,
        {
          id: `r${Date.now()}`,
          x: 200,
          y: 200,
          width: 60,
          height: 20,
          angle: 30,
          points: 200,
        },
      ],
    });
  const removeRamp = (id: string) =>
    onChange({ ...layout, ramps: ramps.filter((r) => r.id !== id) });

  return (
    <div className="space-y-5">
      {/* Canvas preview */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Table Preview (Schematic)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="relative mx-auto bg-background/80 border-2 border-accent/30 rounded overflow-hidden"
            style={{ width: "min(100%, 320px)", aspectRatio: "400/900" }}
          >
            <svg
              viewBox="0 0 400 900"
              className="w-full h-full"
              role="img"
              aria-label="Table layout preview"
            >
              <title>Pinball table layout schematic</title>
              {/* Field background */}
              <rect
                x="0"
                y="0"
                width="400"
                height="900"
                fill="oklch(0.145 0 0)"
              />
              {/* Grid */}
              {[
                0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260,
                280, 300, 320, 340, 360, 380,
              ].map((x) => (
                <line
                  key={`vg-${x}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="900"
                  stroke="oklch(1 0 0 / 0.04)"
                  strokeWidth="0.5"
                />
              ))}
              {[
                0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260,
                280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480, 500, 520,
                540, 560, 580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780,
                800, 820, 840, 860, 880,
              ].map((y) => (
                <line
                  key={`hg-${y}`}
                  x1="0"
                  y1={y}
                  x2="400"
                  y2={y}
                  stroke="oklch(1 0 0 / 0.04)"
                  strokeWidth="0.5"
                />
              ))}
              {/* Drain */}
              <rect
                x={(400 - (layout.drainWidth ?? 0.22) * 400) / 2}
                y="870"
                width={(layout.drainWidth ?? 0.22) * 400}
                height="30"
                fill="oklch(0.704 0.191 22 / 0.3)"
                rx="2"
              />
              <text
                x="200"
                y="890"
                textAnchor="middle"
                fontSize="8"
                fill="oklch(0.708 0 0)"
              >
                DRAIN
              </text>
              {/* Bumpers */}
              {bumpers.map((b) => (
                <g key={b.id}>
                  <circle
                    cx={b.x}
                    cy={b.y}
                    r={b.radius}
                    fill="oklch(0.7 0.25 280 / 0.3)"
                    stroke="oklch(0.7 0.25 280 / 0.8)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={b.x}
                    y={b.y + 4}
                    textAnchor="middle"
                    fontSize="7"
                    fill="oklch(0.985 0 0)"
                  >
                    {b.points}
                  </text>
                </g>
              ))}
              {/* Flippers */}
              {flippers.map((f) => (
                <rect
                  key={f.id}
                  x={f.side === "left" ? f.x : f.x - f.length}
                  y={f.y - 6}
                  width={f.length}
                  height="12"
                  rx="6"
                  fill="oklch(0.65 0.28 180 / 0.5)"
                  stroke="oklch(0.65 0.28 180 / 0.9)"
                  strokeWidth="1.5"
                  transform={`rotate(${f.angle}, ${f.x}, ${f.y})`}
                />
              ))}
              {/* Ramps */}
              {ramps.map((r) => (
                <rect
                  key={r.id}
                  x={r.x - r.width / 2}
                  y={r.y - r.height / 2}
                  width={r.width}
                  height={r.height}
                  fill="oklch(0.75 0.25 60 / 0.3)"
                  stroke="oklch(0.75 0.25 60 / 0.7)"
                  strokeWidth="1.5"
                  rx="3"
                  transform={`rotate(${r.angle}, ${r.x}, ${r.y})`}
                />
              ))}
              {/* Plunger */}
              <circle
                cx={layout.plungerX ?? 370}
                cy={layout.plungerY ?? 700}
                r="8"
                fill="oklch(0.75 0.25 60 / 0.5)"
                stroke="oklch(0.75 0.25 60 / 0.9)"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            {bumpers.length} bumpers · {flippers.length} flippers ·{" "}
            {ramps.length} ramps
          </p>
        </CardContent>
      </Card>

      {/* Bumpers */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display text-primary">
              Bumpers ({bumpers.length}/20)
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={addBumper}
              disabled={bumpers.length >= 20}
              data-ocid="layout.bumper.add_button"
              className="h-7 gap-1 text-xs"
            >
              <Plus className="w-3 h-3" /> Add Bumper
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {bumpers.length === 0 && (
            <p
              className="text-xs text-muted-foreground text-center py-2"
              data-ocid="layout.bumpers.empty_state"
            >
              No bumpers yet — add up to 20
            </p>
          )}
          {bumpers.map((b, i) => (
            <div
              key={b.id}
              className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end"
              data-ocid={`layout.bumper.item.${i + 1}`}
            >
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">X</Label>
                <Input
                  type="number"
                  value={b.x}
                  onChange={(e) => updateBumper(b.id, { x: +e.target.value })}
                  className="h-7 text-xs"
                  data-ocid={`layout.bumper.x.${i + 1}`}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Y</Label>
                <Input
                  type="number"
                  value={b.y}
                  onChange={(e) => updateBumper(b.id, { y: +e.target.value })}
                  className="h-7 text-xs"
                  data-ocid={`layout.bumper.y.${i + 1}`}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Points</Label>
                <Input
                  type="number"
                  value={b.points}
                  onChange={(e) =>
                    updateBumper(b.id, { points: +e.target.value })
                  }
                  className="h-7 text-xs"
                  data-ocid={`layout.bumper.points.${i + 1}`}
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => removeBumper(b.id)}
                data-ocid={`layout.bumper.delete_button.${i + 1}`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Flippers */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display text-primary">
              Flippers ({flippers.length}/4)
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={addFlipper}
              disabled={flippers.length >= 4}
              data-ocid="layout.flipper.add_button"
              className="h-7 gap-1 text-xs"
            >
              <Plus className="w-3 h-3" /> Add Flipper
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {flippers.length === 0 && (
            <p
              className="text-xs text-muted-foreground text-center py-2"
              data-ocid="layout.flippers.empty_state"
            >
              No flippers yet
            </p>
          )}
          {flippers.map((f, i) => (
            <div
              key={f.id}
              className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end"
              data-ocid={`layout.flipper.item.${i + 1}`}
            >
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">X</Label>
                <Input
                  type="number"
                  value={f.x}
                  onChange={(e) => updateFlipper(f.id, { x: +e.target.value })}
                  className="h-7 text-xs"
                  data-ocid={`layout.flipper.x.${i + 1}`}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Y</Label>
                <Input
                  type="number"
                  value={f.y}
                  onChange={(e) => updateFlipper(f.id, { y: +e.target.value })}
                  className="h-7 text-xs"
                  data-ocid={`layout.flipper.y.${i + 1}`}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Side</Label>
                <select
                  value={f.side}
                  onChange={(e) =>
                    updateFlipper(f.id, {
                      side: e.target.value as "left" | "right",
                    })
                  }
                  className="h-7 w-full text-xs rounded-md border border-input bg-background px-2"
                  data-ocid={`layout.flipper.side.${i + 1}`}
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => removeFlipper(f.id)}
                data-ocid={`layout.flipper.delete_button.${i + 1}`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ramps */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display text-primary">
              Ramps ({ramps.length}/8)
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={addRamp}
              disabled={ramps.length >= 8}
              data-ocid="layout.ramp.add_button"
              className="h-7 gap-1 text-xs"
            >
              <Plus className="w-3 h-3" /> Add Ramp
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {ramps.length === 0 && (
            <p
              className="text-xs text-muted-foreground text-center py-2"
              data-ocid="layout.ramps.empty_state"
            >
              No ramps yet
            </p>
          )}
          {ramps.map((r, i) => (
            <div
              key={r.id}
              className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end"
              data-ocid={`layout.ramp.item.${i + 1}`}
            >
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Angle (°)
                </Label>
                <Input
                  type="number"
                  min={15}
                  max={75}
                  value={r.angle}
                  onChange={(e) =>
                    onChange({
                      ...layout,
                      ramps: ramps.map((rp) =>
                        rp.id === r.id ? { ...rp, angle: +e.target.value } : rp,
                      ),
                    })
                  }
                  className="h-7 text-xs"
                  data-ocid={`layout.ramp.angle.${i + 1}`}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Points</Label>
                <Input
                  type="number"
                  value={r.points}
                  onChange={(e) =>
                    onChange({
                      ...layout,
                      ramps: ramps.map((rp) =>
                        rp.id === r.id
                          ? { ...rp, points: +e.target.value }
                          : rp,
                      ),
                    })
                  }
                  className="h-7 text-xs"
                  data-ocid={`layout.ramp.points.${i + 1}`}
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => removeRamp(r.id)}
                data-ocid={`layout.ramp.delete_button.${i + 1}`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Drain & Plunger */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Drain & Plunger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderField
            label="Drain Width"
            value={layout.drainWidth ?? 0.22}
            min={0.1}
            max={0.5}
            step={0.01}
            onChange={(v) => onChange({ ...layout, drainWidth: v })}
            formatValue={(v) => `${(v * 100).toFixed(0)}%`}
            descriptors={["10% Tight", "22% Normal", "50% Wide"]}
            ocid="layout.drain_width"
          />
          <RadioCardGroup
            label="Plunger Type"
            value={(layout as { plungerType?: string }).plungerType ?? "spring"}
            options={
              plungerOptions as {
                value: string;
                label: string;
                icon?: string;
              }[]
            }
            onChange={(v) =>
              onChange({
                ...layout,
                ...{ plungerType: v },
              } as PinballTableLayout)
            }
            ocid="layout.plunger_type"
          />
        </CardContent>
      </Card>

      {/* Walls */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Walls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {WALLS.map((wall) => (
              <div key={wall} className="lever-control justify-between">
                <Label className="text-xs">{wall} Wall</Label>
                <span className="text-xs text-accent font-mono">Active</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Wall collision is always enabled. Customize via Physics tab.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
