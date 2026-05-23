import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Save, XCircle } from "lucide-react";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

const BASE_API = import.meta.env.VITE_BASE_API;


const AddCourse = () => {
    const navigate = useNavigate();
    const [course, setCourse] = useState({
        title: "",
        description: "",
        price: "",
        status: "active",
        type: "paid",
        image: null,
        video: null,
    });

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
            formData.append("Name", course.title);
            formData.append("Description", course.description);
            formData.append("State", course.status === "active" ? "Active" : "InActive");
            formData.append("Type", course.type === "paid" ? "Paid" : "Free");

            if (course.type === "paid") {
                formData.append("Price", course.price);
            }

            if (course.image) {
                formData.append("Image", course.image);
            }


            const response = await fetch(`${BASE_API}/Course`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("فشل في إضافة الكورس");
            }

            toast.success("✅ تم إضافة الكورس بنجاح!");
            navigate("/courses");
        } catch (error: any) {
            console.error(error);
            toast.error("❌ حصل خطأ أثناء إضافة الكورس");
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
                    إضافة كورس جديد
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* اسم الكورس */}
                    <div>
                        <label className="block mb-2 font-arabic-medium">اسم الكورس</label>
                        <input
                            type="text"
                            name="title"
                            value={course.title}
                            onChange={handleChange}
                            placeholder="أدخل اسم الكورس"
                            className="input-field w-full"
                            required
                        />
                    </div>

                    {/* وصف الكورس */}
                    <div>
                        <label className="block mb-2 font-arabic-medium">الوصف</label>
                        <textarea
                            name="description"
                            value={course.description}
                            onChange={handleChange}
                            placeholder="أدخل وصفاً موجزاً للكورس"
                            className="input-field w-full h-32 resize-none"
                            required
                        />
                    </div>

                    <div className="flex justify-around flex-col lg:flex-row gap-6">
                        {/* Status */}
                        <div>
                            <label className="block mb-2 font-arabic-medium">الحالة</label>
                            <div className="flex gap-6">
                                {[
                                    { value: "active", label: "مفعل" },
                                    { value: "inactive", label: "غير مفعل" },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-2 cursor-pointer select-none"
                                    >
                                        <input
                                            type="radio"
                                            name="status"
                                            value={option.value}
                                            checked={course.status === option.value}
                                            onChange={handleChange}
                                            className="peer hidden"
                                        />
                                        <span
                                            className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center 
                     peer-checked:border-primary peer-checked:bg-primary transition"
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full bg-white scale-0 peer-checked:scale-100 transition-transform"></span>
                                        </span>
                                        <span className="peer-checked:text-primary-light font-bold transition">
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block mb-2 font-arabic-medium">النوع</label>
                            <div className="flex gap-6">
                                {[
                                    { value: "free", label: "مجاني" },
                                    { value: "paid", label: "مدفوع" },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-2 cursor-pointer select-none"
                                    >
                                        <input
                                            type="radio"
                                            name="type"
                                            value={option.value}
                                            checked={course.type === option.value}
                                            onChange={handleChange}
                                            className="peer hidden"
                                        />
                                        <span
                                            className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center 
                     peer-checked:border-primary peer-checked:bg-primary transition"
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full bg-white scale-0 peer-checked:scale-100 transition-transform"></span>
                                        </span>
                                        <span className="peer-checked:text-primary-light font-bold transition">
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* السعر يظهر فقط لو الكورس مدفوع */}
                    {course.type === "paid" && (
                        <div>
                            <label className="block mb-2 font-arabic-medium">السعر (جنيه)</label>
                            <input
                                type="text"
                                name="price"
                                value={course.price}
                                onChange={handleChange}
                                placeholder="مثال: 500 جنيه"
                                className="input-field w-full"
                                required={course.type === "paid"}
                            />
                        </div>
                    )}

                    {/*  Upload Image */}
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
                        <label
                            htmlFor="imageUpload"
                            className="btn-outline cursor-pointer flex items-center gap-2 w-full"
                        >
                            <Upload className="w-5 h-5" /> اختر صورة
                        </label>
                        {course.image && (
                            <p className="text-sm text-primary mt-2">{course.image.name}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-4 pt-4">
                        <button type="submit" className="btn-primary flex items-center gap-2">
                            <Save className="w-5 h-5" /> حفظ الكورس
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/courses")}
                            className="btn-outline flex items-center gap-2"
                        >
                            <XCircle className="w-5 h-5" /> إلغاء
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>

    );
};

export default AddCourse;
