import styles from './PreviewEmpty.module.css';

const BAR_CONFIGS: Array<{ peak: number; dur: string; delay: string }> = [
  { peak: 20, dur: '1.1s', delay: '0s' },
  { peak: 42, dur: '0.8s', delay: '0.1s' },
  { peak: 62, dur: '1.3s', delay: '0.2s' },
  { peak: 34, dur: '0.9s', delay: '0.05s' },
  { peak: 56, dur: '1.2s', delay: '0.3s' },
  { peak: 28, dur: '1.0s', delay: '0.15s' },
  { peak: 48, dur: '1.4s', delay: '0.25s' },
  { peak: 70, dur: '0.85s', delay: '0.35s' },
  { peak: 38, dur: '1.1s', delay: '0.1s' },
  { peak: 24, dur: '0.95s', delay: '0.2s' },
];

export function PreviewEmpty() {
  return (
    <div className={styles.container}>
      <div className={styles.spectrum}>
        {BAR_CONFIGS.map((c, i) => (
          <div
            key={i}
            className={styles.bar}
            style={
              {
                '--peak': `${c.peak}px`,
                '--dur': c.dur,
                animationDelay: c.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className={styles.orb} />
      <p className={styles.label}>Awaiting signal</p>
    </div>
  );
}
