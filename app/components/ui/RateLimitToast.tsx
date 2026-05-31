import { useEffect, useState } from 'react';
import type { RateLimitError } from '../../types/api';
import { useApp } from '../../store/AppContext';
import { CloseIcon } from '../../lib/icons';
import { formatCountdown } from '../../lib/utils';
import styles from './RateLimitToast.module.css';

function isRateLimitError(e: unknown): e is RateLimitError {
  return (
    typeof e === 'object' &&
    e !== null &&
    'error' in e &&
    (e as RateLimitError).error === 'rate_limited'
  );
}

export function RateLimitToast() {
  const { state, dispatch } = useApp();
  const { error } = state;
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!isRateLimitError(error)) return;
    setRemaining(error.retry_after);

    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          dispatch({ type: 'dismissError' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [error, dispatch]);

  if (!isRateLimitError(error)) return null;

  return (
    <div className={styles.toast} role="alert">
      <span className={styles.label}>速率限制</span>
      <span>請稍後再試 — {formatCountdown(remaining)}</span>
      <button
        className={styles.closeBtn}
        onClick={() => dispatch({ type: 'dismissError' })}
        aria-label="關閉"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
