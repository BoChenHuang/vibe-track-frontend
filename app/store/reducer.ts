import type { AppAction, AppState } from '../types/api';

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
    case 'setTheme':
      return { ...state, theme: action.theme };
    case 'tickRate':
      return state;
    case 'submit':
      return { ...state, loading: true };
    case 'submitResolved':
      return {
        ...state,
        loading: false,
        result: action.result,
        history: [action.entry, ...state.history],
        usage: state.usage + 1,
      };
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
