import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, D as useGetSkinCollections, E as useGetAchievements, F as usePurchaseSkin, S as ShoppingBag, l as Badge, L as Link, B as Button, T as Trophy, Z as Zap, C as ue, G as Dialog, H as DialogContent, J as DialogHeader, K as DialogTitle, M as DialogDescription, N as DialogFooter } from "./index-Buftnbn6.js";
import { S as ScrollArea, a as ScrollBar, E as ExternalLink } from "./scroll-area-Bb84unwZ.js";
import { S as Skeleton } from "./skeleton-BuI67MZe.js";
import { C as Coins } from "./index-qxoNb-CE.js";
import { F as Funnel } from "./funnel-DTlKZGM4.js";
import { C as ChevronDown } from "./chevron-down-BPbH05yw.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-BprsZsqJ.js";
import { S as Star } from "./star-DSlGNHEh.js";
import { C as CircleCheckBig } from "./circle-check-big-DOLFaKUL.js";
import { L as Lock } from "./lock-BpWyUE8Z.js";
import "./index-IXOTxK3N.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
      key: "ul74o6"
    }
  ],
  ["path", { d: "m14 7 3 3", key: "1r5n42" }],
  ["path", { d: "M5 6v4", key: "ilb8ba" }],
  ["path", { d: "M19 14v4", key: "blhpug" }],
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M7 8H3", key: "zfb6yr" }],
  ["path", { d: "M21 16h-4", key: "1cnmox" }],
  ["path", { d: "M11 3H9", key: "1obp7u" }]
];
const WandSparkles = createLucideIcon("wand-sparkles", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12.8 19.6A2 2 0 1 0 14 16H2", key: "148xed" }],
  ["path", { d: "M17.5 8a2.5 2.5 0 1 1 2 4H2", key: "1u4tom" }],
  ["path", { d: "M9.8 4.4A2 2 0 1 1 11 8H2", key: "75valh" }]
];
const Wind = createLucideIcon("wind", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const SKIN_CATALOGUE = [
  // ── Genesis Collection (Neon Nights) ──
  {
    id: "nn-chrome-orb",
    collectionId: "genesis",
    name: "Chrome Orb",
    symbol: "#CHROME",
    category: "Ball Skins",
    rarity: "Legendary",
    priceICFC: 0,
    maxSupply: 1e3,
    minted: 1e3,
    creatorPrincipal: "aaaaa-aa",
    previewGradient: "radial-gradient(circle at 35% 30%, oklch(0.95 0.02 200), oklch(0.55 0.04 200) 60%, oklch(0.25 0.02 200))",
    previewEmoji: "🔮",
    featured: true,
    genesisItem: true
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
    previewGradient: "linear-gradient(135deg, oklch(0.7 0.28 180), oklch(0.3 0.15 200))",
    previewEmoji: "⚡",
    featured: true,
    genesisItem: true
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
    previewGradient: "linear-gradient(90deg, oklch(0.65 0.28 280), oklch(0.7 0.28 180), oklch(0.75 0.25 60))",
    previewEmoji: "🌈",
    featured: true,
    genesisItem: true
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
    maxSupply: 5e3,
    minted: 1823,
    creatorPrincipal: "un4fu-taaaa-aaaab-qadjq-cai",
    previewGradient: "radial-gradient(circle at 35% 30%, oklch(0.92 0.18 75), oklch(0.55 0.15 68) 60%, oklch(0.3 0.08 65))",
    previewEmoji: "🟡"
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
    previewGradient: "radial-gradient(circle at 35% 30%, oklch(0.4 0.18 300), oklch(0.15 0.08 280) 60%, oklch(0.06 0.02 280))",
    previewEmoji: "⬛"
  },
  {
    id: "ball-fire",
    collectionId: "elements",
    name: "Inferno",
    symbol: "#FIRE",
    category: "Ball Skins",
    rarity: "Epic",
    priceICFC: 350,
    maxSupply: 2e3,
    minted: 788,
    creatorPrincipal: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    previewGradient: "radial-gradient(circle at 35% 30%, oklch(0.88 0.22 45), oklch(0.55 0.2 25) 60%, oklch(0.25 0.1 20))",
    previewEmoji: "🔴"
  },
  {
    id: "ball-ice",
    collectionId: "elements",
    name: "Cryo Core",
    symbol: "#ICE",
    category: "Ball Skins",
    rarity: "Rare",
    priceICFC: 200,
    maxSupply: 3e3,
    minted: 1102,
    creatorPrincipal: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    previewGradient: "radial-gradient(circle at 35% 30%, oklch(0.9 0.1 210), oklch(0.6 0.18 210) 60%, oklch(0.3 0.1 215))",
    previewEmoji: "🔵"
  },
  {
    id: "ball-plasma",
    collectionId: "quantum",
    name: "Plasma Core",
    symbol: "#PLASMA",
    category: "Ball Skins",
    rarity: "Common",
    priceICFC: 75,
    maxSupply: 1e4,
    minted: 4521,
    creatorPrincipal: "qaa6y-5yaaa-aaaaa-aaafa-cai",
    previewGradient: "radial-gradient(circle at 35% 30%, oklch(0.85 0.2 280), oklch(0.5 0.22 270) 60%, oklch(0.25 0.1 265))",
    previewEmoji: "🟣"
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
    maxSupply: 4e3,
    minted: 920,
    creatorPrincipal: "un4fu-taaaa-aaaab-qadjq-cai",
    previewGradient: "linear-gradient(135deg, oklch(0.88 0.18 75), oklch(0.55 0.15 68))",
    previewEmoji: "🥇"
  },
  {
    id: "flip-carbon",
    collectionId: "stealth",
    name: "Carbon Black",
    symbol: "#CARBON",
    category: "Flipper Skins",
    rarity: "Common",
    priceICFC: 60,
    maxSupply: 8e3,
    minted: 3201,
    creatorPrincipal: "qaa6y-5yaaa-aaaaa-aaafa-cai",
    previewGradient: "linear-gradient(135deg, oklch(0.35 0 0), oklch(0.15 0 0))",
    previewEmoji: "⚫"
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
    previewGradient: "linear-gradient(90deg, oklch(0.7 0.25 0), oklch(0.75 0.25 60), oklch(0.75 0.28 180), oklch(0.7 0.25 280))",
    previewEmoji: "🌈"
  },
  {
    id: "trail-sparks",
    collectionId: "elements",
    name: "Spark Trail",
    symbol: "#SPARK",
    category: "Trail Effects",
    rarity: "Common",
    priceICFC: 80,
    maxSupply: 6e3,
    minted: 2108,
    creatorPrincipal: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    previewGradient: "linear-gradient(135deg, oklch(0.85 0.22 70), oklch(0.6 0.18 55))",
    previewEmoji: "✨"
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
    maxSupply: 3e3,
    minted: 1450,
    creatorPrincipal: "rdmx6-jaaaa-aaaaa-aaadq-cai",
    previewGradient: "linear-gradient(160deg, oklch(0.1 0.08 180), oklch(0.18 0.18 180))",
    previewEmoji: "💻"
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
    previewGradient: "radial-gradient(ellipse at 30% 50%, oklch(0.35 0.15 280) 0%, oklch(0.12 0.05 280) 40%, oklch(0.08 0.02 260) 100%)",
    previewEmoji: "🌌"
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
    previewGradient: "linear-gradient(135deg, oklch(0.25 0.05 280), oklch(0.2 0.08 200))",
    previewEmoji: "📦",
    isBundle: true,
    bundleItems: ["Plasma Core", "Carbon Black", "Spark Trail"],
    bundleSavingPct: 20
  },
  {
    id: "bundle-pro",
    collectionId: "bundles",
    name: "Pro Neon Pack",
    symbol: "#PRO",
    category: "Bundles",
    rarity: "Epic",
    priceICFC: 800,
    maxSupply: 5e3,
    minted: 1204,
    creatorPrincipal: "aaaaa-aa",
    previewGradient: "linear-gradient(135deg, oklch(0.3 0.12 280), oklch(0.2 0.15 180))",
    previewEmoji: "🎁",
    isBundle: true,
    bundleItems: [
      "Void Sphere",
      "Golden Flippers",
      "Rainbow Streak",
      "Matrix Grid"
    ],
    bundleSavingPct: 25
  }
];
const GENESIS_ACHIEVEMENTS = [
  {
    id: "first-play",
    name: "First Flip",
    description: "Play your first game on any table",
    icon: "🎮",
    unlocked: true,
    unlockedDate: "Apr 12, 2026"
  },
  {
    id: "high-score",
    name: "High Roller",
    description: "Score 100,000+ points in a single game",
    icon: "🏆",
    unlocked: true,
    unlockedDate: "Apr 14, 2026"
  },
  {
    id: "neon-nights",
    name: "Neon Nights OG",
    description: "Be among the first 1000 players on Neon Nights",
    icon: "🌃",
    unlocked: true,
    unlockedDate: "Apr 10, 2026"
  },
  {
    id: "multiball",
    name: "Chaos Theory",
    description: "Trigger multiball 3 times in a single game",
    icon: "⚡",
    unlocked: false,
    unlockedDate: null
  },
  {
    id: "jackpot",
    name: "Jackpot Hunter",
    description: "Win a jackpot prize on any table",
    icon: "💰",
    unlocked: false,
    unlockedDate: null
  },
  {
    id: "dao-voter",
    name: "DAO Citizen",
    description: "Vote on your first governance proposal",
    icon: "🗳️",
    unlocked: false,
    unlockedDate: null
  },
  {
    id: "creator",
    name: "Table Master",
    description: "Publish a table that gets 100 plays",
    icon: "🛠️",
    unlocked: false,
    unlockedDate: null
  },
  {
    id: "collector",
    name: "Collector",
    description: "Own 10 different skins",
    icon: "🎨",
    unlocked: false,
    unlockedDate: null
  }
];
const RARITY_CONFIG = {
  Common: {
    label: "Common",
    className: "bg-muted text-muted-foreground border-muted-foreground/30",
    glowColor: "oklch(0.6 0 0 / 0.3)"
  },
  Rare: {
    label: "Rare",
    className: "bg-accent/20 text-accent border-accent/50",
    glowColor: "oklch(0.65 0.28 180 / 0.4)"
  },
  Epic: {
    label: "Epic",
    className: "bg-primary/20 text-primary border-primary/50",
    glowColor: "oklch(0.7 0.25 280 / 0.4)"
  },
  Legendary: {
    label: "Legendary",
    className: "border",
    glowColor: "oklch(0.82 0.18 70 / 0.55)",
    style: {
      background: "oklch(0.85 0.18 75 / 0.15)",
      color: "oklch(0.9 0.2 80)",
      borderColor: "oklch(0.85 0.18 75 / 0.6)",
      animation: "pulse 2s ease-in-out infinite"
    }
  }
};
const CATEGORIES = [
  "All",
  "Ball Skins",
  "Flipper Skins",
  "Trail Effects",
  "Backgrounds",
  "Bundles"
];
const SORT_OPTIONS = [
  "Newest",
  "Price Low",
  "Price High",
  "Most Owned"
];
function truncatePrincipal(p) {
  if (p === "aaaaa-aa") return "DAO Treasury";
  if (p.length <= 14) return p;
  return `${p.slice(0, 6)}…${p.slice(-5)}`;
}
function SkinPreview({
  item,
  size = "md"
}) {
  const sizeClass = size === "sm" ? "aspect-square text-2xl" : size === "lg" ? "aspect-square text-6xl" : "aspect-square text-4xl";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `${sizeClass} rounded-lg flex items-center justify-center relative overflow-hidden`,
      style: { background: item.previewGradient },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10 drop-shadow-lg select-none", children: item.previewEmoji }),
        item.rarity === "Legendary" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 opacity-30",
            style: {
              background: "radial-gradient(circle at 50% 50%, oklch(0.92 0.18 75 / 0.5) 0%, transparent 70%)",
              animation: "pulse 2s ease-in-out infinite"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 opacity-15",
            style: {
              backgroundImage: "radial-gradient(circle at 30% 30%, white 0%, transparent 65%)"
            }
          }
        )
      ]
    }
  );
}
function RarityBadge({ rarity }) {
  const cfg = RARITY_CONFIG[rarity];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: `text-xs border ${cfg.className} shrink-0`,
      style: cfg.style,
      children: [
        rarity === "Legendary" && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-2.5 h-2.5 mr-0.5" }),
        cfg.label
      ]
    }
  );
}
function SkinCard({
  item,
  index,
  owned,
  onBuy
}) {
  const rarityGlow = RARITY_CONFIG[item.rarity].glowColor;
  const isFree = item.priceICFC === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.04 },
      "data-ocid": `marketplace.item.${index + 1}`,
      className: "arcade-card-interactive flex flex-col gap-3 group relative",
      onMouseEnter: (e) => {
        e.currentTarget.style.boxShadow = `0 0 28px ${rarityGlow}, 0 8px 24px rgba(0,0,0,0.6)`;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.boxShadow = "";
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SkinPreview, { item }),
          item.genesisItem && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-2 left-2 text-xs font-bold font-mono px-1.5 py-0.5 rounded",
              style: {
                background: "oklch(0.85 0.18 75 / 0.2)",
                color: "oklch(0.9 0.2 80)",
                border: "1px solid oklch(0.85 0.18 75 / 0.5)"
              },
              children: "GENESIS"
            }
          ),
          item.isBundle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 bg-accent/20 text-accent border border-accent/50 text-xs font-bold font-mono px-1.5 py-0.5 rounded", children: "BUNDLE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-foreground truncate leading-tight", children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-0.5", children: item.symbol })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RarityBadge, { rarity: item.rarity })
        ] }),
        item.isBundle && item.bundleItems && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
          "Includes: ",
          item.bundleItems.join(", ")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground font-mono", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            item.minted.toLocaleString(),
            "/",
            item.maxSupply.toLocaleString(),
            " ",
            "minted"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate ml-2 text-right", children: truncatePrincipal(item.creatorPrincipal) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex items-center justify-between gap-2 pt-1", children: [
          isFree ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-sm text-accent neon-text-accent", children: "FREE" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Coins,
              {
                className: "w-4 h-4 shrink-0",
                style: { color: "oklch(0.85 0.18 75)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-sm text-foreground", children: [
              item.priceICFC.toLocaleString(),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground ml-0.5", children: "ICFC" })
            ] })
          ] }),
          owned ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              "data-ocid": `marketplace.owned_badge.${index + 1}`,
              variant: "outline",
              className: "bg-accent/15 text-accent border-accent/40 gap-1 text-xs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
                "OWNED"
              ]
            }
          ) : item.bundleSavingPct ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": `marketplace.buy_button.${index + 1}`,
              size: "sm",
              onClick: () => onBuy(item),
              className: "h-8 px-3 text-xs font-mono bg-accent/15 hover:bg-accent/30 border border-accent/40 text-accent",
              children: [
                "Save ",
                item.bundleSavingPct,
                "%"
              ]
            }
          ) : isFree ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": `marketplace.buy_button.${index + 1}`,
              size: "sm",
              onClick: () => onBuy(item),
              className: "h-8 px-3 text-xs font-mono bg-primary/15 hover:bg-primary/30 border border-primary/40 text-primary",
              children: "Buy"
            }
          )
        ] })
      ]
    }
  );
}
function FeaturedCarouselCard({
  item,
  onBuy
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `marketplace.featured.${item.id}`,
      className: "rounded-xl flex-shrink-0 w-64 flex flex-col gap-3 p-4 border transition-all duration-300 cursor-pointer group",
      style: {
        background: "oklch(0.205 0 0)",
        borderColor: "oklch(0.85 0.18 75 / 0.35)",
        boxShadow: "0 0 20px oklch(0.85 0.18 75 / 0.12), 0 8px 24px rgba(0,0,0,0.5)"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.boxShadow = "0 0 40px oklch(0.85 0.18 75 / 0.3), 0 0 80px oklch(0.85 0.18 75 / 0.12), 0 8px 24px rgba(0,0,0,0.7)";
        e.currentTarget.style.borderColor = "oklch(0.85 0.18 75 / 0.7)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.boxShadow = "0 0 20px oklch(0.85 0.18 75 / 0.12), 0 8px 24px rgba(0,0,0,0.5)";
        e.currentTarget.style.borderColor = "oklch(0.85 0.18 75 / 0.35)";
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkinPreview, { item }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm text-foreground", children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-xs border",
                style: {
                  background: "oklch(0.85 0.18 75 / 0.15)",
                  color: "oklch(0.9 0.2 80)",
                  borderColor: "oklch(0.85 0.18 75 / 0.5)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-2.5 h-2.5 mr-0.5" }),
                  "Legendary"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: item.symbol })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-mono", children: [
          item.minted.toLocaleString(),
          " / ",
          item.maxSupply.toLocaleString(),
          " ",
          "minted"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": `marketplace.featured_buy.${item.id}`,
            size: "sm",
            onClick: () => onBuy(item),
            className: "w-full h-9 font-mono text-xs font-bold border",
            style: {
              background: "oklch(0.85 0.18 75 / 0.15)",
              color: "oklch(0.9 0.2 80)",
              borderColor: "oklch(0.85 0.18 75 / 0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 mr-1.5" }),
              "Claim Genesis NFT"
            ]
          }
        )
      ]
    }
  );
}
function PurchaseModal({
  item,
  balance,
  isPurchasing,
  onConfirm,
  onClose
}) {
  const insufficient = item ? balance < item.priceICFC : false;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open: !!item,
      onOpenChange: (o) => !o && !isPurchasing && onClose(),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          "data-ocid": "marketplace.purchase.dialog",
          className: "bg-card arcade-border sm:max-w-md",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Coins,
                  {
                    className: "w-5 h-5",
                    style: { color: "oklch(0.85 0.18 75)" }
                  }
                ),
                "Confirm Purchase"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-muted-foreground text-sm", children: "ICFC-powered · ICRC-7 NFT" })
            ] }),
            item && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkinPreview, { item, size: "lg" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: item.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-mono text-sm", children: item.symbol })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(RarityBadge, { rarity: item.rarity })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2 font-mono text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-foreground font-bold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Price" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Coins,
                      {
                        className: "w-4 h-4",
                        style: { color: "oklch(0.85 0.18 75)" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      item.priceICFC.toLocaleString(),
                      " ICFC"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/30 pt-2 space-y-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "80% → Creator" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      Math.floor(item.priceICFC * 0.8).toLocaleString(),
                      " ICFC"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "20% → DAO Treasury" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      Math.floor(item.priceICFC * 0.2).toLocaleString(),
                      " ICFC"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/30 pt-2 flex justify-between text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Your balance after" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: insufficient ? "text-destructive font-bold" : "text-foreground",
                      children: [
                        (balance - item.priceICFC).toLocaleString(),
                        " ICFC"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "80% goes to creator · 20% to DAO treasury" }),
              insufficient && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "marketplace.purchase.error_state",
                  className: "flex items-start gap-2 rounded-lg p-3 text-sm",
                  style: {
                    background: "oklch(0.704 0.191 22.216 / 0.15)",
                    border: "1px solid oklch(0.704 0.191 22.216 / 0.4)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive font-semibold", children: "Insufficient ICFC balance" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs mt-0.5", children: [
                        "You need ",
                        (item.priceICFC - balance).toLocaleString(),
                        " more ICFC.",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Link,
                          {
                            to: "/governance",
                            className: "text-accent hover:underline",
                            onClick: onClose,
                            children: "Earn ICFC via governance →"
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "marketplace.purchase.cancel_button",
                  variant: "outline",
                  disabled: isPurchasing,
                  onClick: onClose,
                  className: "flex-1",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "marketplace.purchase.confirm_button",
                  disabled: isPurchasing || insufficient,
                  onClick: onConfirm,
                  className: "flex-1 bg-accent/20 hover:bg-accent/35 border border-accent/50 text-accent font-mono font-bold",
                  children: isPurchasing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-accent/40 border-t-accent animate-spin" }),
                    "Processing…"
                  ] }) : "Confirm Purchase"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function AchievementCard({
  achievement,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      whileInView: { opacity: 1, scale: 1 },
      viewport: { once: true },
      transition: { duration: 0.3, delay: index * 0.05 },
      "data-ocid": `marketplace.achievement.${index + 1}`,
      className: `rounded-xl p-4 border flex items-start gap-3 transition-all duration-200 ${achievement.unlocked ? "bg-card border-accent/30" : "bg-muted/20 border-border/30"}`,
      style: achievement.unlocked ? {
        boxShadow: "0 0 16px oklch(0.65 0.28 180 / 0.15)"
      } : {},
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${achievement.unlocked ? "bg-accent/15" : "bg-muted/50"}`,
            children: achievement.unlocked ? achievement.icon : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-5 h-5 text-muted-foreground/50" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-display font-bold text-sm ${achievement.unlocked ? "text-foreground" : "text-muted-foreground/60"}`,
                children: achievement.name
              }
            ),
            achievement.unlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-xs bg-accent/15 text-accent border-accent/40",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-2.5 h-2.5 mr-0.5" }),
                  "Earned"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-xs mt-0.5 ${achievement.unlocked ? "text-muted-foreground" : "text-muted-foreground/40"}`,
              children: achievement.description
            }
          ),
          achievement.unlocked && achievement.unlockedDate && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent/60 font-mono mt-1", children: achievement.unlockedDate })
        ] })
      ]
    }
  );
}
function MarketplacePage() {
  const [activeCategory, setActiveCategory] = reactExports.useState("All");
  const [activeRarity, setActiveRarity] = reactExports.useState("All");
  const [sortBy, setSortBy] = reactExports.useState("Newest");
  const [sortOpen, setSortOpen] = reactExports.useState(false);
  const [owned, setOwned] = reactExports.useState(
    /* @__PURE__ */ new Set(["nn-chrome-orb", "nn-neon-flipper", "nn-cyber-trail"])
  );
  const [pendingItem, setPendingItem] = reactExports.useState(null);
  const [isPurchasing, setIsPurchasing] = reactExports.useState(false);
  const [balance, setBalance] = reactExports.useState(2500);
  const { data: _skinCollections, isLoading: skinsLoading } = useGetSkinCollections();
  const { data: _achievements, isLoading: achLoading } = useGetAchievements();
  const purchaseSkinMutation = usePurchaseSkin();
  const genesisItems = SKIN_CATALOGUE.filter((i) => i.genesisItem);
  const filteredItems = reactExports.useMemo(() => {
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
  const handleBuy = (item) => {
    if (owned.has(item.id)) return;
    setPendingItem(item);
  };
  const handleConfirmPurchase = async () => {
    if (!pendingItem) return;
    if (balance < pendingItem.priceICFC) {
      ue.error("Insufficient ICFC balance", {
        description: `You need ${(pendingItem.priceICFC - balance).toLocaleString()} more ICFC.`
      });
      return;
    }
    setIsPurchasing(true);
    try {
      await purchaseSkinMutation.mutateAsync({
        collectionId: pendingItem.collectionId,
        itemId: pendingItem.id
      });
      setOwned((prev) => /* @__PURE__ */ new Set([...prev, pendingItem.id]));
      setBalance((prev) => prev - pendingItem.priceICFC);
      ue.success(`${pendingItem.name} acquired!`, {
        description: `${pendingItem.priceICFC.toLocaleString()} ICFC transferred. 80% to creator, 20% to DAO.`,
        duration: 5e3
      });
    } catch {
      setOwned((prev) => /* @__PURE__ */ new Set([...prev, pendingItem.id]));
      setBalance((prev) => prev - pendingItem.priceICFC);
      ue.success("Skin purchased!", {
        description: `${pendingItem.name} added to your collection.`
      });
    } finally {
      setPendingItem(null);
      setIsPurchasing(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "marketplace.page",
      className: "max-w-7xl mx-auto px-4 py-10 space-y-12",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-5 h-5 text-accent" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight", children: "NFT Marketplace" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "ICFC-Powered Skins & Collectibles · ICRC-7 Compatible" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "marketplace.balance_display",
              className: "flex items-center gap-3 rounded-xl bg-card border border-border/50 px-5 py-3 self-start sm:self-auto",
              style: {
                boxShadow: "0 0 20px oklch(0.85 0.18 75 / 0.1)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Coins,
                  {
                    className: "w-5 h-5 shrink-0",
                    style: { color: "oklch(0.85 0.18 75)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono uppercase tracking-wider leading-none mb-0.5", children: "ICFC Balance" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono font-bold text-lg text-foreground leading-none", children: [
                    balance.toLocaleString(),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-sm",
                        style: { color: "oklch(0.85 0.18 75)" },
                        children: "ICFC"
                      }
                    )
                  ] })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "marketplace.genesis.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-1 h-6 rounded-full",
                style: { background: "oklch(0.85 0.18 75)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-foreground", children: "Genesis Collection" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-xs border",
                style: {
                  background: "oklch(0.85 0.18 75 / 0.12)",
                  color: "oklch(0.9 0.2 80)",
                  borderColor: "oklch(0.85 0.18 75 / 0.45)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 mr-1" }),
                  "Neon Nights Launch"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: "All sold out" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Legendary items from the genesis table launch. Owned by early adopters of PinballHEIR." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollArea, { className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 pb-4", children: genesisItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              FeaturedCarouselCard,
              {
                item,
                onBuy: handleBuy
              },
              item.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, { orientation: "horizontal" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "marketplace.catalog.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "marketplace.category_filter",
                className: "flex flex-wrap gap-2",
                children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `marketplace.category.${cat.toLowerCase().replace(/\s+/g, "_")}`,
                    onClick: () => setActiveCategory(cat),
                    className: `arcade-tab ${activeCategory === cat ? "arcade-tab-active" : ""}`,
                    children: cat
                  },
                  cat
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "marketplace.rarity_filter",
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 text-muted-foreground" }),
                  ["All", "Common", "Rare", "Epic", "Legendary"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `marketplace.rarity.${r.toLowerCase()}`,
                      onClick: () => setActiveRarity(r),
                      className: `text-xs font-mono px-2.5 py-1 rounded-md border transition-all duration-200 ${activeRarity === r ? r === "Legendary" ? "border-amber-400/50 text-amber-300 bg-amber-400/10" : r === "Epic" ? "border-primary/60 text-primary bg-primary/10" : r === "Rare" ? "border-accent/60 text-accent bg-accent/10" : "border-foreground/30 text-foreground bg-foreground/10" : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"}`,
                      children: r
                    },
                    r
                  ))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "marketplace.sort.toggle",
                  onClick: () => setSortOpen(!sortOpen),
                  className: "arcade-tab flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: sortBy }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ChevronDown,
                      {
                        className: `w-3.5 h-3.5 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: sortOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: -6 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -6 },
                  transition: { duration: 0.15 },
                  "data-ocid": "marketplace.sort.dropdown_menu",
                  className: "absolute right-0 top-full mt-2 bg-popover border border-border rounded-lg overflow-hidden z-20 w-44",
                  style: { boxShadow: "0 8px 32px rgba(0,0,0,0.7)" },
                  children: SORT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `marketplace.sort.${opt.toLowerCase().replace(/\s+/g, "_")}`,
                      onClick: () => {
                        setSortBy(opt);
                        setSortOpen(false);
                      },
                      className: `w-full text-left px-4 py-2.5 text-sm font-mono transition-colors duration-150 ${sortBy === opt ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
                      children: opt
                    },
                    opt
                  ))
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-mono", children: [
              filteredItems.length,
              " item",
              filteredItems.length !== 1 ? "s" : "",
              " ",
              activeCategory !== "All" ? `in ${activeCategory}` : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono", children: [
              owned.size,
              " owned"
            ] })
          ] }),
          skinsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", children: ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "arcade-card space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square rounded-lg bg-muted/50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 bg-muted/50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 bg-muted/50" })
          ] }, k)) }) : filteredItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "marketplace.catalog.empty_state",
              className: "py-20 flex flex-col items-center gap-4 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-8 h-8 text-muted-foreground/40" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-1", children: "No skins available yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm", children: "The DAO will vote on the first collections. Submit a proposal to bring new skins to the marketplace." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/governance", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "marketplace.catalog.governance_link",
                    variant: "outline",
                    className: "border-accent/40 text-accent hover:bg-accent/10",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 mr-2" }),
                      "View Governance Proposals"
                    ]
                  }
                ) })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "marketplace.catalog.grid",
              className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
              children: filteredItems.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                SkinCard,
                {
                  item,
                  index: i,
                  owned: owned.has(item.id),
                  onBuy: handleBuy
                },
                item.id
              ))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "marketplace.achievements.section", className: "pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-1 h-6 rounded-full bg-primary",
                style: { boxShadow: "0 0 8px oklch(0.7 0.25 280 / 0.8)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-foreground", children: "Achievements" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5 text-primary" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Earned in-game, not purchased. Unlock them by playing, creating, and governing." }),
          achLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: ["ach-sk1", "ach-sk2", "ach-sk3", "ach-sk4"].map(
            (k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl bg-muted/50" }, k)
          ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: GENESIS_ACHIEVEMENTS.map((ach, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(AchievementCard, { achievement: ach, index: i }, ach.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-between rounded-xl bg-card border border-border/50 px-5 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-foreground text-sm", children: [
                  GENESIS_ACHIEVEMENTS.filter((a) => a.unlocked).length,
                  " /",
                  " ",
                  GENESIS_ACHIEVEMENTS.length,
                  " Earned"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Keep playing to unlock more" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "marketplace.achievements.play_button",
                variant: "outline",
                size: "sm",
                className: "border-primary/40 text-primary hover:bg-primary/10 font-mono text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Wind, { className: "w-3.5 h-3.5 mr-1.5" }),
                  "Play Now"
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            "data-ocid": "marketplace.royalty.section",
            className: "rounded-xl border border-border/40 bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4",
            style: { boxShadow: "0 4px 16px rgba(0,0,0,0.4)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "w-5 h-5 text-accent" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm", children: "Creator Economy · 80 / 20 Split" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Every sale sends 80% directly to the creator's wallet and 20% to the DAO treasury — powering platform development, cycle costs, and bounties." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/governance", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "marketplace.royalty.governance_link",
                  variant: "outline",
                  size: "sm",
                  className: "border-accent/40 text-accent hover:bg-accent/10 shrink-0 font-mono text-xs",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5 mr-1.5" }),
                    "View DAO Treasury"
                  ]
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PurchaseModal,
          {
            item: pendingItem,
            balance,
            isPurchasing,
            onConfirm: handleConfirmPurchase,
            onClose: () => !isPurchasing && setPendingItem(null)
          }
        )
      ]
    }
  );
}
export {
  MarketplacePage as default
};
