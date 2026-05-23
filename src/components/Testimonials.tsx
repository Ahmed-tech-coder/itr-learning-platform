import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import testimonialImg from "@/assets/testimonails.png";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Ahmed Magdy",
      role: "طالب جامعة - تخصص أمن المعلومات",
      content:
        "منصة ITR ساعدتني كثيراً في فهم مقررات الجامعة العربية المفتوحة. الشرح واضح والمحتوى منظم بطريقة ممتازة. حصلت على درجات عالية بفضل الدورات المقدمة.",
      avatar: testimonialImg,
    },
    {
      id: 2,
      name: "Ahmed Magdy",
      role: "مهندس شبكات",
      content:
        "استطعت الحصول على شهادة CCNA بفضل الدورة الشاملة المقدمة في ITR. المدربون محترفون والمحتوى محدث ويواكب أحدث التقنيات في عالم الشبكات.",
      avatar: testimonialImg,
    },
    {
      id: 3,
      name: "Ahmed Magdy",
      role: "محلل أمن معلومات",
      content:
        "دورة القرصنة الأخلاقية كانت تجربة رائعة. تعلمت تقنيات متقدمة في اختبار الاختراق وأصبحت أكثر خبرة في مجال أمن المعلومات. أنصح بها بشدة.",
      avatar: testimonialImg,
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const current = testimonials[currentTestimonial];

  return (
    <section
      id="testimonials"
      className="section-padding bg-background-dark relative"
    >
      <div className="container-custom">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-arabic-bold text-white mb-4 inline-block border-b-4 border-primary pb-2">
            الآراء
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="relative max-w-3xl mx-auto bg-gradient-to-b from-black to-black/20 backdrop-blur-sm rounded-3xl p-10 border border-primary/20 shadow-lg text-center"
            >
              {/* Quote Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-6 right-6 text-primary/30"
              >
                <Quote className="w-12 h-12" />
              </motion.div>

              {/* Avatar Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary-light shadow-md"
              >
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Name & Role */}
              <motion.h4
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-arabic-semibold text-primary-light mb-2"
              >
                {current.name}
              </motion.h4>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 mb-6"
              >
                {current.role}
              </motion.p>

              {/* Content */}
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg lg:text-xl text-white leading-relaxed font-arabic-medium"
              >
                "{current.content}"
              </motion.blockquote>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Arrows */}
          <div className="flex justify-center gap-4 mt-6 md:hidden">
            <button onClick={nextTestimonial} className="btn-gradient">
              <ChevronRight className="w-6 h-6" />
            </button>
            <button onClick={prevTestimonial} className="btn-gradient">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Arrows */}
          <button
            onClick={prevTestimonial}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 btn-gradient z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 btn-gradient z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
