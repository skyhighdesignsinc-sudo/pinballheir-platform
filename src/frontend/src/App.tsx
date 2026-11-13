import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { type ReactNode, Suspense, lazy } from "react";
import Layout from "./components/Layout";

// ─── Lazy page imports ────────────────────────────────────────────────────────
const HomePage = lazy(() => import("./pages/HomePage"));
const PlayPage = lazy(() => import("./pages/PlayPage"));
const GovernancePage = lazy(() => import("./pages/GovernancePage"));
const ConstructorPage = lazy(() => import("./pages/ConstructorPage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const MarketplacePage = lazy(() => import("./pages/MarketplacePage"));
const AssetsPage = lazy(() => import("./pages/AssetsPage"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));

// ─── Page wrapper with loading fallback ───────────────────────────────────────
function PageFallback(): ReactNode {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-mono text-sm animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

function withSuspense(Component: React.LazyExoticComponent<() => ReactNode>) {
  return function SuspenseWrapper(): ReactNode {
    return (
      <Suspense fallback={<PageFallback />}>
        <Component />
      </Suspense>
    );
  };
}

// ─── Routes ───────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: withSuspense(HomePage),
});

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/play/$tableId",
  component: withSuspense(PlayPage),
});

const governanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/governance",
  component: withSuspense(GovernancePage),
});

const constructorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/constructor",
  component: withSuspense(ConstructorPage),
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: withSuspense(LeaderboardPage),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: withSuspense(ProfilePage),
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace",
  component: withSuspense(MarketplacePage),
});

const assetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assets",
  component: withSuspense(AssetsPage),
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: withSuspense(PaymentSuccess),
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: withSuspense(PaymentFailure),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  playRoute,
  governanceRoute,
  constructorRoute,
  leaderboardRoute,
  profileRoute,
  marketplaceRoute,
  assetsRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── QueryClient singleton ────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        forcedTheme="dark"
      >
        <RouterProvider router={router} />
        <Toaster richColors position="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
