import type { AnalyzeResponse } from '../types/api';

export const mockResponse: AnalyzeResponse = {
  mood: {
    label: 'Melancholic Nostalgia',
    sub: 'Wistful longing wrapped in a golden, dreamlike haze',
    gradA: '#7a5cff',
    gradB: '#ff3cac',
    signals: 7,
    tags: [
      { name: 'nostalgic', primary: true },
      { name: 'wistful', primary: false },
      { name: 'introspective', primary: false },
      { name: 'emotional', primary: false },
    ],
  },
  tracks: [
    {
      id: 'mock-1',
      title: 'Clair de Lune',
      artist: 'Claude Debussy',
      spotify_url: 'https://open.spotify.com/track/mock1',
      preview_url: 'https://p.scdn.co/mp3-preview/mock1',
      popularity: 84,
      album_image_url: 'https://picsum.photos/seed/vibetrack1/300/300',
      reason:
        'The delicate piano notes evoke a dreamlike melancholy that mirrors your reflective, wistful mood perfectly.',
    },
    {
      id: 'mock-2',
      title: 'Gymnopédie No.1',
      artist: 'Erik Satie',
      spotify_url: 'https://open.spotify.com/track/mock2',
      preview_url: 'https://p.scdn.co/mp3-preview/mock2',
      popularity: 79,
      album_image_url: 'https://picsum.photos/seed/vibetrack2/300/300',
      reason:
        'Satie\'s unhurried tempo and gentle harmonic language create a space for quiet introspection and nostalgia.',
    },
    {
      id: 'mock-3',
      title: 'River',
      artist: 'Joni Mitchell',
      spotify_url: 'https://open.spotify.com/track/mock3',
      preview_url: null,
      popularity: 72,
      album_image_url: 'https://picsum.photos/seed/vibetrack3/300/300',
      reason:
        'Mitchell\'s raw, longing vocal conveys the kind of emotional weight that resonates deeply with your current state.',
    },
    {
      id: 'mock-4',
      title: 'The Night Will Always Win',
      artist: 'Manchester Orchestra',
      spotify_url: 'https://open.spotify.com/track/mock4',
      preview_url: 'https://p.scdn.co/mp3-preview/mock4',
      popularity: null,
      album_image_url: 'https://picsum.photos/seed/vibetrack4/300/300',
      reason:
        'A sweeping emotional landscape that captures the beauty and ache of looking back at who you used to be.',
    },
    {
      id: 'mock-5',
      title: 'First Day of My Life',
      artist: 'Bright Eyes',
      spotify_url: 'https://open.spotify.com/track/mock5',
      preview_url: 'https://p.scdn.co/mp3-preview/mock5',
      popularity: 68,
      album_image_url: null,
      reason:
        'Conor Oberst\'s earnest delivery transforms ordinary moments into something timeless — much like nostalgia itself.',
    },
    {
      id: 'mock-6',
      title: 'Lua',
      artist: 'Bright Eyes',
      spotify_url: 'https://open.spotify.com/track/mock6',
      preview_url: null,
      popularity: 61,
      album_image_url: 'https://picsum.photos/seed/vibetrack6/300/300',
      reason:
        'A midnight confessional that pairs fragile guitar work with hauntingly honest lyricism about memory and loss.',
    },
    {
      id: 'mock-7',
      title: 'Holocene',
      artist: 'Bon Iver',
      spotify_url: 'https://open.spotify.com/track/mock7',
      preview_url: null,
      popularity: 88,
      album_image_url: null,
      reason:
        'Bon Iver\'s sprawling, textured soundscape feels like the audio equivalent of staring out a car window at a landscape you\'ll never see again.',
    },
  ],
};
