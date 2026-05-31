import { NavLink } from 'react-router';
import { UsagePill } from '../ui/UsagePill';
import styles from './Topbar.module.css';

export function Topbar() {
  return (
    <header className={styles.topbar}>
      <span className={styles.brand}>VibeTrack</span>
      <nav className={styles.nav} aria-label="Main navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.navLink}${isActive ? ` ${styles.navLinkActive}` : ''}`
          }
        >
          Analyze
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${styles.navLink}${isActive ? ` ${styles.navLinkActive}` : ''}`
          }
        >
          Dashboard
        </NavLink>
      </nav>
      <div className={styles.right}>
        <UsagePill />
      </div>
    </header>
  );
}
