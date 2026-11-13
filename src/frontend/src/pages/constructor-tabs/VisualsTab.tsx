import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type {
  BallSkinType,
  LightThemeType,
  PinballTableVisual,
} from "@/types/index";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { RadioCardGroup } from "../ConstructorPage";

const THEMES = [
  { value: "Cyberpunk", label: "Cyberpunk", icon: "🌆" },
  { value: "Space", label: "Space", icon: "🚀" },
  { value: "Ocean", label: "Ocean", icon: "🌊" },
  { value: "Forest", label: "Forest", icon: "🌲" },
  { value: "Inferno", label: "Inferno", icon: "🔥" },
  { value: "Custom", label: "Custom", icon: "🎨" },
];

const WEATHER = [
  { value: "None", label: "None", icon: "☀️" },
  { value: "Rain", label: "Rain", icon: "🌧️" },
  { value: "Snow", label: "Snow", icon: "❄️" },
  { value: "Fireflies", label: "Fireflies", icon: "🌟" },
  { value: "NorthernLights", label: "Aurora", icon: "🌌" },
  { value: "Confetti", label: "Confetti", icon: "🎊" },
  { value: "MeteorShower", label: "Meteors", icon: "☄️" },
];

const BALL_SKINS = [
  { value: "Classic", label: "Classic", icon: "⚫" },
  { value: "Chrome", label: "Chrome", icon: "⚪" },
  { value: "NeonPurple", label: "Neon Purple", icon: "🟣" },
  { value: "NeonCyan", label: "Neon Cyan", icon: "🔵" },
  { value: "Holographic", label: "Holographic", icon: "🌈" },
  { value: "Fire", label: "Fire", icon: "🔴" },
  { value: "Ice", label: "Ice", icon: "🧊" },
  { value: "Galaxy", label: "Galaxy", icon: "🌌" },
];

function getBallGradient(skin: string) {
  switch (skin) {
    case "Fire":
      return "radial-gradient(circle at 35% 35%, #ff7700, #cc2200)";
    case "Ice":
      return "radial-gradient(circle at 35% 35%, #aaddff, #2266ff)";
    case "NeonPurple":
      return "radial-gradient(circle at 35% 35%, #dd88ff, #7700cc)";
    case "NeonCyan":
      return "radial-gradient(circle at 35% 35%, #88ffee, #0099aa)";
    case "Galaxy":
      return "radial-gradient(circle at 35% 35%, #9966ff, #220066)";
    case "Holographic":
      return "radial-gradient(circle at 35% 35%, #ffccff, #66aaff, #aaffcc)";
    default:
      return "radial-gradient(circle at 35% 35%, #e0e0e0, #888888)";
  }
}

