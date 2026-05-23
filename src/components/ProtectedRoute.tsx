import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ allowedRole }: { allowedRole: "User" }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      < Navigate to="/login" replace />
    );
  }

  if (allowedRole === "User" && user.role !== "User") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
