import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  ExternalLink,
  Flame,
  Info,
  Plus,
  Shield,
  TrendingUp,
  Users,
  Vote,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ProposalStatus, ProposalType, type VoteChoice } from "../backend";
import {
  useExecuteProposal,
  useGetCharityWallet,
  useGetGlobalTreasury,
  useGetProposals,
  useSubmitProposal,
  useVoteOnProposal,
} from "../hooks/useQueries";
import type { Proposal, Vote as VoteRecord } from "../types/index";

// ─── Proposal type metadata ────────────────────────────────────────────────────

type ProposalCategory =
  | "Schema"
  | "Code"
  | "Instances"
  | "Assets"
  | "Tables"
  | "Currency"
  | "Platform"
  | "Moderation"
  | "Governance"
  | "Methods";

interface ProposalTypeMeta {
  type: ProposalType;
  label: string;
  category: ProposalCategory;
  icon: string;
  hint: string;
}

const PROPOSAL_TYPE_META: ProposalTypeMeta[] = [
  // Schema
  {
    type: ProposalType.NewObjectType,
    label: "New Object Type",
    category: "Schema",
    icon: "🗂️",
    hint: '{"typeName":"TournamentBracket","fields":[{"name":"id","type":"Text"},{"name":"prize","type":"Nat"}]}',
  },
  {
    type: ProposalType.EditObjectType,
    label: "Edit Object Type",
    category: "Schema",
    icon: "✏️",
    hint: '{"typeName":"PinballTable","editField":{"name":"gravity","newType":"Float"}}',
  },
  {
    type: ProposalType.DeleteObjectType,
    label: "Delete Object Type",
    category: "Schema",
    icon: "🗑️",
    hint: '{"typeName":"LegacyObject","reason":"Deprecated — replaced by new type"}',
  },
  {
    type: ProposalType.NewAttribute,
    label: "New Attribute",
    category: "Schema",
    icon: "➕",
    hint: '{"objectType":"PlayerProfile","attribute":{"name":"twitterHandle","type":"?Text"}}',
  },
  {
    type: ProposalType.EditAttribute,
    label: "Edit Attribute",
    category: "Schema",
    icon: "🔧",
    hint: '{"objectType":"PinballTable","attributeName":"gravity","newType":"Float"}',
  },
  {
    type: ProposalType.DeleteAttribute,
    label: "Delete Attribute",
    category: "Schema",
    icon: "❌",
    hint: '{"objectType":"PlayerProfile","attributeName":"legacyField","reason":"No longer needed"}',
  },
  // Methods
  {
    type: ProposalType.NewMethod,
    label: "New Method",
    category: "Methods",
    icon: "⚡",
    hint: '{"methodName":"claimDailyBonus","signature":"() -> async Result","description":"Daily reward claim"}',
  },
  {
    type: ProposalType.EditMethod,
    label: "Edit Method",
    category: "Methods",
    icon: "🔄",
    hint: '{"methodName":"submitScore","change":"Add replay validation","rationale":"Anti-cheat improvement"}',
  },
  {
    type: ProposalType.DeleteMethod,
    label: "Delete Method",
    category: "Methods",
    icon: "🚫",
    hint: '{"methodName":"legacyMethod","reason":"Replaced by v2 API"}',
  },
  // Instances
  {
    type: ProposalType.CreateInstance,
    label: "Create Instance",
    category: "Instances",
    icon: "🆕",
    hint: '{"objectType":"Achievement","data":{"id":"ace_tilt","name":"Tilt Master","condition":"tilt==0"}}',
  },
  {
    type: ProposalType.EditInstance,
    label: "Edit Instance",
    category: "Instances",
    icon: "📝",
    hint: '{"objectType":"Achievement","id":"ace_tilt","updates":{"name":"Perfect Tilt","description":"Never tilt"}}',
  },
  {
    type: ProposalType.DeleteInstance,
    label: "Delete Instance",
    category: "Instances",
    icon: "🗑️",
    hint: '{"objectType":"Achievement","id":"ace_old","reason":"Replaced by new achievement"}',
  },
  // Assets
  {
    type: ProposalType.UploadAsset,
    label: "Upload Asset",
    category: "Assets",
    icon: "📤",
    hint: '{"assetName":"neon_ramp_v2.glb","description":"Updated neon ramp 3D model","contentType":"model/gltf-binary"}',
  },
  {
    type: ProposalType.DeleteAsset,
    label: "Delete Asset",
    category: "Assets",
    icon: "🗂️",
    hint: '{"assetId":"asset_old_ramp","reason":"Replaced by neon_ramp_v2"}',
  },
  {
    type: ProposalType.UploadNewPhysicsEngine,
    label: "New Physics Engine",
    category: "Assets",
    icon: "⚙️",
    hint: '{"engineName":"box2d-wasm","version":"0.9.2","url":"ipfs://...","changelog":"Improved flipper accuracy"}',
  },
  // Code
  {
    type: ProposalType.UpdateFrontend,
    label: "Update Frontend",
    category: "Code",
    icon: "💻",
    hint: '{"description":"Add replay sharing button","prUrl":"https://github.com/...","diff":"+ share button in PlayPage"}',
  },
  {
    type: ProposalType.UpdateCSS,
    label: "Update CSS",
    category: "Code",
    icon: "🎨",
    hint: '{"description":"Update neon glow colors","cssSnippet":".arcade-glow { box-shadow: ... }"}',
  },
  {
    type: ProposalType.UpdateJS,
    label: "Update JS",
    category: "Code",
    icon: "📜",
    hint: '{"description":"Fix flipper lag calculation","jsSnippet":"const flipperLag = ..."}',
  },
  {
    type: ProposalType.UpdateCanister,
    label: "Update Canister",
    category: "Code",
    icon: "🔮",
    hint: '{"wasmHash":"abc123...","description":"Add tournament logic","changeLog":"feat: tournaments"}',
  },
  // Tables
  {
    type: ProposalType.ReleaseTable,
    label: "Release Table",
    category: "Tables",
    icon: "🎰",
    hint: '{"tableId":"tbl_galactic","reason":"Passed beta testing, ready for public"}',
  },
  {
    type: ProposalType.ChangeTableEconomy,
    label: "Change Table Economy",
    category: "Tables",
    icon: "📊",
    hint: '{"tableId":"tbl_galactic","updates":{"entryFee":10,"jackpotPercent":5}}',
  },
  // Currency
  {
    type: ProposalType.AddCurrency,
    label: "Add Currency",
    category: "Currency",
    icon: "💱",
    hint: '{"ledgerCanisterId":"ryjl3-tyaaa-aaaaa-aaaba-cai","symbol":"ICP","description":"Add ICP as payment option"}',
  },
  {
    type: ProposalType.RemoveCurrency,
    label: "Remove Currency",
    category: "Currency",
    icon: "🚫",
    hint: '{"symbol":"DEPRECATED","reason":"Token delisted and liquidity removed"}',
  },
  // Platform
  {
    type: ProposalType.ConfigureProfileSchema,
    label: "Configure Profile Schema",
    category: "Platform",
    icon: "👤",
    hint: '{"addField":{"name":"twitterHandle","type":"?Text","label":"X (Twitter)"},"rationale":"Social links for community"}',
  },
  {
    type: ProposalType.ConfigureGlobalAds,
    label: "Configure Global Ads",
    category: "Platform",
    icon: "📢",
    hint: '{"maxAdsPerTable":2,"adMinCPMICFC":5,"adContentPolicy":"No gambling competitors"}',
  },
  {
    type: ProposalType.TreasuryAction,
    label: "Treasury Action",
    category: "Platform",
    icon: "💰",
    hint: '{"action":"spend","amountICFC":5000,"recipient":"abc-xyz...","purpose":"Fund hackathon prizes"}',
  },
  {
    type: ProposalType.SetCharityWallet,
    label: "Set Charity Wallet",
    category: "Platform",
    icon: "❤️",
    hint: '{"wallet":"abc-xyz-principal...","charityName":"Gitcoin Grants","description":"ICP ecosystem public goods"}',
  },
  // Moderation
  {
    type: ProposalType.BanPrincipal,
    label: "Ban Principal",
    category: "Moderation",
    icon: "🚫",
    hint: '{"principal":"aaa-bbb-ccc...","reason":"Score manipulation detected via replay analysis","duration":"permanent"}',
  },
  {
    type: ProposalType.DeleteProfile,
    label: "Delete Profile",
    category: "Moderation",
    icon: "🗑️",
    hint: '{"principal":"aaa-bbb-ccc...","reason":"Fraudulent account, duplicate of banned user"}',
  },
  {
    type: ProposalType.DisputeScore,
    label: "Dispute Score",
    category: "Moderation",
    icon: "⚖️",
    hint: '{"replayId":"replay_abc","claimedScore":9999999,"disputeReason":"Physics exploit detected in replay frames 1200-1450"}',
  },
  // Governance
  {
    type: ProposalType.ChangeGovernance,
    label: "Change Governance",
    category: "Governance",
    icon: "🏛️",
    hint: '{"parameter":"quorumPct","currentValue":20,"proposedValue":33,"rationale":"Increase security threshold"}',
  },
  {
    type: ProposalType.BatchOp,
    label: "Batch Operation",
    category: "Governance",
    icon: "📦",
    hint: '{"ops":[{"type":"EditAttribute","params":{...}},{"type":"CreateInstance","params":{...}}]}',
  },
  {
    type: ProposalType.SimulateProposal,
    label: "Simulate Proposal",
    category: "Governance",
    icon: "🔬",
    hint: '{"targetProposalType":"ChangeTableEconomy","params":{...},"description":"Test this change before committing"}',
  },
];

