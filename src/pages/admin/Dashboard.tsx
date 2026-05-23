import { Card } from '@/components/ui/card';
import { BookOpen, Users, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const BASE_API = import.meta.env.VITE_BASE_API;

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: 'عدد كورسات المنصة', value: 0, icon: BookOpen, color: "text-primary-dark" },
    { title: 'عدد المستخدمين', value: 0, icon: Users, color: "text-primary-dark" },
    { title: 'عدد المسؤولين', value: 0, icon: ShieldCheck, color: "text-primary-dark" },
    { title: 'عمليات الشراء الغير مكتملة', value: 0, icon: XCircle, color: "text-red-600" },
    { title: 'عمليات الشراء المكتملة', value: 0, icon: CheckCircle2, color: "text-green-600" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          toast.error("لا يوجد صلاحيات للدخول (token مفقود)");
          return;
        }

        const response = await fetch(`${BASE_API}/Statistics/GetAllAdminStatistics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || "حدث خطأ أثناء جلب الإحصائيات");
          return;
        }

        const data = await response.json();

        setStats([
          { title: 'عدد كورسات المنصة', value: data.numOfCourses, icon: BookOpen, color: "text-primary-dark" },
          { title: 'عدد المستخدمين', value: data.numOfUsers, icon: Users, color: "text-primary-dark" },
          { title: 'عدد المسؤولين', value: data.numOfAdmins, icon: ShieldCheck, color: "text-primary-dark" },
          { title: 'عمليات الشراء الغير مكتملة', value: data.numOfRejectedOrders, icon: XCircle, color: "text-red-600" },
          { title: 'عمليات الشراء المكتملة', value: data.numOfConfirmedOrders, icon: CheckCircle2, color: "text-green-600" },
        ]);
      } catch (error) {
        console.error(error);
        toast.error("خطأ في الاتصال بالسيرفر");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8 lg:p-16 mt-24 lg:mt-0">
      {/* Stats Cards */}
      <div className="flex flex-wrap justify-center gap-6 mb-24">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="w-[380px]"
          >
            <Card className="bg-white text-center shadow-lg rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center justify-center space-y-6">
                <stat.icon className={`w-12 h-12 ${stat.color}`} />
                <h3 className="font-bold text-lg text-primary-dark">{stat.title}</h3>
                <div className={`text-3xl md:text-5xl font-extrabold ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <hr
        className="border-t-4 mt-6 mb-12 mx-auto w-[50vw]"
        style={{ borderColor: "#040B1D" }}
      />
    </div>
  );
};

export default Dashboard;
