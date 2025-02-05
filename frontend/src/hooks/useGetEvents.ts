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

type GetEventsParams = {
  page?: number;
  limit?: number;
  titleQuery?: string;
  dateSort?: "asc" | "desc" | null;
  priceSort?: "asc" | "desc" | null;
};

export function useGetEvents(params?: GetEventsParams) {
  return useInfiniteQuery<EventsResponse>(
    ["events", params],
    async ({ pageParam = params?.page ?? 1 }) => {
      const { data } = await axios.get<EventsResponse>("/venues/getAllVenues", {
        params: {
          page: pageParam,
          limit: params?.limit ?? 10,
          title: params?.titleQuery,
          sortDate: params?.dateSort,
          sortPrice: params?.priceSort,
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
      keepPreviousData: true,
    },
  );
}
