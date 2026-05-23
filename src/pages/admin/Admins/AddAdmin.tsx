import { useState } from "react";
import { motion } from "framer-motion";
import { Save, XCircle, Eye, EyeOff } from "lucide-react"; 
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BASE_API = import.meta.env.VITE_BASE_API;

const AddAdmin = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "SuperAdmin",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("لا يوجد صلاحيات للدخول (token مفقود)");
      return;
    }

    try {
      const response = await fetch(`${BASE_API}/Account/Register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userName: admin.name,
          phoneNumber: admin.phone,
          email: admin.email,
          password: admin.password,
          role: admin.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "حدث خطأ أثناء إضافة الأدمن");
        return;
      }

      toast.success("تم إضافة الأدمن بنجاح!");
      navigate("/admins");
    } catch (error) {
      console.error(error);
      toast.error("خطأ في الاتصال بالسيرفر");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card-dark h-auto w-full lg:w-[70vw] mx-auto"
      >
        <h1 className="text-2xl font-arabic-bold text-primary mb-6 text-center">
          إضافة أدمن جديد
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

          {/* رقم الهاتف */}
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

          {/* الإيميل */}
          <div>
            <label className="block mb-2 font-arabic-medium">الإيميل</label>
            <input
              type="email"
              name="email"
              value={admin.email}
              onChange={handleChange}
              placeholder="أدخل الإيميل"
              className="input-field w-full"
              required
            />
          </div>

          <div className="relative">
            <label className="block mb-2 font-arabic-medium">كلمة المرور</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={admin.password}
              onChange={handleChange}
              placeholder="أدخل كلمة المرور"
              className="input-field w-full pr-10"
              required
            />
            <button
              type="button"
              className="absolute top-12 left-3 text-gray-400"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* المهمة */}
          <div>
            <label className="block mb-2 font-arabic-medium">المهمة</label>
            <select
              name="role"
              value={admin.role}
              onChange={handleChange}
              className="input-field w-full mb-6"
              required
            >
              <option value="Admin">أدمن</option>
              <option value="SuperAdmin">سوبر أدمن</option>
            </select>
          </div>

          {/* الأزرار */}
          <div className="flex justify-center flex-col lg:flex-row gap-4 pt-4">
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Save className="w-5 h-5" /> حفظ
            </button>
            <button
              type="button"
              onClick={() => navigate("/admins")}
              className="btn-outline text-white flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" /> إلغاء
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddAdmin;
