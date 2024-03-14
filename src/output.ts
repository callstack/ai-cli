import * as readline from 'readline';
import chalk from 'chalk';

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
