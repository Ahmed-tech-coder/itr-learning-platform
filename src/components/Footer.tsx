import { Facebook, Instagram, Youtube, MapPin } from 'lucide-react';
import { BsWhatsapp } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import footerBg from '@/assets/footer-bg.jpg';
import logo from '@/assets/logo.png';

const Footer = () => {
  const links = [
    { name: 'نبذة', href: '#about' },
    { name: 'لماذا تختارنا', href: '#why-choose-us' },
    { name: 'الكورسات', href: '#courses' },
    { name: 'الآراء', href: '#testimonials' },
  ];

  const socialIcons = [
    { icon: Facebook, href: 'https://www.facebook.com/share/15Hwhy44ic/', name: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/mostafa_othman_20', name: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/@itlearningksa?si=70gj59qSKcxg9j-r', name: 'Twitter' },
    { icon: BsWhatsapp, href: 'https://wa.me/+201114049961', name: 'WhatsApp' },
    { icon: MapPin, href: 'https://maps.app.goo.gl/4MSDC2K8t8Up9VGe7?g_st=iw', name: 'Location' },
  ];

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <footer
      className="relative bg-background-darkest text-white"
      style={{
        backgroundImage: `url(${footerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background-darkest/90"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="section-padding border-b border-primary/20">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-12 text-center lg:text-right">
              {/* Social Media */}
              <motion.div
                className="flex flex-col justify-between items-center order-3 lg:order-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
              >
                <h3 className="text-xl font-arabic-semibold text-primary-light mb-6">
                  تواصل معنا
                </h3>
                <div className="flex space-x-4" dir='ltr'>
                  {socialIcons.map((social, i) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="group"
                      aria-label={social.name}
                      variants={fadeUp}
                      custom={i + 1}
                      target='_blank'
                    >
                      <div className="p-3 bg-gradient-to-br from-primary to-primary-light rounded-full hover:scale-110 transition-all duration-300 shadow-medium hover:shadow-large">
                        <social.icon className="w-5 h-5 text-white" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                className="flex flex-col justify-between items-center  order-2 lg:order-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={1}
              >
                <h3 className="text-xl font-arabic-semibold text-primary-light mb-4">
                  روابط سريعة
                </h3>
                <ul className="space-y-4 flex flex-col items-center" >
                  {links.map((link, i) => (
                    <motion.li key={link.name} variants={fadeUp} custom={i + 2}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-primary-light transition-colors duration-300 flex items-center group"
                      >
                        <span className="ml-10 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact Info + Logo */}
              <motion.div
                className="lg:border-r lg:border-white/20 lg:pr-12 flex flex-col items-center text-center  space-y-6 order-1 lg:order-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={2}
              >
                <Link to="/" className="inline-block">
                  <img src={logo} alt="ITR Education" className="rounded-full h-16 w-auto" />
                </Link>
                <p className="text-gray-300 leading-relaxed max-w-sm">
                  ITR Education المتخصصة في تقديم أفضل الدورات في الشبكات وأمن المعلومات.
                  نحن ملتزمون بتقديم تعليم عالي الجودة يواكب أحدث التطورات التقنية.
                </p>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          className="py-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={3}
        >
          <div className="container-custom">
            <div className="flex flex-col justify-center items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-center md:text-right" dir="rtl">
                جميع الحقوق محفوظة © 2025 ITR Education
              </p>
              <p className="text-gray-400 text-center md:text-right" dir="rtl">
                تصميم وتطوير بواسطة&nbsp;
                <strong>
                  <a
                    className="text-primary-light font-bold"
                    href="https://wa.me/+201016148495"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ahmed Refaat 👨‍💻
                  </a>
                </strong>
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
