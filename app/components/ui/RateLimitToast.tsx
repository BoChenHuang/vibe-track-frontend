import { useEffect, useState } from 'react';
import type { ToastItem, RateLimitError } from '../../types/api';
import { useApp } from '../../store/AppContext';
import { CloseIcon } from '../../lib/icons';
import { formatCountdown } from '../../lib/utils';
import styles from './RateLimitToast.module.css';

function isRateLimitError(p: unknown): p is RateLimitError {
  return typeof p === 'object' && p !== null && (p as RateLimitError).error === 'rate_limited';
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const isRateLimit = isRateLimitError(item.payload);
  const [remaining, setRemaining] = useState(
    isRateLimit ? (item.payload as RateLimitError).retry_after : 0
  );

  useEffect(() => {
    if (isRateLimit) {
      const id = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) { clearInterval(id); onDismiss(); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    } else {
      const id = setTimeout(onDismiss, 4000);
      return () => clearTimeout(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.toast} role="alert">
      {isRateLimit ? (
        <span>已達使用上限，{formatCountdown(remaining)} 後可再試</span>
      ) : (
        <>
          <span className={styles.errorLabel}>錯誤</span>
          <span>{item.payload as string}</span>
        </>
      )}
      <button className={styles.closeBtn} onClick={onDismiss} aria-label="關閉">
        <CloseIcon size={14} />
      </button>
    </div>
  );
}

export function RateLimitToast() {
  const { state, dispatch } = useApp();
  if (state.toasts.length === 0) return null;

  return (
    <div className={styles.stack}>
      {state.toasts.map((item) => (
        <Toast
          key={item.id}
          item={item}
          onDismiss={() => dispatch({ type: 'dismissToast', id: item.id })}
        />
      ))}
    </div>
  );
}
