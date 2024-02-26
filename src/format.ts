export function formatCost(value: number | undefined, precision = 4) {
  if (value == null) {
    return '?';
  }

  return `$${value.toFixed(precision)}`;
}

export function formatTokenCount(tokenCount: number, roundTo = 1) {
  const roundedCount = Math.round(tokenCount / roundTo) * roundTo;

  const suffixes = ['', 'K', 'M'];
  const suffixIndex = Math.floor(Math.log10(Math.abs(roundedCount)) / 3);
  const scaledCount = roundedCount / Math.pow(10, suffixIndex * 3);
  return `${scaledCount.toFixed(0)}${suffixes[suffixIndex]}`;
}
