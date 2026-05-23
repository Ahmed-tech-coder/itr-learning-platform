import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'الرئيسية', href: '/' },
    { name: 'فريقنا', href: '#our-team' },
    { name: 'نبذة عنا', href: '#about' },
    { name: 'لماذا تختارنا', href: '#why-choose-us' },
    { name: 'بعض الآراء', href: '#testimonials' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.hash === href;
  };

  return (
    <nav className="p-6 sticky top-0 z-50 border-b border-primary/20 backdrop-blur ">
      <div className="lg:container-custom">
        <div className="flex items-center justify-between ">

          {/* Login Button */}
          <div className="hidden md:block">
            <Link
              to="/login"
              className="btn-outline py-2 px-8 text-xl font-[900]"
            >
              تسجيل دخول
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12 rtl:space-x-reverse rounded-2xl border border-primary px-32 py-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-3xl font-semibold transition-colors duration-200 no-underline
                  ${isActive(item.href)
                    ? 'text-primary'
                    : 'text-primary/70 hover:text-primary'}`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <img src={logo} alt="ITR Education" className="rounded-full h-16 w-32 lg:h-auto lg:w-auto" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-primary/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu with Framer Motion */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden mt-3 bg-primary-dark rounded-2xl shadow-lg p-10 border border-primary/20"
            >
              <div className="flex flex-col space-y-4 items-center ">
                {navItems.map((item, idx) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className={`block text-lg font-semibold transition-colors duration-200 no-underline
                      ${isActive(item.href)
                        ? 'text-primary'
                        : 'text-primary/70 hover:text-primary'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className='flex justify-center'
                >
                  <Link
                    to="/login"
                    className="btn-outline text-center py-2 px-16"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    تسجيل الدخول
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
