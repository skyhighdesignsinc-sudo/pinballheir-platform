import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PinballTableAccess } from "@/types/index";
import { TableAccessType } from "@/types/index";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { RadioCardGroup } from "../ConstructorPage";

const ACCESS_OPTIONS = [
  { value: TableAccessType.Public, label: "Public", icon: "🌐" },
  { value: TableAccessType.TokenGated, label: "Private", icon: "🔐" },
  { value: TableAccessType.Whitelist, label: "Whitelist", icon: "📋" },
];

export default function AccessTab({
  access,
  onChange,
}: {
  access: PinballTableAccess;
  onChange: (a: PinballTableAccess) => void;
}) {
  const [principalInput, setPrincipalInput] = useState("");
  const whitelist = access.whitelist ?? [];
  const voiceEnabled =
    (access as { voiceChatEnabled?: boolean }).voiceChatEnabled ?? false;
  const creatorCrown =
    (access as { creatorCrownEnabled?: boolean }).creatorCrownEnabled ?? false;

  const addPrincipal = () => {
    const p = principalInput.trim();
    if (p && !whitelist.includes(p)) {
      onChange({ ...access, whitelist: [...whitelist, p] });
    }
    setPrincipalInput("");
  };

  const removePrincipal = (p: string) =>
    onChange({ ...access, whitelist: whitelist.filter((w) => w !== p) });

  return (
    <div className="space-y-5">
      {/* Access type */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Access Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioCardGroup
            label="Who can play?"
            value={access.accessType ?? TableAccessType.Public}
            options={ACCESS_OPTIONS}
            onChange={(v) =>
              onChange({ ...access, accessType: v as TableAccessType })
            }
            ocid="access.type"
            cols={3}
          />

          {access.accessType === TableAccessType.Whitelist && (
            <div className="space-y-3">
              <Label className="text-sm font-display font-medium">
                Whitelisted Principals
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="aaaaa-aa (ICP principal)"
                  value={principalInput}
                  onChange={(e) => setPrincipalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPrincipal();
                    }
                  }}
                  className="text-xs font-mono flex-1"
                  data-ocid="access.whitelist.input"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addPrincipal}
                  disabled={!principalInput.trim()}
                  data-ocid="access.whitelist.add_button"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
              {whitelist.length === 0 ? (
                <p
                  className="text-xs text-muted-foreground"
                  data-ocid="access.whitelist.empty_state"
                >
                  No principals added — everyone is blocked
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {whitelist.map((p, i) => (
                    <div
                      key={p}
                      className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-muted/20 border border-border/20"
                      data-ocid={`access.whitelist.item.${i + 1}`}
                    >
                      <span className="text-xs font-mono text-muted-foreground truncate">
                        {p}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePrincipal(p)}
                        aria-label={`Remove ${p}`}
                        className="text-muted-foreground hover:text-destructive focus:outline-none shrink-0"
                        data-ocid={`access.whitelist.delete_button.${i + 1}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Badge variant="outline" className="text-xs">
                {whitelist.length} principal{whitelist.length !== 1 ? "s" : ""}{" "}
                whitelisted
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Capacity */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Capacity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Max Concurrent Players
            </Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={access.maxConcurrentPlayers ?? 20}
              onChange={(e) =>
                onChange({
                  ...access,
                  maxConcurrentPlayers: Math.max(
                    1,
                    Math.min(20, +e.target.value),
                  ),
                })
              }
              className="w-32"
              data-ocid="access.max_players.input"
            />
            <p className="text-xs text-muted-foreground">
              Maximum simultaneous active players (1–20)
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Max Daily Players
            </Label>
            <Input
              type="number"
              min={0}
              value={access.maxDailyPlayers ?? 0}
              onChange={(e) =>
                onChange({
                  ...access,
                  maxDailyPlayers: Math.max(0, +e.target.value),
                })
              }
              className="w-32"
              data-ocid="access.max_daily.input"
            />
            <p className="text-xs text-muted-foreground">0 = unlimited</p>
          </div>
        </CardContent>
      </Card>

      {/* Social */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Social Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="lever-control">
            <Switch
              checked={voiceEnabled}
              onCheckedChange={(v) =>
                onChange({ ...access, ...{ voiceChatEnabled: v } })
              }
              data-ocid="access.voice_chat.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">
                Spectator Voice Chat
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow voice for spectators (max 12 listeners)
              </p>
            </div>
          </div>
          <div className="lever-control">
            <Switch
              checked={creatorCrown}
              onCheckedChange={(v) =>
                onChange({ ...access, ...{ creatorCrownEnabled: v } })
              }
              data-ocid="access.creator_crown.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">
                Creator Live Crown 👑
              </Label>
              <p className="text-xs text-muted-foreground">
                Show crown icon when table owner is actively playing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Min token requirement */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Token Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Min ICFC to Play
            </Label>
            <Input
              type="number"
              min={0}
              step={10}
              value={access.minICFCToPlay ?? 0}
              onChange={(e) =>
                onChange({
                  ...access,
                  minICFCToPlay: Math.max(0, +e.target.value),
                })
              }
              className="w-40"
              data-ocid="access.min_icfc.input"
            />
            <p className="text-xs text-muted-foreground">
              0 = no minimum. Players must hold this many ICFC tokens.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
