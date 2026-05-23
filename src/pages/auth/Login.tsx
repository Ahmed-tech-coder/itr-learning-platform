import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/logo.png';
import loginHero from "@/assets/login-bg.png";
import { toast } from "sonner"

const BASE_API = import.meta.env.VITE_BASE_API;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_API}/Account/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error("فشل تسجيل الدخول، برجاء التأكد من البيانات");
      }

      const data = await res.json();

      if (!data.token) {
        throw new Error("لم يتم استلام التوكين من السيرفر");
      }

      const decoded: any = JSON.parse(atob(data.token.split(".")[1]));

      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        decoded.role;

      if (role !== "User") {
        toast.error("هذا الحساب غير مسموح له بتسجيل الدخول كمستخدم");
        return;
      }

      login(data.token);

      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/dashboard");

    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
      toast.error(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const socialVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.3 + i * 0.2, duration: 0.5 } }),
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col lg:flex-row relative">

      {/* Right Side - Image */}
      <motion.div
        className="hidden lg:flex flex-1 items-center justify-center p-8 bg-cover bg-center "
        style={{ backgroundImage: `url(${loginHero})` }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
      />


      {/* Left Side - Form */}
      <motion.div
        className="flex-1 flex items-center justify-center px-6 py-12 "
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div className="w-full max-w-md space-y-8 ">
          {/* Logo */}
          <Link to="/" className=" flex justify-center">
            <img src={logo} alt="ITR Education" className="rounded-full mb-8 lg:absolute left-10 top-10" />
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-arabic-bold text-white mb-2 border-b-4 border-primary inline-block pb-6">
              تسجيل الدخول
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white font-arabic-medium mb-2">الايميل</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="سجل ايميلك"
                  className="input-field w-full pr-12 bg-white/20 placeholder:text-white"
                  required
                />
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white font-arabic-medium mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="أدخل كلمة المرور"
                  className="input-field w-full pr-12 pl-12 bg-white/20 placeholder:text-white"
                  required
                />
                <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-gray-400 hover:text-primary-light transition-colors font-arabic-medium underline pb-2"
              >
                هل نسيت الرقم السري؟
              </Link>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              className="w-full lg:text-2xl font-bold bg-white text-background-darker hover:bg-gray-100 font-arabic-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              تسجيل الدخول
            </motion.button>


            {/* Register Link */}
            <div className="text-center">
              <span className="text-gray-500 lg:text-xl">هل انت لست مشترك؟&nbsp;&nbsp;</span>
              <Link
                to="/register"
                className="lg:text-xl underline hover:text-primary-light transition-colors font-arabic-medium"
              >
                اشتراك
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
