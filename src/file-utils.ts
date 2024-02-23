import * as fs from 'fs';
import type { CommandContext } from './commands/prompt/commands';

export const getDefaultFileName = (context: CommandContext) => {
  const currentDate = new Date();
  const today = currentDate.toISOString().split('T')[0];
  const time = `${currentDate.getHours()}\u2236${currentDate.getMinutes()}`;
  const firstMessagePart = context.messages[0]?.content.split(' ', 5).join(' ');
  return `${today} ${time} ${firstMessagePart}`;
};

export const getUniqueFileName = (filePath: string, fileExtension: string = '') => {
  const appendix = `${fileExtension ? '.' + fileExtension : ''}`;
  if (fs.existsSync(`${filePath}.txt`)) {
    let numerator = 1;
    // Case when -1 exists, we increase as long as we find a free numerator
    while (fs.existsSync(`${filePath}-${numerator}${appendix}`)) numerator++;
    return `${filePath}-${numerator}${appendix}`;
  } else {
    return `${filePath}${appendix}`;
  }
};
