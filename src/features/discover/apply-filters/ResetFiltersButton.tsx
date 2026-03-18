import type { ReactNode } from 'react';

type ResetFiltersButtonProps = {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
};

export function ResetFiltersButton({
  onClick,
  className,
  children = 'Сбросить',
}: ResetFiltersButtonProps) {
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
