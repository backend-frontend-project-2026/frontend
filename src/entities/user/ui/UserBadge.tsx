import type { CSSProperties } from 'react';
import { Tag } from 'antd';

type UserBadgeVariant = 'default' | 'accent' | 'outline';

type UserBadgeProps = {
  label: string;
  variant?: UserBadgeVariant;
};

const variantStyles: Record<UserBadgeVariant, CSSProperties> = {
  default: {
    background: '#F3F4F6',
    color: '#111827',
    border: '1px solid transparent',
  },
  accent: {
    background: '#DDFB7C',
    color: '#111827',
    border: '1px solid transparent',
  },
  outline: {
    background: '#FFFFFF',
    color: '#111827',
    border: '1px solid #D1D5DB',
  },
};

export function UserBadge({ label, variant = 'default' }: UserBadgeProps) {
  return (
    <Tag
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        margin: 0,
        padding: '6px 12px',
        borderRadius: '999px',
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1,
        ...variantStyles[variant],
      }}
    >
      {label}
    </Tag>
  );
}
