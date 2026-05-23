import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";

const ProtectedAdminRoute = () => {
    const { admin, loading } = useAdminAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
    }

    if (!admin) {
        return <Navigate to="/admin-login" replace />;
    }

    if (!["Admin", "SuperAdmin"].includes(admin.role)) {
        return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
};

export default ProtectedAdminRoute;
