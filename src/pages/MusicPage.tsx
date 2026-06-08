import { motion } from 'motion/react';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Music, Disc3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const recentlyPlayed = [
  { id: 1, title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', duration: '4:03', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop' },
  { id: 2, title: 'Starboy', artist: 'The Weeknd, Daft Punk', album: 'Starboy', duration: '3:50', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop' },
  { id: 3, title: 'Instant Crush', artist: 'Daft Punk, Julian Casablancas', album: 'Random Access Memories', duration: '5:38', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' },
  { id: 4, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=300&h=300&fit=crop' },
  { id: 5, title: 'Resonance', artist: 'HOME', album: 'Odyssey', duration: '3:32', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' },
];

const playlists = [
  { id: 'p1', name: 'Coding Focus', tracks: 142, color: 'from-blue-500 to-cyan-500' },
  { id: 'p2', name: 'Late Night Drives', tracks: 86, color: 'from-purple-500 to-pink-500' },
  { id: 'p3', name: 'Synthwave Essentials', tracks: 215, color: 'from-orange-500 to-red-500' },
  { id: 'p4', name: 'Chill Vibes', tracks: 94, color: 'from-emerald-500 to-teal-500' },
];

export const MusicPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTrack = recentlyPlayed[0];

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: 'url(https://static.axtn.net/dash/svg/bg2.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto'
        }}
      />

      {/* Ambient Glow from current track */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-20 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Player & Playlists */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-6"
          >
            <button 
              onClick={() => navigate('/')}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
            >
              <ArrowLeft className="w-6 h-6 text-white/70 group-hover:text-white" />
            </button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Music</h1>
            </div>
          </motion.div>

          {/* Now Playing Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl"
          >
            <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative group shadow-2xl shadow-black/50">
              <img src={currentTrack.cover} alt={currentTrack.album} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Disc3 className="w-16 h-16 text-white/80 animate-spin-slow" />
              </div>
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold truncate">{currentTrack.title}</h2>
                <p className="text-white/60 text-sm mt-1">{currentTrack.artist}</p>
              </div>
              <button className="p-2 text-white/50 hover:text-pink-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white w-1/3 rounded-full relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/40 mt-2">
                <span>1:24</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-4">
              <button className="text-white/50 hover:text-white transition-colors"><Volume2 className="w-5 h-5" /></button>
              <div className="flex items-center gap-6">
                <button className="text-white/70 hover:text-white transition-colors"><SkipBack className="w-6 h-6 fill-current" /></button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>
                <button className="text-white/70 hover:text-white transition-colors"><SkipForward className="w-6 h-6 fill-current" /></button>
              </div>
              <button className="text-white/50 hover:text-white transition-colors"><Music className="w-5 h-5" /></button>
            </div>
          </motion.div>

          {/* Playlists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white/80">Your Playlists</h3>
            <div className="grid grid-cols-2 gap-4">
              {playlists.map(playlist => (
                <div key={playlist.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${playlist.color} mb-3 shadow-lg group-hover:scale-110 transition-transform`} />
                  <h4 className="font-medium text-sm truncate">{playlist.name}</h4>
                  <p className="text-xs text-white/40 mt-1">{playlist.tracks} tracks</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Recently Played List */}
        <div className="w-full lg:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md h-full"
          >
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-bold">Recently Played</h3>
                <p className="text-white/50 text-sm mt-1">Based on your listening history</p>
              </div>
              <button className="text-sm font-mono text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider">See All</button>
            </div>

            <div className="flex flex-col gap-2">
              {recentlyPlayed.map((track, index) => (
                <div 
                  key={track.id} 
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="w-6 text-center text-white/30 font-mono text-sm group-hover:hidden">{index + 1}</div>
                  <div className="w-6 text-center hidden group-hover:block text-white"><Play className="w-4 h-4 fill-current mx-auto" /></div>
                  
                  <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-md object-cover shadow-md" />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate group-hover:text-purple-400 transition-colors">{track.title}</h4>
                    <p className="text-sm text-white/50 truncate">{track.artist}</p>
                  </div>
                  
                  <div className="hidden sm:block w-1/3 text-sm text-white/40 truncate pr-4">
                    {track.album}
                  </div>
                  
                  <div className="text-sm font-mono text-white/40 w-12 text-right">
                    {track.duration}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
