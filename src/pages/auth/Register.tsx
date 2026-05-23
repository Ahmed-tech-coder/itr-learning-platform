import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';
import loginHero from "@/assets/login-bg.png";

const BASE_API = import.meta.env.VITE_BASE_API;

const translateError = (errData: any): string => {
  let rawMessage: string = "";

  if (Array.isArray(errData?.errors) && errData.errors.length > 0) {
    rawMessage = errData.errors[0];
  } else if (typeof errData?.message === "string") {
    rawMessage = errData.message;
  } else if (typeof errData === "string") {
    rawMessage = errData;
  }

  const map: Record<string, string> = {
    "Email already exists": "البريد الإلكتروني مسجل بالفعل",
    "Username": "اسم المستخدم مسجل بالفعل",
    "is already taken.": "مستخدم بالفعل",
    "Invalid password": "كلمة المرور غير صحيحة",
    "User not found": "المستخدم غير موجود",
    "Phone number already exists": "رقم الهاتف مسجل بالفعل",
    "Password must be at least 6 characters": "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    "a bad Request , You have made": "طلب غير صالح",
  };

  for (const key in map) {
    if (rawMessage.includes(key)) {
      return map[key];
    }
  }

  return "حدث خطأ غير متوقع، برجاء المحاولة لاحقاً";
};


const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [step, setStep] = useState<"register" | "verify">("register");
  const [verificationCode, setVerificationCode] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);

    try {
      const registerRes = await fetch(`${BASE_API}/Account/Register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.name,
          phoneNumber: formData.phoneNumber,
          Email: formData.email,
          password: formData.password,
          role: "User",
        }),
      });

      if (!registerRes.ok) {
        const errData = await registerRes.json().catch(() => null);
        throw new Error(translateError(errData));
      }

      //  OTP
      const otpRes = await fetch(
        `${BASE_API}/Account/ConfirmEmail?Email=${encodeURIComponent(formData.email)}`,
        {
          method: "POST",
        }
      );

      if (!otpRes.ok) {
        throw new Error("فشل إرسال كود التحقق");
      }

      toast.success("تم إرسال كود التحقق لبريدك الإلكتروني");
      setStep("verify");

    } catch (err: any) {
      toast.error(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_API}/Account/VerifyOTP?Email=${encodeURIComponent(formData.email)}&OTP=${verificationCode}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "الكود غير صحيح");
      }

      toast.success("تم تفعيل الحساب بنجاح");
      navigate("/login");

    } catch (err: any) {
      toast.error(err.message || "فشل التحقق من الكود");
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

  return (
    <div className="min-h-screen bg-background-dark flex flex-col lg:flex-row">
      {/* Right Side - Image */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginHero})` }}
      />

      {/* Left Side - Form */}
      <motion.div
        className="flex-1 flex items-center justify-center px-6 py-12"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div className="w-full max-w-md space-y-8">
          <Link to="/">
            <img
              src={logo}
              alt="ITR Education"
              className="mx-auto mb-8 lg:absolute left-10 top-10"
            />
          </Link>

          <div className="text-center relative">
            <h1 className="text-3xl font-arabic-bold text-white mb-2 border-b-4 border-primary inline-block pb-4">
              {step === "register" ? "اشتراك" : "تأكيد البريد الإلكتروني"}
            </h1>
          </div>

          {step === "register" ? (
            // =================== Register Form ===================
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-white font-arabic-medium mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                    className="input-field w-full pr-12 pl-12 bg-white/20 placeholder:text-white"
                    required
                  />
                  <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white font-arabic-medium mb-2">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم هاتفك"
                    className="input-field w-full pr-12 pl-12 bg-white/20 placeholder:text-white"
                    required
                  />
                  <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-arabic-medium mb-2">
                  الايميل
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="سجل ايميلك"
                    className="input-field w-full pr-12 pl-12 bg-white/20 placeholder:text-white"
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-white font-arabic-medium mb-2">
                  الرقم السري
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="أدخل كلمة مرور قوية"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-white font-arabic-medium mb-2">
                  تأكيد الرقم السري
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="أعد إدخال كلمة المرور"
                    className="input-field w-full pr-12 pl-12 bg-white/20 placeholder:text-white"
                    required
                  />
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="lg:text-2xl font-bold w-full bg-white text-background-darker hover:bg-gray-100 font-arabic-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? "جاري الاشتراك..." : "اشتراك"}
              </motion.button>



              {/* Register Link */}
              <div className="text-center">
                <span className="text-gray-500 lg:text-xl">هل انت مشترك؟&nbsp;&nbsp;</span>
                <Link
                  to="/login"
                  className="lg:text-xl underline hover:text-primary-light transition-colors font-arabic-medium"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </form>
          ) : (
            // =================== Verify Form ===================
            <form onSubmit={handleVerify} className="space-y-6">
              <p className="text-white text-center">
                تم إرسال كود تحقق إلى بريدك الإلكتروني <br />
                <span className="font-bold text-primary">{formData.email}</span>
              </p>

              <div>
                <label className="block text-white font-arabic-medium mb-2">
                  كود التحقق
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="أدخل الكود المرسل"
                  className="input-field w-full bg-white/20 text-white placeholder:text-white"
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="lg:text-2xl font-bold w-full bg-primary text-white py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
              >
                تحقق
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
