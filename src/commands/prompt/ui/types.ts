import type { Message, ModelUsage } from '../../../engine/inference.js';

export interface ChatState {
  contextMessages: Message[];
  items: DisplayItem[];
  showLoader: boolean;
}

export type DisplayItem = DisplayMessageItem | DisplayOutputItem;

export interface DisplayMessageItem {
  type: 'message';
  message: Message;
  usage?: ModelUsage;
  cost?: number;
  responseTime?: number;
}

export interface DisplayOutputItem {
  type: 'warning' | 'info';
  text?: string;
}
