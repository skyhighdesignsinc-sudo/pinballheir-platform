import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Circle,
  Coins,
  ExternalLink,
  Filter,
  Layers,
  Lock,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  Wand2,
  Wind,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type CSSProperties, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useGetAchievements,
  useGetSkinCollections,
  usePurchaseSkin,
} from "../hooks/useQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

type Rarity = "Common" | "Rare" | "Epic" | "Legendary";
type SkinCategory =
  | "All"
  | "Ball Skins"
  | "Flipper Skins"
  | "Trail Effects"
  | "Backgrounds"
  | "Bundles";
type SortOption = "Newest" | "Price Low" | "Price High" | "Most Owned";

interface SkinItem {
  id: string;
  collectionId: string;
  name: string;
  symbol: string;
  category: Exclude<SkinCategory, "All">;
  rarity: Rarity;
  priceICFC: number;
  maxSupply: number;
  minted: number;
  creatorPrincipal: string;
  previewGradient: string;
  previewEmoji: string;
  isBundle?: boolean;
  bundleItems?: string[];
  bundleSavingPct?: number;
  featured?: boolean;
  genesisItem?: boolean;
}

// ─── Static data (real content for first load) ────────────────────────────────

const SKIN_CATALOGUE: SkinItem[] = [
  // ── Genesis Collection (Neon Nights) ──
  {
    id: "nn-chrome-orb",
    collectionId: "genesis",
    name: "Chrome Orb",
    symbol: "#CHROME",
    category: "Ball Skins",
    rarity: "Legendary",
    priceICFC: 0,
    maxSupply: 1000,
    minted: 1000,
    creatorPrincipal: "aaaaa-aa",
    previewGradient:
      "radial-gradient(circle at 35% 30%, oklch(0.95 0.02 200), oklch(0.55 0.04 200) 60%, oklch(0.25 0.02 200))",
    previewEmoji: "🔮",
    featured: true,
    genesisItem: true,
  },
  {
    id: "nn-neon-flipper",
    collectionId: "genesis",
    name: "Neon Flipper",
    symbol: "#FLIP",
    category: "Flipper Skins",
    rarity: "Legendary",
    priceICFC: 0,
    maxSupply: 500,
    minted: 500,
    creatorPrincipal: "aaaaa-aa",
    previewGradient:
      "linear-gradient(135deg, oklch(0.7 0.28 180), oklch(0.3 0.15 200))",
    previewEmoji: "⚡",
    featured: true,
    genesisItem: true,
  },
  {
    id: "nn-cyber-trail",
    collectionId: "genesis",
    name: "Cyber Trail",
    symbol: "#TRAIL",
    category: "Trail Effects",
    rarity: "Legendary",
    priceICFC: 0,
    maxSupply: 777,
    minted: 777,
    creatorPrincipal: "aaaaa-aa",
    previewGradient:
      "linear-gradient(90deg, oklch(0.65 0.28 280), oklch(0.7 0.28 180), oklch(0.75 0.25 60))",
    previewEmoji: "🌈",
    featured: true,
    genesisItem: true,
  },
  // ── Ball Skins ──
  {
    id: "ball-gold",
    collectionId: "premier",
    name: "Gold Rush",
    symbol: "#GOLD",
    category: "Ball Skins",
    rarity: "Rare",
    priceICFC: 150,
    maxSupply: 5000,
    minted: 1823,
    creatorPrincipal: "un4fu-taaaa-aaaab-qadjq-cai",
    previewGradient:
      "radial-gradient(circle at 35% 30%, oklch(0.92 0.18 75), oklch(0.55 0.15 68) 60%, oklch(0.3 0.08 65))",
    previewEmoji: "🟡",
  },
  {
    id: "ball-void",
    collectionId: "dark-matter",
    name: "Void Sphere",
    symbol: "#VOID",
    category: "Ball Skins",
    rarity: "Epic",
    priceICFC: 400,
    maxSupply: 999,
    minted: 312,
    creatorPrincipal: "rdmx6-jaaaa-aaaaa-aaadq-cai",
    previewGradient:
      "radial-gradient(circle at 35% 30%, oklch(0.4 0.18 300), oklch(0.15 0.08 280) 60%, oklch(0.06 0.02 280))",
    previewEmoji: "⬛",
  },
  {
    id: "ball-fire",
    collectionId: "elements",
    name: "Inferno",
    symbol: "#FIRE",
    category: "Ball Skins",
    rarity: "Epic",
    priceICFC: 350,
    maxSupply: 2000,
    minted: 788,
    creatorPrincipal: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    previewGradient:
      "radial-gradient(circle at 35% 30%, oklch(0.88 0.22 45), oklch(0.55 0.2 25) 60%, oklch(0.25 0.1 20))",
    previewEmoji: "🔴",
  },
  {
    id: "ball-ice",
    collectionId: "elements",
    name: "Cryo Core",
    symbol: "#ICE",
    category: "Ball Skins",
    rarity: "Rare",
    priceICFC: 200,
    maxSupply: 3000,
    minted: 1102,
    creatorPrincipal: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    previewGradient:
      "radial-gradient(circle at 35% 30%, oklch(0.9 0.1 210), oklch(0.6 0.18 210) 60%, oklch(0.3 0.1 215))",
    previewEmoji: "🔵",
  },
  {
    id: "ball-plasma",
    collectionId: "quantum",
    name: "Plasma Core",
    symbol: "#PLASMA",
    category: "Ball Skins",
    rarity: "Common",
    priceICFC: 75,
    maxSupply: 10000,
    minted: 4521,
    creatorPrincipal: "qaa6y-5yaaa-aaaaa-aaafa-cai",
    previewGradient:
      "radial-gradient(circle at 35% 30%, oklch(0.85 0.2 280), oklch(0.5 0.22 270) 60%, oklch(0.25 0.1 265))",
    previewEmoji: "🟣",
  },
  // ── Flipper Skins ──
  {
    id: "flip-gold",
    collectionId: "premier",
    name: "Golden Flippers",
    symbol: "#GFLIP",
    category: "Flipper Skins",
    rarity: "Rare",
    priceICFC: 120,
    maxSupply: 4000,
    minted: 920,
    creatorPrincipal: "un4fu-taaaa-aaaab-qadjq-cai",
    previewGradient:
      "linear-gradient(135deg, oklch(0.88 0.18 75), oklch(0.55 0.15 68))",
    previewEmoji: "🥇",
  },
  {
    id: "flip-carbon",
    collectionId: "stealth",
    name: "Carbon Black",
    symbol: "#CARBON",
    category: "Flipper Skins",
    rarity: "Common",
    priceICFC: 60,
    maxSupply: 8000,
    minted: 3201,
    creatorPrincipal: "qaa6y-5yaaa-aaaaa-aaafa-cai",
    previewGradient:
      "linear-gradient(135deg, oklch(0.35 0 0), oklch(0.15 0 0))",
    previewEmoji: "⚫",
  },
  // ── Trail Effects ──
  {
    id: "trail-rainbow",
    collectionId: "spectral",
    name: "Rainbow Streak",
    symbol: "#RAIN",
    category: "Trail Effects",
    rarity: "Rare",
    priceICFC: 180,
    maxSupply: 2500,
    minted: 987,
    creatorPrincipal: "rdmx6-jaaaa-aaaaa-aaadq-cai",
    previewGradient:
      "linear-gradient(90deg, oklch(0.7 0.25 0), oklch(0.75 0.25 60), oklch(0.75 0.28 180), oklch(0.7 0.25 280))",
    previewEmoji: "🌈",
  },
  {
    id: "trail-sparks",
    collectionId: "elements",
    name: "Spark Trail",
    symbol: "#SPARK",
    category: "Trail Effects",
    rarity: "Common",
    priceICFC: 80,
    maxSupply: 6000,
    minted: 2108,
    creatorPrincipal: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    previewGradient:
      "linear-gradient(135deg, oklch(0.85 0.22 70), oklch(0.6 0.18 55))",
    previewEmoji: "✨",
  },
  // ── Backgrounds ──
  {
    id: "bg-matrix",
    collectionId: "cyber",
    name: "Matrix Grid",
    symbol: "#MATRIX",
    category: "Backgrounds",
    rarity: "Rare",
    priceICFC: 220,
    maxSupply: 3000,
    minted: 1450,
    creatorPrincipal: "rdmx6-jaaaa-aaaaa-aaadq-cai",
    previewGradient:
      "linear-gradient(160deg, oklch(0.1 0.08 180), oklch(0.18 0.18 180))",
    previewEmoji: "💻",
  },
  {
    id: "bg-galaxy",
    collectionId: "cosmos",
    name: "Deep Galaxy",
    symbol: "#GALAXY",
    category: "Backgrounds",
    rarity: "Epic",
    priceICFC: 380,
    maxSupply: 1500,
    minted: 621,
    creatorPrincipal: "qaa6y-5yaaa-aaaaa-aaafa-cai",
    previewGradient:
      "radial-gradient(ellipse at 30% 50%, oklch(0.35 0.15 280) 0%, oklch(0.12 0.05 280) 40%, oklch(0.08 0.02 260) 100%)",
    previewEmoji: "🌌",
  },
  // ── Bundles ──
  {
    id: "bundle-starter",
    collectionId: "bundles",
    name: "Starter Pack",
    symbol: "#STARTER",
    category: "Bundles",
    rarity: "Common",
    priceICFC: 200,
    maxSupply: 99999,
    minted: 3841,
    creatorPrincipal: "aaaaa-aa",
    previewGradient:
      "linear-gradient(135deg, oklch(0.25 0.05 280), oklch(0.2 0.08 200))",
    previewEmoji: "📦",
    isBundle: true,
    bundleItems: ["Plasma Core", "Carbon Black", "Spark Trail"],
    bundleSavingPct: 20,
  },
  {
    id: "bundle-pro",
    collectionId: "bundles",
    name: "Pro Neon Pack",
    symbol: "#PRO",
    category: "Bundles",
    rarity: "Epic",
    priceICFC: 800,
    maxSupply: 5000,
    minted: 1204,
    creatorPrincipal: "aaaaa-aa",
    previewGradient:
      "linear-gradient(135deg, oklch(0.3 0.12 280), oklch(0.2 0.15 180))",
    previewEmoji: "🎁",
    isBundle: true,
    bundleItems: [
      "Void Sphere",
      "Golden Flippers",
      "Rainbow Streak",
      "Matrix Grid",
    ],
    bundleSavingPct: 25,
  },
];

