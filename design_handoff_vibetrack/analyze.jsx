// VibeTrack — Analyze page
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA, useMemo: useMemoA } = React;

const MARKETS = [
  { code: "TW", label: "Taiwan", flag: "🇹🇼" },
  { code: "JP", label: "Japan",  flag: "🇯🇵" },
  { code: "US", label: "United States", flag: "🇺🇸" },
  { code: "GB", label: "United Kingdom", flag: "🇬🇧" },
  { code: "HK", label: "Hong Kong", flag: "🇭🇰" },
  { code: "KR", label: "South Korea", flag: "🇰🇷" },
];

const SUGGESTIONS = [
  "下著小雨的週日下午",
  "深夜獨自看著城市燈火",
  "Long run, golden hour",
  "Coffee break before a big meeting",
];

function AnalyzePage({ state, dispatch }) {
  const {
    inputMode, textValue, imageFile, market,
    loading, result, error, history, usage, maxUsage,
  } = state;
  const textareaRef = useRefA(null);

  // Loading countdown / steps
  const [loadingPhase, setLoadingPhase] = useStateA(0);
  useEffectA(() => {
    if (!loading) { setLoadingPhase(0); return; }
    const id = setInterval(() => setLoadingPhase(p => (p + 1) % 4), 700);
    return () => clearInterval(id);
  }, [loading]);

  const canSubmit = !loading && (
    (inputMode === "text" && textValue.trim().length > 0) ||
    (inputMode === "image" && imageFile)
  );

  function handleSubmit() {
    if (!canSubmit) return;
    dispatch({ type: "submit" });
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <main className="page">
      <div className="page-header">
        <div className="eyebrow">VibeTrack · MOOD → MUSIC ENGINE</div>
        <h1 className="page-title">
          說出今天的心情，<em>聽見它的聲音</em>。
        </h1>
        <p className="page-sub">
          Drop in text or an image — VibeTrack reads the emotional fingerprint
          and curates eight Spotify tracks tuned to the moment.
        </p>
      </div>

      <section className="analyze-grid">
        {/* LEFT — Input */}
        <div className="card">
          <div className="card-title">
            <span>Input</span>
            <span className="tag">STEP 01</span>
          </div>

          <div className="input-tabs" role="tablist">
            <button
              role="tab"
              className={inputMode === "text" ? "active" : ""}
              onClick={() => dispatch({ type: "setMode", mode: "text" })}
            >
              <Icon.Type /> Text
            </button>
            <button
              role="tab"
              className={inputMode === "image" ? "active" : ""}
              onClick={() => dispatch({ type: "setMode", mode: "image" })}
            >
              <Icon.Image /> Image
            </button>
          </div>

          {inputMode === "text" ? (
            <TextInput
              value={textValue}
              onChange={v => dispatch({ type: "setText", value: v })}
              onKeyDown={handleKeyDown}
              textareaRef={textareaRef}
            />
          ) : (
            <DropZone
              file={imageFile}
              onFile={f => dispatch({ type: "setImage", file: f })}
            />
          )}

          <div className="controls-row">
            <div className="field-group">
              <MarketSelect value={market} onChange={v => dispatch({ type: "setMarket", value: v })} />
              <div className="field">
                <span className="lbl">Tracks</span>
                <select value={state.trackCount} onChange={e => dispatch({ type: "setTrackCount", value: Number(e.target.value) })}>
                  <option value="5">5</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                </select>
                <span className="caret"><Icon.ChevronDown /></span>
              </div>
            </div>
            <button
              className={"cta-primary" + (loading ? " loading" : "")}
              disabled={!canSubmit}
              onClick={handleSubmit}
              aria-busy={loading}
            >
              {loading ? (
                <React.Fragment>
                  <span className="loading-orb"></span>
                  {["Reading mood", "Mapping spectrum", "Picking tracks", "Tuning order"][loadingPhase]}…
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Icon.Spark /> <span className="label">Analyze vibe</span>
                  <span className="kbd">⌘↵</span>
                </React.Fragment>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT — Mood preview */}
        <div>
          {loading ? (
            <MoodSkeleton />
          ) : result ? (
            <MoodPanel mood={result.mood} />
          ) : (
            <PreviewEmpty />
          )}
        </div>
      </section>

      {/* RESULTS */}
      <section className="results-section">
        <div className="results-header">
          <h2 className="results-title">
            Recommended for you
            <span className="count">
              {result ? `· ${result.songs.length} tracks · market ${result.market}${result.demo ? " · sample" : ""}` : "· awaiting input"}
            </span>
          </h2>
          {result && (
            <div className="results-actions">
              <button className="btn-ghost"><Icon.Shuffle /> Shuffle order</button>
              <button className="btn-ghost"><Icon.Save /> Save to history</button>
            </div>
          )}
        </div>

        {loading ? (
          <SongsSkeleton />
        ) : result ? (
          <SongsGrid songs={result.songs} />
        ) : (
          <SongsGrid songs={[]} placeholder />
        )}
      </section>
    </main>
  );
}

// ---------- Text input ----------
function TextInput({ value, onChange, onKeyDown, textareaRef }) {
  return (
    <div className="text-input">
      <textarea
        ref={textareaRef}
        placeholder="今天的心情是什麼？描述一個場景、一段感受、或一句歌詞… &#10;&#10;e.g.  Just finished a long week and the rain finally stopped."
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className="meta">
        <div className="hint">
          {SUGGESTIONS.map(s => (
            <button key={s} className="hint-chip" onClick={() => onChange(s)}>{s}</button>
          ))}
        </div>
        <div>{value.length}/500</div>
      </div>
    </div>
  );
}

// ---------- Image drop zone ----------
function DropZone({ file, onFile }) {
  const [dragging, setDragging] = useStateA(false);
  const inputRef = useRefA(null);

  function pickFile() {
    inputRef.current?.click();
  }
  function handleChange(e) {
    const f = e.target.files?.[0];
    if (f) onFile({ name: f.name, size: f.size, type: f.type });
  }
  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile({ name: f.name, size: f.size, type: f.type });
  }

  if (file) {
    return (
      <div className="dropzone" style={{ padding: 0, border: "1px solid var(--line)" }}>
        <div className="preview">
          <div className="ph" style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #7a5cff, #ff3cac 60%, #00e5ff)",
          }}></div>
          <button className="remove" onClick={(e) => { e.stopPropagation(); onFile(null); }} aria-label="remove"><Icon.Close /></button>
          <div className="name">{file.name} · {(file.size/1024).toFixed(0)} KB</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={"dropzone" + (dragging ? " dragging" : "")}
      onClick={pickFile}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
    >
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
      <div className="icon-circle"><Icon.Upload /></div>
      <div className="label">拖放圖片到這裡 · or click to upload</div>
      <div className="sub">JPG · PNG · WEBP &nbsp;·&nbsp; up to 8 MB</div>
    </div>
  );
}

