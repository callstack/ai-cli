import { create } from 'zustand';
import { type ConfigFile } from '../../config-file.js';
import type { ProviderConfig, ResponseStyle } from '../../engine/providers/config.js';
import type { Provider } from '../../engine/providers/provider.js';
import type { Message, ModelResponse, ModelUsage } from '../../engine/inference.js';
import type { PromptOptions } from './types.js';
import { getDefaultProvider, resolveProviderFromOption } from './providers.js';
import { handleInputFile } from './utils.js';

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

export function initChatState(
  options: PromptOptions,
  configFile: ConfigFile,
  initialPrompt: string,
) {
  useChatState.setState(() => {
    const provider = options.provider
      ? resolveProviderFromOption(options.provider)
      : getDefaultProvider(configFile);

    const providerFileConfig = configFile.providers[provider.name];
    if (!providerFileConfig) {
      throw new Error(`Provider config not found: ${provider.name}.`);
    }

    const providerConfig = {
      model: options.model ?? providerFileConfig.model,
      apiKey: providerFileConfig.apiKey,
      systemPrompt: providerFileConfig.systemPrompt,
      responseStyle: getResponseStyle(options),
    };

    const contextMessages: Message[] = [];
    const outputMessages: ChatMessage[] = [];

    if (options.file) {
      const { systemMessage, costWarning, costInfo } = handleInputFile(
        options.file,
        providerConfig,
        provider,
      );

      contextMessages.push(systemMessage);
      if (costWarning) {
        outputMessages.push({ type: 'program', level: 'warning', text: costWarning });
      } else if (costInfo) {
        outputMessages.push({ type: 'program', level: 'info', text: costInfo });
      }
    }

    if (initialPrompt) {
      contextMessages.push({ role: 'user', content: initialPrompt });
      outputMessages.push({ type: 'user', text: initialPrompt });
    }

    return {
      isInitialized: true,
      provider,
      providerConfig,
      contextMessages,
      chatMessages: outputMessages,
      verbose: options.verbose,
    };
  });
}

export function addLocalUserMessage(text: string) {
  useChatState.setState((state: ChatState) => {
    return {
      chatMessages: [...state.chatMessages, { type: 'user', text }],
    };
  });
}

export function addUserMessage(text: string) {
  useChatState.setState((state: ChatState) => {
    return {
      contextMessages: [...state.contextMessages, { role: 'user', content: text }],
      chatMessages: [...state.chatMessages, { type: 'user', text }],
    };
  });
}

export function addLocalAiMessage(text: string) {
  useChatState.setState((state: ChatState) => {
    return {
      chatMessages: [...state.chatMessages, { type: 'ai', text }],
    };
  });
}

export function addAiResponse(response: ModelResponse) {
  useChatState.setState((state: ChatState) => {
    const outputMessages = {
      type: 'ai',
      text: response.message.content,
      responseTime: response.responseTime,
      usage: response.usage,
    } as const;

    return {
      contextMessages: [...state.contextMessages, response.message],
      chatMessages: [...state.chatMessages, outputMessages],
    };
  });
}

export function addProgramMessage(text: string, level: MessageLevel = 'info') {
  useChatState.setState((state: ChatState) => {
    return {
      chatMessages: [...state.chatMessages, { type: 'program', level, text }],
    };
  });
}

export function forgetContextMessages() {
  useChatState.setState(() => {
    return {
      contextMessages: [],
    };
  });
}

export function setActiveView(activeView: 'info' | 'help' | null) {
  useChatState.setState(() => {
    return {
      activeView,
    };
  });
}

export function setVerbose(verbose: boolean) {
  useChatState.setState(() => {
    return {
      verbose,
    };
  });
}

export function setShouldExit(shouldExit: boolean) {
  useChatState.setState(() => {
    return {
      shouldExit,
    };
  });
}

function getResponseStyle(options: PromptOptions): ResponseStyle {
  if (options.creative) {
    return 'creative';
  }
  if (options.precise) {
    return 'precise';
  }

  return 'default';
}
