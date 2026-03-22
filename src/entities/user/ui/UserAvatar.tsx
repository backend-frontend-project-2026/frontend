import { Avatar } from 'antd';

type UserAvatarProps = {
  src?: string;
  alt: string;
  name?: string;
  size?: number;
};

export function UserAvatar({ src, alt, name, size = 56 }: UserAvatarProps) {
  const initial = (name || alt || '?').charAt(0).toUpperCase();

  return (
    <Avatar
      src={src}
      alt={alt}
      size={size}
      style={{
        background: '#E5F4EA',
        color: '#1F2937',
        fontWeight: 700,
        fontSize: size / 2.5,
        flexShrink: 0,
      }}
    >
      {initial}
    </Avatar>
  );
}
