import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Calendar,
  ChevronDown,
  Crown,
  Ghost,
  Medal,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useGetLeaderboard, useGetTables } from "../hooks/useQueries";
import type { LeaderboardEntry, PinballTable } from "../types/index";

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = "AllTime" | "Monthly" | "Weekly" | "Daily";
type Difficulty = "All" | "Easy" | "Medium" | "Hard" | "Extreme";

// ─── Constants ────────────────────────────────────────────────────────────────

const PERIODS: { value: Period; label: string }[] = [
  { value: "AllTime", label: "All Time" },
  { value: "Monthly", label: "Monthly" },
  { value: "Weekly", label: "Weekly" },
  { value: "Daily", label: "Daily" },
];

const DIFFICULTIES: Difficulty[] = ["All", "Easy", "Medium", "Hard", "Extreme"];

const SEASONS = ["Season 1", "Season 2", "Season 3"];

// ─── Sample data (shown when backend returns empty) ───────────────────────────

const SAMPLE_ENTRIES: LeaderboardEntry[] = [
  {
    tableId: "genesis",
    player: {
      toString: () => "2vxsx-fae",
    } as unknown as LeaderboardEntry["player"],
    displayName: "NeonRider_42",
    score: BigInt(9_840_250),
    replayHash: "0xabc123",
    timestamp: BigInt(Date.now() - 3600_000),
    bonusMultiplier: BigInt(3),
    badges: ["top-scorer", "veteran", "streak-master"],
  },
  {
    tableId: "genesis",
    player: {
      toString: () => "rrkah-fqaaa",
    } as unknown as LeaderboardEntry["player"],
    displayName: "CyberPunk_Pro",
    score: BigInt(7_520_100),
    replayHash: "0xdef456",
    timestamp: BigInt(Date.now() - 7200_000),
    bonusMultiplier: BigInt(2),
    badges: ["flipper-god", "silver-streak"],
  },
  {
    tableId: "neon-nights",
    player: {
      toString: () => "rwlgt-iiaaa",
    } as unknown as LeaderboardEntry["player"],
    displayName: "QuantumBaller",
    score: BigInt(6_130_880),
    replayHash: undefined,
    timestamp: BigInt(Date.now() - 10800_000),
    bonusMultiplier: BigInt(1),
    badges: ["bronze-legend"],
  },
  {
    tableId: "genesis",
    player: {
      toString: () => "xkbzj-5yaaa",
    } as unknown as LeaderboardEntry["player"],
    displayName: "Electra_Storm",
    score: BigInt(5_401_000),
    replayHash: "0xghi789",
    timestamp: BigInt(Date.now() - 86400_000),
    bonusMultiplier: BigInt(2),
    badges: ["jackpot-hunter", "speed-demon"],
  },
  {
    tableId: "neon-nights",
    player: {
      toString: () => "pjlsc-5yaaa",
    } as unknown as LeaderboardEntry["player"],
    displayName: "VoltKing99",
    score: BigInt(4_990_500),
    replayHash: undefined,
    timestamp: BigInt(Date.now() - 172800_000),
    bonusMultiplier: BigInt(1),
    badges: ["high-roller"],
  },
  {
    tableId: "genesis",
    player: {
      toString: () => "aaaaa-aa",
    } as unknown as LeaderboardEntry["player"],
    displayName: "PlasmaPhoenix",
    score: BigInt(4_212_750),
    replayHash: "0xjkl012",
    timestamp: BigInt(Date.now() - 259200_000),
    bonusMultiplier: BigInt(3),
    badges: ["mystery-bonus", "veteran"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatScore(score: bigint): string {
  return score.toLocaleString("en-US");
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncatePrincipal(p: string): string {
  if (p.length <= 14) return p;
  return `${p.slice(0, 6)}…${p.slice(-5)}`;
}

function getPlayerLabel(entry: LeaderboardEntry): string {
  return entry.displayName || truncatePrincipal(entry.player.toString());
}

function getBadgeIcon(badge: string) {
  if (badge.includes("scorer") || badge.includes("legend"))
    return <Trophy className="w-3 h-3" />;
  if (badge.includes("streak") || badge.includes("speed"))
    return <Zap className="w-3 h-3" />;
  if (badge.includes("god") || badge.includes("king"))
    return <Crown className="w-3 h-3" />;
  return <Star className="w-3 h-3" />;
}

// ─── Rank color config ────────────────────────────────────────────────────────

const RANK_STYLES: Record<
  number,
  { glow: string; crown: string; border: string; label: string }
> = {
  1: {
    glow: "shadow-[0_0_40px_rgba(255,195,50,0.5)]",
    crown: "text-yellow-400",
    border: "border-yellow-500/60",
    label: "text-yellow-400",
  },
  2: {
    glow: "shadow-[0_0_30px_rgba(180,190,210,0.4)]",
    crown: "text-slate-300",
    border: "border-slate-400/50",
    label: "text-slate-300",
  },
  3: {
    glow: "shadow-[0_0_30px_rgba(180,110,60,0.4)]",
    crown: "text-amber-600",
    border: "border-amber-700/50",
    label: "text-amber-600",
  },
};

// ─── Podium Card ──────────────────────────────────────────────────────────────

function PodiumCard({
  rank,
  entry,
  tableName,
  delay,
}: {
  rank: 1 | 2 | 3;
  entry: LeaderboardEntry;
  tableName: string;
  delay: number;
}) {
  const style = RANK_STYLES[rank];
  const heights: Record<1 | 2 | 3, string> = {
    1: "h-36 md:h-48",
    2: "h-28 md:h-36",
    3: "h-24 md:h-32",
  };
  const medalColors: Record<number, string> = {
    1: "#FFD700",
    2: "#C0C0C0",
    3: "#CD7F32",
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Crown */}
      <Crown
        className={`w-6 h-6 md:w-8 md:h-8 ${style.crown} drop-shadow-lg`}
        fill={rank === 1 ? "currentColor" : "none"}
        strokeWidth={rank === 1 ? 0 : 1.5}
        data-ocid={`leaderboard.podium_crown.${rank}`}
      />

      {/* Info card */}
      <div
        className={`arcade-card ${style.glow} border ${style.border} w-28 md:w-36 flex flex-col items-center gap-2 py-4 px-3 min-w-0`}
        data-ocid={`leaderboard.podium_card.${rank}`}
      >
        <Medal className="w-6 h-6" style={{ color: medalColors[rank] }} />

        <p
          className={`font-display font-bold text-xs md:text-sm text-center truncate w-full ${style.label}`}
        >
          {getPlayerLabel(entry)}
        </p>

        <p className="score-large !text-xl md:!text-2xl text-center leading-tight">
          {formatScore(entry.score)}
        </p>

        <p className="text-muted-foreground text-xs truncate w-full text-center">
          {tableName}
        </p>

        {entry.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center">
            {entry.badges.slice(0, 2).map((b) => (
              <span
                key={b}
                className="governance-badge !text-[10px] !px-1 !py-0.5 flex items-center gap-0.5"
              >
                {getBadgeIcon(b)}
                <span className="truncate max-w-[48px]">
                  {b.replace(/-/g, " ")}
                </span>
              </span>
            ))}
            {entry.badges.length > 2 && (
              <span className="text-muted-foreground text-[10px]">
                +{entry.badges.length - 2}
              </span>
            )}
          </div>
        )}

        {entry.bonusMultiplier > BigInt(1) && (
          <span className="text-yellow-400 font-mono font-bold text-xs">
            ×{entry.bonusMultiplier.toString()}
          </span>
        )}
      </div>

      {/* Podium base */}
      <div
        className={`w-28 md:w-36 ${heights[rank]} rounded-t-sm border ${style.border} flex items-end justify-center pb-2`}
        style={{
          background:
            "linear-gradient(to top, oklch(var(--card)), oklch(var(--background)))",
        }}
      >
        <span
          className={`font-display font-black text-2xl md:text-4xl ${style.label} select-none`}
        >
          #{rank}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Badge cell ───────────────────────────────────────────────────────────────

function BadgeCell({ badges }: { badges: string[] }) {
  if (!badges.length)
    return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <div className="flex flex-wrap gap-1 min-w-0">
      {badges.slice(0, 3).map((b) => (
        <span
          key={b}
          className="governance-badge flex items-center gap-0.5 !text-[10px] !px-1 !py-0.5"
        >
          {getBadgeIcon(b)}
          <span className="truncate max-w-[52px]">{b.replace(/-/g, " ")}</span>
        </span>
      ))}
      {badges.length > 3 && (
        <span className="text-muted-foreground text-xs self-center">
          +{badges.length - 3}
        </span>
      )}
    </div>
  );
}

// ─── Rank row ─────────────────────────────────────────────────────────────────

function RankRow({
  rank,
  entry,
  tableName,
  isCurrentUser,
  index,
}: {
  rank: number;
  entry: LeaderboardEntry;
  tableName: string;
  isCurrentUser: boolean;
  index: number;
}) {
  const topStyle = RANK_STYLES[rank as 1 | 2 | 3];
  const isTop3 = rank <= 3;

  return (
    <motion.tr
      className={[
        "border-b border-border/50 transition-colors hover:bg-muted/20",
        isCurrentUser ? "outline outline-1 outline-accent/50 bg-accent/5" : "",
        isTop3 ? "bg-card/50" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      data-ocid={`leaderboard.table_row.${rank}`}
    >
      {/* Rank number */}
      <td className="py-3 pl-4 pr-2 w-12">
        <span
          className={`font-display font-bold text-sm ${isTop3 ? topStyle.label : "text-muted-foreground"}`}
        >
          {rank}
        </span>
      </td>

      {/* Player name */}
      <td className="py-3 px-2 min-w-0 max-w-[160px]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="font-mono text-[10px] text-primary font-bold">
              {getPlayerLabel(entry).slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-display truncate text-foreground">
            {getPlayerLabel(entry)}
          </span>
          {isCurrentUser && (
            <Badge
              variant="outline"
              className="text-[10px] px-1 py-0 border-accent/60 text-accent ml-1 flex-shrink-0"
            >
              You
            </Badge>
          )}
        </div>
      </td>

      {/* Score */}
      <td className="py-3 px-2 text-right">
        <span className="score-display">{formatScore(entry.score)}</span>
      </td>

      {/* Bonus multiplier */}
      <td className="py-3 px-2 text-center">
        {entry.bonusMultiplier > BigInt(1) ? (
          <span className="font-mono font-bold text-xs text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/30">
            ×{entry.bonusMultiplier.toString()}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </td>

      {/* Table — hidden on mobile */}
      <td className="py-3 px-2 hidden md:table-cell">
        <span className="text-muted-foreground text-xs truncate max-w-[100px] block">
          {tableName}
        </span>
      </td>

      {/* Date — hidden on mobile */}
      <td className="py-3 px-2 hidden md:table-cell">
        <span className="text-muted-foreground text-xs">
          {formatDate(entry.timestamp)}
        </span>
      </td>

      {/* Badges */}
      <td className="py-3 px-2">
        <BadgeCell badges={entry.badges} />
      </td>

      {/* Ghost replay */}
      <td className="py-3 pl-2 pr-4">
        {entry.replayHash ? (
          <button
            type="button"
            className="text-primary hover:text-accent transition-colors p-1 rounded hover:bg-primary/10"
            title="Watch ghost replay"
            aria-label="Watch ghost replay"
            data-ocid={`leaderboard.replay_button.${rank}`}
          >
            <Ghost className="w-4 h-4" />
          </button>
        ) : (
          <span className="w-4 h-4 block" aria-hidden="true" />
        )}
      </td>
    </motion.tr>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function TableSkeleton() {
  const rows = ["r1", "r2", "r3", "r4", "r5", "r6"];
  return (
    <div className="p-4 space-y-2" data-ocid="leaderboard.loading_state">
      {rows.map((k) => (
        <Skeleton key={k} className="h-12 w-full rounded" />
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("AllTime");
  const [selectedTableId, setSelectedTableId] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<Difficulty>("All");
  const [season, setSeason] = useState<string>("all");
  const [tableDropdownOpen, setTableDropdownOpen] = useState(false);

  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal().toString();

  const { data: tables = [], isLoading: tablesLoading } = useGetTables();
  const { data: entries = [], isLoading: entriesLoading } = useGetLeaderboard(
    selectedTableId === "all" ? "" : selectedTableId,
  );

  // Merge with sample data if backend is empty
  const effectiveEntries: LeaderboardEntry[] =
    entries.length > 0 ? (entries as LeaderboardEntry[]) : SAMPLE_ENTRIES;

  const filteredEntries = useMemo(() => {
    let list = effectiveEntries;
    if (selectedTableId !== "all") {
      list = list.filter((e) => e.tableId === selectedTableId);
    }
    return list.slice(0, 100);
  }, [effectiveEntries, selectedTableId]);

  // Build table name lookup
  const tableMap = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {
      genesis: "Neon Nights",
      "neon-nights": "Neon Nights",
    };
    for (const t of tables as PinballTable[]) {
      map[t.id] = t.name;
    }
    return map;
  }, [tables]);

  const getTableName = (id: string) => tableMap[id] ?? id;

  const isLoading = tablesLoading || entriesLoading;
  const showSeasons = selectedTableId !== "all";

  // Podium needs top 3
  const podiumEntries = filteredEntries.slice(0, 3);

  return (
    <div
      className="min-h-screen bg-background pb-16"
      data-ocid="leaderboard.page"
    >
      {/* ── Sticky filter bar ─────────────────────────────────────────────── */}
      <div
        className="bg-card border-b border-border/50 sticky top-0 z-30"
        data-ocid="leaderboard.filter_bar"
      >
        <div className="max-w-5xl mx-auto px-4 py-4">
          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="font-display font-black text-2xl md:text-3xl text-foreground flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                Leaderboard
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Top Players Across All Tables
              </p>
            </div>

            {/* Period filter */}
            <div
              className="flex flex-wrap gap-1.5"
              data-ocid="leaderboard.period_filter"
            >
              {PERIODS.map((p) => (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`arcade-tab touch-target text-xs md:text-sm ${period === p.value ? "arcade-tab-active" : ""}`}
                  data-ocid={`leaderboard.period_tab.${p.value.toLowerCase()}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary filters row */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Table dropdown */}
            <div className="relative" data-ocid="leaderboard.table_filter">
              <Button
                variant="outline"
                size="sm"
                className="font-display text-xs border-border/60 hover:border-primary/40 h-8 gap-1"
                onClick={() => setTableDropdownOpen((v) => !v)}
                data-ocid="leaderboard.table_select"
              >
                <span className="truncate max-w-[110px]">
                  {selectedTableId === "all"
                    ? "All Tables"
                    : getTableName(selectedTableId)}
                </span>
                <ChevronDown className="w-3 h-3 flex-shrink-0" />
              </Button>

              {tableDropdownOpen && (
                <div className="absolute top-9 left-0 z-50 arcade-card min-w-[180px] py-1 shadow-2xl border border-border/60">
                  {[
                    { id: "all", name: "All Tables" } as PinballTable,
                    ...(tables as PinballTable[]),
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      className={`w-full text-left px-3 py-2 text-sm font-display hover:bg-muted/40 transition-colors ${
                        selectedTableId === t.id
                          ? "text-accent"
                          : "text-foreground"
                      }`}
                      onClick={() => {
                        setSelectedTableId(t.id);
                        setTableDropdownOpen(false);
                      }}
                      data-ocid={`leaderboard.table_option.${t.id}`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty filter */}
            <div
              className="flex flex-wrap gap-1"
              data-ocid="leaderboard.difficulty_filter"
            >
              {DIFFICULTIES.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-2 py-1 rounded text-xs font-display font-semibold border transition-all ${
                    difficulty === d
                      ? "border-primary/60 text-primary bg-primary/10"
                      : "border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                  data-ocid={`leaderboard.difficulty_tab.${d.toLowerCase()}`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Season picker — visible only when specific table selected */}
            {showSeasons && (
              <div
                className="flex items-center gap-1.5 ml-auto"
                data-ocid="leaderboard.season_filter"
              >
                <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <select
                  className="text-xs font-display bg-card border border-border/60 text-foreground rounded px-2 py-1 focus:outline-none focus:border-primary/60 cursor-pointer"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  data-ocid="leaderboard.season_select"
                >
                  <option value="all">Current Season</option>
                  {SEASONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* ── Podium ─────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div
            className="flex justify-center gap-4 py-8"
            data-ocid="leaderboard.podium_loading"
          >
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-52 w-32 rounded-md" />
            ))}
          </div>
        ) : podiumEntries.length >= 3 ? (
          <section
            className="bg-muted/10 rounded-xl py-8 px-4 border border-border/30"
            data-ocid="leaderboard.podium_section"
          >
            <p className="text-center text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest mb-6">
              Top Champions
            </p>
            <div className="flex flex-row justify-center items-end gap-3 md:gap-8 overflow-x-auto pb-2">
              {/* Render in order: 2nd (left), 1st (center), 3rd (right) */}
              {podiumEntries[1] && (
                <PodiumCard
                  rank={2}
                  entry={podiumEntries[1]}
                  tableName={getTableName(podiumEntries[1].tableId)}
                  delay={0.15}
                />
              )}
              {podiumEntries[0] && (
                <PodiumCard
                  rank={1}
                  entry={podiumEntries[0]}
                  tableName={getTableName(podiumEntries[0].tableId)}
                  delay={0}
                />
              )}
              {podiumEntries[2] && (
                <PodiumCard
                  rank={3}
                  entry={podiumEntries[2]}
                  tableName={getTableName(podiumEntries[2].tableId)}
                  delay={0.25}
                />
              )}
            </div>
          </section>
        ) : null}

        {/* ── Rankings table ─────────────────────────────────────────────── */}
        <section data-ocid="leaderboard.rankings_section">
          <motion.div
            className="arcade-card overflow-hidden !p-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {/* Table header bar */}
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-muted/10">
              <h2 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                <Medal className="w-4 h-4 text-primary" />
                Full Rankings
                {period !== "AllTime" && (
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/40 text-primary"
                  >
                    {PERIODS.find((p) => p.value === period)?.label}
                  </Badge>
                )}
                {difficulty !== "All" && (
                  <Badge
                    variant="outline"
                    className="text-xs border-accent/40 text-accent"
                  >
                    {difficulty}
                  </Badge>
                )}
                {showSeasons && season !== "all" && (
                  <Badge
                    variant="outline"
                    className="text-xs border-yellow-400/40 text-yellow-400"
                  >
                    {season}
                  </Badge>
                )}
              </h2>
              <span className="text-muted-foreground text-xs font-mono">
                {filteredEntries.length} / 100
              </span>
            </div>

            {isLoading ? (
              <TableSkeleton />
            ) : filteredEntries.length === 0 ? (
              <div
                className="p-12 text-center"
                data-ocid="leaderboard.empty_state"
              >
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="font-display font-bold text-foreground text-lg mb-1">
                  No scores yet
                </p>
                <p className="text-muted-foreground text-sm">
                  Be the first to play and claim the top spot!
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 border-primary/40 text-primary hover:bg-primary/10"
                  data-ocid="leaderboard.play_cta_button"
                >
                  Play Now
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="w-full text-left"
                  data-ocid="leaderboard.rankings_table"
                >
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/10">
                      <th className="py-2 pl-4 pr-2 font-display text-xs text-muted-foreground uppercase tracking-wider w-12">
                        #
                      </th>
                      <th className="py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider">
                        Player
                      </th>
                      <th className="py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider text-right">
                        Score
                      </th>
                      <th className="py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider text-center">
                        Bonus
                      </th>
                      <th className="py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                        Table
                      </th>
                      <th className="py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                        Date
                      </th>
                      <th className="py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider">
                        Badges
                      </th>
                      <th className="py-2 pl-2 pr-4 font-display text-xs text-muted-foreground uppercase tracking-wider">
                        <Ghost
                          className="w-3.5 h-3.5"
                          aria-label="Ghost replay"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry, i) => (
                      <RankRow
                        key={`${entry.player.toString()}-${i}`}
                        rank={i + 1}
                        entry={entry}
                        tableName={getTableName(entry.tableId)}
                        isCurrentUser={
                          !!currentPrincipal &&
                          entry.player.toString() === currentPrincipal
                        }
                        index={i}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
