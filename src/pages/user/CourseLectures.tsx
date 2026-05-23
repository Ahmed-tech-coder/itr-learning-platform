import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BASE_API = import.meta.env.VITE_BASE_API;
const BASE_API_IMAGES = import.meta.env.VITE_BASE_IMAGES;

type Lecture = {
  id: number;
  name: string;
  price: number;
  description: string;
  state: string; // Active | InActive
  imageUrl: string
  courseId: number;
  courseName: string;
  image?: string;
};

const PAGE_SIZE = 6;

const CourseLectures = () => {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const fetchLectures = async (pageNum: number) => {
    if (!courseId) return;
    try { 
      setLoading(true);
      const res = await fetch(
        `${BASE_API}/Lecture/GetAllLecturesForCourse?CourseId=${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("فشل في جلب المحاضرات");

      const data: Lecture[] = await res.json();


      if (Array.isArray(data)) {
        setLectures(data.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE));
        setTotalPages(Math.ceil(data.length / PAGE_SIZE));
      } else {
        setLectures([]);
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل المحاضرات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures(page);
  }, [courseId, page]);

  return (
    <div className="p-8 lg:p-16">
      {/* Title */}
      <div className="mb-12 text-center lg:text-right">
        <h1 className="text-3xl font-bold text-white mb-2">
          كورس - {lectures[0]?.courseName || ""}
        </h1>
      </div>

      {/* Lectures Grid */}
      {loading ? (
        <p className="text-white text-center">جاري تحميل المحاضرات...</p>
      ) : lectures.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24"
        >
          <AlertCircle className="w-16 h-16 text-primary mb-6" />
          <h3 className="text-2xl lg:text-4xl font-arabic-bold text-white mb-4">
            لا توجد محاضرات متاحة حاليًا
          </h3>
          <p className="text-gray-300 text-lg text-center max-w-md">
            نحن نعمل على إضافة المزيد من المحاضرات قريبًا، تابعنا لتكون أول
            من يستفيد من المحتوى الجديد!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {lectures.map((lecture, i) => (
            <motion.div
              key={lecture.id}
              className="card-dark group hover:scale-105 transition-all duration-300 md:w-96"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img
                  src={lecture.image}
                  alt={lecture.name}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-darkest/60 to-transparent"></div>

                {/* Icon top-left */}
                <div className="absolute top-4 left-4 bg-primary rounded-full p-2">
                  {lecture.state === "Active" ? (
                    <Play className="w-5 h-5 text-white" />
                  ) : (
                    <Lock className="w-5 h-5 text-white/70" />
                  )}
                </div>

                {/* Lecture Number top-right */}
                <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold bg-white text-primary-dark">
                  {(page - 1) * PAGE_SIZE + i + 1}
                </div>
              </div>

              <div className="space-y-4 text-center p-4">
                <h3 className="text-xl font-arabic-semibold text-white group-hover:text-primary-light transition-colors">
                  {lecture.name}
                </h3>

                <p className="text-white/70 text-sm">{lecture.description}</p>

                {lecture.state === "Active" && (
                  <Link
                    to={`/course/${courseId}/lecture/${lecture.id}`}
                    className="flex items-center justify-center gap-3 w-48 mx-auto font-bold lg:text-md rounded-lg px-4 py-2 transition-all bg-white text-primary-dark hover:bg-primary-dark hover:text-white"
                  >
                    مشاهدة
                    <Play className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            className={`w-10 h-10 rounded-full ${page === i + 1
              ? "bg-primary text-white"
              : "bg-white text-primary-dark"
              }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
          onClick={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CourseLectures;
