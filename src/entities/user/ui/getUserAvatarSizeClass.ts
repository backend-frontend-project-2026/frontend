export function getUserAvatarSizeClass(size: number) {
  if (size <= 40) return 'user-avatar--size-40';
  if (size <= 48) return 'user-avatar--size-48';
  if (size <= 56) return 'user-avatar--size-56';
  if (size <= 64) return 'user-avatar--size-64';

  return 'user-avatar--size-72';
}
