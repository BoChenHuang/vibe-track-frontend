// VibeTrack — root app
const { useState: useStateApp, useEffect: useEffectApp, useReducer, useRef: useRefApp } = React;

// ---------- Theme palettes ----------
const THEMES = {
  neon: {
    name: "Neon Reverie",
    sub: "Default — pink × violet × cyan",
    bg0: "#07060d", bg1: "#0d0a18", bg2: "#14112a",
    a: "#ff3cac", b: "#7a5cff", c: "#00e5ff", d: "#b8ff3c",
    gradPrimary: "linear-gradient(135deg, #ff3cac 0%, #7a5cff 50%, #00e5ff 100%)",
  },
  sunset: {
    name: "Solar Sunset",
    sub: "Orange × magenta × amber",
    bg0: "#0d0807", bg1: "#180c0a", bg2: "#2a1410",
    a: "#ff6b35", b: "#ff2e74", c: "#ffb547", d: "#ffe35a",
    gradPrimary: "linear-gradient(135deg, #ff6b35 0%, #ff2e74 50%, #ffb547 100%)",
  },
  aurora: {
    name: "Aurora Mint",
    sub: "Mint × teal × lavender",
    bg0: "#050e0d", bg1: "#0a1818", bg2: "#102828",
    a: "#6cffb4", b: "#00d2c8", c: "#7c9eff", d: "#c8a2ff",
    gradPrimary: "linear-gradient(135deg, #6cffb4 0%, #00d2c8 50%, #7c9eff 100%)",
  },
  mono: {
    name: "Mono Mirror",
    sub: "Editorial black & white",
    bg0: "#08080a", bg1: "#0e0e12", bg2: "#16161c",
    a: "#ffffff", b: "#c2c2cc", c: "#8a8a99", d: "#ffffff",
    gradPrimary: "linear-gradient(135deg, #ffffff 0%, #b8b8c4 50%, #6a6a7a 100%)",
  },
};

// ---------- Helpers ----------
// Rate limit: 5 requests per rolling 60-minute window.
const RATE_WINDOW_MS = 60 * 60 * 1000;
// Split storage keys so changing one slice (e.g. theme) never re-stringifies
// the others (e.g. the full history snapshots). Each is persisted by its own
// effect, keyed on its own slice of state.
const K_HISTORY = "vibetrack:history:v3";
const K_PREFS   = "vibetrack:prefs:v3";
const K_RATE    = "vibetrack:rate:v3";

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function loadStored() {
  return {
    history: readJSON(K_HISTORY),
    rateTimes: readJSON(K_RATE),
    theme: (readJSON(K_PREFS) || {}).theme,
  };
}

// Convert a lightweight seed entry (songIds + moodKey) into the full-snapshot
// shape every runtime entry uses: { mood, tracks } embedded directly.
function hydrateSeed(entry) {
  return {
    id: entry.id,
    ts: entry.ts,
    type: entry.type,
    input: entry.input,
    market: entry.market,
    mood: window.VIBE_MOCKS.moodPresets[entry.moodKey],
    tracks: entry.songIds
      .map(id => window.VIBE_MOCKS.songs.find(s => s.id === id))
      .filter(Boolean),
  };
}

// ---------- Initial state ----------
function initialState() {
  const stored = loadStored();
  const demoMoodKey = "melancholic";
  const demoMood = window.VIBE_MOCKS.moodPresets[demoMoodKey];
  const demoSongs = window.VIBE_MOCKS.songs.slice(0, 8);
  const demoText = "和他分手後第三天，整理東西的時候看到我們以前一起拍的照片，眼淚突然就掉下來了。";
  return {
    page: "analyze",
    inputMode: "text",
    textValue: demoText,
    imageFile: null,
    market: "TW",
    trackCount: 8,
    loading: false,
    result: {
      mood: demoMood,
      songs: demoSongs,
      market: "TW",
      moodKey: demoMoodKey,
      ts: Date.now(),
      demo: true,
    },
    error: null,
    // Stored history is already full-snapshot shape; seed needs hydrating once.
    history: stored.history || window.VIBE_MOCKS.seedHistory.map(hydrateSeed),
    rateTimes: stored.rateTimes || [],
    usage: 0,
    maxUsage: 5,
    rateLimitedUntil: null,
    songPool: window.VIBE_MOCKS.songs,
    moodPresets: window.VIBE_MOCKS.moodPresets,
    theme: stored.theme || "neon",
  };
}

