import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BentoGrid } from '../components/devices/BentoGrid';

export const DevicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-blue-500/30">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: 'url(https://static.axtn.net/dash/svg/bg2.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 sm:py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Devices</h1>
          </div>
          <p className="text-white/40 font-mono text-xs uppercase tracking-widest hidden sm:block">Hardware Ecosystem</p>
        </motion.div>

        {/* Bento Grid */}
        <BentoGrid />
      </div>
    </div>
  );
};

