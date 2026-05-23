import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Edit, XCircle, PlusCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const BASE_API = import.meta.env.VITE_BASE_API;

const Exams = () => {
    const [exams, setExams] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            toast.error("لا يوجد صلاحيات للدخول (token مفقود)");
            return;
        }

        fetch(`${BASE_API}/Exam/GetAll`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("فشل في تحميل البيانات");
                }
                return res.json();
            })
            .then((data) => {
                setExams(data);
                setTotalPages(Math.ceil(data.length / perPage));
            })
            .catch(() => toast.error("فشل تحميل الاختبارات "));
    }, [perPage]);

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            toast.error("لا يوجد صلاحيات للدخول (token مفقود)");
            return;
        }
        try {
            const res = await fetch(`${BASE_API}/Exam?Id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("تم حذف الاختبار ");
                setExams((prev) => prev.filter((exam) => exam.id !== id));
                setTotalPages(Math.ceil((exams.length - 1) / perPage));
            } else {
                toast.error("فشل حذف الاختبار ❌");
            }
        } catch {
            toast.error("خطأ في الاتصال بالخادم ❌");
        }
    };

    // Slice exams for pagination
    const displayedExams = exams.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="container-custom section-padding p-16 mt-16 lg:mt-0">
            {/* Header */}
            <div className="flex justify-between flex-col lg:flex-row items-center mb-6">
                <h1 className="text-3xl font-arabic-bold mb-6 text-white text-right">الاختبارات</h1>
                <Link to="/exams/add-exam">
                    <Button className="bg-primary text-white flex items-center gap-2 lg:text-xl lg:p-6">
                        <PlusCircle className="w-5 h-5" /> إضافة اختبار
                    </Button>
                </Link>
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card-dark max-w-7xl mx-auto w-full"
            >
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-primary text-white">
                                <th className="p-3">الكود</th>
                                <th className="p-3">العنوان</th>
                                <th className="p-3">الكورس</th>

                                <th className="p-3">الدرجة لكل سؤال</th>
                                <th className="p-3">المدة (دقائق)</th>
                                <th className="p-3">الحالة</th>
                                <th className="p-3">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedExams.map((exam) => (
                                <tr key={exam.id} className="border-b border-gray-300 hover:bg-gray-100/10 transition">
                                    <td className="p-3">{exam.id}</td>
                                    <td className="p-3">
                                        <Button
                                            className="btn-outline hover:bg-transparent hover:border hover:border-[red]"
                                            onClick={() => navigate(`/exams/${exam.id}/questions`, { state: exam.id })}
                                        >
                                            {exam.title}
                                        </Button>
                                    </td>
                                    <td className="p-3">{exam.courseName}</td>

                                    <td className="p-3">{exam.questionDegree}</td>
                                    <td className="p-3">{exam.duration}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${exam.state === "Active" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                                                }`}
                                        >
                                            {exam.state === "Active" ? "مفعل" : "غير مفعل"}
                                        </span>
                                    </td>
                                    <td className="p-3 flex justify-center gap-2">
                                        <Button
                                            onClick={() => navigate(`/exams/${exam.id}/exam-details`)}
                                            className="bg-blue-600 text-white flex items-center justify-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" /> عرض
                                        </Button>
                                        <Button
                                            onClick={() => navigate(`/exams/${exam.id}/questions/add-question`)}
                                            className="bg-green-600 text-white flex items-center justify-center gap-2"
                                        >
                                            <PlusCircle className="w-4 h-4" /> + سؤال
                                        </Button>
                                        <Button
                                            className="bg-[#FFA500] text-black hover:text-white flex items-center justify-center gap-2"
                                            onClick={() => navigate(`/exams/${exam.id}/edit-exam`, { state: exam })}
                                        >
                                            <Edit className="w-5 h-5" /> تعديل
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(exam.id)}
                                            className="bg-[#C30005] text-white flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-5 h-5" /> حذف
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {exams.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-6 text-gray-400">
                                        لا يوجد اختبارات حاليا
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Cards for Mobile */}
                <div className="md:hidden space-y-4 px-0">
                    {displayedExams.map((exam) => (
                        <div key={exam.id} className="border border-gray-700 rounded-xl p-4 bg-gray-900 text-white">
                            <div className="flex justify-between mb-2">
                                <Button
                                    className="btn-outline hover:bg-transparent hover:border hover:border-[red]"
                                    onClick={() => navigate(`/exams/${exam.id}/questions`, { state: exam.id })}
                                >
                                    {exam.title}
                                </Button>

                            </div>
                            <p className={`px-2 py-2 text-center m-2 rounded-full text-xs ${exam.state === "Active" ? "bg-green-600" : "bg-red-600"
                                }`}>

                                {exam.state === "Active" ? "مفعل" : "غير مفعل"}</p>
                            <p className="mb-1">🏷️ الكود: {exam.id}</p>
                            <p className="mb-1">📚 الكورس: {exam.courseName}</p>
                            <p className="mb-1">🔢 كود الكورس: {exam.courseId}</p>
                            <p className="mb-1">📝 الدرجة لكل سؤال: {exam.questionDegree}</p>
                            <p className="mb-1">⏳ المدة: {exam.duration} دقيقة</p>

                            <div className="flex flex-wrap gap-2 mt-3">
                                <Button
                                    onClick={() => navigate(`/exams/${exam.id}/exam-details`, { state: exam.id })}
                                    className="bg-blue-600 text-white flex-1"
                                >
                                    <Eye className="w-4 h-4 mr-1" /> عرض
                                </Button>
                                <Button
                                    onClick={() => navigate(`/exams/${exam.id}/questions/add-question`)}
                                    className="bg-green-600 text-white flex-1"
                                >
                                    <PlusCircle className="w-4 h-4 mr-1" /> + سؤال
                                </Button>
                                <Button
                                    onClick={() => navigate(`/exams/${exam.id}/edit-exam`, { state: exam })}
                                    className="bg-[#FFA500] text-black hover:text-white flex-1"
                                >
                                    <Edit className="w-4 h-4 mr-1" /> تعديل
                                </Button>
                                <Button onClick={() => handleDelete(exam.id)} className="bg-[#C30005] text-white flex-1">
                                    <XCircle className="w-4 h-4 mr-1" /> حذف
                                </Button>
                            </div>
                        </div>
                    ))}
                    {exams.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-24"
                        >
                            <AlertCircle className="w-16 h-16 text-primary mb-6" />
                            <h3 className="text-2xl lg:text-4xl font-arabic-bold text-white mb-4">
                                لا توجد اختبارات متاحة حاليًا
                            </h3>
                            <p className="text-gray-300 text-lg text-center max-w-md">
                                سيتم إضافة اختبارات قريبًا، يرجى المحاولة لاحقًا.
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <Button
                            variant="outline"
                            size="icon"
                            className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
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
                            className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Exams;
