import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetDailyMysteryTable,
  useGetTableEconomies,
  useGetTables,
} from "@/hooks/useQueries";
import type { PinballTable, TableEconomy } from "@/types/index";
import { Link } from "@tanstack/react-router";
import { Crown, Filter, Play, Plus, Search, Zap } from "lucide-react";
import { useMemo, useState } from "react";

// ─── Utility helpers ──────────────────────────────────────────────────────────

function truncatePrincipal(p: { toString: () => string } | string): string {
  const s = typeof p === "string" ? p : p.toString();
  if (s.length <= 12) return s;
  return `${s.slice(0, 5)}…${s.slice(-5)}`;
}

function formatICFC(amount: bigint): string {
  const n = Number(amount) / 1e8;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(2);
}

function getDifficultyFromTable(
  table: PinballTable,
): "Easy" | "Medium" | "Hard" | "Extreme" {
  const g = table.gravity ?? 1;
  if (g < 0.5) return "Easy";
  if (g < 1.0) return "Medium";
  if (g < 1.5) return "Hard";
  return "Extreme";
}

const DIFFICULTY_CONFIG = {
  Easy: {
    label: "Easy",
    color: "text-green-400 border-green-400/40 bg-green-400/10",
  },
  Medium: {
    label: "Medium",
    color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  },
  Hard: {
    label: "Hard",
    color: "text-orange-400 border-orange-400/40 bg-orange-400/10",
  },
  Extreme: {
    label: "Extreme",
    color: "text-red-400 border-red-400/40 bg-red-400/10",
  },
} as const;

const STATUS_CONFIG = {
  Released: {
    label: "Released",
    color: "text-accent border-accent/40 bg-accent/10",
  },
  Beta: {
    label: "Beta",
    color: "text-muted-foreground border-border bg-muted/40",
  },
} as const;

// ─── Arcade Cabinet SVG ───────────────────────────────────────────────────────

function ArcadeCabinetSVG() {
  return (
    <svg
      viewBox="0 0 220 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[220px] drop-shadow-[0_0_30px_oklch(0.7_0.25_280/0.4)]"
      aria-hidden="true"
    >
      {/* Cabinet body */}
      <rect
        x="20"
        y="60"
        width="180"
        height="260"
        rx="8"
        fill="oklch(0.205 0 0)"
        stroke="oklch(0.7 0.25 280 / 0.8)"
        strokeWidth="2"
      />
      {/* Cabinet top marquee */}
      <rect
        x="10"
        y="20"
        width="200"
        height="50"
        rx="6"
        fill="oklch(0.145 0 0)"
        stroke="oklch(0.7 0.25 280 / 0.9)"
        strokeWidth="2"
      />
      {/* Marquee text background glow */}
      <rect
        x="20"
        y="28"
        width="180"
        height="34"
        rx="4"
        fill="oklch(0.7 0.25 280 / 0.12)"
      />
      {/* PINBALL text in marquee */}
      <text
        x="110"
        y="48"
        textAnchor="middle"
        fill="oklch(0.7 0.25 280)"
        fontFamily="monospace"
        fontSize="14"
        fontWeight="bold"
        letterSpacing="3"
      >
        PINBALL
      </text>
      {/* Screen bezel */}
      <rect
        x="35"
        y="80"
        width="150"
        height="120"
        rx="4"
        fill="oklch(0.145 0 0)"
        stroke="oklch(0.65 0.28 180 / 0.6)"
        strokeWidth="1.5"
      />
      {/* Screen content - neon grid */}
      <rect
        x="40"
        y="85"
        width="140"
        height="110"
        rx="2"
        fill="oklch(0.10 0 0)"
      />
      {/* Grid lines vertical */}
      {[60, 80, 100, 120, 140, 160].map((x) => (
        <line
          key={x}
          x1={x}
          y1="85"
          x2={x}
          y2="195"
          stroke="oklch(0.65 0.28 180 / 0.2)"
          strokeWidth="0.5"
        />
      ))}
      {/* Grid lines horizontal */}
      {[105, 125, 145, 165, 185].map((y) => (
        <line
          key={y}
          x1="40"
          y1={y}
          x2="180"
          y2={y}
          stroke="oklch(0.65 0.28 180 / 0.2)"
          strokeWidth="0.5"
        />
      ))}
      {/* Pinball on screen */}
      <circle
        cx="110"
        cy="140"
        r="12"
        fill="oklch(0.7 0.25 280)"
        filter="url(#ballGlow)"
      />
      <circle cx="108" cy="138" r="3" fill="oklch(0.95 0 0 / 0.3)" />
      {/* Score display on screen */}
      <text
        x="110"
        y="100"
        textAnchor="middle"
        fill="oklch(0.65 0.28 180)"
        fontFamily="monospace"
        fontSize="8"
        letterSpacing="2"
      >
        00000000
      </text>
      {/* Flippers */}
      <line
        x1="55"
        y1="185"
        x2="90"
        y2="178"
        stroke="oklch(0.7 0.25 280)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="165"
        y1="185"
        x2="130"
        y2="178"
        stroke="oklch(0.7 0.25 280)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Bumpers */}
      <circle
        cx="75"
        cy="115"
        r="6"
        fill="none"
        stroke="oklch(0.65 0.28 180 / 0.7)"
        strokeWidth="1.5"
      />
      <circle
        cx="110"
        cy="110"
        r="6"
        fill="none"
        stroke="oklch(0.65 0.28 180 / 0.7)"
        strokeWidth="1.5"
      />
      <circle
        cx="145"
        cy="115"
        r="6"
        fill="none"
        stroke="oklch(0.65 0.28 180 / 0.7)"
        strokeWidth="1.5"
      />
      {/* Control panel */}
      <rect
        x="35"
        y="215"
        width="150"
        height="60"
        rx="4"
        fill="oklch(0.18 0 0)"
        stroke="oklch(0.7 0.25 280 / 0.4)"
        strokeWidth="1"
      />
      {/* Buttons */}
      <circle
        cx="75"
        cy="235"
        r="10"
        fill="oklch(0.7 0.25 280)"
        filter="url(#btnGlow)"
      />
      <circle cx="75" cy="235" r="7" fill="oklch(0.6 0.25 280)" />
      <circle
        cx="145"
        cy="235"
        r="10"
        fill="oklch(0.65 0.28 180)"
        filter="url(#btnGlowCyan)"
      />
      <circle cx="145" cy="235" r="7" fill="oklch(0.55 0.28 180)" />
      {/* Coin slot */}
      <rect
        x="90"
        y="248"
        width="40"
        height="8"
        rx="4"
        fill="oklch(0.145 0 0)"
        stroke="oklch(0.708 0 0 / 0.4)"
        strokeWidth="1"
      />
      <text
        x="110"
        y="255"
        textAnchor="middle"
        fill="oklch(0.708 0 0)"
        fontFamily="monospace"
        fontSize="5"
      >
        INSERT COIN
      </text>
      {/* Side decorative dashed lines */}
      <line
        x1="25"
        y1="90"
        x2="25"
        y2="290"
        stroke="oklch(0.7 0.25 280 / 0.3)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <line
        x1="195"
        y1="90"
        x2="195"
        y2="290"
        stroke="oklch(0.7 0.25 280 / 0.3)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      {/* Cabinet legs */}
      <rect
        x="35"
        y="315"
        width="20"
        height="20"
        rx="2"
        fill="oklch(0.145 0 0)"
        stroke="oklch(0.7 0.25 280 / 0.4)"
        strokeWidth="1"
      />
      <rect
        x="165"
        y="315"
        width="20"
        height="20"
        rx="2"
        fill="oklch(0.145 0 0)"
        stroke="oklch(0.7 0.25 280 / 0.4)"
        strokeWidth="1"
      />
      {/* Neon side strips */}
      <line
        x1="22"
        y1="100"
        x2="22"
        y2="280"
        stroke="oklch(0.65 0.28 180)"
        strokeWidth="2"
        opacity="0.6"
      />
      <line
        x1="198"
        y1="100"
        x2="198"
        y2="280"
        stroke="oklch(0.65 0.28 180)"
        strokeWidth="2"
        opacity="0.6"
      />
      <defs>
        <filter id="ballGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="btnGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="btnGlowCyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

// ─── Table Card Skeleton ──────────────────────────────────────────────────────

function TableCardSkeleton() {
  return (
    <div className="arcade-card flex flex-col gap-3 min-h-[220px]">
      <Skeleton className="h-5 w-3/4 bg-muted/50" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 bg-muted/50" />
        <Skeleton className="h-5 w-16 bg-muted/50" />
      </div>
      <Skeleton className="h-4 w-1/2 bg-muted/50" />
      <Skeleton className="h-4 w-2/3 bg-muted/50" />
      <Skeleton className="h-4 w-1/3 bg-muted/50" />
      <div className="mt-auto">
        <Skeleton className="h-9 w-full bg-muted/50" />
      </div>
    </div>
  );
}

// ─── Table Card ───────────────────────────────────────────────────────────────

interface TableCardProps {
  table: PinballTable;
  economy: TableEconomy | undefined;
  isMystery: boolean;
  isGenesis: boolean;
  index: number;
}

function GenesisTableCard({
  table,
  economy,
  isMystery,
  index,
}: Omit<TableCardProps, "isGenesis">) {
  const difficulty = getDifficultyFromTable(table);
  const diffConfig = DIFFICULTY_CONFIG[difficulty];
  const isFree = !economy || economy.entryFee === BigInt(0);
  const jackpotDisplay = economy ? formatICFC(economy.icfcTreasury) : "0";
  const creatorStr = truncatePrincipal(table.creator);

  return (
    <div
      data-ocid={`table.item.${index}`}
      className="col-span-full arcade-card-interactive relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.205 0 0) 0%, oklch(0.18 0.04 280) 50%, oklch(0.205 0 0) 100%)",
        border: "2px solid oklch(0.7 0.25 280 / 0.6)",
        boxShadow:
          "0 0 40px oklch(0.7 0.25 280 / 0.2), 0 8px 32px rgba(0,0,0,0.7)",
      }}
    >
      {/* Scanline texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.985 0 0) 2px, oklch(0.985 0 0) 3px)",
        }}
      />
      {/* Neon grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.65 0.28 180 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.28 180 / 0.3) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative z-10 flex flex-col md:flex-row gap-6 p-2">
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-display border"
              style={{
                color: "oklch(0.75 0.25 60)",
                borderColor: "oklch(0.75 0.25 60 / 0.5)",
                background: "oklch(0.75 0.25 60 / 0.1)",
              }}
            >
              DAO Genesis Table
            </span>
            {isMystery && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-display border"
                style={{
                  color: "oklch(0.75 0.25 60)",
                  borderColor: "oklch(0.75 0.25 60 / 0.5)",
                  background: "oklch(0.75 0.25 60 / 0.1)",
                }}
              >
                <Crown className="w-3 h-3" /> MYSTERY TABLE 3×
              </span>
            )}
          </div>
          <h2
            className="font-display text-2xl md:text-3xl font-bold"
            style={{
              color: "oklch(0.7 0.25 280)",
              textShadow:
                "0 0 16px oklch(0.7 0.25 280 / 0.7), 0 0 32px oklch(0.7 0.25 280 / 0.4)",
            }}
          >
            {table.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${diffConfig.color}`}
            >
              {diffConfig.label}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border text-accent border-accent/40 bg-accent/10">
              Released
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                Entry
              </span>
              {isFree ? (
                <span
                  className="font-bold font-mono"
                  style={{
                    color: "oklch(0.6 0.22 140)",
                    textShadow: "0 0 8px oklch(0.6 0.22 140 / 0.6)",
                  }}
                >
                  FREE TO PLAY
                </span>
              ) : (
                <span className="font-mono font-bold text-foreground">
                  {formatICFC(economy!.entryFee)} ICFC
                </span>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                Jackpot Pool
              </span>
              <span className="font-mono font-bold neon-text-accent flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                {jackpotDisplay} ICFC
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                Creator
              </span>
              <span className="font-mono text-muted-foreground text-xs">
                {creatorStr}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Link to="/play/$tableId" params={{ tableId: table.id }}>
            <Button
              data-ocid={`table.play_button.${index}`}
              size="lg"
              className="arcade-glow font-display font-bold tracking-wider text-base px-8 h-12"
            >
              <Play className="w-5 h-5 mr-2" /> PLAY NOW
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function TableCard({
  table,
  economy,
  isMystery,
  isGenesis,
  index,
}: TableCardProps) {
  if (isGenesis) {
    return (
      <GenesisTableCard
        table={table}
        economy={economy}
        isMystery={isMystery}
        index={index}
      />
    );
  }

  const difficulty = getDifficultyFromTable(table);
  const diffConfig = DIFFICULTY_CONFIG[difficulty];
  const statusKey =
    (table.status as unknown as string) === "Released" ? "Released" : "Beta";
  const statusConfig = STATUS_CONFIG[statusKey];
  const isFree = !economy || economy.entryFee === BigInt(0);
  const jackpotDisplay = economy ? formatICFC(economy.icfcTreasury) : "0";
  const creatorStr = truncatePrincipal(table.creator);

  return (
    <div
      data-ocid={`table.item.${index}`}
      className="arcade-card-interactive flex flex-col gap-3 relative overflow-hidden"
    >
      {isMystery && (
        <span
          className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-display border z-10"
          style={{
            color: "oklch(0.75 0.25 60)",
            borderColor: "oklch(0.75 0.25 60 / 0.5)",
            background: "oklch(0.75 0.25 60 / 0.1)",
          }}
        >
          <Crown className="w-3 h-3" /> 3×
        </span>
      )}

      <h3
        className="font-display font-bold text-lg leading-tight pr-16 min-w-0"
        style={{
          color: "oklch(0.7 0.25 280)",
          textShadow: "0 0 10px oklch(0.7 0.25 280 / 0.5)",
        }}
      >
        {table.name}
      </h3>

      <div className="flex flex-wrap gap-1.5">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${diffConfig.color}`}
        >
          {diffConfig.label}
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${statusConfig.color}`}
        >
          {statusConfig.label}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-sm flex-1">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-mono uppercase tracking-wide">
            Entry
          </span>
          {isFree ? (
            <span
              className="font-bold font-mono text-xs"
              style={{
                color: "oklch(0.6 0.22 140)",
                textShadow: "0 0 8px oklch(0.6 0.22 140 / 0.5)",
              }}
            >
              FREE TO PLAY
            </span>
          ) : (
            <span className="font-mono font-bold text-foreground text-xs">
              {formatICFC(economy!.entryFee)} ICFC
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-mono uppercase tracking-wide">
            Jackpot
          </span>
          <span className="font-mono font-bold neon-text-accent text-xs flex items-center gap-0.5">
            <Zap className="w-3 h-3" />
            {jackpotDisplay} ICFC
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-mono uppercase tracking-wide">
            Creator
          </span>
          <span className="font-mono text-muted-foreground text-xs">
            {creatorStr}
          </span>
        </div>
      </div>

      <Link to="/play/$tableId" params={{ tableId: table.id }} className="mt-1">
        <Button
          data-ocid={`table.play_button.${index}`}
          className="w-full font-display font-semibold tracking-wider"
          variant="outline"
        >
          <Play className="w-4 h-4 mr-1.5" /> PLAY
        </Button>
      </Link>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

interface StatsBarProps {
  tableCount: number;
  totalJackpot: bigint;
  mysteryTableName: string | null;
  isLoading: boolean;
}

function StatsBar({
  tableCount,
  totalJackpot,
  mysteryTableName,
  isLoading,
}: StatsBarProps) {
  const stats = [
    {
      label: "Tables",
      value: isLoading ? "—" : String(tableCount),
      glow: false,
      crown: false,
    },
    {
      label: "ICFC in Jackpots",
      value: isLoading ? "—" : `${formatICFC(totalJackpot)} ICFC`,
      glow: true,
      crown: false,
    },
    {
      label: "Daily Mystery",
      value: isLoading ? "—" : (mysteryTableName ?? "None"),
      glow: !!mysteryTableName,
      crown: !!mysteryTableName,
    },
  ];

  return (
    <div
      className="w-full flex flex-wrap justify-center gap-px"
      data-ocid="stats.bar"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex-1 min-w-[140px] flex flex-col items-center gap-1 px-6 py-3 bg-card border border-border first:rounded-l-lg last:rounded-r-lg"
        >
          <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">
            {stat.label}
          </span>
          <span
            className={`font-display font-bold text-base truncate max-w-full flex items-center gap-1 ${stat.glow ? "neon-text-accent" : "text-foreground"}`}
          >
            {stat.crown && (
              <Crown
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: "oklch(0.75 0.25 60)" }}
              />
            )}
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Filter chips ─────────────────────────────────────────────────────────────

type FilterChip =
  | "all"
  | "free"
  | "paid"
  | "easy"
  | "hard"
  | "released"
  | "beta";

const FILTER_CHIPS: { id: FilterChip; label: string }[] = [
  { id: "all", label: "All Tables" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
  { id: "easy", label: "Easy / Medium" },
  { id: "hard", label: "Hard / Extreme" },
  { id: "released", label: "Released" },
  { id: "beta", label: "Beta" },
];

const SKELETON_KEYS = [
  "sk1",
  "sk2",
  "sk3",
  "sk4",
  "sk5",
  "sk6",
  "sk7",
  "sk8",
] as const;

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterChip>("all");

  const { data: tables = [], isLoading: tablesLoading } = useGetTables();
  const { data: economies = [] } = useGetTableEconomies();
  const { data: mysteryTableId } = useGetDailyMysteryTable();

  const economyMap = useMemo(() => {
    const map = new Map<string, TableEconomy>();
    for (const e of economies) map.set(e.tableId, e);
    return map;
  }, [economies]);

  const mysteryTable = useMemo(
    () => (mysteryTableId ? tables.find((t) => t.id === mysteryTableId) : null),
    [tables, mysteryTableId],
  );

  const totalJackpot = useMemo(
    () => economies.reduce((sum, e) => sum + e.icfcTreasury, BigInt(0)),
    [economies],
  );

  const filtered = useMemo(() => {
    let result = [...tables];
    // Genesis always first
    const genesis = result.find((t) => t.name === "Neon Nights");
    if (genesis) {
      result = [genesis, ...result.filter((t) => t.id !== genesis.id)];
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q),
      );
    }

    if (activeFilter === "free") {
      result = result.filter((t) => {
        const eco = economyMap.get(t.id);
        return !eco || eco.entryFee === BigInt(0);
      });
    } else if (activeFilter === "paid") {
      result = result.filter((t) => {
        const eco = economyMap.get(t.id);
        return eco && eco.entryFee > BigInt(0);
      });
    } else if (activeFilter === "easy") {
      result = result.filter((t) => {
        const d = getDifficultyFromTable(t);
        return d === "Easy" || d === "Medium";
      });
    } else if (activeFilter === "hard") {
      result = result.filter((t) => {
        const d = getDifficultyFromTable(t);
        return d === "Hard" || d === "Extreme";
      });
    } else if (activeFilter === "released") {
      result = result.filter(
        (t) => (t.status as unknown as string) === "Released",
      );
    } else if (activeFilter === "beta") {
      result = result.filter(
        (t) => (t.status as unknown as string) !== "Released",
      );
    }

    return result;
  }, [tables, search, activeFilter, economyMap]);

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        data-ocid="hero.section"
        className="relative overflow-hidden bg-background py-16 md:py-24"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.7 0.25 280 / 0.12) 0%, transparent 70%)",
        }}
      >
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(0.985 0 0) 3px, oklch(0.985 0 0) 4px)",
          }}
        />
        {/* Grid horizon */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.65 0.28 180 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.28 180 / 0.4) 1px, transparent 1px)",
            backgroundSize: "48px 32px",
            maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          }}
        />

        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          {/* Text side */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-xs text-accent tracking-widest uppercase">
                Live on Internet Computer
              </span>
            </div>

            <h1
              className="font-display text-5xl md:text-7xl font-bold leading-none tracking-tight"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.7 0.25 280) 0%, oklch(0.65 0.28 180) 60%, oklch(0.7 0.25 280) 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 20px oklch(0.7 0.25 280 / 0.5))",
              }}
            >
              PinballHEIR
            </h1>

            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
              <span className="text-foreground font-semibold">
                100% On-Chain.
              </span>{" "}
              Fully DAO-Governed.{" "}
              <span className="neon-text-accent font-semibold">Play Now.</span>
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/play/$tableId" params={{ tableId: "neon-nights" }}>
                <Button
                  data-ocid="hero.play_button"
                  size="lg"
                  className="arcade-glow font-display font-bold tracking-wider px-8"
                >
                  <Play className="w-5 h-5 mr-2" /> PLAY FOR FREE
                </Button>
              </Link>
              <Link to="/constructor">
                <Button
                  data-ocid="hero.create_button"
                  size="lg"
                  variant="outline"
                  className="font-display font-semibold tracking-wider border-primary/40 hover:border-primary/70 px-8"
                >
                  <Plus className="w-5 h-5 mr-2" /> CREATE TABLE
                </Button>
              </Link>
            </div>
          </div>

          {/* Cabinet illustration */}
          <div className="flex-shrink-0 w-[160px] md:w-[220px]">
            <ArcadeCabinetSVG />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <section
        className="container mx-auto px-4 py-6"
        data-ocid="stats.section"
      >
        <StatsBar
          tableCount={tables.length}
          totalJackpot={totalJackpot}
          mysteryTableName={mysteryTable?.name ?? null}
          isLoading={tablesLoading}
        />
      </section>

      {/* ── Table Browser ──────────────────────────────────────────────────── */}
      <section
        data-ocid="tables.section"
        className="flex-1 container mx-auto px-4 pb-16"
      >
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              data-ocid="tables.search_input"
              placeholder="Search tables…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border font-mono text-sm"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0 mr-1" />
            {FILTER_CHIPS.map((chip) => (
              <button
                type="button"
                key={chip.id}
                data-ocid={`tables.filter.${chip.id}`}
                onClick={() => setActiveFilter(chip.id)}
                className={`arcade-tab text-xs px-3 py-1.5 ${activeFilter === chip.id ? "arcade-tab-active" : ""}`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {tablesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SKELETON_KEYS.map((k) => (
              <TableCardSkeleton key={k} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="tables.empty_state"
            className="arcade-card flex flex-col items-center gap-6 py-20 text-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed border-primary/30"
              style={{ background: "oklch(var(--primary) / 0.05)" }}
            >
              <Play className="w-8 h-8 text-primary/50" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-xl font-bold text-foreground">
                No tables yet
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                {search || activeFilter !== "all"
                  ? "No tables match your filters. Try adjusting your search."
                  : "Be the first to create one and earn ICFC from every play."}
              </p>
            </div>
            {!search && activeFilter === "all" && (
              <Link to="/constructor">
                <Button
                  data-ocid="tables.create_first_button"
                  className="arcade-glow font-display font-semibold"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Create a Table
                </Button>
              </Link>
            )}
            {(search || activeFilter !== "all") && (
              <Button
                data-ocid="tables.clear_filters_button"
                variant="outline"
                className="border-border"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((table, i) => {
              const isGenesis = table.name === "Neon Nights";
              return (
                <TableCard
                  key={table.id}
                  table={table}
                  economy={economyMap.get(table.id)}
                  isMystery={table.id === mysteryTableId}
                  isGenesis={isGenesis}
                  index={i + 1}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* ── Governance CTA strip ───────────────────────────────────────────── */}
      <section
        data-ocid="governance.cta_section"
        className="border-t border-border py-8 bg-card"
      >
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h3 className="font-display font-bold text-foreground text-lg">
              Shape the Platform
            </h3>
            <p className="text-muted-foreground text-sm">
              Hold ICFC → vote on proposals → own the future of pinball.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/governance">
              <Button
                data-ocid="governance.cta_button"
                variant="outline"
                className="font-display font-semibold border-accent/40 hover:border-accent/70 text-accent"
              >
                View Governance
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button
                data-ocid="marketplace.cta_button"
                variant="outline"
                className="font-display font-semibold border-primary/40 hover:border-primary/70 text-primary"
              >
                Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
