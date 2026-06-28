import type { HistoryEntry } from '../../types/api';
import { HistoryItem } from './HistoryItem';
import styles from './HistoryList.module.css';

interface HistoryListProps {
  history: HistoryEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function HistoryList({ history, selectedId, onSelect }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>尚無分析紀錄</p>
        <p className={styles.emptyHint}>去 Analyze 頁試試看，分析後記錄會出現在這裡。</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {history.map((entry) => (
        <HistoryItem
          key={entry.id}
          entry={entry}
          active={entry.id === selectedId}
          onClick={() => onSelect(entry.id)}
        />
      ))}
    </div>
  );
}
