import { normalizeWhitespace } from '../../../../shared/utils/texts';

export const DESKTOP_PREVIEW_TEXT =
  'Люблю порядок и спокойные вечера. Ищу соседку на весенний семестр.';

export function normalizeTag(value: string) {
  return normalizeWhitespace(value.replace(/^["“”']+|["“”']+$/g, ''));
}