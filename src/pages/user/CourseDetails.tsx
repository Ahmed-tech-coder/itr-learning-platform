import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, CircleDollarSign, ShoppingCart, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useState } from 'react';

const BASE_API = import.meta.env.VITE_BASE_API;
const BASE_API_IMAGES = import.meta.env.VITE_BASE_IMAGES;

const DescriptionModal = ({ open, onClose, description }: { open: boolean, onClose: () => void, description: string }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-black text-xl font-bold mt-10 mb-4">وصف الكورس</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </motion.div>
    </div>
  );
};


const CourseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course: courseData } = location.state || {};
  const [modalOpen, setModalOpen] = useState(false);

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <p className="text-xl font-bold text-gray-700 mb-4">
          لا توجد بيانات للكورس
        </p>
        <Button onClick={() => navigate(-1)} className="bg-primary text-white">
          الرجوع
        </Button>
      </div>
    );
  }

  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("لا يوجد صلاحيات للدخول (token مفقود)");
        return;
      }

      const response = await fetch(`${BASE_API}/UserCourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: courseData.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "حدث خطأ أثناء الاشتراك في الكورس");
        return;
      }


      if (courseData.type === 'Paid') {
        // الكورس مدفوع
        const message = encodeURIComponent(
          `السلام عليكم ورحمة الله وبركاته، لو سمحت عايز اشترك في كورس ${courseData.name}`
        );
        const whatsappUrl = `https://wa.me/201114049961?text=${message}`;
        window.open(whatsappUrl, "_blank");
      } else {
        // الكورس مجاني
        toast.success("تم الاشتراك في الكورس المجاني بنجاح");
      }

      navigate("/my-courses");

    } catch (error) {
      console.error(error);
      toast.error("خطأ في الاتصال بالسيرفر");
    }
  };


  return (
    <div className="relative min-h-screen flex flex-col items-center gap-12 p-4 sm:p-6 lg:p-12">
      {/* العنوان */}
      <div className='text-black text-xl lg:text-3xl'>
        <h1>تفاصيل الكورس &gt; <span className='text-primary font-bold'>{courseData.name}</span></h1>
      </div>

      {/* الكارد */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row-reverse w-full max-w-5xl"
      >
        {/* الصورة */}
        <div className="lg:w-1/2 h-64 sm:h-80 lg:h-auto">
          <img
            src={`${BASE_API_IMAGES}/Images/${courseData.imageUrl}`}
            alt={courseData.name}
            className="w-full h-full object-cover lg:rounded-l-2xl"
          />
        </div>


        <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{courseData.name}</h1>

        
            <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
              {courseData.description.length > 150
                ? `${courseData.description.slice(0, 150)}...`
                : courseData.description}
            </p>
            {courseData.description.length > 150 && (
              <Button className='text-black' size="sm" variant="outline" onClick={() => setModalOpen(true)}>
                اقرأ المزيد....
              </Button>
            )}

            {/* تفاصيل تحت الوصف */}
            <div className="flex flex-wrap items-center gap-6 mt-6">

              {courseData.type === 'Paid' && (
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <CircleDollarSign className="h-5 w-5 text-green-600" />
                  <span>{courseData.price} $</span>
                </div>
              )}
            </div>
          </div>

          {/* زر الشراء */}
          <Button
            onClick={handlePurchase}
            className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-base sm:text-lg mt-6 flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5" />
            شراء الكورس الآن
          </Button>
        </div>
      </motion.div>

      {/* المودال */}
      <DescriptionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        description={courseData.description}
      />
    </div>
  );
};
export default CourseDetails;
