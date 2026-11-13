import { c as createLucideIcon, r as reactExports, i as useInternetIdentity, u as useGetTables, k as useGetLeaderboard, j as jsxRuntimeExports, T as Trophy, B as Button, l as Badge, Z as Zap } from "./index-Buftnbn6.js";
import { S as Skeleton } from "./skeleton-BuI67MZe.js";
import { C as ChevronDown } from "./chevron-down-BPbH05yw.js";
import { m as motion } from "./proxy-BprsZsqJ.js";
import { M as Medal } from "./medal-OKimXEOx.js";
import { C as Crown } from "./crown-DjNRGjT-.js";
import { S as Star } from "./star-DSlGNHEh.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M9 10h.01", key: "qbtxuw" }],
  ["path", { d: "M15 10h.01", key: "1qmjsl" }],
  [
    "path",
    {
      d: "M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",
      key: "uwwb07"
    }
  ]
];
const Ghost = createLucideIcon("ghost", __iconNode);
const PERIODS = [
  { value: "AllTime", label: "All Time" },
  { value: "Monthly", label: "Monthly" },
  { value: "Weekly", label: "Weekly" },
  { value: "Daily", label: "Daily" }
];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard", "Extreme"];
const SEASONS = ["Season 1", "Season 2", "Season 3"];
const SAMPLE_ENTRIES = [
  {
    tableId: "genesis",
    player: {
      toString: () => "2vxsx-fae"
    },
    displayName: "NeonRider_42",
    score: BigInt(9840250),
    replayHash: "0xabc123",
    timestamp: BigInt(Date.now() - 36e5),
    bonusMultiplier: BigInt(3),
    badges: ["top-scorer", "veteran", "streak-master"]
  },
  {
    tableId: "genesis",
    player: {
      toString: () => "rrkah-fqaaa"
    },
    displayName: "CyberPunk_Pro",
    score: BigInt(7520100),
    replayHash: "0xdef456",
    timestamp: BigInt(Date.now() - 72e5),
    bonusMultiplier: BigInt(2),
    badges: ["flipper-god", "silver-streak"]
  },
  {
    tableId: "neon-nights",
    player: {
      toString: () => "rwlgt-iiaaa"
    },
    displayName: "QuantumBaller",
    score: BigInt(6130880),
    replayHash: void 0,
    timestamp: BigInt(Date.now() - 108e5),
    bonusMultiplier: BigInt(1),
    badges: ["bronze-legend"]
  },
  {
    tableId: "genesis",
    player: {
      toString: () => "xkbzj-5yaaa"
    },
    displayName: "Electra_Storm",
    score: BigInt(5401e3),
    replayHash: "0xghi789",
    timestamp: BigInt(Date.now() - 864e5),
    bonusMultiplier: BigInt(2),
    badges: ["jackpot-hunter", "speed-demon"]
  },
  {
    tableId: "neon-nights",
    player: {
      toString: () => "pjlsc-5yaaa"
    },
    displayName: "VoltKing99",
    score: BigInt(4990500),
    replayHash: void 0,
    timestamp: BigInt(Date.now() - 1728e5),
    bonusMultiplier: BigInt(1),
    badges: ["high-roller"]
  },
  {
    tableId: "genesis",
    player: {
      toString: () => "aaaaa-aa"
    },
    displayName: "PlasmaPhoenix",
    score: BigInt(4212750),
    replayHash: "0xjkl012",
    timestamp: BigInt(Date.now() - 2592e5),
    bonusMultiplier: BigInt(3),
    badges: ["mystery-bonus", "veteran"]
  }
];
function formatScore(score) {
  return score.toLocaleString("en-US");
}
function formatDate(ts) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function truncatePrincipal(p) {
  if (p.length <= 14) return p;
  return `${p.slice(0, 6)}…${p.slice(-5)}`;
}
function getPlayerLabel(entry) {
  return entry.displayName || truncatePrincipal(entry.player.toString());
}
function getBadgeIcon(badge) {
  if (badge.includes("scorer") || badge.includes("legend"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3 h-3" });
  if (badge.includes("streak") || badge.includes("speed"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" });
  if (badge.includes("god") || badge.includes("king"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3 h-3" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3" });
}
const RANK_STYLES = {
  1: {
    glow: "shadow-[0_0_40px_rgba(255,195,50,0.5)]",
    crown: "text-yellow-400",
    border: "border-yellow-500/60",
    label: "text-yellow-400"
  },
  2: {
    glow: "shadow-[0_0_30px_rgba(180,190,210,0.4)]",
    crown: "text-slate-300",
    border: "border-slate-400/50",
    label: "text-slate-300"
  },
  3: {
    glow: "shadow-[0_0_30px_rgba(180,110,60,0.4)]",
    crown: "text-amber-600",
    border: "border-amber-700/50",
    label: "text-amber-600"
  }
};
function PodiumCard({
  rank,
  entry,
  tableName,
  delay
}) {
  const style = RANK_STYLES[rank];
  const heights = {
    1: "h-36 md:h-48",
    2: "h-28 md:h-36",
    3: "h-24 md:h-32"
  };
  const medalColors = {
    1: "#FFD700",
    2: "#C0C0C0",
    3: "#CD7F32"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "flex flex-col items-center gap-2",
      initial: { y: 60, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Crown,
          {
            className: `w-6 h-6 md:w-8 md:h-8 ${style.crown} drop-shadow-lg`,
            fill: rank === 1 ? "currentColor" : "none",
            strokeWidth: rank === 1 ? 0 : 1.5,
            "data-ocid": `leaderboard.podium_crown.${rank}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `arcade-card ${style.glow} border ${style.border} w-28 md:w-36 flex flex-col items-center gap-2 py-4 px-3 min-w-0`,
            "data-ocid": `leaderboard.podium_card.${rank}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, { className: "w-6 h-6", style: { color: medalColors[rank] } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `font-display font-bold text-xs md:text-sm text-center truncate w-full ${style.label}`,
                  children: getPlayerLabel(entry)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "score-large !text-xl md:!text-2xl text-center leading-tight", children: formatScore(entry.score) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs truncate w-full text-center", children: tableName }),
              entry.badges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 justify-center", children: [
                entry.badges.slice(0, 2).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "governance-badge !text-[10px] !px-1 !py-0.5 flex items-center gap-0.5",
                    children: [
                      getBadgeIcon(b),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[48px]", children: b.replace(/-/g, " ") })
                    ]
                  },
                  b
                )),
                entry.badges.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-[10px]", children: [
                  "+",
                  entry.badges.length - 2
                ] })
              ] }),
              entry.bonusMultiplier > BigInt(1) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-yellow-400 font-mono font-bold text-xs", children: [
                "×",
                entry.bonusMultiplier.toString()
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-28 md:w-36 ${heights[rank]} rounded-t-sm border ${style.border} flex items-end justify-center pb-2`,
            style: {
              background: "linear-gradient(to top, oklch(var(--card)), oklch(var(--background)))"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `font-display font-black text-2xl md:text-4xl ${style.label} select-none`,
                children: [
                  "#",
                  rank
                ]
              }
            )
          }
        )
      ]
    }
  );
}
function BadgeCell({ badges }) {
  if (!badges.length)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 min-w-0", children: [
    badges.slice(0, 3).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "governance-badge flex items-center gap-0.5 !text-[10px] !px-1 !py-0.5",
        children: [
          getBadgeIcon(b),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[52px]", children: b.replace(/-/g, " ") })
        ]
      },
      b
    )),
    badges.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs self-center", children: [
      "+",
      badges.length - 3
    ] })
  ] });
}
function RankRow({
  rank,
  entry,
  tableName,
  isCurrentUser,
  index
}) {
  const topStyle = RANK_STYLES[rank];
  const isTop3 = rank <= 3;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      className: [
        "border-b border-border/50 transition-colors hover:bg-muted/20",
        isCurrentUser ? "outline outline-1 outline-accent/50 bg-accent/5" : "",
        isTop3 ? "bg-card/50" : ""
      ].filter(Boolean).join(" "),
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.03, duration: 0.3 },
      "data-ocid": `leaderboard.table_row.${rank}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pl-4 pr-2 w-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-display font-bold text-sm ${isTop3 ? topStyle.label : "text-muted-foreground"}`,
            children: rank
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-2 min-w-0 max-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-primary font-bold", children: getPlayerLabel(entry).slice(0, 2).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-display truncate text-foreground", children: getPlayerLabel(entry) }),
          isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "text-[10px] px-1 py-0 border-accent/60 text-accent ml-1 flex-shrink-0",
              children: "You"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "score-display", children: formatScore(entry.score) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-2 text-center", children: entry.bonusMultiplier > BigInt(1) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-xs text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/30", children: [
          "×",
          entry.bonusMultiplier.toString()
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-2 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs truncate max-w-[100px] block", children: tableName }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-2 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: formatDate(entry.timestamp) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCell, { badges: entry.badges }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 pl-2 pr-4", children: entry.replayHash ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "text-primary hover:text-accent transition-colors p-1 rounded hover:bg-primary/10",
            title: "Watch ghost replay",
            "aria-label": "Watch ghost replay",
            "data-ocid": `leaderboard.replay_button.${rank}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ghost, { className: "w-4 h-4" })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 block", "aria-hidden": "true" }) })
      ]
    }
  );
}
function TableSkeleton() {
  const rows = ["r1", "r2", "r3", "r4", "r5", "r6"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", "data-ocid": "leaderboard.loading_state", children: rows.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded" }, k)) });
}
function LeaderboardPage() {
  var _a;
  const [period, setPeriod] = reactExports.useState("AllTime");
  const [selectedTableId, setSelectedTableId] = reactExports.useState("all");
  const [difficulty, setDifficulty] = reactExports.useState("All");
  const [season, setSeason] = reactExports.useState("all");
  const [tableDropdownOpen, setTableDropdownOpen] = reactExports.useState(false);
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const { data: tables = [], isLoading: tablesLoading } = useGetTables();
  const { data: entries = [], isLoading: entriesLoading } = useGetLeaderboard(
    selectedTableId === "all" ? "" : selectedTableId
  );
  const effectiveEntries = entries.length > 0 ? entries : SAMPLE_ENTRIES;
  const filteredEntries = reactExports.useMemo(() => {
    let list = effectiveEntries;
    if (selectedTableId !== "all") {
      list = list.filter((e) => e.tableId === selectedTableId);
    }
    return list.slice(0, 100);
  }, [effectiveEntries, selectedTableId]);
  const tableMap = reactExports.useMemo(() => {
    const map = {
      genesis: "Neon Nights",
      "neon-nights": "Neon Nights"
    };
    for (const t of tables) {
      map[t.id] = t.name;
    }
    return map;
  }, [tables]);
  const getTableName = (id) => tableMap[id] ?? id;
  const isLoading = tablesLoading || entriesLoading;
  const showSeasons = selectedTableId !== "all";
  const podiumEntries = filteredEntries.slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background pb-16",
      "data-ocid": "leaderboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-card border-b border-border/50 sticky top-0 z-30",
            "data-ocid": "leaderboard.filter_bar",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-black text-2xl md:text-3xl text-foreground flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-6 h-6 text-primary" }),
                    "Leaderboard"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Top Players Across All Tables" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-wrap gap-1.5",
                    "data-ocid": "leaderboard.period_filter",
                    children: PERIODS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setPeriod(p.value),
                        className: `arcade-tab touch-target text-xs md:text-sm ${period === p.value ? "arcade-tab-active" : ""}`,
                        "data-ocid": `leaderboard.period_tab.${p.value.toLowerCase()}`,
                        children: p.label
                      },
                      p.value
                    ))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-ocid": "leaderboard.table_filter", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "font-display text-xs border-border/60 hover:border-primary/40 h-8 gap-1",
                      onClick: () => setTableDropdownOpen((v) => !v),
                      "data-ocid": "leaderboard.table_select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[110px]", children: selectedTableId === "all" ? "All Tables" : getTableName(selectedTableId) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3 flex-shrink-0" })
                      ]
                    }
                  ),
                  tableDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-9 left-0 z-50 arcade-card min-w-[180px] py-1 shadow-2xl border border-border/60", children: [
                    { id: "all", name: "All Tables" },
                    ...tables
                  ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: `w-full text-left px-3 py-2 text-sm font-display hover:bg-muted/40 transition-colors ${selectedTableId === t.id ? "text-accent" : "text-foreground"}`,
                      onClick: () => {
                        setSelectedTableId(t.id);
                        setTableDropdownOpen(false);
                      },
                      "data-ocid": `leaderboard.table_option.${t.id}`,
                      children: t.name
                    },
                    t.id
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-wrap gap-1",
                    "data-ocid": "leaderboard.difficulty_filter",
                    children: DIFFICULTIES.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setDifficulty(d),
                        className: `px-2 py-1 rounded text-xs font-display font-semibold border transition-all ${difficulty === d ? "border-primary/60 text-primary bg-primary/10" : "border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"}`,
                        "data-ocid": `leaderboard.difficulty_tab.${d.toLowerCase()}`,
                        children: d
                      },
                      d
                    ))
                  }
                ),
                showSeasons && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-1.5 ml-auto",
                    "data-ocid": "leaderboard.season_filter",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 text-muted-foreground flex-shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "select",
                        {
                          className: "text-xs font-display bg-card border border-border/60 text-foreground rounded px-2 py-1 focus:outline-none focus:border-primary/60 cursor-pointer",
                          value: season,
                          onChange: (e) => setSeason(e.target.value),
                          "data-ocid": "leaderboard.season_select",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Current Season" }),
                            SEASONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
                          ]
                        }
                      )
                    ]
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8 space-y-10", children: [
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex justify-center gap-4 py-8",
              "data-ocid": "leaderboard.podium_loading",
              children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 w-32 rounded-md" }, i))
            }
          ) : podiumEntries.length >= 3 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "section",
            {
              className: "bg-muted/10 rounded-xl py-8 px-4 border border-border/30",
              "data-ocid": "leaderboard.podium_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest mb-6", children: "Top Champions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row justify-center items-end gap-3 md:gap-8 overflow-x-auto pb-2", children: [
                  podiumEntries[1] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PodiumCard,
                    {
                      rank: 2,
                      entry: podiumEntries[1],
                      tableName: getTableName(podiumEntries[1].tableId),
                      delay: 0.15
                    }
                  ),
                  podiumEntries[0] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PodiumCard,
                    {
                      rank: 1,
                      entry: podiumEntries[0],
                      tableName: getTableName(podiumEntries[0].tableId),
                      delay: 0
                    }
                  ),
                  podiumEntries[2] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PodiumCard,
                    {
                      rank: 3,
                      entry: podiumEntries[2],
                      tableName: getTableName(podiumEntries[2].tableId),
                      delay: 0.25
                    }
                  )
                ] })
              ]
            }
          ) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "leaderboard.rankings_section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "arcade-card overflow-hidden !p-0",
              initial: { opacity: 0, y: 24 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4, delay: 0.3 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border/50 flex items-center justify-between bg-muted/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-sm text-foreground flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, { className: "w-4 h-4 text-primary" }),
                    "Full Rankings",
                    period !== "AllTime" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs border-primary/40 text-primary",
                        children: (_a = PERIODS.find((p) => p.value === period)) == null ? void 0 : _a.label
                      }
                    ),
                    difficulty !== "All" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs border-accent/40 text-accent",
                        children: difficulty
                      }
                    ),
                    showSeasons && season !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs border-yellow-400/40 text-yellow-400",
                        children: season
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs font-mono", children: [
                    filteredEntries.length,
                    " / 100"
                  ] })
                ] }),
                isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {}) : filteredEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "p-12 text-center",
                    "data-ocid": "leaderboard.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-12 h-12 mx-auto text-muted-foreground/30 mb-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-lg mb-1", children: "No scores yet" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Be the first to play and claim the top spot!" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "outline",
                          size: "sm",
                          className: "mt-5 border-primary/40 text-primary hover:bg-primary/10",
                          "data-ocid": "leaderboard.play_cta_button",
                          children: "Play Now"
                        }
                      )
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "table",
                  {
                    className: "w-full text-left",
                    "data-ocid": "leaderboard.rankings_table",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50 bg-muted/10", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pl-4 pr-2 font-display text-xs text-muted-foreground uppercase tracking-wider w-12", children: "#" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider", children: "Player" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider text-right", children: "Score" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider text-center", children: "Bonus" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell", children: "Table" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell", children: "Date" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-2 font-display text-xs text-muted-foreground uppercase tracking-wider", children: "Badges" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pl-2 pr-4 font-display text-xs text-muted-foreground uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Ghost,
                          {
                            className: "w-3.5 h-3.5",
                            "aria-label": "Ghost replay"
                          }
                        ) })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredEntries.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RankRow,
                        {
                          rank: i + 1,
                          entry,
                          tableName: getTableName(entry.tableId),
                          isCurrentUser: !!currentPrincipal && entry.player.toString() === currentPrincipal,
                          index: i
                        },
                        `${entry.player.toString()}-${i}`
                      )) })
                    ]
                  }
                ) })
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  LeaderboardPage as default
};