function ColorPickerField({
  label,
  value,
  defaultVal,
  ocidBase,
  onChange,
}: {
  label: string;
  value?: string;
  defaultVal: string;
  ocidBase: string;
  onChange: (v: string) => void;
}) {
  const current = value ?? defaultVal;
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={current}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded border border-input bg-transparent cursor-pointer shrink-0"
          data-ocid={`${ocidBase}.color_picker`}
        />
        <Input
          value={current}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-xs font-mono"
          data-ocid={`${ocidBase}.hex_input`}
        />
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  ocid,
  formatValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  ocid: string;
  formatValue: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="score-display text-xs" data-ocid={`${ocid}.value`}>
          {formatValue(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        data-ocid={ocid}
      />
    </div>
  );
}

function CollapsibleSection({
  title,
  ocid,
  children,
}: {
  title: string;
  ocid: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="arcade-border bg-card/50">
      <CardHeader className="pb-0">
        <button
          type="button"
          className="flex items-center justify-between w-full group"
          onClick={() => setOpen((o) => !o)}
          data-ocid={`${ocid}.toggle`}
          aria-expanded={open}
        >
          <CardTitle className="text-sm font-display text-primary">
            {title}
          </CardTitle>
          {open ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </button>
      </CardHeader>
      {open && <CardContent className="pt-4 space-y-4">{children}</CardContent>}
    </Card>
  );
}

export default function VisualsTab({
  visual,
  onChange,
}: {
  visual: PinballTableVisual;
  onChange: (v: PinballTableVisual) => void;
}) {
  const weather = (visual as { weatherType?: string }).weatherType ?? "None";

  return (
    <div className="space-y-5">
      {/* Colors */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ColorPickerField
              label="Background Color"
              value={visual.primaryColor}
              defaultVal="#7c3aed"
              ocidBase="visual.primary_color"
              onChange={(v) => onChange({ ...visual, primaryColor: v })}
            />
            <ColorPickerField
              label="Felt / Surface Color"
              value={visual.secondaryColor}
              defaultVal="#06b6d4"
              ocidBase="visual.secondary_color"
              onChange={(v) => onChange({ ...visual, secondaryColor: v })}
            />
            <ColorPickerField
              label="Accent Color"
              value={visual.accentColor}
              defaultVal="#ff007a"
              ocidBase="visual.accent_color"
              onChange={(v) => onChange({ ...visual, accentColor: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioCardGroup
            label=""
            value={(visual.lightTheme as string) ?? "Cyberpunk"}
            options={THEMES}
            onChange={(v) =>
              onChange({ ...visual, lightTheme: v as LightThemeType })
            }
            ocid="visual.theme"
            cols={3}
          />
        </CardContent>
      </Card>

      {/* Weather particles */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Weather Particles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioCardGroup
            label=""
            value={weather}
            options={WEATHER}
            onChange={(v) => onChange({ ...visual, ...{ weatherType: v } })}
            ocid="visual.weather"
            cols={4}
          />
        </CardContent>
      </Card>

      {/* Ball skin */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Ball Skin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioCardGroup
            label=""
            value={(visual.ballSkin as string) ?? "Chrome"}
            options={BALL_SKINS}
            onChange={(v) =>
              onChange({ ...visual, ballSkin: v as BallSkinType })
            }
            ocid="visual.ball_skin"
            cols={4}
          />
          {/* Ball preview */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border/30">
            <div
              className="w-10 h-10 rounded-full shrink-0 transition-all duration-300"
              style={{
                background: getBallGradient(
                  (visual.ballSkin as string) ?? "Chrome",
                ),
                boxShadow: visual.enableNeonGlow
                  ? "0 0 16px oklch(0.7 0.25 280 / 0.6), 0 0 32px oklch(0.7 0.25 280 / 0.3)"
                  : "none",
              }}
            />
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">
                {(visual.ballSkin as string) ?? "Chrome"} Ball
              </p>
              <p>{visual.enableNeonGlow ? "Neon glow active" : "No glow"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background image */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Background Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="https://example.com/background.jpg"
            value={visual.backgroundImage ?? ""}
            onChange={(e) =>
              onChange({ ...visual, backgroundImage: e.target.value })
            }
            className="text-xs"
            data-ocid="visual.bg_image.input"
          />
          {visual.backgroundImage && (
            <div className="relative overflow-hidden rounded-lg h-24 bg-muted/20 border border-border/30">
              <img
                src={visual.backgroundImage}
                alt="Background preview"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visual Effects toggles */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Visual Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="lever-control">
            <Switch
              checked={visual.enableNeonGlow ?? true}
              onCheckedChange={(v) =>
                onChange({ ...visual, enableNeonGlow: v })
              }
              data-ocid="visual.neon_glow.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">
                Glowing bumpers, flippers, and ball trail
              </Label>
              <p className="text-xs text-muted-foreground">
                Neon glow on all playfield elements
              </p>
            </div>
          </div>
          <div className="lever-control">
            <Switch
              checked={visual.enableParticleEffects ?? true}
              onCheckedChange={(v) =>
                onChange({ ...visual, enableParticleEffects: v })
              }
              data-ocid="visual.particles.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">
                Sparks on bumper hits and jackpot bursts
              </Label>
              <p className="text-xs text-muted-foreground">
                Particle effects on collisions and scoring events
              </p>
            </div>
          </div>
          <div className="lever-control">
            <Switch
              checked={visual.ballTrailEffect ?? true}
              onCheckedChange={(v) =>
                onChange({ ...visual, ballTrailEffect: v })
              }
              data-ocid="visual.ball_trail.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">
                Ball trail effect
              </Label>
              <p className="text-xs text-muted-foreground">
                Motion trail following the ball during play
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bumper Settings — collapsible */}
      <CollapsibleSection title="Bumper Settings" ocid="visual.bumper_settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPickerField
            label="Bumper Color"
            value={visual.bumperColor}
            defaultVal="#7c3aed"
            ocidBase="visual.bumper_color"
            onChange={(v) => onChange({ ...visual, bumperColor: v })}
          />
          <ColorPickerField
            label="Bumper Glow Color"
            value={visual.bumperGlowColor}
            defaultVal="#ff007a"
            ocidBase="visual.bumper_glow_color"
            onChange={(v) => onChange({ ...visual, bumperGlowColor: v })}
          />
          <ColorPickerField
            label="Bumper Hit Flash Color"
            value={visual.bumperHitFlashColor}
            defaultVal="#ffffff"
            ocidBase="visual.bumper_flash_color"
            onChange={(v) => onChange({ ...visual, bumperHitFlashColor: v })}
          />
        </div>
        <SliderRow
          label="Bumper Size"
          value={visual.bumperSize ?? 1.0}
          min={0.5}
          max={2.0}
          step={0.1}
          ocid="visual.bumper_size"
          formatValue={(v) => `${v.toFixed(1)}x`}
          onChange={(v) => onChange({ ...visual, bumperSize: v })}
        />
        <SliderRow
          label="Bumper Glow Intensity"
          value={visual.bumperGlowIntensity ?? 5}
          min={0}
          max={10}
          step={1}
          ocid="visual.bumper_glow_intensity"
          formatValue={(v) => String(v)}
          onChange={(v) => onChange({ ...visual, bumperGlowIntensity: v })}
        />
      </CollapsibleSection>

      {/* Flipper Settings — collapsible */}
      <CollapsibleSection
        title="Flipper Settings"
        ocid="visual.flipper_settings"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorPickerField
            label="Flipper Color"
            value={visual.flipperColor}
            defaultVal="#06b6d4"
            ocidBase="visual.flipper_color"
            onChange={(v) => onChange({ ...visual, flipperColor: v })}
          />
          <ColorPickerField
            label="Flipper Glow Color"
            value={visual.flipperGlowColor}
            defaultVal="#7c3aed"
            ocidBase="visual.flipper_glow_color"
            onChange={(v) => onChange({ ...visual, flipperGlowColor: v })}
          />
        </div>
        <SliderRow
          label="Flipper Length"
          value={visual.flipperLength ?? 1.0}
          min={0.5}
          max={2.0}
          step={0.1}
          ocid="visual.flipper_length"
          formatValue={(v) => `${v.toFixed(1)}x`}
          onChange={(v) => onChange({ ...visual, flipperLength: v })}
        />
        <SliderRow
          label="Flipper Thickness"
          value={visual.flipperThickness ?? 1.0}
          min={0.5}
          max={2.0}
          step={0.1}
          ocid="visual.flipper_thickness"
          formatValue={(v) => `${v.toFixed(1)}x`}
          onChange={(v) => onChange({ ...visual, flipperThickness: v })}
        />
        <SliderRow
          label="Flipper Glow Intensity"
          value={visual.flipperGlowIntensity ?? 5}
          min={0}
          max={10}
          step={1}
          ocid="visual.flipper_glow_intensity"
          formatValue={(v) => String(v)}
          onChange={(v) => onChange({ ...visual, flipperGlowIntensity: v })}
        />
      </CollapsibleSection>
    </div>
  );
}
