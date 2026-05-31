import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { SongCard } from './SongCard';
import type { Track } from '../../types/api';
import styles from './ResultsSection.module.css';

const PLACEHOLDER_TRACK: Track = {
  id: 'placeholder',
  title: '',
  artist: '',
  spotify_url: '#',
  preview_url: null,
  popularity: null,
  album_image_url: null,
  reason: '',
};

export function ResultsSection() {
  const { state } = useApp();
  const { result } = state;
  const [playingId, setPlayingId] = useState<string | null>(null);

  function handlePlayToggle(id: string) {
    setPlayingId((prev) => (prev === id ? null : id));
  }

  if (result === null) {
    return (
      <div className={styles.section}>
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SongCard
              key={i}
              track={PLACEHOLDER_TRACK}
              rank={i + 1}
              playingId={null}
              onPlayToggle={() => {}}
              placeholder
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>{result.tracks.length} recommendations</h2>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => {}}>
            Shuffle order
          </button>
          <button className={styles.actionBtn} onClick={() => {}}>
            Save to history
          </button>
        </div>
      </header>
      <div className={styles.grid}>
        {result.tracks.map((track, i) => (
          <SongCard
            key={track.id}
            track={track}
            rank={i + 1}
            playingId={playingId}
            onPlayToggle={handlePlayToggle}
          />
        ))}
      </div>
    </div>
  );
}
