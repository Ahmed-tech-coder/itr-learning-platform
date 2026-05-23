import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

type DecodedAdmin = {
  id: string;
  userName: string;
  role: string;
  exp?: number;
};

type AdminAuthContextType = {
  admin: DecodedAdmin | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<DecodedAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  const mapClaims = (decoded: any): DecodedAdmin => ({
    id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    userName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"],
    role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    exp: decoded.exp,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("adminToken");
        } else {
          setToken(storedToken);
          setAdmin(mapClaims(decoded));
        }
      } catch {
        localStorage.removeItem("adminToken");
      }
    }
    setLoading(false); // خلصنا فحص التوكن
  }, []);

  const login = (newToken: string) => {
    try {
      const decoded: any = jwtDecode(newToken);
      setToken(newToken);
      setAdmin(mapClaims(decoded));
      localStorage.setItem("adminToken", newToken);
    } catch {
      console.error("Invalid admin token");
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
};
