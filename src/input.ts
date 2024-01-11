import * as readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

export function inputLine(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.setPrompt(prompt);
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}
