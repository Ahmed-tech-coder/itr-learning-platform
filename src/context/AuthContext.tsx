import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: string;
  userName: string;
  email: string;
  role: string;
  exp?: number;
};

type AuthContextType = {
  user: DecodedToken | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  const mapClaims = (decoded: any): DecodedToken => ({
    id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    userName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"],
    email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
    role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    exp: decoded.exp,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }
        setUser(mapClaims(decoded));
      } catch {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      setUser(mapClaims(decoded));
      localStorage.setItem("token", token);
    } catch {
      console.error("Invalid token");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  if (loading) {
    return <div>جاري التحميل...</div>; 
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
