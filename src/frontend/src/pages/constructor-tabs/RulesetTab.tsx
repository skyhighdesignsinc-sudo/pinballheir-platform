import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PinballTableRuleset } from "@/types/index";
import { SliderField } from "../ConstructorPage";

export default function RulesetTab({
  ruleset,
  onChange,
}: {
  ruleset: PinballTableRuleset;
  onChange: (r: PinballTableRuleset) => void;
}) {
  const coopEnabled =
    (ruleset as { coopEnabled?: boolean }).coopEnabled ?? false;
  const coopMaxPlayers =
    (ruleset as { coopMaxPlayers?: number }).coopMaxPlayers ?? 2;
  const bumperMultiplier =
    (ruleset as { bumperMultiplier?: number }).bumperMultiplier ?? 1;
  const rampMultiplier =
    (ruleset as { rampMultiplier?: number }).rampMultiplier ?? 1;
  const comboStreak = (ruleset as { comboStreak?: number }).comboStreak ?? 10;
  const extraBallEnabled = ruleset.extraBallEnabled ?? false;
  const extraBallThreshold = ruleset.extraBallThreshold ?? 100000;

  return (
    <div className="space-y-5">
      {/* Tilt */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Tilt Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="lever-control">
            <Switch
              checked={ruleset.tiltEnabled ?? true}
              onCheckedChange={(v) => onChange({ ...ruleset, tiltEnabled: v })}
              data-ocid="ruleset.tilt.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">Tilt Enabled</Label>
              <p className="text-xs text-muted-foreground">
                Player can tilt the table to influence the ball
              </p>
            </div>
          </div>
          {ruleset.tiltEnabled && (
            <SliderField
              label="Tilt Warnings Before Drain"
              value={ruleset.tiltWarnings ?? 3}
              min={1}
              max={10}
              step={1}
              onChange={(v) => onChange({ ...ruleset, tiltWarnings: v })}
              formatValue={(v) => `${v} warning${v !== 1 ? "s" : ""}`}
              descriptors={["1 Strict", "3 Normal", "10 Lenient"]}
              ocid="ruleset.tilt_warnings"
            />
          )}
        </CardContent>
      </Card>

      {/* Ball rules */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Ball Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Balls Per Game
            </Label>
            <Input
              type="number"
              min={1}
              max={9}
              value={ruleset.ballsPerGame ?? 3}
              onChange={(e) =>
                onChange({
                  ...ruleset,
                  ballsPerGame: Math.max(1, Math.min(9, +e.target.value)),
                })
              }
              className="w-24"
              data-ocid="ruleset.balls_per_game.input"
            />
          </div>

          <div className="lever-control">
            <Switch
              checked={ruleset.ballSaveEnabled ?? true}
              onCheckedChange={(v) =>
                onChange({ ...ruleset, ballSaveEnabled: v })
              }
              data-ocid="ruleset.ball_save.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">Ball Saver</Label>
              <p className="text-xs text-muted-foreground">
                Grace period at ball launch
              </p>
            </div>
          </div>

          {ruleset.ballSaveEnabled && (
            <SliderField
              label="Ball Save Window"
              value={ruleset.ballSaveDurationSecs ?? 3}
              min={0.2}
              max={5}
              step={0.2}
              onChange={(v) =>
                onChange({ ...ruleset, ballSaveDurationSecs: v })
              }
              formatValue={(v) => `${v.toFixed(1)}s`}
              descriptors={["0.2s Tight", "3s Normal", "5s Easy"]}
              ocid="ruleset.ball_save_window"
            />
          )}

          <div className="lever-control">
            <Switch
              checked={extraBallEnabled}
              onCheckedChange={(v) =>
                onChange({ ...ruleset, extraBallEnabled: v })
              }
              data-ocid="ruleset.extra_ball.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">Extra Ball</Label>
              <p className="text-xs text-muted-foreground">
                Award extra ball at a score threshold
              </p>
            </div>
          </div>

          {extraBallEnabled && (
            <div className="space-y-2">
              <Label className="text-sm font-display font-medium">
                Score Threshold for Extra Ball
              </Label>
              <Input
                type="number"
                min={1000}
                step={5000}
                value={extraBallThreshold}
                onChange={(e) =>
                  onChange({ ...ruleset, extraBallThreshold: +e.target.value })
                }
                className="w-48 font-mono"
                data-ocid="ruleset.extra_ball_threshold.input"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bonus rules */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Bonus Multipliers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="lever-control">
            <Switch
              checked={ruleset.bonusMultiplierEnabled ?? true}
              onCheckedChange={(v) =>
                onChange({ ...ruleset, bonusMultiplierEnabled: v })
              }
              data-ocid="ruleset.bonus.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">
                Enable Bonus Multipliers
              </Label>
            </div>
          </div>

          {ruleset.bonusMultiplierEnabled && (
            <>
              <SliderField
                label="Bumper Hit Multiplier (max)"
                value={bumperMultiplier}
                min={1}
                max={5}
                step={1}
                onChange={(v) =>
                  onChange({ ...ruleset, ...{ bumperMultiplier: v } })
                }
                formatValue={(v) => `${v}×`}
                descriptors={["1× Off", "3× Normal", "5× Max"]}
                ocid="ruleset.bumper_multiplier"
              />
              <SliderField
                label="Ramp Multiplier (max)"
                value={rampMultiplier}
                min={1}
                max={3}
                step={1}
                onChange={(v) =>
                  onChange({ ...ruleset, ...{ rampMultiplier: v } })
                }
                formatValue={(v) => `${v}×`}
                descriptors={["1× Off", "2× Normal", "3× Max"]}
                ocid="ruleset.ramp_multiplier"
              />
              <SliderField
                label="Combo Streak Threshold (hits for fire trail)"
                value={comboStreak}
                min={5}
                max={20}
                step={1}
                onChange={(v) =>
                  onChange({ ...ruleset, ...{ comboStreak: v } })
                }
                formatValue={(v) => `${v} hits`}
                descriptors={["5 Easy", "10 Normal", "20 Hard"]}
                ocid="ruleset.combo_streak"
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Multi-ball */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Multi-Ball & Co-op
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="lever-control">
            <Switch
              checked={ruleset.multiBallEnabled ?? false}
              onCheckedChange={(v) =>
                onChange({ ...ruleset, multiBallEnabled: v })
              }
              data-ocid="ruleset.multiball.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">Multi-Ball Mode</Label>
              <p className="text-xs text-muted-foreground">
                Multiple balls in play simultaneously
              </p>
            </div>
          </div>

          {ruleset.multiBallEnabled && (
            <SliderField
              label="Max Balls in Play"
              value={ruleset.multiBallCount ?? 2}
              min={2}
              max={5}
              step={1}
              onChange={(v) => onChange({ ...ruleset, multiBallCount: v })}
              formatValue={(v) => `${v} balls`}
              ocid="ruleset.multiball_count"
            />
          )}

          <div className="lever-control">
            <Switch
              checked={coopEnabled}
              onCheckedChange={(v) =>
                onChange({ ...ruleset, ...{ coopEnabled: v } })
              }
              data-ocid="ruleset.coop.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">Co-op Mode</Label>
              <p className="text-xs text-muted-foreground">
                Multiple players share the same table
              </p>
            </div>
          </div>

          {coopEnabled && (
            <SliderField
              label="Max Co-op Players"
              value={coopMaxPlayers}
              min={2}
              max={4}
              step={1}
              onChange={(v) =>
                onChange({ ...ruleset, ...{ coopMaxPlayers: v } })
              }
              formatValue={(v) => `${v} players`}
              descriptors={["2", "3", "4"]}
              ocid="ruleset.coop_max_players"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
