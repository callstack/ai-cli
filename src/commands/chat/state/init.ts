import { createApp, loggingPlugin, type Message } from '@callstack/byorg-core';
import { type ConfigFile } from '../../../config-file.js';
import { DEFAULT_SYSTEM_PROMPT } from '../../../default-config.js';
import type { ResponseStyle } from '../../../engine/providers/config.js';
import type { PromptOptions } from '../prompt-options.js';
import { getDefaultProviderInfo, resolveProviderInfoFromOption } from '../providers.js';
import { filterOutApiKey, handleInputFile } from '../utils.js';
import { useChatState, type ChatMessage, type ChatState } from './state.js';

export function initChatState(
  options: PromptOptions,
  configFile: ConfigFile,
  initialPrompt: string,
) {
  const providerInfo = options.provider
    ? resolveProviderInfoFromOption(options.provider)
    : getDefaultProviderInfo(configFile);

  const providerFileConfig = configFile.providers[providerInfo.name];
  if (!providerFileConfig) {
    throw new Error(`Provider config not found: ${providerInfo.name}.`);
  }

  const modelOrAlias = options.model ?? providerFileConfig.model;
  const model = modelOrAlias
    ? (providerInfo.modelAliases[modelOrAlias] ?? modelOrAlias)
    : providerInfo.defaultModel;

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
      role: 'program',
      level: 'debug',
      content: `Resolved model alias "${modelOrAlias}" to "${model}".`,
    });
  }

  outputMessages.push({
    role: 'program',
    level: 'debug',
    content: `Loaded config: ${JSON.stringify(providerConfig, filterOutApiKey, 2)}`,
  });

  if (options.file) {
    const {
      systemPrompt: fileSystemPrompt,
      costWarning,
      costInfo,
    } = handleInputFile(options.file, providerConfig, providerInfo);

    providerConfig.systemPrompt += `\n\n${fileSystemPrompt}`;

    if (costWarning) {
      outputMessages.push({ role: 'program', level: 'warning', content: costWarning });
    } else if (costInfo) {
      outputMessages.push({ role: 'program', level: 'info', content: costInfo });
    }
  }

  if (initialPrompt) {
    contextMessages.push({ role: 'user', content: initialPrompt });
    outputMessages.push({ role: 'user', content: initialPrompt });
  }

  const app = createApp({
    chatModel: providerInfo.getChatModel(providerConfig),
    systemPrompt: () => providerConfig.systemPrompt,
    plugins: [loggingPlugin],
  });

  const state: ChatState = {
    activeView: null,
    provider: providerInfo,
    providerConfig,
    contextMessages,
    chatMessages: outputMessages,
    verbose: options.verbose ?? false,
    shouldExit: false,
    stream: options.stream ?? true,
    app,
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
