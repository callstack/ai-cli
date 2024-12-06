import ora from 'ora';
import { texts } from './texts.js';

const spinner = ora({
  prefixText: texts.assistantLabel,
  discardStdin: false,
});
spinner.color = 'cyan';

export function spinnerStart(text: string) {
  spinner.prefixText = text;
  spinner.start();
}

export function spinnerUpdate(text: string) {
  spinner.prefixText = text;
}

export function spinnerStop(text?: string) {
  spinner.stopAndPersist({
    symbol: '',
    prefixText: text ? `${text}` : '',
  });
}
