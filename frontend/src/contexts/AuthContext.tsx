import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { LoginResponse } from "@/hooks/useLogin";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  accessToken: string | null;
  setSession: (data: LoginResponse) => void;
  clearSession: () => void;
  isSuperAdmin?: boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | undefined>();
  
  useEffect(() => {
    const initializeAuth = () => {
      const token = Cookies.get("accessToken");
      
      if (token) {
        try {
          const expDate = getExpirationDate(token);
          if (expDate && expDate > new Date()) {
            setAccessToken(token);
            const decoded = jwtDecode(token);
            setIsSuperAdmin(!!decoded.isSuperAdmin);
          } else {
            Cookies.remove("accessToken");
            Cookies.remove("resetToken");
          }
        } catch (error) {
          Cookies.remove("accessToken");
          Cookies.remove("resetToken");
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
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
      const decoded = jwtDecode(data.accessToken);
      setIsSuperAdmin(!!decoded.isSuperAdmin);
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
    setIsSuperAdmin(undefined);
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ accessToken, setSession, clearSession, isSuperAdmin, isLoading }}>
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
