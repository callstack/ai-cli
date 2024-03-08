import { parseConfigFile } from '../../config-file.js';
import { RESPONSE_STYLE_CREATIVE, RESPONSE_STYLE_PRECISE } from '../../default-config.js';
import type { Message } from '../../engine/inference.js';
import type { ProviderConfig } from '../../engine/providers/config.js';
import type { Provider } from '../../engine/providers/provider.js';
import { renderChatInterface } from '../../interface/chat/index.js';
import * as output from '../../output.js';
import type { PromptOptions, SessionContext, SessionFeedback } from './types.js';
import { getDefaultProvider, handleInputFile, resolveProviderFromOption } from './utils.js';

export async function run(initialPrompt: string, options: PromptOptions) {
  try {
    const session = await createSession(options, initialPrompt);
    renderChatInterface(session);
  } catch (error) {
    output.clearLine();
    output.outputError(error);
    process.exit(1);
  }
}

async function createSession(
  options: PromptOptions,
  initialPrompt?: string,
): Promise<SessionContext> {
  const configFile = await parseConfigFile();

  const provider = options.provider
    ? resolveProviderFromOption(options.provider)
    : getDefaultProvider(configFile);

  const initialConfig = configFile.providers[provider.name];
  if (!initialConfig) {
    throw new Error(`Provider config not found: ${provider.name}.`);
  }

  let style = {};
  const sessionFeedback: SessionFeedback = {};

  if (options.creative && options.precise) {
    sessionFeedback.stylesWarning =
      'You set both creative and precise response styles, falling back to default';
  } else {
    if (options.creative) {
      style = RESPONSE_STYLE_CREATIVE;
    }
    if (options.precise) {
      style = RESPONSE_STYLE_PRECISE;
    }
  }

  const messages: Message[] = [];

  if (initialPrompt) {
    messages.push({
      role: 'user',
      content: initialPrompt,
    });
  }

  const config = {
    model: options.model ?? initialConfig.model,
    apiKey: initialConfig.apiKey,
    systemPrompt: initialConfig.systemPrompt,
    ...style,
  };

  if (options.file) {
    const { fileContextPrompt, costWarning, costInfo } = handleInputFile(
      options.file,
      config,
      provider,
    );
    messages.push(fileContextPrompt);
    if (costWarning) {
      sessionFeedback.fileCostWarning = costWarning;
    }
    if (costInfo) {
      sessionFeedback.fileCostInfo = costInfo;
    }
  }

  return {
    config,
    provider,
    messages,
    sessionFeedback,
  };
}

export async function getChatCompletion(
  provider: Provider,
  config: ProviderConfig,
  messages: Message[],
) {
  const response = await provider.getChatCompletion(config, messages);

  return response;
}
