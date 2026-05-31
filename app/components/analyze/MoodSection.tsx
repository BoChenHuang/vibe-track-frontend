import { useApp } from '../../store/AppContext';
import { MoodPanel } from './MoodPanel';
import { MoodSkeleton } from './MoodSkeleton';
import { PreviewEmpty } from './PreviewEmpty';

export function MoodSection() {
  const { state } = useApp();
  const { loading, result } = state;

  if (loading) return <MoodSkeleton />;
  if (result) return <MoodPanel mood={result.mood} />;
  return <PreviewEmpty />;
}
