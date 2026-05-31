import { useApp } from '../../store/AppContext';
import { InputTabs } from './InputTabs';
import { TextInput } from './TextInput';
import { ImageUpload } from './ImageUpload';
import { ControlsRow } from './ControlsRow';
import styles from './InputCard.module.css';

interface InputCardProps {
  onSubmit: () => void;
}

export function InputCard({ onSubmit }: InputCardProps) {
  const { state } = useApp();

  return (
    <div className={styles.card}>
      <InputTabs />
      {state.inputMode === 'text' ? <TextInput /> : <ImageUpload />}
      <ControlsRow onSubmit={onSubmit} />
    </div>
  );
}
