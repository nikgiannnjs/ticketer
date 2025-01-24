import { useQuery } from "react-query";
import { axios } from "@/lib/axios";
import { Event } from "./useGetEvents";

export function useGetEvent(id?: string) {
  return useQuery<Event>(
    ["event", id],
    async () => {
      if (!id) throw new Error("Event ID is required");
      const { data } = await axios.get<{ venue: Event }>(`/venues/getVenue/${id}`);
      return data.venue;
    },
    {
      enabled: !!id,
    }
  );
} 
