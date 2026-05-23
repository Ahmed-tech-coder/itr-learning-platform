import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LogOut,
  Home,
  BookOpen,
  CreditCard,
  Gift,
  User,
  Menu,
  FileQuestion,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const navigationItems = [
    { to: "/dashboard", label: "الرئيسية", icon: Home },
    { to: "/my-courses", label: "كورساتي", icon: BookOpen },
    { to: "/paid-courses", label: "الكورسات المدفوعة", icon: CreditCard },
    { to: "/free-courses", label: "الكورسات المجانية", icon: Gift },
    { to: "/exam", label: "الإختبارات", icon: FileQuestion },
    { to: "/profile", label: "الصفحة الشخصية", icon: User },
  ];

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/")
  };

  return (
    <>
      {/* Mobile Menu Icon */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-sidebar text-white shadow-lg"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-80 bg-sidebar fixed right-0 top-0 flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center p-10">
          <Link to="/">
            <img src={logo} alt="ITR Education" className="rounded-full" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-8">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                      ? "bg-white text-sidebar"
                      : "text-white border border-white/20 hover:bg-white/10"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xl font-bold">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 border border-red-500/50 rounded-lg hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar (Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}

          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="absolute right-0 top-0 h-screen w-72 bg-sidebar shadow-xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Logo */}
              <div className="flex items-center justify-center p-8">
                <img src={logo} alt="ITR Education" className="rounded-full" />
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6">
                <ul className="space-y-6">
                  {navigationItems.map((item) => (
                    <li key={item.to}>
                      <button
                        onClick={() => {
                          navigate(item.to);
                          setIsOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.to
                            ? "bg-white text-sidebar"
                            : "text-white border border-white/20 hover:bg-white/10"
                          }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-lg font-bold">{item.label}</span>
                      </button>
                    </li>
                  ))}

                </ul>
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 border border-red-500/50 rounded-lg hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">تسجيل الخروج</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
