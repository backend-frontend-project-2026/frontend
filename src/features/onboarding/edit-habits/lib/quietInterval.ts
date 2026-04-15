export function formatQuietInterval(from: string, to: string) {
  if (!from && !to) {
    return '';
  }

  return `${from} — ${to}`;
}

export function parseQuietInterval(value: string) {
  const match = value.match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);

  if (!match) {
    return null;
  }

  return {
    from: match[1],
    to: match[2],
  };
}
