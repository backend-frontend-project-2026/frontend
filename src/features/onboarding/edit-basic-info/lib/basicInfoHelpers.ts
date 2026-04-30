const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

function hasAllowedImageType(file: File) {
  if (file.type) {
    return ALLOWED_IMAGE_TYPES.includes(file.type);
  }

  return /\.(jpg|jpeg|png|webp)$/i.test(file.name);
}

export function validateImageFile(file: File) {
  if (!hasAllowedImageType(file)) {
    return 'Можно загрузить только JPG, PNG или WEBP.';
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Файл слишком большой. Максимальный размер — ${MAX_IMAGE_SIZE_MB} МБ.`;
  }

  return null;
}

export function revokeObjectUrl(url: string) {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
