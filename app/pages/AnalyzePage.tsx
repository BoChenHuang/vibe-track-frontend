import { useCallback, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { mockAnalyze } from '../mock/mockAnalyze';
import { InputCard } from '../components/analyze/InputCard';
import { MoodSection } from '../components/analyze/MoodSection';
import { ResultsSection } from '../components/analyze/ResultsSection';
import type { AnalyzeResult, HistoryEntry } from '../types/api';
import styles from './AnalyzePage.module.css';

export function AnalyzePage() {
  const { state, dispatch } = useApp();
  const { loading, inputMode, textValue, imageFile } = state;

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    if (inputMode === 'text' && textValue.trim() === '') return;
    if (inputMode === 'image' && imageFile === null) return;

    dispatch({ type: 'submit' });
    try {
      const response = await mockAnalyze();
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
    } catch {
      // real error handling in api-integration change
    }
  }, [loading, inputMode, textValue, imageFile, state.market, dispatch]);

  // ⌘/Ctrl + Enter shortcut — register once, read latest handleSubmit via ref
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
        <ResultsSection />
      </section>
    </main>
  );
}
