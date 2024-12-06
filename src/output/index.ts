import readline from 'readline';
import { texts } from '../commands/chat/texts.js';
import { colorError, colorVerbose, colorWarning } from './colors.js';

const rl = readline.promises.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('SIGINT', () => {
  if (interruptHandler) {
    interruptHandler();
  }

  rl.close();
});

export async function readUserInput(): Promise<string> {
  const answer = await rl.question(`${texts.userLabel} `);
  return answer;
}

let interruptHandler: (() => void) | undefined;

export function setInterruptHandler(handler: () => void) {
  interruptHandler = handler;
}

let showVerbose = false;

export function getVerbose() {
  return showVerbose;
}

export function setVerbose(verbose: boolean) {
  showVerbose = verbose;
}

export function output(text: string, ...args: unknown[]) {
  console.log(text, ...args);
}

export function outputWarning(text: string) {
  console.warn(colorWarning(text));
}

export function outputError(error: unknown, ...args: unknown[]) {
  const message = extractErrorMessage(error);
  console.error(colorError(`ERROR: ${message}`, ...args));
}

export function outputVerbose(message: string, ...args: unknown[]) {
  if (showVerbose) {
    console.log(colorVerbose(message, ...args));
  }
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

export function clearCurrentLine() {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
}

export function exit() {
  clearCurrentLine();
  output('\nBye...');
  process.exit(0);
}
