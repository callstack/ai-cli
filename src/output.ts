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
  console.log(chalk.blue('ai: ', ...args));
}

export function outputAiProgress(message: string) {
  process.stdout.write(chalk.blue('ai: ' + message));
}

export function outputVerbose(message: string, ...args: unknown[]) {
  if (!verbose) return;

  console.debug(chalk.grey(message), ...args);
}

export function outputError(message: string, ...args: unknown[]) {
  console.error(chalk.red(`ERROR: ${message}`), ...args);
}

/**
 * Clears current lint. To be used in conjunction with `progress`.
 */
export function clearLine() {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
}
