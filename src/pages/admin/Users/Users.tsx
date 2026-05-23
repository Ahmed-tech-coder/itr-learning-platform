import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/context/AdminAuthContext";
import CustomDialog from "@/components/CustomDialog";

const BASE_API = import.meta.env.VITE_BASE_API as string;

type User = {
    id: string;
    userName: string;
    email: string;
    phoneNumber: string;
    dateOfCreation: string;
};

const Users = () => {
    const { admin } = useAdminAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const pageSize = 8;

    // Get Users (client-side pagination)
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_API}/Account/GetAllUsers`, {
                headers: {
                    Authorization: `Bearer ${admin?.token || localStorage.getItem("adminToken")}`,
                },
            });
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            setUsers(data.users || data);
        } catch (err) {
            console.error("Error fetching users:", err);
            toast.error("فشل تحميل المستخدمين");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [admin]);

    // Delete User
    const handleDeleteClick = (id: string) => {
        setSelectedUserId(id);
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        if (!selectedUserId) return;
        try {
            const res = await fetch(`${BASE_API}/Account/DeleteUser?Id=${selectedUserId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${admin?.token || localStorage.getItem("adminToken")}`,
                },
            });

            if (!res.ok) throw new Error("فشل الحذف");

            setUsers((prev) => prev.filter((user) => user.id !== selectedUserId));
            toast.success("تم حذف المستخدم بنجاح");
        } catch (err) {
            console.error(err);
            toast.error("حدث خطأ أثناء الحذف");
        } finally {
            setOpenDialog(false);
            setSelectedUserId(null);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-white text-2xl">جاري تحميل المستخدمين...</div>;
    }

    // حساب users اللي هيظهروا في الصفحة الحالية
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const usersToShow = users.slice(startIndex, endIndex);
    const totalPages = Math.ceil(users.length / pageSize);

    return (
        <div className="container-custom section-padding p-8 mt-16 lg:mt-0">
            <h1 className="text-2xl font-arabic-bold text-white pt-8 mb-6 text-right">المستخدمين</h1>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card-dark max-w-6xl mx-auto"
            >
                {/* Table for Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-primary text-white">
                                <th className="p-3">#</th>
                                <th className="p-3">الاسم</th>
                                <th className="p-3">البريد</th>
                                <th className="p-3">الرقم</th>
                                <th className="p-3">تاريخ التسجيل</th>
                                <th className="p-3">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersToShow.map((user, index) => (
                                <tr key={user.id} className="border-b border-gray-300 hover:bg-gray-100/10 transition">
                                    <td className="p-3">{startIndex + index + 1}</td>
                                    <td className="p-3">{user.userName}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.phoneNumber}</td>
                                    <td className="p-3">{user.dateOfCreation}</td>
                                    <td className="p-3 flex justify-center">
                                        <Button
                                            onClick={() => handleDeleteClick(user.id)}
                                            className="bg-[#C30005] text-white font-bold flex items-center gap-2"
                                        >
                                            <XCircle className="w-5 h-5" /> حذف
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {usersToShow.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-6 text-gray-400">لا يوجد مستخدمين حالياً</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Cards for Mobile */}
                <div className="md:hidden space-y-4">
                    {usersToShow.map((user, index) => (
                        <div key={user.id} className="border border-gray-700 rounded-xl p-4 bg-gray-900 text-white">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-white">#{startIndex + index + 1}</span>
                                <span className="text-sm text-gray-400">{user.dateOfCreation}</span>
                            </div>
                            <p className="mb-1">👤 {user.userName}</p>
                            <p className="mb-1">📧 {user.email}</p>
                            <p className="mb-3">📞 {user.phoneNumber}</p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleDeleteClick(user.id)}
                                    className="bg-[#C30005] text-white font-bold flex items-center gap-2"
                                >
                                    <XCircle className="w-5 h-5" /> حذف
                                </Button>
                            </div>
                        </div>
                    ))}
                    {usersToShow.length === 0 && <p className="text-gray-400 text-center">لا يوجد مستخدمين حالياً</p>}
                </div>
            </motion.div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap max-w-4xl mx-auto">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-full ${page === i + 1 ? "bg-primary text-white" : "bg-white text-primary-dark"}`}
                    >
                        {i + 1}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>

            <CustomDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title="تأكيد حذف المستخدم"
                description="هل أنت متأكد أنك تريد حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه."
                confirmText="حذف"
                cancelText="إلغاء"
                onConfirm={confirmDelete}
                icon={<XCircle className="w-12 h-12 text-red-500" />}
            />
        </div>
    );
};

export default Users;
