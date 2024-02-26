import * as readline from 'readline';
import chalk from 'chalk';
import type { ModelResponseStats } from './inference';

let verbose = false;
let showStats = false;

export function setVerbose(value: boolean) {
  verbose = value;
}

export function isVerbose() {
  return verbose;
}

export function setShowStats(value: boolean) {
  showStats = value;
}

export function shouldShowStats() {
  return showStats;
}

export function outputUser(message: string) {
  console.log('me:', message);
}

export function outputAi(message: string, stats?: ModelResponseStats) {
  const statsOutput = stats && showStats ? chalk.dim(formatStats(stats)) : '';

  console.log(chalk.cyan('ai:', message), statsOutput);
}

export function outputAiProgress(message: string) {
  process.stdout.write(chalk.cyan('ai:', message));
}

export function outputVerbose(message: string, ...args: unknown[]) {
  if (!verbose) return;

  console.debug(chalk.grey(message, ...args));
}

export function outputInfo(message: string, ...args: unknown[]) {
  console.log(chalk.dim(message, ...args));
}

export function outputBold(message: string, ...args: unknown[]) {
  console.log(chalk.bold(message, ...args));
}

export function outputDefault(message: string, ...args: unknown[]) {
  console.log(message, ...args);
}

export function outputError(error: unknown, ...args: unknown[]) {
  const message = extractErrorMessage(error);
  if (error === message) {
    console.error(chalk.red(`ERROR: ${message}`, ...args));
  } else {
    console.error(chalk.red(`ERROR: ${message}`, error, ...args));
  }
}

/**
 * Clears current lint. To be used in conjunction with `progress`.
 */
export function clearLine() {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
}

function extractErrorMessage(error: unknown) {
  if (typeof error === 'object' && error != null && 'message' in error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown error';
}

function formatStats(stats: ModelResponseStats) {
  const parts = [
    `time: ${(stats.responseTime / 1000).toFixed(1)} s`,
    `tokens: ${stats.inputTokens} in + ${stats.outputTokens} out`,
  ];

  return `(${parts.join(', ')})`;
}
