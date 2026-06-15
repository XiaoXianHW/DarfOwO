import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAlbum, getArtist, type Track } from '../data/musicLibrary';
import { trackTime as fmt } from '../utils/format';
import { Cover } from '../components/music/Cover';
import { MusicWidget } from '../components/music/MusicWidget';
import { usePageTitle } from '../components/TitleProvider';

type Kind = 'artist' | 'album';

/** Shared immersive detail page for an artist (hot songs) or an album (tracklist). */
export const CollectionPage = ({ kind }: { kind: Kind }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const artist = kind === 'artist' && id ? getArtist(id) : undefined;
  const album = kind === 'album' && id ? getAlbum(id) : undefined;

  const info = useMemo(() => {
    if (artist) {
      return {
        kicker: 'ARTIST · 歌手',
        name: artist.name,
        sub: artist.alias || '',
        meta: artist.bio || '',
        cover: artist.cover,
        circle: true,
        tracks: artist.hot,
        link: /^\d+$/.test(artist.id) ? `https://music.163.com/artist?id=${artist.id}` : '',
      };
    }
    if (album) {
      return {
        kicker: 'ALBUM · 专辑',
        name: album.name,
        sub: album.artist,
        meta: album.note || (album.year ? `${album.year}` : ''),
        cover: album.cover,
        circle: false,
        tracks: album.tracks,
        link: /^\d+$/.test(album.id) ? `https://music.163.com/album?id=${album.id}` : '',
      };
    }
    return null;
  }, [artist, album]);

  usePageTitle(info ? `${info.name} · 音乐` : '音乐 Music');

  if (!info) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-white">
        <p className="text-white/60">没有找到该内容</p>
        <button onClick={() => navigate('/music')} className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
          返回音乐
        </button>
      </div>
    );
  }

  const queue = info.tracks.map((t) => t.id);
  const open = (t: Track) =>
    navigate(`/music/${t.id}`, { state: { queue, title: info.name } });
  const playAll = () => info.tracks[0] && open(info.tracks[0]);

  return (
    <div className="relative h-screen overflow-hidden bg-[#0a0a0a] font-sans text-white">
      {/* Blurred cover wash */}
      {info.cover && (
        <div
          className="pointer-events-none absolute inset-0 scale-125 bg-cover bg-center opacity-30 blur-3xl"
          style={{ backgroundImage: `url(${info.cover})` }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[#0a0a0a]/55" />

      <button
        onClick={() => navigate('/music')}
        className="absolute left-5 top-5 z-20 -ml-1 rounded-full p-2 transition-colors hover:bg-white/10"
        aria-label="Back"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <div className="absolute right-5 top-5 z-20">
        <MusicWidget />
      </div>

      <motion.div
        className="relative z-10 grid h-full min-h-0 grid-rows-[auto_1fr] gap-0 lg:grid-cols-[clamp(320px,38%,520px)_1fr] lg:grid-rows-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* LEFT — hero */}
        <section className="flex min-h-0 flex-col justify-end gap-5 px-8 pb-8 pt-20 lg:px-12 lg:pb-14">
          <Cover
            name={info.name}
            cover={info.cover}
            circle={info.circle}
            className={`${info.circle ? 'max-w-[200px]' : 'max-w-[240px]'} aspect-square w-1/2 shrink-0 shadow-2xl ring-1 ring-white/10 lg:w-auto`}
            textClass="text-6xl"
          />
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-[#ec4141]">{info.kicker}</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-[1.02] tracking-tight lg:text-6xl">
              {info.name}
            </h1>
            {info.sub && <p className="mt-2 text-sm text-white/60">{info.sub}</p>}
            {info.meta && (
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/45 line-clamp-3">{info.meta}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={playAll}
              className="inline-flex items-center gap-2 rounded-full bg-[#ec4141] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95"
            >
              <Play className="h-4 w-4" fill="currentColor" /> 播放全部
            </button>
            <span className="font-mono text-[11px] text-white/40">{info.tracks.length} TRACKS</span>
            {info.link && (
              <a
                href={info.link}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] text-white/40 transition-colors hover:text-white"
              >
                网易云 <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </section>

        {/* RIGHT — tracklist */}
        <section className="flex min-h-0 flex-col border-t border-white/5 lg:border-l lg:border-t-0">
          <div className="shrink-0 px-6 pb-3 pt-6">
            <span className="font-mono text-[11px] tracking-[0.25em] text-white/40">TRACKLIST</span>
          </div>
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-8">
            {info.tracks.map((t, i) => (
              <button
                key={t.id}
                onClick={() => open(t)}
                className="group flex w-full items-center gap-4 rounded-md px-4 py-2.5 text-left transition-colors hover:bg-white/[0.06]"
              >
                <span className="w-7 shrink-0 text-right font-mono text-base font-bold text-white/20 group-hover:hidden">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Play className="hidden h-4 w-4 shrink-0 translate-x-1.5 text-[#ec4141] group-hover:block" fill="currentColor" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] group-hover:text-white">{t.name}</p>
                  <p className="truncate text-[11px] text-white/40">{t.artist || info.sub || info.name}</p>
                </div>
                <span className="shrink-0 font-mono text-[10px] text-white/30">{fmt(t.dur)}</span>
              </button>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
};
