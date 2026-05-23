import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const BASE_API = import.meta.env.VITE_BASE_API;

type Exam = {
  id: number;
  title: string;
  duration: number;
  startTime: string;
  endTime: string;
  state: string;
  courseId: number;
  courseName: string;
};

type ExamResult = {
  userId: string;
  examId: number;
  examTitle: string;
  result: number;
  correctAnswer: number;
  numberOfQuestion: number;
};

const Exams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        toast.error("لا يوجد صلاحيات للدخول (token أو user مفقود)");
        return;
      }

      try {
        setLoading(true);

        const examsRes = await fetch(`${BASE_API}/Exam/GetAllExamsForUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!examsRes.ok) throw new Error("فشل تحميل الاختبارات");

        const examsData = await examsRes.json();

        const resultsRes = await fetch(
          `${BASE_API}/ExamResult/GetAllExamResultForUser?UserId=${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!resultsRes.ok) throw new Error("فشل تحميل النتائج");

        const resultsData = await resultsRes.json();

        setExams(examsData);
        setResults(resultsData);
      } catch (err) {
        console.error(err);
        toast.error("حصل خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getExamResult = (examId: number) =>
    results.find((r) => r.examId === examId);

  return (
    <div className="section-padding">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-arabic-bold text-white">الاختبارات المتاحة</h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">جارٍ تحميل الاختبارات...</p>
      ) : exams.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.map((exam, i) => {
            const result = getExamResult(exam.id);

            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="card-dark h-60 flex flex-col justify-between items-center text-center">
                  <div className="space-y-4">
                    <h3 className="text-xl font-arabic-semibold text-white">
                      {exam.title}
                    </h3>

                    <div className="flex items-center justify-center gap-2 text-gray-300">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>{exam.duration} دقيقة</span>
                    </div>

                    <p className="text-sm text-gray-400">{exam.courseName}</p>
                  </div>

                  {result ? (
                    <div className="text-green-400 flex flex-col items-center">
                      <CheckCircle2 className="w-6 h-6 mb-1" />
                      <p className="text-sm">
                        الدرجة: {result.result} / {result.numberOfQuestion * (result.result / result.correctAnswer)}
                      </p>
                      <p className="text-xs text-gray-400">
                        ({result.correctAnswer} إجابة صحيحة من {result.numberOfQuestion})
                      </p>
                    </div>
                  ) : (
                    <Link to={`/exam/${exam.id}/questions`} state={{ exam }}>
                      <Button className="btn-primary flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        بدء الاختبار
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Exams;
