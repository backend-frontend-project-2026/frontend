export function addUniqueId(currentIds: string[], nextId: string): string[] {
  if (currentIds.includes(nextId)) {
    return currentIds;
  }

  return [...currentIds, nextId];
}
