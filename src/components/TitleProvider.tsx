import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { usePlayer } from './music/PlayerProvider';
import { config } from '../config';

const SITE = config.profile.name;
const HOME_TITLE = config.profile.title;

interface TitleContextValue {
  setSegment: (segment: string | null) => void;
}

const TitleContext = createContext<TitleContextValue>({ setSegment: () => {} });

/** Set the document title for the current page. Pass `null` for the home page. */
export function usePageTitle(segment: string | null) {
  const { setSegment } = useContext(TitleContext);
  useEffect(() => {
    setSegment(segment);
  }, [segment, setSegment]);
}

export function TitleProvider({ children }: { children: ReactNode }) {
  const [segment, setSegment] = useState<string | null>(null);
  const { playing, currentTrack } = usePlayer();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/music') && playing && currentTrack) {
      document.title = `▶ ${currentTrack.name} - ${currentTrack.artist} · ${SITE}`;
      return;
    }
    document.title = segment ? `${segment} · ${SITE}` : HOME_TITLE;
  }, [segment, playing, currentTrack, pathname]);

  return <TitleContext.Provider value={{ setSegment }}>{children}</TitleContext.Provider>;
}
