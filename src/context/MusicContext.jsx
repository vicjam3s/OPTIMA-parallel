import { createContext, useContext, useState } from "react";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [playing, setPlaying] = useState(false);

  const play = (playlist) => {
    setNowPlaying(playlist);
    setPlaying(true);
  };

  const pause = () => {
    setPlaying(false);
  };

  const resume = () => {
    if (nowPlaying) setPlaying(true);
  };

  const stop = () => {
    setPlaying(false);
    setNowPlaying(null);
  };

  return (
    <MusicContext.Provider
      value={{
        nowPlaying,
        playing,
        play,
        pause,
        resume,
        stop,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);

