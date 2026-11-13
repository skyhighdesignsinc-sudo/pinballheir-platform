import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronRight,
  Crown,
  Heart,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Trophy,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import PinballGame, { type GameCallbacks } from "../components/PinballGame";
import {
  useGetLeaderboard,
  useGetTable,
  useGetTableEconomy,
  useNudgeTable,
  useSaveTheBall,
  useSubmitReplay,
  useSubmitScore,
  useTriggerGoldenBall,
} from "../hooks/useQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

type GamePhase = "playing" | "paused" | "gameover" | "saving";

interface GameState {
  score: number;
  balls: number;
  combo: number;
  multiplier: number;
  jackpot: number;
  icfcEarned: number;
  replayHash: string;
  movesJson: string;
  rngSeed: string;
}

// ─── HUD Overlay ──────────────────────────────────────────────────────────────

function HUD({
  state,
  ballSaverActive,
  goldenBallActive,
  tiltActive,
}: {
  state: GameState;
  ballSaverActive: boolean;
  goldenBallActive: boolean;
  tiltActive: boolean;
}) {
  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none z-10 p-3 flex items-start justify-between">
      {/* Left: score + combo */}
      <div className="flex flex-col gap-1">
        <div
          className="score-large leading-none"
          data-ocid="play.score_display"
          data-testid="score-display"
        >
          {state.score.toLocaleString()}
        </div>
        {state.combo > 1 && (
          <div className="font-mono text-sm font-bold neon-text-primary">
            {state.combo}× COMBO
          </div>
        )}
        {state.multiplier > 1 && (
          <div className="font-mono text-xs text-accent/80">
            ×{state.multiplier} MULTIPLIER
          </div>
        )}
      </div>

      {/* Center: alerts */}
      <div className="flex flex-col items-center gap-1">
        {goldenBallActive && (
          <div
            className="flex items-center gap-1 px-3 py-1 rounded font-display font-bold text-sm animate-bounce"
            style={{
              background: "oklch(0.75 0.25 60 / 0.9)",
              color: "oklch(0.1 0 0)",
            }}
            data-ocid="play.golden_ball_alert"
          >
            <Crown className="w-4 h-4" />
            GOLDEN BALL!
          </div>
        )}
        {tiltActive && (
          <div
            className="px-4 py-1 rounded font-display font-bold text-lg animate-pulse"
            style={{
              background: "oklch(0.7 0.19 22 / 0.9)",
              color: "oklch(0.98 0 0)",
            }}
            data-ocid="play.tilt_alert"
          >
            TILT!
          </div>
        )}
        {ballSaverActive && (
          <div className="px-3 py-1 rounded font-display font-bold text-xs border border-accent/60 bg-accent/20 text-accent">
            BALL SAVER ACTIVE
          </div>
        )}
      </div>

      {/* Right: balls + jackpot */}
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1" data-testid="balls-remaining">
          {Array.from({ length: Math.max(0, state.balls) }, (_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static ball indicators
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ background: "oklch(0.7 0.25 280)" }}
            />
          ))}
          <span className="font-mono text-xs text-muted-foreground ml-1">
            BALLS
          </span>
        </div>
        <div className="font-mono text-sm text-chart-1">
          🏆 {state.jackpot.toLocaleString()} ICFC
        </div>
      </div>
    </div>
  );
}

// ─── Pause Overlay ────────────────────────────────────────────────────────────

