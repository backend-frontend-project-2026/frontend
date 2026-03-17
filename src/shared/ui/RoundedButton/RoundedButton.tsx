import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg?react';
import styles from './RoundedButton.module.css';

interface RoundedButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const RoundedButton = ({ children, className, ...props }: RoundedButtonProps) => {
  return (
    <Button
      className={[styles.button, className].filter(Boolean).join(' ')}
      icon={<ArrowUpRightIcon />}
      iconPosition="end"
      {...props}
    >
      {children}
    </Button>
  );
};

export default RoundedButton;
