export function resolveRouteUserId(value?: string): number | null {
  if (!value) {
    return null;
  }

  if (/^\d+$/.test(value)) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  const match = value.match(/(\d+)$/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function withModeEdit(path: string): string {
  return `${path}?mode=edit`;
}

export function withEditMode(path: string, isEditMode: boolean): string {
  return isEditMode ? withModeEdit(path) : path;
}