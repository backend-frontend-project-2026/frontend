import './bottom-nav.css';

type BottomNavItem = {
  key: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

type BottomNavProps = {
  items: BottomNavItem[];
  ariaLabel?: string;
  classNamePrefix: string;
};

export function BottomNav({
  items,
  ariaLabel = 'Нижняя навигация',
  classNamePrefix,
}: BottomNavProps) {
  return (
    <nav className={`${classNamePrefix}__bottom-nav`} aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={[`${classNamePrefix}__nav-item`, item.active ? 'is-active' : '']
            .filter(Boolean)
            .join(' ')}
          onClick={item.onClick}
        >
          <span className={`${classNamePrefix}__nav-icon`} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
