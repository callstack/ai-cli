import chalk from 'chalk';

export function outputError(error: unknown, ...args: unknown[]) {
  const message = extractErrorMessage(error);
  console.error(chalk.red(`ERROR: ${message}`, ...args));
}

export function extractErrorMessage(error: unknown) {
  if (typeof error === 'object' && error != null && 'message' in error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown error';
}
