import { useMutation, useQueryClient } from "react-query";
import { axios } from "@/lib/axios";
import { CreateEventData } from "./useCreateEvent";

type UpdateEventData = CreateEventData & {
  id: string;
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, ...data }: UpdateEventData) => {
      const localDateTime = new Date(`${data.date}T${data.time}`);
      const utcDateTime = localDateTime.toISOString();
      return axios
        .put(`/venues/updateVenue/${id}`, { ...data, dateTime: utcDateTime })
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("events");
      },
    }
  );
};
