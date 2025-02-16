import { useMutation, useQueryClient } from "react-query";
import { axios } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

export type CreateEventData = {
  title: string;
  description: string;
  country: string;
  city: string;
  address: string;
  date: string;
  time: string;
  price: string;
  capacity: string;
  image: string;
};

export function useCreateEvent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, CreateEventData>(
    async (eventData) => {
      // Convert local date and time to UTC ISO string
      const localDateTime = new Date(`${eventData.date}T${eventData.time}`);
      const utcDateTime = localDateTime.toISOString();

      const { data } = await axios.post(`/venues/createNewVenue`, {
        ...eventData,
        dateTime: utcDateTime,
      });
      return data;
    },
    {
      onSuccess: () => {
        toast.success("Event created successfully!");
        queryClient.invalidateQueries("events");
        navigate("/events");
      },
      onError: (error) => {
        toast.error(
          error.message || "Something went wrong while creating the event",
        );
      },
    },
  );
}
