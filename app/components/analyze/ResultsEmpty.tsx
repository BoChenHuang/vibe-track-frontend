import { WaveIcon } from '../../lib/icons';
import styles from './ResultsEmpty.module.css';

export function ResultsEmpty() {
  return (
    <div className={styles.root}>
      <WaveIcon size={40} className={styles.icon} />
      <p className={styles.heading}>Your soundtrack awaits</p>
      <p className={styles.sub}>描述你的心情，送出後結果會顯示在這裡</p>
    </div>
  );
}
