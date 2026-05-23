import { useState } from "react";
import { motion } from "framer-motion";
import { Save, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

const BASE_API = import.meta.env.VITE_BASE_API;

const AddQuestion = () => {
    const navigate = useNavigate();
    const { examId } = useParams();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("adminToken");
    const [file, setFile] = useState<File | null>(null);
    const [question, setQuestion] = useState({
        type: "text", // text | image
        content: "",
        options: ["", "", "", ""],
        correct: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setQuestion((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...question.options];
        newOptions[index] = value;
        setQuestion((prev) => ({ ...prev, options: newOptions }));
    };

    const validate = () => {
        if (question.type === "text" && !question.content.trim())
            return "أدخل نص السؤال";
        if (question.type === "image" && !file)
            return "من فضلك ارفع صورة للسؤال";
        if (question.options.some((opt) => !opt.trim()))
            return "من فضلك أدخل جميع الاختيارات";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const error = validate();
        if (error) {
            toast.error(error);
            return;
        }

        try {
            if (question.type === "text") {
                // ====== Text Question ======
                const payload = {
                    id: 0,
                    type: "Text",
                    content: question.content,
                    examId: Number(examId),
                    choices: question.options.map((opt, i) => ({
                        id: 0,
                        text: opt,
                        isCorrect: i === question.correct,
                    })),
                };

                const res = await fetch(`${BASE_API}/Question/AddTextQuestion`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) throw new Error("فشل إضافة السؤال");
            } else {
                // ====== Image Question ======
                const formData = new FormData();
                formData.append("Id", "0");
                formData.append("Type", "Image");
                formData.append("Content", "");
                formData.append("ExamId", examId || "0");
                formData.append(
                    "choicesJson",
                    JSON.stringify(
                        question.options.map((opt, i) => ({
                            Id: 0,
                            Text: opt,
                            IsCorrect: i === question.correct,
                        }))
                    )
                );
                if (file) formData.append("ContentImage", file);

                const res = await fetch(`${BASE_API}/Question/AddImageQuestion`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!res.ok) throw new Error("فشل إضافة السؤال");
            }

            toast.success("تم إضافة السؤال بنجاح 🎉");
            navigate(`/exams/${examId}/questions`)
        } catch (err) {
            toast.error((err as Error).message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-custom section-padding mt-16 lg:mt-0">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl max-w-4xl mx-auto p-8"
            >
                <h1 className="text-3xl font-arabic-bold text-primary mb-10 text-center">
                    إضافة سؤال جديد
                </h1>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* نوع السؤال */}
                    <div className="card-dark p-6 rounded-xl shadow-md">
                        <h2 className="font-arabic-bold text-lg mb-4 border-b pb-2">نوع السؤال</h2>
                        <div className="flex gap-6">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="text"
                                    checked={question.type === "text"}
                                    onChange={handleChange}
                                    className="accent-blue-600 w-5 h-5"
                                />
                                <span>نص</span>
                            </label>
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="image"
                                    checked={question.type === "image"}
                                    onChange={handleChange}
                                    className="accent-blue-600 w-5 h-5"
                                />
                                <span>صورة</span>
                            </label>
                        </div>
                    </div>

                    {/* محتوى السؤال */}
                    <div className="card-dark p-6 rounded-xl shadow-md">
                        <h2 className="font-arabic-bold text-lg mb-4 border-b pb-2">محتوى السؤال</h2>
                        {question.type === "text" ? (
                            <input
                                type="text"
                                name="content"
                                value={question.content}
                                onChange={handleChange}
                                className="input-field w-full"
                                placeholder="اكتب نص السؤال هنا"
                            />
                        ) : (
                            <input
                                type="file"
                                name="content"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="input-field w-full"
                            />
                        )}
                    </div>

                    {/* الاختيارات */}
                    <div className="card-dark p-6 rounded-xl shadow-md">
                        <h2 className="font-arabic-bold text-lg mb-4 border-b pb-2">الاختيارات</h2>
                        <div className="space-y-4">
                            {["أ", "ب", "ج", "د"].map((label, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <input
                                        type="radio"
                                        name="correct"
                                        checked={question.correct === i}
                                        onChange={() => setQuestion((prev) => ({ ...prev, correct: i }))}
                                        className="accent-green-600 w-5 h-5"
                                    />
                                    <input
                                        type="text"
                                        value={question.options[i]}
                                        onChange={(e) => handleOptionChange(i, e.target.value)}
                                        className="input-field w-full"
                                        placeholder={`الإجابة ${label}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* الأزرار */}
                    <div className="flex justify-center gap-6 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center gap-2 text-md px-3 py-2 lg:text-lg lg:px-6 lg:py-3 rounded-xl"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" /> حفظ السؤال
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(`/exams/${examId}/questions`)}
                            className="btn-outline flex items-center gap-2 text-md px-3 py-2 lg:text-lg lg:px-6 lg:py-3 rounded-xl"
                        >
                            <XCircle className="w-5 h-5" /> إلغاء
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddQuestion;