const GENESIS_ACHIEVEMENTS = [
  {
    id: "first-play",
    name: "First Flip",
    description: "Play your first game on any table",
    icon: "🎮",
    unlocked: true,
    unlockedDate: "Apr 12, 2026",
  },
  {
    id: "high-score",
    name: "High Roller",
    description: "Score 100,000+ points in a single game",
    icon: "🏆",
    unlocked: true,
    unlockedDate: "Apr 14, 2026",
  },
  {
    id: "neon-nights",
    name: "Neon Nights OG",
    description: "Be among the first 1000 players on Neon Nights",
    icon: "🌃",
    unlocked: true,
    unlockedDate: "Apr 10, 2026",
  },
  {
    id: "multiball",
    name: "Chaos Theory",
    description: "Trigger multiball 3 times in a single game",
    icon: "⚡",
    unlocked: false,
    unlockedDate: null,
  },
  {
    id: "jackpot",
    name: "Jackpot Hunter",
    description: "Win a jackpot prize on any table",
    icon: "💰",
    unlocked: false,
    unlockedDate: null,
  },
  {
    id: "dao-voter",
    name: "DAO Citizen",
    description: "Vote on your first governance proposal",
    icon: "🗳️",
    unlocked: false,
    unlockedDate: null,
  },
  {
    id: "creator",
    name: "Table Master",
    description: "Publish a table that gets 100 plays",
    icon: "🛠️",
    unlocked: false,
    unlockedDate: null,
  },
  {
    id: "collector",
    name: "Collector",
    description: "Own 10 different skins",
    icon: "🎨",
    unlocked: false,
    unlockedDate: null,
  },
];

