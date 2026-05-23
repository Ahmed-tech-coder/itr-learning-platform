import { motion } from "framer-motion";
import aboutMain from "@/assets/about-main.jpg";
import aboutSmall1 from "@/assets/about-small1.jpg";
import aboutSmall2 from "@/assets/about-small2.jpg";

const About = () => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-background-dark">
      <div className="container-custom">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-arabic-bold text-white inline-block border-b-4 border-primary pb-4 lg:pb-6">
            نبذة عن ITR
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="space-y-8 text-center lg:text-right"
          >
            <div className="space-y-6 text-center">
              <h3 className="text-xl lg:text-2xl font-arabic-semibold text-primary mb-6">
                نقدم شروحات تعليمية مبسطة تغطي أهم المقررات في مجال الشبكات وأمن المعلومات، مثل:
              </h3>

              <ul className="text-white space-y-3 font-arabic-medium">
                <li>📘 T216A – أساسيات الشبكات</li>
                <li>📘 T216B – الشبكات المتقدمة (CCNA)</li>
                <li>📘 T316 – الشبكات المتقدمة</li>
                <li>📘 T318 – التشفير وأمن المعلومات</li>
              </ul>

              <hr
                className="border-t-4 mt-6 mb-6 mx-auto w-2/3 lg:w-96 lg:mx-auto"
                style={{ borderColor: "#0000F4" }}
              />

              <div className="space-y-6 text-center">
                <h4 className="text-lg lg:text-xl font-arabic-semibold text-primary">
                  ونوفر لك في هذه المقررات:
                </h4>
                <ul className="text-white space-y-2 font-arabic-medium list-disc list-inside">
                  <li>المساعدة في فهم المواد وحل الواجبات.</li>
                  <li>شرح وتوضيح التجميعات الخاصة بالميدتيرم والفاينال.</li>
                  <li>تدريب عملي واختبارات لتقييم مستواك.</li>
                  <li>تأهيل شامل قبل الاختبارات لضمان استعدادك.</li>
                  <li>دعمك بــ ملخصات ذهبية وتوقعات قوية تساعدك على الوصول للفل مارك باذن الله.</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Images Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {/* Right Column - One Tall Image */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-xl mt-24"
            >
              <img
                src={aboutMain}
                alt="قاعة التعلم التقنية"
                className="w-80 h-full object-cover shadow-large"
              />
              <div className="absolute inset-0 from-background-darkest/60 to-transparent"></div>
            </motion.div>

            {/* Left Column - Two Small Images */}
            <div className="space-y-6 relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="absolute left-0 lg:-top-32 lg:left-52 overflow-hidden rounded-xl"
              >
                <img
                  src={aboutSmall1}
                  alt="غرفة الخوادم والشبكات"
                  className="w-40 h-40 lg:h-48 lg:w-48 object-cover shadow-medium"
                />
                <div className="absolute inset-0 from-background-darkest/60 to-transparent"></div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-xl absolute -bottom-16 left-0 lg:-bottom-10 lg:left-72"
              >
                <img
                  src={aboutSmall2}
                  alt="محلل أمن المعلومات"
                  className="w-40 h-40 lg:h-40 lg:w-40 object-cover shadow-medium"
                />
                <div className="absolute inset-0 from-background-darkest/60 to-transparent"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Disclaimer Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-32 text-center lg:text-right col-span-full"
          >
            <hr className="border-t-4 border-primary/50 mb-6 w-full lg:w-2/3 mx-auto lg:mx-0" />
            <h4 className="text-xl lg:text-2xl font-arabic-bold text-primary mb-4">
              ⚖ إخلاء مسؤولية / Disclaimer
            </h4>
            <p className="text-white text-sm lg:text-base leading-relaxed">
              شركة ITR للتواصل وأمن المعلومات مسجلة رسميًا في مصر (سجل تجاري رقم 12590) وعضو في غرفة صناعة تكنولوجيا المعلومات والاتصالات – اتحاد الصناعات المصرية. <br />
              المحتوى التعليمي والدورات المقدمة عبر هذا الموقع تهدف إلى تطوير المهارات العملية والعلمية في مجال الشبكات وأمن المعلومات، وهي شهادات حضور/تدريب صادرة عن ITR فقط، وليست شهادات أكاديمية صادرة من وزارة التعليم العالي أو أي جامعة حكومية/خاصة.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
