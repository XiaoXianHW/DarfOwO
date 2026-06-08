import { motion } from 'motion/react';
import { ArrowLeft, Activity, Flame, Footprints, Moon, Droplets, Scale, Brain, Zap, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useHeartRate } from '../hooks/useHeartRate';

const heartRateData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: 60 + Math.random() * 40 + (i > 8 && i < 20 ? 20 : 0) // Higher during day
}));

const stepsData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  value: 4000 + Math.random() * 8000
}));

const sleepData = [
  { stage: 'Deep', value: 25, fill: '#6366f1' },
  { stage: 'Light', value: 50, fill: '#8b5cf6' },
  { stage: 'REM', value: 20, fill: '#d946ef' },
  { stage: 'Awake', value: 5, fill: '#f43f5e' }
];

const metrics = [
  { id: 'steps', label: 'Steps', value: '8,432', unit: 'steps', icon: Footprints, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'calories', label: 'Calories', value: '450', unit: 'kcal', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'sleep', label: 'Sleep', value: '7h 24m', unit: '', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'spo2', label: 'Blood Oxygen', value: '98', unit: '%', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 'weight', label: 'Weight', value: '68.5', unit: 'kg', icon: Scale, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'stress', label: 'Stress', value: 'Low', unit: '', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'vitality', label: 'Vitality', value: '85', unit: '/100', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
];

export const StatusPage = () => {
  const navigate = useNavigate();
  const heartRate = useHeartRate(true);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-green-500/30 pb-20">
      
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Health Status</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Main Heart Rate Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <HeartPulse className="w-5 h-5" />
                <span className="font-medium">Heart Rate</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">{heartRate}</span>
                <span className="text-white/50 font-medium">bpm</span>
              </div>
              <p className="text-sm text-white/40 mt-1">Resting: 62 bpm</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20">
              Normal
            </div>
          </div>

          <div className="h-40 w-full relative z-10 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heartRateData}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorHr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1a1a1a] rounded-3xl p-5 border border-white/5 flex flex-col justify-between aspect-[4/3]"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${metric.bg}`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <span className="text-sm font-medium text-white/70">{metric.label}</span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  {metric.unit && <span className="text-sm text-white/50 ml-1">{metric.unit}</span>}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Steps Chart Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-orange-400">
              <Footprints className="w-5 h-5" />
              <span className="font-medium">Weekly Steps</span>
            </div>
            <span className="text-sm text-white/50">Avg: 7,240</span>
          </div>
          
          <div className="h-48 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepsData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} dy={10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
