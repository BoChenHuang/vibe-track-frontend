import type { MetaFunction } from 'react-router';
import { AnalyzePage } from '../pages/AnalyzePage';

export const meta: MetaFunction = () => [
  { title: 'VibeTrack — Analyze' },
  { name: 'description', content: '分析你的情緒，獲得 Spotify 歌曲推薦' },
];

export default function HomePage() {
  return <AnalyzePage />;
}
