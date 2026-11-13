import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { PinballTableDAO } from "@/types/index";
import { Lock } from "lucide-react";
import { SliderField } from "../ConstructorPage";

export default function DaoTab({
  dao,
  onChange,
}: {
  dao: PinballTableDAO;
  onChange: (d: PinballTableDAO) => void;
}) {
  const daoDescription =
    (dao as { daoDescription?: string }).daoDescription ?? "";
  const stakeRequirement =
    (dao as { stakeRequirement?: number }).stakeRequirement ?? 100;

  return (
    <div className="space-y-5">
      {/* Owner */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Table Owner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Owner Principal ID
            </Label>
            <Input
              placeholder="aaaaa-aa (your Internet Identity principal)"
              value={dao.ownerPrincipal ?? ""}
              onChange={(e) =>
                onChange({ ...dao, ownerPrincipal: e.target.value })
              }
              className="text-xs font-mono"
              data-ocid="dao.owner.input"
            />
            <p className="text-xs text-muted-foreground">
              The ICP principal that owns and controls this table.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Governance token */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary flex items-center gap-2">
            Governance Token
            <span className="text-xs font-normal text-muted-foreground font-body">
              (DAO can add tokens via proposal)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2.5">
            <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">
                ICFC Token
              </p>
              <p className="text-xs font-mono text-muted-foreground truncate">
                ddsp7-7iaaa-aaaaq-aacqq-cai
              </p>
            </div>
          </div>
          <Input
            value={dao.governanceToken ?? "ddsp7-7iaaa-aaaaq-aacqq-cai"}
            readOnly
            className="text-xs font-mono bg-muted/20 cursor-not-allowed"
            data-ocid="dao.gov_token.input"
          />
          <p className="text-xs text-muted-foreground">
            Currently locked to ICFC. DAO members can add additional governance
            tokens via a proposal.
          </p>
        </CardContent>
      </Card>

      {/* Voting params */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Voting Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderField
            label="Voting Quorum (%)"
            value={dao.quorumPct ?? 50}
            min={10}
            max={90}
            step={5}
            onChange={(v) => onChange({ ...dao, quorumPct: v })}
            formatValue={(v) => `${v}%`}
            descriptors={[
              "10% Low",
              "50% Simple majority",
              "90% Supermajority",
            ]}
            hint="Minimum % of voters who must participate for a vote to be valid."
            ocid="dao.quorum"
          />
          <SliderField
            label="Voting Threshold (%)"
            value={dao.votingThreshold ?? 50}
            min={1}
            max={100}
            step={1}
            onChange={(v) =>
              onChange({
                ...dao,
                votingThreshold: Math.max(1, Math.min(100, v)),
              })
            }
            formatValue={(v) => `${v}%`}
            descriptors={["1% Any yes", "50% Majority", "100% Unanimous"]}
            hint="Minimum % of YES votes required to pass a proposal."
            ocid="dao.voting_threshold"
          />
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Proposal Stake Requirement (ICFC)
            </Label>
            <Input
              type="number"
              min={0}
              step={10}
              value={stakeRequirement}
              onChange={(e) =>
                onChange({
                  ...dao,
                  ...{ stakeRequirement: Math.max(0, +e.target.value) },
                })
              }
              className="w-40"
              data-ocid="dao.stake_requirement.input"
            />
            <p className="text-xs text-muted-foreground">
              ICFC required to submit a table-level proposal. 0 = no stake.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Proposal Delay (hours)
            </Label>
            <Input
              type="number"
              min={0}
              step={1}
              value={dao.proposalDelayHours ?? 24}
              onChange={(e) =>
                onChange({
                  ...dao,
                  proposalDelayHours: Math.max(0, +e.target.value),
                })
              }
              className="w-32"
              data-ocid="dao.proposal_delay.input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              Proposal Duration (hours)
            </Label>
            <Input
              type="number"
              min={1}
              step={1}
              value={dao.proposalDurationHours ?? 72}
              onChange={(e) =>
                onChange({
                  ...dao,
                  proposalDurationHours: Math.max(1, +e.target.value),
                })
              }
              className="w-32"
              data-ocid="dao.proposal_duration.input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Proposal toggle */}
      <Card className="arcade-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display text-primary">
            Table Proposals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="lever-control">
            <Switch
              checked={dao.allowTableProposals ?? true}
              onCheckedChange={(v) =>
                onChange({ ...dao, allowTableProposals: v })
              }
              data-ocid="dao.allow_proposals.toggle"
            />
            <div className="flex-1">
              <Label className="text-sm cursor-pointer">
                Allow Table-Level Proposals
              </Label>
              <p className="text-xs text-muted-foreground">
                Players can submit proposals to change this table's settings
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-display font-medium">
              DAO Description (optional)
            </Label>
            <Textarea
              placeholder="Describe the governance philosophy for this table..."
              value={daoDescription}
              onChange={(e) =>
                onChange({ ...dao, ...{ daoDescription: e.target.value } })
              }
              rows={3}
              className="resize-none text-sm"
              data-ocid="dao.description.textarea"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
