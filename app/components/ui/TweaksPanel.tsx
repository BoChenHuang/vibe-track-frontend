import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { THEMES } from '../../lib/themes';
import type { Theme } from '../../types/api';
import s from './TweaksPanel.module.css';

const THEME_LABELS: Record<Theme, string> = {
  neon: 'Neon',
  sunset: 'Sunset',
  aurora: 'Aurora',
  mono: 'Mono',
};

export function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useApp();

  function handleTheme(theme: Theme) {
    dispatch({ type: 'setTheme', theme });
  }

  return (
    <div className={s.trigger}>
      {open && (
        <div className={s.panel}>
          <span className={s.panelLabel}>Theme</span>
          <div className={s.swatches}>
            {(Object.keys(THEMES) as Theme[]).map((theme) => {
              const tokens = THEMES[theme];
              const active = state.theme === theme;
              return (
                <button
                  key={theme}
                  className={`${s.swatch} ${active ? s.swatchActive : ''}`}
                  onClick={() => handleTheme(theme)}
                >
                  <span className={s.swatchBar} style={{ background: tokens['--grad-primary'] }} />
                  <span className={s.swatchName}>{THEME_LABELS[theme]}</span>
                  {active && <span className={s.swatchTick}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <button className={s.btn} onClick={() => setOpen((v) => !v)} aria-label="Theme settings">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>
    </div>
  );
}
