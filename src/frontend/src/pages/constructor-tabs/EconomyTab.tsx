import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PinballTableEconomy } from "@/types/index";
import { AlertTriangle, Lock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { SliderField } from "../ConstructorPage";

interface LeaderboardRow {
  rank: number;
  payoutPct: number;
}

export default function EconomyTab({
  economy,
  onChange,
  platformFeeFromDAO,
}: {
  economy: PinballTableEconomy;
  onChange: (e: PinballTableEconomy) => void;
  platformFeeFromDAO: number;
}) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([
    { rank: 1, payoutPct: 40 },
    { rank: 2, payoutPct: 20 },
    { rank: 3, payoutPct: 10 },
  ]);
  const [lbPeriod, setLbPeriod] = useState<"Daily" | "Weekly">("Weekly");

  const p1 = economy.playerPrizePct ?? 70;
  const p2 = economy.ownerRevenuePct ?? 20;
  const p3 = platformFeeFromDAO;
  const editableTarget = 100 - p3;
  const editableTotal = p1 + p2;
  const isValid = editableTotal === editableTarget;

  const addRow = () => {
    const nextRank = (leaderboard[leaderboard.length - 1]?.rank ?? 0) + 1;
    setLeaderboard([...leaderboard, { rank: nextRank, payoutPct: 5 }]);
  };
  const removeRow = (rank: number) =>
    setLeaderboard(leaderboard.filter((r) => r.rank !== rank));
  const updateRow = (rank: number, payoutPct: number) =>
    setLeaderboard(
      leaderboard.map((r) => (r.rank === rank ? { ...r, payoutPct } : r)),
    );

  return (
    <div className="space-y-5">
      {/* Treasury warning */}
      <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2.5 text-xs text-muted-foreground">
        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
        <span>
          <span className="text-foreground font-semibold">
            Table owner funds all payouts.
          </span>{" "}
          Ensure your treasury has enough ICFC to cover prizes, jackpots,
          referrals, and Easter eggs before going live.
        </span>
      </div>

      {/* Play costs */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Play Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderField
            label="Entry Fee (ICFC)"
            value={economy.playCostICFC ?? 1}
            min={0}
            max={100}
            step={0.5}
            onChange={(v) => onChange({ ...economy, playCostICFC: v })}
            formatValue={(v) => (v === 0 ? "Free" : `${v.toFixed(1)} ICFC`)}
            descriptors={["Free", "1 ICFC", "100 ICFC"]}
            ocid="economy.entry_fee"
          />
          <SliderField
            label="Save the Ball Price (ICFC)"
            value={
              (economy as { saveTheBallFee?: number }).saveTheBallFee ?? 0.5
            }
            min={0}
            max={20}
            step={0.5}
            onChange={(v) => onChange({ ...economy, ...{ saveTheBallFee: v } })}
            formatValue={(v) => (v === 0 ? "Free" : `${v.toFixed(1)} ICFC`)}
            ocid="economy.save_ball_fee"
          />
          <SliderField
            label="Nudge Price (ICFC)"
            value={(economy as { nudgeFee?: number }).nudgeFee ?? 0.25}
            min={0}
            max={10}
            step={0.25}
            onChange={(v) => onChange({ ...economy, ...{ nudgeFee: v } })}
            formatValue={(v) => (v === 0 ? "Free" : `${v.toFixed(2)} ICFC`)}
            ocid="economy.nudge_fee"
          />
        </CardContent>
      </Card>

      {/* Jackpot */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Jackpot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SliderField
            label="Jackpot Contribution (%)"
            value={economy.jackpotContributionPct ?? 10}
            min={0}
            max={50}
            step={1}
            onChange={(v) =>
              onChange({ ...economy, jackpotContributionPct: v })
            }
            formatValue={(v) => `${v}%`}
            hint="% of each play fee that goes to the jackpot pool"
            ocid="economy.jackpot_contribution"
          />
        </CardContent>
      </Card>

      {/* Golden Ball */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Golden Ball
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Spawn Chance (1 in X games)
            </Label>
            <Input
              type="number"
              min={1}
              max={200}
              value={
                (economy as { goldenBallChance?: number }).goldenBallChance ??
                50
              }
              onChange={(e) =>
                onChange({
                  ...economy,
                  ...{
                    goldenBallChance: Math.max(
                      1,
                      Math.min(200, +e.target.value),
                    ),
                  },
                })
              }
              className="w-32"
              data-ocid="economy.golden_ball_chance.input"
            />
            <p className="text-xs text-muted-foreground">
              Lower = more frequent. Recommended: 30–100.
            </p>
          </div>
          <SliderField
            label="Golden Ball Payout (ICFC from treasury)"
            value={
              (economy as { goldenBallReward?: number }).goldenBallReward ?? 25
            }
            min={0}
            max={500}
            step={5}
            onChange={(v) =>
              onChange({ ...economy, ...{ goldenBallReward: v } })
            }
            formatValue={(v) => `${v} ICFC`}
            ocid="economy.golden_ball_reward"
          />
        </CardContent>
      </Card>

      {/* Referral */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Referral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="lever-control">
            <Switch
              checked={economy.referralEnabled ?? true}
              onCheckedChange={(v) =>
                onChange({ ...economy, referralEnabled: v })
              }
              data-ocid="economy.referral.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">
                Enable Referral Rewards
              </Label>
              <p className="text-xs text-muted-foreground">
                One-time per player, paid by this table on first play
              </p>
            </div>
          </div>
          {economy.referralEnabled && (
            <div className="space-y-2">
              <Label className="text-sm font-display font-medium">
                Referral Reward Override (ICFC)
              </Label>
              <Input
                type="number"
                min={0}
                step={0.5}
                value={economy.referralRewardICP ?? 0.5}
                onChange={(e) =>
                  onChange({ ...economy, referralRewardICP: +e.target.value })
                }
                className="w-40"
                data-ocid="economy.referral_reward.input"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Distribution */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Revenue Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Platform fee — read-only DAO-controlled row */}
          <div
            className="flex items-center gap-3 rounded-lg bg-muted/30 border border-border/40 px-3 py-2.5"
            data-ocid="economy.platform_fee.display"
          >
            <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-medium text-foreground">
                Platform Fee (DAO-controlled)
              </p>
              <p className="text-xs text-muted-foreground">
                Set by DAO — not editable
              </p>
            </div>
            <span className="score-display text-sm shrink-0">{p3}%</span>
          </div>

          {/* Editable: Player prize & owner revenue */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "🥇 Player Prize %",
                key: "playerPrizePct" as keyof PinballTableEconomy,
                val: p1,
              },
              {
                label: "🏦 Owner Revenue %",
                key: "ownerRevenuePct" as keyof PinballTableEconomy,
                val: p2,
              },
            ].map(({ label, key, val }) => (
              <div key={key} className="space-y-2">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <Input
                  type="number"
                  min={0}
                  max={editableTarget}
                  value={val}
                  onChange={(e) =>
                    onChange({ ...economy, [key]: +e.target.value })
                  }
                  className="text-sm"
                  data-ocid={`economy.dist.${key}.input`}
                />
              </div>
            ))}
          </div>

          {/* Validation bar showing all three */}
          <div
            className={[
              "rounded-lg px-3 py-2.5 space-y-1.5",
              isValid
                ? "bg-accent/10 border border-accent/30"
                : "bg-destructive/10 border border-destructive/30",
            ].join(" ")}
            data-ocid="economy.prize.validation"
          >
            <div className="flex items-center gap-2 text-sm font-mono">
              <span className="text-base">{isValid ? "✓" : "✗"}</span>
              <span className={isValid ? "text-accent" : "text-destructive"}>
                {p1}% + {p2}% + {p3}% (DAO) = {editableTotal + p3}%
              </span>
            </div>
            {!isValid && (
              <p className="text-xs text-destructive/80">
                Player prizes + owner revenue must total {editableTarget}%.
                Platform fee of {p3}% is fixed by the DAO.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard builder */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display text-primary">
              Leaderboard Prizes
            </CardTitle>
            <div className="flex gap-1">
              {(["Daily", "Weekly"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setLbPeriod(p)}
                  data-ocid={`economy.lb_period.${p.toLowerCase()}`}
                  className={[
                    "px-2 py-1 rounded text-xs font-display font-semibold transition-all duration-200",
                    lbPeriod === p
                      ? "bg-accent/20 text-accent border border-accent/50"
                      : "text-muted-foreground border border-border/30 hover:border-border/60",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Payout % from the total leaderboard prize pool per period.
          </p>
          {leaderboard.map((row) => (
            <div
              key={row.rank}
              className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center"
              data-ocid={`economy.lb.item.${row.rank}`}
            >
              <span className="text-xs font-mono text-muted-foreground w-12 text-right">
                #{row.rank}
              </span>
              <Input
                type="number"
                min={0}
                max={100}
                value={row.payoutPct}
                onChange={(e) => updateRow(row.rank, +e.target.value)}
                className="h-7 text-xs"
                data-ocid={`economy.lb.payout.${row.rank}`}
              />
              <span className="text-xs text-muted-foreground w-8">%</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => removeRow(row.rank)}
                data-ocid={`economy.lb.delete_button.${row.rank}`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={addRow}
            className="gap-1 text-xs w-full"
            data-ocid="economy.lb.add_button"
          >
            <Plus className="w-3 h-3" /> Add Rank
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
