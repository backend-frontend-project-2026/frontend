import type { ReactNode } from 'react';

type SkipProfileButtonProps = {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

export function SkipProfileButton({
  onClick,
  className,
  children = 'Пропустить',
  ariaLabel = 'Пропустить',
}: SkipProfileButtonProps) {
  return (
    <button type="button" className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
