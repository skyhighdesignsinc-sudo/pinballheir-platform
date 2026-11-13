import { r as reactExports, u as useGetTables, a as useGetTableEconomies, b as useGetDailyMysteryTable, j as jsxRuntimeExports, L as Link, B as Button, I as Input, Z as Zap } from "./index-Buftnbn6.js";
import { S as Skeleton } from "./skeleton-BuI67MZe.js";
import { P as Play } from "./play-BQuN3QQU.js";
import { P as Plus } from "./plus-CrZ-ZUtm.js";
import { S as Search } from "./search-BPo98NeZ.js";
import { F as Funnel } from "./funnel-DTlKZGM4.js";
import { C as Crown } from "./crown-DjNRGjT-.js";
function truncatePrincipal(p) {
  const s = typeof p === "string" ? p : p.toString();
  if (s.length <= 12) return s;
  return `${s.slice(0, 5)}…${s.slice(-5)}`;
}
function formatICFC(amount) {
  const n = Number(amount) / 1e8;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(2);
}
function getDifficultyFromTable(table) {
  const g = table.gravity ?? 1;
  if (g < 0.5) return "Easy";
  if (g < 1) return "Medium";
  if (g < 1.5) return "Hard";
  return "Extreme";
}
const DIFFICULTY_CONFIG = {
  Easy: {
    label: "Easy",
    color: "text-green-400 border-green-400/40 bg-green-400/10"
  },
  Medium: {
    label: "Medium",
    color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10"
  },
  Hard: {
    label: "Hard",
    color: "text-orange-400 border-orange-400/40 bg-orange-400/10"
  },
  Extreme: {
    label: "Extreme",
    color: "text-red-400 border-red-400/40 bg-red-400/10"
  }
};
const STATUS_CONFIG = {
  Released: {
    label: "Released",
    color: "text-accent border-accent/40 bg-accent/10"
  },
  Beta: {
    label: "Beta",
    color: "text-muted-foreground border-border bg-muted/40"
  }
};
function ArcadeCabinetSVG() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 220 340",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className: "w-full max-w-[220px] drop-shadow-[0_0_30px_oklch(0.7_0.25_280/0.4)]",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "20",
            y: "60",
            width: "180",
            height: "260",
            rx: "8",
            fill: "oklch(0.205 0 0)",
            stroke: "oklch(0.7 0.25 280 / 0.8)",
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "10",
            y: "20",
            width: "200",
            height: "50",
            rx: "6",
            fill: "oklch(0.145 0 0)",
            stroke: "oklch(0.7 0.25 280 / 0.9)",
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "20",
            y: "28",
            width: "180",
            height: "34",
            rx: "4",
            fill: "oklch(0.7 0.25 280 / 0.12)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "110",
            y: "48",
            textAnchor: "middle",
            fill: "oklch(0.7 0.25 280)",
            fontFamily: "monospace",
            fontSize: "14",
            fontWeight: "bold",
            letterSpacing: "3",
            children: "PINBALL"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "35",
            y: "80",
            width: "150",
            height: "120",
            rx: "4",
            fill: "oklch(0.145 0 0)",
            stroke: "oklch(0.65 0.28 180 / 0.6)",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "40",
            y: "85",
            width: "140",
            height: "110",
            rx: "2",
            fill: "oklch(0.10 0 0)"
          }
        ),
        [60, 80, 100, 120, 140, 160].map((x) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: x,
            y1: "85",
            x2: x,
            y2: "195",
            stroke: "oklch(0.65 0.28 180 / 0.2)",
            strokeWidth: "0.5"
          },
          x
        )),
        [105, 125, 145, 165, 185].map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "40",
            y1: y,
            x2: "180",
            y2: y,
            stroke: "oklch(0.65 0.28 180 / 0.2)",
            strokeWidth: "0.5"
          },
          y
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "110",
            cy: "140",
            r: "12",
            fill: "oklch(0.7 0.25 280)",
            filter: "url(#ballGlow)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "108", cy: "138", r: "3", fill: "oklch(0.95 0 0 / 0.3)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "110",
            y: "100",
            textAnchor: "middle",
            fill: "oklch(0.65 0.28 180)",
            fontFamily: "monospace",
            fontSize: "8",
            letterSpacing: "2",
            children: "00000000"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "55",
            y1: "185",
            x2: "90",
            y2: "178",
            stroke: "oklch(0.7 0.25 280)",
            strokeWidth: "4",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "165",
            y1: "185",
            x2: "130",
            y2: "178",
            stroke: "oklch(0.7 0.25 280)",
            strokeWidth: "4",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "75",
            cy: "115",
            r: "6",
            fill: "none",
            stroke: "oklch(0.65 0.28 180 / 0.7)",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "110",
            cy: "110",
            r: "6",
            fill: "none",
            stroke: "oklch(0.65 0.28 180 / 0.7)",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "145",
            cy: "115",
            r: "6",
            fill: "none",
            stroke: "oklch(0.65 0.28 180 / 0.7)",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "35",
            y: "215",
            width: "150",
            height: "60",
            rx: "4",
            fill: "oklch(0.18 0 0)",
            stroke: "oklch(0.7 0.25 280 / 0.4)",
            strokeWidth: "1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "75",
            cy: "235",
            r: "10",
            fill: "oklch(0.7 0.25 280)",
            filter: "url(#btnGlow)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "75", cy: "235", r: "7", fill: "oklch(0.6 0.25 280)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "145",
            cy: "235",
            r: "10",
            fill: "oklch(0.65 0.28 180)",
            filter: "url(#btnGlowCyan)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "145", cy: "235", r: "7", fill: "oklch(0.55 0.28 180)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "90",
            y: "248",
            width: "40",
            height: "8",
            rx: "4",
            fill: "oklch(0.145 0 0)",
            stroke: "oklch(0.708 0 0 / 0.4)",
            strokeWidth: "1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "110",
            y: "255",
            textAnchor: "middle",
            fill: "oklch(0.708 0 0)",
            fontFamily: "monospace",
            fontSize: "5",
            children: "INSERT COIN"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "25",
            y1: "90",
            x2: "25",
            y2: "290",
            stroke: "oklch(0.7 0.25 280 / 0.3)",
            strokeWidth: "1",
            strokeDasharray: "4 4"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "195",
            y1: "90",
            x2: "195",
            y2: "290",
            stroke: "oklch(0.7 0.25 280 / 0.3)",
            strokeWidth: "1",
            strokeDasharray: "4 4"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "35",
            y: "315",
            width: "20",
            height: "20",
            rx: "2",
            fill: "oklch(0.145 0 0)",
            stroke: "oklch(0.7 0.25 280 / 0.4)",
            strokeWidth: "1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "165",
            y: "315",
            width: "20",
            height: "20",
            rx: "2",
            fill: "oklch(0.145 0 0)",
            stroke: "oklch(0.7 0.25 280 / 0.4)",
            strokeWidth: "1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "22",
            y1: "100",
            x2: "22",
            y2: "280",
            stroke: "oklch(0.65 0.28 180)",
            strokeWidth: "2",
            opacity: "0.6"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "198",
            y1: "100",
            x2: "198",
            y2: "280",
            stroke: "oklch(0.65 0.28 180)",
            strokeWidth: "2",
            opacity: "0.6"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: "ballGlow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "4", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: "btnGlow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "3", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: "btnGlowCyan", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "3", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function TableCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "arcade-card flex flex-col gap-3 min-h-[220px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-3/4 bg-muted/50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 bg-muted/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 bg-muted/50" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2 bg-muted/50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3 bg-muted/50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/3 bg-muted/50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full bg-muted/50" }) })
  ] });
}
function GenesisTableCard({
  table,
  economy,
  isMystery,
  index
}) {
  const difficulty = getDifficultyFromTable(table);
  const diffConfig = DIFFICULTY_CONFIG[difficulty];
  const isFree = !economy || economy.entryFee === BigInt(0);
  const jackpotDisplay = economy ? formatICFC(economy.icfcTreasury) : "0";
  const creatorStr = truncatePrincipal(table.creator);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `table.item.${index}`,
      className: "col-span-full arcade-card-interactive relative overflow-hidden",
      style: {
        background: "linear-gradient(135deg, oklch(0.205 0 0) 0%, oklch(0.18 0.04 280) 50%, oklch(0.205 0 0) 100%)",
        border: "2px solid oklch(0.7 0.25 280 / 0.6)",
        boxShadow: "0 0 40px oklch(0.7 0.25 280 / 0.2), 0 8px 32px rgba(0,0,0,0.7)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "pointer-events-none absolute inset-0 opacity-[0.04]",
            style: {
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.985 0 0) 2px, oklch(0.985 0 0) 3px)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "pointer-events-none absolute inset-0 opacity-10",
            style: {
              backgroundImage: "linear-gradient(oklch(0.65 0.28 180 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.28 180 / 0.3) 1px, transparent 1px)",
              backgroundSize: "32px 32px"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col md:flex-row gap-6 p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-display border",
                  style: {
                    color: "oklch(0.75 0.25 60)",
                    borderColor: "oklch(0.75 0.25 60 / 0.5)",
                    background: "oklch(0.75 0.25 60 / 0.1)"
                  },
                  children: "DAO Genesis Table"
                }
              ),
              isMystery && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-display border",
                  style: {
                    color: "oklch(0.75 0.25 60)",
                    borderColor: "oklch(0.75 0.25 60 / 0.5)",
                    background: "oklch(0.75 0.25 60 / 0.1)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3 h-3" }),
                    " MYSTERY TABLE 3×"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "font-display text-2xl md:text-3xl font-bold",
                style: {
                  color: "oklch(0.7 0.25 280)",
                  textShadow: "0 0 16px oklch(0.7 0.25 280 / 0.7), 0 0 32px oklch(0.7 0.25 280 / 0.4)"
                },
                children: table.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${diffConfig.color}`,
                  children: diffConfig.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border text-accent border-accent/40 bg-accent/10", children: "Released" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-6 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono text-xs uppercase tracking-wider", children: "Entry" }),
                isFree ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-bold font-mono",
                    style: {
                      color: "oklch(0.6 0.22 140)",
                      textShadow: "0 0 8px oklch(0.6 0.22 140 / 0.6)"
                    },
                    children: "FREE TO PLAY"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-foreground", children: [
                  formatICFC(economy.entryFee),
                  " ICFC"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono text-xs uppercase tracking-wider", children: "Jackpot Pool" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold neon-text-accent flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5" }),
                  jackpotDisplay,
                  " ICFC"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono text-xs uppercase tracking-wider", children: "Creator" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground text-xs", children: creatorStr })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/play/$tableId", params: { tableId: table.id }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": `table.play_button.${index}`,
              size: "lg",
              className: "arcade-glow font-display font-bold tracking-wider text-base px-8 h-12",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 mr-2" }),
                " PLAY NOW"
              ]
            }
          ) }) })
        ] })
      ]
    }
  );
}
function TableCard({
  table,
  economy,
  isMystery,
  isGenesis,
  index
}) {
  if (isGenesis) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      GenesisTableCard,
      {
        table,
        economy,
        isMystery,
        index
      }
    );
  }
  const difficulty = getDifficultyFromTable(table);
  const diffConfig = DIFFICULTY_CONFIG[difficulty];
  const statusKey = table.status === "Released" ? "Released" : "Beta";
  const statusConfig = STATUS_CONFIG[statusKey];
  const isFree = !economy || economy.entryFee === BigInt(0);
  const jackpotDisplay = economy ? formatICFC(economy.icfcTreasury) : "0";
  const creatorStr = truncatePrincipal(table.creator);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `table.item.${index}`,
      className: "arcade-card-interactive flex flex-col gap-3 relative overflow-hidden",
      children: [
        isMystery && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-display border z-10",
            style: {
              color: "oklch(0.75 0.25 60)",
              borderColor: "oklch(0.75 0.25 60 / 0.5)",
              background: "oklch(0.75 0.25 60 / 0.1)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3 h-3" }),
              " 3×"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h3",
          {
            className: "font-display font-bold text-lg leading-tight pr-16 min-w-0",
            style: {
              color: "oklch(0.7 0.25 280)",
              textShadow: "0 0 10px oklch(0.7 0.25 280 / 0.5)"
            },
            children: table.name
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${diffConfig.color}`,
              children: diffConfig.label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${statusConfig.color}`,
              children: statusConfig.label
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 text-sm flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-mono uppercase tracking-wide", children: "Entry" }),
            isFree ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-bold font-mono text-xs",
                style: {
                  color: "oklch(0.6 0.22 140)",
                  textShadow: "0 0 8px oklch(0.6 0.22 140 / 0.5)"
                },
                children: "FREE TO PLAY"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-foreground text-xs", children: [
              formatICFC(economy.entryFee),
              " ICFC"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-mono uppercase tracking-wide", children: "Jackpot" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold neon-text-accent text-xs flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
              jackpotDisplay,
              " ICFC"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-mono uppercase tracking-wide", children: "Creator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground text-xs", children: creatorStr })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/play/$tableId", params: { tableId: table.id }, className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": `table.play_button.${index}`,
            className: "w-full font-display font-semibold tracking-wider",
            variant: "outline",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 mr-1.5" }),
              " PLAY"
            ]
          }
        ) })
      ]
    }
  );
}
function StatsBar({
  tableCount,
  totalJackpot,
  mysteryTableName,
  isLoading
}) {
  const stats = [
    {
      label: "Tables",
      value: isLoading ? "—" : String(tableCount),
      glow: false,
      crown: false
    },
    {
      label: "ICFC in Jackpots",
      value: isLoading ? "—" : `${formatICFC(totalJackpot)} ICFC`,
      glow: true,
      crown: false
    },
    {
      label: "Daily Mystery",
      value: isLoading ? "—" : mysteryTableName ?? "None",
      glow: !!mysteryTableName,
      crown: !!mysteryTableName
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-full flex flex-wrap justify-center gap-px",
      "data-ocid": "stats.bar",
      children: stats.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex-1 min-w-[140px] flex flex-col items-center gap-1 px-6 py-3 bg-card border border-border first:rounded-l-lg last:rounded-r-lg",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono text-[10px] uppercase tracking-widest", children: stat.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `font-display font-bold text-base truncate max-w-full flex items-center gap-1 ${stat.glow ? "neon-text-accent" : "text-foreground"}`,
                children: [
                  stat.crown && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Crown,
                    {
                      className: "w-3.5 h-3.5 shrink-0",
                      style: { color: "oklch(0.75 0.25 60)" }
                    }
                  ),
                  stat.value
                ]
              }
            )
          ]
        },
        stat.label
      ))
    }
  );
}
const FILTER_CHIPS = [
  { id: "all", label: "All Tables" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
  { id: "easy", label: "Easy / Medium" },
  { id: "hard", label: "Hard / Extreme" },
  { id: "released", label: "Released" },
  { id: "beta", label: "Beta" }
];
const SKELETON_KEYS = [
  "sk1",
  "sk2",
  "sk3",
  "sk4",
  "sk5",
  "sk6",
  "sk7",
  "sk8"
];
function HomePage() {
  const [search, setSearch] = reactExports.useState("");
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  const { data: tables = [], isLoading: tablesLoading } = useGetTables();
  const { data: economies = [] } = useGetTableEconomies();
  const { data: mysteryTableId } = useGetDailyMysteryTable();
  const economyMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const e of economies) map.set(e.tableId, e);
    return map;
  }, [economies]);
  const mysteryTable = reactExports.useMemo(
    () => mysteryTableId ? tables.find((t) => t.id === mysteryTableId) : null,
    [tables, mysteryTableId]
  );
  const totalJackpot = reactExports.useMemo(
    () => economies.reduce((sum, e) => sum + e.icfcTreasury, BigInt(0)),
    [economies]
  );
  const filtered = reactExports.useMemo(() => {
    let result = [...tables];
    const genesis = result.find((t) => t.name === "Neon Nights");
    if (genesis) {
      result = [genesis, ...result.filter((t) => t.id !== genesis.id)];
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
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
        (t) => t.status === "Released"
      );
    } else if (activeFilter === "beta") {
      result = result.filter(
        (t) => t.status !== "Released"
      );
    }
    return result;
  }, [tables, search, activeFilter, economyMap]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        "data-ocid": "hero.section",
        className: "relative overflow-hidden bg-background py-16 md:py-24",
        style: {
          backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.7 0.25 280 / 0.12) 0%, transparent 70%)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "pointer-events-none absolute inset-0 opacity-[0.04]",
              style: {
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(0.985 0 0) 3px, oklch(0.985 0 0) 4px)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "pointer-events-none absolute bottom-0 left-0 right-0 h-40 opacity-20",
              style: {
                backgroundImage: "linear-gradient(oklch(0.65 0.28 180 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.28 180 / 0.4) 1px, transparent 1px)",
                backgroundSize: "48px 32px",
                maskImage: "linear-gradient(to top, black 0%, transparent 100%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 flex flex-col md:flex-row items-center gap-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center md:items-start gap-6 text-center md:text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-accent animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-accent tracking-widest uppercase", children: "Live on Internet Computer" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h1",
                {
                  className: "font-display text-5xl md:text-7xl font-bold leading-none tracking-tight",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.7 0.25 280) 0%, oklch(0.65 0.28 180) 60%, oklch(0.7 0.25 280) 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 20px oklch(0.7 0.25 280 / 0.5))"
                  },
                  children: "PinballHEIR"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: "100% On-Chain." }),
                " ",
                "Fully DAO-Governed.",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "neon-text-accent font-semibold", children: "Play Now." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/play/$tableId", params: { tableId: "neon-nights" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "hero.play_button",
                    size: "lg",
                    className: "arcade-glow font-display font-bold tracking-wider px-8",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 mr-2" }),
                      " PLAY FOR FREE"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/constructor", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "hero.create_button",
                    size: "lg",
                    variant: "outline",
                    className: "font-display font-semibold tracking-wider border-primary/40 hover:border-primary/70 px-8",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5 mr-2" }),
                      " CREATE TABLE"
                    ]
                  }
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-[160px] md:w-[220px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArcadeCabinetSVG, {}) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "container mx-auto px-4 py-6",
        "data-ocid": "stats.section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatsBar,
          {
            tableCount: tables.length,
            totalJackpot,
            mysteryTableName: (mysteryTable == null ? void 0 : mysteryTable.name) ?? null,
            isLoading: tablesLoading
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        "data-ocid": "tables.section",
        className: "flex-1 container mx-auto px-4 pb-16",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "tables.search_input",
                  placeholder: "Search tables…",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "pl-9 bg-card border-border font-mono text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 text-muted-foreground shrink-0 mr-1" }),
              FILTER_CHIPS.map((chip) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `tables.filter.${chip.id}`,
                  onClick: () => setActiveFilter(chip.id),
                  className: `arcade-tab text-xs px-3 py-1.5 ${activeFilter === chip.id ? "arcade-tab-active" : ""}`,
                  children: chip.label
                },
                chip.id
              ))
            ] })
          ] }),
          tablesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCardSkeleton, {}, k)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "tables.empty_state",
              className: "arcade-card flex flex-col items-center gap-6 py-20 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed border-primary/30",
                    style: { background: "oklch(var(--primary) / 0.05)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-8 h-8 text-primary/50" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold text-foreground", children: "No tables yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs", children: search || activeFilter !== "all" ? "No tables match your filters. Try adjusting your search." : "Be the first to create one and earn ICFC from every play." })
                ] }),
                !search && activeFilter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/constructor", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "tables.create_first_button",
                    className: "arcade-glow font-display font-semibold",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5" }),
                      " Create a Table"
                    ]
                  }
                ) }),
                (search || activeFilter !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "tables.clear_filters_button",
                    variant: "outline",
                    className: "border-border",
                    onClick: () => {
                      setSearch("");
                      setActiveFilter("all");
                    },
                    children: "Clear Filters"
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: filtered.map((table, i) => {
            const isGenesis = table.name === "Neon Nights";
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableCard,
              {
                table,
                economy: economyMap.get(table.id),
                isMystery: table.id === mysteryTableId,
                isGenesis,
                index: i + 1
              },
              table.id
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        "data-ocid": "governance.cta_section",
        className: "border-t border-border py-8 bg-card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 text-center sm:text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-lg", children: "Shape the Platform" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Hold ICFC → vote on proposals → own the future of pinball." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/governance", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "governance.cta_button",
                variant: "outline",
                className: "font-display font-semibold border-accent/40 hover:border-accent/70 text-accent",
                children: "View Governance"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/marketplace", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "marketplace.cta_button",
                variant: "outline",
                className: "font-display font-semibold border-primary/40 hover:border-primary/70 text-primary",
                children: "Marketplace"
              }
            ) })
          ] })
        ] })
      }
    )
  ] });
}
export {
  HomePage as default
};
