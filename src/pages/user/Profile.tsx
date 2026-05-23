import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react"; 

const BASE_API = import.meta.env.VITE_BASE_API;

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    email: "",
    phoneNumber: "",
    userName: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("لا يوجد صلاحيات للدخول (token مفقود)");
      return;
    }
    if (!user) return;
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${BASE_API}/Account/GetUserById?UserId=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Fetch failed:", res.status, errorText);
          toast.error(`خطأ ${res.status}: غير مسموح (توكن أو UserId غير صحيح)`);
          return;
        }

        const data = await res.json();
        setProfile({
          email: data.email,
          phoneNumber: data.phoneNumber,
          userName: data.userName,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  // تغيير الباسورد
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("كلمة السر غير متطابقة");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_API}/Account/ChangePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          email: profile.email,
          password: newPassword,
        }),
      });

      if (res.ok) {
        toast.success("تم تغيير الرقم السري بنجاح ");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await res.json();
        toast.error("خطأ: " + error.message);
      }
    } catch (err) {
      console.error("Error changing password:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-white mt-16 lg:mt-0 mb-8 text-center md:text-right"
      >
        الصفحة الشخصية
      </motion.h1>

      {/* Profile Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center flex-col gap-6 mb-12"
      >
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
          <span className="text-3xl font-bold text-primary-dark">
            {profile.userName?.[0]?.toUpperCase() || "?"}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">{profile.userName}</h2>
      </motion.div>

      <div className="space-y-12">
        {/* Personal Information */}
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary-dark text-lg md:text-2xl font-medium">
                الايميل
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-white/20 border-white/20 text-black w-full font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-primary-dark text-lg md:text-2xl font-medium">
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                value={profile.phoneNumber}
                disabled
                className="bg-white/20 border-white/20 text-black w-full font-bold"
              />
            </div>
          </CardContent>
        </Card>

        <hr className="border-t-4 mt-6 mb-12 mx-auto w-[50vw]" style={{ borderColor: "#040B1D" }} />

        {/* Change Password */}
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">تغيير الرقم السري</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 relative">
              <Label htmlFor="new-password" className="text-primary-dark text-lg md:text-2xl font-medium">
                الرقم السري الجديد
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="ادخل كلمة المرور الجديدة"
                  className="bg-white/20 border-white/20 text-black w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="confirm-password" className="text-primary-dark text-lg md:text-2xl font-medium">
                تأكيد الرقم السري الجديد
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  className="bg-white/20 border-white/20 text-black w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleChangePassword}
          disabled={loading}
          className="w-full bg-white text-primary-dark hover:bg-white/90 h-12 text-lg font-bold"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
