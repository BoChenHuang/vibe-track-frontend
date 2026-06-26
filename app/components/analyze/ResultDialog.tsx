import s from './ResultDialog.module.css';

interface Props {
  loading: boolean;
  error: string | null;
  onConfirm: () => void;
}

export function ResultDialog({ loading, error, onConfirm }: Props) {
  if (!loading && error === null) return null;

  return (
    <div className={s.backdrop}>
      <div className={s.dialog} role="dialog" aria-modal="true">
        {loading && !error && (
          <>
            <div className={s.spinner} />
            <p className={s.loadingLabel}>Analyzing your vibe…</p>
            <p className={s.loadingHint}>Finding songs that match your mood</p>
          </>
        )}

        {error && (
          <>
            <div className={s.errorIcon}>✕</div>
            <p className={s.errorHeading}>無法連線</p>
            <p className={s.errorMsg}>{error}</p>
            <button className={s.closeBtn} onClick={onConfirm}>關閉</button>
          </>
        )}
      </div>
    </div>
  );
}
