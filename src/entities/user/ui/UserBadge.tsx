import { Tag } from 'antd';
import './user-ui.css';
import type { UserBadgeVariant } from './types';

type UserBadgeProps = {
  label: string;
  variant?: UserBadgeVariant;
};

export function UserBadge({ label, variant = 'default' }: UserBadgeProps) {
  return <Tag className={['user-badge', `user-badge--${variant}`].join(' ')}>{label}</Tag>;
}
