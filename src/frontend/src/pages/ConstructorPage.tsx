import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddTable,
  useGetGlobalPlatformFee,
  useGetTable,
  useSubmitProposal,
  useUpdateTable,
} from "@/hooks/useQueries";
import type {
  BumperConfig,
  FlipperConfig,
  PinballTable,
  PinballTableAccess,
  PinballTableDAO,
  PinballTableEconomy,
  PinballTableLayout,
  PinballTableMetadata,
  PinballTablePhysics,
  PinballTableRuleset,
  PinballTableVisual,
} from "@/types/index";
import { TableAccessType } from "@/types/index";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Circle,
  Coins,
  Gamepad2,
  Info,
  Lock,
  Music,
  Palette,
  Plus,
  Save,
  Send,
  Trash2,
  Vote,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TableStatus } from "../backend";
import type { ProposalType as BackendProposalType } from "../backend";

import AccessTab from "./constructor-tabs/AccessTab";
import DaoTab from "./constructor-tabs/DaoTab";
import EconomyTab from "./constructor-tabs/EconomyTab";
// Sub-tab components
import LayoutTab from "./constructor-tabs/LayoutTab";
import MetadataTab from "./constructor-tabs/MetadataTab";
import PhysicsTab from "./constructor-tabs/PhysicsTab";
import RulesetTab from "./constructor-tabs/RulesetTab";
import SoundTab from "./constructor-tabs/SoundTab";
import VisualsTab from "./constructor-tabs/VisualsTab";

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: "layout", label: "Layout", icon: Gamepad2 },
  { id: "visuals", label: "Visuals", icon: Palette },
  { id: "physics", label: "Physics", icon: Zap },
  { id: "economy", label: "Economy", icon: Coins },
  { id: "ruleset", label: "Ruleset", icon: BookOpen },
  { id: "metadata", label: "Metadata", icon: Info },
  { id: "access", label: "Access", icon: Lock },
  { id: "dao", label: "DAO", icon: Vote },
  { id: "sound", label: "Sound", icon: Music },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Default state ────────────────────────────────────────────────────────────

export function defaultTable(): PinballTable {
  return {
    id: "",
    name: "",
    creator: null as unknown as import("@icp-sdk/core/principal").Principal,
    status: TableStatus.Beta,
    createdAt: BigInt(0),
    tableWidth: BigInt(400),
    tableHeight: BigInt(900),
    gravity: 9.8,
    friction: 0.05,
    flipperStrength: 300,
    rebound: 0.85,
    tiltSensitivity: 5,
    backgroundAssetId: "",
    layoutJson: "{}",
    visualsJson: "{}",
    economyJson: "{}",
    rulesetJson: "{}",
    accessJson: "{}",
    daoJson: "{}",
    soundJson: "{}",
    layout: {
      bumpers: [
        { id: "b1", x: 200, y: 300, radius: 20, points: 100 },
        { id: "b2", x: 140, y: 220, radius: 18, points: 150 },
        { id: "b3", x: 260, y: 220, radius: 18, points: 150 },
      ],
      flippers: [
        { id: "f1", side: "left", x: 100, y: 820, length: 90, angle: -30 },
        { id: "f2", side: "right", x: 300, y: 820, length: 90, angle: 30 },
      ],
      ramps: [],
      drainWidth: 0.22,
      plungerX: 370,
      plungerY: 700,
      playFieldWidth: 400,
      playFieldHeight: 900,
    },
    visual: {
      primaryColor: "#7c3aed",
      secondaryColor: "#06b6d4",
      accentColor: "#ff007a",
      ballSkin: "Chrome" as never,
      lightTheme: "Cyberpunk" as never,
      enableNeonGlow: true,
      enableParticleEffects: true,
    },
    physics: {
      gravity: 9.8,
      ballWeight: 1.0,
      flipperForce: 300,
      bumperForce: 1.5,
      friction: 0.05,
      restitution: 0.85,
      tiltSensitivity: 5,
    },
    economy: {
      playCostICFC: 1,
      jackpotContributionPct: 10,
      referralRewardICP: 0.5,
      referralEnabled: true,
      playerPrizePct: 70,
      ownerRevenuePct: 20,
    },
    ruleset: {
      tiltEnabled: true,
      tiltWarnings: 3,
      ballSaveEnabled: true,
      ballSaveDurationSecs: 3,
      multiBallEnabled: false,
      multiBallCount: 1,
      bonusMultiplierEnabled: true,
      maxBonusMultiplier: 3,
      ballsPerGame: 3,
    },
    metadata: {
      description: "",
      tags: [],
      difficulty: "Intermediate",
    },
    access: {
      accessType: TableAccessType.Public,
      maxConcurrentPlayers: 20,
    },
    dao: {
      governanceToken: "ddsp7-7iaaa-aaaaq-aacqq-cai",
      votingThreshold: 50,
      quorumPct: 50,
      allowTableProposals: true,
    },
  };
}

