import * as readline from 'readline';
import chalk from 'chalk';

let verbose = false;

export function setVerbose(value: boolean) {
  verbose = value;
}

export function outputUser(message: string) {
  console.log('me:', message);
}

export function outputAi(message: string) {
  console.log(chalk.cyan('ai:', message));
}

export function outputAiProgress(message: string) {
  process.stdout.write(chalk.cyan('ai:', message));
}

export function outputVerbose(message: string, ...args: unknown[]) {
  if (!verbose) return;

  console.debug(chalk.grey(message), ...args);
}

export function outputError(error: unknown, ...args: unknown[]) {
  const message = extractErrorMessage(error);
  console.error(chalk.red(`ERROR: ${message}`), error, ...args);
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
