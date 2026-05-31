import { useApp } from '../../store/AppContext';
import styles from './TextInput.module.css';

const SUGGESTIONS = ['下雨天窩在家', '週末夜晚的酒吧', '晨跑充滿能量', '失眠的夜'];

export function TextInput() {
  const { state, dispatch } = useApp();
  const charCount = [...state.textValue].length;

  return (
    <div className={styles.wrapper}>
      <textarea
        className={styles.textarea}
        value={state.textValue}
        onChange={(e) => dispatch({ type: 'setText', value: e.target.value })}
        placeholder="Describe your current vibe, a scene, a feeling..."
      />
      <div className={styles.footer}>
        <div className={styles.chips}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className={styles.chip}
              onClick={() => dispatch({ type: 'setText', value: s })}
            >
              {s}
            </button>
          ))}
        </div>
        <span className={`${styles.count} ${charCount >= 450 ? styles.countWarn : ''}`}>
          {charCount}/500
        </span>
      </div>
    </div>
  );
}
