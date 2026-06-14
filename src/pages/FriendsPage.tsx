import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Heart, Link2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FRIENDS, FRIEND_LINKS, type Friend } from '../data/friends';
import { MusicWidget } from '../components/music/MusicWidget';

const isLink = (url?: string): url is string => !!url && url !== '#';

function FriendAvatar({ friend }: { friend: Friend }) {
  if (friend.avatar) {
    return (
      <img
        src={friend.avatar}
        alt={friend.name}
        referrerPolicy="no-referrer"
        className="h-16 w-16 rounded-2xl object-cover ring-1 ring-white/15"
      />
    );
  }
  return (
    <div
      className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white/90 ring-1 ring-white/15"
      style={{ background: `linear-gradient(135deg, ${friend.accent}, ${friend.accent}55)` }}
    >
      {friend.name.slice(0, 1)}
    </div>
  );
}

function FriendCard({ friend, index }: { friend: Friend; index: number }) {
  const Wrapper = isLink(friend.url) ? motion.a : motion.div;
  return (
    <Wrapper
      {...(isLink(friend.url) ? { href: friend.url, target: '_blank', rel: 'noreferrer' } : {})}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
    >
      {/* Accent glow */}
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ backgroundColor: friend.accent }}
      />
      <div className="relative shrink-0">
        <FriendAvatar friend={friend} />
      </div>
      <div className="relative min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-lg font-semibold text-white">{friend.name}</h3>
          {friend.handle && (
            <span className="truncate font-mono text-xs text-white/35">{friend.handle}</span>
          )}
        </div>
        {friend.role && <p className="mt-0.5 truncate text-sm text-white/50">{friend.role}</p>}
      </div>
      {isLink(friend.url) && (
        <ArrowUpRight className="relative h-5 w-5 shrink-0 text-white/25 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70" />
      )}
    </Wrapper>
  );
}

export const FriendsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] font-sans text-white selection:bg-pink-500/30">
      {/* Ambient warm glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-20 top-0 h-[420px] w-[420px] rounded-full bg-pink-500/10 blur-[140px]" />
        <div className="absolute -right-20 top-40 h-[460px] w-[460px] rounded-full bg-indigo-500/10 blur-[150px]" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a]/70 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="-ml-2 rounded-full p-2 transition-colors hover:bg-white/10"
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-medium">朋友 · Friends</h1>
        </div>
        <MusicWidget />
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-10 sm:pt-14">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white/45">
            <Heart className="h-3.5 w-3.5 text-pink-400" /> 山高水长 · 后会有期
          </span>
          <h2 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            一路同行的
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              朋友与友链
            </span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
            这里记录与我相识、相伴、相互启发的人，以及那些值得反复造访的小站。
          </p>
        </motion.div>

        {/* Friends */}
        <section className="mt-14">
          <div className="mb-5 flex items-center gap-2.5">
            <Users className="h-4 w-4 text-pink-400" />
            <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">Friends · 朋友</h3>
            <span className="font-mono text-xs text-white/25">{FRIENDS.length}</span>
            <span className="ml-2 h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FRIENDS.map((f, i) => (
              <FriendCard key={f.name} friend={f} index={i} />
            ))}
          </div>
        </section>

        {/* Friend links */}
        <section className="mt-16">
          <div className="mb-5 flex items-center gap-2.5">
            <Link2 className="h-4 w-4 text-indigo-400" />
            <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">Links · 友链</h3>
            <span className="font-mono text-xs text-white/25">{FRIEND_LINKS.length}</span>
            <span className="ml-2 h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FRIEND_LINKS.map((link, i) => {
              const clickable = isLink(link.url);
              const Wrapper = clickable ? motion.a : motion.div;
              return (
                <Wrapper
                  key={link.name}
                  {...(clickable ? { href: link.url, target: '_blank', rel: 'noreferrer' } : {})}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
                  className="group relative flex items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
                >
                  <span
                    className="mt-1 h-full w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: link.accent }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="truncate font-semibold text-white">{link.name}</h4>
                      {clickable && (
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-white/25 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70" />
                      )}
                    </div>
                    {link.desc && <p className="mt-1 truncate text-xs text-white/45">{link.desc}</p>}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </section>

        <p className="mt-16 text-center font-mono text-[11px] text-white/25">
          想交换友链？欢迎通过主页的社交方式联系我 ✦
        </p>
      </main>
    </div>
  );
};
