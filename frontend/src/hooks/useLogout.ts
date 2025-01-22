import { useMutation } from "react-query";
import { axios } from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

export function useLogout() {
  const { clearSession } = useAuth();
  const navigate = useNavigate();

  return useMutation(
    async () => {
      const { data } = await axios.post("/users/logout");
      return data;
    },
    {
      onSuccess: () => {
        clearSession();
        navigate("/login");
        toast.success("Logged out successfully");
      },
      onError: () => {
        toast.error("Failed to logout");
      },
    }
  );
}
