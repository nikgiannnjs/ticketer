import { useInfiniteQuery } from "react-query";
import { axios } from "@/lib/axios";

export type Event = {
  _id: string;
  title: string;
  description: string;
  country: string;
  city: string;
  address: string;
  datetime: string;
  price: number;
  capacity: number;
  ticketsBooked: number;
  image: string;
};

type EventsResponse = {
  venues: Event[];
  totalPages: number;
};

export function useGetEvents(limit: number = 10) {
  return useInfiniteQuery<EventsResponse>(
    "events",
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get<EventsResponse>("/venues/getAllVenues", {
        params: {
          page: pageParam,
          limit,
        },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length < lastPage.totalPages) {
          return pages.length + 1;
        }
        return undefined;
      },
    }
  );
} 
