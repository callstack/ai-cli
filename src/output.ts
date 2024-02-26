import * as readline from 'readline';
import chalk from 'chalk';
import type { SessionCosts, SessionUsage } from './providers/session';
import { formatCost } from './format';

let verbose = false;
let showStats = false;
let showCosts = false;

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

export function setShowCosts(value: boolean) {
  showCosts = value;
}

export function outputUser(message: string) {
  console.log('me:', message);
}

export interface OutputAiOptions {
  responseTime?: number;
  usage?: SessionUsage;
  costs?: SessionCosts;
}

export function outputAi(message: string, options?: OutputAiOptions) {
  if (options) {
    const statsOutput = formatSessionStats(options.responseTime, options.usage);
    const costsOutput = formatSessionCosts(options.costs);
    const formatted = [statsOutput, costsOutput].filter((x) => x !== undefined).join(', ');
    console.log(chalk.cyan('ai:', message), chalk.dim(formatted));
  } else {
    console.log(chalk.cyan('ai:', message));
  }
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

export function outputWarning(message: string, ...args: unknown[]) {
  console.log(chalk.yellow(message, ...args));
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

function formatSessionStats(responseTime?: number, usage?: SessionUsage) {
  if (!showStats) {
    return undefined;
  }

  const parts = [
    responseTime ? `time: ${(responseTime / 1000).toFixed(1)} s` : undefined,
    usage
      ? `tokens: ${usage.current.inputTokens}+${usage.current.outputTokens} (total: ${usage.total.inputTokens}+${usage.total.outputTokens})`
      : undefined,
  ];

  return parts.filter((x) => x !== undefined).join(', ');
}

function formatSessionCosts(costs?: SessionCosts) {
  const show = showStats || showCosts;

  if (!show || costs === undefined) {
    return undefined;
  }

  return `costs: ${formatCost(costs.current)} (total: ${formatCost(costs.total)})`;
}
