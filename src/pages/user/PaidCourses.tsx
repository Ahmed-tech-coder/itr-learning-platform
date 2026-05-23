import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  ShoppingCart,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BASE_API = import.meta.env.VITE_BASE_API;
const BASE_API_IMAGES = import.meta.env.VITE_BASE_IMAGES;

const PaidCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("لا يوجد صلاحيات للدخول (token مفقود)");
          setLoading(false);
          return;
        }

        const response = await fetch(`${BASE_API}/Course/GetAllPaidCourses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error(error);
        toast.error("حدث خطأ أثناء جلب الكورسات");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-white text-xl">جاري تحميل الكورسات...</p>
      </div>
    );
  }

  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-8 lg:p-16">
      {/* Title + Search */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center md:justify-between mb-12">
        <h1 className="text-3xl font-bold text-white">الكورسات المدفوعة</h1>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-dark h-4 w-4" />
          <Input
            placeholder="البحث في الكورسات..."
            className="pr-10 px-10 bg-white border-primary/20 text-primary-dark placeholder:text-primary-dark"
          />
        </div>
      </div>

      {courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24"
        >
          <AlertCircle className="w-16 h-16 text-primary mb-6" />
          <h3 className="text-2xl lg:text-4xl font-arabic-bold text-white mb-4">
            لا توجد كورسات متاحة حاليًا
          </h3>
          <p className="text-gray-300 text-lg text-center max-w-md">
            نحن نعمل على إضافة المزيد من الكورسات قريبًا، تابعنا لتكون أول
            من يستفيد من المحتوى الجديد!
          </p>
        </motion.div>
      ) : (
        <>
          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentCourses.map((course, i) => (
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

                  <div className="flex flex-col items-center gap-4">
                    <span className="text-primary-light font-bold text-lg">
                      {course.price} $
                    </span>

                    <Button
                      onClick={() => navigate(`/course/${course.id}`, { state: { course } })}
                      className="flex items-center justify-center gap-3 btn-primary w-48 mx-auto font-bold lg:text-xl 
                                 bg-white text-primary-dark hover:bg-gray-100"
                    >
                      شراء
                      <ShoppingCart />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            {/* زر السابق */}
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* أرقام الصفحات */}
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`w-10 h-10 rounded-full ${currentPage === index + 1
                  ? "bg-primary text-white"
                  : "bg-white text-primary-dark"
                  }`}
              >
                {index + 1}
              </Button>
            ))}

            {/* زر التالي */}
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaidCourses;
