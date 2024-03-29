import type { SessionCost, SessionUsage } from './engine/session.js';

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

export function formatSessionStats(responseTime?: number, usage?: SessionUsage) {
  const parts = [
    responseTime ? `time: ${(responseTime / 1000).toFixed(1)} s` : undefined,
    usage
      ? `tokens: ${usage.current.inputTokens}+${usage.current.outputTokens} (total: ${usage.total.inputTokens}+${usage.total.outputTokens})`
      : undefined,
  ];

  return parts.filter((x) => x !== undefined).join(', ');
}

export function formatSessionCost(cost: SessionCost | undefined) {
  if (cost === undefined) {
    return undefined;
  }

  return `costs: ${formatCost(cost.current)} (total: ${formatCost(cost.total)})`;
}

export function formatTime(timeInMs?: number) {
  if (timeInMs == null) {
    return '';
  }

  return `${(timeInMs / 1000).toFixed(1)} s`;
}
