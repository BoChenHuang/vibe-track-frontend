import styles from './MoodSkeleton.module.css';

export function MoodSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.hero} />
      <div className={styles.body}>
        <div className={`${styles.line} ${styles.lineSm}`} />
        <div className={`${styles.line} ${styles.lineLg}`} />
        <div className={`${styles.line} ${styles.lineMd}`} />
        <div className={styles.tags}>
          {[82, 66, 94, 74].map((w, i) => (
            <div key={i} className={styles.tag} style={{ width: `${w}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
