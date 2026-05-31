import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../store/AppContext';
import { formatFileSize } from '../../lib/utils';
import styles from './ImageUpload.module.css';

export function ImageUpload() {
  const { state, dispatch } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { imageFile } = state;

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function handleFile(file: File | undefined) {
    if (!file) return;
    dispatch({ type: 'setImage', file });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0]);
  }

  if (imageFile && previewUrl) {
    return (
      <div className={styles.preview}>
        <img src={previewUrl} alt="Preview" className={styles.previewImg} />
        <div className={styles.previewInfo}>
          <span className={styles.fileName}>{imageFile.name}</span>
          <span className={styles.fileSize}>{formatFileSize(imageFile.size)}</span>
        </div>
        <button
          className={styles.removeBtn}
          onClick={() => dispatch({ type: 'setImage', file: null })}
          aria-label="Remove image"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className={styles.fileInput}
        onChange={onInputChange}
      />
      <div className={styles.dropContent}>
        <span className={styles.dropIcon}>↑</span>
        <span className={styles.dropText}>Drop an image here or click to upload</span>
        <span className={styles.dropHint}>JPEG · PNG · WebP · GIF</span>
      </div>
    </div>
  );
}