function PauseOverlay({
  state,
  onResume,
  onRestart,
  onQuit,
}: {
  state: GameState;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.75)" }}
      data-ocid="play.pause_dialog"
    >
      <div className="arcade-card w-80 flex flex-col gap-5 text-center">
        <div className="flex flex-col gap-1">
          <Pause className="w-10 h-10 mx-auto text-primary" />
          <h2 className="font-display text-2xl font-bold">PAUSED</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 text-left text-sm font-mono">
          <div className="text-muted-foreground">Score</div>
          <div className="text-accent text-right">
            {state.score.toLocaleString()}
          </div>
          <div className="text-muted-foreground">Balls Left</div>
          <div className="text-accent text-right">{state.balls}</div>
          <div className="text-muted-foreground">Multiplier</div>
          <div className="text-accent text-right">×{state.multiplier}</div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={onResume}
            className="gap-2 w-full"
            data-ocid="play.resume_button"
          >
            <Play className="w-4 h-4" />
            Resume
          </Button>
          <Button
            variant="outline"
            onClick={onRestart}
            className="gap-2 w-full"
            data-ocid="play.restart_button"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </Button>
          <Button
            variant="destructive"
            onClick={onQuit}
            className="gap-2 w-full"
            data-ocid="play.quit_button"
          >
            Quit to Arcade
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Game Over Overlay ────────────────────────────────────────────────────────

function GameOverOverlay({
  state,
  onSubmit,
  onRestart,
  onQuit,
  isSubmitting,
}: {
  state: GameState;
  onSubmit: () => void;
  onRestart: () => void;
  onQuit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.85)" }}
      data-ocid="play.gameover_dialog"
      data-testid="game-over-overlay"
    >
      <div className="arcade-card w-96 flex flex-col gap-5 text-center">
        <div className="flex flex-col gap-1">
          <Trophy className="w-12 h-12 mx-auto text-chart-1" />
          <h2 className="font-display text-3xl font-bold neon-text-accent">
            GAME OVER
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm font-mono">
          <div className="text-muted-foreground">Final Score</div>
          <div className="text-accent text-right font-bold text-base">
            {state.score.toLocaleString()}
          </div>
          <div className="text-muted-foreground">ICFC Earned</div>
          <div className="text-chart-1 text-right">
            {state.icfcEarned.toFixed(2)}
          </div>
          <div className="text-muted-foreground">Replay Hash</div>
          <div
            className="text-muted-foreground text-right text-xs truncate"
            title={state.replayHash}
          >
            {state.replayHash ? `${state.replayHash.slice(0, 16)}…` : "—"}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="gap-2 w-full"
            data-ocid="play.submit_score_button"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trophy className="w-4 h-4" />
            )}
            {isSubmitting ? "Submitting…" : "Submit Score On-Chain"}
          </Button>
          <Button
            variant="outline"
            onClick={onRestart}
            className="gap-2 w-full"
            data-ocid="play.restart_after_gameover_button"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Button>
          <Button
            variant="ghost"
            onClick={onQuit}
            className="gap-2 w-full"
            data-ocid="play.return_to_arcade_button"
          >
            Return to Arcade
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Save Ball Prompt ─────────────────────────────────────────────────────────

