import type { Track } from '../../types/api';
import { PlayIcon, PauseIcon, SpotifyIcon } from '../../lib/icons';
import styles from './SongMini.module.css';

interface SongMiniProps {
  track: Track;
  playingId: string | null;
  onPlayToggle: (id: string) => void;
}

export function SongMini({ track, playingId, onPlayToggle }: SongMiniProps) {
  const isPlaying = playingId === track.id;

  return (
    <div className={styles.item}>
      <div className={styles.cover}>
        {track.album_image_url ? (
          <img
            src={track.album_image_url}
            alt={track.title}
            width={40}
            height={40}
            className={styles.img}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.title}>{track.title}</span>
        <span className={styles.artist}>{track.artist}</span>
      </div>
      <div className={styles.actions}>
        {track.preview_url && (
          <button
            type="button"
            className={`${styles.playBtn}${isPlaying ? ` ${styles.playBtnActive}` : ''}`}
            onClick={() => onPlayToggle(track.id)}
            aria-label={isPlaying ? 'Pause' : 'Play preview'}
          >
            {isPlaying ? <PauseIcon size={11} /> : <PlayIcon size={11} />}
          </button>
        )}
        <a
          href={track.spotify_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.spotifyLink}
          aria-label="Open in Spotify"
        >
          <SpotifyIcon size={13} />
        </a>
      </div>
    </div>
  );
}
