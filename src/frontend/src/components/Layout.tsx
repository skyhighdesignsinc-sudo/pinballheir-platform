import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Gamepad2,
  Hammer,
  Menu,
  Package,
  ShoppingBag,
  Trophy,
  User,
  Vote,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import ProfileSetupModal from "./ProfileSetupModal";

const NAV_ITEMS = [
  { to: "/", label: "Arcade", icon: Gamepad2, ocid: "nav.arcade_link" },
  {
    to: "/leaderboard",
    label: "Leaderboards",
    icon: Trophy,
    ocid: "nav.leaderboard_link",
  },
  {
    to: "/constructor",
    label: "Constructor",
    icon: Hammer,
    ocid: "nav.constructor_link",
  },
  {
    to: "/governance",
    label: "Governance",
    icon: Vote,
    ocid: "nav.governance_link",
  },
  {
    to: "/marketplace",
    label: "Marketplace",
    icon: ShoppingBag,
    ocid: "nav.marketplace_link",
  },
  {
    to: "/assets",
    label: "Assets",
    icon: Package,
    ocid: "nav.assets_link",
  },
] as const;

type NavTo = (typeof NAV_ITEMS)[number]["to"] | "/profile";

export default function Layout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === "logging-in";
  const authLabel =
    loginStatus === "logging-in"
      ? "Logging in…"
      : isAuthenticated
        ? "Logout"
        : "Login";
  const currentPath = routerState.location.pathname;

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "";
        console.error("Login error:", error);
        if (msg === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isActive = (to: string) =>
    to === "/" ? currentPath === "/" : currentPath.startsWith(to);

  const navTo = (to: NavTo) => {
    navigate({ to });
    setSheetOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-card border-b border-border/40 shadow-subtle">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              data-ocid="nav.home_link"
              className="flex items-center gap-3 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-md"
            >
              <div className="relative w-9 h-9">
                <img
                  src="/assets/generated/arcade-cabinet-icon-transparent@128x128.png"
                  alt="PinballHEIR"
                  className="w-9 h-9 group-hover:scale-110 transition-transform duration-200 drop-shadow-[0_0_8px_oklch(var(--primary)/0.6)]"
                />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span
                  className="text-xl font-bold font-display bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
                  style={{ animation: "gradient-shift 4s linear infinite" }}
                >
                  PinballHEIR
                </span>
                <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
                  DAO Arcade
                </span>
              </div>
            </button>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map(({ to, label, icon: Icon, ocid }) => (
                <Button
                  key={to}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to })}
                  data-ocid={ocid}
                  className={[
                    "gap-2 text-sm font-medium transition-colors duration-200",
                    isActive(to)
                      ? "text-primary bg-primary/10 hover:bg-primary/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  ].join(" ")}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                  {isActive(to) && <span className="sr-only">(current)</span>}
                </Button>
              ))}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: "/profile" })}
                  data-ocid="nav.profile_link"
                  className={[
                    "gap-2 text-sm font-medium",
                    isActive("/profile")
                      ? "text-primary bg-primary/10 hover:bg-primary/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  ].join(" ")}
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  <span className="max-w-[120px] truncate">
                    {userProfile?.displayName ?? "Profile"}
                  </span>
                </Button>
              )}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* ICFC token badge */}
              <a
                href="https://dashboard.internetcomputer.org/canister/ddsp7-7iaaa-aaaaq-aacqq-cai"
                target="_blank"
                rel="noopener noreferrer"
                title="ICFC Token"
                data-ocid="nav.icfc_badge"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-colors duration-200"
              >
                <Zap className="w-3 h-3 text-accent" aria-hidden="true" />
                <span className="text-xs font-mono text-accent font-semibold">
                  ICFC
                </span>
              </a>

              {/* Auth button */}
              <Button
                onClick={handleAuth}
                disabled={disabled}
                data-ocid="nav.auth_button"
                variant={isAuthenticated ? "outline" : "default"}
                size="sm"
                className={
                  !isAuthenticated
                    ? "arcade-glow bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    : ""
                }
              >
                {authLabel}
              </Button>

              {/* Mobile menu */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden touch-target"
                    data-ocid="nav.mobile_menu_toggle"
                    aria-label="Open menu"
                  >
                    <Menu className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-card border-border/40 w-72 p-0"
                >
                  <div className="flex flex-col h-full">
                    {/* Sheet header */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-border/40">
                      <img
                        src="/assets/generated/arcade-cabinet-icon-transparent@128x128.png"
                        alt="PinballHEIR"
                        className="w-8 h-8"
                      />
                      <span className="font-display font-bold text-lg text-foreground">
                        PinballHEIR
                      </span>
                    </div>

                    {/* Sheet nav */}
                    <nav
                      className="flex flex-col gap-1 px-4 py-4 flex-1"
                      aria-label="Mobile navigation"
                    >
                      {NAV_ITEMS.map(({ to, label, icon: Icon, ocid }) => (
                        <Button
                          key={to}
                          variant="ghost"
                          size="sm"
                          onClick={() => navTo(to)}
                          data-ocid={`mobile.${ocid}`}
                          className={[
                            "justify-start gap-3 w-full h-11 text-sm font-medium",
                            isActive(to)
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                          {label}
                        </Button>
                      ))}
                      {isAuthenticated && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navTo("/profile")}
                          data-ocid="mobile.nav.profile_link"
                          className={[
                            "justify-start gap-3 w-full h-11 text-sm font-medium",
                            isActive("/profile")
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                        >
                          <User className="w-4 h-4" aria-hidden="true" />
                          <span className="truncate">
                            {userProfile?.displayName ?? "Profile"}
                          </span>
                        </Button>
                      )}
                    </nav>

                    {/* Sheet footer */}
                    <div className="px-4 py-4 border-t border-border/40">
                      <Button
                        onClick={() => {
                          handleAuth();
                          setSheetOpen(false);
                        }}
                        disabled={disabled}
                        data-ocid="mobile.nav.auth_button"
                        variant={isAuthenticated ? "outline" : "default"}
                        className="w-full"
                      >
                        {authLabel}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 bg-background">
        <Outlet />
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-card border-t border-border/40 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/arcade-cabinet-icon-transparent@128x128.png"
                alt="PinballHEIR"
                className="w-8 h-8 opacity-70"
              />
              <div>
                <p className="font-display font-bold text-sm text-foreground">
                  PinballHEIR
                </p>
                <p className="text-xs text-muted-foreground">
                  DAO-Governed On-Chain Arcade
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <Badge
                variant="outline"
                className="font-mono text-accent border-accent/30 bg-accent/5 gap-1"
              >
                <Zap className="w-3 h-3" aria-hidden="true" />
                ICFC: ddsp7-7iaaa-aaaaq-aacqq-cai
              </Badge>
              <span>© {new Date().getFullYear()}</span>
              <span>
                Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  caffeine.ai
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
