import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import styles from './RoundedButton.module.css';

interface RoundedButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const ArrowUpRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 12L12 2M12 2H5M12 2V9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RoundedButton = ({ children, className, ...props }: RoundedButtonProps) => {
  return (
    <Button
      className={`${styles.button} ${className ?? ''}`}
      icon={<ArrowUpRight />}
      iconPosition="end"
      {...props}
    >
      {children}
    </Button>
  );
};

export default RoundedButton;
