import { useEffect, useState } from "react";
import { Card } from '@/components/ui/card';
import { BookOpen, ShoppingCart, Eye, Play, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const BASE_API = import.meta.env.VITE_BASE_API;
const BASE_API_IMAGES = import.meta.env.VITE_BASE_IMAGES;

const Dashboard = () => {
  const navigate = useNavigate();
  const [latestCourses, setLatestCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    numOfCourses: 0,
    numOfFreeCourses: 0,
    numOfPaidCourses: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("لا يوجد صلاحيات للدخول (token مفقود)");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`${BASE_API}/Statistics/GetAllUserStatistics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("فشل تحميل الإحصائيات");

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        toast.error("حصل خطأ أثناء تحميل الإحصائيات");
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await fetch(`${BASE_API}/Course/GetAll`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("فشل تحميل الكورسات");

        const data = await res.json();

        // ناخد أحدث 3 كورسات فقط
        const latest = data.slice(-3).reverse();
        setLatestCourses(latest);
      } catch (err) {
        console.error(err);
        toast.error("حصل خطأ أثناء تحميل الكورسات");
      }
    };

    fetchStats();
    fetchCourses();
  }, []);

  const statsCards = [
    { title: 'عدد كورسات المنصة', value: stats.numOfCourses, icon: BookOpen },
    { title: 'عدد الكورسات المجانية', value: stats.numOfFreeCourses, icon: Eye },
    { title: 'عدد الكورسات المدفوعة', value: stats.numOfPaidCourses, icon: ShoppingCart },
  ];

  return (
    <div className="p-8 lg:p-16 mt-24 lg:mt-0">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Card className="bg-white text-center shadow-lg rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center justify-center space-y-6">
                <stat.icon className="w-12 h-12 text-primary-dark" />
                <h3 className="font-bold text-lg text-primary-dark">{stat.title}</h3>
                <div className="text-5xl font-extrabold text-primary-dark">{stat.value}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <hr
        className="border-t-4 mt-6 mb-12 mx-auto w-[50vw]"
        style={{ borderColor: "#040B1D" }}
      />

      {/* Latest Courses */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center border-b-4 border-primary pb-4 inline-block">
          الكورسات المضافة حديثاً:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestCourses.map((course, i) => (
            <motion.div
              key={course.id}
              className="card-dark group hover:scale-105 transition-all duration-300 md:w-96"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img
                  src={`${BASE_API_IMAGES}/Images/${course.imageUrl}`}
                  alt={course.name}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-darkest/60 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-primary rounded-full p-2">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="space-y-6 text-center p-4">
                <h3 className="text-xl font-arabic-semibold text-white group-hover:text-primary-light transition-colors">
                  {course.name}
                </h3>

                <div className="flex items-center justify-center">
                  <span className="text-2xl font-arabic-bold text-primary-light">
                    {course.type === "Free" ? "مجاناً" : `$${course.price}`}
                  </span>
                </div>

                <Button
                  onClick={() => navigate(`/course/${course.id}`, { state: { course } })}
                  className="flex items-center gap-10 btn-primary bg-white text-primary-dark font-bold lg:text-xl text-center w-48 mx-auto hover:text-white"
                >
                  {course.type == 'Paid' ? <span className="flex items-center gap-5">شراء الآن <ShoppingCart className="inline w-6 h-6 text-primary-dark hover:text-white" /></span> : <span className="flex items-center gap-3">اشترك الآن <Save className="inline w-6 h-6 text-primary-dark hover:text-white" /></span>}

                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div >
    </div >
  );
};

export default Dashboard;
