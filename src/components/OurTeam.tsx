import { motion } from 'framer-motion';
import { CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Import leader images
import walaaImg from "@/assets/team/walaa.jpg";
import amrImg from '@/assets/team/amr.jpg';
import mariamImg from '@/assets/team/mariam.jpg';
import mostafaImg from '@/assets/team/mostafa.jpg';
import baselImg from '@/assets/team/basel.jpg';
import abdelrahamanImg from '@/assets/team/abdelrahaman.jpg';
import alaaImg from '@/assets/team/alaa.jpg';

const trackHeads = [
  {
    id: 'ceo-founder',
    name: 'Mostafa Othman',
    role: 'CEO & Founder',
    avatar: mostafaImg,
  },
  {
    id: 'co-founder',
    name: 'Eng. Mariam Saad',
    role: 'Co-Founder & Head of Strategy',
    avatar: mariamImg,
  },
  {
    id: 'cto',
    name: 'Eng. Abdelrahman Ibrahim',
    role: 'Co-Founder & CTO',
    avatar: abdelrahamanImg,
  },
  {
    id: 'deputy-ceo',
    name: 'Eng. Walaa Waleed',
    role: 'Deputy to CSO & Operations Manager',
    avatar: walaaImg,
  },
  {
    id: 'network-engineer',
    name: 'Eng. Basel Anas',
    role: 'Network Engineer & Deputy Ops Manager',
    avatar: baselImg,
  },
  {
    id: 'legal-advisor',
    name: 'Mr. Amr Mostafa',
    role: 'Legal Advisor & Corporate Counsel',
    avatar: amrImg,
  },
  {
    id: 'network-support',
    name: 'Eng. Alaa Hamdi',
    role: 'Network Support Specialist & Senior Application Engineering ERP',
    avatar: alaaImg,
  },
];

export default function OurTeam() {
  return (
    <div className="min-h-screen" id="our-team">
      {/* Hero Section */}
      <section className="section-padding gradient-hero">
        <div className="container-custom text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl font-bold"
          >
            Our <span className="text-primary">Team</span>
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the passionate individuals who guide our education.
          </p>
        </div>
      </section>

      {/* Team Cards */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-10">
            {trackHeads.map((leader, index) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-full sm:w-[280px] md:w-[300px] lg:w-[500px]"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -6 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="card-gradient rounded-3xl overflow-hidden group relative shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-large)]"
                >
                  <CardContent className="p-8 flex flex-col items-center space-y-6">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="w-40 h-40 ring-4 ring-primary/40 group-hover:ring-primary/70 transition-all duration-500 shadow-lg overflow-hidden">
                        <AvatarImage
                          src={leader.avatar}
                          alt={leader.name}
                          className="object-contain w-full h-full"
                        />
                        <AvatarFallback className="bg-primary/20 text-xl font-bold">
                          {leader.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Glow under avatar */}
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-2 bg-primary/60 rounded-full blur-lg opacity-60 group-hover:opacity-90 transition-all duration-500"></span>
                    </div>

                    {/* Name + Role */}
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {leader.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {leader.role}
                      </p>
                    </div>
                  </CardContent>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
