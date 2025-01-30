import { useEffect } from "react";
import { XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router";

export default function PaymentFailed() {
  useEffect(() => {
    localStorage.removeItem("stripe_session_id");
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
        <XCircle className="w-16 h-16 text-destructive" />
        <h1 className="text-2xl font-semibold">Payment Failed</h1>
        <p className="text-muted-foreground">
          Something went wrong with your payment. Please try again.
        </p>
        <Link to="/events">
          <Button variant="link">Back to Events</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
