import * as React from 'react';
import { render } from 'ink';
import { parseConfigFile } from '../../config-file.js';
import { RESPONSE_STYLE_CREATIVE, RESPONSE_STYLE_PRECISE } from '../../default-config.js';
import type { Message } from '../../engine/inference.js';
import * as output from '../../output.js';
import { ChatInterface, type ChatSession } from './ui/prompt-ui.js';
import type { PromptOptions, SessionContext } from './types.js';
import { getDefaultProvider, handleInputFile, resolveProviderFromOption } from './utils.js';

export async function run(initialPrompt: string, options: PromptOptions) {
  try {
    const session = await createSession(options, initialPrompt);
    render(<ChatInterface session={session} />);
  } catch (error) {
    output.clearLine();
    output.outputError(error);
    process.exit(1);
  }
}

function createSession(options: PromptOptions, initialPrompt?: string): SessionContext {
  const configFile = parseConfigFile();

  const provider = options.provider
    ? resolveProviderFromOption(options.provider)
    : getDefaultProvider(configFile);

  const initialConfig = configFile.providers[provider.name];
  if (!initialConfig) {
    throw new Error(`Provider config not found: ${provider.name}.`);
  }

  let style = {};
  const chatSession: ChatSession = {
    messages: [],
    displayItems: [],
  };

  if (options.creative && options.precise) {
    chatSession.displayItems.push({
      type: 'warning',
      text: 'You set both creative and precise response styles, falling back to default',
    });
  } else {
    if (options.creative) {
      style = RESPONSE_STYLE_CREATIVE;
    }
    if (options.precise) {
      style = RESPONSE_STYLE_PRECISE;
    }
  }

  const messages: Message[] = [];

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
      chatSession.displayItems.push({
        type: 'warning',
        text: costWarning,
      });
    }
    if (costInfo) {
      chatSession.displayItems.push({
        type: 'info',
        text: costInfo,
      });
    }
  }

  if (initialPrompt) {
    chatSession.messages.push({
      role: 'user',
      content: initialPrompt,
    });
    chatSession.displayItems.push({
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
    chatSession,
  };
}
