import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const BASE_API = import.meta.env.VITE_BASE_API;
const BASE_API_IMAGES = import.meta.env.VITE_BASE_IMAGES;

interface Course {
  id: number;
  name: string;
  description: string;
  state: string;
  type: "Paid" | "Free";
  price: number | null;
  imageUrl: string;
}

const Courses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"free" | "paid">("free");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${BASE_API}/Course/GetAllForLandingPage`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        if (!res.ok) throw new Error("فشل في تحميل الكورسات");

        const data: Course[] = await res.json();

  
        const sortedCourses = data.sort((a, b) => b.id - a.id);

        setCourses(sortedCourses);
      } catch (err) {
        console.error("Error fetching courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const freeCourses = courses.filter((c) => c.type === "Free");
  const paidCourses = courses.filter((c) => c.type === "Paid");

  const currentCourses =
    activeTab === "free"
      ? freeCourses.slice(0, 3)
      : paidCourses.slice(0, 3);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentCourses.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? currentCourses.length - 1 : prev - 1
    );
  };

  if (loading) return <p className="text-center text-white">جاري التحميل...</p>;

  return (
    <motion.section
      className="section-padding bg-background-dark"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container-custom relative">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-arabic-bold text-white mb-8 inline-block border-b-4 border-primary pb-6">
            الكورسات
          </h2>

          {/* Toggle Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setActiveTab("free");
                setCurrentIndex(0);
              }}
              className={`px-8 py-3 text-2xl rounded-lg font-arabic-medium transition-all duration-300 ${
                activeTab === "free"
                  ? "bg-primary text-white shadow-medium"
                  : "bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
              }`}
            >
              مجاني
            </button>
            <button
              onClick={() => {
                setActiveTab("paid");
                setCurrentIndex(0);
              }}
              className={`px-8 py-3 text-2xl rounded-lg font-arabic-medium transition-all duration-300 ${
                activeTab === "paid"
                  ? "bg-primary text-white shadow-medium"
                  : "bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
              }`}
            >
              مدفوع
            </button>
          </div>
        </motion.div>

        {/* حالة لا توجد كورسات */}
        {currentCourses.length === 0 ? (
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
            {/* Courses Grid (Desktop) */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentCourses.map((course) => (
                <motion.div
                  key={course.id}
                  className="card-dark group hover:scale-105 transition-all duration-300 w-80 mx-auto"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
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

                  <div className="space-y-12 text-center">
                    <h3 className="text-xl font-arabic-semibold text-white group-hover:text-primary-light transition-colors">
                      {course.name}
                    </h3>

                    {activeTab === "paid" && course.price && (
                      <div className="flex items-center justify-center">
                        <span className="text-2xl font-arabic-bold text-primary-light">
                          {course.price} جنيه
                        </span>
                      </div>
                    )}

                    <Button
                      onClick={() =>
                        navigate(`/course/${course.id}`, { state: { course } })
                      }
                      className="btn-primary text-center block w-48 mx-auto"
                    >
                      {activeTab === "free" ? "شاهد الآن" : "شراء الكورس"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden mb-12">
              <AnimatePresence mode="wait">
                {currentCourses.length > 0 && (
                  <motion.div
                    key={currentCourses[currentIndex].id + activeTab}
                    className="card-dark w-full group"
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -80 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-6">
                      <img
                        src={`${BASE_API_IMAGES}/Images/${currentCourses[currentIndex].imageUrl}`}
                        alt={currentCourses[currentIndex].name}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-darkest/60 to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-primary rounded-full p-2">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="space-y-12 text-center">
                      <h3 className="text-xl font-arabic-semibold text-white group-hover:text-primary-light transition-colors">
                        {currentCourses[currentIndex].name}
                      </h3>

                      {activeTab === "paid" &&
                        currentCourses[currentIndex].price && (
                          <div className="flex items-center justify-center">
                            <span className="text-2xl font-arabic-bold text-primary-light">
                              {currentCourses[currentIndex].price} جنيه
                            </span>
                          </div>
                        )}

                      <Button
                        onClick={() =>
                          navigate(`/course/${currentCourses[currentIndex].id}`, {
                            state: { course: currentCourses[currentIndex] },
                          })
                        }
                        className="btn-primary text-center block w-48 mx-auto"
                      >
                        {activeTab === "free" ? "شاهد الآن" : "شراء الكورس"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-center gap-4 mt-6">
                <button onClick={handleNext} className="btn-gradient">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button onClick={handlePrev} className="btn-gradient">
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default Courses;
