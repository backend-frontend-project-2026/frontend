import { Button } from 'antd';
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
    <Button htmlType="button" className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Button>
  );
}
