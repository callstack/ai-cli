import { create } from 'zustand';
import type { ProviderConfig } from '../../../engine/providers/config.js';
import type { Provider } from '../../../engine/providers/provider.js';
import type { Message, ModelUsage } from '../../../engine/inference.js';

export interface ChatState {
  provider: Provider;
  providerConfig: ProviderConfig;
  contextMessages: Message[];
  chatMessages: ChatMessage[];
  activeView: ActiveView;
  verbose: boolean;
  shouldExit: boolean;
}

export type ChatMessage = UserChatMessage | AiChatMessage | ProgramChatMessage;

export interface UserChatMessage {
  type: 'user';
  text: string;
}

export interface AiChatMessage {
  type: 'ai';
  text: string;
  responseTime?: number;
  usage?: ModelUsage;
  cost?: number;
  data?: unknown;
}

export type MessageLevel = 'debug' | 'info' | 'warning' | 'error';

export interface ProgramChatMessage {
  type: 'program';
  level: MessageLevel;
  text: string;
}

type ActiveView = 'info' | 'help' | null;

// @ts-expect-error lazy init
const initialState: ChatState = {};

export const useChatState = create<ChatState>(() => initialState);
