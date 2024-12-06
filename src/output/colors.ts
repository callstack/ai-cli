import chalk from 'chalk';

export const colors = {
  assistant: '#8CBFFA',
  //   initPrompt: '#8CBFFA',
  //   focusIndicator: '#9BE491',
  //   assistant: '#8CBFFA',
  //   user: 'white',
  //   error: 'red',
  warning: 'yellowBright',
  //   info: 'gray',
  //   verbose: 'gray',
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
