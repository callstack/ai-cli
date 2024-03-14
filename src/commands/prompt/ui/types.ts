import type { Message, ModelUsage } from '../../../engine/inference.js';

export interface ChatState {
  contextMessages: Message[];
  items: ChatItem[];
}

export type ChatItem = MessageItem | ProgramOutputItem;

export interface MessageItem {
  type: 'message';
  message: Message;
  responseTime?: number;
  usage?: ModelUsage;
  cost?: number;
}

export interface ProgramOutputItem {
  type: 'warning' | 'info';
  text?: string;
}