const CATEGORY_COLORS: Record<ProposalCategory, string> = {
  Schema: "bg-primary/15 text-primary border-primary/30",
  Code: "bg-[oklch(0.6_0.22_320/0.15)] text-[oklch(0.8_0.22_320)] border-[oklch(0.6_0.22_320/0.3)]",
  Instances: "bg-accent/15 text-accent border-accent/30",
  Assets:
    "bg-[oklch(0.65_0.28_180/0.15)] text-[oklch(0.85_0.28_180)] border-[oklch(0.65_0.28_180/0.3)]",
  Tables: "bg-accent/10 text-accent/80 border-accent/20",
  Currency:
    "bg-[oklch(0.75_0.25_60/0.15)] text-[oklch(0.85_0.25_60)] border-[oklch(0.75_0.25_60/0.3)]",
  Platform:
    "bg-[oklch(0.65_0.28_180/0.1)] text-[oklch(0.75_0.28_180)] border-[oklch(0.65_0.28_180/0.2)]",
  Moderation: "bg-destructive/10 text-destructive border-destructive/20",
  Governance: "bg-primary/10 text-primary/80 border-primary/20",
  Methods:
    "bg-[oklch(0.6_0.22_320/0.1)] text-[oklch(0.75_0.22_320)] border-[oklch(0.6_0.22_320/0.2)]",
};

