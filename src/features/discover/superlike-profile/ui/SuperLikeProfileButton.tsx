import type { ReactNode } from 'react';

type SuperLikeProfileButtonProps = {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

export function SuperLikeProfileButton({
  onClick,
  className,
  children = 'Супер-лайк',
  ariaLabel = 'Супер-лайк',
}: SuperLikeProfileButtonProps) {
  return (
    <button type="button" className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
