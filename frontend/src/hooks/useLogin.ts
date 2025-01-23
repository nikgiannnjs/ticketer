import { useMutation } from "react-query";
import { axios } from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

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
  const navigate = useNavigate();

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
        const decoded = jwtDecode(data.accessToken);

        if (decoded.isSuperAdmin) {
          navigate("/access-requests");
        } else {
          navigate("/create-event");
        }
      },
      onError: (e) => {
        if (isAxiosError(e)) {
          switch (e.response?.data.code) {
            case "A152":
              toast.error("Password or email is incorrect.");
              break;
            case "A154":
              toast.error("Password or email is incorrect.");
              break;
            default:
              toast.error(e.response?.data.message);
              break;
          }
        } 
      },
    }
  );
}
