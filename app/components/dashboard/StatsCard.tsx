import type { ReactNode } from 'react';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  label: string;
  children: ReactNode;
}

export function StatsCard({ label, children }: StatsCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <div className={styles.value}>{children}</div>
    </div>
  );
}
