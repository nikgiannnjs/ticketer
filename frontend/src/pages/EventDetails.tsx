import { useParams } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { formatCurrency } from "@/lib/utils";

import { toast } from "react-hot-toast";
import { useGetEvent } from "@/hooks/useGetEvent";


export default function EventDetails() {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { data: event, isLoading: isEventLoading } = useGetEvent(id);

  if (isEventLoading || !event) {
    return <div>Loading...</div>;
  }

  const remainingTickets = event.capacity - event.ticketsBooked;
  const totalPrice = event.price * ticketCount;
  const datetime = new Date(event.datetime);

  const hasRemainingTickets = remainingTickets > 0;

  const handlePurchase = async () => {

    if (!hasRemainingTickets) {
      toast.error("All the tickets are sold out");
      return;
    }

    try {
      setIsLoading(true);
     // TODO: purchase tickets post
     console.log("purchase tickets post");
      toast.success("Tickets purchased successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to purchase tickets");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <Card>
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={`${import.meta.env.VITE_R2_DEV_SUBDOMAIN}${event.image}`}
            alt={event.title}
            className="object-cover w-full h-full"
          />
        </div>
        
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              {datetime.toLocaleDateString()} at{" "}
              {datetime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>{formatCurrency(event.price)}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">About this event</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-muted-foreground">
              {event.address}, {event.city}, {event.country}
            </p>
          </div>
          <h3 className="font-semibold">Purchase Tickets</h3>
            <div className="flex justify-center items-center p-4 border border-muted-foreground rounded-lg">
          <div className="space-y-4 flex-1">
          
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tickets">Number of Tickets</Label>
              <Input
                id="tickets"
                type="number"
                min="1"
                max={remainingTickets}
                value={ticketCount}
                onChange={(e) => setTicketCount(parseInt(e.target.value))}
                required
              />
              <p className="text-sm text-muted-foreground">
                {remainingTickets} tickets available
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                Total: {formatCurrency(totalPrice)}
              </p>
            </div>
          <Button 
            className="w-full" 
            onClick={handlePurchase}
            isLoading={isLoading}
            disabled={!hasRemainingTickets || !email}
          >
            Purchase Tickets
          </Button>
          </div></div>
        </CardContent>

      </Card>
    </div>
  );
}