// ---------- Market select ----------
function MarketSelect({ value, onChange }) {
  return (
    <div className="field">
      <span className="lbl">Market</span>
      <span style={{ fontSize: 14, marginRight: 2 }}>{MARKETS.find(m => m.code === value)?.flag}</span>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {MARKETS.map(m => (
          <option key={m.code} value={m.code}>{m.code} · {m.label}</option>
        ))}
      </select>
      <span className="caret"><Icon.ChevronDown /></span>
    </div>
  );
}

// ---------- Preview empty ----------
function PreviewEmpty() {
  return (
    <div className="card side-preview">
      <div className="card-title">
        <span>Mood spectrum</span>
        <span className="tag">STEP 02</span>
      </div>
      <div className="spectrum">
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} className="bar" style={{ animationDelay: `${i*0.05}s`, opacity: 0.2 + (i%5)*0.12 }}></div>
        ))}
      </div>
      <div className="preview-empty">
        <div className="glyph"></div>
        <div className="title">Awaiting signal</div>
        <div className="sub">DROP TEXT OR AN IMAGE — WE'LL READ THE ROOM</div>
      </div>
    </div>
  );
}

// ---------- Mood skeleton ----------
function MoodSkeleton() {
  return (
    <div className="card">
      <div className="card-title"><span>Reading mood…</span><span className="tag">ANALYZING</span></div>
      <div className="skeleton" style={{ height: 200, marginBottom: 18 }}></div>
      <div className="skeleton" style={{ height: 12, width: 120, marginBottom: 12 }}></div>
      <div style={{ display:"flex", gap:6, marginBottom: 18, flexWrap:"wrap" }}>
        <div className="skeleton" style={{ height: 26, width: 90, borderRadius:999 }}></div>
        <div className="skeleton" style={{ height: 26, width: 120, borderRadius:999 }}></div>
        <div className="skeleton" style={{ height: 26, width: 80, borderRadius:999 }}></div>
        <div className="skeleton" style={{ height: 26, width: 100, borderRadius:999 }}></div>
      </div>
    </div>
  );
}

// ---------- Mood panel ----------
function MoodPanel({ mood }) {
  return (
    <div className="card mood-panel">
      <div className="card-title">
        <span>Detected mood</span>
        <span className="tag">STEP 02</span>
      </div>
      <div className="mood-hero" style={{
        "--coverA": mood.gradA, "--coverB": mood.gradB,
        height: 200,
      }}>
        <div className="gradient" style={{ background: `linear-gradient(135deg, ${mood.gradA}, ${mood.gradB})` }}></div>
        <div className="noise"></div>
        <div className="content">
          <div className="top">
            <span className="mono">PRIMARY MOOD</span>
            <span className="mono">{mood.tags.length} signals</span>
          </div>
          <h2>
            {mood.label}
            <small>{mood.sub}</small>
          </h2>
        </div>
      </div>

      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Mood signals</div>
        <div className="mood-tags">
          {mood.tags.map(t => (
            <span key={t.name} className={"mood-tag" + (t.primary ? " primary" : "")}>
              {t.primary && <span className="dot" style={{ background: mood.gradA, boxShadow: `0 0 6px ${mood.gradA}` }}></span>}
              {t.name}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        padding: "12px 14px",
        background: "var(--bg-1)",
        border: "1px solid var(--line)",
        borderRadius: 10,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--ink-3)",
        lineHeight: 1.6,
      }}>
        <span style={{ color: "var(--ink-2)" }}>NOTE</span> · Mood signals come from the same LLM call that selects the tracks — surfacing them here helps you see <em style={{ color: "var(--ink-1)", fontStyle: "normal" }}>why</em> each song was picked.
      </div>
    </div>
  );
}

