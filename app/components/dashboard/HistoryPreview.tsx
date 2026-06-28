import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../store/AppContext';
import { loadImage } from '../../lib/imageStore';
import { MoodPanel } from '../analyze/MoodPanel';
import { AudioPlayer } from '../analyze/AudioPlayer';
import { SongMini } from './SongMini';
import type { HistoryEntry } from '../../types/api';
import styles from './HistoryPreview.module.css';

interface HistoryPreviewProps {
  entry: HistoryEntry;
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function HistoryPreview({ entry }: HistoryPreviewProps) {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (entry.type !== 'image') {
      setImagePreviewUrl(null);
      return;
    }
    let cancelled = false;
    let objectUrl: string | null = null;
    loadImage(entry.id).then((file) => {
      if (cancelled || !file) return;
      objectUrl = URL.createObjectURL(file);
      setImagePreviewUrl(objectUrl);
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [entry.id, entry.type]);

  function handlePlayToggle(id: string) {
    setPlayingId((prev) => (prev === id ? null : id));
  }

  async function handleReplay() {
    if (entry.type === 'image') {
      const file = await loadImage(entry.id);
      if (file !== null) {
        dispatch({ type: 'restoreImageFile', file });
      } else {
        dispatch({ type: 'setImage', file: null });
      }
    }
    dispatch({ type: 'replayHistory', entry });
    void navigate('/');
  }

  const playingTrack = entry.tracks.find((t) => t.id === playingId) ?? null;

  return (
    <div className={styles.preview}>
      <div className={styles.meta}>
        <div className={styles.metaInfo}>
          <span className={styles.metaItem}>{formatTimestamp(entry.ts)}</span>
          <span className={styles.metaDot}>·</span>
          <span className={styles.metaItem}>{entry.market}</span>
          <span className={styles.metaDot}>·</span>
          <span className={styles.metaItem}>{entry.type === 'text' ? '文字' : '圖片'}</span>
          <span className={styles.metaDot}>·</span>
          <span className={styles.metaItem}>{entry.tracks.length} tracks</span>
        </div>
        <button type="button" className={styles.replayBtn} onClick={handleReplay}>
          ↺ Replay on Analyze
        </button>
      </div>

      <div className={styles.inputBlock}>
        <span className={styles.inputLabel}>Input</span>
        {entry.type === 'image' ? (
          imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt={entry.input}
              className={styles.inputImage}
              onClick={() => dialogRef.current?.showModal()}
            />
          ) : (
            <p className={styles.inputText}>[圖片] {entry.input}</p>
          )
        ) : (
          <p className={styles.inputText}>{entry.input}</p>
        )}
      </div>

      <MoodPanel mood={entry.mood} />

      <div className={styles.songsSection}>
        <span className={styles.songsLabel}>Recommended Tracks</span>
        <div className={styles.songsGrid}>
          {entry.tracks.map((track) => (
            <SongMini
              key={track.id}
              track={track}
              playingId={playingId}
              onPlayToggle={handlePlayToggle}
            />
          ))}
        </div>
      </div>

      <AudioPlayer src={playingTrack?.preview_url ?? null} onEnded={() => setPlayingId(null)} />

      <dialog ref={dialogRef} className={styles.lightbox} onClick={() => dialogRef.current?.close()}>
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt={entry.input}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <button
          type="button"
          className={styles.lightboxClose}
          onClick={() => dialogRef.current?.close()}
          aria-label="Close"
        >
          ✕
        </button>
      </dialog>
    </div>
  );
}
