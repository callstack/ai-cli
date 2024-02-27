import * as fs from 'fs';
import type { CommandContext } from './commands/prompt/commands';

const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1; //Month from 0 to 11
  const year = date.getFullYear();

  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};

const formatTime = (date: Date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();

  return `${hours}-${minutes < 10 ? '0' + minutes : minutes}`;
};

const formatMessage = (message: string) => {
  const base = message.split(' ', 5).join(' ');
  return base.replace(/\/.*\\/i, '');
};

export const getDefaultFileName = (context: CommandContext) => {
  const currentDate = new Date();
  const today = formatDate(currentDate);
  const time = formatTime(currentDate);
  const firstMessagePart = formatMessage(context.messages[0]?.content ?? '');

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
