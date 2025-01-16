import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function Events() {
  const dummyEvents = [
    {
      id: 1,
      title: "Summer Music Festival",
      date: "2024-07-15",
      location: "Central Park",
    },
    {
      id: 2,
      title: "Tech Conference 2024",
      date: "2024-08-20",
      location: "Convention Center",
    },
    {
      id: 3,
      title: "Food & Wine Expo",
      date: "2024-09-10",
      location: "City Hall",
    },
  ];

  return (
    <div className="w-full max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold">Upcoming Events</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dummyEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle className="text-xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Date: {event.date}
                <br />
                Location: {event.location}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
