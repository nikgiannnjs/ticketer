import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router";

export default function PaymentSuccess() {
  useEffect(() => {
    localStorage.removeItem("stripe_session_id");
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h1 className="text-2xl font-semibold">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your tickets have been sent to your
          email.
        </p>
        <Link to="/events">
          <Button variant="link">Back to Events</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
