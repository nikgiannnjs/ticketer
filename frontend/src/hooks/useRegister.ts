import { useMutation } from "react-query";
import { axios } from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { isAxiosError } from "axios";
import { LoginResponse } from "./useLogin";

export type RegisterCredentials = {
  email: string;
  password: string;
};

export function useRegister() {
  const { setSession } = useAuth();

  return useMutation<LoginResponse, Error, RegisterCredentials>(
    async (credentials) => {
      const { data } = await axios.post<LoginResponse>(
        "/users/register",
        credentials
      );
      return data;
    },
    {
      onSuccess: (data) => {
        setSession(data);
        toast.success("Registration successful!");
      },
      onError: (e) => {
        if (isAxiosError(e)) {
          toast.error(e.response?.data.message || "Registration failed");
        }
      },
    }
  );
} 
