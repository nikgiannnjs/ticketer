import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { LoginResponse } from "@/hooks/useLogin";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  accessToken: string | null;
  setSession: (data: LoginResponse) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const getExpirationDate = (token: string) => {
  const decoded = jwtDecode(token);
  if (!decoded.exp) return null;

  const date = new Date(decoded.exp * 1000);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    setAccessToken(token || null);
  }, []);

  const setSession = (data: LoginResponse) => {
    const accessTokenExp = getExpirationDate(data.accessToken);
    const resetTokenExp = getExpirationDate(data.resetToken);

    if (accessTokenExp) {
      Cookies.set("accessToken", data.accessToken, {
        expires: accessTokenExp,
        secure: true,
        sameSite: "strict",
      });
      setAccessToken(data.accessToken);
    }

    if (resetTokenExp) {
      Cookies.set("resetToken", data.resetToken, {
        expires: resetTokenExp,
        secure: true,
        sameSite: "strict",
      });
    }
  };

  const clearSession = () => {
    Cookies.remove("accessToken");
    Cookies.remove("resetToken");
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
