import { Button } from 'antd';
import type { ReactNode } from 'react';

type SkipProfileButtonProps = {
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
};

export function SkipProfileButton({
  onClick,
  className,
  children = 'Пропустить',
  ariaLabel = 'Пропустить',
  disabled = false,
}: SkipProfileButtonProps) {
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
