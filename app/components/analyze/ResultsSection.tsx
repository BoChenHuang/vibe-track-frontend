import { useApp } from '../../store/AppContext';
import { SongCard } from './SongCard';
import { ResultsEmpty } from './ResultsEmpty';
import styles from './ResultsSection.module.css';

interface ResultsSectionProps {
  playingId: string | null;
  onPlayToggle: (id: string) => void;
}

function SongCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonCover} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonLine} ${styles.skeletonLineLg}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineSm}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineMd}`} />
      </div>
    </div>
  );
}

export function ResultsSection({ playingId, onPlayToggle }: ResultsSectionProps) {
  const { state } = useApp();
  const { result, loading, trackCount } = state;

  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.grid}>
          {Array.from({ length: trackCount }).map((_, i) => (
            <SongCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

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
