import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XCircle, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CustomDialog from "@/components/CustomDialog";

const BASE_API = import.meta.env.VITE_BASE_API;

interface Admin {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  dateOfCreation: string;
}

const Admins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const adminsPerPage = 5;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          toast.error("لا يوجد صلاحيات للدخول (token مفقود)");
          return;
        }

        const res = await fetch(`${BASE_API}/Account/GetAllAdmins`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("فشل في جلب الأدمن");

        const data = await res.json();
        setAdmins(data);
      } catch (error) {
        toast.error("خطأ أثناء جلب الأدمن");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedAdminId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    console.log("CONFIRM DELETE TRIGGERED");
    if (!selectedAdminId) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${BASE_API}/Account/DeleteUser?Id=${selectedAdminId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("فشل الحذف");

      setAdmins((prev) => prev.filter((admin) => admin.id !== selectedAdminId));
      toast.success("تم حذف الأدمن بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setOpenDialog(false);
      setSelectedAdminId(null);
    }
  };

  // Pagination logic
  const indexOfLastAdmin = page * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(admins.length / adminsPerPage);

  return (
    <div className="container-custom section-padding p-8 mt-16 lg:mt-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-arabic-bold text-white text-right">الأدمن</h1>
        <Link to="/admins/add-admin">
          <Button className="bg-primary text-white flex items-center gap-2">
            <Plus className="w-5 h-5" /> إضافة أدمن
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card-dark max-w-6xl mx-auto"
      >
        {loading ? (
          <p className="text-center text-gray-400 p-6">جار التحميل...</p>
        ) : (
          <>
            {/* Table for Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-3">#</th>
                    <th className="p-3">الاسم</th>
                    <th className="p-3">الإيميل</th>
                    <th className="p-3">الرقم</th>
                    <th className="p-3">تاريخ التسجيل</th>
                    <th className="p-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAdmins.map((admin, index) => (
                    <tr key={admin.id} className="border-b border-gray-300 hover:bg-gray-100/10 transition">
                      <td className="p-3">{indexOfFirstAdmin + index + 1}</td>
                      <td className="p-3">{admin.userName}</td>
                      <td className="p-3">{admin.email}</td>
                      <td className="p-3">{admin.phoneNumber}</td>
                      <td className="p-3">{admin.dateOfCreation}</td>
                      <td className="p-3 flex justify-center gap-2">
                        <Button
                          onClick={() => handleDeleteClick(admin.id)}
                          className="bg-[#C30005] text-white flex items-center gap-2"
                        >
                          <XCircle className="w-5 h-5" /> حذف
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-gray-400">
                        لا يوجد أدمن حاليا
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards for Mobile */}
            <div className="md:hidden space-y-4">
              {currentAdmins.map((admin, index) => (
                <div key={admin.id} className="border border-gray-700 rounded-xl p-4 bg-gray-900 text-white">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-white">#{indexOfFirstAdmin + index + 1}</span>
                    <span className="text-sm text-gray-400">{admin.dateOfCreation}</span>
                  </div>
                  <p className="mb-1">👤 {admin.userName}</p>
                  <p className="mb-1">📧 {admin.email}</p>
                  <p className="mb-3">📞 {admin.phoneNumber}</p>
                  <div className="flex gap-2">
                    <Button onClick={() => handleDeleteClick(admin.id)} className="bg-[#C30005] text-white flex-1">
                      <XCircle className="w-4 h-4 mr-1" /> حذف
                    </Button>
                  </div>
                </div>
              ))}
              {admins.length === 0 && <p className="text-gray-400 text-center">لا يوجد أدمن حاليا</p>}
            </div>
          </>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-full ${page === i + 1 ? "bg-primary text-white" : "bg-white text-primary-dark"}`}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full bg-white text-primary-dark border-0"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Dialog */}
      <CustomDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="تأكيد حذف الأدمن"
        description="هل أنت متأكد أنك تريد حذف هذا الأدمن؟ هذا الإجراء لا يمكن التراجع عنه."
        confirmText="حذف"
        cancelText="إلغاء"
        onConfirm={confirmDelete}
        icon={<XCircle className="w-12 h-12 text-red-500" />}
      />
    </div>
  );
};

export default Admins;
