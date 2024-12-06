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

export async function readUserInput(): Promise<string> {
  let answer = '';
  while (!answer.trim()) {
    answer = await rl.question(`${texts.userLabel} `);
  }

  return answer;
}

let interruptHandler: (() => void) | undefined;

export function setInterruptHandler(handler: () => void) {
  interruptHandler = handler;
}
