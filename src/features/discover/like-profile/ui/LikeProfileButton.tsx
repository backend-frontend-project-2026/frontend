import { Button } from 'antd';
import type { ReactNode } from 'react';

type LikeProfileButtonProps = {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
};

export function LikeProfileButton({
  onClick,
  className,
  children = 'Лайк',
  ariaLabel = 'Лайк',
  disabled = false,
}: LikeProfileButtonProps) {
  return (
    <Button
      htmlType="button"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
