import { Button } from 'antd';
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
    <Button htmlType="button" className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Button>
  );
}
