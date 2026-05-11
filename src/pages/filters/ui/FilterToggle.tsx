import { Switch } from 'antd';

type FilterToggleProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

export function FilterToggle({ label, checked, onToggle }: FilterToggleProps) {
  return (
    <div
      className="filters-toggle-row"
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      <span className="filters-toggle-row__label">{label}</span>

      <Switch
        checked={checked}
        className="filters-toggle"
        onChange={onToggle}
        onClick={(_, event) => event.stopPropagation()}
      />
    </div>
  );
}
