import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, XCircle } from "lucide-react";
import { toast } from "sonner";

import { useNavigate, useParams } from "react-router-dom";

const EditAdmin = () => {
    const navigate = useNavigate();
    const { adminId } = useParams();

    const [admin, setAdmin] = useState({
        name: "",
        phone: "",
        role: "admin",
    });

    useEffect(() => {

        const fetchedAdmin = {
            name: "أحمد مجدي",
            phone: "01127346022",
            role: "super-admin",
        };
        setAdmin(fetchedAdmin);
    }, [adminId]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setAdmin({ ...admin, [name]: value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        toast.success("تم تعديل بيانات الأدمن بنجاح!");
    };

    return (

        <div className="min-h-screen flex items-center justify-center p-4 w-full">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card-dark w-full lg:w-[70vw] mx-auto"
            >
                <h1 className="text-2xl font-arabic-bold text-primary mb-6 text-center">
                    تعديل بيانات الأدمن
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* الاسم */}
                    <div>
                        <label className="block mb-2 font-arabic-medium">الاسم</label>
                        <input
                            type="text"
                            name="name"
                            value={admin.name}
                            onChange={handleChange}
                            placeholder="أدخل اسم الأدمن"
                            className="input-field w-full"
                            required
                        />
                    </div>

                    {/* الرقم */}
                    <div>
                        <label className="block mb-2 font-arabic-medium">رقم الهاتف</label>
                        <input
                            type="text"
                            name="phone"
                            value={admin.phone}
                            onChange={handleChange}
                            placeholder="أدخل رقم الهاتف"
                            className="input-field w-full"
                            required
                        />
                    </div>

                    {/* المهمة / Role */}
                    <div>
                        <label className="block mb-2 font-arabic-medium">المهمة</label>
                        <select
                            name="role"
                            value={admin.role}
                            onChange={handleChange}
                            className="input-field w-full mb-10"
                            required
                        >
                            <option value="corrector">مصحح</option>
                            <option value="admin">أدمن</option>
                            <option value="super-admin">سوبر أدمن</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-4 pt-4 flex-col lg:flex-row">
                        <button type="submit" className="btn-primary flex items-center gap-2">
                            <Save className="w-5 h-5" /> حفظ
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admins")}
                            className="btn-outline flex items-center gap-2 text-white"
                        >
                            <XCircle className="w-5 h-5" /> إلغاء
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>

    );
};

export default EditAdmin;
