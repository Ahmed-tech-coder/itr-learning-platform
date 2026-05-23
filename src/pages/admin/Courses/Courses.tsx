import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Eye, Trash2, Plus, Edit, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BASE_API = import.meta.env.VITE_BASE_API;
const BASE_API_IMAGES = import.meta.env.VITE_BASE_IMAGES;

interface Course {
    id: number;
    name: string;
    description: string;
    state: string;
    type: "Paid" | "Free";
    price: number;
    imageUrl: string;
}

const Courses = () => {
    const navigate = useNavigate()
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 6;

    // Filter state
    const [filter, setFilter] = useState<"All" | "Free" | "Paid">("All");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(`${BASE_API}/Course/GetAll`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch courses");

                const data: Course[] = await res.json();
                setCourses(data);

            } catch (err) {
                console.error("Error fetching courses", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Apply filter
    const filteredCourses =
        filter === "All"
            ? courses
            : courses.filter((c) => c.type === filter);

    // Pagination logic
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    const handleDelete = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا الكورس؟")) return;

        try {
            const res = await fetch(`${BASE_API}/Course?Id=${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "فشل حذف الكورس");
            }

            setCourses((prev) => prev.filter((c) => c.id !== id));

            toast.success("تم حذف الكورس بنجاح");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "حدث خطأ أثناء الحذف");
        }
    };

    if (loading) return <p className="text-white">جاري التحميل...</p>;

    return (
        <div className="p-8 lg:p-16">
            {/* Title + Add Course Button */}
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center md:justify-between mb-12">
                <h1 className="text-3xl font-bold text-white">الكورسات</h1>
                <Link to="/courses/add-course">
                    <Button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 rounded-lg px-6 py-2">
                        <Plus className="w-4 h-4" />
                        إضافة كورس
                    </Button>
                </Link>
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center gap-4 mb-10">
                <Button
                    onClick={() => { setFilter("All"); setCurrentPage(1); }}
                    className={filter === "All" ? "bg-primary text-white hover:text-white font-bold" : "bg-white text-primary-dark hover:text-white font-bold"}
                >
                    الكل
                </Button>
                <Button
                    onClick={() => { setFilter("Free"); setCurrentPage(1); }}
                    className={filter === "Free" ? "bg-primary text-white hover:text-white font-bold" : "bg-white text-primary-dark hover:text-white font-bold"}
                >
                    مجاني
                </Button>
                <Button
                    onClick={() => { setFilter("Paid"); setCurrentPage(1); }}
                    className={filter === "Paid" ? "bg-primary text-white hover:text-white font-bold" : "bg-white text-primary-dark hover:text-white font-bold"}
                >
                    مدفوع
                </Button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 w-full">
                {currentCourses.map((course, i) => (

                    <motion.div
                        key={course.id}

                        className="card-dark group hover:scale-105 transition-all duration-300 w-full md:w-96"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.2 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="relative overflow-hidden rounded-lg mb-6">

                            <img
                                src={`${BASE_API_IMAGES}Images/${course.imageUrl}`}
                                alt={course.name}
                                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-background-darkest/60 to-transparent"></div>
                            <div className="absolute top-4 left-4 bg-primary rounded-full p-2">
                                <Play className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div className="space-y-4 text-center p-4">
                            <h3 className="text-xl font-arabic-semibold text-white group-hover:text-primary-light transition-colors">
                                {course.name}
                            </h3>
                            <p className="text-gray-300 text-sm">
                                {course.description.length > 100
                                    ? course.description.slice(0, 100) + "..."
                                    : course.description}
                            </p>

                            <p className="flex justify-center">
                                {course.type === "Paid" ? (
                                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-md">
                                        {course.price} جنيه
                                    </span>
                                ) : (
                                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md">
                                        مجاني
                                    </span>
                                )}
                            </p>
                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {/* زر اطلاع */}
                                <Button
                                    onClick={() => navigate(`/courses/${course.id}/course-details`)}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>اطلاع</span>
                                </Button>

                                {/* زر المحاضرات */}
                                <Button
                                    onClick={() => navigate(`/courses/${course.id}/lectures`, { state: { course } })}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    <span>المحاضرات</span>
                                </Button>

                                {/* زر تعديل */}
                                <Button
                                    onClick={() => navigate(`/courses/${course.id}/edit-course`, { state: { course } })}

                                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-3 py-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span className="leading-none">تعديل</span>
                                </Button>


                                {/* زر حذف */}
                                <Button
                                    variant="destructive"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2"
                                    onClick={() => handleDelete(course.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>حذف</span>
                                </Button>
                            </div>


                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                        key={i + 1}
                        className={`w-10 h-10 rounded-full ${currentPage === i + 1
                            ? "bg-primary text-white"
                            : "bg-white text-primary-dark border-0"
                            }`}
                        onClick={() => goToPage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>
        </div >
    );
};

export default Courses;
