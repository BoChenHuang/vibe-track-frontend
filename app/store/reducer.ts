import type { AppAction, AppState, HistoryEntry } from '../types/api';
import { applyTheme } from '../lib/themes';
import { saveHistory, savePrefs, saveRateTimes } from '../lib/storage';

export const initialState: AppState = {
  page: 'analyze',
  inputMode: 'text',
  textValue: '',
  imageFile: null,
  market: 'TW',
  trackCount: 8,
  loading: false,
  result: null,
  toasts: [],
  history: [],
  rateTimes: [],
  usage: 0,
  maxUsage: 5,
  rateRemaining: null,
  rateLimit: null,
  rateResetAt: null,
  bootingStatus: 'booting',
  theme: 'neon',
};

const RATE_WINDOW_MS = 3_600_000;

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'setPage':
      return { ...state, page: action.page };
    case 'setMode':
      return { ...state, inputMode: action.mode };
    case 'setText':
      return { ...state, textValue: action.value };
    case 'setImage':
      return { ...state, imageFile: action.file };
    case 'setMarket':
      return { ...state, market: action.value };
    case 'setTrackCount':
      return { ...state, trackCount: action.value };
    case 'setTheme': {
      applyTheme(action.theme);
      savePrefs({ theme: action.theme });
      return { ...state, theme: action.theme };
    }
    case 'tickRate': {
      const now = Date.now();
      const filtered = state.rateTimes.filter((t) => t > now - RATE_WINDOW_MS);
      if (filtered.length === state.rateTimes.length) return state;
      saveRateTimes(filtered);
      return { ...state, rateTimes: filtered };
    }
    case 'submit':
      return { ...state, loading: true };
    case 'submitFailed':
      return { ...state, loading: false };
    case 'submitResolved': {
      const newHistory: HistoryEntry[] = [action.entry, ...state.history];
      saveHistory(newHistory);
      return {
        ...state,
        loading: false,
        result: action.result,
        history: newHistory,
        usage: state.usage + 1,
      };
    }
    case 'addToast':
      return {
        ...state,
        loading: false,
        toasts: [...state.toasts, { id: String(Date.now()), payload: action.payload }],
      };
    case 'dismissToast':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case 'replayHistory':
      return {
        ...state,
        page: 'analyze',
        result: {
          mood: action.entry.mood,
          tracks: action.entry.tracks,
          market: action.entry.market,
          ts: action.entry.ts,
        },
      };
    case 'restoreHistory':
      return { ...state, history: action.entries };
    case 'restorePrefs':
      return { ...state, theme: action.prefs.theme };
    case 'restoreRateTimes':
      return { ...state, rateTimes: action.times };
    case 'force429':
      return { ...state, usage: state.maxUsage };
    case 'updateRateLimit':
      return {
        ...state,
        rateRemaining: action.remaining,
        rateLimit: action.limit,
        rateResetAt: action.resetAt,
      };
    case 'setBootingStatus':
      return { ...state, bootingStatus: action.status };
    default:
      return state;
  }
}
