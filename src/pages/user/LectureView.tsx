import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import { motion } from "framer-motion";
import AdvancedPlayer from "@/components/AdvancedPlayer";

const BASE_API = import.meta.env.VITE_BASE_API;
const BASE_API_IMAGES = import.meta.env.VITE_BASE_IMAGES;

const LectureView = () => {
  const { lectureId, courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("video");
  const [lecture, setLecture] = useState(null);
  const [lectures, setLectures] = useState([]);

  // Fetch all lectures for the course
  useEffect(() => {
    if (!courseId) return;
    const fetchLectures = async () => {
      try { 
        const res = await fetch(`${BASE_API}/Lecture/GetAllLecturesForCourse?CourseId=${courseId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items;
        setLectures(items || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLectures();
  }, [courseId]);

  // Fetch current lecture
  useEffect(() => {
    if (!lectureId) return;
    const fetchLecture = async () => {
      try {
        const res = await fetch(`${BASE_API}/Lecture/GetLecture?LectureId=${lectureId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setLecture(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLecture();
  }, [lectureId]);

  if (!lecture) return <div className="text-white p-10">جارِ تحميل المحاضرة...</div>;

  // Navigation logic
  const currentIndex = lectures.findIndex((l) => l.id === lecture.id);
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;

  const handleNavigate = (lec) => {
    if (!lec) return;
    navigate(`/course/${courseId}/lecture/${lec.id}`, { state: { lectures } });
  };

  return (
    <div className="p-6 pt-24 md:p-10">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{lecture.name}</h1>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-primary-card border-b border-primary/20 w-full flex justify-center gap-4 rounded-lg p-6">
            <TabsTrigger value="attachments" className="data-[state=active]:bg-primary data-[state=active]:text-white text-white/70 md:px-16 py-2 rounded-lg transition-all md:text-xl">
              📂 المرفقات
            </TabsTrigger>
            <TabsTrigger value="video" className="data-[state=active]:bg-primary data-[state=active]:text-white text-white/70 md:px-16 py-2 rounded-lg transition-all md:text-xl">
              🎥 الفيديو
            </TabsTrigger>
          </TabsList>

          {/* Video Section */}
          <div className={`mt-6 flex flex-col items-center space-y-6 ${activeTab === "video" ? "block" : "hidden"}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="bg-primary-card rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl">
              <div className="aspect-video">
                <AdvancedPlayer key={lecture.id} lecture={lecture} />
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-4 w-full max-w-4xl mt-6">
              <Button onClick={() => handleNavigate(prevLecture)} disabled={!prevLecture} className="flex-1 md:flex-none bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg hover:opacity-90">
                <ChevronRight className="h-4 w-4 ml-2" />
                المحاضرة السابقة
              </Button>

              <Button onClick={() => handleNavigate(nextLecture)} disabled={!nextLecture} className="flex-1 md:flex-none bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg hover:opacity-90">
                المحاضرة التالية
                <ChevronLeft className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </div>

          {/* Attachments */}
          <TabsContent value="attachments" className="mt-6 space-y-6">
            {lecture.attachment && (
              <motion.div className="bg-primary-card rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">ملف المحاضرة</h3>
                    <p className="text-white/60 text-sm">تحميل الملف</p>
                  </div>
                </div>
                <Button size="sm" className=" bg-primary text-white hover:bg-primary/90">

                  <a className="flex justify-center p-4" href={`${BASE_API_IMAGES}Files/${lecture.attachment}`} target="_blank" rel="noopener noreferrer">
                    <span>
                      تحميل
                    </span>
                    <Download className="h-4 w-4 ml-2" />
                  </a>

                </Button>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default LectureView;
