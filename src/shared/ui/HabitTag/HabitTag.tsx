import { Button } from 'antd';
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
    <Button
      type="default"
      htmlType="button"
      className={`${styles.tag} ${selected ? styles.selected : ''}`}
      onClick={handleClick}
      disabled={readonly}
      aria-pressed={!readonly ? selected : undefined}
    >
      {label}
    </Button>
  );
};

export default HabitTag;
