import { createContext, useContext, useState } from "react";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [playing, setPlaying] = useState(false);

  const play = (playlist) => {
    setNowPlaying(playlist);
    setPlaying(true);
  };

  const pause = () => setPlaying(false);
  const stop = () => {
    setNowPlaying(null);
    setPlaying(false);
  };

  return (
    <MusicContext.Provider
      value={{ nowPlaying, playing, play, pause, stop }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
