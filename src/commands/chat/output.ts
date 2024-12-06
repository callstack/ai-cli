import { colorError, colorVerbose, colorWarning } from './colors.js';

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
