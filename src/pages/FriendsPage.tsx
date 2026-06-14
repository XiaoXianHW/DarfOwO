import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FRIENDS, FRIEND_LINKS, FRIENDS_TAGLINE, type Friend } from '../data/friends';
import { MusicWidget } from '../components/music/MusicWidget';

// Per-card accents so the wall feels lively without gradients everywhere.
const ACCENTS = ['#fb7185', '#818cf8', '#34d399', '#fbbf24', '#22d3ee', '#f472b6', '#a3e635'];

const host = (u?: string) => {
  if (!u) return '';
  try {
    return new URL(u).host.replace(/^www\./, '');
  } catch {
    return u;
  }
};

function FriendAvatar({ friend }: { friend: Friend }) {
  const [failed, setFailed] = useState(false);
  if (friend.avatar && !failed) {
    return (
      <img
        src={friend.avatar}
        alt={friend.name}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/10"
      />
    );
  }
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white/80 ring-1 ring-white/10">
      {[...friend.name][0]?.toUpperCase() ?? '♪'}
    </div>
  );
}

function SectionHead({ title, label, count }: { title: string; label: string; count: number }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-5 w-1 rounded-full bg-[#fb7185]" />
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <span className="font-mono text-[11px] tracking-[0.3em] text-white/25">{label}</span>
      <span className="font-mono text-xs tabular-nums text-white/30">{count}</span>
      <span className="ml-1 h-px flex-1 bg-white/5" />
    </div>
  );
}

export const FriendsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] font-sans text-white selection:bg-[#fb7185]/30">
      {/* Single soft top wash — restrained, not neon. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-64 bg-gradient-to-b from-[#fb7185]/[0.07] to-transparent" />

      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 pt-6 lg:px-10 lg:pt-8">
        <button
          onClick={() => navigate('/')}
          className="-ml-2 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <MusicWidget />
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-6 lg:px-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">朋友</h1>
          <div className="mt-3 flex items-center gap-2 text-white/45">
            <span className="font-mono text-[11px] tracking-[0.4em] text-white/30">FRIENDS</span>
            <span className="h-3 w-px bg-white/15" />
            <span className="text-sm">{FRIENDS_TAGLINE}</span>
          </div>
        </motion.div>

        {/* Friends — avatar cards */}
        <SectionHead title="朋友" label="MUTUALS" count={FRIENDS.length} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FRIENDS.map((f, i) => (
            <motion.a
              key={f.name}
              href={f.link}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: 'easeOut' }}
              className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
            >
              <FriendAvatar friend={f} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{f.name}</p>
                {f.description && (
                  <p className="mt-0.5 truncate font-mono text-[11px] text-white/40">
                    {f.description}
                  </p>
                )}
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-white/20 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70" />
            </motion.a>
          ))}
        </div>

        {/* Friend links — pill cloud (XiaoXian site network) */}
        <div className="mt-14">
          <SectionHead title="友链" label="NETWORK" count={FRIEND_LINKS.length} />
          <div className="flex flex-wrap gap-2.5">
            {FRIEND_LINKS.map((link, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.04, ease: 'easeOut' }}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-3 pr-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.07]"
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
                  <span className="text-sm font-medium text-white/90">{link.name}</span>
                  <span className="font-mono text-[10px] text-white/30 transition-colors group-hover:text-white/50">
                    {host(link.url)}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/20 transition-colors group-hover:text-white/70" />
                </motion.a>
              );
            })}
          </div>
        </div>

        <p className="mt-14 font-mono text-[11px] tracking-wider text-white/25">
          想交换友链？欢迎通过主页的社交方式找我 ✦
        </p>
      </main>
    </div>
  );
};
