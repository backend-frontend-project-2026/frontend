import { Button } from 'antd';

type FilterChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
};

export function FilterChip({ label, selected, onClick, compact = false }: FilterChipProps) {
  return (
    <Button
      type="default"
      className={[
        'filters-chip',
        compact ? 'filters-chip--compact' : '',
        selected ? 'is-selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      <span className="filters-chip__dot" />
      <span>{label}</span>
    </Button>
  );
}
