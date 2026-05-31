import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [
  { title: 'VibeTrack' },
  { name: 'description', content: '分析你的情緒，獲得 Spotify 歌曲推薦' },
];

export default function HomePage() {
  return <div>Analyze</div>;
}
