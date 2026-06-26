import { useApp } from '../../store/AppContext';
import styles from './UsagePill.module.css';

export function UsagePill() {
  const { state } = useApp();
  const remaining =
    state.rateRemaining !== null ? state.rateRemaining : state.maxUsage - state.usage;
  const limit =
    state.rateLimit !== null ? state.rateLimit : state.maxUsage;
  const exhausted = remaining <= 0;

  return (
    <div className={styles.pill}>
      <span className={`${styles.dot} ${exhausted ? styles.dotRed : styles.dotGreen}`} />
      {Math.max(0, remaining)}/{limit} RATE / HR
    </div>
  );
}
