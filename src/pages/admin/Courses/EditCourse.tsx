import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Save, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const BASE_API = import.meta.env.VITE_BASE_API;

const EditCourse = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const location = useLocation();
    const courseData = location.state?.course;

    const [course, setCourse] = useState({
        id: 0,
        name: "",
        description: "",
        price: "",
        state: "Active",
        type: "Paid",
        image: null as File | null,
    });


    useEffect(() => {
        if (courseData) {
            setCourse({
                id: courseData.id,
                name: courseData.name,
                description: courseData.description,
                price: courseData.price || "",
                state: courseData.state,
                type: courseData.type,
                image: null,
            });
        }
    }, [courseData]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleFileChange = (e: any) => {
        const { name, files } = e.target;
        setCourse({ ...course, [name]: files[0] });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("Id", course.id.toString());
            formData.append("Name", course.name);
            formData.append("Description", course.description);
            formData.append("State", course.state);
            formData.append("Type", course.type);
            formData.append("ImageUrl", courseData.imageUrl || "");
            if (course.image) {
                formData.append("Image", course.image);
            }
            if (course.type === "Paid") {
                formData.append("Price", course.price.toString());
            }


            const res = await fetch(`${BASE_API}/Course`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("فشل تعديل الكورس");

            toast.success("تم تعديل الكورس بنجاح!");
            navigate("/courses");
        } catch (err) {
            console.error(err);
            toast.error("حدث خطأ أثناء التعديل");
        }
    };

    return (
        <div className="container-custom section-padding mt-16 lg:mt-0">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card-dark max-w-4xl mx-auto"
            >
                <h1 className="text-2xl font-arabic-bold text-primary mb-6 text-center">
                    تعديل الكورس
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* اسم الكورس */}
                    <div>
                        <label className="block mb-2 font-arabic-medium">اسم الكورس</label>
                        <input
                            type="text"
                            name="name"
                            value={course.name}
                            onChange={handleChange}
                            className="input-field w-full"
                            required
                        />
                    </div>

                    {/* الوصف */}
                    <div>
                        <label className="block mb-2 font-arabic-medium">الوصف</label>
                        <textarea
                            name="description"
                            value={course.description}
                            onChange={handleChange}
                            className="input-field w-full h-32 resize-none"
                            required
                        />
                    </div>

                    <div className="flex justify-around flex-col lg:flex-row gap-6">
                        {/* الحالة */}
                        <div>
                            <label className="block mb-2 font-arabic-medium">الحالة</label>
                            <div className="flex gap-6">
                                {["Active", "InActive"].map((s) => (
                                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="state"
                                            value={s}
                                            checked={course.state === s}
                                            onChange={handleChange}
                                            className="peer hidden"
                                        />
                                        <span className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center 
                        peer-checked:border-primary peer-checked:bg-primary transition">
                                            <span className="w-2.5 h-2.5 rounded-full bg-white scale-0 peer-checked:scale-100 transition-transform"></span>
                                        </span>
                                        <span className="peer-checked:text-primary-light font-bold">{s === "Active" ? "مفعل" : "غير مفعل"}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* النوع */}
                        <div>
                            <label className="block mb-2 font-arabic-medium">النوع</label>
                            <div className="flex gap-6">
                                {["Free", "Paid"].map((t) => (
                                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={t}
                                            checked={course.type === t}
                                            onChange={handleChange}
                                            className="peer hidden"
                                        />
                                        <span className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center 
                        peer-checked:border-primary peer-checked:bg-primary transition">
                                            <span className="w-2.5 h-2.5 rounded-full bg-white scale-0 peer-checked:scale-100 transition-transform"></span>
                                        </span>
                                        <span className="peer-checked:text-primary-light font-bold">{t === "Free" ? "مجاني" : "مدفوع"}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {course.type === "Paid" && (
                        <div>
                            <label className="block mb-2 font-arabic-medium">السعر</label>
                            <input
                                type="text"
                                name="price"
                                value={course.price}
                                onChange={handleChange}
                                className="input-field w-full"
                                required
                            />
                        </div>
                    )}

                    {/* صورة */}
                    <div>
                        <label className="block mb-2 font-arabic-medium">صورة الكورس</label>
                        <input
                            type="file"
                            accept="image/*"
                            name="image"
                            onChange={handleFileChange}
                            className="hidden"
                            id="imageUpload"
                        />
                        <label htmlFor="imageUpload" className="btn-outline cursor-pointer flex items-center gap-2 w-full">
                            <Upload className="w-5 h-5" /> اختر صورة
                        </label>
                        {course.image && <p className="text-sm text-primary mt-2">{course.image.name}</p>}
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                        <button type="submit" className="btn-primary flex items-center gap-2">
                            <Save className="w-5 h-5" /> حفظ التعديلات
                        </button>
                        <button type="button" onClick={() => navigate("/courses")} className="btn-outline flex items-center gap-2">
                            <XCircle className="w-5 h-5" /> إلغاء
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditCourse;
