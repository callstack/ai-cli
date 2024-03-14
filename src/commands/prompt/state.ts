import { create } from 'zustand';
import { type ConfigFile } from '../../config-file.js';
import type { ProviderConfig, ResponseStyle } from '../../engine/providers/config.js';
import type { Provider } from '../../engine/providers/provider.js';
import type { AiMessage, Message, ModelResponse, UserMessage } from '../../engine/inference.js';
import type { ChatItem, ProgramOutputItem } from './ui/types.js';
import type { PromptOptions } from './types.js';
import { getDefaultProvider, resolveProviderFromOption } from './providers.js';

export interface ChatState {
  provider: Provider;
  providerConfig: ProviderConfig;
  contextMessages: Message[];
  outputMessages: ChatItem[];
  verbose: boolean;
}

export const uninitializedState: ChatState = {
  // @ts-expect-error: lazy initialization
  provider: undefined,
  // @ts-expect-error: lazy initialization
  providerConfig: undefined,
  // @ts-expect-error: lazy initialization
  contextMessages: undefined,
  // @ts-expect-error: lazy initialization
  outputMessages: undefined,
  // @ts-expect-error: lazy initialization
  verbose: undefined,
};

export const useChatState = create<ChatState>(() => uninitializedState);

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

    const contextMessages: Message[] = initialPrompt
      ? [{ role: 'user', content: initialPrompt }]
      : [];

    return {
      isInitialized: true,
      provider,
      providerConfig,
      contextMessages,
      outputMessages: [],
      verbose: options.verbose,
    };
  });
}

export function addUserMessage(message: UserMessage) {
  useChatState.setState((state: ChatState) => {
    return {
      contextMessages: [...state.contextMessages, message],
      outputMessages: [...state.outputMessages, { type: 'message', message }],
    };
  });
}

export function addAiResponse(response: ModelResponse) {
  useChatState.setState((state: ChatState) => {
    const message: AiMessage = { role: 'assistant', content: response.messageText ?? '' };
    const outputMessages = {
      type: 'message',
      message,
      responseTime: response.responseTime,
      usage: response.usage,
    } as const;

    return {
      contextMessages: [...state.contextMessages, message],
      outputMessages: [...state.outputMessages, outputMessages],
    };
  });
}

export function addProgramMessage(message: ProgramOutputItem) {
  useChatState.setState((state: ChatState) => {
    return {
      outputMessages: [...state.outputMessages, message],
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

export function setVerbose(verbose: boolean) {
  useChatState.setState(() => {
    return {
      verbose,
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
