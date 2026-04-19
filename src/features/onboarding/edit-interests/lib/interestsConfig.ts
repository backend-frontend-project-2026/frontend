import { normalizeWhitespace } from '../../../../shared/utils/texts';

export const PRESET_INTERESTS = ['Учёба', 'Спорт', 'Кино', 'Музыка', 'Игры', 'Кулинария'];

export const DESKTOP_PREVIEW_TEXT =
  'Люблю порядок и спокойные вечера. Ищу соседку на весенний семестр.';

export function normalizeTag(value: string) {
  return normalizeWhitespace(value.replace(/^["“”']+|["“”']+$/g, ''));
}
