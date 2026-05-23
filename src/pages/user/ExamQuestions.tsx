import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BASE_API = import.meta.env.VITE_BASE_API;

const ExamQuestions = () => {
    const location = useLocation();
    const { exam } = location.state || {};
    const { examId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [startSolution, setStartSolution] = useState<string>("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            toast.error("لا يوجد صلاحيات للدخول (token مفقود)");
            return;
        }

        setStartSolution(new Date().toISOString());

        const fetchQuestions = async () => {
            try {
                const res = await fetch(
                    `${BASE_API}/Question/GetAllExamQuestions?examId=${examId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Error fetching questions:", res.status, errorText);
                    toast.error("فشل في تحميل الأسئلة");
                    return;
                }

                const data = await res.json();
                setQuestions(data);
            } catch (err) {
                console.error("Error:", err);
                toast.error("حدث خطأ غير متوقع");
            }
        };

        fetchQuestions();
    }, [examId, token]);

    const question = questions[currentIndex];
    const totalQuestions = questions.length;

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) setCurrentIndex((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };

    // اختيار إجابة
    const handleSelectAnswer = (questionId: number, choiceId: number) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: choiceId,
        }));
    };

    const handleFinishExam = async () => {
        setOpen(false);

        try {
            const endSolution = new Date().toISOString();

            let correctAnswer = 0;

            questions.forEach((q) => {
                const userAnswer = selectedAnswers[q.id];
                const correctChoice = q.choices.find((c: any) => c.isCorrect);

                if (userAnswer === correctChoice?.id) {
                    correctAnswer++;
                }
            });

            const result = correctAnswer * (exam?.questionDegree || 1);

            const payload = {
                examId: Number(examId),
                startSolution,
                endSolution,
                result,
                correctAnswer,
                numberOfQuestion: totalQuestions,
            };

            const res = await fetch(`${BASE_API}/ExamResult`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("Error submitting exam:", res.status, errText);
                toast.error("فشل في إنهاء الاختبار");
                return;
            }

            toast.success("تم إنهاء الاختبار وحفظ النتيجة ");
            navigate("/exam");
        } catch (err) {
            console.error("Error:", err);
            toast.error("حصل خطأ أثناء إرسال النتيجة");
        }
    };

    if (questions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24"
            >
                <AlertCircle className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-2xl lg:text-4xl font-arabic-bold text-white mb-4">
                    لا توجد أسئلة متاحة حاليًا
                </h3>
                <p className="text-gray-300 text-lg text-center max-w-md">
                    سيتم إضافة الأسئلة قريبًا، يرجى المحاولة لاحقًا.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="section-padding ">
           
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Right Side */}
                <div className="col-span-2 flex flex-col gap-8">
                    <Card className="card-dark p-8 space-y-8 shadow-xl border border-white/10">
                        {/* Question Header */}
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md">
                                {currentIndex + 1}
                            </div>
                            <h2 className="text-2xl font-arabic-semibold text-white leading-snug">
                                {question.content}
                            </h2>
                        </div>

                        {/* Render Question Choices */}
                        <div className="space-y-4">
                            {question.choices.map((choice: any) => (
                                <label
                                    key={choice.id}
                                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition border 
                  ${selectedAnswers[question.id] === choice.id
                                            ? "bg-primary/40 border-primary"
                                            : "bg-background-darkest/70 border-white/5 hover:bg-primary/20"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`q${question.id}`}
                                        checked={selectedAnswers[question.id] === choice.id}
                                        onChange={() => handleSelectAnswer(question.id, choice.id)}
                                        className="accent-primary w-4 h-4"
                                    />
                                    <span className="text-white">{choice.text}</span>
                                </label>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4">
                            <Button onClick={handlePrev} disabled={currentIndex === 0} className="btn-primary flex items-center gap-2 px-6 disabled:opacity-50">
                                <ChevronRight size={18} />
                                السابق
                            </Button>
                            <Button onClick={handleNext} disabled={currentIndex === totalQuestions - 1} className="btn-primary flex items-center gap-2 px-6 disabled:opacity-50">
                                التالي
                                <ChevronLeft size={18} />
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Left Side */}
                <motion.div
                    className="card-dark p-6 flex flex-col justify-between shadow-lg border border-white/10"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="space-y-6 ">
                        <h3 className="text-lg font-arabic-semibold text-white">
                            عدد الأسئلة:{" "}
                            <span className="text-primary-light text-lg font-bold">
                                {totalQuestions}
                            </span>
                        </h3>

                        {/* Navigator */}
                        <div className="grid grid-cols-5 gap-3 max-h-64 overflow-y-auto pr-1">
                            {questions.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition ${i === currentIndex
                                        ? "bg-primary text-white shadow-lg"
                                        : "bg-background-darkest text-gray-300 hover:bg-primary/30"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* End Exam Button */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-red-600 hover:bg-red-700 mt-6 py-4 rounded-xl text-lg font-bold flex items-center gap-2">
                                <CheckCircle2 size={20} />
                                إنهاء الاختبار
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-background-dark text-white border border-white/10 rounded-xl w-96 lg:w-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center m-2 gap-2 text-xl text-red-500">
                                    <AlertTriangle size={22} />
                                    تأكيد إنهاء الاختبار
                                </DialogTitle>
                                <DialogDescription className="text-gray-300 mt-2">
                                    هل أنت متأكد أنك تريد إنهاء الاختبار الآن؟ لن تتمكن من تعديل إجاباتك بعد ذلك.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex justify-end gap-3 mt-6">
                                <Button className="text-black" variant="outline" onClick={() => setOpen(false)}>
                                    إلغاء
                                </Button>
                                <Button className="bg-red-600 hover:bg-red-700" onClick={handleFinishExam}>
                                    تأكيد الإنهاء
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </motion.div>
            </div>
        </div>
    );
};

export default ExamQuestions;
