// VibeTrack — shared UI primitives
const { useState, useEffect, useRef, useMemo } = React;

// ---------- Icons (inline SVG) ----------
const Icon = {
  Type: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M9 6v14M15 6v14M4 18h10"/>
    </svg>
  ),
  Image: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2"/>
      <circle cx="9" cy="10" r="1.5"/>
      <path d="M21 16l-5-5-9 9"/>
    </svg>
  ),
  Upload: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v12M6 10l6-6 6 6"/>
      <path d="M4 20h16"/>
    </svg>
  ),
  Spark: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
  Play: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M6 4l14 8-14 8V4z"/>
    </svg>
  ),
  Pause: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <rect x="6" y="4" width="4" height="16" rx="1"/>
      <rect x="14" y="4" width="4" height="16" rx="1"/>
    </svg>
  ),
  Spotify: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.55 14.42c-.18.29-.55.38-.84.2-2.3-1.4-5.2-1.72-8.6-.94-.33.08-.66-.13-.74-.46-.08-.33.13-.66.46-.74 3.74-.85 6.94-.48 9.52 1.09.29.18.38.55.2.85zm1.21-2.71c-.22.36-.69.47-1.05.25-2.63-1.62-6.64-2.09-9.76-1.14-.4.12-.83-.1-.96-.51-.12-.4.1-.83.51-.96 3.56-1.08 8-.56 11.01 1.31.36.22.47.69.25 1.05zm.1-2.82C14.7 8.78 9.4 8.6 6.32 9.54c-.49.15-1-.13-1.15-.62-.15-.49.13-1 .62-1.15 3.54-1.07 9.4-.86 13.11 1.34.45.27.59.85.32 1.3-.27.45-.85.59-1.3.32z"/>
    </svg>
  ),
  External: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
      <path d="M7 17L17 7M9 7h8v8"/>
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
      <path d="M6 6l12 12M18 6l-6 12-6-12"/>
    </svg>
  ),
  Warning: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M12 9v4M12 17h.01"/>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    </svg>
  ),
  History: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M3 12a9 9 0 109-9 9.74 9.74 0 00-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M12 7v5l3 2"/>
    </svg>
  ),
  TextSmall: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="11" height="11">
      <path d="M4 7h16M9 7v12M15 7v12"/>
    </svg>
  ),
  ImageSmall: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
      <rect x="3" y="4" width="18" height="16" rx="2"/>
      <circle cx="9" cy="10" r="1.5"/>
      <path d="M21 16l-5-5-9 9"/>
    </svg>
  ),
  Shuffle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <polyline points="16 3 21 3 21 8"/>
      <line x1="4" y1="20" x2="21" y2="3"/>
      <polyline points="21 16 21 21 16 21"/>
      <line x1="15" y1="15" x2="21" y2="21"/>
      <line x1="4" y1="4" x2="9" y2="9"/>
    </svg>
  ),
  Save: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  ),
};

// ---------- Atmosphere ----------
function Atmosphere() {
  return (
    <React.Fragment>
      <div className="atmosphere"><div className="orb-3"></div></div>
      <div className="grain"></div>
    </React.Fragment>
  );
}

// ---------- Topbar ----------
function Topbar({ page, onChangePage, usage, max }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"></div>
        <span>VibeTrack</span>
        <span className="dot" title="online"></span>
      </div>
      <nav className="nav" role="tablist">
        <button className={page === "analyze" ? "active" : ""} onClick={() => onChangePage("analyze")}>Analyze</button>
        <button className={page === "dashboard" ? "active" : ""} onClick={() => onChangePage("dashboard")}>Dashboard</button>
      </nav>
      <div className="topbar-right">
        <UsagePill usage={usage} max={max} />
      </div>
    </header>
  );
}

function UsagePill({ usage, max }) {
  const dots = [];
  for (let i = 0; i < max; i++) {
    dots.push(<span key={i} className={i < usage ? "spent" : ""}></span>);
  }
  return (
    <div className="usage-pill" title="Hourly rate limit · 每小時 5 次">
      <span className="label">RATE / HR</span>
      <span className="dots">{dots}</span>
      <span style={{ fontFamily:"var(--font-mono)", color:"var(--ink-1)", fontSize:11 }}>{usage}/{max}</span>
    </div>
  );
}

// Format a seconds count as a human "Xh Ym Zs" / "Ym Zs" / "Zs" string.
function formatCountdown(total) {
  total = Math.max(0, Math.round(total));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

// ---------- 429 Toast ----------
function RateLimitToast({ seconds, onClose }) {
  return (
    <div className="toast" role="status">
      <div className="icon-circle"><Icon.Warning /></div>
      <div className="content">
        <div className="title-text">已達每小時上限 · Slow down a bit</div>
        <div className="sub-text">
          請稍後再試 — retry in <span className="countdown">{formatCountdown(seconds)}</span>
        </div>
      </div>
      <button className="close" onClick={onClose} aria-label="close"><Icon.Close /></button>
    </div>
  );
}

// ---------- Helpers ----------
function formatDuration(ms) {
  const t = Math.round(ms / 1000);
  const m = Math.floor(t / 60);
  const s = String(t % 60).padStart(2, "0");
  return `${m}:${s}`;
}
function formatRelative(ts) {
  const diff = Date.now() - ts;
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
function summarizeInput(s, n=64) {
  if (!s) return "";
  s = s.trim().replace(/\s+/g, " ");
  return s.length > n ? s.slice(0, n) + "…" : s;
}

Object.assign(window, {
  Icon, Atmosphere, Topbar, UsagePill, RateLimitToast,
  formatDuration, formatRelative, summarizeInput,
});
