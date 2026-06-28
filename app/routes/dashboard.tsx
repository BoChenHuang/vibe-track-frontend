import type { MetaFunction } from 'react-router';
import { DashboardPage } from '../pages/DashboardPage';

export const meta: MetaFunction = () => [{ title: 'Dashboard — VibeTrack' }];

export default function DashboardRoute() {
  return <DashboardPage />;
}
