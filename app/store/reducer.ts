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
  error: null,
  history: [],
  rateTimes: [],
  usage: 0,
  maxUsage: 5,
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
      return { ...state, loading: true, error: null };
    case 'submitResolved':
      return {
        ...state,
        loading: false,
        result: action.result,
        history: [action.entry, ...state.history],
        usage: state.usage + 1,
      };
    case 'dismissError':
      return { ...state, error: null };
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
    default:
      return state;
  }
}
