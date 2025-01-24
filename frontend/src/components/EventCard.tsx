import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Event } from "@/hooks/useGetEvents";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router";

type Props = {
  event: Event;
};

const R2_BUCKET = import.meta.env.VITE_R2_DEV_SUBDOMAIN;

export function EventCard({ event }: Props) {

  const datetime = new Date(event.datetime);
  const remainingTickets = event.capacity - event.ticketsBooked;

  return (
    <Link to={`/event/${event._id}`}>
    <Card className="w-full hover:shadow-lg transition-shadow cursor-pointer" >
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img
          src={`${R2_BUCKET}${event.image}`}
          alt={event.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
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
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {event.description}
        </p>
        <div className="flex justify-between items-center text-sm gap-2 flex-wrap">
          <span>
            {event.city}, {event.country}
          </span>
          <span className={remainingTickets < 10 ? "text-destructive" : "text-muted-foreground"}>
           
            {remainingTickets} / {event.capacity} available seats
          </span>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