const STATUS_STYLES: Record<
  string,
  { classes: string; dot?: boolean; label: string }
> = {
  Open: {
    classes:
      "border-[oklch(0.65_0.28_180/0.6)] text-[oklch(0.85_0.28_180)] bg-[oklch(0.65_0.28_180/0.12)]",
    dot: true,
    label: "Open",
  },
  Voting: {
    classes: "border-primary/60 text-primary bg-primary/12",
    dot: true,
    label: "Voting",
  },
  Passed: {
    classes:
      "border-[oklch(0.7_0.2_140/0.6)] text-[oklch(0.85_0.2_140)] bg-[oklch(0.7_0.2_140/0.12)]",
    label: "Passed",
  },
  Failed: {
    classes: "border-destructive/60 text-destructive bg-destructive/10",
    label: "Failed",
  },
  Executed: {
    classes:
      "border-[oklch(0.65_0.3_180/0.6)] text-[oklch(0.7_0.3_200)] bg-[oklch(0.65_0.3_180/0.1)]",
    label: "Executed",
  },
  Expired: {
    classes: "border-muted-foreground/40 text-muted-foreground bg-muted/30",
    label: "Expired",
  },
};

type FilterKey =
  | "all"
  | "Open"
  | "Voting"
  | "Passed"
  | "Failed"
  | "Executed"
  | "Expired";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Open", label: "Open" },
  { key: "Voting", label: "Voting" },
  { key: "Passed", label: "Passed" },
  { key: "Failed", label: "Failed" },
  { key: "Executed", label: "Executed" },
  { key: "Expired", label: "Expired" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncatePrincipal(p: unknown): string {
  const s = typeof p === "string" ? p : String(p ?? "");
  if (!s || s === "[object Object]") return "Anonymous";
  return s.length > 16 ? `${s.slice(0, 6)}…${s.slice(-5)}` : s;
}

function timeLabel(ts?: bigint): string {
  if (!ts) return "No deadline";
  const ms = Number(ts) / 1_000_000 - Date.now();
  if (ms <= 0) {
    const ago = Math.abs(ms);
    const days = Math.floor(ago / 86_400_000);
    return days > 0 ? `Closed ${days}d ago` : "Just closed";
  }
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  return days > 0 ? `${days}d ${hours}h left` : `${hours}h left`;
}

function formatICFC(n: bigint): string {
  const val = Number(n);
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toString();
}

function getTypeMeta(type: ProposalType): ProposalTypeMeta {
  return (
    PROPOSAL_TYPE_META.find((m) => m.type === type) ?? {
      type,
      label: String(type),
      category: "Governance",
      icon: "📋",
      hint: "{}",
    }
  );
}

function proposalTitle(p: Proposal): string {
  if (p.title) return p.title;
  try {
    const parsed = JSON.parse(p.paramsJson ?? "{}") as Record<string, unknown>;
    if (typeof parsed.title === "string") return parsed.title;
    if (typeof parsed.description === "string")
      return parsed.description.slice(0, 80);
  } catch {
    /* ignore */
  }
  const meta = getTypeMeta(p.proposalType as ProposalType);
  return `${meta.label} #${p.id}`;
}

function isActive(status: string): boolean {
  return status === ProposalStatus.Open || status === ProposalStatus.Voting;
}

function canExecute(status: string): boolean {
  return status === ProposalStatus.Passed;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Expired;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${style.classes}`}
    >
      {style.dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {style.label}
    </span>
  );
}

function TypeBadge({ type }: { type: ProposalType }) {
  const meta = getTypeMeta(type);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${CATEGORY_COLORS[meta.category]}`}
    >
      <span>{meta.icon}</span>
      <span className="truncate max-w-[120px]">{meta.label}</span>
    </span>
  );
}

