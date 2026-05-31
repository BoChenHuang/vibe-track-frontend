import type { Mood } from '../../types/api';
import styles from './MoodPanel.module.css';

interface MoodPanelProps {
  mood: Mood;
}

export function MoodPanel({ mood }: MoodPanelProps) {
  const gradA = mood.gradA ?? '#7a5cff';
  const gradB = mood.gradB ?? '#ff3cac';
  const displaySignals = mood.signals ?? mood.tags.length;

  return (
    <div className={styles.panel}>
      <div
        className={styles.hero}
        style={{ background: `linear-gradient(135deg, ${gradA} 0%, ${gradB} 100%)` }}
      >
        <div className={styles.heroOverlay} />
      </div>
      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className={styles.badge}>Primary Mood</span>
          <span className={styles.signals}>{displaySignals} signals</span>
        </div>
        <h2 className={styles.label}>{mood.label}</h2>
        <p className={styles.sub}>{mood.sub}</p>
        <div className={styles.tags}>
          {mood.tags.map((tag) => (
            <span
              key={tag.name}
              className={`${styles.tag} ${tag.primary ? styles.tagPrimary : ''}`}
            >
              {tag.primary && <span className={styles.tagDot} />}
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
