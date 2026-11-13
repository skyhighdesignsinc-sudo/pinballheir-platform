import { h as useNavigate, j as jsxRuntimeExports, B as Button } from "./index-Buftnbn6.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-Dd3VnqZc.js";
import { C as CircleX } from "./circle-x-CIy-i3Z6.js";
function PaymentFailure() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "max-w-md w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-16 h-16 text-destructive" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: "Payment Failed" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Your payment could not be processed. Please try again or contact support if the issue persists." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => navigate({ to: "/marketplace" }),
            className: "w-full",
            children: "Try Again"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => navigate({ to: "/" }),
            variant: "outline",
            className: "w-full",
            children: "Return to Arcade"
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  PaymentFailure as default
};
