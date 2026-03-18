import type { ReactNode } from 'react';

type LikeProfileButtonProps = {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

export function LikeProfileButton({
  onClick,
  className,
  children = 'Лайк',
  ariaLabel = 'Лайк',
}: LikeProfileButtonProps) {
  return (
    <button type="button" className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
