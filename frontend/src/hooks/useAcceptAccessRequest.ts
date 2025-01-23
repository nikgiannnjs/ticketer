import { useMutation, UseMutationOptions } from "react-query";
import { axios } from "@/lib/axios";

type AcceptAccessResponse =  {
  message: string;
}

export function useAcceptAccessRequest(
  options?: UseMutationOptions<AcceptAccessResponse, Error, string>
) {
  return useMutation<AcceptAccessResponse, Error, string>(
    async (email) => {
      const { data } = await axios.post<AcceptAccessResponse>(`/users/acceptRequest`, { email });
      return data;
    },
    options
  );
}
