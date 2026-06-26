import type { Theme } from '../types/api';

interface ThemeTokens {
  '--bg-0': string;
  '--bg-1': string;
  '--bg-2': string;
  '--neon-a': string;
  '--neon-b': string;
  '--neon-c': string;
  '--neon-d': string;
  '--grad-primary': string;
}

export const THEMES: Record<Theme, ThemeTokens> = {
  neon: {
    '--bg-0': '#07060d',
    '--bg-1': '#0d0a18',
    '--bg-2': '#14112a',
    '--neon-a': '#ff3cac',
    '--neon-b': '#7a5cff',
    '--neon-c': '#00e5ff',
    '--neon-d': '#b8ff3c',
    '--grad-primary': 'linear-gradient(135deg, #ff3cac 0%, #7a5cff 50%, #00e5ff 100%)',
  },
  sunset: {
    '--bg-0': '#0d0508',
    '--bg-1': '#170a0e',
    '--bg-2': '#221018',
    '--neon-a': '#ff6b35',
    '--neon-b': '#ff3cac',
    '--neon-c': '#ffb547',
    '--neon-d': '#ff8c69',
    '--grad-primary': 'linear-gradient(135deg, #ff6b35 0%, #ff3cac 50%, #ffb547 100%)',
  },
  aurora: {
    '--bg-0': '#04100d',
    '--bg-1': '#081a14',
    '--bg-2': '#0c221a',
    '--neon-a': '#00e5ff',
    '--neon-b': '#6cffb4',
    '--neon-c': '#7a5cff',
    '--neon-d': '#b8ff3c',
    '--grad-primary': 'linear-gradient(135deg, #00e5ff 0%, #6cffb4 50%, #7a5cff 100%)',
  },
  mono: {
    '--bg-0': '#0a0a0a',
    '--bg-1': '#141414',
    '--bg-2': '#1e1e1e',
    '--neon-a': '#ffffff',
    '--neon-b': '#cccccc',
    '--neon-c': '#999999',
    '--neon-d': '#666666',
    '--grad-primary': 'linear-gradient(135deg, #ffffff 0%, #cccccc 50%, #999999 100%)',
  },
};

export function applyTheme(theme: Theme): void {
  const tokens = THEMES[theme];
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(tokens)) {
    root.style.setProperty(prop, value);
  }
}
