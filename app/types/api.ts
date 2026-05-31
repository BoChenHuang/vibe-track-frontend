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

export type Theme = 'neon' | 'sunset' | 'aurora' | 'mono';

export type Page = 'analyze' | 'dashboard';

export type InputMode = 'text' | 'image';

export interface AnalyzeResult {
  mood: Mood;
  tracks: Track[];
  market: string;
  ts: number;
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
  error: RateLimitError | string | null;
  history: HistoryEntry[];
  rateTimes: number[];
  usage: number;
  maxUsage: number;
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
  | { type: 'dismissError' }
  | { type: 'replayHistory'; entry: HistoryEntry }
  | { type: 'force429' };