function SaveBallPrompt({
  fee,
  countdown,
  onSave,
  onDecline,
}: {
  fee: number;
  countdown: number;
  onSave: () => void;
  onDecline: () => void;
}) {
  return (
    <div
      className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      data-ocid="play.save_ball_prompt"
    >
      <div className="arcade-card p-3 flex flex-col items-center gap-2 min-w-52 text-center">
        <div className="font-display font-bold text-sm">⚠️ BALL NEAR DRAIN</div>
        <div
          className="font-mono text-3xl font-bold text-destructive"
          data-ocid="play.save_ball_countdown"
        >
          {countdown.toFixed(1)}s
        </div>
        <Button
          size="sm"
          onClick={onSave}
          className="gap-1 w-full"
          data-ocid="play.save_ball_button"
        >
          <Heart className="w-3 h-3" />
          SAVE THE BALL — {fee.toFixed(4)} ICFC
        </Button>
        <button
          type="button"
          onClick={onDecline}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="play.save_ball_decline_button"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

// ─── Desktop Side Panel ────────────────────────────────────────────────────────

function SidePanel({
  tableId,
  showHeatmap,
  showGhost,
  onToggleHeatmap,
  onToggleGhost,
}: {
  tableId: string;
  showHeatmap: boolean;
  showGhost: boolean;
  onToggleHeatmap: () => void;
  onToggleGhost: () => void;
}) {
  const { data: leaderboard } = useGetLeaderboard(tableId);
  const top5 = leaderboard?.slice(0, 5) ?? [];

  return (
    <div className="hidden lg:flex flex-col gap-3 w-56 shrink-0">
      {/* Top 5 leaderboard */}
      <div className="arcade-card flex flex-col gap-2">
        <div className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Trophy className="w-3 h-3" /> Top Scores
        </div>
        {top5.length === 0 && (
          <div className="text-muted-foreground text-xs">No scores yet</div>
        )}
        {top5.map((entry, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: leaderboard rank order is stable
            key={i}
            className="flex items-center justify-between text-xs font-mono"
            data-ocid={`play.leaderboard_item.${i + 1}`}
          >
            <span className="text-muted-foreground w-4">{i + 1}.</span>
            <span className="flex-1 truncate text-foreground">
              {entry.displayName ||
                (entry.player
                  ? `${entry.player.toString().slice(0, 8)}…`
                  : "Anonymous")}
            </span>
            <span className="text-accent">
              {Number(entry.score).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Toggles */}
      <div className="arcade-card flex flex-col gap-2">
        <div className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider">
          Options
        </div>
        <button
          type="button"
          onClick={onToggleGhost}
          className={`text-left text-xs px-2 py-1.5 rounded transition-smooth ${
            showGhost
              ? "arcade-tab-active"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-ocid="play.ghost_toggle"
        >
          👻 Ghost Replay
        </button>
        <button
          type="button"
          onClick={onToggleHeatmap}
          className={`text-left text-xs px-2 py-1.5 rounded transition-smooth ${
            showHeatmap
              ? "arcade-tab-active"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-ocid="play.heatmap_toggle"
        >
          🌡 Drain Heatmap
        </button>
      </div>

      {/* Controls help */}
      <div className="arcade-card flex flex-col gap-1.5">
        <div className="font-display font-bold text-xs text-muted-foreground uppercase tracking-wider">
          Controls
        </div>
        <div className="text-xs text-muted-foreground space-y-0.5 font-mono">
          <div>
            <span className="text-foreground">A / Z</span> Left flipper
          </div>
          <div>
            <span className="text-foreground">L / /</span> Right flipper
          </div>
          <div>
            <span className="text-foreground">Space</span> Launch ball
          </div>
          <div>
            <span className="text-foreground">Esc</span> Pause
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Touch Controls ────────────────────────────────────────────────────────────

function TouchControls({
  onLeftDown,
  onLeftUp,
  onRightDown,
  onRightUp,
  onNudge,
}: {
  onLeftDown: () => void;
  onLeftUp: () => void;
  onRightDown: () => void;
  onRightUp: () => void;
  onNudge: () => void;
}) {
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);

  return (
    <div
      className="lg:hidden absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between p-2 pointer-events-none"
      style={{ height: "96px" }}
    >
      {/* Left flipper */}
      <button
        type="button"
        className="pointer-events-auto font-display font-bold text-sm rounded-lg select-none touch-none transition-all"
        style={{
          width: "40%",
          height: "64px",
          background: leftActive
            ? "oklch(0.65 0.28 180 / 0.85)"
            : "oklch(0.205 0 0 / 0.8)",
          border: `2px solid oklch(0.65 0.28 180 / ${leftActive ? "1" : "0.5"})`,
          boxShadow: leftActive
            ? "0 0 16px oklch(0.65 0.28 180 / 0.6)"
            : "none",
          color: "oklch(0.985 0 0)",
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          setLeftActive(true);
          onLeftDown();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          setLeftActive(false);
          onLeftUp();
        }}
        data-ocid="play.left_flipper_button"
      >
        ◀ LEFT
      </button>

      {/* Nudge center */}
      <button
        type="button"
        className="pointer-events-auto font-display font-bold text-xs rounded-full select-none touch-none"
        style={{
          width: "52px",
          height: "52px",
          background: "oklch(0.205 0 0 / 0.8)",
          border: "2px solid oklch(0.7 0.25 280 / 0.5)",
          color: "oklch(0.985 0 0)",
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          onNudge();
        }}
        data-ocid="play.nudge_touch_button"
      >
        NUDGE
      </button>

      {/* Right flipper */}
      <button
        type="button"
        className="pointer-events-auto font-display font-bold text-sm rounded-lg select-none touch-none transition-all"
        style={{
          width: "40%",
          height: "64px",
          background: rightActive
            ? "oklch(0.65 0.28 180 / 0.85)"
            : "oklch(0.205 0 0 / 0.8)",
          border: `2px solid oklch(0.65 0.28 180 / ${rightActive ? "1" : "0.5"})`,
          boxShadow: rightActive
            ? "0 0 16px oklch(0.65 0.28 180 / 0.6)"
            : "none",
          color: "oklch(0.985 0 0)",
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          setRightActive(true);
          onRightDown();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          setRightActive(false);
          onRightUp();
        }}
        data-ocid="play.right_flipper_button"
      >
        RIGHT ▶
      </button>
    </div>
  );
}

// ─── Main Play Page ────────────────────────────────────────────────────────────

export default function PlayPage() {
  const { tableId } = useParams({ from: "/play/$tableId" });
  const navigate = useNavigate();

  const { data: table, isLoading: tableLoading } = useGetTable(tableId);
  const { data: economy } = useGetTableEconomy(tableId);
  const submitScore = useSubmitScore();
  const submitReplay = useSubmitReplay();
  const saveTheBall = useSaveTheBall();
  const nudgeTable = useNudgeTable();
  const triggerGoldenBall = useTriggerGoldenBall();

  const [phase, setPhase] = useState<GamePhase>("playing");
  const [gameKey, setGameKey] = useState(0); // increment to restart
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [tiltActive, setTiltActive] = useState(false);
  const [goldenBallActive, setGoldenBallActive] = useState(false);
  const [ballSaverShowing, setBallSaverShowing] = useState(false);
  const [ballSaverCountdown, setBallSaverCountdown] = useState(0.8);
  const ballSaverTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    balls: 3,
    combo: 0,
    multiplier: 1,
    jackpot: 1250,
    icfcEarned: 0,
    replayHash: "",
    movesJson: "[]",
    rngSeed: Math.random().toString(36).slice(2),
  });

  // Flipper callbacks for touch controls
  const flipperCallbacksRef = useRef({
    leftDown: () => {},
    leftUp: () => {},
    rightDown: () => {},
    rightUp: () => {},
    nudge: () => {},
  });

  // ESC key to pause
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "playing") setPhase("paused");
      else if (e.key === "Escape" && phase === "paused") setPhase("playing");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase]);

  // Tilt flash: auto-clear after 2s
  useEffect(() => {
    if (!tiltActive) return;
    const t = setTimeout(() => setTiltActive(false), 2000);
    return () => clearTimeout(t);
  }, [tiltActive]);

  // Golden ball: auto-clear after 3s
  useEffect(() => {
    if (!goldenBallActive) return;
    const t = setTimeout(() => setGoldenBallActive(false), 3000);
    return () => clearTimeout(t);
  }, [goldenBallActive]);

  // Save ball countdown
  const startSaveBallPrompt = useCallback(() => {
    setBallSaverShowing(true);
    setBallSaverCountdown(0.8);
    if (ballSaverTimerRef.current) clearInterval(ballSaverTimerRef.current);
    ballSaverTimerRef.current = setInterval(() => {
      setBallSaverCountdown((prev) => {
        if (prev <= 0.05) {
          clearInterval(ballSaverTimerRef.current!);
          setBallSaverShowing(false);
          return 0;
        }
        return prev - 0.05;
      });
    }, 50);
  }, []);

  const handleSaveBall = useCallback(() => {
    clearInterval(ballSaverTimerRef.current!);
    setBallSaverShowing(false);
    saveTheBall.mutate(tableId);
  }, [saveTheBall, tableId]);

  const handleDeclineSave = useCallback(() => {
    clearInterval(ballSaverTimerRef.current!);
    setBallSaverShowing(false);
  }, []);

  const handleNudge = useCallback(() => {
    nudgeTable.mutate(tableId, {
      onSuccess: () => {
        // 50% tilt chance
        if (Math.random() < 0.5) {
          setTiltActive(true);
          if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
        }
      },
    });
    flipperCallbacksRef.current.nudge();
  }, [nudgeTable, tableId]);

  const handleGoldenBall = useCallback(() => {
    triggerGoldenBall.mutate(tableId, {
      onSuccess: () => {
        setGoldenBallActive(true);
        if ("vibrate" in navigator)
          navigator.vibrate([200, 100, 200, 100, 200]);
      },
    });
  }, [triggerGoldenBall, tableId]);

  const handleSubmitScore = useCallback(async () => {
    setPhase("saving");
    try {
      await submitReplay.mutateAsync({
        tableId,
        movesJson: gameState.movesJson,
        initialParamsJson: JSON.stringify({
          gravity: table?.gravity ?? 9.8,
          friction: table?.friction ?? 0.3,
          rebound: table?.rebound ?? 0.8,
        }),
        rngSeed: gameState.rngSeed,
        score: BigInt(Math.round(gameState.score)),
      });
      await submitScore.mutateAsync({
        tableId,
        score: BigInt(Math.round(gameState.score)),
        replayJson: gameState.movesJson,
        rngSeed: gameState.rngSeed,
      });
    } catch {
      // Silent — still let user return
    } finally {
      setPhase("gameover");
    }
  }, [submitReplay, submitScore, tableId, gameState, table]);

  const handleRestart = useCallback(() => {
    setPhase("playing");
    setTiltActive(false);
    setGoldenBallActive(false);
    setBallSaverShowing(false);
    setGameState({
      score: 0,
      balls: 3,
      combo: 0,
      multiplier: 1,
      jackpot: 1250,
      icfcEarned: 0,
      replayHash: "",
      movesJson: "[]",
      rngSeed: Math.random().toString(36).slice(2),
    });
    setGameKey((k) => k + 1);
  }, []);

  // Game callbacks passed to PinballGame
  const gameCallbacks: GameCallbacks = {
    onScoreChange: (score, combo, multiplier) =>
      setGameState((s) => ({ ...s, score, combo, multiplier })),
    onBallsChange: (balls) => setGameState((s) => ({ ...s, balls })),
    onBallNearDrain: startSaveBallPrompt,
    onDrain: () => {
      if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
    },
    onGameOver: (finalScore, movesJson, replayHash) => {
      const icfcEarned = finalScore * 0.0001;
      setGameState((s) => ({
        ...s,
        score: finalScore,
        movesJson,
        replayHash,
        icfcEarned,
      }));
      setPhase("gameover");
    },
    onBumperHit: () => {
      if ("vibrate" in navigator) navigator.vibrate(50);
    },
    onTilt: () => setTiltActive(true),
    onGoldenBall: () => setGoldenBallActive(true),
    onFlipperLeft: (down) => {
      if (down) flipperCallbacksRef.current.leftDown();
      else flipperCallbacksRef.current.leftUp();
    },
    onFlipperRight: (down) => {
      if (down) flipperCallbacksRef.current.rightDown();
      else flipperCallbacksRef.current.rightUp();
    },
    registerFlipperCallbacks: (cbs) => {
      flipperCallbacksRef.current = {
        ...flipperCallbacksRef.current,
        ...cbs,
      };
    },
  };

  const saveBallFee = economy?.saveBallPrice
    ? Number(economy.saveBallPrice) / 100_000_000
    : 0.0005;
  const nudgeFee = economy?.nudgePrice
    ? Number(economy.nudgePrice) / 100_000_000
    : 0.0001;
  const goldenBallChance = economy?.goldenBallChance
    ? Number(economy.goldenBallChance)
    : 5;

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 4rem)" }}
      data-ocid="play.page"
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b shrink-0"
        style={{
          background: "oklch(var(--card))",
          borderColor: "oklch(var(--primary) / 0.3)",
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/" })}
          className="gap-1 text-sm"
          data-ocid="play.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Arcade</span>
        </Button>

        <div className="flex items-center gap-2">
          {tableLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <span className="font-display font-bold text-base neon-text-primary truncate max-w-48">
              {table?.name ?? "Neon Nights"}
            </span>
          )}
          {table?.status && (
            <Badge
              variant="outline"
              className="text-xs border-accent/40 text-accent hidden sm:flex"
            >
              {table.status}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Score pill */}
          <div className="hidden sm:flex items-center gap-1 font-mono text-sm font-bold neon-text-accent">
            <Trophy className="w-3 h-3" />
            {gameState.score.toLocaleString()}
          </div>

          {/* Pause button */}
          {phase === "playing" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPhase("paused")}
              className="w-8 h-8 p-0"
              data-ocid="play.pause_button"
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-1 gap-3 p-3 min-h-0">
        {/* ── Canvas + HUD wrapper ── */}
        <div
          className="relative flex-1 rounded-lg overflow-hidden arcade-bezel"
          style={{ background: "oklch(0.08 0.02 280)" }}
          data-testid="play-canvas"
        >
          {/* Loading state */}
          {tableLoading && (
            <div
              className="absolute inset-0 z-40 flex items-center justify-center"
              data-ocid="play.loading_state"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="font-mono text-sm text-muted-foreground animate-pulse">
                  Loading table…
                </p>
              </div>
            </div>
          )}

          {/* Game canvas */}
          {!tableLoading && (
            <PinballGame
              key={gameKey}
              tableId={tableId}
              table={table ?? null}
              showHeatmap={showHeatmap}
              showGhost={showGhost}
              isPaused={phase === "paused" || phase === "gameover"}
              callbacks={gameCallbacks}
            />
          )}

          {/* HUD */}
          {phase === "playing" && (
            <HUD
              state={gameState}
              ballSaverActive={false}
              goldenBallActive={goldenBallActive}
              tiltActive={tiltActive}
            />
          )}

          {/* Tilt flash overlay */}
          {tiltActive && (
            <div
              className="absolute inset-0 z-20 pointer-events-none animate-pulse"
              style={{ background: "oklch(0.7 0.19 22 / 0.12)" }}
            />
          )}

          {/* Save ball prompt */}
          {ballSaverShowing && phase === "playing" && (
            <SaveBallPrompt
              fee={saveBallFee}
              countdown={ballSaverCountdown}
              onSave={handleSaveBall}
              onDecline={handleDeclineSave}
            />
          )}

          {/* Pause overlay */}
          {phase === "paused" && (
            <PauseOverlay
              state={gameState}
              onResume={() => setPhase("playing")}
              onRestart={handleRestart}
              onQuit={() => navigate({ to: "/" })}
            />
          )}

          {/* Game over overlay */}
          {(phase === "gameover" || phase === "saving") && (
            <GameOverOverlay
              state={gameState}
              onSubmit={handleSubmitScore}
              onRestart={handleRestart}
              onQuit={() => navigate({ to: "/" })}
              isSubmitting={phase === "saving"}
            />
          )}

          {/* Touch controls */}
          {phase === "playing" && (
            <TouchControls
              onLeftDown={() => flipperCallbacksRef.current.leftDown()}
              onLeftUp={() => flipperCallbacksRef.current.leftUp()}
              onRightDown={() => flipperCallbacksRef.current.rightDown()}
              onRightUp={() => flipperCallbacksRef.current.rightUp()}
              onNudge={handleNudge}
            />
          )}
        </div>

        {/* ── Desktop side panel ── */}
        <SidePanel
          tableId={tableId}
          showHeatmap={showHeatmap}
          showGhost={showGhost}
          onToggleHeatmap={() => setShowHeatmap((v) => !v)}
          onToggleGhost={() => setShowGhost((v) => !v)}
        />
      </div>

      {/* ── Bottom action bar ── */}
      {phase === "playing" && (
        <div
          className="hidden lg:flex items-center justify-center gap-3 px-4 py-2 border-t shrink-0"
          style={{
            background: "oklch(var(--card))",
            borderColor: "oklch(var(--primary) / 0.2)",
          }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleNudge}
            disabled={nudgeTable.isPending}
            className="gap-1.5 text-xs border-primary/40 hover:border-primary/60"
            data-ocid="play.nudge_button"
          >
            <Zap className="w-3 h-3 text-primary" />
            Nudge ({nudgeFee.toFixed(4)} ICFC)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoldenBall}
            disabled={triggerGoldenBall.isPending}
            className="gap-1.5 text-xs border-chart-1/40 hover:border-chart-1/60"
            data-ocid="play.golden_ball_button"
          >
            <Crown className="w-3 h-3 text-chart-1" />
            Golden Ball ({goldenBallChance}% chance)
          </Button>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            <span className="font-mono">A/L = Flippers | Space = Launch</span>
          </div>
        </div>
      )}
    </div>
  );
}
