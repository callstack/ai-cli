import { type ConfigFile } from '../../../config-file.js';
import { DEFAULT_SYSTEM_PROMPT } from '../../../default-config.js';
import type { ResponseStyle } from '../../../engine/providers/config.js';
import type { Message } from '../../../engine/inference.js';
import type { PromptOptions } from '../prompt-options.js';
import { getDefaultProvider, resolveProviderFromOption } from '../providers.js';
import { filterOutApiKey, handleInputFile } from '../utils.js';
import { useChatState, type ChatMessage, type ChatState } from './state.js';

export function initChatState(
  options: PromptOptions,
  configFile: ConfigFile,
  initialPrompt: string,
) {
  const provider = options.provider
    ? resolveProviderFromOption(options.provider)
    : getDefaultProvider(configFile);

  const providerFileConfig = configFile.providers[provider.name];
  if (!providerFileConfig) {
    throw new Error(`Provider config not found: ${provider.name}.`);
  }

  const modelOrAlias = options.model ?? providerFileConfig.model;
  const model = modelOrAlias
    ? (provider.modelAliases[modelOrAlias] ?? modelOrAlias)
    : provider.defaultModel;

  const systemPrompt = providerFileConfig.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;

  const providerConfig = {
    apiKey: providerFileConfig.apiKey,
    model,
    systemPrompt,
    responseStyle: getResponseStyle(options),
  };

  const contextMessages: Message[] = [];
  const outputMessages: ChatMessage[] = [];

  if (modelOrAlias != null && modelOrAlias !== model) {
    outputMessages.push({
      type: 'program',
      level: 'debug',
      text: `Resolved model alias "${modelOrAlias}" to "${model}".`,
    });
  }

  outputMessages.push({
    type: 'program',
    level: 'debug',
    text: `Loaded config: ${JSON.stringify(providerConfig, filterOutApiKey, 2)}`,
  });

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
    verbose: options.verbose ?? false,
    shouldExit: false,
    stream: options.stream ?? true,
  };

  useChatState.setState(state);
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
