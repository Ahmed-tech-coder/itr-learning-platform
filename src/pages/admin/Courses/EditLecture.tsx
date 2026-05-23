import { useState } from "react";
import { motion } from "framer-motion";
import { Save, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_API = import.meta.env.VITE_BASE_API;

const EditLecture = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { lecture: initialLecture } = location.state || {};

    const [attachment, setAttachment] = useState<File | null>(null);

    const [lecture, setLecture] = useState({
        lectureTitle: initialLecture?.name || "",
        lectureDescription: initialLecture?.description || "",
        status: initialLecture?.state === "Active" ? "active" : "inactive",
        price: initialLecture?.price?.toString() || "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setLecture((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!lecture.lectureTitle.trim()) return "من فضلك أدخل عنوان المحاضرة";
        if (!lecture.price || Number(lecture.price) < 0)
            return "من فضلك أدخل سعرًا صالحًا";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const error = validate();
        if (error) {
            toast.error(error);
            return;
        }

        try {
            const formData = new FormData();

            formData.append("Id", initialLecture?.id || "");
            formData.append("Name", lecture.lectureTitle);
            formData.append("Price", lecture.price);
            formData.append("Description", lecture.lectureDescription);
            formData.append(
                "State",
                lecture.status === "active" ? "Active" : "InActive"
            );
            formData.append("CourseId", String(initialLecture?.courseId));

            if (attachment) {
                formData.append("AttachmentFile", attachment);
            }

            const res = await fetch(`${BASE_API}/Lecture`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("فشل في تعديل المحاضرة");

            toast.success("تم تعديل المحاضرة بنجاح!");
            navigate("/courses");
        } catch (err) {
            toast.error("حدث خطأ أثناء الحفظ");
        }
    };

    return (
        <div className="container-custom section-padding mt-16 lg:mt-0">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl max-w-3xl mx-auto p-8"
            >
                <h1 className="text-3xl font-arabic-bold text-primary mb-10 text-center">
                    تعديل المحاضرة
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block mb-2 font-arabic-medium">
                            اسم المحاضرة
                        </label>
                        <input
                            type="text"
                            name="lectureTitle"
                            value={lecture.lectureTitle}
                            onChange={handleChange}
                            className="input-field w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-arabic-medium">
                            سعر المحاضرة
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={lecture.price}
                            onChange={handleChange}
                            className="input-field w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-arabic-medium">
                            وصف المحاضرة
                        </label>
                        <textarea
                            name="lectureDescription"
                            value={lecture.lectureDescription}
                            onChange={handleChange}
                            className="input-field w-full h-32 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-arabic-medium">
                            الحالة
                        </label>
                        <select
                            name="status"
                            value={lecture.status}
                            onChange={handleChange}
                            className="input-field w-full"
                        >
                            <option value="active">مفعل</option>
                            <option value="inactive">غير مفعل</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-arabic-medium">
                            ملف مرفق
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                            onChange={(e) =>
                                setAttachment(
                                    e.target.files ? e.target.files[0] : null
                                )
                            }
                            className="w-full border border-gray-500 rounded-lg p-2 bg-white/5 text-white"
                        />
                        {attachment && (
                            <p className="mt-2 text-sm text-green-400">
                                تم اختيار: {attachment.name}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center gap-6 pt-4">
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            تحديث المحاضرة
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/lectures")}
                            className="btn-outline flex items-center gap-2"
                        >
                            <XCircle className="w-5 h-5" />
                            إلغاء
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditLecture;