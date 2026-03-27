import { Button } from 'antd';
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
    <Button htmlType="button" className={className} onClick={onClick}>
      {children}
    </Button>
  );
}
