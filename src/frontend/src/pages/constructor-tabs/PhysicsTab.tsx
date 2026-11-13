import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PinballTablePhysics } from "@/types/index";
import { AlertTriangle } from "lucide-react";
import { RadioCardGroup, SliderField } from "../ConstructorPage";

type Preset = "easy" | "medium" | "hard" | "extreme";

const PRESETS: Record<Preset, Partial<PinballTablePhysics>> = {
  easy: {
    gravity: 6.5,
    flipperForce: 350,
    restitution: 0.9,
    friction: 0.03,
    tiltSensitivity: 2,
  },
  medium: {
    gravity: 9.8,
    flipperForce: 300,
    restitution: 0.85,
    friction: 0.05,
    tiltSensitivity: 5,
  },
  hard: {
    gravity: 13.0,
    flipperForce: 260,
    restitution: 0.78,
    friction: 0.08,
    tiltSensitivity: 7,
  },
  extreme: {
    gravity: 17.5,
    flipperForce: 220,
    restitution: 0.7,
    friction: 0.12,
    tiltSensitivity: 9,
  },
};

const PRESET_OPTIONS = [
  { value: "easy", label: "Easy", icon: "🌙" },
  { value: "medium", label: "Medium", icon: "⚖️" },
  { value: "hard", label: "Hard", icon: "💪" },
  { value: "extreme", label: "Extreme", icon: "🔥" },
];

export default function PhysicsTab({
  physics,
  onChange,
}: {
  physics: PinballTablePhysics;
  onChange: (p: PinballTablePhysics) => void;
}) {
  const enableFlipperLag =
    (physics as { enableFlipperLag?: boolean }).enableFlipperLag ?? false;
  const flipperLagMs =
    (physics as { flipperLagMs?: number }).flipperLagMs ?? 80;

  const applyPreset = (preset: Preset) => {
    onChange({ ...physics, ...PRESETS[preset] });
  };

  return (
    <div className="space-y-5">
      {/* Presets */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Difficulty Presets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioCardGroup
            label=""
            value=""
            options={PRESET_OPTIONS}
            onChange={(v) => applyPreset(v as Preset)}
            ocid="physics.preset"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Presets set gravity, flipper strength, and tilt — fine-tune below.
          </p>
        </CardContent>
      </Card>

      {/* Core physics */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Core Physics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderField
            label="Gravity (m/s²)"
            value={physics.gravity ?? 9.8}
            min={0.5}
            max={20}
            step={0.1}
            onChange={(v) => onChange({ ...physics, gravity: v })}
            formatValue={(v) => `${v.toFixed(1)} m/s²`}
            descriptors={["0.5 Floaty", "9.8 Earth", "20 Heavy"]}
            hint="Higher = ball falls faster. Earth gravity is 9.8."
            ocid="physics.gravity"
          />
          <SliderField
            label="Flipper Strength"
            value={physics.flipperForce ?? 300}
            min={0}
            max={500}
            step={10}
            onChange={(v) => onChange({ ...physics, flipperForce: v })}
            formatValue={(v) => `${v.toFixed(0)} N`}
            descriptors={["0 Dead", "300 Normal", "500 Rocket"]}
            hint="Newton-impulse applied to ball on flipper contact."
            ocid="physics.flipper_strength"
          />
          <SliderField
            label="Rebound Coefficient (bounciness)"
            value={physics.restitution ?? 0.85}
            min={0.5}
            max={1.5}
            step={0.01}
            onChange={(v) => onChange({ ...physics, restitution: v })}
            formatValue={(v) => v.toFixed(2)}
            descriptors={["0.5 Soft", "0.85 Normal", "1.5 Super"]}
            ocid="physics.rebound"
          />
          <SliderField
            label="Friction Coefficient (surface grip)"
            value={physics.friction ?? 0.05}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => onChange({ ...physics, friction: v })}
            formatValue={(v) => v.toFixed(2)}
            descriptors={["0 Ice", "0.05 Normal", "1 Sticky"]}
            ocid="physics.friction"
          />
          <SliderField
            label="Tilt Sensitivity"
            value={physics.tiltSensitivity ?? 5}
            min={0}
            max={10}
            step={0.5}
            onChange={(v) => onChange({ ...physics, tiltSensitivity: v })}
            formatValue={(v) => (v === 0 ? "Off" : v.toFixed(1))}
            descriptors={["0 Off", "5 Normal", "10 Hair-trigger"]}
            ocid="physics.tilt_sensitivity"
          />
        </CardContent>
      </Card>

      {/* Flipper lag */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Flipper Lag
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="lever-control">
            <Switch
              checked={enableFlipperLag}
              onCheckedChange={(v) =>
                onChange({ ...physics, ...{ enableFlipperLag: v } })
              }
              data-ocid="physics.flipper_lag.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">
                Enable Random Flipper Lag
              </Label>
              <p className="text-xs text-muted-foreground">
                Adds 50–150ms random delay for advanced difficulty
              </p>
            </div>
          </div>
          {enableFlipperLag && (
            <>
              <SliderField
                label="Lag Duration"
                value={flipperLagMs}
                min={50}
                max={150}
                step={5}
                onChange={(v) =>
                  onChange({ ...physics, ...{ flipperLagMs: v } })
                }
                formatValue={(v) => `${v.toFixed(0)}ms`}
                ocid="physics.flipper_lag_ms"
              />
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  Warning: Flipper lag makes the table significantly harder.
                  Recommend only for Expert tables.
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
