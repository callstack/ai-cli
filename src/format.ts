export function formatCost(value: number | undefined, precision = 4) {
  if (value == null) {
    return '?';
  }

  return `$${value.toFixed(precision)}`;
}

/**
 * Formats a token count to a human-readable string. Uses units like K, M, to improve readability.
 */
export function formatTokenCount(tokenCount: number, roundTo = 1) {
  const roundedCount = Math.round(tokenCount / roundTo) * roundTo;
  if (roundedCount === 0) {
    return '0';
  }

  const suffixes = ['', 'K', 'M'];

  // Pick suffix based on the order of magnitude of the count.
  const suffixIndex = Math.min(
    Math.floor(Math.log10(Math.abs(roundedCount)) / 3),
    suffixes.length - 1,
  );

  const scaledCount = roundedCount / Math.pow(10, suffixIndex * 3);
  return `${scaledCount.toFixed(0)}${suffixes[suffixIndex]}`;
}

export function formatTime(timeInMs: number) {
  return `${(timeInMs / 1000).toFixed(1)} s`;
}

export function formatSpeed(tokens: number, timeInMs: number) {
  if (tokens == null || timeInMs == null || timeInMs === 0) {
    return '? tokens/s';
  }

  return `${((tokens * 1000) / timeInMs).toFixed(1)} tok/s`;
}
