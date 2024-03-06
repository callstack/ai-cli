import * as readline from 'readline';

export function inputLine(prompt: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.setPrompt(prompt);
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}
