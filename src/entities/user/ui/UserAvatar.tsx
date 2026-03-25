import { Avatar } from 'antd';
import './user-ui.css';
import { getUserAvatarSizeClass } from './getUserAvatarSizeClass';

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
      className={['user-avatar', getUserAvatarSizeClass(size)].join(' ')}
    >
      {initial}
    </Avatar>
  );
}
