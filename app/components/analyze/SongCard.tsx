import type { Track } from '../../types/api';
import { PlayIcon, PauseIcon, SpotifyIcon, ExternalLinkIcon } from '../../lib/icons';
import styles from './SongCard.module.css';

interface SongCardProps {
  track: Track;
  rank: number;
  playingId: string | null;
  onPlayToggle: (id: string) => void;
  placeholder?: boolean;
}

const WAVE_BARS = [
  { h: 5, delay: '0s' },
  { h: 11, delay: '0.1s' },
  { h: 7, delay: '0.2s' },
  { h: 14, delay: '0.05s' },
  { h: 9, delay: '0.15s' },
];

export function SongCard({ track, rank, playingId, onPlayToggle, placeholder = false }: SongCardProps) {
  const isPlaying = playingId === track.id;
  const rankLabel = `#${String(rank).padStart(2, '0')}`;

  if (placeholder) {
    return (
      <div className={styles.card} style={{ opacity: 0.35, pointerEvents: 'none' }}>
        <div className={styles.cover}>
          <div className={styles.coverFallback} />
          <div className={styles.coverShade} />
          <span className={styles.rankBadge}>{rankLabel}</span>
        </div>
        <div className={styles.content}>
          <div style={{ height: 14, background: 'var(--surface-2)', borderRadius: 4 }} />
          <div style={{ height: 11, width: '60%', background: 'var(--surface)', borderRadius: 4 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cover}>
        {track.album_image_url ? (
          <img
            src={track.album_image_url}
            alt={`${track.title} album`}
            className={styles.coverImg}
            loading="lazy"
            width={300}
            height={300}
          />
        ) : (
          <div className={styles.coverFallback} />
        )}
        <div className={styles.coverShade} />
        <span className={styles.rankBadge}>{rankLabel}</span>

        {track.popularity != null && (
          <span className={styles.popBadge}>POP {track.popularity}</span>
        )}

        {track.preview_url != null && (
          <>
            <button
              className={`${styles.playBtn} ${isPlaying ? styles.playBtnActive : ''}`}
              onClick={() => onPlayToggle(track.id)}
              aria-label={isPlaying ? 'Pause' : 'Play preview'}
            >
              {isPlaying ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
            </button>
            <div className={`${styles.wave} ${isPlaying ? styles.waveActive : ''}`}>
              {WAVE_BARS.map((b, i) => (
                <div
                  key={i}
                  className={styles.waveBar}
                  style={{ height: `${b.h}px`, animationDelay: b.delay }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.content}>
        <p className={styles.title}>{track.title}</p>
        <p className={styles.artist}>{track.artist}</p>
        <p className={styles.reason}>{track.reason}</p>
        <div className={styles.footer}>
          <a
            href={track.spotify_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.spotifyBtn}
          >
            <SpotifyIcon size={12} />
            Spotify
            <ExternalLinkIcon size={10} />
          </a>
          <span className={styles.previewStatus}>
            {track.preview_url ? '30s preview' : 'no preview'}
          </span>
        </div>
      </div>
    </div>
  );
}
