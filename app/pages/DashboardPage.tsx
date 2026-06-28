import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RateRing } from '../components/dashboard/RateRing';
import { HistoryList } from '../components/dashboard/HistoryList';
import { HistoryPreview } from '../components/dashboard/HistoryPreview';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { state } = useApp();
  const { history, rateRemaining, rateLimit } = state;

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayCount = history.filter((e) => e.ts >= todayStart.getTime()).length;

  const rateValue =
    rateLimit != null && rateLimit > 0 && rateRemaining != null
      ? (rateLimit - rateRemaining) / rateLimit
      : 0;

  const resolvedSelectedId = selectedId ?? history[0]?.id ?? null;
  const selectedEntry = history.find((e) => e.id === resolvedSelectedId) ?? null;

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <span className={styles.eyebrow}>History</span>
        <h1 className={styles.title}>Your Vibes</h1>
        <p className={styles.subtitle}>Browse past analyses and replay your favorites.</p>
      </header>

      <div className={styles.statsGrid}>
        <StatsCard label="Total Queries">
          <span className={styles.statValue}>{history.length}</span>
        </StatsCard>
        <StatsCard label="Today">
          <span className={styles.statValue}>{todayCount}</span>
        </StatsCard>
        <StatsCard label="Rate Limit">
          <div className={styles.rateCard}>
            <RateRing value={rateValue} size={64} />
            <span className={styles.rateText}>
              {rateRemaining ?? '—'}
              <span className={styles.rateLimit}>/{rateLimit ?? '—'}</span>
            </span>
          </div>
        </StatsCard>
        <StatsCard label="Last Vibe">
          <span className={styles.statValue}>{history[0]?.mood.label ?? '—'}</span>
        </StatsCard>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.listCol}>
          <HistoryList
            history={history}
            selectedId={resolvedSelectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className={styles.previewCol}>
          {selectedEntry ? (
            <HistoryPreview entry={selectedEntry} />
          ) : (
            <div className={styles.emptyPreview}>
              <p>選擇左側的紀錄以查看詳情</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
