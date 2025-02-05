import { useMutation, useQueryClient } from "react-query";
import {axios} from "@/lib/axios";

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (eventId: string) => axios.delete(`/venues/deleteVenue/${eventId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("events");
      },
    }
  );
}; 
