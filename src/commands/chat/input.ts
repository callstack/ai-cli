import readline from 'readline';
import { texts } from './texts.js';

let rl: readline.promises.Interface;

export function initInput() {
  rl = readline.promises.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('SIGINT', () => {
    if (interruptHandler) {
      interruptHandler();
    }

    rl.close();
  });
}

export function closeInput() {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  rl.close();
}

export function readUserInput(): Promise<string> {
  return new Promise((resolve) => {
    let input = '';
    let timeout: NodeJS.Timeout | null = null;

    process.stdout.write(`${texts.userLabel} `);

    const onLine = (line: string) => {
      // Clear any existing timeout
      if (timeout) {
        clearTimeout(timeout);
      }

      input += line + '\n';

      // Set new timeout to resolve after 250ms of no input
      timeout = setTimeout(() => {
        if (input.trim()) {
          rl.off('line', onLine);
          resolve(input.trim());
        }
      }, 250);
    };

    rl.on('line', onLine);
  });
}

let interruptHandler: (() => void) | undefined;

export function setInterruptHandler(handler: () => void) {
  interruptHandler = handler;
}