// ---------- Reducer ----------
function reducer(state, action) {
  switch (action.type) {
    case "setPage": return { ...state, page: action.page };
    case "setMode": return { ...state, inputMode: action.mode };
    case "setText": return { ...state, textValue: action.value };
    case "setImage": return { ...state, imageFile: action.file };
    case "setMarket": return { ...state, market: action.value };
    case "setTrackCount": return { ...state, trackCount: action.value };
    case "setTheme": return { ...state, theme: action.theme };

    case "tickRate": {
      const now = Date.now();
      const recent = state.rateTimes.filter(t => now - t < RATE_WINDOW_MS);
      // Nothing expired → don't mint a new array (avoids a needless re-render
      // and a localStorage write every single second).
      if (recent.length === state.rateTimes.length) {
        return state.usage === recent.length ? state : { ...state, usage: recent.length };
      }
      return { ...state, rateTimes: recent, usage: recent.length };
    }

    case "submit": {
      const now = Date.now();
      const recent = state.rateTimes.filter(t => now - t < RATE_WINDOW_MS);
      if (recent.length >= state.maxUsage) {
        const oldest = Math.min(...recent);
        const wait = Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000);
        return {
          ...state,
          rateTimes: recent,
          usage: recent.length,
          error: { type: "429", retryIn: wait, at: now },
        };
      }
      return { ...state, loading: true, result: null, error: null };
    }

    case "submitResolved": {
      const now = Date.now();
      const newTimes = [...state.rateTimes.filter(t => now - t < RATE_WINDOW_MS), now];
      const moodKey = action.moodKey;
      const mood = state.moodPresets[moodKey];
      // Request trackCount songs (mock pool is finite, so cap at pool size)
      const n = Math.min(state.trackCount, state.songPool.length);
      const songs = state.songPool.slice(0, n);
      // Store a FULL snapshot — mood + complete track objects (incl. each
      // track's LLM-generated `reason`, which can't be recovered from Spotify
      // by id). Covers are URLs, so a snapshot stays small (~5KB/entry).
      const entry = {
        id: "h" + now.toString(36),
        ts: now,
        type: state.inputMode,
        input: state.inputMode === "text" ? state.textValue : (state.imageFile?.name || "image"),
        market: state.market,
        mood,
        tracks: songs,
      };
      return {
        ...state,
        loading: false,
        result: { mood, songs, market: state.market, moodKey, ts: now },
        rateTimes: newTimes,
        usage: newTimes.length,
        // FIFO cap keeps storage + parse/stringify cost constant regardless of usage.
        history: [entry, ...state.history].slice(0, 50),
      };
    }

    case "dismissError": return { ...state, error: null };

    case "replayHistory": {
      const e = action.entry;
      return {
        ...state,
        page: "analyze",
        inputMode: e.type,
        textValue: e.type === "text" ? e.input : "",
        imageFile: e.type === "image" ? { name: e.input, size: 1024*120, type: "image/jpeg" } : null,
        market: e.market,
        result: { mood: e.mood, songs: e.tracks, market: e.market, ts: e.ts, replay: true },
        error: null,
      };
    }

    case "force429": {
      return {
        ...state,
        error: { type: "429", retryIn: 1500, at: Date.now() },
      };
    }
  }
  return state;
}

// ---------- Mood mapping (mock) ----------
function pickMoodKey(state) {
  if (state.inputMode === "image") {
    // alternate based on image name length
    const len = state.imageFile?.name?.length || 0;
    return len % 3 === 0 ? "calm" : (len % 3 === 1 ? "melancholic" : "energetic");
  }
  const t = state.textValue.toLowerCase();
  if (/(累|空|想念|寂|alone|lonely|miss|sad|rain|tired|night|空空|melan)/i.test(t)) return "melancholic";
  if (/(跑|run|跳|興奮|excited|love|energy|嗨|happy|sunshine|sunny|go|drive)/i.test(t)) return "energetic";
  return "calm";
}