// ─── Validation ───────────────────────────────────────────────────────────────

function tabErrors(id: TabId, table: PinballTable): string[] {
  const errs: string[] = [];
  if (id === "metadata") {
    const n = table.name.trim();
    if (!n) errs.push("Name required");
    else if (n.length < 3) errs.push("Name too short (min 3)");
    else if (n.length > 64) errs.push("Name too long (max 64)");
  }
  return errs;
}

function canSubmit(table: PinballTable): boolean {
  return (
    table.name.trim().length >= 3 &&
    table.name.trim().length <= 64 &&
    (table.economy?.playCostICFC ?? 0) >= 0
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ConstructorPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { tableId?: string };
  const tableId = search?.tableId;
  const isEditMode = !!tableId;

  const { data: existingTable, isLoading } = useGetTable(tableId ?? "");
  const updateTable = useUpdateTable();
  const addTable = useAddTable();
  const submitProposal = useSubmitProposal();
  const { data: globalPlatformFeeData } = useGetGlobalPlatformFee();
  const globalPlatformFee = globalPlatformFeeData ?? 10;

  const [table, setTable] = useState<PinballTable>(defaultTable);
  const [activeTab, setActiveTab] = useState<TabId>("layout");
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [soundState, setSoundState] = useState({
    backgroundMusicFile: null as File | null,
    backgroundMusicName: "",
    bumperSfxFile: null as File | null,
    bumperSfxName: "",
    flipperSfxFile: null as File | null,
    flipperSfxName: "",
    drainSfxFile: null as File | null,
    drainSfxName: "",
    jackpotFile: null as File | null,
    jackpotName: "",
    masterVolume: 80,
    royaltyFreeMusic: false,
  });

  useEffect(() => {
    if (existingTable) {
      setTable({
        ...defaultTable(),
        ...existingTable,
        layout: { ...defaultTable().layout, ...existingTable.layout },
        visual: { ...defaultTable().visual, ...existingTable.visual },
        physics: {
          ...(defaultTable().physics as object),
          ...(existingTable.physics as object),
        } as PinballTablePhysics,
        economy: { ...defaultTable().economy, ...existingTable.economy },
        ruleset: { ...defaultTable().ruleset, ...existingTable.ruleset },
        metadata: { ...defaultTable().metadata, ...existingTable.metadata },
        access: { ...defaultTable().access, ...existingTable.access },
        dao: { ...defaultTable().dao, ...existingTable.dao },
      });
    }
  }, [existingTable]);

  const setLayout = (l: PinballTableLayout) =>
    setTable((t) => ({ ...t, layout: l }));
  const setVisuals = (v: PinballTableVisual) =>
    setTable((t) => ({ ...t, visual: v }));
  const setPhysics = (p: PinballTablePhysics) =>
    setTable((t) => ({ ...t, physics: p }));
  const setEconomy = (e: PinballTableEconomy) =>
    setTable((t) => ({ ...t, economy: e }));
  const setRuleset = (r: PinballTableRuleset) =>
    setTable((t) => ({ ...t, ruleset: r }));
  const setMeta = (m: PinballTableMetadata) =>
    setTable((t) => ({ ...t, metadata: m }));
  const setAccess = (a: PinballTableAccess) =>
    setTable((t) => ({ ...t, access: a }));
  const setDao = (d: PinballTableDAO) => setTable((t) => ({ ...t, dao: d }));

  const handleSaveDraft = async () => {
    if (!table.name.trim()) {
      setActiveTab("metadata");
      toast.error("Table name required", {
        description: "Go to Metadata tab and set a name.",
      });
      return;
    }
    try {
      await updateTable.mutateAsync({
        id: table.id || "draft",
        updates: JSON.stringify({
          name: table.name,
          layoutJson: JSON.stringify(table.layout ?? {}),
          visualsJson: JSON.stringify(table.visual ?? {}),
          physicsJson: JSON.stringify(table.physics ?? {}),
          economyJson: JSON.stringify(table.economy ?? {}),
          rulesetJson: JSON.stringify(table.ruleset ?? {}),
          metadataJson: JSON.stringify(table.metadata ?? {}),
          accessJson: JSON.stringify(table.access ?? {}),
          daoJson: JSON.stringify(table.dao ?? {}),
          soundJson: JSON.stringify(soundState),
        }),
      });
      toast.success("Draft saved!", {
        description: "Your changes are stored.",
      });
    } catch {
      toast.error("Save failed", {
        description: "Could not save draft. Try again.",
      });
    }
  };

  const handleSubmitBeta = async () => {
    if (!canSubmit(table)) {
      setActiveTab("metadata");
      toast.error("Validation failed", {
        description: "Table name must be 3–64 characters.",
      });
      return;
    }
    try {
      const creatorPrincipal = table.dao?.ownerPrincipal || "aaaaa-aa";
      await addTable.mutateAsync({
        name: table.name,
        creator: creatorPrincipal,
        layoutJson: JSON.stringify(table.layout ?? {}),
        visualsJson: JSON.stringify(table.visual ?? {}),
        physicsJson: JSON.stringify(table.physics ?? {}),
        economyJson: JSON.stringify(table.economy ?? {}),
        rulesetJson: JSON.stringify(table.ruleset ?? {}),
        metadataJson: JSON.stringify(table.metadata ?? {}),
        accessJson: JSON.stringify(table.access ?? {}),
        daoJson: JSON.stringify(table.dao ?? {}),
        soundJson: JSON.stringify(soundState),
      });
      toast.success("Table submitted as Beta!", {
        description: "Awaiting DAO review. Check Governance page.",
      });
      void navigate({ to: "/" });
    } catch (err) {
      toast.error("Submission failed", { description: String(err) });
    }
  };

  const handleSubmitAsProposal = async () => {
    if (!canSubmit(table)) {
      toast.error("Validation failed", {
        description: "Fill in all required fields first.",
      });
      return;
    }
    try {
      await submitProposal.mutateAsync({
        proposalType: "CreateInstance" as unknown as BackendProposalType,
        paramsJson: JSON.stringify({
          name: table.name,
          layoutJson: JSON.stringify(table.layout ?? {}),
          visualsJson: JSON.stringify(table.visual ?? {}),
          physicsJson: JSON.stringify(table.physics ?? {}),
          economyJson: JSON.stringify(table.economy ?? {}),
          rulesetJson: JSON.stringify(table.ruleset ?? {}),
          metadataJson: JSON.stringify(table.metadata ?? {}),
          accessJson: JSON.stringify(table.access ?? {}),
          daoJson: JSON.stringify(table.dao ?? {}),
          soundJson: JSON.stringify(soundState),
        }),
        stakedAmount: BigInt(100),
      });
      setShowStakeModal(false);
      toast.success("Proposal submitted!", {
        description: "100 ICFC staked. 50% burns if rejected.",
      });
      void navigate({ to: "/governance" });
    } catch (err) {
      toast.error("Proposal failed", { description: String(err) });
    }
  };

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  const allErrors = TABS.reduce<Record<TabId, string[]>>(
    (acc, tab) => {
      acc[tab.id] = tabErrors(tab.id, table);
      return acc;
    },
    {} as Record<TabId, string[]>,
  );

  if (isLoading && isEditMode) {
    return (
      <div
        className="flex items-center justify-center h-[60vh] gap-3"
        data-ocid="constructor.loading_state"
      >
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-muted-foreground font-display">
          Loading table…
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="constructor.page">
      {/* ── Sticky header bar ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-border/40 bg-card/90 backdrop-blur-md px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-start gap-3 justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="font-display font-bold text-lg text-foreground truncate neon-text-primary">
              {isEditMode ? "Edit Table" : "Table Constructor"}
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              {table.name
                ? `"${table.name}"`
                : "Build your sovereign pinball mini-economy"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={updateTable.isPending}
              className="gap-1.5 text-xs"
              data-ocid="constructor.save_draft_button"
            >
              <Save className="w-3.5 h-3.5" />
              {updateTable.isPending ? "Saving…" : "Save Draft"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStakeModal(true)}
              className="gap-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10"
              data-ocid="constructor.propose_button"
            >
              <Vote className="w-3.5 h-3.5" />
              Propose (100 ICFC)
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitBeta}
              disabled={!canSubmit(table) || addTable.isPending}
              className="gap-1.5 text-xs arcade-glow font-display font-semibold"
              data-ocid="constructor.submit_button"
            >
              <Send className="w-3.5 h-3.5" />
              {addTable.isPending ? "Submitting…" : "Submit as Beta"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* ── Tab bar ──────────────────────────────────────────────────────── */}
        <div
          className="arcade-border rounded-xl bg-card/50 p-1 overflow-x-auto scrollbar-thin"
          data-ocid="constructor.tabs"
        >
          <div className="flex gap-0.5 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const errs = allErrors[tab.id];
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  data-ocid={`constructor.tab.${tab.id}`}
                  className={[
                    "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-display font-medium",
                    "transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap",
                    isActive ? "arcade-tab-active" : "arcade-tab",
                  ].join(" ")}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  {errs.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center shrink-0">
                      {errs.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Progress indicator ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border/30" />
          <span className="text-xs text-muted-foreground font-display uppercase tracking-widest px-2">
            {TABS[activeIndex]?.label} — {activeIndex + 1} / {TABS.length}
          </span>
          <div className="h-px flex-1 bg-border/30" />
        </div>

        {/* ── Tab content ────────────────────────────────────────────────── */}
        <div data-ocid={`constructor.panel.${activeTab}`}>
          {activeTab === "layout" && (
            <LayoutTab layout={table.layout ?? {}} onChange={setLayout} />
          )}
          {activeTab === "visuals" && (
            <VisualsTab visual={table.visual ?? {}} onChange={setVisuals} />
          )}
          {activeTab === "physics" && (
            <PhysicsTab
              physics={(table.physics ?? {}) as PinballTablePhysics}
              onChange={setPhysics}
            />
          )}
          {activeTab === "economy" && (
            <EconomyTab
              economy={table.economy ?? {}}
              onChange={setEconomy}
              platformFeeFromDAO={globalPlatformFee}
            />
          )}
          {activeTab === "ruleset" && (
            <RulesetTab ruleset={table.ruleset ?? {}} onChange={setRuleset} />
          )}
          {activeTab === "metadata" && (
            <MetadataTab
              name={table.name}
              metadata={table.metadata ?? {}}
              onNameChange={(n) => setTable((t) => ({ ...t, name: n }))}
              onChange={setMeta}
            />
          )}
          {activeTab === "access" && (
            <AccessTab access={table.access ?? {}} onChange={setAccess} />
          )}
          {activeTab === "dao" && (
            <DaoTab dao={table.dao ?? {}} onChange={setDao} />
          )}
          {activeTab === "sound" && (
            <SoundTab state={soundState} onChange={setSoundState} />
          )}
        </div>

        {/* ── Prev / Next nav ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs"
            disabled={activeIndex === 0}
            onClick={() => setActiveTab(TABS[activeIndex - 1].id)}
            data-ocid="constructor.tab.prev_button"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {TABS[activeIndex - 1]?.label ?? ""}
          </Button>
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "w-2 h-2 rounded-full transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-accent w-4"
                    : allErrors[tab.id].length > 0
                      ? "bg-destructive/70"
                      : "bg-border/60 hover:bg-muted-foreground/40",
                ].join(" ")}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs"
            disabled={activeIndex === TABS.length - 1}
            onClick={() => setActiveTab(TABS[activeIndex + 1].id)}
            data-ocid="constructor.tab.next_button"
          >
            {TABS[activeIndex + 1]?.label ?? ""}
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* ── Submit panel ────────────────────────────────────────────────── */}
        <div className="construction-zone space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-display font-semibold text-foreground">
                Ready to launch?
              </p>
              <p className="text-xs text-muted-foreground">
                Submit as{" "}
                <span className="text-accent font-semibold">Beta</span> for DAO
                review, or submit as a{" "}
                <span className="text-primary font-semibold">Proposal</span>{" "}
                (100 ICFC stake — 50% burns if rejected).
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handleSubmitBeta}
                disabled={!canSubmit(table) || addTable.isPending}
                className="arcade-glow gap-1.5 text-xs font-display font-semibold"
                data-ocid="constructor.bottom.submit_button"
              >
                <Send className="w-3.5 h-3.5" />
                {addTable.isPending ? "Submitting…" : "Submit as Beta Table"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowStakeModal(true)}
                className="gap-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10"
                data-ocid="constructor.bottom.propose_button"
              >
                <Vote className="w-3.5 h-3.5" />
                Submit as Proposal
              </Button>
            </div>
          </div>

          {!canSubmit(table) && (
            <div
              className="flex items-center gap-2 text-xs text-muted-foreground border border-destructive/30 rounded-lg px-3 py-2 bg-destructive/5"
              data-ocid="constructor.validation_error"
            >
              <Circle className="w-3.5 h-3.5 text-destructive shrink-0" />
              Table name must be 3–64 characters (Metadata tab)
            </div>
          )}
        </div>
      </div>

      {/* ── Stake confirmation modal ─────────────────────────────────────── */}
      {showStakeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          data-ocid="constructor.stake_dialog"
        >
          <div className="arcade-card max-w-sm w-full space-y-4 arcade-glow-active">
            <div className="space-y-1">
              <h2 className="font-display font-bold text-base neon-text-accent">
                Submit as DAO Proposal
              </h2>
              <p className="text-xs text-muted-foreground">
                This will create a{" "}
                <span className="text-primary font-semibold">
                  CreateInstance
                </span>{" "}
                proposal on-chain.
              </p>
            </div>
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stake required</span>
                <span className="font-mono font-bold text-primary">
                  100 ICFC
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Burned if rejected
                </span>
                <span className="font-mono text-destructive">
                  50 ICFC (50%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Returned if passed
                </span>
                <span className="font-mono text-accent">100 ICFC</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Table owners fund all prizes. Ensure treasury is funded before
              proposal execution.
            </p>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowStakeModal(false)}
                data-ocid="constructor.stake_dialog.cancel_button"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1 arcade-glow font-display font-semibold"
                onClick={handleSubmitAsProposal}
                disabled={submitProposal.isPending}
                data-ocid="constructor.stake_dialog.confirm_button"
              >
                {submitProposal.isPending ? "Staking…" : "Stake & Submit"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Re-export shared helpers for sub-tabs ───────────────────────────────────

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  descriptors?: [string, string, string];
  formatValue?: (v: number) => string;
  ocid?: string;
  hint?: string;
}

export function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  descriptors,
  formatValue,
  ocid,
  hint,
}: SliderFieldProps) {
  const display = formatValue ? formatValue(value) : value.toFixed(2);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-display font-medium text-foreground">
          {label}
        </Label>
        <span
          className="score-display text-sm"
          data-ocid={ocid ? `${ocid}.value` : undefined}
        >
          {display}
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
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {descriptors && (
        <div className="flex justify-between text-xs text-muted-foreground">
          {descriptors.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      )}
    </div>
  );
}

interface RadioCardGroupProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string; icon?: string }[];
  onChange: (v: T) => void;
  ocid?: string;
  cols?: number;
}

export function RadioCardGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  ocid,
  cols = 4,
}: RadioCardGroupProps<T>) {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-display font-medium">{label}</Label>
      )}
      <div className={`grid gap-2 grid-cols-2 sm:grid-cols-${cols}`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            data-ocid={
              ocid
                ? `${ocid}.${opt.value.toLowerCase().replace(/\s+/g, "_")}`
                : undefined
            }
            onClick={() => onChange(opt.value)}
            className={[
              "rounded-lg border-2 px-3 py-2.5 text-xs font-display font-semibold transition-all duration-200",
              "flex flex-col items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              value === opt.value
                ? "border-primary bg-primary/10 text-primary arcade-glow"
                : "border-border/40 bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
          >
            {opt.icon && <span className="text-base">{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Re-export sub-component types used across tabs
export type { SliderFieldProps, RadioCardGroupProps };
export {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Textarea,
  Trash2,
  Plus,
};
