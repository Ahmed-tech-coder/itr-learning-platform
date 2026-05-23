import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Edit,
    Trash2,
    Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BASE_API = import.meta.env.VITE_BASE_API;
const BASE_API_IMAGES = import.meta.env.VITE_BASE_IMAGES;

type Lecture = {
    id: number;
    name: string;
    duration: string;
    description: string;
    price: number;
    state: string; // Active | InActive
    image: string;
    folderId: string;
    folderName: string;
    qualities: string[];
};

const PAGE_SIZE = 6;

const CourseLectures = () => {
    const location = useLocation();
    const courseData = location.state?.course as Course | undefined;

    const { courseId } = useParams();
    const navigate = useNavigate();

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
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                }
            );

            if (!res.ok) throw new Error("فشل في جلب المحاضرات");

            const data = await res.json();

            if (data?.items) {
                setLectures(data.items);
                setTotalPages(data.totalPages || 1);
            } else if (Array.isArray(data)) {
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

    const handleDelete = async (lectureId: number) => {
        if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه المحاضرة؟")) return;

        try {
            const res = await fetch(`${BASE_API}/Lecture?Id=${lectureId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
            });

            if (!res.ok) throw new Error("فشل في حذف المحاضرة");

            toast.success("تم حذف المحاضرة بنجاح ✅");


            setLectures((prev) => prev.filter((lec) => lec.id !== lectureId));
        } catch (err) {
            toast.error("حدث خطأ أثناء حذف المحاضرة ❌");
        }
    };

    return (
        <div className="p-8 lg:p-16">
            {/* Title + Add Lecture Button */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-16 lg:mt-0 mb-12">
                <h1 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-0">
                    الكورس - <span className="font-bold text-primary">{courseData.name}</span>
                </h1>

                <Button
                    onClick={() =>
                        navigate("/courses/add-lecture", { state: { courseId } })
                    }
                    className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 rounded-lg px-6 py-2"
                >
                    <Plus className="w-4 h-4" />
                    إضافة محاضرة
                </Button>
            </div>

            {/* Lectures Grid */}
            {loading ? (
                <p className="text-white text-center">جاري تحميل المحاضرات...</p>
            ) : lectures.length === 0 ? (
                <p className="text-white text-center">لا توجد محاضرات لهذا الكورس</p>
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
                                    <Play className="w-5 h-5 text-white" />
                                </div>

                                <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold bg-white text-primary-dark">
                                    {(page - 1) * PAGE_SIZE + i + 1}
                                </div>
                            </div>

                            <div className="space-y-4 text-center p-4">
                                <h3 className="text-xl font-arabic-semibold text-white group-hover:text-primary-light transition-colors">
                                    {lecture.name}
                                </h3>

                                <p className="text-white/70 text-sm">{lecture.description}</p>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-center gap-4">

                                    <Button
                                        className="flex items-center gap-2 bg-[blue] text-white hover:bg-primary/90 hover:text-primary-light rounded-lg px-4 py-2"
                                        onClick={() => navigate(`/courses/${courseId}/lectures/${lecture.id}/lecture-view`)}
                                    >

                                        اطلاع
                                        <Edit className="w-4 h-4" />

                                    </Button>
                                    <Button
                                        className="flex items-center gap-2 bg-[orange] text-primary-dark hover:text-white rounded-lg px-4 py-2"
                                        onClick={() => navigate(`/courses/lectures/${courseId}/edit-lecture/${lecture.id}`, { state: { lecture } })}
                                    >

                                        تعديل
                                        <Edit className="w-4 h-4" />

                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex items-center gap-2 rounded-lg px-4 py-2"
                                        onClick={() => handleDelete(lecture.id)}
                                    >
                                        حذف
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                </div>
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
