import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const BASE_API = import.meta.env.VITE_BASE_API;

const ExamDetails = () => {
  const { examId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(
          `${BASE_API}/ExamResult/GetAllExamResultsForExam?ExamId=${examId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("فشل في جلب البيانات");
        }

        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [examId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-white">
        جاري تحميل النتائج...
      </div>
    );
  }

  return (
    <div className="container-custom section-padding p-8 mt-16 lg:mt-0 text-right">
      <h1 className="text-3xl font-arabic-bold mb-8 text-white">
        تفاصيل الاختبار
      </h1>

      {/* نتائج الطلاب */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card-dark max-w-7xl mx-auto"
      >
        <h2 className="text-xl font-bold text-white mb-4">نتائج الطلاب</h2>

        {/* Table Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3">اسم الطالب</th>
                <th className="p-3">كود الطالب</th>
                <th className="p-3">رقم الطالب</th>
                <th className="p-3">بداية الحل</th>
                <th className="p-3">تاريخ التسليم</th>
                <th className="p-3">النتيجة</th>
                <th className="p-3">الإجابات الصحيحة</th>
                <th className="p-3">عدد الأسئلة</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res) => (
                <tr
                  key={res.userId}
                  className="border-b border-gray-300 hover:bg-gray-100/10 transition"
                >
                  <td className="p-3">{res.userName}</td>
                  <td className="p-3">{res.userCode}</td>
                  <td className="p-3">{res.phoneNumber}</td>
                  <td className="p-3">
                    {new Date(res.startSolution).toLocaleString("ar-EG")}
                  </td>
                  <td className="p-3">
                    {new Date(res.endSolution).toLocaleString("ar-EG")}
                  </td>
                  <td className="p-3">{res.result}</td>
                  <td className="p-3">{res.correctAnswer}</td>
                  <td className="p-3">{res.numberOfQuestion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {results.map((res) => (
            <div
              key={res.userId}
              className="border border-gray-700 rounded-xl p-4 bg-gray-900 text-white"
            >
              <p className="mb-1">
                👤 {res.userName} ({res.userCode})
              </p>
              <p className="mb-1">
                🟢 بداية:{" "}
                {new Date(res.startSolution).toLocaleString("ar-EG")}
              </p>
              <p className="mb-1">
                📅 تسليم: {new Date(res.endSolution).toLocaleString("ar-EG")}
              </p>
              <p className="mb-1">
                ✅ الإجابات الصحيحة: {res.correctAnswer}/{res.numberOfQuestion}
              </p>
              <p className="mb-1">🏆 النتيجة: {res.result}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ExamDetails;
