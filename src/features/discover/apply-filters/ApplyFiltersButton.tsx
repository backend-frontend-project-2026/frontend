import type { ReactNode } from 'react';

type ApplyFiltersButtonProps = {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
};

export function ApplyFiltersButton({
  onClick,
  className,
  children = 'Применить',
}: ApplyFiltersButtonProps) {
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
