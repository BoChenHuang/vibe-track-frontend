import type { HistoryEntry, Theme } from '../types/api';

const HISTORY_KEY = 'vibetrack:history:v3';
const PREFS_KEY = 'vibetrack:prefs:v3';
const RATE_TIMES_KEY = 'vibetrack:ratetimes:v3';
const HISTORY_LIMIT = 50;

export interface Prefs {
  theme: Theme;
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, HISTORY_LIMIT)));
  } catch { /* silently ignore write failures */ }
}

export function loadHistory(): HistoryEntry[] | null {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return null;
  }
}

export function savePrefs(prefs: Prefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch { /* silently ignore write failures */ }
}

export function loadPrefs(): Prefs | null {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Prefs;
  } catch {
    return null;
  }
}

export function saveRateTimes(times: number[]): void {
  try {
    localStorage.setItem(RATE_TIMES_KEY, JSON.stringify(times));
  } catch { /* silently ignore write failures */ }
}

export function loadRateTimes(): number[] | null {
  try {
    const raw = localStorage.getItem(RATE_TIMES_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as number[];
  } catch {
    return null;
  }
}