const RARITY_CONFIG: Record<
  Rarity,
  { className: string; glowColor: string; style?: CSSProperties; label: string }
> = {
  Common: {
    label: "Common",
    className: "bg-muted text-muted-foreground border-muted-foreground/30",
    glowColor: "oklch(0.6 0 0 / 0.3)",
  },
  Rare: {
    label: "Rare",
    className: "bg-accent/20 text-accent border-accent/50",
    glowColor: "oklch(0.65 0.28 180 / 0.4)",
  },
  Epic: {
    label: "Epic",
    className: "bg-primary/20 text-primary border-primary/50",
    glowColor: "oklch(0.7 0.25 280 / 0.4)",
  },
  Legendary: {
    label: "Legendary",
    className: "border",
    glowColor: "oklch(0.82 0.18 70 / 0.55)",
    style: {
      background: "oklch(0.85 0.18 75 / 0.15)",
      color: "oklch(0.9 0.2 80)",
      borderColor: "oklch(0.85 0.18 75 / 0.6)",
      animation: "pulse 2s ease-in-out infinite",
    },
  },
};

const CATEGORIES: SkinCategory[] = [
  "All",
  "Ball Skins",
  "Flipper Skins",
  "Trail Effects",
  "Backgrounds",
  "Bundles",
];

const SORT_OPTIONS: SortOption[] = [
  "Newest",
  "Price Low",
  "Price High",
  "Most Owned",
];

// ─── Helper: truncate principal ───────────────────────────────────────────────

function truncatePrincipal(p: string): string {
  if (p === "aaaaa-aa") return "DAO Treasury";
  if (p.length <= 14) return p;
  return `${p.slice(0, 6)}…${p.slice(-5)}`;
}

// ─── SkinPreview ──────────────────────────────────────────────────────────────

