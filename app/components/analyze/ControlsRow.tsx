import { useApp } from '../../store/AppContext';
import { SparkleIcon } from '../../lib/icons';
import styles from './ControlsRow.module.css';

const MARKETS = [
  { value: 'TW', label: '🇹🇼 Taiwan' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'US', label: '🇺🇸 USA' },
  { value: 'GB', label: '🇬🇧 UK' },
  { value: 'HK', label: '🇭🇰 Hong Kong' },
  { value: 'KR', label: '🇰🇷 Korea' },
];

interface ControlsRowProps {
  onSubmit: () => void;
}

export function ControlsRow({ onSubmit }: ControlsRowProps) {
  const { state, dispatch } = useApp();
  const { loading, inputMode, textValue, imageFile, market, trackCount } = state;

  const disabled =
    loading || (inputMode === 'text' ? textValue.trim() === '' : imageFile === null);

  return (
    <div className={styles.row}>
      <div className={styles.selects}>
        <select
          className={styles.select}
          value={market}
          onChange={(e) => dispatch({ type: 'setMarket', value: e.target.value })}
        >
          {MARKETS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={trackCount}
          onChange={(e) => dispatch({ type: 'setTrackCount', value: Number(e.target.value) })}
        >
          <option value={5}>5 tracks</option>
          <option value={8}>8 tracks</option>
          <option value={10}>10 tracks</option>
        </select>
      </div>

      <button className={styles.cta} onClick={onSubmit} disabled={disabled}>
        {loading ? (
          <span className={styles.spinner} />
        ) : (
          <>
            <SparkleIcon size={14} />
            <span>Analyze vibe</span>
            <span className={styles.kbd}>
              <kbd>⌘</kbd>
              <kbd>↵</kbd>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
