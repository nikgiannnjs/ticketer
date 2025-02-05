import { useMutation, UseMutationOptions } from "react-query";
import { axios } from "@/lib/axios";

type RejectAccessResponse = {
  message: string;
};

export function useRejectAccessRequest(
  options?: UseMutationOptions<RejectAccessResponse, Error, string>,
) {
  return useMutation<RejectAccessResponse, Error, string>(async (email) => {
    const { data } = await axios.post<RejectAccessResponse>(
      `/users/rejectRequest`,
      { email },
    );
    return data;
  }, options);
}
