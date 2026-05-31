import { useApp } from '../../store/AppContext';
import styles from './InputTabs.module.css';

export function InputTabs() {
  const { state, dispatch } = useApp();

  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${state.inputMode === 'text' ? styles.tabActive : ''}`}
        onClick={() => dispatch({ type: 'setMode', mode: 'text' })}
      >
        Text
      </button>
      <button
        className={`${styles.tab} ${state.inputMode === 'image' ? styles.tabActive : ''}`}
        onClick={() => dispatch({ type: 'setMode', mode: 'image' })}
      >
        Image
      </button>
    </div>
  );
}
