import { create } from 'zustand';
import type { Application, AssistantResponse, Message, UserMessage } from '@callstack/byorg-core';
import type { ProviderConfig } from '../../../engine/providers/config.js';
import type { Provider } from '../../../engine/providers/provider.js';

export interface ChatState {
  provider: Provider;
  providerConfig: ProviderConfig;
  contextMessages: Message[];
  chatMessages: ChatMessage[];
  activeView: ActiveView;
  verbose: boolean;
  shouldExit: boolean;
  stream: boolean;
  app: Application;
}

export type ChatMessage = UserMessage | AssistantResponse | ProgramOutput;

export interface ProgramOutput {
  role: 'program';
  content: string;
  level: MessageLevel;
}

export type MessageLevel = 'debug' | 'info' | 'warning' | 'error';

type ActiveView = 'info' | 'help' | null;

// @ts-expect-error lazy init
const initialState: ChatState = {};

export const useChatState = create<ChatState>(() => initialState);
