import { useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import styles from './BootingScreen.module.css';

export function BootingScreen() {
  const { state, dispatch } = useApp();
  const { bootingStatus } = state;

  useEffect(() => {
    if (bootingStatus !== 'error') return;
    const id = setTimeout(() => dispatch({ type: 'setBootingStatus', status: 'ready' }), 4000);
    return () => clearTimeout(id);
  }, [bootingStatus, dispatch]);

  if (bootingStatus === 'booting') {
    return (
      <div className={styles.overlay} role="status" aria-label="服務啟動中">
        <div className={styles.spinner} />
        <p className={styles.label}>服務啟動中，請稍候</p>
      </div>
    );
  }

  if (bootingStatus === 'error') {
    return (
      <div className={styles.overlay} role="alert">
        <div className={styles.errorDot} />
        <p className={styles.errorHeading}>後端服務無回應</p>
        <p className={styles.errorSub}>您仍可嘗試使用，部分功能可能無法正常運作</p>
        <button
          className={styles.errorBtn}
          onClick={() => dispatch({ type: 'setBootingStatus', status: 'ready' })}
        >
          繼續
        </button>
      </div>
    );
  }

  return null;
}
