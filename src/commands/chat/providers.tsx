import { ConfigFile } from '../../config-file.js';
import { DEFAULT_SYSTEM_PROMPT } from '../../default-config.js';
import { ProviderConfig, ResponseStyle } from '../../engine/providers/config.js';
import {
  getProviderByName,
  type Provider,
  type ProviderName,
} from '../../engine/providers/provider.js';
import { output, outputVerbose, outputWarning } from './output.js';
import openAi from '../../engine/providers/open-ai.js';
import anthropic from '../../engine/providers/anthropic.js';
import perplexity from '../../engine/providers/perplexity.js';
import mistral from '../../engine/providers/mistral.js';
import { CliOptions } from './cli-options.js';
import { filterOutApiKey, handleInputFile } from './utils.js';

export const providerOptionMapping: Record<string, Provider> = {
  openai: openAi,
  anthropic,
  anth: anthropic,
  perplexity,
  pplx: perplexity,
  mistral,
};

export const providerOptions = Object.keys(providerOptionMapping);

export function resolveProviderFromOption(providerOption: string): Provider {
  const provider = providerOptionMapping[providerOption];
  if (!provider) {
    throw new Error(`Provider not found: ${providerOption}.`);
  }

  return provider;
}

export function getDefaultProvider(config: ConfigFile): Provider {
  const providerNames = Object.keys(config.providers) as ProviderName[];
  const providerName = providerNames ? providerNames[0] : undefined;

  if (!providerName) {
    throw new Error('No providers found in "~/.airc.json" file.');
  }

  return getProviderByName(providerName)!;
}

let provider: Provider | null = null;
let providerConfig: ProviderConfig | null = null;

export function getProvider() {
  if (provider == null) {
    throw new Error('Provider not initalized');
  }

  return provider;
}

export function getProviderConfig() {
  if (providerConfig == null) {
    throw new Error('ProviderConfig not initalized');
  }

  return providerConfig;
}

export function initProvider(options: CliOptions, configFile: ConfigFile) {
  provider = options.provider
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

  providerConfig = {
    apiKey: providerFileConfig.apiKey,
    model,
    systemPrompt,
    stream: options.stream ?? true,
    responseStyle: getResponseStyle(options),
  };

  outputVerbose(`Loaded config: ${JSON.stringify(providerConfig, filterOutApiKey, 2)}\n`);
  outputVerbose(`Using model: ${model}\n`);

  if (options.file) {
    const {
      systemPrompt: fileSystemPrompt,
      costWarning,
      costInfo,
    } = handleInputFile(options.file, getProviderConfig(), provider);

    providerConfig.systemPrompt += `\n\n${fileSystemPrompt}`;
    if (costWarning) {
      outputWarning(costWarning);
    } else if (costInfo) {
      output(costInfo);
    }
  }
}

function getResponseStyle(options: CliOptions): ResponseStyle {
  if (options.creative) {
    return 'creative';
  }
  if (options.precise) {
    return 'precise';
  }

  return 'default';
}
