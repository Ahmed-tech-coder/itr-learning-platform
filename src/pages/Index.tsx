import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import OurTeam from '@/components/OurTeam';
import About from '@/components/About';
import WhyChooseUs from '@/components/WhyChooseUs';
import Courses from '@/components/Courses';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background-dark lg:overflow-visible">
      <Navbar />
      <Hero />
      <OurTeam />
      <About />
      <WhyChooseUs />
      <Courses />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
