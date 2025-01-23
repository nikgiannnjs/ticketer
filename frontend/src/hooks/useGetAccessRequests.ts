import { useQuery } from "react-query";
import { axios } from "@/lib/axios";

type AccessRequestsResponse = {
  accessRequests: {
    createdAt: string;
    email: string;
    status: string;
    updatedAt: string;
  }[];
};

export function useGetAccessRequests() {
  return useQuery<AccessRequestsResponse["accessRequests"]>(
    "accessRequests",
    async () => {
      const { data } = await axios.get<AccessRequestsResponse>(
        "/users/getAccessRequests"
      );

    return data.accessRequests;
  });
}
