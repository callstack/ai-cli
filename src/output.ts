import * as readline from 'readline';
import chalk from 'chalk';
import highlight from 'cli-highlight';
import {
  codeBlockAnnotationsRegExp,
  langRegExp,
  splitCodeBlocks,
  stripCodeblockAnnotations,
} from './syntax-highlighting';

let verbose = false;
let syntaxHighlighting = true;

export function setVerbose(value: boolean) {
  verbose = value;
}

export function isVerbose() {
  return verbose;
}

export function outputUser(message: string) {
  console.log('me:', message);
}

export function outputAi(message: string) {
  if (syntaxHighlighting) {
    outputSyntaxHighlighting(message);
    return;
  }

  console.log(chalk.cyan('ai:', message));
}

export function outputSyntaxHighlighting(message: string) {
  const splitted = splitCodeBlocks(message);
  chalk.cyan('ai: ');
  splitted.forEach((segment) => {
    if (segment.match(codeBlockAnnotationsRegExp)) {
      const lang = segment.match(langRegExp)?.[1];
      const stripped = stripCodeblockAnnotations(segment);
      console.log(
        highlight(stripped, {
          language: lang ?? 'plaintext',
          ignoreIllegals: true,
        })
      );
    } else {
      console.log(chalk.cyan(segment));
    }
  });
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