function ThreeColorBar({
  yes,
  no,
  abstain,
  height = "h-5",
}: { yes: bigint; no: bigint; abstain: bigint; height?: string }) {
  const total = Number(yes) + Number(no) + Number(abstain);
  const yesPct = total > 0 ? (Number(yes) / total) * 100 : 0;
  const noPct = total > 0 ? (Number(no) / total) * 100 : 0;
  const absPct = total > 0 ? (Number(abstain) / total) * 100 : 0;

  return (
    <div className="space-y-2">
      {/* Bar */}
      <div
        className={`relative w-full ${height} rounded-full bg-muted overflow-hidden flex`}
      >
        <motion.div
          className="h-full bg-[oklch(0.65_0.28_140)]"
          style={{ boxShadow: "0 0 8px oklch(0.65 0.28 140 / 0.5)" }}
          initial={{ width: 0 }}
          animate={{ width: `${yesPct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        <motion.div
          className="h-full bg-destructive"
          style={{ boxShadow: "0 0 8px oklch(0.704 0.191 22.216 / 0.5)" }}
          initial={{ width: 0 }}
          animate={{ width: `${noPct}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        />
        <motion.div
          className="h-full bg-muted-foreground/40"
          initial={{ width: 0 }}
          animate={{ width: `${absPct}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-[oklch(0.65_0.28_140)]" />
          <span className="text-[oklch(0.8_0.28_140)] font-medium">
            {formatICFC(yes)} Yes ({yesPct.toFixed(0)}%)
          </span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-destructive" />
          <span className="text-destructive font-medium">
            {formatICFC(no)} No ({noPct.toFixed(0)}%)
          </span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-muted-foreground/40" />
          {formatICFC(abstain)} Abstain
        </span>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function ProposalDetailModal({
  proposal,
  onClose,
  isAuthenticated,
  hasVoted,
}: {
  proposal: Proposal;
  onClose: () => void;
  isAuthenticated: boolean;
  hasVoted: boolean;
}) {
  const voteOnProposal = useVoteOnProposal();
  const executeProposal = useExecuteProposal();
  const [voteWeight, setVoteWeight] = useState(100);
  const [myVote, setMyVote] = useState<VoteChoice | null>(null);
  const [alreadyVoted] = useState(hasVoted);

  const active = isActive(proposal.status as string);
  const executable = canExecute(proposal.status as string);

  const burnAmount =
    (Number(proposal.stakedAmount ?? 0) *
      Number(proposal.burnPercentage ?? 50)) /
    100;

  let paramsDisplay = "";
  try {
    paramsDisplay = JSON.stringify(
      JSON.parse(proposal.paramsJson ?? "{}"),
      null,
      2,
    );
  } catch {
    paramsDisplay = proposal.paramsJson ?? "";
  }

  const handleVote = async (choice: VoteChoice) => {
    try {
      await voteOnProposal.mutateAsync({
        proposalId: proposal.id,
        choice,
        weight: BigInt(voteWeight),
      });
      setMyVote(choice);
      toast.success(`Voted ${choice}!`, {
        description: `${voteWeight} ICFC voting power used.`,
      });
    } catch {
      toast.error("Vote failed", { description: "Please try again." });
    }
  };

  const handleExecute = async () => {
    try {
      await executeProposal.mutateAsync(proposal.id);
      toast.success("Proposal executed!", {
        description: "Changes are now live on-chain.",
      });
      onClose();
    } catch {
      toast.error("Execution failed", {
        description: "Check eligibility or try again.",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-2xl arcade-border bg-card max-h-[90vh] flex flex-col"
        data-ocid="proposal_detail.dialog"
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type={proposal.proposalType as ProposalType} />
            <StatusBadge status={proposal.status as string} />
          </div>
          <DialogTitle className="font-display text-xl mt-2 leading-snug">
            {proposalTitle(proposal)}
          </DialogTitle>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {truncatePrincipal(proposal.proposer)}
            </span>
            <span className="flex items-center gap-1">
              <Coins className="w-3 h-3 text-[oklch(0.85_0.25_60)]" />
              <span className="text-[oklch(0.85_0.25_60)]">
                {formatICFC(proposal.stakedAmount ?? BigInt(0))} ICFC staked
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeLabel(proposal.votingEnds)}
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-5 pr-2">
            {/* Burn warning */}
            {(proposal.burnPercentage ?? BigInt(0)) > BigInt(0) && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[oklch(0.75_0.25_60/0.08)] border border-[oklch(0.75_0.25_60/0.3)]">
                <Flame className="w-4 h-4 text-[oklch(0.85_0.25_60)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[oklch(0.85_0.25_60)]">
                  If this proposal fails,{" "}
                  <strong>
                    {Number(proposal.burnPercentage ?? 0)}% ={" "}
                    {formatICFC(BigInt(Math.floor(burnAmount)))} ICFC
                  </strong>{" "}
                  of the proposer's stake will be burned.
                </p>
              </div>
            )}

            {/* Voting breakdown */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Voting Breakdown
              </h4>
              <ThreeColorBar
                yes={proposal.yesVotes ?? BigInt(0)}
                no={proposal.noVotes ?? BigInt(0)}
                abstain={proposal.abstainVotes ?? BigInt(0)}
                height="h-5"
              />
            </div>

            <Separator />

            {/* Vote action */}
            {active && isAuthenticated && !alreadyVoted && !myVote && (
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Cast Your Vote
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Voting Power to Use</Label>
                    <span className="font-mono text-sm text-primary">
                      {voteWeight} ICFC
                    </span>
                  </div>
                  <Slider
                    data-ocid="proposal_detail.vote_weight_slider"
                    min={1}
                    max={1000}
                    step={1}
                    value={[voteWeight]}
                    onValueChange={([v]) => setVoteWeight(v)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 ICFC</span>
                    <span>1,000 ICFC</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    data-ocid="proposal_detail.vote_yes_button"
                    className="flex-1 gap-2 min-h-[48px] bg-[oklch(0.65_0.28_140/0.15)] border border-[oklch(0.65_0.28_140/0.5)] text-[oklch(0.8_0.28_140)] hover:bg-[oklch(0.65_0.28_140/0.3)] hover:border-[oklch(0.65_0.28_140/0.8)]"
                    onClick={() => handleVote("Yes" as VoteChoice)}
                    disabled={voteOnProposal.isPending}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Yes ✓
                  </Button>
                  <Button
                    data-ocid="proposal_detail.vote_no_button"
                    className="flex-1 gap-2 min-h-[48px] border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive/80"
                    variant="outline"
                    onClick={() => handleVote("No" as VoteChoice)}
                    disabled={voteOnProposal.isPending}
                  >
                    <XCircle className="w-4 h-4" />
                    No ✗
                  </Button>
                  <Button
                    data-ocid="proposal_detail.vote_abstain_button"
                    className="flex-1 gap-2 min-h-[48px]"
                    variant="outline"
                    onClick={() => handleVote("Abstain" as VoteChoice)}
                    disabled={voteOnProposal.isPending}
                  >
                    Abstain
                  </Button>
                </div>
              </div>
            )}

            {/* Already voted */}
            {(alreadyVoted || myVote) && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border border-border/50">
                <CheckCircle2 className="w-4 h-4 text-[oklch(0.8_0.28_140)]" />
                <span className="text-sm text-muted-foreground">
                  Your vote:{" "}
                  <span className="font-semibold text-foreground">
                    {myVote ?? "Recorded"}
                  </span>
                </span>
              </div>
            )}

            {active && !isAuthenticated && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                <Info className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Connect with Internet Identity to vote.
                </p>
              </div>
            )}

            {executable && (
              <Button
                data-ocid="proposal_detail.execute_button"
                className="w-full gap-2 min-h-[48px]"
                style={{ boxShadow: "0 0 16px oklch(0.65 0.28 180 / 0.4)" }}
                onClick={handleExecute}
                disabled={executeProposal.isPending}
              >
                <Zap className="w-4 h-4" />
                {executeProposal.isPending ? "Executing…" : "Execute Proposal"}
              </Button>
            )}

            <Separator />

            {/* Params JSON */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Proposal Parameters
              </h4>
              <pre className="font-mono text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto text-foreground/80 border border-border/40 leading-relaxed max-h-48">
                {paramsDisplay || "{}"}
              </pre>
            </div>

            {/* Vote history */}
            {proposal.voteList && proposal.voteList.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Vote History ({proposal.voteList.length})
                </h4>
                <div className="space-y-1.5">
                  {(proposal.voteList as VoteRecord[]).map((v, i) => (
                    <div
                      key={v.voter || `vote-${i}`}
                      data-ocid={`proposal_detail.vote_item.${i + 1}`}
                      className="flex items-center justify-between text-xs px-3 py-2 rounded bg-muted/30 border border-border/30"
                    >
                      <span className="font-mono text-muted-foreground truncate max-w-[180px]">
                        {truncatePrincipal(v.voter)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-muted-foreground">
                          {v.votingPower ?? 0} ICFC
                        </span>
                        <span
                          className={`font-semibold ${String(v.choice) === "Yes" ? "text-[oklch(0.8_0.28_140)]" : String(v.choice) === "No" ? "text-destructive" : "text-muted-foreground"}`}
                        >
                          {String(v.choice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Proposal ID
                </p>
                <p className="font-mono text-xs">{proposal.id.toString()}</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="font-mono text-xs">
                  {proposal.createdAt
                    ? new Date(
                        Number(proposal.createdAt) / 1_000_000,
                      ).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ─── Create Proposal Modal ────────────────────────────────────────────────────

const CATEGORY_ORDER: ProposalCategory[] = [
  "Schema",
  "Methods",
  "Instances",
  "Assets",
  "Code",
  "Tables",
  "Currency",
  "Platform",
  "Moderation",
  "Governance",
];

function CreateProposalDialog({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const submitProposal = useSubmitProposal();
  const [selectedType, setSelectedType] = useState<ProposalType | "">("");
  const [paramsJson, setParamsJson] = useState("");
  const [stakeAmount, setStakeAmount] = useState(100);

  const meta = selectedType ? getTypeMeta(selectedType as ProposalType) : null;
  const burnPct = 50;
  const burnPreview = Math.floor((stakeAmount * burnPct) / 100);

  const handleTypeChange = (val: string) => {
    setSelectedType(val as ProposalType);
    const m = getTypeMeta(val as ProposalType);
    setParamsJson(m.hint);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedType("");
      setParamsJson("");
      setStakeAmount(100);
    }, 300);
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    try {
      JSON.parse(paramsJson); // validate
    } catch {
      toast.error("Invalid JSON in params", {
        description: "Check your parameters JSON syntax.",
      });
      return;
    }
    try {
      await submitProposal.mutateAsync({
        proposalType: selectedType as ProposalType,
        paramsJson,
        stakedAmount: BigInt(stakeAmount),
      });
      toast.success("Proposal submitted!", {
        description: "ICFC token holders can now vote.",
      });
      handleClose();
    } catch {
      toast.error("Submission failed", { description: "Please try again." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-2xl arcade-border bg-card max-h-[90vh] flex flex-col"
        data-ocid="create_proposal.dialog"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            New DAO Proposal
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Submit a governance proposal for ICFC token holders to vote on.
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-5 pr-2">
            {/* Type selector */}
            <div className="space-y-2">
              <Label htmlFor="proposal-type">Proposal Type *</Label>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger
                  id="proposal-type"
                  data-ocid="create_proposal.type_select"
                  className="w-full"
                >
                  <SelectValue placeholder="Select proposal type…" />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  {CATEGORY_ORDER.map((cat) => {
                    const types = PROPOSAL_TYPE_META.filter(
                      (m) => m.category === cat,
                    );
                    if (types.length === 0) return null;
                    return (
                      <SelectGroup key={cat}>
                        <SelectLabel
                          className={`text-xs px-2 py-1 font-semibold ${CATEGORY_COLORS[cat]}`}
                        >
                          {cat}
                        </SelectLabel>
                        {types.map((m) => (
                          <SelectItem
                            key={m.type}
                            value={m.type}
                            data-ocid={`create_proposal.type_option.${m.type}`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{m.icon}</span>
                              <span>{m.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {meta && (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${CATEGORY_COLORS[meta.category]}`}
              >
                <span>{meta.icon}</span>
                <span className="font-semibold">{meta.label}</span>
                <span className="text-muted-foreground">
                  — {meta.category} category
                </span>
              </div>
            )}

            {/* Params JSON */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="params-json">Parameters (JSON) *</Label>
                <span className="text-xs text-muted-foreground">
                  Must be valid JSON
                </span>
              </div>
              <Textarea
                id="params-json"
                data-ocid="create_proposal.params_textarea"
                className="font-mono text-xs min-h-[140px] bg-muted/30 border-border/50"
                placeholder={meta?.hint ?? '{"key": "value"}'}
                value={paramsJson}
                onChange={(e) => setParamsJson(e.target.value)}
                rows={6}
              />
            </div>

            {/* Stake amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="stake-amount">Stake Amount (ICFC)</Label>
                <span className="font-mono text-sm text-primary">
                  {stakeAmount} ICFC
                </span>
              </div>
              <Input
                id="stake-amount"
                data-ocid="create_proposal.stake_input"
                type="number"
                min={1}
                value={stakeAmount}
                onChange={(e) =>
                  setStakeAmount(Math.max(1, Number(e.target.value)))
                }
                className="font-mono"
              />
            </div>

            {/* Burn preview */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[oklch(0.75_0.25_60/0.08)] border border-[oklch(0.75_0.25_60/0.3)]">
              <Flame className="w-4 h-4 text-[oklch(0.85_0.25_60)] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[oklch(0.85_0.25_60)]">
                <span className="font-semibold">Burn preview: </span>
                If this proposal is rejected,{" "}
                <strong>
                  {burnPct}% = {burnPreview} ICFC
                </strong>{" "}
                of your stake will be burned. This discourages spam proposals.
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-2 pt-1">
              <Button
                data-ocid="create_proposal.cancel_button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                data-ocid="create_proposal.submit_button"
                onClick={handleSubmit}
                disabled={
                  !selectedType ||
                  !paramsJson.trim() ||
                  submitProposal.isPending
                }
                className="flex-1 gap-2 arcade-glow"
              >
                {submitProposal.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Submit to DAO
                  </>
                )}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ─── Proposal Card ─────────────────────────────────────────────────────────────

function ProposalCard({
  proposal,
  index,
  isAuthenticated,
  hasVoted,
  onOpenDetail,
}: {
  proposal: Proposal;
  index: number;
  isAuthenticated: boolean;
  hasVoted: boolean;
  onOpenDetail: () => void;
}) {
  const totalVotes =
    (proposal.yesVotes ?? BigInt(0)) +
    (proposal.noVotes ?? BigInt(0)) +
    (proposal.abstainVotes ?? BigInt(0));
  const quorum = 50;
  const quorumReached = Number(totalVotes);
  const active = isActive(proposal.status as string);
  const executable = canExecute(proposal.status as string);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Card
        className="arcade-card-interactive group"
        data-ocid={`proposal.card.${index + 1}`}
      >
        <CardHeader className="pb-3">
          {/* Badges row */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={proposal.proposalType as ProposalType} />
              <StatusBadge status={proposal.status as string} />
            </div>
            {executable && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded border border-[oklch(0.65_0.28_180/0.6)] text-[oklch(0.8_0.28_180)] bg-[oklch(0.65_0.28_180/0.1)]"
                style={{ boxShadow: "0 0 8px oklch(0.65 0.28 180 / 0.3)" }}
              >
                Ready to Execute
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-base font-semibold leading-snug mt-2 line-clamp-2 group-hover:text-accent transition-colors">
            {proposalTitle(proposal)}
          </h3>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {truncatePrincipal(proposal.proposer)}
            </span>
            <span className="flex items-center gap-1">
              <Coins className="w-3 h-3 text-[oklch(0.8_0.25_60)]" />
              <span className="text-[oklch(0.8_0.25_60)]">
                {formatICFC(proposal.stakedAmount ?? BigInt(0))} staked
              </span>
            </span>
            <span
              className={`flex items-center gap-1 font-medium ${active ? "text-[oklch(0.85_0.28_180)]" : ""}`}
            >
              <Clock className="w-3 h-3" />
              {timeLabel(proposal.votingEnds)}
            </span>
          </div>
        </CardHeader>

        <CardContent
          className="pt-0 space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 3-color vote bars */}
          <ThreeColorBar
            yes={proposal.yesVotes ?? BigInt(0)}
            no={proposal.noVotes ?? BigInt(0)}
            abstain={proposal.abstainVotes ?? BigInt(0)}
            height="h-4"
          />

          {/* Quorum indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Quorum: {quorumReached} ICFC / {quorum}% required
            </span>
            {hasVoted && (
              <span className="flex items-center gap-1 text-[oklch(0.8_0.28_140)]">
                <CheckCircle2 className="w-3 h-3" />
                You voted
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              data-ocid={`proposal.open_detail_button.${index + 1}`}
              size="sm"
              variant="outline"
              className="flex-1 gap-1.5 min-h-[44px]"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail();
              }}
            >
              <Info className="w-3.5 h-3.5" />
              View Details
            </Button>
            {active && isAuthenticated && !hasVoted && (
              <Button
                data-ocid={`proposal.vote_button.${index + 1}`}
                size="sm"
                className="flex-1 gap-1.5 min-h-[44px] arcade-glow"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail();
                }}
              >
                <Vote className="w-3.5 h-3.5" />
                Vote
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Stats Row ─────────────────────────────────────────────────────────────────

function StatsRow({ proposals }: { proposals: Proposal[] }) {
  const { data: treasury = BigInt(0) } = useGetGlobalTreasury();
  const { data: charityWallet = null } = useGetCharityWallet();

  const active = proposals.filter((p) => isActive(p.status as string)).length;

  const stats = [
    {
      label: "Global Treasury",
      value: `${formatICFC(treasury)} ICFC`,
      icon: <Wallet className="w-4 h-4" />,
      color: "text-[oklch(0.85_0.25_60)]",
    },
    {
      label: "Active Proposals",
      value: active,
      icon: <Vote className="w-4 h-4" />,
      color: "text-[oklch(0.85_0.28_180)]",
    },
    {
      label: "Total Proposals",
      value: proposals.length,
      icon: <TrendingUp className="w-4 h-4" />,
      color: "text-foreground",
    },
    {
      label: "Charity Wallet",
      value: charityWallet ? truncatePrincipal(charityWallet) : "Not set",
      icon: <ExternalLink className="w-4 h-4" />,
      color: "text-muted-foreground",
      mono: true,
    },
  ];

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1"
      data-ocid="governance.stats_row"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="arcade-card flex-shrink-0 min-w-[160px] flex-1 flex flex-col gap-1"
          data-ocid={`governance.stat.${i + 1}`}
        >
          <div
            className={`flex items-center gap-1.5 text-xs text-muted-foreground ${s.color}`}
          >
            {s.icon}
            {s.label}
          </div>
          <div
            className={`text-xl font-display font-bold ${s.color} ${s.mono ? "font-mono text-sm" : ""}`}
          >
            {String(s.value)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function GovernancePage() {
  const {
    data: proposals = [],
    isLoading: proposalsLoading,
    isFetched: proposalsFetched,
  } = useGetProposals();
  const { isAuthenticated } = useInternetIdentity();

  // Avoid infinite loading: only show skeleton while actively loading.
  // When the query is disabled (actor not ready), isLoading=false, so empty state renders correctly.
  const isLoading = proposalsLoading && !proposalsFetched;

  const [filter, setFilter] = useState<FilterKey>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailProposal, setDetailProposal] = useState<Proposal | null>(null);
  const [votedIds] = useState<Set<bigint>>(new Set());

  const filtered = useMemo(() => {
    if (filter === "all") return proposals;
    return proposals.filter((p) => p.status === filter);
  }, [proposals, filter]);

  const filterCounts = useMemo(() => {
    const counts: Record<FilterKey, number> = {
      all: proposals.length,
      Open: 0,
      Voting: 0,
      Passed: 0,
      Failed: 0,
      Executed: 0,
      Expired: 0,
    };
    for (const p of proposals) {
      const s = p.status as FilterKey;
      if (s in counts) counts[s]++;
    }
    return counts;
  }, [proposals]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative border-b border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% -20%, oklch(0.65 0.28 280 / 0.18), transparent)",
          }}
        />
        <div className="container mx-auto px-4 py-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-xs font-mono text-primary tracking-widest uppercase">
                  ICFC Token Governance
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-2 leading-tight">
                DAO Governance
              </h1>
              <p className="text-muted-foreground text-base max-w-lg">
                ICFC token holders govern every aspect of PinballHEIR — from
                physics parameters to table economies. Simple majority rules. No
                veto. No sacred cows.
              </p>
            </div>
            <Button
              data-ocid="governance.new_proposal_button"
              onClick={() => setCreateOpen(true)}
              className="gap-2 arcade-glow min-h-[48px] px-6 flex-shrink-0 self-start sm:self-end"
            >
              <Plus className="w-4 h-4" />
              Create Proposal
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        {isLoading ? (
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="h-20 rounded-xl flex-1 min-w-[160px]"
              />
            ))}
          </div>
        ) : (
          <StatsRow proposals={proposals} />
        )}

        {/* Filter tabs */}
        <div
          className="flex items-center gap-1 overflow-x-auto pb-1 -mx-1 px-1"
          data-ocid="governance.filter_tabs"
        >
          {FILTERS.map((f) => {
            const count = filterCounts[f.key];
            const isActive = filter === f.key;
            return (
              <button
                type="button"
                key={f.key}
                data-ocid={`governance.filter.${f.key}`}
                onClick={() => setFilter(f.key)}
                className={`arcade-tab flex-shrink-0 flex items-center gap-1.5 ${isActive ? "arcade-tab-active" : ""}`}
              >
                {f.label}
                {count > 0 && (
                  <span
                    className={`text-xs rounded-full px-1.5 py-0.5 font-mono ${isActive ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Proposals grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["sk-1", "sk-2", "sk-3", "sk-4"].map((sk) => (
                <Card
                  key={sk}
                  className="arcade-border"
                  data-ocid="governance.loading_state"
                >
                  <CardHeader>
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-5 w-full mb-3 rounded-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((proposal, i) => (
                <ProposalCard
                  key={proposal.id.toString()}
                  proposal={proposal}
                  index={i}
                  isAuthenticated={isAuthenticated}
                  hasVoted={votedIds.has(proposal.id)}
                  onOpenDetail={() => setDetailProposal(proposal)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-ocid="governance.empty_state"
            >
              <Card className="arcade-border bg-card/40">
                <CardContent className="py-20 text-center space-y-4">
                  <div className="text-6xl">🏛️</div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold mb-2">
                      {filter === "all"
                        ? "No proposals yet"
                        : `No ${filter} proposals`}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                      {filter === "all"
                        ? "The PinballHEIR DAO launches with a clean slate. Be the first ICFC holder to shape the platform — submit a governance proposal to start."
                        : `No ${filter} proposals match your filter. Try "All" to browse everything.`}
                    </p>
                  </div>
                  {filter === "all" && (
                    <Button
                      data-ocid="governance.empty_new_proposal_button"
                      onClick={() => setCreateOpen(true)}
                      className="gap-2 arcade-glow min-h-[48px] px-6"
                    >
                      <Plus className="w-4 h-4" />
                      Submit First Proposal
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateProposalDialog open={createOpen} onOpenChange={setCreateOpen} />

      {detailProposal && (
        <ProposalDetailModal
          proposal={detailProposal}
          onClose={() => setDetailProposal(null)}
          isAuthenticated={isAuthenticated}
          hasVoted={votedIds.has(detailProposal.id)}
        />
      )}
    </div>
  );
}
