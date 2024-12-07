import cliSpinners from 'cli-spinners';
import { colorAssistant } from '../../colors.js';

const spinner = cliSpinners.dots;
const frames = spinner.frames.map((f) => colorAssistant(f));

let currentLine = '';
let outputtedLines: string[] = [];

let intervalRef: NodeJS.Timeout | undefined;
let frameIndex = 0;

export function streamingStart(text: string) {
  const lines = text.trimEnd().split('\n');
  const linesToPrint = lines.slice(0, -1);
  if (linesToPrint.length > 0) {
    process.stdout.write(`${CLEAR_LINE}${linesToPrint.join('\n')}\n`);
  }

  outputtedLines = linesToPrint;
  currentLine = lines[lines.length - 1];
  startSpinner();
}

export function streamingUpdate(text: string) {
  const lines = text.trimEnd().split('\n');
  const linesToPrint = lines.slice(outputtedLines.length, -1);
  if (linesToPrint.length > 0) {
    process.stdout.write(`${CLEAR_LINE}${linesToPrint.join('\n')}\n`);
  }

  outputtedLines = lines.slice(0, -1);
  currentLine = lines[lines.length - 1];
  // Will render new text in the next animation frame
}

export function streamingFinish(text: string) {
  clearInterval(intervalRef);
  const lines = text.trimEnd().split('\n');
  const linesToPrint = lines.slice(outputtedLines.length);
  process.stdout.write(`${CLEAR_LINE}${linesToPrint.join('\n')}\n`);
}

export function streamingClear() {
  clearInterval(intervalRef);
}

export const CLEAR_LINE = '\u001b[0G\u001b[2K';
export const DISABLE_WORD_WRAP = '\u001b[?7l';
export const ENABLE_WORD_WRAP = '\u001b[?7h';

export function startSpinner() {
  if (intervalRef) {
    clearInterval(intervalRef);
  }

  intervalRef = setInterval(renderFrame, spinner.interval).unref();
}

function renderFrame() {
  frameIndex = (frameIndex + 1) % frames.length;
  process.stdout.write(
    `${CLEAR_LINE}${DISABLE_WORD_WRAP}${currentLine} ${frames[frameIndex]}${ENABLE_WORD_WRAP}`,
  );
}
