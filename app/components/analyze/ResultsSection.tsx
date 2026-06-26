import { useApp } from '../../store/AppContext';
import { SongCard } from './SongCard';
import { ResultsEmpty } from './ResultsEmpty';
import styles from './ResultsSection.module.css';

interface ResultsSectionProps {
  playingId: string | null;
  onPlayToggle: (id: string) => void;
}

export function ResultsSection({ playingId, onPlayToggle }: ResultsSectionProps) {
  const { state } = useApp();
  const { result } = state;

  if (result === null) {
    return (
      <div className={styles.section}>
        <div className={styles.grid}>
          <ResultsEmpty />
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
            onPlayToggle={onPlayToggle}
          />
        ))}
      </div>
    </div>
  );
}
