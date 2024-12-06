import chalk from 'chalk';

export const colors = {
  assistant: '#8CBFFA',
  warning: 'yellowBright',
};

export function colorAssistant(...text: unknown[]) {
  return chalk.hex(colors.assistant)(...text);
}

export function colorError(...text: unknown[]) {
  return chalk.red(...text);
}

export function colorWarning(...text: unknown[]) {
  return chalk.hex(colors.warning)(...text);
}

export function colorVerbose(...text: unknown[]) {
  return chalk.dim(...text);
}
