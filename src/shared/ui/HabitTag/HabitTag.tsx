import styles from './HabitTag.module.css';

interface HabitTagProps {
  label: string;
  selected?: boolean;
  onChange?: (selected: boolean) => void;
  readonly?: boolean;
}

const HabitTag = ({ label, selected = false, onChange, readonly = false }: HabitTagProps) => {
  const handleClick = () => {
    if (!readonly && onChange) {
      onChange(!selected);
    }
  };

  return (
    <button
      type="button"
      aria-pressed={!readonly ? selected : undefined}
      className={`${styles.tag} ${selected ? styles.selected : ''} ${readonly ? styles.readonly : ''}`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

export default HabitTag;
