export function normalizeText(value?: string): string {
  return (value ?? '').trim().toLowerCase();
}

export function normalizeWhitespace(value?: string): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

export function includesNormalizedText(source?: string, search?: string): boolean {
  return normalizeText(source).includes(normalizeText(search));
}
