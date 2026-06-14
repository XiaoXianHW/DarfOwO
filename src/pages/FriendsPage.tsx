import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FRIENDS, FRIEND_LINKS } from '../data/friends';
import { Cover } from '../components/music/Cover';
import { MusicWidget } from '../components/music/MusicWidget';

const isLink = (url?: string): url is string => !!url && url !== '#';

function SectionHeader({ title, label, count }: { title: string; label: string; count: number }) {
  return (
    <div className="flex items-baseline gap-2 border-b border-white/10 px-3 pb-3 pt-1 lg:px-4">
      <h2 className="text-base font-bold">{title}</h2>
      <span className="font-mono text-[10px] tracking-[0.3em] text-white/25">{label}</span>
      <span className="ml-auto font-mono text-[11px] tabular-nums text-white/25">{count}</span>
    </div>
  );
}

export const FriendsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#0a0a0a] font-sans text-white selection:bg-[#fb7185]/30">
      {/* ===== Masthead ===== */}
      <header className="shrink-0 px-6 pt-7 lg:px-12 lg:pt-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 lg:gap-4">
            <button
              onClick={() => navigate('/')}
              className="-ml-1 shrink-0 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-black tracking-tight lg:text-4xl">朋友</h1>
            <span className="hidden translate-y-[3px] font-mono text-[10px] tracking-[0.4em] text-white/25 sm:inline lg:text-[11px]">
              FRIENDS&nbsp;&amp;&nbsp;LINKS
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
              <span className="font-mono text-sm font-bold tabular-nums text-white/90">
                {FRIENDS.length + FRIEND_LINKS.length}
              </span>
              <span className="text-xs text-white/45">位好友</span>
            </div>
            <MusicWidget />
          </div>
        </div>
      </header>

      {/* ===== Body ===== */}
      <motion.main
        className="mx-auto w-full max-w-3xl flex-1 px-3 pb-16 pt-8 lg:px-4 lg:pt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* Friends */}
        <SectionHeader title="朋友" label="FRIENDS" count={FRIENDS.length} />
        <div className="mt-1">
          {FRIENDS.map((f) => {
            const clickable = isLink(f.url);
            const Tag = clickable ? motion.a : motion.div;
            return (
              <Tag
                key={f.name}
                {...(clickable ? { href: f.url, target: '_blank', rel: 'noreferrer' } : {})}
                className="group relative flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-white/[0.04] lg:px-4"
              >
                <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[#fb7185] transition-all duration-200 group-hover:h-7" />
                <Cover
                  name={f.name}
                  cover={f.avatar}
                  circle
                  className="h-11 w-11 shrink-0 ring-1 ring-white/10"
                  textClass="text-base"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15px] font-semibold">{f.name}</p>
                    {f.handle && (
                      <span className="truncate font-mono text-[11px] text-white/30">{f.handle}</span>
                    )}
                  </div>
                  {f.role && <p className="mt-0.5 truncate text-[12px] text-white/40">{f.role}</p>}
                </div>
                {clickable && (
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-white/20 transition-colors group-hover:text-[#fb7185]" />
                )}
              </Tag>
            );
          })}
        </div>

        {/* Friend links */}
        <div className="mt-12">
          <SectionHeader title="友链" label="BLOGROLL" count={FRIEND_LINKS.length} />
          <div className="mt-1">
            {FRIEND_LINKS.map((link) => {
              const clickable = isLink(link.url);
              const Tag = clickable ? motion.a : motion.div;
              return (
                <Tag
                  key={link.name}
                  {...(clickable ? { href: link.url, target: '_blank', rel: 'noreferrer' } : {})}
                  className="group relative flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-white/[0.04] lg:px-4"
                >
                  <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-[#fb7185] transition-all duration-200 group-hover:h-7" />
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-base font-semibold text-white/90 ring-1 ring-white/10"
                    style={{ backgroundColor: link.accent }}
                  >
                    {link.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold">{link.name}</p>
                    {link.desc && <p className="mt-0.5 truncate text-[12px] text-white/40">{link.desc}</p>}
                  </div>
                  {clickable && (
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/20 transition-colors group-hover:text-[#fb7185]" />
                  )}
                </Tag>
              );
            })}
          </div>
        </div>

        <p className="mt-12 px-3 text-center font-mono text-[11px] tracking-wider text-white/25 lg:px-4">
          想交换友链？欢迎通过主页的社交方式联系我
        </p>
      </motion.main>
    </div>
  );
};
