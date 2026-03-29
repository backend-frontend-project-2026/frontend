import { Button } from 'antd';
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
    <Button htmlType="button" className={className} onClick={onClick}>
      {children}
    </Button>
  );
}
