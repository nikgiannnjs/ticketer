import { useMutation } from "react-query";
import { axios } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { isAxiosError } from "axios";

type RequestAccessData = {
  email: string;
};

export function useRequestAccess() {
  return useMutation<{ message: string }, Error, RequestAccessData>(
    async (data) => {
      const response = await axios.post("/users/requestAccess", data);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success("Access request submitted successfully!");
      },
      onError: (e) => {
        if (isAxiosError(e)) {
          toast.error(e.response?.data.message || "Failed to submit access request");
        }
      },
    }
  );
} 
