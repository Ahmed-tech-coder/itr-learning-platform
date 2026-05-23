import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2, Clock, X, User, Phone, Calendar, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const BASE_API = import.meta.env.VITE_BASE_API;
const BASE_API_IMAGES = import.meta.env.VITE_BASE_IMAGES;

interface UserCourse {
    userId: string;
    userName: string;
    phoneNumber: string;
    courseId: number;
    courseName: string;
    startTime: string;
    endTime: string;
    courseState: string;
    courseType: string;
    coursePrice: number;
    courseDescription: string;
    courseImageUrl: string;
}

function CourseDetails() {
    const { id } = useParams();
    const [users, setUsers] = useState<UserCourse[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const usersPerPage = 5;

    // modal state
    const [selectedUser, setSelectedUser] = useState<UserCourse | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const courseInfo = users.length > 0 ? users[0] : null;

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                toast.error("لا يوجد صلاحيات (token مفقود)");
                return;
            }

            const res = await fetch(
                `${BASE_API}/UserCourse/GetAllUsersForCourse?CourseId=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!res.ok) throw new Error("فشل في جلب المستخدمين");

            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            toast.error("خطأ أثناء جلب المستخدمين");
        } finally {
            loading && setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchUsers();
    }, [id]);

    // تعديل المدة
    const handleUpdateDuration = async () => {
        if (!selectedUser) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${BASE_API}/UserCourse/UpdateUserCourse`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: selectedUser.userId,
                    courseId: selectedUser.courseId,
                    startTime: startDate,
                    endTime: endDate,
                }),
            });

            if (!res.ok) throw new Error("فشل في تعديل المدة");

            toast.success("تم تعديل المدة بنجاح");
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error("خطأ أثناء تعديل المدة");
        }
    };

    // Delete user from course
    const handleDeleteUser = async (user: UserCourse) => {
        if (!confirm(`هل أنت متأكد من حذف ${user.userName} من الكورس؟`)) return;

        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${BASE_API}/UserCourse/DeleteUserCourse`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user.userId,
                    courseId: user.courseId,
                }),
            });

            if (!res.ok) throw new Error("فشل في حذف المستخدم");

            toast.success("تم حذف المستخدم من الكورس");
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error("خطأ أثناء حذف المستخدم");
        }
    };

    // Pagination logic
    const indexOfLastUser = page * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <div className="container-custom section-padding p-8 mt-16 lg:mt-0" dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-arabic-bold text-white text-right">
                    تفاصيل الكورس (المسجلين)
                </h1>
                <Link to="/courses">
                    <Button className="bg-primary text-white">رجوع للكورسات</Button>
                </Link>
            </div>

            {/* Course Info Header */}
            {courseInfo && (
                <div className="relative w-full overflow-hidden mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="card-dark max-w-6xl mx-auto"
                    >
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
                            <img
                                src={`${BASE_API_IMAGES}/Images/${courseInfo.courseImageUrl}`}
                                alt={courseInfo.courseName}
                                className="w-24 h-24 object-cover rounded-lg border border-gray-600"
                            />
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    {courseInfo.courseName}
                                </h2>
                                <p className="text-gray-300 text-sm line-clamp-2">
                                    {courseInfo.courseDescription}
                                </p>
                                <p className="text-yellow-400 mt-2 font-bold">
                                    السعر: {courseInfo.coursePrice} جنيه
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
            >
                {loading ? (
                    <div className="card-dark p-6">
                        <p className="text-center text-gray-400">جار التحميل...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="card-dark p-6 text-center text-gray-400">
                        لا يوجد مستخدمين مسجلين في هذا الكورس حالياً.
                    </div>
                ) : (
                    <>
                        {/* 1. عرض الجدول (شاشات الكمبيوتر والتابلت الكبيرة فقط) */}
                        <div className="hidden md:block card-dark overflow-x-auto">
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr className="bg-primary text-white">
                                        <th className="p-3">#</th>
                                        <th className="p-3">الاسم</th>
                                        <th className="p-3">الرقم</th>
                                        <th className="p-3">تاريخ البداية</th>
                                        <th className="p-3">تاريخ النهاية</th>
                                        <th className="p-3">الحالة</th>
                                        <th className="p-3">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user, index) => (
                                        <tr
                                            key={user.userId}
                                            className="border-b border-gray-700/50 hover:bg-white/5 transition"
                                        >
                                            <td className="p-3 text-gray-400">{indexOfFirstUser + index + 1}</td>
                                            <td className="p-3 text-white font-medium">{user.userName}</td>
                                            <td className="p-3 text-gray-300" dir="ltr">{user.phoneNumber}</td>
                                            <td className="p-3 text-gray-300">
                                                {new Date(user.startTime).toLocaleDateString("ar-EG")}
                                            </td>
                                            <td className="p-3 text-gray-300">
                                                {new Date(user.endTime).toLocaleDateString("ar-EG")}
                                            </td>
                                            <td className="p-3">
                                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-yellow-400">
                                                    {user.courseState}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setStartDate(user.startTime.slice(0, 10));
                                                            setEndDate(user.endTime.slice(0, 10));
                                                        }}
                                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 h-auto text-xs rounded-lg"
                                                    >
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>تعديل المدة</span>
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 h-auto text-xs rounded-lg"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        <span>حذف</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 2. عرض الكروت الاحترافية (للموبايل فقط) */}
                        <div className="block md:hidden space-y-4">
                            {currentUsers.map((user, index) => (
                                <div 
                                    key={user.userId} 
                                    className="card-dark p-5 border border-gray-700/40 rounded-xl relative overflow-hidden"
                                >
                                    {/* الرقم التعريفي للكارت كـ Badge علوي */}
                                    <div className="absolute top-0 left-0 bg-primary/20 text-primary px-3 py-1 text-xs rounded-bl-xl font-bold">
                                        # {indexOfFirstUser + index + 1}
                                    </div>

                                    {/* اسم المستخدم */}
                                    <div className="flex items-center gap-2.5 mb-3 mt-1">
                                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">اسم المشترك</p>
                                            <h3 className="text-base font-bold text-white">{user.userName}</h3>
                                        </div>
                                    </div>

                                    <hr className="border-gray-700/50 my-3" />

                                    {/* تفاصيل البيانات الشخصية والاشتراك */}
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mb-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> رقم الهاتف
                                            </span>
                                            <span className="text-gray-200 font-mono text-xs" dir="ltr">{user.phoneNumber}</span>
                                        </div>
                                        
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Info className="h-3 w-3" /> حالة الاشتراك
                                            </span>
                                            <span className="text-yellow-400 text-xs font-medium">{user.courseState}</span>
                                        </div>

                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> تاريخ البداية
                                            </span>
                                            <span className="text-gray-300 text-xs">
                                                {new Date(user.startTime).toLocaleDateString("ar-EG")}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> تاريخ النهاية
                                            </span>
                                            <span className="text-gray-300 text-xs">
                                                {new Date(user.endTime).toLocaleDateString("ar-EG")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* أزرار التحكم والعمليات */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700/30">
                                        <Button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setStartDate(user.startTime.slice(0, 10));
                                                setEndDate(user.endTime.slice(0, 10));
                                            }}
                                            className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 flex items-center justify-center gap-2 py-2 h-auto rounded-lg transition-all"
                                        >
                                            <Clock className="h-4 w-4" />
                                            <span className="text-xs font-bold">تعديل المدة</span>
                                        </Button>
                                        
                                        <Button
                                            onClick={() => handleDeleteUser(user)}
                                            className="w-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 flex items-center justify-center gap-2 py-2 h-auto rounded-lg transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="text-xs font-bold">حذف المشترك</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 flex-wrap max-w-full overflow-hidden" dir="ltr">
                    <Button
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
                            className={`w-10 h-10 rounded-full ${page === i + 1
                                ? "bg-primary text-white"
                                : "bg-white text-primary-dark"
                                }`}
                        >
                            {i + 1}
                        </Button>
                    ))}

                    <Button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Modal لتعديل المدة */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">تعديل مدة الاشتراك</h2>
                            <button onClick={() => setSelectedUser(null)} className="p-1 hover:bg-gray-100 rounded-full transition">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    تاريخ البداية
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-black focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    تاريخ النهاية
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-black focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                onClick={() => setSelectedUser(null)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                            >
                                إلغاء
                            </Button>
                            <Button
                                onClick={handleUpdateDuration}
                                className="bg-primary text-white"
                            >
                                حفظ التعديلات
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseDetails;