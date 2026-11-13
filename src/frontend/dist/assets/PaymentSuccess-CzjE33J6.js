import { h as useNavigate, j as jsxRuntimeExports, B as Button } from "./index-Buftnbn6.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-Dd3VnqZc.js";
import { C as CircleCheckBig } from "./circle-check-big-DOLFaKUL.js";
function PaymentSuccess() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "max-w-md w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-16 h-16 text-chart-1" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: "Payment Successful!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Your purchase has been completed successfully. Your items will be available shortly." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => navigate({ to: "/" }), className: "w-full", children: "Return to Arcade" })
    ] })
  ] }) });
}
export {
  PaymentSuccess as default
};
