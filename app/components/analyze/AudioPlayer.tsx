import { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  src: string | null;
  onEnded: () => void;
}

export function AudioPlayer({ src, onEnded }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (src !== null) {
      audio.src = src;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.src = '';
    }
  }, [src]);

  return <audio ref={audioRef} onEnded={onEnded} style={{ display: 'none' }} />;
}
