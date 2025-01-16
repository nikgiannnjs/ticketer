import { useMutation } from "react-query";
import { axios } from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  accessToken: string;
  resetToken: string;
};

export function useLogin() {
  const { setSession } = useAuth();

  return useMutation<LoginResponse, Error, LoginCredentials>(
    async (credentials) => {
      const { data } = await axios.post<LoginResponse>(
        "/users/login",
        credentials
      );
      return data;
    },
    {
      onSuccess: (data) => {
        setSession(data);
      },
    }
  );
}
