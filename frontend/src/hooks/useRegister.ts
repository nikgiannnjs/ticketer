import { useMutation } from "react-query";
import { axios } from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { isAxiosError } from "axios";
import { LoginResponse } from "./useLogin";
import { useNavigate } from "react-router";

export type RegisterCredentials = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  passwordConfirm: string;
};

export function useRegister() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  return useMutation<LoginResponse, Error, RegisterCredentials>(
    async (credentials) => {
      const { data } = await axios.post<LoginResponse>(
        "/users/adminRegister",
        credentials
      );
      return data;
    },
    {
      onSuccess: (data) => {
        setSession(data);
        toast.success("Registration successful!");
        navigate("/create-event");
      },
      onError: (e) => {
        if (isAxiosError(e)) {
          toast.error(e.response?.data.message || "Registration failed");
        }
      },
    }
  );
} 