// ---------- App root ----------
function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [tweaksOpen, setTweaksOpen] = useStateApp(false);

  // Apply theme as CSS variables on root
  useEffectApp(() => {
    const t = THEMES[state.theme] || THEMES.neon;
    const r = document.documentElement;
    r.style.setProperty("--bg-0", t.bg0);
    r.style.setProperty("--bg-1", t.bg1);
    r.style.setProperty("--bg-2", t.bg2);
    r.style.setProperty("--neon-a", t.a);
    r.style.setProperty("--neon-b", t.b);
    r.style.setProperty("--neon-c", t.c);
    r.style.setProperty("--neon-d", t.d);
    r.style.setProperty("--grad-primary", t.gradPrimary);
  }, [state.theme]);

  // Persist each slice independently — changing theme writes only the tiny
  // prefs key and never re-stringifies the history snapshots. History is only
  // written when it actually changes (i.e. on submit), not on keystrokes or
  // theme switches (neither is in this effect's dependency list).
  useEffectApp(() => { writeJSON(K_HISTORY, state.history); }, [state.history]);
  useEffectApp(() => { writeJSON(K_PREFS, { theme: state.theme }); }, [state.theme]);
  useEffectApp(() => { writeJSON(K_RATE, state.rateTimes); }, [state.rateTimes]);

  // Tick rate limit
  useEffectApp(() => {
    const id = setInterval(() => dispatch({ type: "tickRate" }), 1000);
    dispatch({ type: "tickRate" });
    return () => clearInterval(id);
  }, []);

  // Simulated async submit
  useEffectApp(() => {
    if (!state.loading) return;
    const t = setTimeout(() => {
      const moodKey = pickMoodKey(state);
      dispatch({ type: "submitResolved", moodKey });
    }, 1800);
    return () => clearTimeout(t);
  }, [state.loading]);

  // Auto-dismiss 429 with countdown
  const [retrySec, setRetrySec] = useStateApp(0);
  useEffectApp(() => {
    if (!state.error || state.error.type !== "429") return;
    setRetrySec(state.error.retryIn);
    const id = setInterval(() => {
      setRetrySec(s => {
        if (s <= 1) { dispatch({ type: "dismissError" }); clearInterval(id); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state.error?.at]);

  // Edit-mode protocol for Tweaks
  useEffectApp(() => {
    function onMsg(e) {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    }
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  function onDismissTweaks() {
    setTweaksOpen(false);
    window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
  }

  return (
    <React.Fragment>
      <Atmosphere />
      <div className="app">
        <Topbar
          page={state.page}
          onChangePage={p => dispatch({ type: "setPage", page: p })}
          usage={state.usage}
          max={state.maxUsage}
        />
        {state.page === "analyze"
          ? <AnalyzePage state={state} dispatch={dispatch} />
          : <DashboardPage state={state} dispatch={dispatch} />}
        <footer className="foot">
          <div>VIBETRACK © 2026 · MOOD→MUSIC ENGINE</div>
          <div className="right">
            <span>v0.4.2-beta</span>
            <span>•</span>
            <span>API · Spotify</span>
            <span>•</span>
            <button className="btn-ghost" onClick={() => dispatch({ type: "force429" })}>
              Simulate 429
            </button>
          </div>
        </footer>
      </div>

      {state.error && state.error.type === "429" && (
        <RateLimitToast
          seconds={retrySec}
          onClose={() => dispatch({ type: "dismissError" })}
        />
      )}

      {tweaksOpen && (
        <ThemeTweaks
          current={state.theme}
          onChange={t => dispatch({ type: "setTheme", theme: t })}
          onClose={onDismissTweaks}
        />
      )}
    </React.Fragment>
  );
}

// ---------- Theme tweaks panel ----------
function ThemeTweaks({ current, onChange, onClose }) {
  return (
    <div style={{
      position:"fixed", right:24, bottom:24, zIndex: 200,
      width: 300, padding: 18,
      background: "rgba(13, 10, 24, 0.85)",
      backdropFilter: "blur(20px)",
      border: "1px solid var(--line-strong)",
      borderRadius: 16,
      boxShadow: "0 20px 60px -12px rgba(0,0,0,0.6)",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 14 }}>
        <div style={{ fontFamily:"var(--font-display)", fontWeight:500, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
          <Icon.Spark /> Tweaks
        </div>
        <button onClick={onClose} style={{ color:"var(--ink-3)" }}><Icon.Close /></button>
      </div>
      <div style={{ fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:".16em", textTransform:"uppercase", color:"var(--ink-3)", marginBottom:10 }}>
        Theme · Color palette
      </div>
      <div style={{ display:"grid", gap: 8 }}>
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              display:"flex", alignItems:"center", gap:12,
              padding: 10, borderRadius: 10,
              background: current === key ? "rgba(255,255,255,0.06)" : "transparent",
              border: "1px solid " + (current === key ? "var(--line-strong)" : "var(--line)"),
              textAlign: "left",
              transition: "all .15s",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: t.gradPrimary,
              boxShadow: `0 0 12px -2px ${t.a}66`,
              flexShrink: 0,
            }}></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color:"var(--ink-0)" }}>{t.name}</div>
              <div style={{ fontSize: 11, color:"var(--ink-3)", fontFamily:"var(--font-mono)" }}>{t.sub}</div>
            </div>
            {current === key && <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--neon-ok)", boxShadow:"0 0 8px var(--neon-ok)" }}></div>}
          </button>
        ))}
      </div>
      <div style={{
        marginTop: 14, padding: "10px 12px",
        background:"var(--surface)", border:"1px solid var(--line)",
        borderRadius: 8, fontSize:11, color:"var(--ink-2)", lineHeight: 1.5,
      }}>
        Themes recolor the entire interface — the mood panel and song covers reflect the active palette.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

Object.assign(window, { App, THEMES });
