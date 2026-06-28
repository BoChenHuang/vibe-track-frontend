import styles from './RateRing.module.css';

interface RateRingProps {
  value: number;
  size?: number;
}

export function RateRing({ value, size = 72 }: RateRingProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(1, Math.max(0, value)));

  const color =
    value >= 0.99 ? 'var(--neon-danger)' : value >= 0.6 ? 'var(--neon-warn)' : 'var(--neon-c)';

  const glowColor =
    value >= 0.99
      ? 'rgba(255, 85, 115, 0.6)'
      : value >= 0.6
        ? 'rgba(255, 181, 71, 0.6)'
        : 'rgba(0, 229, 255, 0.5)';

  return (
    <svg width={size} height={size} className={styles.ring} aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className={styles.track}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className={styles.arc}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ filter: `drop-shadow(0 0 5px ${glowColor})` }}
      />
    </svg>
  );
}
