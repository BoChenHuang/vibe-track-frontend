// --- API Response Types ---

export interface MoodTag {
  name: string;
  primary: boolean;
}

export interface Mood {
  label: string;
  sub: string;
  tags: MoodTag[];
  gradA?: string;
  gradB?: string;
  signals?: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  spotify_url: string;
  preview_url: string | null;
  popularity: number | null;
  album_image_url: string | null;
  reason: string;
}

export interface AnalyzeResponse {
  mood: Mood;
  tracks: Track[];
}

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  reset_at: number;
}

export interface RateLimitError {
  error: 'rate_limited';
  message: string;
  retry_after: number;
  limit: number;
  remaining: number;
  reset_at: number;
}

// --- App State Types ---

export interface HistoryEntry {
  id: string;
  ts: number;
  type: 'text' | 'image';
  input: string;
  market: string;
  mood: Mood;
  tracks: Track[];
}

export type BootingStatus = 'booting' | 'ready' | 'error';

export type Theme = 'neon' | 'sunset' | 'aurora' | 'mono';

export type Page = 'analyze' | 'dashboard';

export type InputMode = 'text' | 'image';

export interface AnalyzeResult {
  mood: Mood;
  tracks: Track[];
  market: string;
  ts: number;
}

export interface ToastItem {
  id: string;
  payload: RateLimitError | string;
}

export interface AppState {
  page: Page;
  inputMode: InputMode;
  textValue: string;
  imageFile: File | null;
  market: string;
  trackCount: number;
  loading: boolean;
  result: AnalyzeResult | null;
  toasts: ToastItem[];
  history: HistoryEntry[];
  rateTimes: number[];
  usage: number;
  maxUsage: number;
  rateRemaining: number | null;
  rateLimit: number | null;
  rateResetAt: number | null;
  bootingStatus: BootingStatus;
  theme: Theme;
}

// --- Reducer Action Types ---

export type AppAction =
  | { type: 'setPage'; page: Page }
  | { type: 'setMode'; mode: InputMode }
  | { type: 'setText'; value: string }
  | { type: 'setImage'; file: File | null }
  | { type: 'setMarket'; value: string }
  | { type: 'setTrackCount'; value: number }
  | { type: 'setTheme'; theme: Theme }
  | { type: 'tickRate' }
  | { type: 'submit' }
  | { type: 'submitResolved'; result: AnalyzeResult; entry: HistoryEntry }
  | { type: 'replayHistory'; entry: HistoryEntry }
  | { type: 'force429' }
  | { type: 'updateRateLimit'; remaining: number | null; limit: number | null; resetAt: number | null }
  | { type: 'addToast'; payload: RateLimitError | string }
  | { type: 'dismissToast'; id: string }
  | { type: 'setBootingStatus'; status: BootingStatus };
