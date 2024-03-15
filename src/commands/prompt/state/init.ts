import { type ConfigFile } from '../../../config-file.js';
import type { ResponseStyle } from '../../../engine/providers/config.js';
import type { Message } from '../../../engine/inference.js';
import type { PromptOptions } from '../prompt-options.js';
import { getDefaultProvider, resolveProviderFromOption } from '../providers.js';
import { handleInputFile } from '../utils.js';
import { useChatState, type ChatMessage, type ChatState } from './state.js';

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

    const state: ChatState = {
      activeView: null,
      provider,
      providerConfig,
      contextMessages,
      chatMessages: outputMessages,
      verbose: options.verbose,
      shouldExit: false,
    };

    return state;
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
