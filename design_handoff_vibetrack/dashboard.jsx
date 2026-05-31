// VibeTrack — Dashboard (split view)
const { useState: useStateD, useEffect: useEffectD, useMemo: useMemoD } = React;

function DashboardPage({ state, dispatch }) {
  const { history, usage, maxUsage } = state;
  const [selectedId, setSelectedId] = useStateD(history[0]?.id || null);

  // Keep selection valid
  useEffectD(() => {
    if (history.length && !history.find(h => h.id === selectedId)) {
      setSelectedId(history[0].id);
    }
  }, [history, selectedId]);

  const selected = history.find(h => h.id === selectedId);

  // Stats
  const todayCount = useMemoD(() => {
    const start = new Date(); start.setHours(0,0,0,0);
    return history.filter(h => h.ts >= start.getTime()).length;
  }, [history]);

  return (
    <main className="page">
      <div className="page-header">
        <div className="eyebrow">DASHBOARD · LOCAL HISTORY</div>
        <h1 className="page-title">
          你聽過的<em> 心情軌跡</em>。
        </h1>
        <p className="page-sub">
          所有查詢只存在你的瀏覽器裡 (localStorage)。Pick a session on the left to replay its recommendations.
        </p>
      </div>

      <div className="stat-row" style={{
        display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16, marginBottom: 28,
      }}>
        <StatCard label="Total queries" value={history.length} sub="all-time" />
        <StatCard label="Today" value={todayCount} sub={`${new Date().toLocaleDateString()}`} />
        <StatCard
          label="Rate limit"
          value={`${usage}/${maxUsage}`}
          sub="this hour"
          ring={usage / maxUsage}
        />
        <StatCard label="Last vibe" value={selected ? selected.mood?.label : "—"} sub={selected ? formatRelative(selected.ts) : "no data"} />
      </div>

      <div className="dashboard">
        {/* LEFT */}
        <aside className="history-list">
          <div className="history-list-header">
            <span className="name">History</span>
            <span className="count">{history.length}</span>
          </div>
          {history.length === 0 ? (
            <div className="history-empty">
              <div className="glyph"><Icon.History /></div>
              No saved sessions yet.
            </div>
          ) : (
            history.map(h => (
              <HistoryItem
                key={h.id}
                entry={h}
                active={h.id === selectedId}
                onClick={() => setSelectedId(h.id)}
              />
            ))
          )}
        </aside>

        {/* RIGHT */}
        <section className="history-preview">
          {selected ? (
            <HistoryPreview entry={selected} state={state} dispatch={dispatch} />
          ) : (
            <div className="preview-empty-large">
              <div className="big-glyph"></div>
              <div className="title">Nothing selected</div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:12, letterSpacing:".08em" }}>PICK A SESSION FROM THE LIST</div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, sub, ring }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{
            fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:".16em",
            textTransform:"uppercase", color:"var(--ink-3)", marginBottom:10,
          }}>{label}</div>
          <div style={{
            fontFamily:"var(--font-display)", fontSize:30, lineHeight:1,
            letterSpacing:"-0.02em", fontWeight:500, color:"var(--ink-0)",
          }}>{value}</div>
          <div style={{ fontSize:11, color:"var(--ink-3)", marginTop:6, fontFamily:"var(--font-mono)" }}>{sub}</div>
        </div>
        {ring !== undefined && <RateRing value={ring} />}
      </div>
    </div>
  );
}

function RateRing({ value }) {
  const r = 16; const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(1, Math.max(0, value)));
  const color = value >= 0.99 ? "var(--neon-danger)" : value >= 0.6 ? "var(--neon-warn)" : "var(--neon-c)";
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r={r} stroke="var(--line)" strokeWidth="3" fill="none"/>
      <circle
        cx="22" cy="22" r={r}
        stroke={color} strokeWidth="3" fill="none"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
        style={{ filter: `drop-shadow(0 0 6px ${color})`, transition:"stroke-dashoffset .4s" }}
      />
    </svg>
  );
}

function HistoryItem({ entry, active, onClick }) {
  const mood = entry.mood;
  return (
    <button className={"history-item" + (active ? " active" : "")} onClick={onClick}>
      <div className="top">
        <span className={"type " + entry.type}>
          {entry.type === "text" ? <Icon.TextSmall /> : <Icon.ImageSmall />}
          {entry.type.toUpperCase()}
        </span>
        <span>{formatRelative(entry.ts)} · {entry.market}</span>
      </div>
      <div className="summary">{summarizeInput(entry.input, 70)}</div>
      <div className="bottom">
        <div className="mood-mini">
          {mood && (
            <span className="chip" style={{ color: mood.gradA, borderLeft: `2px solid ${mood.gradA}`, paddingLeft: 6 }}>
              {mood.label}
            </span>
          )}
        </div>
        <span className="songs-count">{entry.tracks.length} tracks</span>
      </div>
    </button>
  );
}

function HistoryPreview({ entry, state, dispatch }) {
  const mood = entry.mood;

  function replay() {
    dispatch({
      type: "replayHistory",
      entry,
    });
  }

  return (
    <div>
      <div className="preview-meta-row">
        <span className="crumb">{new Date(entry.ts).toLocaleString()}</span>
        <span className="dot-sep"></span>
        <span className="crumb">Market {entry.market}</span>
        <span className="dot-sep"></span>
        <span className="crumb">{entry.type === "text" ? "Text input" : "Image input"}</span>
        <span className="dot-sep"></span>
        <span className="crumb" style={{ color: "var(--neon-d)" }}>{entry.tracks.length} tracks</span>
        <div style={{ flex: 1 }}></div>
        <button className="btn-ghost" onClick={replay}>
          <Icon.Shuffle /> Replay on Analyze
        </button>
      </div>

      <div className="preview-input-block">
        <div className="label">Input</div>
        {entry.type === "text" ? (
          <div className="text">{entry.input}</div>
        ) : (
          <React.Fragment>
            <div className="image-thumb" style={{
              background: `linear-gradient(135deg, ${mood.gradA}, ${mood.gradB})`,
            }}></div>
            <div className="text" style={{ marginTop: 10, fontFamily:"var(--font-mono)", fontSize:12, color:"var(--ink-2)" }}>{entry.input}</div>
          </React.Fragment>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <MoodPanel mood={mood} />
      </div>

      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Recommended tracks</div>
        <div className="preview-songs-mini">
          {entry.tracks.map(s => {
            if (!s) return null;
            return (
              <a key={s.id} className="song-mini" href={s.spotify_url} target="_blank" rel="noreferrer">
                <div className="cover" style={
                  s.album_image_url
                    ? { backgroundImage: `url(${s.album_image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : { background: `linear-gradient(135deg, ${s.coverA || "#7a5cff"}, ${s.coverB || "#ff3cac"})` }
                }></div>
                <div className="info">
                  <div className="t">{s.title}</div>
                  <div className="a">{s.artist}</div>
                </div>
                {typeof s.popularity === "number" && (
                  <div className="pop">POP {s.popularity}</div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  DashboardPage,
});
