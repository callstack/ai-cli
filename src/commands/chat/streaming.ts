import cliSpinners from 'cli-spinners';

const spinner = cliSpinners.dots;

let currentLine = '';
let outputtedLines: string[] = [];

let intervalRef: NodeJS.Timeout | undefined;
let frameIndex = 0;

export function streamingStart(text: string) {
  const lines = text.trimEnd().split('\n');
  const readyLines = lines.slice(0, -1);
  outputtedLines = readyLines;
  if (readyLines.length > 0) {
    process.stdout.write(`${clearLine}${readyLines.join('\n')}\n`);
  }

  currentLine = lines[lines.length - 1];
  startSpinner();
}

export function streamingUpdate(text: string) {
  const lines = text.trimEnd().split('\n');
  const readyLines = lines.slice(outputtedLines.length, -1);
  if (readyLines.length > 0) {
    process.stdout.write(`${clearLine}${readyLines.join('\n')}\n`);
  }

  outputtedLines = lines.slice(0, -1);
  currentLine = lines[lines.length - 1];
  // Will update spinner in the next frame
}

export function streamingFinish(text: string) {
  clearInterval(intervalRef);
  const lines = text.trimEnd().split('\n');
  const readyLines = lines.slice(outputtedLines.length);
  process.stdout.write(`${clearLine}${readyLines.join('\n')}\n`);
}

export function streamingClear() {
  clearInterval(intervalRef);
}

export const clearLine = '\u001b[0G\u001b[2K';
export const disableWordWrap = '\u001b[?7l';
export const enableWordWrap = '\u001b[?7h';

export function startSpinner(): void {
  if (intervalRef) {
    clearInterval(intervalRef);
  }

  intervalRef = setInterval(spin, spinner.interval).unref();
}

function spin(): void {
  frameIndex = (frameIndex + 1) % spinner.frames.length;
  const spinnerFrame = spinner.frames[frameIndex];
  process.stdout.write(
    `${clearLine}${disableWordWrap}${currentLine} ${spinnerFrame}${enableWordWrap}`,
  );
}
