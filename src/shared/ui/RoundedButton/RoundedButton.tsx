import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg?react';
import styles from './RoundedButton.module.css';

type RoundedButtonVariant = 'accent' | 'dark' | 'gray';

interface RoundedButtonProps extends Omit<ButtonProps, 'type' | 'variant'> {
  children: React.ReactNode;
  variant?: RoundedButtonVariant;
}

const RoundedButton = ({ children, className, variant, ...props }: RoundedButtonProps) => {
  const icon =
    variant === 'dark' ? (
      <span className={`${styles.iconCircle} ${styles.iconCircleLight}`}>
        <ArrowUpRightIcon />
      </span>
    ) : variant === 'gray' ? (
      <span className={`${styles.iconCircle} ${styles.iconCircleDark}`}>
        <ArrowUpRightIcon />
      </span>
    ) : (
      <ArrowUpRightIcon />
    );

  return (
    <Button
      className={[styles.button, variant ? styles[variant] : '', className]
        .filter(Boolean)
        .join(' ')}
      icon={icon}
      iconPlacement="end"
      type={variant === 'accent' || !variant ? 'primary' : 'default'}
      {...props}
    >
      {children}
    </Button>
  );
};

export default RoundedButton;
