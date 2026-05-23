import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

type Step = "email" | "code" | "reset";

const BASE_API = import.meta.env.VITE_BASE_API;

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverCode, setServerCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_API}/Account/SendEmail?Email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) throw new Error("فشل في إرسال البريد الإلكتروني");

      const data = await res.text();
      setServerCode(data);
      setCurrentStep("code");
      toast.success("تم إرسال الكود بنجاح إلى بريدك الإلكتروني");
    } catch (err) {
      toast.error("حصل خطأ أثناء إرسال البريد");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = code.join("");
    if (enteredCode === serverCode) {
      setCurrentStep("reset");
    } else {
      toast.error("الكود غير صحيح");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور غير متطابقة");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_API}/Account/ChangePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: newPassword,
        }),
      });
      if (!res.ok) throw new Error("فشل في تغيير كلمة المرور");
      toast.success("تم تغيير كلمة المرور بنجاح");
      navigate("/login");
    } catch (err) {
      toast.error("حصل خطأ أثناء تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        const nextInput = document.querySelector(
          `input[name="code-${index + 1}"]`
        ) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "email":
        return (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-3xl font-arabic-bold text-white mb-2 border-b-2 border-primary inline-block pb-4">
                نسيت الرقم السري
              </h1>
              <p className="text-gray-300 mt-4">
                لا تقلق سوف نساعدك في الحصول علي الرقم السري
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-arabic-medium mb-2">
                  الايميل
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="سجل ايميلك"
                    className="input-field w-full pr-12 pl-12 bg-white/20 placeholder:text-white rounded-lg border border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-background-darker hover:bg-gray-100 font-arabic-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "جاري الإرسال..." : "تأكيد"}
              </motion.button>
            </form>
          </motion.div>
        );

      case "code":
        return (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-3xl font-arabic-bold text-white mb-2 border-b-2 border-primary inline-block pb-4">
                تأكيد الرمز
              </h1>
              <p className="text-gray-300 mt-4">
                تم إرسال رمز التحقق إلى بريدك الإلكتروني
                <br />
                <span className="text-gray-400 underline">{email}</span>
              </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="flex justify-center space-x-4" dir="ltr">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`code-${index}`}
                    value={digit}
                    onChange={(e) => handleCodeInput(index, e.target.value)}
                    className={`w-14 h-14 text-center text-2xl font-bold rounded-lg border-2 transition-all duration-300 ${
                      digit
                        ? "border-white bg-background-dark text-white"
                        : "border-gray-400 bg-background-darker text-gray-300"
                    } focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none`}
                    maxLength={1}
                  />
                ))}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep("email")}
                  className="hover:text-primary-light transition-colors font-arabic-medium mt-2"
                >
                  <span className="text-gray-400">
                    لم تستلم الكود؟&nbsp;&nbsp;
                  </span>
                  إعادة إرسال الرمز
                </button>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-background-darker hover:bg-gray-100 font-arabic-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                تأكيد
              </motion.button>
            </form>
          </motion.div>
        );

      case "reset":
        return (
          <motion.div
            key="reset"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1 className="text-3xl font-arabic-bold text-white mb-2 border-b-2 border-primary inline-block pb-2">
                إنشاء رقم سري جديد
              </h1>
              <p className="text-gray-300 mt-4">أدخل كلمة المرور الجديدة</p>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div>
                <label className="block text-white font-arabic-medium mb-2">
                  الرقم السري
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="أدخل كلمة مرور قوية"
                    className="input-field w-full pr-12 pl-12 bg-white/20 placeholder:text-white rounded-lg border border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                    required
                  />
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white font-arabic-medium mb-2">
                  تأكيد الرقم السري
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور"
                    className="input-field w-full pr-12 pl-12 bg-white/20 placeholder:text-white rounded-lg border border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                    required
                  />
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-background-darker hover:bg-gray-100 font-arabic-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "جاري الحفظ..." : "تأكيد"}
              </motion.button>
            </form>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link to="/">
              <img
                src={logo}
                alt="ITR Education"
                className="h-16 w-auto mx-auto mb-8 lg:absolute top-10 left-10"
              />
            </Link>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Back to Login */}
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="inline-flex items-center text-gray-400 hover:text-primary-light transition-colors font-arabic-medium space-x-2 rtl:space-x-reverse"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة إلى تسجيل الدخول</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
