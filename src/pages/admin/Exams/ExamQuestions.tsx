import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, XCircle, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";

const BASE_API = import.meta.env.VITE_BASE_API;
const BASE_API_Images = import.meta.env.VITE_BASE_IMAGES;

const ExamQuestions = () => {
    const { examId } = useParams<{ examId: string }>();
    const examIdNum = Number(examId);
    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            toast.error("لا يوجد صلاحيات للدخول (token مفقود)");
            return;
        }

        fetch(`${BASE_API}/Question/GetAllExamQuestions?examId=${examIdNum}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("فشل التحميل");
                return res.json();
            })
            .then((data) => {
                const formatted = data.map((q: any) => ({
                    id: q.id,
                    type: q.type.toLowerCase() === "text" ? "text" : "image",
                    content: q.content,
                    options: q.choices.map((c: any) => c.text || "—"),
                    correct: q.choices.find((c: any) => c.isCorrect)?.text || "—",
                }));
                setQuestions(formatted);
            })
            .catch(() => toast.error("فشل تحميل الأسئلة ❌"));
    }, [examIdNum]);

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${BASE_API}/Question?Id=${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("فشل حذف السؤال");

            toast.success("تم حذف السؤال بنجاح");
            setQuestions((prev) => prev.filter((q) => q.id !== id));
        } catch (err) {
            toast.error("فشل حذف السؤال ❌");
        }
    };
    return (
        <div className="container-custom section-padding p-16 mt-16 lg:mt-0">
            {/* Header */}
            <div className="flex justify-between flex-col lg:flex-row items-center mb-6">
                <h1 className="text-3xl font-arabic-bold mb-6 text-white text-right">
                    أسئلة الاختبار
                </h1>
                <Link to={`/exams/${examIdNum}/questions/add-question`}>
                    <Button className="bg-primary text-white flex items-center gap-2 lg:text-xl lg:p-6">
                        <PlusCircle className="w-5 h-5" /> إضافة سؤال
                    </Button>
                </Link>
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card-dark "
            >
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-primary text-white">
                                <th className="p-3">الكود</th>
                                <th className="p-3">المحتوى</th>
                                <th className="p-3">النوع</th>
                                <th className="p-3">الاختيارات</th>
                                <th className="p-3">الإجابة الصحيحة</th>
                                <th className="p-3">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q) => (
                                <tr
                                    key={q.id}
                                    className="border-b border-gray-300 hover:bg-gray-100/10 transition"
                                >
                                    <td className="p-3 font-bold">{q.id}</td>


                                    <td className="p-3">
                                        {q.type === "text" ? (
                                            <span>{q.content}</span>
                                        ) : (
                                            <img
                                                src={`${BASE_API_Images}Images/${q.content}`}
                                                alt="سؤال صورة"
                                                className="max-w-[120px] max-h-[80px] object-contain rounded-md mx-auto"
                                            />
                                        )}
                                    </td>


                                    <td className="p-3">
                                        {q.type === "text" ? "نص" : "صورة"}
                                    </td>

                                    <td className="p-3">
                                        <select
                                            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 text-sm"

                                        >
                                            {q.options.map((opt, i) => (
                                                <option key={i} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    </td>


                                    <td className="p-3 text-green-500 font-bold">{q.correct}</td>

                                    <td className="p-3 flex justify-center gap-2 flex-wrap">
                                        <Link
                                            to={{
                                                pathname: `/exams/${examIdNum}/questions/${q.id}/edit-question`,
                                            }}
                                            state={q} 
                                        >
                                            <Button className="bg-[#FFA500] text-black flex items-center gap-2 hover:text-white">
                                                <Edit className="w-4 h-4" /> تعديل
                                            </Button>
                                        </Link>

                                        <Button
                                            onClick={() => handleDelete(q.id)}
                                            className="bg-[#C30005] text-white flex items-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" /> حذف
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {questions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-6 text-gray-400">
                                        لا يوجد أسئلة حاليا
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {questions.map((q) => (
                        <div
                            key={q.id}
                            className="border border-gray-700 rounded-xl p-4 bg-gray-900 text-white"
                        >
                            <div className="flex justify-between mb-2">
                                <span className="font-bold">{q.id}</span>
                                <span className="text-sm text-gray-400">
                                    {q.type === "text" ? "نص" : "صورة"}
                                </span>
                            </div>


                            {q.type === "text" && (
                                <p className="mb-2 text-gray-200">📖 {q.content}</p>
                            )}


                            <div className="mb-2">
                                <p className="font-bold mb-1">📌 الاختيارات:</p>
                                <select
                                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 text-sm"

                                >
                                    {q.options.map((opt, i) => (
                                        <option key={i} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>



                            <p className="mb-3 text-green-400">✅ الإجابة: {q.correct}</p>

                            <div className="flex flex-wrap gap-2">
                                <Link
                                    to={`/exams/${examIdNum}/questions/${q.id}/edit-question`}
                                    state={q}
                                    className="flex-1"
                                >
                                    <Button className="bg-[#FFA500] text-black w-full hover:text-white">
                                        <Edit className="w-4 h-4 mr-1" /> تعديل
                                    </Button>
                                </Link>

                                <Button
                                    onClick={() => handleDelete(q.id)}
                                    className="bg-[#C30005] text-white flex-1"
                                >
                                    <XCircle className="w-4 h-4 mr-1" /> حذف
                                </Button>
                            </div>
                        </div>
                    ))}
                    {questions.length === 0 && (
                        <p className="text-gray-400 text-center">لا يوجد أسئلة حاليا</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ExamQuestions;
