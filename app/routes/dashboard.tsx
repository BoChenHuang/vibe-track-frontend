import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [
  { title: 'Dashboard — VibeTrack' },
];

export default function DashboardPage() {
  return <div>Dashboard</div>;
}