// ---------- Songs ----------
function SongsGrid({ songs, placeholder }) {
  const [playing, setPlaying] = useStateA(null);
  if (placeholder) {
    return (
      <div className="songs-grid">
        {Array.from({ length: 8 }).map((_, i) => <SongCardPlaceholder key={i} idx={i} />)}
      </div>
    );
  }
  return (
    <div className="songs-grid">
      {songs.map((s, i) => (
        <SongCard
          key={s.id}
          song={s}
          rank={i + 1}
          playing={playing === s.id}
          onTogglePlay={() => setPlaying(p => p === s.id ? null : s.id)}
        />
      ))}
    </div>
  );
}

function SongCard({ song, rank, playing, onTogglePlay }) {
  const hasPreview = !!song.preview_url;
  const hasPopularity = typeof song.popularity === "number";
  const hasArt = !!song.album_image_url;
  return (
    <article className="song-card">
      <div className="song-cover" style={{ "--coverA": song.coverA || "#7a5cff", "--coverB": song.coverB || "#ff3cac" }}>
        {hasArt ? (
          <div className="art" style={{ backgroundImage: `url(${song.album_image_url})` }}></div>
        ) : (
          <div className="art placeholder"></div>
        )}
        <div className="cover-shade"></div>
        <div className="rank">#{String(rank).padStart(2, "0")}</div>
        {hasPopularity && (
          <div className="pop-badge">
            <span className="dot"></span>POP {song.popularity}
          </div>
        )}
        {hasPreview && (
          <React.Fragment>
            <div className={"mini-wave " + (playing ? "on" : "")}>
              <span></span><span></span><span></span><span></span>
            </div>
            <button
              className={"play-mini" + (playing ? " active" : "")}
              onClick={onTogglePlay}
              title={playing ? "Pause preview" : "Play 30s preview"}
              aria-label="toggle preview"
            >
              {playing ? <Icon.Pause /> : <Icon.Play />}
            </button>
          </React.Fragment>
        )}
      </div>
      <div className="song-meta">
        <h3 className="song-title">{song.title}</h3>
        <div className="song-artist">{song.artist}</div>
        <div className="song-reason">
          <span className="quote">“</span>{song.reason}<span className="quote">”</span>
        </div>
        <div className="song-actions">
          <a className="spotify-link" href={song.spotify_url} target="_blank" rel="noreferrer">
            <Icon.Spotify />
            Open in Spotify
            <Icon.External />
          </a>
          <span className="song-duration">
            {hasPreview ? "30s preview" : "no preview"}
          </span>
        </div>
      </div>
    </article>
  );
}

function SongCardPlaceholder({ idx }) {
  const grads = [
    ["#2a1838","#3a2a55"], ["#1a2540","#26384a"], ["#341a2c","#4a2638"],
    ["#1c2e2a","#283d36"], ["#2e1a26","#3d2638"], ["#1a2538","#26354a"],
    ["#2a2638","#383852"], ["#1a2e34","#284a52"],
  ];
  const [a, b] = grads[idx % grads.length];
  return (
    <article className="song-card" style={{ opacity: 0.55 }}>
      <div className="song-cover" style={{ "--coverA": a, "--coverB": b }}>
        <div className="art placeholder"></div>
        <div className="rank">#{String(idx + 1).padStart(2, "0")}</div>
      </div>
      <div className="song-meta">
        <div className="skeleton" style={{ height: 14, width: "70%", marginBottom: 8 }}></div>
        <div className="skeleton" style={{ height: 10, width: "45%", marginBottom: 14 }}></div>
        <div className="skeleton" style={{ height: 36, marginBottom: 12 }}></div>
        <div className="skeleton" style={{ height: 26, width: "60%" }}></div>
      </div>
    </article>
  );
}

function SongsSkeleton() {
  return (
    <div className="songs-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <article className="song-card" key={i}>
          <div className="song-cover">
            <div className="skeleton" style={{ position:"absolute", inset:0, borderRadius:0 }}></div>
          </div>
          <div className="song-meta">
            <div className="skeleton" style={{ height: 14, width:"70%", marginBottom:8 }}></div>
            <div className="skeleton" style={{ height: 10, width:"50%", marginBottom:14 }}></div>
            <div className="skeleton" style={{ height: 36, marginBottom:12 }}></div>
            <div className="skeleton" style={{ height: 26, width:"60%" }}></div>
          </div>
        </article>
      ))}
    </div>
  );
}

Object.assign(window, {
  AnalyzePage, MARKETS, SUGGESTIONS,
});
