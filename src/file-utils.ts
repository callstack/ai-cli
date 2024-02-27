import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { format } from 'date-fns';
import type { CommandContext } from './commands/prompt/commands';

const CHATS_SAVE_DIRECTORY = '~/ai-chats';

const formatMessage = (message: string) => {
  const base = message.split(' ', 5).join(' ');
  return base.replace(/[/\\:*?"<>|]/g, '_');
};

export const getDefaultFileName = (context: CommandContext) => {
  const currentDate = new Date();
  const firstMessagePart = formatMessage(context.messages[0]?.content ?? '');

  return `${format(currentDate, 'yyyy-MM-dd HH-mm')} ${firstMessagePart}`;
};

export const getUniqueFileName = (filePath: string) => {
  const { name, ext, dir } = path.parse(filePath);
  const extension = ext === '' ? '.txt' : ext;

  if (fs.existsSync(`${dir}/${name}${extension}`)) {
    let numerator = 1;
    // Case when -1 exists, we increase as long as we find a free numerator
    while (fs.existsSync(`${dir}/${name}-${numerator}${extension}`)) {
      numerator++;
    }
    return `${dir}/${name}-${numerator}${extension}`;
  } else {
    return `${dir}/${name}${extension}`;
  }
};

export function getConversationStoragePath() {
  const chatsSaveDirectory = CHATS_SAVE_DIRECTORY.replace('~', os.homedir());

  if (fs.existsSync(chatsSaveDirectory)) {
    return chatsSaveDirectory;
  } else {
    fs.mkdirSync(chatsSaveDirectory);
    return chatsSaveDirectory;
  }
}
