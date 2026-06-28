import { formatRelativeTime } from '../../lib/utils';
import type { HistoryEntry } from '../../types/api';
import styles from './HistoryItem.module.css';

interface HistoryItemProps {
  entry: HistoryEntry;
  active: boolean;
  onClick: () => void;
}

export function HistoryItem({ entry, active, onClick }: HistoryItemProps) {
  return (
    <button
      type="button"
      className={`${styles.item}${active ? ` ${styles.active}` : ''}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <span className={`${styles.badge} ${entry.type === 'text' ? styles.badgeText : styles.badgeImage}`}>
          {entry.type === 'text' ? 'TEXT' : 'IMAGE'}
        </span>
        <span className={styles.time}>{formatRelativeTime(entry.ts)}</span>
        <span className={styles.market}>{entry.market}</span>
      </div>
      <p className={styles.input}>{entry.input}</p>
      <div className={styles.footer}>
        <span className={styles.moodChip}>{entry.mood.label}</span>
        <span className={styles.trackCount}>{entry.tracks.length} tracks</span>
      </div>
    </button>
  );
}
