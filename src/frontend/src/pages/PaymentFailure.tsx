import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your payment could not be processed. Please try again or contact
            support if the issue persists.
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => navigate({ to: "/marketplace" })}
              className="w-full"
            >
              Try Again
            </Button>
            <Button
              onClick={() => navigate({ to: "/" })}
              variant="outline"
              className="w-full"
            >
              Return to Arcade
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
