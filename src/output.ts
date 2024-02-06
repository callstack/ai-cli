import * as readline from 'readline';
import chalk from 'chalk';

let verbose = false;

export function setVerbose(value: boolean) {
  verbose = value;
}

export function output(message: string, ...args: unknown[]) {
  console.log(message, ...args);
}

export function outputUser(...args: unknown[]) {
  console.log('me: ', ...args);
}

export function outputAi(...args: unknown[]) {
  console.log(chalk.cyan('ai: ', ...args));
}

export function outputAiProgress(message: string) {
  process.stdout.write(chalk.cyan('ai: ' + message));
}

export function outputVerbose(message: string, ...args: unknown[]) {
  if (!verbose) return;

  console.debug(chalk.grey(message), ...args);
}

export function outputError(error: unknown, ...args: unknown[]) {
  const message = extractErrorMessage(error);
  console.error(chalk.red(`ERROR: ${message}`), ...args);
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

/**
 * Clears current lint. To be used in conjunction with `progress`.
 */
export function clearLine() {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
}
