import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../store/AppContext';
import { analyzeVibe, RateLimitApiError } from '../lib/api';
import { InputCard } from '../components/analyze/InputCard';
import { MoodSection } from '../components/analyze/MoodSection';
import { ResultsSection } from '../components/analyze/ResultsSection';
import { AudioPlayer } from '../components/analyze/AudioPlayer';
import type { AnalyzeResult, HistoryEntry } from '../types/api';
import styles from './AnalyzePage.module.css';

export function AnalyzePage() {
  const { state, dispatch } = useApp();
  const { loading, inputMode, textValue, imageFile } = state;

  const [playingId, setPlayingId] = useState<string | null>(null);

  function handlePlayToggle(id: string) {
    setPlayingId((prev) => (prev === id ? null : id));
  }

  const playingTrack = state.result?.tracks.find((t) => t.id === playingId) ?? null;
  const previewSrc = playingTrack?.preview_url ?? null;

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    if (inputMode === 'text' && textValue.trim() === '') return;
    if (inputMode === 'image' && imageFile === null) return;

    dispatch({ type: 'submit' });
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 400));
    try {
      const { data: response, headers } = await analyzeVibe({
        mode: inputMode,
        text: inputMode === 'text' ? textValue : undefined,
        image: inputMode === 'image' ? imageFile : null,
        market: state.market,
        limit: state.trackCount,
      });

      await minDelay;

      const ts = Date.now();
      const result: AnalyzeResult = {
        mood: response.mood,
        tracks: response.tracks,
        market: state.market,
        ts,
      };
      const entry: HistoryEntry = {
        id: String(ts),
        ts,
        type: inputMode,
        input: inputMode === 'text' ? textValue : (imageFile?.name ?? ''),
        market: state.market,
        mood: response.mood,
        tracks: response.tracks,
      };
      dispatch({ type: 'submitResolved', result, entry });

      if (headers.remaining !== null || headers.limit !== null) {
        dispatch({
          type: 'updateRateLimit',
          remaining: headers.remaining,
          limit: headers.limit,
          resetAt: headers.resetAt,
        });
      }

      setPlayingId(null);
    } catch (err) {
      await minDelay;
      if (err instanceof RateLimitApiError) {
        dispatch({ type: 'addToast', payload: err.body });
      } else {
        dispatch({ type: 'addToast', payload: '分析失敗，請稍後再試' });
      }
    }
  }, [loading, inputMode, textValue, imageFile, state.market, state.trackCount, dispatch]);

  const handleSubmitRef = useRef(handleSubmit);
  handleSubmitRef.current = handleSubmit;

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSubmitRef.current();
      }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <span className={styles.eyebrow}>Vibe Analysis</span>
        <h1 className={styles.title}>What's the vibe?</h1>
        <p className={styles.subtitle}>
          Describe your mood or drop an image — we'll find your soundtrack.
        </p>
      </header>

      <div className={styles.analyzeGrid}>
        <div className={styles.inputCol}>
          <InputCard onSubmit={handleSubmit} />
        </div>
        <div className={styles.moodCol}>
          <MoodSection />
        </div>
      </div>

      <section className={styles.resultsSection}>
        <ResultsSection playingId={playingId} onPlayToggle={handlePlayToggle} />
      </section>

      <AudioPlayer src={previewSrc} onEnded={() => setPlayingId(null)} />
    </main>
  );
}
