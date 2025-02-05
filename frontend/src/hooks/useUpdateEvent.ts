import { useMutation, useQueryClient } from "react-query";
import { axios } from "@/lib/axios";
import { CreateEventData } from "./useCreateEvent";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

type UpdateEventData = CreateEventData & {
  id: string;
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<{ message: string }, Error, UpdateEventData>(
    ({ id, ...data }: UpdateEventData) => {
      const localDateTime = new Date(`${data.date}T${data.time}`);
      const utcDateTime = localDateTime.toISOString();
      return axios
        .put(`/venues/updateVenue/${id}`, { ...data, dateTime: utcDateTime })
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        toast.success("Event updated successfully!");
        queryClient.invalidateQueries("events");
        navigate("/events");
      },
      onError: (error) => {
        toast.error(
          error.message || "Something went wrong while updating the event",
        );
      },
    },
  );
};