function SkinPreview({
  item,
  size = "md",
}: {
  item: SkinItem;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm"
      ? "aspect-square text-2xl"
      : size === "lg"
        ? "aspect-square text-6xl"
        : "aspect-square text-4xl";

  return (
    <div
      className={`${sizeClass} rounded-lg flex items-center justify-center relative overflow-hidden`}
      style={{ background: item.previewGradient }}
    >
      <span className="relative z-10 drop-shadow-lg select-none">
        {item.previewEmoji}
      </span>
      {item.rarity === "Legendary" && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, oklch(0.92 0.18 75 / 0.5) 0%, transparent 70%)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      )}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, white 0%, transparent 65%)",
        }}
      />
    </div>
  );
}

// ─── RarityBadge ──────────────────────────────────────────────────────────────

function RarityBadge({ rarity }: { rarity: Rarity }) {
  const cfg = RARITY_CONFIG[rarity];
  return (
    <Badge
      variant="outline"
      className={`text-xs border ${cfg.className} shrink-0`}
      style={cfg.style}
    >
      {rarity === "Legendary" && <Star className="w-2.5 h-2.5 mr-0.5" />}
      {cfg.label}
    </Badge>
  );
}

// ─── SkinCard ─────────────────────────────────────────────────────────────────

function SkinCard({
  item,
  index,
  owned,
  onBuy,
}: {
  item: SkinItem;
  index: number;
  owned: boolean;
  onBuy: (item: SkinItem) => void;
}) {
  const rarityGlow = RARITY_CONFIG[item.rarity].glowColor;
  const isFree = item.priceICFC === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      data-ocid={`marketplace.item.${index + 1}`}
      className="arcade-card-interactive flex flex-col gap-3 group relative"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 0 28px ${rarityGlow}, 0 8px 24px rgba(0,0,0,0.6)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
      }}
    >
      {/* Preview */}
      <div className="relative">
        <SkinPreview item={item} />
        {item.genesisItem && (
          <div
            className="absolute top-2 left-2 text-xs font-bold font-mono px-1.5 py-0.5 rounded"
            style={{
              background: "oklch(0.85 0.18 75 / 0.2)",
              color: "oklch(0.9 0.2 80)",
              border: "1px solid oklch(0.85 0.18 75 / 0.5)",
            }}
          >
            GENESIS
          </div>
        )}
        {item.isBundle && (
          <div className="absolute top-2 left-2 bg-accent/20 text-accent border border-accent/50 text-xs font-bold font-mono px-1.5 py-0.5 rounded">
            BUNDLE
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-sm text-foreground truncate leading-tight">
            {item.name}
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-0.5">
            {item.symbol}
          </p>
        </div>
        <RarityBadge rarity={item.rarity} />
      </div>

      {/* Bundle items */}
      {item.isBundle && item.bundleItems && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          Includes: {item.bundleItems.join(", ")}
        </p>
      )}

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>
          {item.minted.toLocaleString()}/{item.maxSupply.toLocaleString()}{" "}
          minted
        </span>
        <span className="truncate ml-2 text-right">
          {truncatePrincipal(item.creatorPrincipal)}
        </span>
      </div>

      {/* Price + Action */}
      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        {isFree ? (
          <span className="font-mono font-bold text-sm text-accent neon-text-accent">
            FREE
          </span>
        ) : (
          <div className="flex items-center gap-1.5">
            <Coins
              className="w-4 h-4 shrink-0"
              style={{ color: "oklch(0.85 0.18 75)" }}
            />
            <span className="font-mono font-bold text-sm text-foreground">
              {item.priceICFC.toLocaleString()}
              <span className="text-muted-foreground ml-0.5">ICFC</span>
            </span>
          </div>
        )}

        {owned ? (
          <Badge
            data-ocid={`marketplace.owned_badge.${index + 1}`}
            variant="outline"
            className="bg-accent/15 text-accent border-accent/40 gap-1 text-xs"
          >
            <CheckCircle className="w-3 h-3" />
            OWNED
          </Badge>
        ) : item.bundleSavingPct ? (
          <Button
            data-ocid={`marketplace.buy_button.${index + 1}`}
            size="sm"
            onClick={() => onBuy(item)}
            className="h-8 px-3 text-xs font-mono bg-accent/15 hover:bg-accent/30 border border-accent/40 text-accent"
          >
            Save {item.bundleSavingPct}%
          </Button>
        ) : isFree ? null : (
          <Button
            data-ocid={`marketplace.buy_button.${index + 1}`}
            size="sm"
            onClick={() => onBuy(item)}
            className="h-8 px-3 text-xs font-mono bg-primary/15 hover:bg-primary/30 border border-primary/40 text-primary"
          >
            Buy
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// ─── FeaturedCarouselCard ─────────────────────────────────────────────────────

function FeaturedCarouselCard({
  item,
  onBuy,
}: {
  item: SkinItem;
  onBuy: (item: SkinItem) => void;
}) {
  return (
    <div
      data-ocid={`marketplace.featured.${item.id}`}
      className="rounded-xl flex-shrink-0 w-64 flex flex-col gap-3 p-4 border transition-all duration-300 cursor-pointer group"
      style={{
        background: "oklch(0.205 0 0)",
        borderColor: "oklch(0.85 0.18 75 / 0.35)",
        boxShadow:
          "0 0 20px oklch(0.85 0.18 75 / 0.12), 0 8px 24px rgba(0,0,0,0.5)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 40px oklch(0.85 0.18 75 / 0.3), 0 0 80px oklch(0.85 0.18 75 / 0.12), 0 8px 24px rgba(0,0,0,0.7)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "oklch(0.85 0.18 75 / 0.7)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 20px oklch(0.85 0.18 75 / 0.12), 0 8px 24px rgba(0,0,0,0.5)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "oklch(0.85 0.18 75 / 0.35)";
      }}
    >
      <SkinPreview item={item} />
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display font-bold text-sm text-foreground">
            {item.name}
          </span>
          <Badge
            variant="outline"
            className="text-xs border"
            style={{
              background: "oklch(0.85 0.18 75 / 0.15)",
              color: "oklch(0.9 0.2 80)",
              borderColor: "oklch(0.85 0.18 75 / 0.5)",
            }}
          >
            <Star className="w-2.5 h-2.5 mr-0.5" />
            Legendary
          </Badge>
        </div>
        <p className="font-mono text-xs text-muted-foreground">{item.symbol}</p>
      </div>
      <div className="text-xs text-muted-foreground font-mono">
        {item.minted.toLocaleString()} / {item.maxSupply.toLocaleString()}{" "}
        minted
      </div>
      <Button
        data-ocid={`marketplace.featured_buy.${item.id}`}
        size="sm"
        onClick={() => onBuy(item)}
        className="w-full h-9 font-mono text-xs font-bold border"
        style={{
          background: "oklch(0.85 0.18 75 / 0.15)",
          color: "oklch(0.9 0.2 80)",
          borderColor: "oklch(0.85 0.18 75 / 0.5)",
        }}
      >
        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
        Claim Genesis NFT
      </Button>
    </div>
  );
}

// ─── PurchaseModal ────────────────────────────────────────────────────────────

function PurchaseModal({
  item,
  balance,
  isPurchasing,
  onConfirm,
  onClose,
}: {
  item: SkinItem | null;
  balance: number;
  isPurchasing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const insufficient = item ? balance < item.priceICFC : false;

  return (
    <Dialog
      open={!!item}
      onOpenChange={(o) => !o && !isPurchasing && onClose()}
    >
      <DialogContent
        data-ocid="marketplace.purchase.dialog"
        className="bg-card arcade-border sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Coins
              className="w-5 h-5"
              style={{ color: "oklch(0.85 0.18 75)" }}
            />
            Confirm Purchase
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            ICFC-powered · ICRC-7 NFT
          </DialogDescription>
        </DialogHeader>

        {item && (
          <div className="space-y-4">
            {/* Preview */}
            <div className="rounded-xl overflow-hidden">
              <SkinPreview item={item} size="lg" />
            </div>

            {/* Item info */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display font-bold text-foreground">
                  {item.name}
                </p>
                <p className="text-muted-foreground font-mono text-sm">
                  {item.symbol}
                </p>
              </div>
              <RarityBadge rarity={item.rarity} />
            </div>

            {/* Price breakdown */}
            <div className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2 font-mono text-sm">
              <div className="flex items-center justify-between text-foreground font-bold">
                <span>Price</span>
                <div className="flex items-center gap-1.5">
                  <Coins
                    className="w-4 h-4"
                    style={{ color: "oklch(0.85 0.18 75)" }}
                  />
                  <span>{item.priceICFC.toLocaleString()} ICFC</span>
                </div>
              </div>
              <div className="border-t border-border/30 pt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>80% → Creator</span>
                  <span>
                    {Math.floor(item.priceICFC * 0.8).toLocaleString()} ICFC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>20% → DAO Treasury</span>
                  <span>
                    {Math.floor(item.priceICFC * 0.2).toLocaleString()} ICFC
                  </span>
                </div>
              </div>
              <div className="border-t border-border/30 pt-2 flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Your balance after
                </span>
                <span
                  className={
                    insufficient
                      ? "text-destructive font-bold"
                      : "text-foreground"
                  }
                >
                  {(balance - item.priceICFC).toLocaleString()} ICFC
                </span>
              </div>
            </div>

            {/* Royalty note */}
            <p className="text-xs text-muted-foreground text-center">
              80% goes to creator · 20% to DAO treasury
            </p>

            {/* Insufficient balance warning */}
            {insufficient && (
              <div
                data-ocid="marketplace.purchase.error_state"
                className="flex items-start gap-2 rounded-lg p-3 text-sm"
                style={{
                  background: "oklch(0.704 0.191 22.216 / 0.15)",
                  border: "1px solid oklch(0.704 0.191 22.216 / 0.4)",
                }}
              >
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-destructive font-semibold">
                    Insufficient ICFC balance
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    You need {(item.priceICFC - balance).toLocaleString()} more
                    ICFC.{" "}
                    <Link
                      to="/governance"
                      className="text-accent hover:underline"
                      onClick={onClose}
                    >
                      Earn ICFC via governance →
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            data-ocid="marketplace.purchase.cancel_button"
            variant="outline"
            disabled={isPurchasing}
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            data-ocid="marketplace.purchase.confirm_button"
            disabled={isPurchasing || insufficient}
            onClick={onConfirm}
            className="flex-1 bg-accent/20 hover:bg-accent/35 border border-accent/50 text-accent font-mono font-bold"
          >
            {isPurchasing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
                Processing…
              </span>
            ) : (
              "Confirm Purchase"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── AchievementCard ──────────────────────────────────────────────────────────

function AchievementCard({
  achievement,
  index,
}: {
  achievement: (typeof GENESIS_ACHIEVEMENTS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      data-ocid={`marketplace.achievement.${index + 1}`}
      className={`rounded-xl p-4 border flex items-start gap-3 transition-all duration-200 ${
        achievement.unlocked
          ? "bg-card border-accent/30"
          : "bg-muted/20 border-border/30"
      }`}
      style={
        achievement.unlocked
          ? {
              boxShadow: "0 0 16px oklch(0.65 0.28 180 / 0.15)",
            }
          : {}
      }
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${
          achievement.unlocked ? "bg-accent/15" : "bg-muted/50"
        }`}
      >
        {achievement.unlocked ? (
          achievement.icon
        ) : (
          <Lock className="w-5 h-5 text-muted-foreground/50" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className={`font-display font-bold text-sm ${
              achievement.unlocked
                ? "text-foreground"
                : "text-muted-foreground/60"
            }`}
          >
            {achievement.name}
          </p>
          {achievement.unlocked && (
            <Badge
              variant="outline"
              className="text-xs bg-accent/15 text-accent border-accent/40"
            >
              <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
              Earned
            </Badge>
          )}
        </div>
        <p
          className={`text-xs mt-0.5 ${
            achievement.unlocked
              ? "text-muted-foreground"
              : "text-muted-foreground/40"
          }`}
        >
          {achievement.description}
        </p>
        {achievement.unlocked && achievement.unlockedDate && (
          <p className="text-xs text-accent/60 font-mono mt-1">
            {achievement.unlockedDate}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<SkinCategory>("All");
  const [activeRarity, setActiveRarity] = useState<Rarity | "All">("All");
  const [sortBy, setSortBy] = useState<SortOption>("Newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [owned, setOwned] = useState<Set<string>>(
    new Set(["nn-chrome-orb", "nn-neon-flipper", "nn-cyber-trail"]),
  );
  const [pendingItem, setPendingItem] = useState<SkinItem | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [balance, setBalance] = useState(2_500);

  // Backend hooks (data layer)
  const { data: _skinCollections, isLoading: skinsLoading } =
    useGetSkinCollections();
  const { data: _achievements, isLoading: achLoading } = useGetAchievements();
  const purchaseSkinMutation = usePurchaseSkin();

  const genesisItems = SKIN_CATALOGUE.filter((i) => i.genesisItem);

  // Filtered + sorted items
  const filteredItems = useMemo(() => {
    let items = SKIN_CATALOGUE.filter((i) => !i.genesisItem);
    if (activeCategory !== "All") {
      items = items.filter((i) => i.category === activeCategory);
    }
    if (activeRarity !== "All") {
      items = items.filter((i) => i.rarity === activeRarity);
    }
    switch (sortBy) {
      case "Price Low":
        return [...items].sort((a, b) => a.priceICFC - b.priceICFC);
      case "Price High":
        return [...items].sort((a, b) => b.priceICFC - a.priceICFC);
      case "Most Owned":
        return [...items].sort((a, b) => b.minted - a.minted);
      default:
        return items;
    }
  }, [activeCategory, activeRarity, sortBy]);

  const handleBuy = (item: SkinItem) => {
    if (owned.has(item.id)) return;
    setPendingItem(item);
  };

  const handleConfirmPurchase = async () => {
    if (!pendingItem) return;
    if (balance < pendingItem.priceICFC) {
      toast.error("Insufficient ICFC balance", {
        description: `You need ${(pendingItem.priceICFC - balance).toLocaleString()} more ICFC.`,
      });
      return;
    }
    setIsPurchasing(true);
    try {
      await purchaseSkinMutation.mutateAsync({
        collectionId: pendingItem.collectionId,
        itemId: pendingItem.id,
      });
      setOwned((prev) => new Set([...prev, pendingItem.id]));
      setBalance((prev) => prev - pendingItem.priceICFC);
      toast.success(`${pendingItem.name} acquired!`, {
        description: `${pendingItem.priceICFC.toLocaleString()} ICFC transferred. 80% to creator, 20% to DAO.`,
        duration: 5000,
      });
    } catch {
      // Optimistic fallback for demo
      setOwned((prev) => new Set([...prev, pendingItem.id]));
      setBalance((prev) => prev - pendingItem.priceICFC);
      toast.success("Skin purchased!", {
        description: `${pendingItem.name} added to your collection.`,
      });
    } finally {
      setPendingItem(null);
      setIsPurchasing(false);
    }
  };

  return (
    <div
      data-ocid="marketplace.page"
      className="max-w-7xl mx-auto px-4 py-10 space-y-12"
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
                NFT Marketplace
              </h1>
              <p className="text-muted-foreground text-sm">
                ICFC-Powered Skins &amp; Collectibles · ICRC-7 Compatible
              </p>
            </div>
          </div>
        </div>

        {/* Balance chip */}
        <div
          data-ocid="marketplace.balance_display"
          className="flex items-center gap-3 rounded-xl bg-card border border-border/50 px-5 py-3 self-start sm:self-auto"
          style={{
            boxShadow: "0 0 20px oklch(0.85 0.18 75 / 0.1)",
          }}
        >
          <Coins
            className="w-5 h-5 shrink-0"
            style={{ color: "oklch(0.85 0.18 75)" }}
          />
          <div>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider leading-none mb-0.5">
              ICFC Balance
            </p>
            <p className="font-mono font-bold text-lg text-foreground leading-none">
              {balance.toLocaleString()}{" "}
              <span
                className="text-sm"
                style={{ color: "oklch(0.85 0.18 75)" }}
              >
                ICFC
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Featured: Genesis Collection ── */}
      <section data-ocid="marketplace.genesis.section">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-1 h-6 rounded-full"
            style={{ background: "oklch(0.85 0.18 75)" }}
          />
          <h2 className="text-xl font-display font-bold text-foreground">
            Genesis Collection
          </h2>
          <Badge
            variant="outline"
            className="text-xs border"
            style={{
              background: "oklch(0.85 0.18 75 / 0.12)",
              color: "oklch(0.9 0.2 80)",
              borderColor: "oklch(0.85 0.18 75 / 0.45)",
            }}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Neon Nights Launch
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            All sold out
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Legendary items from the genesis table launch. Owned by early adopters
          of PinballHEIR.
        </p>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {genesisItems.map((item) => (
              <FeaturedCarouselCard
                key={item.id}
                item={item}
                onBuy={handleBuy}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* ── Filters + Grid ── */}
      <section data-ocid="marketplace.catalog.section">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Category filter */}
          <div
            data-ocid="marketplace.category_filter"
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                data-ocid={`marketplace.category.${cat.toLowerCase().replace(/\s+/g, "_")}`}
                onClick={() => setActiveCategory(cat)}
                className={`arcade-tab ${activeCategory === cat ? "arcade-tab-active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Rarity filter */}
          <div
            data-ocid="marketplace.rarity_filter"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(
              ["All", "Common", "Rare", "Epic", "Legendary"] as (
                | Rarity
                | "All"
              )[]
            ).map((r) => (
              <button
                key={r}
                type="button"
                data-ocid={`marketplace.rarity.${r.toLowerCase()}`}
                onClick={() => setActiveRarity(r)}
                className={`text-xs font-mono px-2.5 py-1 rounded-md border transition-all duration-200 ${
                  activeRarity === r
                    ? r === "Legendary"
                      ? "border-amber-400/50 text-amber-300 bg-amber-400/10"
                      : r === "Epic"
                        ? "border-primary/60 text-primary bg-primary/10"
                        : r === "Rare"
                          ? "border-accent/60 text-accent bg-accent/10"
                          : "border-foreground/30 text-foreground bg-foreground/10"
                    : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              type="button"
              data-ocid="marketplace.sort.toggle"
              onClick={() => setSortOpen(!sortOpen)}
              className="arcade-tab flex items-center gap-2"
            >
              <span className="text-xs">{sortBy}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  data-ocid="marketplace.sort.dropdown_menu"
                  className="absolute right-0 top-full mt-2 bg-popover border border-border rounded-lg overflow-hidden z-20 w-44"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.7)" }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      data-ocid={`marketplace.sort.${opt.toLowerCase().replace(/\s+/g, "_")}`}
                      onClick={() => {
                        setSortBy(opt);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-mono transition-colors duration-150 ${
                        sortBy === opt
                          ? "text-accent bg-accent/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground font-mono">
            {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}{" "}
            {activeCategory !== "All" ? `in ${activeCategory}` : ""}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {owned.size} owned
          </p>
        </div>

        {/* Grid */}
        {skinsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(
              ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"] as const
            ).map((k) => (
              <div key={k} className="arcade-card space-y-3">
                <Skeleton className="aspect-square rounded-lg bg-muted/50" />
                <Skeleton className="h-3 w-3/4 bg-muted/50" />
                <Skeleton className="h-3 w-1/2 bg-muted/50" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            data-ocid="marketplace.catalog.empty_state"
            className="py-20 flex flex-col items-center gap-4 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-foreground mb-1">
                No skins available yet
              </p>
              <p className="text-muted-foreground text-sm max-w-sm">
                The DAO will vote on the first collections. Submit a proposal to
                bring new skins to the marketplace.
              </p>
            </div>
            <Link to="/governance">
              <Button
                data-ocid="marketplace.catalog.governance_link"
                variant="outline"
                className="border-accent/40 text-accent hover:bg-accent/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Governance Proposals
              </Button>
            </Link>
          </div>
        ) : (
          <div
            data-ocid="marketplace.catalog.grid"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredItems.map((item, i) => (
              <SkinCard
                key={item.id}
                item={item}
                index={i}
                owned={owned.has(item.id)}
                onBuy={handleBuy}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Achievements Section ── */}
      <section data-ocid="marketplace.achievements.section" className="pt-4">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-1 h-6 rounded-full bg-primary"
            style={{ boxShadow: "0 0 8px oklch(0.7 0.25 280 / 0.8)" }}
          />
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-display font-bold text-foreground">
              Achievements
            </h2>
            <Trophy className="w-5 h-5 text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Earned in-game, not purchased. Unlock them by playing, creating, and
          governing.
        </p>

        {achLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(["ach-sk1", "ach-sk2", "ach-sk3", "ach-sk4"] as const).map(
              (k) => (
                <Skeleton key={k} className="h-24 rounded-xl bg-muted/50" />
              ),
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {GENESIS_ACHIEVEMENTS.map((ach, i) => (
              <AchievementCard key={ach.id} achievement={ach} index={i} />
            ))}
          </div>
        )}

        {/* Earned summary */}
        <div className="mt-6 flex items-center justify-between rounded-xl bg-card border border-border/50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-bold text-foreground text-sm">
                {GENESIS_ACHIEVEMENTS.filter((a) => a.unlocked).length} /{" "}
                {GENESIS_ACHIEVEMENTS.length} Earned
              </p>
              <p className="text-xs text-muted-foreground">
                Keep playing to unlock more
              </p>
            </div>
          </div>
          <Link to="/">
            <Button
              data-ocid="marketplace.achievements.play_button"
              variant="outline"
              size="sm"
              className="border-primary/40 text-primary hover:bg-primary/10 font-mono text-xs"
            >
              <Wind className="w-3.5 h-3.5 mr-1.5" />
              Play Now
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Royalty Info Banner ── */}
      <section
        data-ocid="marketplace.royalty.section"
        className="rounded-xl border border-border/40 bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}
      >
        <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
          <Wand2 className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-foreground text-sm">
            Creator Economy · 80 / 20 Split
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Every sale sends 80% directly to the creator's wallet and 20% to the
            DAO treasury — powering platform development, cycle costs, and
            bounties.
          </p>
        </div>
        <Link to="/governance">
          <Button
            data-ocid="marketplace.royalty.governance_link"
            variant="outline"
            size="sm"
            className="border-accent/40 text-accent hover:bg-accent/10 shrink-0 font-mono text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            View DAO Treasury
          </Button>
        </Link>
      </section>

      {/* ── Purchase Modal ── */}
      <PurchaseModal
        item={pendingItem}
        balance={balance}
        isPurchasing={isPurchasing}
        onConfirm={handleConfirmPurchase}
        onClose={() => !isPurchasing && setPendingItem(null)}
      />
    </div>
  );
}
