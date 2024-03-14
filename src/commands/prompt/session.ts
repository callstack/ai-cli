import { parseConfigFile } from '../../config-file.js';
import {
  RESPONSE_STYLE_CREATIVE,
  RESPONSE_STYLE_DEFAULT,
  RESPONSE_STYLE_PRECISE,
} from '../../default-config.js';
import type { Message } from '../../engine/inference.js';
import type { ProviderConfig } from '../../engine/providers/config.js';
import type { Provider } from '../../engine/providers/provider.js';
import { getDefaultProvider, resolveProviderFromOption } from './providers.js';
import type { PromptOptions } from './types.js';
import type { ChatState } from './ui/types.js';
import { handleInputFile } from './utils.js';

export interface Session {
  provider: Provider;
  config: ProviderConfig;
  state: ChatState;
  options: PromptOptions;
}

export function createSession(options: PromptOptions, initialPrompt?: string): Session {
  const configFile = parseConfigFile();

  const provider = options.provider
    ? resolveProviderFromOption(options.provider)
    : getDefaultProvider(configFile);

  const initialConfig = configFile.providers[provider.name];
  if (!initialConfig) {
    throw new Error(`Provider config not found: ${provider.name}.`);
  }

  let responseStyle = RESPONSE_STYLE_DEFAULT;

  const chatState: ChatState = {
    contextMessages: [],
    items: [],
  };

  if (options.creative && options.precise) {
    chatState.items.push({
      type: 'warning',
      text: 'You set both creative and precise response styles, falling back to default',
    });
  } else {
    if (options.creative) {
      responseStyle = RESPONSE_STYLE_CREATIVE;
    }
    if (options.precise) {
      responseStyle = RESPONSE_STYLE_PRECISE;
    }
  }

  const messages: Message[] = [];

  const config = {
    model: options.model ?? initialConfig.model,
    apiKey: initialConfig.apiKey,
    systemPrompt: initialConfig.systemPrompt,
    ...responseStyle,
  };

  if (options.file) {
    const { fileContextPrompt, costWarning, costInfo } = handleInputFile(
      options.file,
      config,
      provider,
    );

    messages.push(fileContextPrompt);
    if (costWarning) {
      chatState.items.push({
        type: 'warning',
        text: costWarning,
      });
    }
    if (costInfo) {
      chatState.items.push({
        type: 'info',
        text: costInfo,
      });
    }
  }

  if (initialPrompt) {
    chatState.contextMessages.push({
      role: 'user',
      content: initialPrompt,
    });
    chatState.items.push({
      type: 'message',
      message: {
        role: 'user',
        content: initialPrompt,
      },
    });
  }

  return {
    config,
    provider,
    options,
    state: chatState,
  };
}
