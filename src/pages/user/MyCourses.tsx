import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Play, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const BASE_API = import.meta.env.VITE_BASE_API;
const BASE_API_IMAGES = import.meta.env.VITE_BASE_IMAGES;

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Free" | "Paid">("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${BASE_API}/UserCourse/GetAllCoursesForUser?UserId=${user?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        );
        if (!res.ok) throw new Error("فشل في جلب الكورسات");
        const data = await res.json();
        setCourses(data);
      } catch (error: any) {
        toast.error(error.message || "حصل خطأ أثناء تحميل الكورسات");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchCourses();
  }, [user?.id]);

  // Filtered + Search
  const filteredCourses = courses.filter((course) => {
    if (filter !== "All" && course.courseType !== filter) return false;
    if (
      search &&
      !course.courseName.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-8 lg:p-16">
      {/* Title + Search */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center md:justify-between mb-12">
        <h1 className="text-3xl font-bold text-white">كورساتي</h1>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-dark h-4 w-4" />
          <Input
            placeholder="البحث في الكورسات..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pr-10 px-10 bg-white border-primary/20 text-primary-dark placeholder:text-primary-dark"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        <Button
          onClick={() => {
            setFilter("All");
            setCurrentPage(1);
          }}
          className={
            filter === "All"
              ? "bg-primary text-white hover:text-white font-bold"
              : "bg-white text-primary-dark hover:text-white font-bold"
          }
        >
          الكل
        </Button>
        <Button
          onClick={() => {
            setFilter("Free");
            setCurrentPage(1);
          }}
          className={
            filter === "Free"
              ? "bg-primary text-white hover:text-white font-bold"
              : "bg-white text-primary-dark hover:text-white font-bold"
          }
        >
          مجاني
        </Button>
        <Button
          onClick={() => {
            setFilter("Paid");
            setCurrentPage(1);
          }}
          className={
            filter === "Paid"
              ? "bg-primary text-white hover:text-white font-bold"
              : "bg-white text-primary-dark hover:text-white font-bold"
          }
        >
          مدفوع
        </Button>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <p className="text-center text-white">جاري التحميل...</p>
      ) : paginatedCourses.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedCourses.map((course, i) => (
            <motion.div
              key={course.courseId}
              className="card-dark group hover:scale-105 transition-all duration-300 md:w-96"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img
                  src={`${BASE_API_IMAGES}/Images/${course.courseImageUrl}`}
                  alt={course.courseName}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-darkest/60 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-primary rounded-full p-2">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="space-y-6 text-center p-4">
                <h3 className="text-xl font-arabic-semibold text-white group-hover:text-primary-light transition-colors">
                  {course.courseName}
                </h3>

                <Link
                  to={`/course/${course.courseId}/lectures`}
                  className="flex items-center justify-center gap-3 btn-primary w-48 mx-auto font-bold lg:text-xl"
                >
                  مشاهدة
                  <Play />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-10 h-10 rounded-full ${currentPage === i + 1
              ? "bg-primary text-white"
              : "bg-white text-primary-dark border-0"
              }`}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

    </div>
  );
};

export default MyCourses;
