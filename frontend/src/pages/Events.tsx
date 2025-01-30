import { useEffect, useRef } from "react";
import { useGetEvents } from "@/hooks/useGetEvents";
import { EventCard } from "@/components/EventCard";
import { Spinner } from "@/components/ui/Spinner";

export default function Events() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetEvents();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0,
        rootMargin: "100px",
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner isLoading className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages.map((page) =>
          page.venues.map((event) => <EventCard key={event._id} event={event} />)
        )}
      </div>
      <div
        ref={observerTarget}
        className="flex justify-center items-center py-8"
      >
        {isFetchingNextPage && <Spinner isLoading />}
      </div>
    </div>
  );
} 
