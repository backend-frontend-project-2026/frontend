type UserAvatarProps = {
  src?: string;
  alt: string;
  name?: string;
  size?: number;
};

export function UserAvatar({ src, alt, name, size = 56 }: UserAvatarProps) {
  const initial = (name || alt || '?').charAt(0).toUpperCase();

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#E5F4EA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size / 2.5,
        color: '#1F2937',
        flexShrink: 0,
      }}
    >
      <span>{initial}</span>

      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ) : null}
    </div>
  );
}
