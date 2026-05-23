import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#A4B1FF] md:flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen md:mr-80">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;