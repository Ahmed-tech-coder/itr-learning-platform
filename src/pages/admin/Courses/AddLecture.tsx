import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, XCircle, Folder } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_API = import.meta.env.VITE_BASE_API;

type DriveFolder = { id: string; name: string };

const QUALITIES = ["240", "360", "480", "720", "1080"];

const AddLecture = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseId } = location.state || {};

    const [folders, setFolders] = useState<DriveFolder[]>([]);
    const [loadingFolders, setLoadingFolders] = useState(false);
    const [attachment, setAttachment] = useState<File | null>(null);


    const [lecture, setLecture] = useState<{
        lectureTitle: string;
        lectureDescription: string;
        status: "active" | "inactive";
        price: string;
        driveFolderId: string;
        driveFolderName: string;
        qualities: string[];
    }>({
        lectureTitle: "",
        lectureDescription: "",
        status: "active",
        price: "",
        driveFolderId: "",
        driveFolderName: "",
        qualities: [],
    });

    // Load folders from API
    useEffect(() => {
        const fetchFolders = async () => {
            try {
                setLoadingFolders(true);
                const res = await fetch(`${BASE_API}/vod/folders`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                });
                const data = await res.json();
                if (data?.data) {
                    setFolders(data.data);
                }
            } catch (err) {
                toast.error("حدث خطأ أثناء تحميل المجلدات");
            } finally {
                setLoadingFolders(false);
            }
        };
        fetchFolders();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setLecture((prev) => ({ ...prev, [name]: value }));
    };

    const toggleQuality = (q: string) => {
        setLecture((prev) => {
            const exists = prev.qualities.includes(q);
            return {
                ...prev,
                qualities: exists ? prev.qualities.filter((x) => x !== q) : [...prev.qualities, q],
            };
        });
    };

    const applySelectedFolder = (folderId: string) => {
        const folder = folders.find((f) => f.id === folderId);
        setLecture((prev) => ({
            ...prev,
            driveFolderId: folder?.id || "",
            driveFolderName: folder?.name || "",
        }));
    };

    const validate = () => {
        if (!lecture.lectureTitle.trim()) return "من فضلك أدخل عنوان المحاضرة";
        if (!courseId) return "لم يتم تمرير الكورس";
        if (!lecture.price || Number(lecture.price) < 0) return "من فضلك أدخل سعرًا صالحًا";
        if (!lecture.driveFolderId.trim()) return "اختَر مجلد Google Drive";
        if (!lecture.qualities.length) return "اختر جودة واحدة على الأقل";
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

            formData.append("Id", "0");
            formData.append("Name", lecture.lectureTitle);
            formData.append("Price", lecture.price);
            formData.append("Description", lecture.lectureDescription);
            formData.append("State", lecture.status === "active" ? "Active" : "InActive");
            formData.append("FolderId", lecture.driveFolderId);
            formData.append("FolderName", lecture.driveFolderName);
            formData.append("CourseId", String(courseId));
            lecture.qualities.forEach((q, i) => {
                formData.append(`Qualities[${i}]`, `${q}P`);
            });

            if (attachment) {
                formData.append("AttachmentFile", attachment);
            }

            const res = await fetch(`${BASE_API}/Lecture`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("فشل في إضافة المحاضرة");

            toast.success("تم إضافة المحاضرة بنجاح!");
            navigate(-1);
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
                className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl max-w-5xl mx-auto p-8"
            >
                <h1 className="text-3xl font-arabic-bold text-primary mb-10 text-center">
                    إضافة محاضرة جديدة
                </h1>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* البيانات الأساسية */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="card-dark p-6 rounded-xl shadow-md">
                            <h2 className="font-arabic-bold text-lg mb-4 border-b pb-2">
                                البيانات الأساسية
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2 font-arabic-medium">اسم المحاضرة</label>
                                    <input
                                        type="text"
                                        name="lectureTitle"
                                        value={lecture.lectureTitle}
                                        onChange={handleChange}
                                        className="input-field w-full"
                                        placeholder="أدخل اسم المحاضرة"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-arabic-medium">سعر المحاضرة</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={lecture.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="input-field w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Google Drive */}
                        <div className="card-dark p-6 rounded-xl shadow-md">
                            <h2 className="font-arabic-bold text-lg mb-4 border-b pb-2">Google Drive</h2>
                            <div>
                                <label className="mb-2 font-arabic-medium flex items-center gap-2">
                                    <Folder className="w-5 h-5" /> اختر المجلد
                                </label>
                                <select
                                    value={lecture.driveFolderId}
                                    onChange={(e) => applySelectedFolder(e.target.value)}
                                    className="input-field w-full"
                                >
                                    <option value="">-- اختر من القائمة --</option>
                                    {loadingFolders ? (
                                        <option>جاري التحميل...</option>
                                    ) : (
                                        folders.map((f) => (
                                            <option key={f.id} value={f.id}>
                                                {f.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* الوصف */}
                    <div className="card-dark p-6 rounded-xl shadow-md">
                        <h2 className="font-arabic-bold text-lg mb-4 border-b pb-2">وصف المحاضرة</h2>
                        <textarea
                            name="lectureDescription"
                            value={lecture.lectureDescription}
                            onChange={handleChange}
                            className="input-field w-full h-32 resize-none"
                            placeholder="أدخل وصفًا للمحاضرة"
                        />
                    </div>

                    {/* الجودة والحالة */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="card-dark p-6 rounded-xl shadow-md">
                            <h2 className="font-arabic-bold text-lg mb-4 border-b pb-2">جودة الفيديو</h2>
                            <div className="flex flex-wrap gap-4">
                                {QUALITIES.map((q) => (
                                    <label key={q} className="inline-flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-lg">
                                        <input
                                            type="checkbox"
                                            checked={lecture.qualities.includes(q)}
                                            onChange={() => toggleQuality(q)}
                                            className="accent-primary"
                                        />
                                        <span>{q}p</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="card-dark p-6 rounded-xl shadow-md">
                            <h2 className="font-arabic-bold text-lg mb-4 border-b pb-2">الحالة</h2>
                            <div className="flex gap-6">
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="active"
                                        checked={lecture.status === "active"}
                                        onChange={handleChange}
                                        className="accent-green-600 w-5 h-5"
                                    />
                                    <span className="text-xl font-bold text-green-600">مفعل</span>
                                </label>
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="inactive"
                                        checked={lecture.status === "inactive"}
                                        onChange={handleChange}
                                        className="accent-red-600 w-5 h-5"
                                    />
                                    <span className="text-xl font-bold text-red-600">غير مفعل</span>
                                </label>
                            </div>
                        </div>


                    </div>
                    {/* المرفق */}
                    <div className="card-dark p-6 rounded-xl shadow-md w-full">
                        <h2 className="font-arabic-bold text-lg mb-4 border-b pb-2">ملف مرفق</h2>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                            onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                            className="w-full border border-gray-500 rounded-lg p-2 bg-white/5 text-white"
                        />
                        {attachment && (
                            <p className="mt-2 text-sm text-green-400">تم اختيار: {attachment.name}</p>
                        )}
                    </div>

                    {/* الأزرار */}
                    <div className="flex justify-center gap-6 pt-4">
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2 text-md px-3 py-2 lg:px-6 lg:py-3 rounded-xl"
                        >
                            <Save className="w-5 h-5" /> حفظ المحاضرة
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/lectures")}
                            className="btn-outline flex items-center gap-2 text-md px-3 py-2 lg:px-6 lg:py-3 rounded-xl"
                        >
                            <XCircle className="w-5 h-5" /> إلغاء
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddLecture;
