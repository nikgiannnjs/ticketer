import { useCallback, useEffect, useRef, useState } from "react";
import { useGetEvents } from "@/hooks/useGetEvents";
import { EventCard } from "@/components/EventCard";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pill } from "@/components/ui/Pill";
import debounce from "lodash/debounce";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CalendarDays,
  Euro,
} from "lucide-react";

type SortDirection = "asc" | "desc" | undefined;

const toggleSortDirection = (direction: SortDirection): SortDirection => {
  switch (direction) {
    case "asc":
      return "desc";
    case "desc":
      return undefined;
    case undefined:
      return "asc";
    default:
      return undefined;
  }
};


export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateSortDirection, setDateSortDirection] = useState<SortDirection>();
  const [priceSortDirection, setPriceSortDirection] = useState<SortDirection>();

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetEvents({
      titleQuery: searchQuery,
      dateSort: dateSortDirection,
      priceSort: priceSortDirection,
    });

  const observerTarget = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleDateSort = () => {
    setDateSortDirection((prev) => toggleSortDirection(prev));
  };

  const handlePriceSort = () => {
    setPriceSortDirection((prev) => toggleSortDirection(prev));
  };

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

  const DateIcon =
    dateSortDirection === "asc" ? ArrowUpNarrowWide : ArrowDownNarrowWide;
  const PriceIcon =
    priceSortDirection === "asc" ? ArrowUpNarrowWide : ArrowDownNarrowWide;

  const hasEvents = data?.pages.some((page) => page.venues.length > 0);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Events</h1>
      <div className="w-full flex justify-between items-center mb-8 gap-4">
        <SearchInput
          placeholder="Search events..."
          onChange={(value) => setSearchQuery(value)}
          value={searchQuery}
          className="max-w-xl"
        />
        <div className="flex gap-4">
          <Pill
            onClick={handleDateSort}
            className="cursor-pointer gap-2 py-1"
            variant="outline"
          >
            <CalendarDays className="w-4 h-4" />
            {dateSortDirection && <DateIcon className="w-4 h-4" />}
            Date
          </Pill>
          <Pill
            onClick={handlePriceSort}
            className="cursor-pointer gap-2 py-1"
            variant="outline"
          >
            <Euro className="w-4 h-4" />
            {priceSortDirection && <PriceIcon className="w-4 h-4" />}
            Price
          </Pill>
        </div>
      </div>
      {!hasEvents ? (
        <div className="flex justify-center items-center min-h-[200px] text-2xl text-gray-500">
          No events found
          ¯\_(ツ)_/¯
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.pages.map((page) =>
            page.venues.map((event) => (
              <EventCard key={event._id} event={event} />
            ))
          )}
        </div>
      )}
      <div ref={observerTarget} className="flex justify-center items-center py-8">
        {isFetchingNextPage && <Spinner isLoading />}
      </div>
    </div>
  );
}
